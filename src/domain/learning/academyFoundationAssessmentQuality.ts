import { microLessonSchema } from './schemas';
import type { LocalizedText, MicroLesson } from './types';

/**
 * Academy foundation assessment repair layer.
 *
 * Earlier chain steps rebuild Academy quiz options from bare binary labels, and
 * `normalizeAssessmentSignalQuality` then expands the correct binary option into the
 * question explanation verbatim and substitutes generic placeholder copy for trivial
 * distractors. On Academy foundation lessons that produced three concrete defects:
 *
 *  1. the correct option repeated the explanation word for word, so the option was
 *     identifiable without domain knowledge and the explanation taught nothing new;
 *  2. placeholder distractor copy ("Ürünün marka görünümünü ...", "bu unsurun ...")
 *     surfaced as live answers whose pronouns have no antecedent in the stem and whose
 *     grammatical form does not answer the question that was asked;
 *  3. some remaining distractors were throwaways ("Evet, her zaman", "Yalnız yeşil mumda").
 *
 * This layer restores hand-authored option copy for the affected foundation questions and
 * practical-task choices only. It runs last so nothing overwrites it again.
 *
 * It rewrites labels only. Option ids, `correctOptionId`, task `expectedEvidence`, option
 * order and option count are never touched, so scoring identity is unchanged.
 *
 * Beginner-journey lessons that remain shared with Academy are deliberately out of scope
 * when their concise assessment copy is already protected elsewhere. Momentum and moving
 * average are now Academy-only in the Beginner refresh, so their final Academy options are
 * repaired here like the other Academy foundation lessons.
 */

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface FoundationAssessmentOverride {
  readonly questionOptions?: Readonly<Record<string, OptionCopyMap>>;
  readonly taskChoices?: OptionCopyMap;
}

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const ACADEMY_FOUNDATION_ASSESSMENT_OVERRIDES: Readonly<
  Record<string, FoundationAssessmentOverride>
