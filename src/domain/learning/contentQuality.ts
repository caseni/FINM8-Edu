import { MICRO_LESSON_CATALOG } from './catalog';
import type { AudienceCopy, LocalizedText, MicroLesson } from './types';

export interface EnglishCoverageReport {
  readonly totalLessons: number;
  readonly completeLessons: number;
  readonly incompleteLessons: readonly {
    readonly lessonId: string;
    readonly title: string;
    readonly missingFields: readonly string[];
  }[];
}

export interface AssessmentQualityIssue {
  readonly lessonId: string;
  readonly itemId: string;
  readonly kind: 'quiz' | 'practical_task';
  readonly reason: 'low_signal_binary' | 'trivial_distractor';
  readonly labels: readonly string[];
}

export interface AssessmentQualityReport {
  readonly lessonCount: number;
  readonly questionCount: number;
  readonly practicalTaskCount: number;
  readonly lowSignalIssues: readonly AssessmentQualityIssue[];
  readonly duplicatePromptGroups: readonly {
    readonly prompt: string;
    readonly questionIds: readonly string[];
  }[];
}

export interface CurriculumOverlapReport {
  readonly lessonCount: number;
  readonly conceptReuseGroups: readonly {
    readonly conceptKey: string;
    readonly lessonIds: readonly string[];
  }[];
  readonly exactSurfaceGroups: readonly {
    readonly field: 'title' | 'learning_objective' | 'takeaway';
    readonly text: string;
    readonly lessonIds: readonly string[];
  }[];
  readonly nearDuplicatePairs: readonly {
    readonly lessonIdA: string;
    readonly lessonIdB: string;
    readonly titleA: string;
    readonly titleB: string;
    readonly similarity: number;
    readonly sharesConceptKey: boolean;
  }[];
}

export interface VisualCoverageReport {
  readonly totalLessons: number;
  readonly lessonsWithContentVisual: number;
  readonly lessonsWithQuestionVisual: number;
  readonly lessonsWithAnyVisualAnchor: number;
  readonly lessonsWithoutAnyVisualAnchor: readonly {
    readonly lessonId: string;
    readonly title: string;
  }[];
}

export interface ContentQualitySnapshot {
  readonly english: EnglishCoverageReport;
  readonly assessment: AssessmentQualityReport;
  readonly curriculumOverlap: CurriculumOverlapReport;
  readonly visualCoverage: VisualCoverageReport;
}

const GENERIC_BINARY_LABELS = new Set([
  'evet',
  'hayır',
  'her zaman',
  'asla',
  'imkânsızdır',
  'genellikle evet',
  'genellikle hayır',
]);

const TRIVIAL_DISTRACTOR_PATTERNS = [
  /grafik rengi/i,
  /mumun yeşil/i,
  /logo/i,
];

const OVERLAP_STOP_WORDS = new Set([
  'ama', 'ancak', 'bile', 'bir', 'biri', 'bunu', 'bu', 'da', 'de', 'daha', 'değil', 'diye',
  'gibi', 'hem', 'her', 'için', 'ile', 'ise', 'mı', 'mi', 'mu', 'mü', 'nasıl', 'neden', 'ne',
  'olan', 'olarak', 'olabilir', 'olur', 'tek', 've', 'veya', 'ya', 'yalnız', 'yerine',
]);

function normalizeText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/[“”\"'’`´.,!?;:()]/g, '')
    .replace(/\s+/g, ' ');
}

function hasEnglishText(value: LocalizedText | undefined): boolean {
  return Boolean(value?.en?.trim());
}

function hasEnglishAudienceCopy(value: AudienceCopy | undefined): boolean {
  if (!value) {
    return true;
  }

  return hasEnglishText(value.normal) && (!value.pro || hasEnglishText(value.pro));
}

