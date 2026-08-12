import { BEGINNER_SECTION_IDS, BEGINNER_SECTIONS } from './beginnerJourney';
import { MICRO_LESSON_CATALOG } from './catalog';
import type { MicroLesson } from './types';

export interface BeginnerJourneyQualityIssue {
  readonly lessonId: string;
  readonly reason:
    | 'missing_lesson'
    | 'section_lesson_count'
    | 'teaching_visual_count'
    | 'duplicate_teaching_visual'
    | 'task_choice_count'
    | 'task_evidence_mismatch'
    | 'quiz_question_count'
    | 'quiz_option_count'
    | 'advanced_jargon';
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
const MIN_TEACHING_VISUALS = 4;

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

    const teachingVisuals = lesson.contentBlocks.filter((block) => block.kind === 'visual');
    if (teachingVisuals.length < MIN_TEACHING_VISUALS) {
      issues.push({
        lessonId,
        reason: 'teaching_visual_count',
        detail: `expected at least ${MIN_TEACHING_VISUALS} teaching visuals, found ${teachingVisuals.length}`,
      });
    }

    const teachingVisualRefs = teachingVisuals.map((block) => block.assetRef);
    if (new Set(teachingVisualRefs).size !== teachingVisualRefs.length) {
      issues.push({
        lessonId,
        reason: 'duplicate_teaching_visual',
        detail: 'teaching visual asset refs must be unique within a beginner lesson',
      });
    }

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
