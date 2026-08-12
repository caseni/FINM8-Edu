import { microLessonSchema } from './schemas';
import type { MicroLesson } from './types';

const TARGET_QUESTION_ID = 'question.tahvil-fiyati-ve-getirisi.1';

export function normalizeAcademyMarketsPromptQuality(lesson: MicroLesson): MicroLesson {
  let changed = false;
  const questions = lesson.quiz.questions.map((question) => {
    if (question.id !== TARGET_QUESTION_ID) return question;
    changed = true;
    return {
      ...question,
      prompt: {
        tr: 'Tahvil alırken yatırımcı en temelde ne yapmış olur?',
        en: 'What does an investor most basically do when buying a bond?',
      },
    };
  });

  if (!changed) return lesson;
  return microLessonSchema.parse({
    ...lesson,
    quiz: {
      ...lesson.quiz,
      questions,
    },
  });
}
