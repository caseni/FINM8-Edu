import { microLessonSchema } from '../../schemas';
import type { LocalizedText, MicroLesson } from '../../types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface AssessmentCopyOverride {
  readonly taskChoices?: OptionCopyMap;
  readonly questionOptions?: Readonly<Record<string, OptionCopyMap>>;
}

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const CHART_FOUNDATION_ASSESSMENT_OVERRIDES: Readonly<
  Record<string, AssessmentCopyOverride>
> = {
  'lesson.chart.candles.001': {
    taskChoices: {
      'next-candle': copy(
        'Yalnız mum gövdesinin üst ve alt kenarları',
        'Only the top and bottom edges of the candle body',
      ),
    },
    questionOptions: {
      'question.bir-mum-bize-ne-soyler.1': {
        b: copy(
          'Açılış, kapanış, hacim ve spread',
          'Open, close, volume, and spread',
        ),
        c: copy(
          'Bid, ask, en yüksek ve en düşük',
          'Bid, ask, high, and low',
        ),
      },
      'question.bir-mum-bize-ne-soyler.2': {
        c: copy(
          'Dönemin en yüksek ile en düşük arasındaki tüm fiyat aralığını',
          'The full price range between the period high and low',
        ),
      },
    },
  },
  'lesson.chart.timeframes.001': {
    questionOptions: {
      'question.zaman-dilimi-neyi-degistirir.1': {
        b: copy(
          'Grafikte aynı anda kaç mum görüneceğini',
          'How many candles are visible on screen at one time',
        ),
        c: copy(
          'Fiyatın sonraki hareket yönünü',
          'The direction of the next price move',
        ),
      },
      'question.zaman-dilimi-neyi-degistirir.2': {
        b: copy(
          'Üst zaman dilimi alt zaman dilimini geçersiz kıldığı için',
          'Because a higher timeframe invalidates the lower timeframe',
        ),
      },
      'question.zaman-dilimi-neyi-degistirir.3': {
        c: copy(
          'Yalnız son mumun kapanış fiyatı',
          'Only the closing price of the latest candle',
        ),
      },
    },
  },
  'lesson.chart.trend.001': {
    taskChoices: {
      'fixed-target': copy(
        'Tek bir hareketli ortalamanın yönü',
        'The direction of a single moving average',
      ),
    },
    questionOptions: {
      'question.trend-yon-mu-yapi-mi.1': {
        c: copy(
          'Fiyatın yalnız son iki mumda yükselmesi',
          'Price rising only during the last two candles',
        ),
      },
      'question.trend-yon-mu-yapi-mi.2': {
        c: copy(
          'Üst zaman dilimi her zaman daha doğru olduğu için',
          'Because the higher timeframe is always more correct',
        ),
      },
    },
  },
  'lesson.chart.support-resistance.001': {
    questionOptions: {
      'question.destek-direnc-bolgedir.1': {
        b: copy(
          'Tepkiler yalnız son kapanış fiyatında oluştuğu için',
          'Because reactions form only at the latest closing price',
        ),
        c: copy(
          'Her testin aynı tek fiyata değmesi gerektiği için',
          'Because every test must touch the exact same single price',
        ),
      },
      'question.destek-direnc-bolgedir.3': {
        c: copy(
          'Yalnız bölgenin kaç kez test edildiğine bakmak',
          'Looking only at how many times the zone has been tested',
        ),
      },
    },
  },
};

export function normalizeChartFoundationAssessmentQuality(
  lesson: MicroLesson,
): MicroLesson {
  const override = CHART_FOUNDATION_ASSESSMENT_OVERRIDES[lesson.id];
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
