import { microLessonSchema } from './schemas';
import type { LocalizedText, MicroLesson } from './types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface ExpansionAssessmentOverride {
  readonly questionOptions?: Readonly<Record<string, OptionCopyMap>>;
  readonly taskChoices?: OptionCopyMap;
}

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const ACADEMY_EXPANSION_FINAL_OVERRIDES: Readonly<Record<string, ExpansionAssessmentOverride>> = {
  'lesson.economy.fiscal-policy.001': {
    questionOptions: {
      'question.maliye-politikasi-nedir.2': {
        a: copy(
          'Hayır; farklı harcama türleri farklı kanallardan etkiler',
          'No; different spending choices can work through different channels',
        ),
      },
    },
  },
  'lesson.economy.exchange-rates.001': {
    questionOptions: {
      'question.doviz-kuru-neden-degisir.2': {
        a: copy(
          'Hayır; kur birçok ekonomik ve piyasa etkisine tepki verir',
          'No; exchange rates respond to several economic and market forces',
        ),
      },
    },
  },
  'lesson.markets.primary-secondary.001': {
    questionOptions: {
      'question.birincil-ve-ikincil-piyasa.3': {
        a: copy(
          'Hayır; alıcı ile satıcı çoğunlukla yatırımcılardır',
          'No; the buyer and seller are generally investors',
        ),
      },
    },
  },
  'lesson.markets.derivatives.001': {
    questionOptions: {
      'question.turev-urun-nedir.2': {
        a: copy(
          'Hayır; futures dayanağı izlese de ayrı bir sözleşmedir',
          'No; a futures contract remains a separate instrument from its underlying',
        ),
      },
    },
  },
  'lesson.technical.rsi.001': {
    questionOptions: {
      'question.rsi-ne-anlatir-ne-anlatmaz.2': {
        a: copy(
          'Hayır; 70 üzeri RSI güçlü trendde uzun süre kalabilir',
          'No; RSI above 70 can persist during a strong trend',
        ),
        b: copy(
          'Evet; 70 üzeri değer tek başına dönüşü doğrular',
          'Yes; a reading above 70 by itself confirms a reversal',
        ),
      },
    },
  },
  'lesson.technical.macd.001': {
    questionOptions: {
      'question.macd-ne-gosterir.2': {
        a: copy(
          'Hayır; kesişim fiyat yapısı ve rejimle birlikte okunmalıdır',
          'No; a crossover must be read together with price structure and market regime',
        ),
        b: copy(
          'Evet; her MACD kesişimi yeni trendi doğrular',
          'Yes; every MACD crossover confirms a new trend',
        ),
      },
    },
  },
  'lesson.technical.multi-timeframe.001': {
    questionOptions: {
      'question.coklu-zaman-dilimi-nasil-kullanilir.2': {
        a: copy(
          'Hayır; kısa zaman dilimi hareketi günlük yapıyı tek başına bozmaz',
          'No; a lower-timeframe move does not by itself invalidate the daily structure',
        ),
        b: copy(
          'Evet; 15 dakikalık düşüş günlük yükselişi geçersiz kılar',
          'Yes; a 15-minute decline invalidates the daily uptrend',
        ),
      },
    },
  },
  'lesson.technical.patterns.001': {
    questionOptions: {
      'question.formasyonlar-neden-kesin-degildir.3': {
        a: copy(
          'Hayır; pattern hedefi olasılıksal bir projeksiyondur',
          'No; a pattern target is a probabilistic projection',
        ),
        b: copy(
          'Evet; pattern tamamlanınca hedefe ulaşmak zorunludur',
          'Yes; completing the pattern guarantees that its target will be reached',
        ),
      },
    },
  },
  'lesson.technical.confluence.001': {
    questionOptions: {
      'question.confluence-nedir.3': {
        a: copy(
          'Hayır; uyumlu sinyaller olasılığı güçlendirebilir ama kesinlik vermez',
          'No; aligned signals can strengthen a case without making it certain',
        ),
        b: copy(
          'Evet; birkaç sinyal aynı yöndeyse sonuç kesindir',
          'Yes; several signals pointing the same way make the outcome certain',
        ),
      },
    },
  },
  'lesson.technical.indicator-limits.001': {
    questionOptions: {
      'question.indikatorlerin-sinirlari.2': {
        a: copy(
          'Evet; parametreler indikatörün duyarlılığını değiştirebilir',
          'Yes; parameter choices can change an indicator’s sensitivity',
        ),
      },
      'question.indikatorlerin-sinirlari.3': {
        a: copy(
          'Hayır; aynı fiyat verisinden türeyen göstergeler bilgiyi tekrar edebilir',
          'No; indicators derived from the same price data can repeat information',
        ),
        b: copy(
          'Evet; her ek indikatör bağımsız bilgi ekler',
          'Yes; every additional indicator adds independent information',
        ),
      },
    },
  },
  'lesson.fundamental.growth-quality.001': {
    questionOptions: {
      'question.buyume-kalitesi-nasil-okunur.2': {
        a: copy(
          'Hayır; büyüme marj, nakit ve sürdürülebilirlikle birlikte okunur',
          'No; growth should be read together with margins, cash generation, and sustainability',
        ),
        b: copy(
          'Evet; yüksek büyüme oranı tek başına kaliteyi kanıtlar',
          'Yes; a high growth rate by itself proves growth quality',
        ),
      },
    },
  },
  'lesson.fundamental.per-share.001': {
    questionOptions: {
      'question.hisse-basina-metrikler-neden-onemlidir.3': {
        b: copy(
          'Evet; net kâr artarsa hisse sayısı ne olursa olsun EPS artar',
          'Yes; if net income rises, EPS must rise regardless of share count',
        ),
      },
    },
  },
  'lesson.fundamental.valuation-multiples.001': {
    questionOptions: {
      'question.degerleme-carpanlari-nasil-okunur.2': {
        a: copy(
          'Hayır; düşük P/E bazen düşük büyüme veya yüksek riski fiyatlar',
          'No; a low P/E can price in weak growth or elevated risk',
        ),
        b: copy(
          'Evet; düşük P/E her durumda ucuzluk demektir',
          'Yes; a low P/E always proves that a company is cheap',
        ),
      },
    },
  },
  'lesson.fundamental.dcf.001': {
    questionOptions: {
      'question.dcf-mantigi-nedir.2': {
        a: copy(
          'Evet; küçük varsayım değişiklikleri değeri belirgin biçimde değiştirebilir',
          'Yes; small assumption changes can materially change the valuation',
        ),
        b: copy(
          'Hayır; büyüme ve iskonto varsayımları sonucu değiştirmez',
          'No; growth and discount assumptions do not affect the result',
        ),
      },
      'question.dcf-mantigi-nedir.3': {
        a: copy(
          'Hayır; DCF varsayıma bağlı bir değer aralığı sunar',
          'No; DCF supports an assumption-dependent range of values',
        ),
        b: copy(
          'Evet; model tek ve kesin doğru fiyat üretir',
          'Yes; the model produces one certain correct price',
        ),
      },
    },
  },
  'lesson.fundamental.peer-comparison.001': {
    taskChoices: {
      color: copy(
        'Yalnız hisse fiyatlarının birbirine yakın olup olmadığını',
        'Only whether their share prices are close to each other',
      ),
    },
    questionOptions: {
      'question.benzer-sirket-karsilastirmasi-nasil-yapilir.1': {
        a: copy(
          'Hayır; iş modeli, büyüme ve finansal yapı da benzer olmalıdır',
          'No; business model, growth, and financial structure also need to be comparable',
        ),
        b: copy(
          'Evet; sektör etiketi aynıysa şirketler doğrudan karşılaştırılabilir',
          'Yes; matching industry labels are enough to make companies directly comparable',
        ),
      },
    },
  },
  'lesson.fundamental.analysis-limits.001': {
    questionOptions: {
      'question.temel-analizin-sinirlari.1': {
        a: copy(
          'Hayır; temel analiz belirsizliği düzenler ama geleceği kesinleştirmez',
          'No; fundamental analysis structures uncertainty but does not make the future certain',
        ),
        b: copy(
          'Evet; yeterli veri varsa gelecekteki sonucu kesin verir',
          'Yes; enough data makes the future outcome certain',
        ),
      },
    },
  },
  'lesson.risk.liquidity.001': {
    taskChoices: {
      logo: copy(
        'Yalnız birim fiyatı yüksek olan küçük pozisyon',
        'A small position chosen only because its unit price is high',
      ),
    },
    questionOptions: {
      'question.likidite-riski-ne-zaman-buyur.2': {
        a: copy(
          'Evet; daha büyük pozisyon piyasa derinliğinin daha fazlasını tüketebilir',
          'Yes; a larger position can consume more of the available market depth',
        ),
        b: copy(
          'Hayır; pozisyon büyüklüğü likidite riskini değiştirmez',
          'No; position size does not change liquidity risk',
        ),
      },
      'question.likidite-riski-ne-zaman-buyur.3': {
        a: copy(
          'Evet; stres döneminde spread genişleyip derinlik azalabilir',
          'Yes; spreads can widen and depth can fall during stress',
        ),
        b: copy(
          'Hayır; normalde likit olan piyasa stres altında da aynı kalır',
          'No; a normally liquid market stays equally liquid during stress',
        ),
      },
    },
  },
  'lesson.risk.tail-risk.001': {
    questionOptions: {
      'question.tail-risk-nedir.2': {
        a: copy(
          'Evet; sakin bir örneklem nadir uç olayları hiç göstermeyebilir',
          'Yes; a calm sample may contain no rare extreme events',
        ),
        b: copy(
          'Hayır; sakin geçmiş tüm uç riskleri zaten içerir',
          'No; a calm history already captures every tail risk',
        ),
      },
      'question.tail-risk-nedir.3': {
        a: copy(
          'Hayır; nadirlik olayın etkisini küçük yapmaz',
          'No; rarity does not make an event’s impact small',
        ),
        b: copy(
          'Evet; seyrek gerçekleşen olayların etkisi önemsizdir',
          'Yes; events that occur rarely have negligible impact',
        ),
      },
    },
  },
  'lesson.portfolio.stress-testing.001': {
    questionOptions: {
      'question.stres-testi-ne-ise-yarar.1': {
        b: copy(
          'Yalnız geçmiş dönemin ortalama getirisini',
          'Only the average return from the recent past',
        ),
      },
      'question.stres-testi-ne-ise-yarar.2': {
        a: copy(
          'Hayır; stres testi geleceği bilmekten çok hassasiyeti sınar',
          'No; stress testing probes sensitivity rather than predicting the future with certainty',
        ),
        b: copy(
          'Evet; seçilen senaryo gelecekte ne olacağını kesin gösterir',
          'Yes; the chosen scenario reveals exactly what will happen in the future',
        ),
      },
      'question.stres-testi-ne-ise-yarar.3': {
        a: copy(
          'Hayır; farklı risk kaynakları farklı stres senaryoları gerektirir',
          'No; different risk sources require different stress scenarios',
        ),
        b: copy(
          'Evet; tek senaryo bütün risk kaynaklarını kapsar',
          'Yes; one scenario covers every source of risk',
        ),
      },
    },
  },
  'lesson.risk.loss-recovery.001': {
    questionOptions: {
      'question.buyuk-kayip-neden-zor-toparlanir.2': {
        a: copy(
          'Hayır; toparlanma daha düşük sermaye tabanından başlar',
          'No; recovery starts from a smaller capital base',
        ),
        b: copy(
          'Evet; yüzde 20 kayıp yüzde 20 kazançla tamamen telafi edilir',
          'Yes; a 20% loss is fully recovered by a 20% gain',
        ),
      },
    },
  },
  'lesson.asset.crypto.perpetual-funding.001': {
    questionOptions: {
      'question.kripto-perpetual-ve-funding.3': {
        a: copy(
          'Hayır; funding alırken fiyat ve liquidation riski sürer',
          'No; funding does not remove price or liquidation risk',
        ),
      },
    },
  },
};

export function normalizeAcademyExpansionAssessmentFinalQuality(lesson: MicroLesson): MicroLesson {
  const override = ACADEMY_EXPANSION_FINAL_OVERRIDES[lesson.id];
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
