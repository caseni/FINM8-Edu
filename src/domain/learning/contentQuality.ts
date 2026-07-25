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
