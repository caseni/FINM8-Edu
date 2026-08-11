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

function normalizeText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/[“”"'’`´.,!?;:()]/g, '')
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
