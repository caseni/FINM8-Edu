import { microLessonSchema } from '../../schemas';
import type { LocalizedText, MicroLesson } from '../../types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface AssessmentCopyOverride {
  readonly taskChoices?: OptionCopyMap;
  readonly questionOptions?: Readonly<Record<string, OptionCopyMap>>;
}

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const MARKET_FOUNDATION_ASSESSMENT_OVERRIDES: Readonly<
  Record<string, AssessmentCopyOverride>
> = {
  'lesson.market.price-formation.001': {
    taskChoices: {
      company: copy(
        'En yüksek alış teklifinin, karşı taraftan satış kabulü olmadan işlem fiyatı sayılması',
        'Treating the highest buy offer as the trade price without a seller accepting it',
      ),
      last: copy(
        'Son işlem fiyatının, yeni alıcı ve satıcı eşleşmeden sonraki fiyatı belirlemesi',
        'Treating the last traded price as the next price before a new buyer and seller match',
      ),
    },
    questionOptions: {
      'question.fiyat-piyasada-nasil-olusur.1': {
        b: copy(
          'En yüksek alış teklifinin tek başına işlem fiyatı olması',
          'The highest buy offer becoming the trade price by itself',
        ),
        c: copy(
          'Son işlem fiyatının bir sonraki işlemin fiyatını belirlemesi',
          'The last traded price determining the price of the next trade',
        ),
      },
      'question.fiyat-piyasada-nasil-olusur.3': {
        b: copy(
          'Yeni emirlerin yalnız emir sayısını değiştirmesi, alış-satış dengesini değiştirmemesi',
          'New orders changing only the order count, not the buy-sell balance',
        ),
        c: copy(
          'Son fiyatın sabit kalması, yeni emirlerin yalnız toplam hacmi değiştirmesi',
          'The last price staying fixed while new orders change only total volume',
        ),
      },
    },
  },
  'lesson.market.liquidity.001': {
    taskChoices: {
      logo: copy(
        'Küçük emrin dar spread ve yeterli karşı emirle kolayca gerçekleştiği durumda',
        'When a small order executes easily with a narrow spread and enough opposing orders',
      ),
    },
    questionOptions: {
      'question.likidite-neden-onemlidir.1': {
        b: copy(
          'Bir günde toplam kaç adet işlem yapıldığını',
          'How many trades occur in total during a day',
        ),
        c: copy(
          'Fiyatın hangi yönde hareket edeceğini',
          'Which direction price will move',
        ),
      },
      'question.likidite-neden-onemlidir.3': {
        a: copy(
          'Evet; yüksek toplam hacim her emir büyüklüğünde yeterli karşı taraf olduğunu gösterir',
          'Yes; high total volume means there is enough opposing interest for every order size',
        ),
        c: copy(
          'Yalnız küçük emirlerde; büyük emirlerin fiyat etkisi likiditeyle ilgili değildir',
          'Only for small orders; the price impact of large orders is unrelated to liquidity',
        ),
      },
    },
  },
  'lesson.market.bid-ask.001': {
    taskChoices: {
      twohundred: copy('100', '100'),
    },
    questionOptions: {
      'question.bid-ask-spread-nedir.1': {
        c: copy('Gerçekleşmiş son işlem fiyatını', 'The last traded price'),
      },
      'question.bid-ask-spread-nedir.2': {
        c: copy('Gerçekleşmiş son işlem fiyatını', 'The last traded price'),
      },
    },
  },
  'lesson.market.order-types.001': {
    taskChoices: {
      none: copy('Stop emir', 'Stop order'),
    },
    questionOptions: {
      'question.piyasa-limit-stop-emirleri.1': {
        b: copy(
          'Fiyat sınırı koymadan piyasadaki karşı emirlerle eşleşmeye çalışmasını',
          'That it tries to match opposing orders in the market without setting a price limit',
        ),
        c: copy(
          'Limit emri gibi belirli bir fiyat koşulunu beklememesini',
          'That it does not wait for a specific price condition like a limit order',
        ),
      },
      'question.piyasa-limit-stop-emirleri.3': {
        c: copy(
          'Limit emrine dönüşür ve stop fiyatında beklemeye devam eder',
          'It becomes a limit order and continues waiting at the stop price',
        ),
      },
    },
  },
  'lesson.market.slippage.001': {
    taskChoices: {
      closed: copy(
        'Derin emir defterinde küçük piyasa emri',
        'A small market order in a deep order book',
      ),
    },
    questionOptions: {
      'question.gerceklesme-fiyati-kayma.1': {
        b: copy(
          'Son işlem fiyatı yeni emir gelene kadar geçerli kaldığı için',
          'Because the last traded price remains valid until a new order arrives',
        ),
        c: copy(
          'Son fiyat mevcut bid ile ask arasındaki orta nokta olduğu için',
          'Because the last price is the midpoint between the current bid and ask',
        ),
      },
      'question.gerceklesme-fiyati-kayma.2': {
        c: copy(
          'Dar spread ve yeterli emir derinliği',
          'A narrow spread and sufficient order-book depth',
        ),
      },
      'question.gerceklesme-fiyati-kayma.3': {
        b: copy(
          'Emrin daha hızlı gerçekleşmesi',
          'The order executing faster',
        ),
        c: copy(
          'Gerçekleşme fiyatının her zaman son fiyata eşit olması',
          'The execution price always equaling the last traded price',
        ),
      },
    },
  },
};

export function normalizeMarketFoundationAssessmentQuality(
  lesson: MicroLesson,
): MicroLesson {
  const override = MARKET_FOUNDATION_ASSESSMENT_OVERRIDES[lesson.id];
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
