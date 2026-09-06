import { microLessonSchema } from './schemas';
import type { LocalizedText, MicroLesson } from './types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface ExpansionAssessmentOverride {
  readonly questionOptions?: Readonly<Record<string, OptionCopyMap>>;
  readonly taskChoices?: OptionCopyMap;
}

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const ACADEMY_EXPANSION_ASSESSMENT_OVERRIDES: Readonly<
  Record<string, ExpansionAssessmentOverride>
> = {
  'lesson.economy.labor-market.001': {
    taskChoices: {
      logo: copy('Ortalama ücret artışı', 'Average wage growth'),
    },
    questionOptions: {
      'question.issizlik-verisi-ne-anlatir.2': {
        a: copy(
          'Hayır; istihdam ve katılım gibi diğer göstergeler de gerekir',
          'No; other indicators such as employment and participation are also needed',
        ),
        b: copy(
          'Evet; işsizlik oranı tek başına işgücü piyasasını özetler',
          'Yes; the unemployment rate alone summarizes the labor market',
        ),
      },
    },
  },
  'lesson.economy.fiscal-policy.001': {
    questionOptions: {
      'question.maliye-politikasi-nedir.2': {
        a: copy(
          'Hayır; harcama türü ve ekonomik koşullar etkiyi değiştirebilir',
          'No; spending composition and economic conditions can change the effect',
        ),
        b: copy(
          'Evet; bütün kamu harcamaları ekonomiyi aynı ölçüde etkiler',
          'Yes; all government spending affects the economy by the same amount',
        ),
      },
      'question.maliye-politikasi-nedir.3': {
        b: copy(
          'Evet; ikisi de aynı kurum ve araçlarla yürütülür',
          'Yes; both are conducted by the same institutions using the same tools',
        ),
      },
    },
  },
  'lesson.economy.exchange-rates.001': {
    questionOptions: {
      'question.doviz-kuru-neden-degisir.2': {
        a: copy(
          'Hayır; faiz, enflasyon, risk ve sermaye akımları birlikte etkileyebilir',
          'No; rates, inflation, risk sentiment, and capital flows can all matter',
        ),
        b: copy(
          'Evet; kuru tek bir belirleyici açıklar',
          'Yes; a single factor explains the exchange rate',
        ),
      },
      'question.doviz-kuru-neden-degisir.3': {
        a: copy(
          'Hayır; ithalatçı, ihracatçı ve borçlu farklı etkilenebilir',
          'No; importers, exporters, and borrowers can be affected differently',
        ),
        b: copy(
          'Evet; kurdaki güçlenme herkese aynı yönde yansır',
          'Yes; currency appreciation affects everyone in the same direction',
        ),
      },
    },
  },
  'lesson.economy.productivity.001': {
    questionOptions: {
      'question.verimlilik-neden-onemlidir.3': {
        a: copy(
          'Hayır; daha fazla girdi kullanmak verimlilik artışı değildir',
          'No; using more input is not by itself a productivity gain',
        ),
      },
    },
  },
  'lesson.economy.indicators.001': {
    questionOptions: {
      'question.ekonomik-veri-nasil-okunur.1': {
        b: copy(
          'Yalnız önceki günün piyasa kapanışıyla',
          'Only with the previous day’s market close',
        ),
      },
      'question.ekonomik-veri-nasil-okunur.2': {
        a: copy(
          'Evet; revizyon geçmiş ekonomik tabloyu değiştirebilir',
          'Yes; a revision can change the picture of prior economic conditions',
        ),
      },
      'question.ekonomik-veri-nasil-okunur.3': {
        a: copy(
          'Hayır; beklenti, konumlanma ve diğer bağlam da gerekir',
          'No; expectations, positioning, and broader context are also needed',
        ),
      },
    },
  },
  'lesson.economy.real-nominal.001': {
    questionOptions: {
      'question.reel-ve-nominal-farki.3': {
        a: copy(
          'Evet; enflasyon nominal kazancı aşarsa reel getiri negatif olabilir',
          'Yes; real return can be negative when inflation exceeds the nominal gain',
        ),
        b: copy(
          'Hayır; nominal getiri pozitifse reel getiri de mutlaka pozitiftir',
          'No; a positive nominal return always means the real return is positive too',
        ),
      },
    },
  },
  'lesson.markets.crypto.001': {
    questionOptions: {
      'question.kripto-piyasasi-nasil-farklidir.1': {
        a: copy(
          'Hayır; işlem yeri ve emir derinliği platformlar arasında farklılaşabilir',
          'No; venue conditions and order-book depth can differ across platforms',
        ),
        b: copy(
          'Evet; 7/24 işlem bütün platformlarda aynı likiditeyi yaratır',
          'Yes; 24/7 trading creates identical liquidity across every venue',
        ),
      },
      'question.kripto-piyasasi-nasil-farklidir.3': {
        a: copy(
          'Hayır; spot ile perpetual ürünlerin finansman ve kaldıraç mekanikleri farklıdır',
          'No; spot and perpetual products have different financing and leverage mechanics',
        ),
        b: copy(
          'Evet; fiyat aynıysa ürün yapısı da aynıdır',
          'Yes; if the price matches, the product structure is the same',
        ),
      },
    },
  },
  'lesson.markets.sessions.001': {
    questionOptions: {
      'question.piyasa-seanslari-neden-onemlidir.1': {
        a: copy(
          'Evet; katılım ve emir derinliği saate göre değişebilir',
          'Yes; participation and order depth can vary by time of day',
        ),
        b: copy(
          'Hayır; piyasa açıksa likidite saatten etkilenmez',
          'No; if the market is open, liquidity is unaffected by time of day',
        ),
      },
      'question.piyasa-seanslari-neden-onemlidir.2': {
        b: copy(
          'Evet; piyasa açıkken spread gün boyu aynı kalır',
          'Yes; when the market is open, the spread stays the same all day',
        ),
      },
      'question.piyasa-seanslari-neden-onemlidir.3': {
        a: copy(
          'Hayır; bölgesel seanslar aktiviteyi gün içine eşitsiz dağıtır',
          'No; regional sessions make activity uneven across the day',
        ),
        b: copy(
          'Evet; forex gün boyunca aynı katılım düzeyine sahiptir',
          'Yes; forex has the same participation level throughout the day',
        ),
      },
    },
  },
  'lesson.markets.volume.001': {
    questionOptions: {
      'question.islem-hacmi-ne-anlatir.2': {
        a: copy(
          'Hayır; spread ve emir derinliği ayrıca değerlendirilir',
          'No; spreads and order-book depth still need separate assessment',
        ),
        b: copy(
          'Evet; yüksek hacim her zaman yüksek likidite demektir',
          'Yes; high volume always means high liquidity',
        ),
      },
      'question.islem-hacmi-ne-anlatir.3': {
        a: copy(
          'Hayır; hacim aktiviteyi gösterir, yönü garanti etmez',
          'No; volume shows activity but does not guarantee direction',
        ),
        b: copy(
          'Evet; hacim yükselirse fiyat yönü de kesinleşir',
          'Yes; higher volume makes the price direction certain',
        ),
      },
    },
  },
  'lesson.markets.liquidity-providers.001': {
    questionOptions: {
      'question.market-maker-ne-yapar.2': {
        a: copy(
          'Hayır; fiyat birçok katılımcı ve emrin etkileşimiyle oluşur',
          'No; price forms through the interaction of many participants and orders',
        ),
        b: copy(
          'Evet; market maker piyasa fiyatını tek başına belirler',
          'Yes; a market maker determines market price single-handedly',
        ),
      },
      'question.market-maker-ne-yapar.3': {
        a: copy(
          'Evet; risk ve envanter koşulları quote’ları değiştirebilir',
          'Yes; risk and inventory conditions can change quotes',
        ),
        b: copy(
          'Hayır; stresli piyasada quote’lar değişmez',
          'No; market-maker quotes do not change during stressed markets',
        ),
      },
    },
  },
  'lesson.markets.primary-secondary.001': {
    questionOptions: {
      'question.birincil-ve-ikincil-piyasa.3': {
        a: copy(
          'Hayır; ikincil işlem çoğunlukla yatırımcılar arasındadır',
          'No; a secondary-market transaction is generally between investors',
        ),
        b: copy(
          'Evet; her ikincil işlemde para doğrudan şirkete gider',
          'Yes; every secondary-market trade sends money directly to the company',
        ),
      },
    },
  },
  'lesson.markets.derivatives.001': {
    questionOptions: {
      'question.turev-urun-nedir.1': {
        b: copy(
          'Yalnız sözleşmenin işlem hacminden',
          'Only from the contract’s trading volume',
        ),
      },
      'question.turev-urun-nedir.2': {
        a: copy(
          'Hayır; futures ayrı vade, teminat ve sözleşme kurallarına sahiptir',
          'No; futures have separate maturity, margin, and contract rules',
        ),
        b: copy(
          'Evet; dayanakla aynı fiyatı izlediği için aynı üründür',
          'Yes; it is the same product because it tracks the underlying price',
        ),
      },
      'question.turev-urun-nedir.3': {
        b: copy(
          'Evet; türevlerin tek kullanım amacı spekülasyondur',
          'Yes; speculation is the only use for derivatives',
        ),
      },
    },
  },
};

export function normalizeAcademyExpansionAssessmentQuality(lesson: MicroLesson): MicroLesson {
  const override = ACADEMY_EXPANSION_ASSESSMENT_OVERRIDES[lesson.id];
  if (!override) return lesson;

  const questions = override.questionOptions
    ? lesson.quiz.questions.map((question) => {
        const optionCopy = override.questionOptions?.[question.id];
        if (!optionCopy) return question;
        return {
          ...question,
          options: question.options.map((option) => {
            const replacement = optionCopy[option.id];
            return replacement ? { ...option, label: replacement } : option;
          }),
        };
      })
    : lesson.quiz.questions;

  const practicalTask = override.taskChoices && lesson.practicalTask.choices
    ? {
        ...lesson.practicalTask,
        choices: lesson.practicalTask.choices.map((choice) => {
          const replacement = override.taskChoices?.[choice.id];
          return replacement ? { ...choice, label: replacement } : choice;
        }),
      }
    : lesson.practicalTask;

  return microLessonSchema.parse({
    ...lesson,
    practicalTask,
    quiz: {
      ...lesson.quiz,
      questions,
    },
  });
}
