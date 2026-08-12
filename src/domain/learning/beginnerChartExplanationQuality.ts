import { microLessonSchema } from './schemas';
import type { LocalizedText, MicroLesson } from './types';

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const BEGINNER_CHART_EXPLANATION_OVERRIDES: Readonly<Record<string, LocalizedText>> = {
  'question.momentum-ne-anlatir.2': copy(
    'Fiyat hâlâ yukarı giderken hareketin hızı azalabilir; yön ile hız aynı şey değildir.',
    'Price can still rise while the move slows; direction and speed are not the same thing.',
  ),
  'question.hareketli-ortalama-ne-yapar.1': copy(
    'Hareketli ortalama yalnız geçmiş fiyat gözlemlerini kullanır; gelecekteki fiyatı önceden bilmez.',
    'A moving average uses only past price observations; it does not know future prices in advance.',
  ),
};

export function normalizeBeginnerChartExplanationQuality(lesson: MicroLesson): MicroLesson {
  let changed = false;
  const questions = lesson.quiz.questions.map((question) => {
    const explanation = BEGINNER_CHART_EXPLANATION_OVERRIDES[question.id];
    if (!explanation) return question;
    changed = true;
    return { ...question, explanation };
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
