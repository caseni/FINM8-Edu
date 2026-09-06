import { microLessonSchema } from './schemas';
import type { MicroLesson } from './types';

export function normalizeAcademyExpansionAssessmentResidualQuality(lesson: MicroLesson): MicroLesson {
  if (lesson.id !== 'lesson.risk.loss-recovery.001') return lesson;

  return microLessonSchema.parse({
    ...lesson,
    quiz: {
      ...lesson.quiz,
      questions: lesson.quiz.questions.map((question) =>
        question.id === 'question.buyuk-kayip-neden-zor-toparlanir.2'
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === question.correctOptionId
                  ? {
                      ...option,
                      label: {
                        tr: 'Hayır; toparlanma daha düşük sermaye tabanından başlar',
                        en: 'No; the same percentage gain cannot recover the smaller post-loss base',
                      },
                    }
                  : option,
              ),
            }
          : question,
      ),
    },
  });
}