> = {
  'lesson.markets.exchanges.001': {
    questionOptions: {
      'question.borsa-ve-islem-yeri-nedir.3': {
        a: copy(
          'Hayır; borsa eşleşme altyapısını sağlar, fiyatı emirler oluşturur',
          'No; an exchange provides the matching infrastructure while orders form the price',
        ),
        c: copy(
          'Yalnız açılış fiyatını borsa belirler, gün içi fiyatlar emirlerden oluşur',
          'The exchange sets only the opening price, while intraday prices form from orders',
        ),
      },
    },
  },
  'lesson.markets.indices.001': {
    questionOptions: {
      'question.borsa-endeksi-ne-anlatir.2': {
        a: copy(
          'Evet; ağırlıklı toplam pozitifken tek tek bileşenler farklı yönlerde olabilir',
          'Yes; the weighted total can be positive while individual components move differently',
        ),
        b: copy(
          'Hayır; endeks yükseliyorsa bütün bileşenlerinin de yükselmiş olması gerekir',
          'No; if an index rises, all of its components must have risen as well',
        ),
        c: copy(
          'Yalnız bileşenin ağırlığı çok küçükse endeksle ters yönde hareket edebilir',
          'A component can move against the index only when its weight is very small',
        ),
      },
    },
  },
  'lesson.markets.etf.001': {
    taskChoices: {
      label: copy(
        'Yalnız son bir aylık fiyat performansı',
        'Only its price performance over the last month',
      ),
    },
  },
  'lesson.markets.bonds.001': {
    questionOptions: {
      'question.tahvil-fiyati-ve-getirisi.2': {
        c: copy(
          'Yalnız ihraç sırasında belirlenen nominal değer değiştiği için',
          'Only because the face value set at issuance changes',
        ),
      },
    },
  },
  'lesson.technical.breakout.001': {
    questionOptions: {
      'question.breakout-ne-zaman-anlamli.3': {
        a: copy(
          'Hayır; kırılım gözlenen bir davranıştır, sonraki yön yine belirsizdir',
          'No; a breakout is an observed behavior and the next direction stays uncertain',
        ),
        b: copy(
          'Evet; seviye aşıldıysa hareketin aynı yönde sürmesi beklenir',
          'Yes; once the level is passed, the move is expected to continue in the same direction',
        ),
        c: copy(
          'Yalnız kırılım yüksek hacimle olursa sonraki yön garanti sayılır',
          'The next direction is guaranteed only when the breakout comes with high volume',
        ),
      },
    },
  },
  'lesson.technical.false-breakout.001': {
    questionOptions: {
      'question.false-breakout-nasil-okunur.2': {
        a: copy(
          'Hayır; ilk hareketin tutunamaması ters yönü kendiliğinden doğrulamaz',
          'No; the first move failing to hold does not by itself confirm the opposite direction',
        ),
        b: copy(
          'Evet; başarısız kırılım her zaman ters yönde hareket başlatır',
          'Yes; a false breakout always starts a move in the opposite direction',
        ),
        c: copy(
          'Yalnız günlük grafikte oluşan başarısız kırılım ters yönü garanti eder',
          'Only a false breakout on the daily chart guarantees the opposite direction',
        ),
      },
    },
  },
  'lesson.technical.pullback.001': {
    questionOptions: {
      'question.pullback-trend-donusu-degildir.3': {
        a: copy(
          'Hayır; kısa hareket ancak daha geniş yapıyla birlikte anlam kazanır',
          'No; a short move only becomes meaningful together with the broader structure',
        ),
        b: copy(
          'Evet; her geri çekilme ana yönün değiştiğini gösterir',
          'Yes; every pullback shows that the main direction has changed',
        ),
        c: copy(
          'Yalnız geri çekilme birkaç mum sürerse büyük resim değişmiş sayılır',
          'The bigger picture counts as changed only when the pullback lasts a few candles',
        ),
      },
    },
  },
  'lesson.technical.range.001': {
    questionOptions: {
      'question.range-konsolidasyon-nasil-okunur.3': {
        a: copy(
          'Hayır; sınırın aşılması başlangıç olabilir, dışarıda kalma davranışı da gerekir',
          'No; crossing the boundary can be a start, and staying outside still has to follow',
        ),
        b: copy(
          'Evet; sınır aşıldığı anda yeni trend başlamış sayılır',
          'Yes; a new trend counts as started the moment the boundary is crossed',
        ),
      },
    },
  },
  'lesson.technical.momentum.001': {
    questionOptions: {
      'question.momentum-ne-anlatir.3': {
        a: copy(
          'Hayır; momentum tek başına sonraki yönü kesinleştirmez',
          'No; momentum alone does not make the next direction certain',
        ),
        b: copy(
          'Evet; momentum ölçüldüğünde sonraki yön kesinleşir',
          'Yes; once momentum is measured, the next direction becomes certain',
        ),
        c: copy(
          'Yalnız momentum güçlü olduğunda yön garanti edilir',
          'Direction is guaranteed only when momentum is strong',
        ),
      },
    },
  },
  'lesson.technical.moving-average.001': {
    questionOptions: {
      'question.hareketli-ortalama-ne-yapar.3': {
        a: copy(
          'Hayır; tek bir ortalama geçişi bağlam olmadan kesin talimat değildir',
          'No; one moving-average cross is not a certain instruction without context',
        ),
        b: copy(
          'Evet; fiyat ortalamayı geçtiğinde işlem yönü kesinleşir',
          'Yes; crossing the average makes the trade direction certain',
        ),
        c: copy(
          'Yalnız EMA kullanılırsa geçiş kesin sinyal sayılır',
          'A cross is a certain signal only when an EMA is used',
        ),
      },
    },
  },
  'lesson.fundamental.income-statement.001': {
    taskChoices: {
      ticker: copy(
        'Satış arttığı için kârın da otomatik artması gerekmiyor mu?',
        'Doesn’t higher sales automatically mean profit should rise too?',
      ),
    },
  },
  'lesson.fundamental.profitability.001': {
    questionOptions: {
      'question.marjlar-ne-anlatir.1': {
        c: copy(
          'Şirketin toplam satış tutarını',
          'The company’s total sales amount',
        ),
      },
    },
  },
  'lesson.fundamental.cash-flow.001': {
    questionOptions: {
      'question.nakit-akisi-neden-farklidir.1': {
        a: copy(
          'Hayır; muhasebe kaydının zamanı ile para hareketinin zamanı farklı olabilir',
          'No; the timing of the accounting entry can differ from the timing of the cash movement',
        ),
        b: copy(
          'Evet; kâr oluştuğunda aynı tutar kasaya da girmiş olur',
          'Yes; when profit is recorded, the same amount has also entered the cash box',
        ),
      },
    },
  },
  'lesson.fundamental.debt-liquidity.001': {
    taskChoices: {
      same: copy(
        'İki şirket de aynı kısa vadeli baskıyı yaşar',
        'Both companies face the same short-term pressure',
      ),
    },
  },
  'lesson.portfolio.correlation.001': {
    questionOptions: {
      'question.korelasyon-ne-anlatir.2': {
        a: copy(
          'Evet; ölçüm penceresi ve piyasa rejimi ortak hareketi değiştirebilir',
          'Yes; the measurement window and the market regime can change co-movement',
        ),
        c: copy(
          'Yalnız varlıkların sektörü değişirse ilişki değişir',
          'The relationship changes only when the assets’ sector changes',
        ),
      },
      'question.korelasyon-ne-anlatir.3': {
        a: copy(
          'Hayır; ağırlıklar, ortak risk kaynakları ve stres davranışı da gerekir',
          'No; weights, shared risk sources, and stress behavior are needed as well',
        ),
        b: copy(
          'Evet; düşük geçmiş korelasyon gelecekte bağımsız hareketi garanti eder',
          'Yes; low historical correlation guarantees independent future movement',
        ),
        c: copy(
          'Yalnız günlük veriyle hesaplanırsa düşük korelasyon yeterli sayılır',
          'Low correlation is sufficient only when it is calculated from daily data',
        ),
      },
    },
  },
  'lesson.portfolio.drawdown.001': {
    questionOptions: {
      'question.drawdown-nedir.3': {
        a: copy(
          'Hayır; likidite, kaldıraç ve yoğunlaşma ayrıca değerlendirilir',
          'No; liquidity, leverage, and concentration still need separate assessment',
        ),
        b: copy(
          'Evet; maximum drawdown biliniyorsa önemli riskler ölçülmüş olur',
          'Yes; once maximum drawdown is known, the important risks have been measured',
        ),
        c: copy(
          'Yalnız uzun dönem drawdown diğer risk ölçülerinin yerine geçebilir',
          'Only long-horizon drawdown can replace the other risk measures',
        ),
      },
    },
  },
  'lesson.portfolio.concentration.001': {
    questionOptions: {
      'question.yogunlasma-riski-nedir.2': {
        a: copy(
          'Hayır; belirleyici olan adet değil, ortak risk kaynaklarına maruziyettir',
          'No; what matters is exposure to shared risk sources, not the number of holdings',
        ),
        c: copy(
          'Yalnız varlıklar farklı sektörlerden seçilirse adet yeterli olur',
          'The count is sufficient only when the assets are picked from different sectors',
        ),
      },
    },
    taskChoices: {
      count: copy(
        'Yalnız isim sayısı fazla olduğu için dağılmış sayılan yatırımlar',
        'Investments counted as spread out only because the number of names is high',
      ),
    },
  },
  'lesson.portfolio.risk-budget.001': {
    taskChoices: {
      equal: copy(
        'Birim fiyatı daha yüksek olan pozisyon',
        'The position with the higher unit price',
      ),
    },
  },
  'lesson.behavior.outcome-bias.001': {
    questionOptions: {
      'question.iyi-sonuc-iyi-karar-midir.2': {
        a: copy(
          'Evet; belirsizlik altında doğru süreç de kayıpla sonuçlanabilir',
          'Yes; under uncertainty a sound process can still end in a loss',
        ),
        b: copy(
          'Hayır; süreç doğruysa sonucun da olumlu olması gerekir',
          'No; if the process is sound, the outcome has to be positive as well',
        ),
        c: copy(
          'Yalnız yüksek volatiliteli varlıklarda iyi süreç kötü sonuç verebilir',
          'A sound process can produce a bad outcome only for highly volatile assets',
        ),
      },
    },
  },
  'lesson.strategy.horizon-objective.001': {
    questionOptions: {
      'question.strateji-amaci-ve-zaman-ufku.1': {
        b: copy(
          'Evet; giriş sinyali belirlendiğinde strateji tamamlanmış olur',
          'Yes; once the entry signal is defined, the strategy is complete',
        ),
      },
    },
  },
  'lesson.strategy.breakout.001': {
    questionOptions: {
      'question.breakout-stratejisi-ne-yapar.1': {
        b: copy(
          'Evet; kırılımı görmek stratejiyi uygulamak için yeterlidir',
          'Yes; seeing the breakout is enough to run the strategy',
        ),
      },
      'question.breakout-stratejisi-ne-yapar.3': {
        b: copy(
          'Hayır; slippage yalnız uzun vadeli pozisyonlarda önemlidir',
          'No; slippage matters only for long-term positions',
        ),
      },
    },
  },
};

export function normalizeAcademyFoundationAssessmentQuality(lesson: MicroLesson): MicroLesson {
  const override = ACADEMY_FOUNDATION_ASSESSMENT_OVERRIDES[lesson.id];
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