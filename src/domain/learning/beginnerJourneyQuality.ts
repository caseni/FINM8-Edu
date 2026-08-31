import { BEGINNER_SECTION_IDS, BEGINNER_SECTIONS } from './beginnerJourney';
import { BEGINNER_MARKET_CODE_INFOGRAPHIC_SPEC_BY_LESSON_ID } from './beginnerCodeInfographicSpecs';
import { MICRO_LESSON_CATALOG } from './catalog';
import type { MicroLesson } from './types';

export interface BeginnerJourneyQualityIssue {
  readonly lessonId: string;
  readonly reason:
    | 'missing_lesson'
    | 'section_lesson_count'
    | 'task_choice_count'
    | 'task_evidence_mismatch'
    | 'quiz_question_count'
    | 'quiz_option_count'
    | 'advanced_jargon'
    | 'clarity_copy_budget'
    | 'clarity_repetition'
    | 'missing_infographic_spec'
    | 'infographic_spec_quality';
  readonly detail: string;
}

export interface BeginnerJourneyQualityReport {
  readonly sectionCount: number;
  readonly lessonCount: number;
  readonly expectedLessonCount: number;
  readonly issues: readonly BeginnerJourneyQualityIssue[];
}

const EXPECTED_SECTION_COUNT = 4;
const EXPECTED_LESSONS_PER_SECTION = 6;
const EXPECTED_QUIZ_QUESTIONS = 3;
const MIN_OPTIONS = 3;

const ADVANCED_JARGON: readonly RegExp[] = [
  /\bBOS\b/i,
  /\bCHoCH\b/i,
  /\bSMC\b/i,
  /\bICT\b/i,
  /\bFVG\b/i,
  /\bMSS\b/i,
  /order block/i,
  /liquidity sweep/i,
  /liquidity grab/i,
  /inducement/i,
  /mitigation/i,
  /displacement/i,
  /\bDCF\b/i,
  /\bWACC\b/i,
  /Sharpe/i,
  /Sortino/i,
];

