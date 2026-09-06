import { ACADEMY_TRACK_IDS, ACADEMY_TRACKS } from './academyTracks';
import { MICRO_LESSON_CATALOG } from './catalog';
import type { MicroLesson } from './types';

export interface AcademyJourneyQualityIssue {
  readonly lessonId: string;
  readonly reason:
    | 'track_lesson_count'
    | 'duplicate_lesson_id'
    | 'missing_lesson'
    | 'clarity_copy_budget'
    | 'clarity_repetition';
  readonly detail: string;
}

export interface AcademyJourneyQualityReport {
  readonly trackCount: number;
  readonly lessonCount: number;
  readonly expectedLessonCount: number;
  readonly issues: readonly AcademyJourneyQualityIssue[];
}

const EXPECTED_TRACK_COUNT = 10;
const EXPECTED_LESSONS_PER_TRACK = 12;

const ACADEMY_COPY_LIMITS = {
  learningObjective: 16,
  prompt: 20,
  explanation: 45,
  misconception: 16,
  takeaway: 15,
} as const;

function wordCount(value: string): number {
  const clean = value.trim().replace(/\s+/g, ' ');
  return clean ? clean.split(' ').length : 0;
}

function normalizedTokens(value: string): string[] {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/[^a-z0-9çğıöşü\s]/gi, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
}

function sharedTokenRatio(left: string, right: string): number {
  const leftTokens = normalizedTokens(left);
  const rightTokens = normalizedTokens(right);
  if (leftTokens.length < 5 || rightTokens.length < 5) return 0;

  const rightSet = new Set(rightTokens);
  const shared = new Set(leftTokens.filter((token) => rightSet.has(token))).size;
  return shared / Math.min(new Set(leftTokens).size, new Set(rightTokens).size);
}

function normalBlockCopy(lesson: MicroLesson, kind: 'prompt' | 'explanation' | 'misconception'): string {
  const block = lesson.contentBlocks.find((candidate) => candidate.kind === kind);
  return block && 'copy' in block ? block.copy.normal.tr : '';
}

function validateAcademyClarity(lesson: MicroLesson, issues: AcademyJourneyQualityIssue[]): void {
  const prompt = normalBlockCopy(lesson, 'prompt');
  const explanation = normalBlockCopy(lesson, 'explanation');
  const misconception = normalBlockCopy(lesson, 'misconception');

  const surfaces = [
    ['learningObjective', lesson.learningObjective.tr, ACADEMY_COPY_LIMITS.learningObjective],
    ['prompt', prompt, ACADEMY_COPY_LIMITS.prompt],
    ['explanation', explanation, ACADEMY_COPY_LIMITS.explanation],
    ['misconception', misconception, ACADEMY_COPY_LIMITS.misconception],
    ['takeaway', lesson.takeaway.tr, ACADEMY_COPY_LIMITS.takeaway],
  ] as const;

  for (const [field, value, limit] of surfaces) {
    const count = wordCount(value);
    if (count > limit) {
      issues.push({
        lessonId: lesson.id,
        reason: 'clarity_copy_budget',
        detail: `${field} has ${count} words; Academy budget is ${limit}`,
      });
    }
  }

  const repetitionPairs = [
    ['explanation', explanation, 'takeaway', lesson.takeaway.tr],
    ['misconception', misconception, 'takeaway', lesson.takeaway.tr],
  ] as const;

  for (const [leftName, left, rightName, right] of repetitionPairs) {
    const ratio = sharedTokenRatio(left, right);
    if (ratio >= 0.78) {
      issues.push({
        lessonId: lesson.id,
        reason: 'clarity_repetition',
        detail: `${leftName} and ${rightName} repeat too much of the same wording (overlap ${ratio.toFixed(2)})`,
      });
    }
  }
}

export function getAcademyJourneyQualityReport(): AcademyJourneyQualityReport {
  const catalogById = new Map(MICRO_LESSON_CATALOG.map((lesson) => [lesson.id, lesson] as const));
  const issues: AcademyJourneyQualityIssue[] = [];
  const academyLessonIds: string[] = [];

  for (const trackId of ACADEMY_TRACK_IDS) {
    const track = ACADEMY_TRACKS[trackId];
    if (track.lessonIds.length !== EXPECTED_LESSONS_PER_TRACK) {
      issues.push({
        lessonId: `track:${trackId}`,
        reason: 'track_lesson_count',
        detail: `expected ${EXPECTED_LESSONS_PER_TRACK} lessons, found ${track.lessonIds.length}`,
      });
    }
    academyLessonIds.push(...track.lessonIds);
  }

  const seenLessonIds = new Set<string>();
  for (const lessonId of academyLessonIds) {
    if (seenLessonIds.has(lessonId)) {
      issues.push({
        lessonId,
        reason: 'duplicate_lesson_id',
        detail: 'Academy lesson is routed from more than one school',
      });
      continue;
    }
    seenLessonIds.add(lessonId);

    const lesson = catalogById.get(lessonId);
    if (!lesson) {
      issues.push({
        lessonId,
        reason: 'missing_lesson',
        detail: 'Academy lesson id is not present in the catalog',
      });
      continue;
    }

    validateAcademyClarity(lesson, issues);
  }

  return {
    trackCount: ACADEMY_TRACK_IDS.length,
    lessonCount: academyLessonIds.length,
    expectedLessonCount: EXPECTED_TRACK_COUNT * EXPECTED_LESSONS_PER_TRACK,
    issues,
  };
}
