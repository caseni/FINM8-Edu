import type { MicroLesson } from './types';

export interface LearningCatalogIntegrityReport {
  lessonCount: number;
  sourceCount: number;
  englishEditorialPendingLessonIds: string[];
}

function assertUnique(value: string, seen: Set<string>, label: string) {
  if (seen.has(value)) {
    throw new Error(`Learning catalog has duplicate ${label}: ${value}`);
  }
  seen.add(value);
}

export function validateLearningCatalog(
  lessons: readonly MicroLesson[]
): LearningCatalogIntegrityReport {
  const lessonIds = new Set<string>();
  const slugs = new Set<string>();
  const taskIds = new Set<string>();
  const quizIds = new Set<string>();
  const questionIds = new Set<string>();
  const sourceIds = new Set<string>();
  const conceptKeys = new Set(lessons.map((lesson) => lesson.conceptKey));
  const englishEditorialPendingLessonIds: string[] = [];

  for (const lesson of lessons) {
    assertUnique(lesson.id, lessonIds, 'lesson id');
    assertUnique(lesson.slug, slugs, 'lesson slug');
    assertUnique(lesson.practicalTask.id, taskIds, 'task id');
    assertUnique(lesson.quiz.id, quizIds, 'quiz id');

    for (const prerequisite of lesson.prerequisiteConceptKeys) {
      if (!conceptKeys.has(prerequisite)) {
        throw new Error(
          `Learning catalog prerequisite is unreachable: ${lesson.id} -> ${prerequisite}`
        );
      }
    }

    const contentOrders = new Set<number>();
    for (const block of lesson.contentBlocks) {
      if (contentOrders.has(block.order)) {
        throw new Error(
          `Learning lesson has duplicate content order: ${lesson.id} -> ${block.order}`
        );
      }
      contentOrders.add(block.order);
    }

    const taskChoiceIds = new Set(
      (lesson.practicalTask.choices ?? []).map((choice) => choice.id)
    );
    for (const evidenceId of lesson.practicalTask.expectedEvidence) {
      if (!taskChoiceIds.has(evidenceId)) {
        throw new Error(
          `Learning task expects a missing choice: ${lesson.practicalTask.id} -> ${evidenceId}`
        );
      }
    }

    if (lesson.quiz.passingScore < 0 || lesson.quiz.passingScore > 100) {
      throw new Error(`Learning quiz has invalid passing score: ${lesson.quiz.id}`);
    }

    for (const question of lesson.quiz.questions) {
      assertUnique(question.id, questionIds, 'question id');
      if (!question.options.some((option) => option.id === question.correctOptionId)) {
        throw new Error(
          `Learning question has a missing correct option: ${question.id}`
        );
      }
    }

    if (lesson.sources.length === 0) {
      throw new Error(`Learning lesson has no source: ${lesson.id}`);
    }
    for (const source of lesson.sources) {
      sourceIds.add(source.id);
      if (!source.title || !source.publisher || Number.isNaN(Date.parse(source.reviewedAt))) {
        throw new Error(`Learning lesson has invalid source metadata: ${lesson.id}`);
      }
    }

    const englishReady =
      Boolean(lesson.title.en) &&
      Boolean(lesson.learningObjective.en) &&
      Boolean(lesson.practicalTask.prompt.normal.en) &&
      lesson.quiz.questions.every(
        (question) =>
          Boolean(question.prompt.en) &&
          Boolean(question.explanation.en) &&
          question.options.every((option) => Boolean(option.label.en))
      );

    if (!englishReady) {
      englishEditorialPendingLessonIds.push(lesson.id);
    }
  }

  return {
    lessonCount: lessons.length,
    sourceCount: sourceIds.size,
    englishEditorialPendingLessonIds,
  };
}