const MARKET_COPY_LIMITS = {
  learningObjective: 16,
  prompt: 14,
  explanation: 40,
  misconception: 24,
  takeaway: 12,
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

function validateMarketClarity(lesson: MicroLesson, issues: BeginnerJourneyQualityIssue[]): void {
  if (!BEGINNER_SECTIONS.markets.lessonIds.includes(lesson.id)) return;

  const spec = BEGINNER_MARKET_CODE_INFOGRAPHIC_SPEC_BY_LESSON_ID.get(lesson.id);
  if (!spec) {
    issues.push({
      lessonId: lesson.id,
      reason: 'missing_infographic_spec',
      detail: 'beginner market lesson must have a code-infographic teaching brief before fallback visuals are accepted',
    });
  } else {
    if (
      wordCount(spec.teachingGoal.tr) > 16 ||
      spec.textBudget.headingWords > 8 ||
      spec.textBudget.cardWords > 6 ||
      spec.textBudget.ruleWords > 12
    ) {
      issues.push({
        lessonId: lesson.id,
        reason: 'infographic_spec_quality',
        detail: 'infographic brief exceeds the visual text budget or teaching-goal budget',
      });
    }
  }

  const prompt = normalBlockCopy(lesson, 'prompt');
  const explanation = normalBlockCopy(lesson, 'explanation');
  const misconception = normalBlockCopy(lesson, 'misconception');
  const surfaces = [
    ['learningObjective', lesson.learningObjective.tr, MARKET_COPY_LIMITS.learningObjective],
    ['prompt', prompt, MARKET_COPY_LIMITS.prompt],
    ['explanation', explanation, MARKET_COPY_LIMITS.explanation],
    ['misconception', misconception, MARKET_COPY_LIMITS.misconception],
    ['takeaway', lesson.takeaway.tr, MARKET_COPY_LIMITS.takeaway],
  ] as const;

  for (const [field, value, limit] of surfaces) {
    const count = wordCount(value);
    if (count > limit) {
      issues.push({
        lessonId: lesson.id,
        reason: 'clarity_copy_budget',
        detail: `${field} has ${count} words; beginner-market budget is ${limit}`,
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

function beginnerVisibleText(lesson: MicroLesson): string {
  const chunks: string[] = [
    lesson.title.tr,
    lesson.learningObjective.tr,
    lesson.takeaway.tr,
    lesson.practicalTask.prompt.normal.tr,
    ...((lesson.practicalTask.choices ?? []).map((choice) => choice.label.tr)),
  ];

  for (const block of lesson.contentBlocks) {
    if ('copy' in block) chunks.push(block.copy.normal.tr);
    if ('title' in block && block.title) chunks.push(block.title.normal.tr);
    if ('items' in block) chunks.push(...block.items.map((item) => item.normal.tr));
    if ('caption' in block && block.caption) chunks.push(block.caption.normal.tr);
  }

  for (const question of lesson.quiz.questions) {
    chunks.push(question.prompt.tr, question.explanation.tr);
    chunks.push(...question.options.map((option) => option.label.tr));
  }

  return chunks.join(' ');
}

export function getBeginnerJourneyQualityReport(): BeginnerJourneyQualityReport {
  const catalogById = new Map(MICRO_LESSON_CATALOG.map((lesson) => [lesson.id, lesson] as const));
  const issues: BeginnerJourneyQualityIssue[] = [];
  const beginnerLessonIds = BEGINNER_SECTION_IDS.flatMap((sectionId) => {
    const section = BEGINNER_SECTIONS[sectionId];
    if (section.lessonIds.length !== EXPECTED_LESSONS_PER_SECTION) {
      issues.push({
        lessonId: `section:${sectionId}`,
        reason: 'section_lesson_count',
        detail: `expected ${EXPECTED_LESSONS_PER_SECTION} lessons, found ${section.lessonIds.length}`,
      });
    }
    return [...section.lessonIds];
  });

  for (const lessonId of beginnerLessonIds) {
    const lesson = catalogById.get(lessonId);
    if (!lesson) {
      issues.push({ lessonId, reason: 'missing_lesson', detail: 'lesson id is not present in the catalog' });
      continue;
    }

    validateMarketClarity(lesson, issues);

    const taskChoices = lesson.practicalTask.choices ?? [];
    if (taskChoices.length < MIN_OPTIONS) {
      issues.push({
        lessonId,
        reason: 'task_choice_count',
        detail: `practical task has ${taskChoices.length} choices; expected at least ${MIN_OPTIONS}`,
      });
    }

    const taskChoiceIds = new Set(taskChoices.map((choice) => choice.id));
    const evidence = lesson.practicalTask.expectedEvidence;
    if (
      evidence.length === 0 ||
      new Set(evidence).size !== evidence.length ||
      evidence.some((evidenceId) => !taskChoiceIds.has(evidenceId))
    ) {
      issues.push({
        lessonId,
        reason: 'task_evidence_mismatch',
        detail: 'expectedEvidence must be non-empty, unique, and reference only practical-task choices',
      });
    }

    if (lesson.quiz.questions.length !== EXPECTED_QUIZ_QUESTIONS) {
      issues.push({
        lessonId,
        reason: 'quiz_question_count',
        detail: `quiz has ${lesson.quiz.questions.length} questions; expected ${EXPECTED_QUIZ_QUESTIONS}`,
      });
    }

    for (const question of lesson.quiz.questions) {
      if (question.options.length < MIN_OPTIONS) {
        issues.push({
          lessonId,
          reason: 'quiz_option_count',
          detail: `${question.id} has ${question.options.length} options; expected at least ${MIN_OPTIONS}`,
        });
      }
    }

    const visibleText = beginnerVisibleText(lesson);
    for (const jargon of ADVANCED_JARGON) {
      const match = visibleText.match(jargon);
      if (!match) continue;
      issues.push({
        lessonId,
        reason: 'advanced_jargon',
        detail: `beginner-visible content contains advanced term: ${match[0]}`,
      });
    }
  }

  return {
    sectionCount: BEGINNER_SECTION_IDS.length,
    lessonCount: beginnerLessonIds.length,
    expectedLessonCount: EXPECTED_SECTION_COUNT * EXPECTED_LESSONS_PER_SECTION,
    issues,
  };
}