function collectMissingEnglishFields(lesson: MicroLesson): string[] {
  const missing: string[] = [];

  if (!hasEnglishText(lesson.title)) {
    missing.push('title.en');
  }
  if (!hasEnglishText(lesson.learningObjective)) {
    missing.push('learningObjective.en');
  }
  if (!hasEnglishText(lesson.takeaway)) {
    missing.push('takeaway.en');
  }
  if (!hasEnglishText(lesson.contentVersion.riskDisclaimer)) {
    missing.push('contentVersion.riskDisclaimer.en');
  }

  lesson.contentBlocks.forEach((block) => {
    if ('copy' in block && !hasEnglishAudienceCopy(block.copy)) {
      missing.push(`${block.id}.copy.en`);
    }
    if ('title' in block && block.title && !hasEnglishAudienceCopy(block.title)) {
      missing.push(`${block.id}.title.en`);
    }
    if ('items' in block) {
      block.items.forEach((item, index) => {
        if (!hasEnglishAudienceCopy(item)) {
          missing.push(`${block.id}.items.${index}.en`);
        }
      });
    }
    if ('alt' in block && !hasEnglishText(block.alt)) {
      missing.push(`${block.id}.alt.en`);
    }
    if ('caption' in block && block.caption && !hasEnglishAudienceCopy(block.caption)) {
      missing.push(`${block.id}.caption.en`);
    }
  });

  if (!hasEnglishAudienceCopy(lesson.practicalTask.prompt)) {
    missing.push(`${lesson.practicalTask.id}.prompt.en`);
  }
  lesson.practicalTask.choices?.forEach((choice) => {
    if (!hasEnglishText(choice.label)) {
      missing.push(`${lesson.practicalTask.id}.${choice.id}.label.en`);
    }
  });

  lesson.quiz.questions.forEach((question) => {
    if (!hasEnglishText(question.prompt)) {
      missing.push(`${question.id}.prompt.en`);
    }
    if (!hasEnglishText(question.explanation)) {
      missing.push(`${question.id}.explanation.en`);
    }
    if (question.visual && !hasEnglishText(question.visual.alt)) {
      missing.push(`${question.id}.visual.alt.en`);
    }
    question.options.forEach((option) => {
      if (!hasEnglishText(option.label)) {
        missing.push(`${question.id}.${option.id}.label.en`);
      }
    });
  });

  return missing;
}

function assessmentIssue(
  lessonId: string,
  itemId: string,
  kind: AssessmentQualityIssue['kind'],
  labels: readonly string[],
): AssessmentQualityIssue | undefined {
  const normalizedLabels = labels.map(normalizeText);
  const genericCount = normalizedLabels.filter((label) => GENERIC_BINARY_LABELS.has(label)).length;
  if (genericCount >= 2) {
    return { lessonId, itemId, kind, reason: 'low_signal_binary', labels };
  }

  if (labels.some((label) => TRIVIAL_DISTRACTOR_PATTERNS.some((pattern) => pattern.test(label)))) {
    return { lessonId, itemId, kind, reason: 'trivial_distractor', labels };
  }

  return undefined;
}

function tokenSet(value: string): Set<string> {
  const tokens = normalizeText(value)
    .replace(/[^a-z0-9çğıöşü\s-]/gi, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !OVERLAP_STOP_WORDS.has(token));

  return new Set(tokens);
}

function overlapFingerprint(lesson: MicroLesson): string {
  return [lesson.title.tr, lesson.learningObjective.tr, lesson.takeaway.tr].join(' ');
}

function jaccardSimilarity(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;

  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }

  const union = left.size + right.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function exactGroups(
  field: CurriculumOverlapReport['exactSurfaceGroups'][number]['field'],
  pick: (lesson: MicroLesson) => string,
): CurriculumOverlapReport['exactSurfaceGroups'][number][] {
  const groups = new Map<string, { text: string; lessonIds: string[] }>();

  for (const lesson of MICRO_LESSON_CATALOG) {
    const text = pick(lesson);
    const normalized = normalizeText(text);
    const group = groups.get(normalized);
    if (group) group.lessonIds.push(lesson.id);
    else groups.set(normalized, { text, lessonIds: [lesson.id] });
  }

  return Array.from(groups.values())
    .filter((group) => group.lessonIds.length > 1)
    .map((group) => ({ field, ...group }));
}

export function getEnglishCoverageReport(): EnglishCoverageReport {
  const incompleteLessons = MICRO_LESSON_CATALOG.map((lesson) => ({
    lessonId: lesson.id,
    title: lesson.title.tr,
    missingFields: collectMissingEnglishFields(lesson),
  })).filter((lesson) => lesson.missingFields.length > 0);

  return {
    totalLessons: MICRO_LESSON_CATALOG.length,
    completeLessons: MICRO_LESSON_CATALOG.length - incompleteLessons.length,
    incompleteLessons,
  };
}

export function getAssessmentQualityReport(): AssessmentQualityReport {
  const lowSignalIssues: AssessmentQualityIssue[] = [];
  const promptGroups = new Map<string, { prompt: string; questionIds: string[] }>();
  let questionCount = 0;

  for (const lesson of MICRO_LESSON_CATALOG) {
    const taskLabels = (lesson.practicalTask.choices ?? []).map((choice) => choice.label.tr);
    const taskIssue = assessmentIssue(lesson.id, lesson.practicalTask.id, 'practical_task', taskLabels);
    if (taskIssue) lowSignalIssues.push(taskIssue);

    for (const question of lesson.quiz.questions) {
      questionCount += 1;
      const labels = question.options.map((option) => option.label.tr);
      const issue = assessmentIssue(lesson.id, question.id, 'quiz', labels);
      if (issue) lowSignalIssues.push(issue);

      const normalizedPrompt = normalizeText(question.prompt.tr);
      const current = promptGroups.get(normalizedPrompt);
      if (current) {
        current.questionIds.push(question.id);
      } else {
        promptGroups.set(normalizedPrompt, {
          prompt: question.prompt.tr,
          questionIds: [question.id],
        });
      }
    }
  }

  const duplicatePromptGroups = Array.from(promptGroups.values())
    .filter((group) => group.questionIds.length > 1)
    .sort((a, b) => b.questionIds.length - a.questionIds.length);

  return {
    lessonCount: MICRO_LESSON_CATALOG.length,
    questionCount,
    practicalTaskCount: MICRO_LESSON_CATALOG.length,
    lowSignalIssues,
    duplicatePromptGroups,
  };
}

