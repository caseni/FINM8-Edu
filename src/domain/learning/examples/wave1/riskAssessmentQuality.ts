import { microLessonSchema } from '../../schemas';
import type { LocalizedText, MicroLesson } from '../../types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface AssessmentCopyOverride {
  readonly taskChoices?: OptionCopyMap;
  readonly questionOptions?: Readonly<Record<string, OptionCopyMap>>;
}

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const RISK_ASSESSMENT_OVERRIDES: Readonly<
  Record<string, AssessmentCopyOverride>
> = {
  'lesson.risk.uncertainty.001': {
    taskChoices: {
      guaranteed: copy(
        'Geçmişte uzun süre zarar görülmemiş olması',
        'A long period without losses in the past',
      ),
    },
    questionOptions: {
      'question.risk-belirsizlik-kayip.1': {
        c: copy(
          'Yalnız fiyat oynaklığını',
          'Only price volatility',
        ),
      },
      'question.risk-belirsizlik-kayip.2': {
        b: copy(
          'Her kaybı önceden tahmin edip tamamen önlemek',
          'Predicting and completely preventing every loss in advance',
        ),
        c: copy(
          'Kazanç ihtimalini mümkün olduğunca yükseltmek',
          'Maximizing the chance of profit as much as possible',
        ),
      },
      'question.risk-belirsizlik-kayip.3': {
        b: copy(
          'Geçmiş sonuçların ortalamasını bilmek',
          'Knowing the average of past outcomes',
        ),
        c: copy(
          'Olası sonuçlardan yalnız en kötüsünü seçmek',
          'Selecting only the worst possible outcome',
        ),
      },
    },
  },
  'lesson.risk.volatility.001': {
    taskChoices: {
      logo: copy(
        'Fiyat seviyesi daha yüksek olan',
        'The one with the higher nominal price level',
      ),
    },
    questionOptions: {
      'question.volatilite-once-risktir.1': {
        b: copy(
          'Fiyat hareketinin yönünü',
          'The direction of price movement',
        ),
        c: copy(
          'İşlem hacmini tek başına',
          'Trading volume by itself',
        ),
      },
      'question.volatilite-once-risktir.2': {
        b: copy(
          'Yalnız kazanç ihtimali',
          'Only the possibility of gains',
        ),
        c: copy(
          'Fiyat yönüne dair kesinlik',
          'Certainty about price direction',
        ),
      },
      'question.volatilite-once-risktir.3': {
        b: copy(
          'Evet; miktar aynıysa parasal risk de aynıdır',
          'Yes; if the amount is the same, the cash risk is the same',
        ),
        c: copy(
          'Yalnız giriş fiyatı değişirse risk değişir',
          'Risk changes only when the entry price changes',
        ),
      },
    },
  },
  'lesson.risk.reward.001': {
    taskChoices: {
      color: copy(
        'Hedefin stop mesafesinden kaç kat uzak olduğu',
        'How many times farther the target is than the stop distance',
      ),
      guarantee: copy(
        'Oranın son birkaç işlemde yüksek görünmüş olması',
        'The ratio having looked high in the last few trades',
      ),
    },
    questionOptions: {
      'question.risk-getiri-tek-basina-yetmez.1': {
        b: copy(
          'Hedefe ulaşma olasılığını',
          'The probability of reaching the target',
        ),
        c: copy(
          'Pozisyonun hesap büyüklüğüne oranını',
          'The position size relative to the account',
        ),
      },
      'question.risk-getiri-tek-basina-yetmez.3': {
        b: copy(
          'Yalnız hedef fiyatını daha uzağa yazmak',
          'Only placing the target price farther away',
        ),
        c: copy(
          'Grafikte kullanılan zaman aralığını değiştirmek',
          'Changing the timeframe used on the chart',
        ),
      },
    },
  },
  'lesson.risk.stop-orders.001': {
    taskChoices: {
      profit: copy(
        'Tetiklenince otomatik olarak limit emrine dönüşür',
        'It automatically becomes a limit order when triggered',
      ),
    },
    questionOptions: {
      'question.stop-emri-garanti-midir.1': {
        b: copy('Limit emrine', 'A limit order'),
        c: copy(
          'Stop fiyatında bekleyen pasif emre',
          'A passive order waiting at the stop price',
        ),
      },
      'question.stop-emri-garanti-midir.2': {
        b: copy(
          'Tetiklenince piyasa emrine dönüşmesi',
          'Becoming a market order when triggered',
        ),
        c: copy(
          'Stop fiyatının gerçekleşme fiyatını sabitlemesi',
          'The stop price fixing the execution price',
        ),
      },
      'question.stop-emri-garanti-midir.3': {
        c: copy(
          'Yalnız piyasa sakin ve likit olduğunda',
          'Only when the market is calm and liquid',
        ),
      },
    },
  },
};

export function normalizeRiskAssessmentQuality(
  lesson: MicroLesson,
): MicroLesson {
  const override = RISK_ASSESSMENT_OVERRIDES[lesson.id];
  if (!override) return lesson;

  const practicalTask =
    override.taskChoices && lesson.practicalTask.choices
      ? {
          ...lesson.practicalTask,
          choices: lesson.practicalTask.choices.map((choice) => ({
            ...choice,
            label: override.taskChoices?.[choice.id] ?? choice.label,
          })),
        }
      : lesson.practicalTask;

  const questions = lesson.quiz.questions.map((question) => {
    const optionOverrides = override.questionOptions?.[question.id];
    if (!optionOverrides) return question;

    return {
      ...question,
      options: question.options.map((option) => ({
        ...option,
        label: optionOverrides[option.id] ?? option.label,
      })),
    };
  });

  return microLessonSchema.parse({
    ...lesson,
    practicalTask,
    quiz: {
      ...lesson.quiz,
      questions,
    },
  });
}