export function getCurriculumOverlapReport(): CurriculumOverlapReport {
  const conceptGroups = new Map<string, string[]>();
  const tokenizedLessons = MICRO_LESSON_CATALOG.map((lesson) => ({
    lesson,
    tokens: tokenSet(overlapFingerprint(lesson)),
  }));

  for (const lesson of MICRO_LESSON_CATALOG) {
    const current = conceptGroups.get(lesson.conceptKey);
    if (current) current.push(lesson.id);
    else conceptGroups.set(lesson.conceptKey, [lesson.id]);
  }

  const nearDuplicatePairs: CurriculumOverlapReport['nearDuplicatePairs'][number][] = [];
  for (let leftIndex = 0; leftIndex < tokenizedLessons.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < tokenizedLessons.length; rightIndex += 1) {
      const left = tokenizedLessons[leftIndex];
      const right = tokenizedLessons[rightIndex];
      const similarity = jaccardSimilarity(left.tokens, right.tokens);
      if (similarity < 0.78) continue;

      let sharedTokenCount = 0;
      for (const token of left.tokens) {
        if (right.tokens.has(token)) sharedTokenCount += 1;
      }
      if (sharedTokenCount < 4) continue;

      nearDuplicatePairs.push({
        lessonIdA: left.lesson.id,
        lessonIdB: right.lesson.id,
        titleA: left.lesson.title.tr,
        titleB: right.lesson.title.tr,
        similarity: Number(similarity.toFixed(3)),
        sharesConceptKey: left.lesson.conceptKey === right.lesson.conceptKey,
      });
    }
  }

  return {
    lessonCount: MICRO_LESSON_CATALOG.length,
    conceptReuseGroups: Array.from(conceptGroups.entries())
      .filter(([, lessonIds]) => lessonIds.length > 1)
      .map(([conceptKey, lessonIds]) => ({ conceptKey, lessonIds }))
      .sort((a, b) => b.lessonIds.length - a.lessonIds.length),
    exactSurfaceGroups: [
      ...exactGroups('title', (lesson) => lesson.title.tr),
      ...exactGroups('learning_objective', (lesson) => lesson.learningObjective.tr),
      ...exactGroups('takeaway', (lesson) => lesson.takeaway.tr),
    ],
    nearDuplicatePairs: nearDuplicatePairs
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 50),
  };
}

export function getVisualCoverageReport(): VisualCoverageReport {
  let lessonsWithContentVisual = 0;
  let lessonsWithQuestionVisual = 0;
  let lessonsWithAnyVisualAnchor = 0;
  const lessonsWithoutAnyVisualAnchor: VisualCoverageReport['lessonsWithoutAnyVisualAnchor'][number][] = [];

  for (const lesson of MICRO_LESSON_CATALOG) {
    const hasContentVisual = lesson.contentBlocks.some((block) => block.kind === 'visual');
    const hasQuestionVisual = lesson.quiz.questions.some((question) => Boolean(question.visual));
    const hasAnyVisualAnchor = hasContentVisual || hasQuestionVisual;

    if (hasContentVisual) lessonsWithContentVisual += 1;
    if (hasQuestionVisual) lessonsWithQuestionVisual += 1;
    if (hasAnyVisualAnchor) lessonsWithAnyVisualAnchor += 1;
    else lessonsWithoutAnyVisualAnchor.push({ lessonId: lesson.id, title: lesson.title.tr });
  }

  return {
    totalLessons: MICRO_LESSON_CATALOG.length,
    lessonsWithContentVisual,
    lessonsWithQuestionVisual,
    lessonsWithAnyVisualAnchor,
    lessonsWithoutAnyVisualAnchor,
  };
}

export function getContentQualitySnapshot(): ContentQualitySnapshot {
  return {
    english: getEnglishCoverageReport(),
    assessment: getAssessmentQualityReport(),
    curriculumOverlap: getCurriculumOverlapReport(),
    visualCoverage: getVisualCoverageReport(),
  };
}
