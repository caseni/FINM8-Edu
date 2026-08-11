import { microLessonSchema } from '../../schemas';
import type { LocalizedText, MicroLesson } from '../../types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface AssessmentCopyOverride {
  readonly taskChoices?: OptionCopyMap;
  readonly questionOptions?: Readonly<Record<string, OptionCopyMap>>;
}

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const RISK_PORTFOLIO_ASSESSMENT_OVERRIDES: Readonly<Record<string, AssessmentCopyOverride>> = {
  'lesson.portfolio.correlation.001': {
    questionOptions: {
      'question.korelasyon-ne-anlatir.2': {
        a: copy('Evet; pencere, veri frekansı ve piyasa rejimi ortak hareketi değiştirebilir', 'Yes; window, data frequency, and market regime can change co-movement'),
        b: copy('Hayır; bir kez ölçülen korelasyon portföyün kalıcı özelliğidir', 'No; once measured, correlation is a permanent property of the portfolio'),
        c: copy('Korelasyon yalnız varlıkların isimleri veya sektörleri değiştiğinde değişir', 'Correlation changes only when asset names or sectors change'),
      },
      'question.korelasyon-ne-anlatir.3': {
        a: copy('Hayır; ağırlıklar, ortak faktörler ve stres dönemindeki davranış da gerekir', 'No; weights, common factors, and stress-period behavior also matter'),
        b: copy('Evet; düşük geçmiş korelasyon gelecekte bağımsız hareketi garanti eder', 'Yes; low historical correlation guarantees independent future behavior'),
        c: copy('Yalnız günlük veriyle hesaplanan düşük korelasyon gerçek çeşitlendirmeyi garanti eder', 'Low correlation guarantees diversification only when calculated from daily data'),
      },
    },
  },
  'lesson.portfolio.drawdown.001': {
    questionOptions: {
      'question.drawdown-nedir.2': {
        a: copy('Evet; aynı bitiş getirisine rağmen izlenen kayıp yolu ve zirveden düşüş farklı olabilir', 'Yes; the loss path and peak-to-trough decline can differ despite the same ending return'),
        b: copy('Hayır; aynı yıllık getiri aynı ara dönem risk yolunu zorunlu kılar', 'No; the same annual return requires the same interim risk path'),
        c: copy('Drawdown farkı yalnız portföylerden biri kaldıraçlıysa oluşabilir', 'Drawdowns can differ only when one portfolio uses leverage'),
      },
      'question.drawdown-nedir.3': {
        a: copy('Hayır; likidite, kaldıraç, korelasyon ve tail risk gibi katmanlar ayrıca değerlendirilir', 'No; liquidity, leverage, correlation, and tail risk still require separate assessment'),
        b: copy('Evet; maximum drawdown biliniyorsa portföyün tüm önemli riskleri ölçülmüştür', 'Yes; once maximum drawdown is known, all important portfolio risks are measured'),
        c: copy('Yalnız uzun dönem maximum drawdown diğer risk ölçülerinin yerine geçebilir', 'Only long-horizon maximum drawdown can replace other risk measures'),
      },
    },
  },
  'lesson.risk.leverage.001': {
    questionOptions: {
      'question.kaldirac-riski-nasil-buyutur.3': {
        b: copy('Finansman ve margin koşullarının yalnız kâr eden pozisyonları etkilediğini varsaymak', 'Assuming financing and margin conditions matter only for profitable positions'),
        c: copy('Nominal kaldıraç aynıysa ürün yapısı ve gap riskinin kayıp profilini değiştirmediğini varsaymak', 'Assuming product structure and gap risk cannot change the loss profile when nominal leverage is the same'),
      },
    },
  },
  'lesson.portfolio.concentration.001': {
    questionOptions: {
      'question.yogunlasma-riski-nedir.3': {
        b: copy('Yalnız pozisyon sayısına bakmak; ağırlık ve ortak faktörleri dikkate almamak', 'Looking only at holding count while ignoring weights and common factors'),
        c: copy('Sektör ve faktör maruziyetini yalnız en büyük tek pozisyon için ölçmek', 'Measuring sector and factor exposure only for the single largest holding'),
      },
    },
  },
  'lesson.portfolio.risk-factors.001': {
    taskChoices: {
      name: copy('Ürün isimleri farklıysa ortak ekonomik sürücünün olamayacağını varsaymak', 'Assuming different product names mean there can be no common economic driver'),
      color: copy('Aynı sektördeki pozisyonları farklı ticker taşıdığı için farklı risk kaynağı saymak', 'Treating positions in the same sector as different risk sources because their tickers differ'),
    },
    questionOptions: {
      'question.portfoy-risk-faktorleri.2': {
        a: copy('Evet; faiz, büyüme, kur veya volatilite gibi sürücüler ürün sınırlarını aşabilir', 'Yes; drivers such as rates, growth, FX, or volatility can cut across product categories'),
        b: copy('Hayır; farklı ürün türleri ekonomik olarak birbirinden bağımsız risk taşır', 'No; different product types carry economically independent risks'),
        c: copy('Ortak faktör yalnız hisse ile ETF arasında oluşabilir, tahvil veya FX’e geçmez', 'Common factors can exist only between stocks and ETFs, not bonds or FX'),
      },
      'question.portfoy-risk-faktorleri.3': {
        a: copy('Hayır; çok sayıda varlık aynı faiz, büyüme veya likidite faktörüne bağlı olabilir', 'No; many holdings can still depend on the same rate, growth, or liquidity factor'),
        b: copy('Evet; varlık sayısı arttıkça risk faktörü çeşitliliği otomatik artar', 'Yes; more holdings automatically increase risk-factor diversity'),
        c: copy('On pozisyonun üzerinde ortak risk faktörü yoğunlaşması pratikte oluşmaz', 'Common-factor concentration does not occur in practice once a portfolio has more than ten positions'),
      },
    },
  },
  'lesson.portfolio.rebalancing.001': {
    questionOptions: {
      'question.yeniden-dengeleme-neden-yapilir.2': {
        a: copy('Hayır; tolerans bantları, vergi ve işlem maliyeti küçük sapmalara tepki vermemeyi gerektirebilir', 'No; tolerance bands, taxes, and trading costs can justify ignoring small drifts'),
        b: copy('Evet; hedef ağırlıktan her küçük sapma anında işlemle kapatılmalıdır', 'Yes; every small drift from target weights should be corrected immediately'),
        c: copy('Yeniden dengeleme yalnız takvim gününde yapılabilir; threshold yaklaşımı geçerli değildir', 'Rebalancing can be done only on calendar dates; threshold approaches are not valid'),
      },
      'question.yeniden-dengeleme-neden-yapilir.3': {
        a: copy('Hayır; amaç hedef risk yapısına yaklaşmaktır, gelecek fiyatı bilmek değildir', 'No; the goal is to move toward the target risk structure, not to know future prices'),
        b: copy('Evet; hedef ağırlıklara dönmek sonraki dönem fiyat yönünü de garanti eder', 'Yes; returning to target weights also guarantees the next period’s price direction'),
        c: copy('Yıllık yeniden dengeleme kullanılırsa gelecek getiri daha öngörülebilir hale gelir', 'Using annual rebalancing makes future returns predictable'),
      },
    },
  },
};

export function normalizeRiskPortfolioAssessmentQuality(lesson: MicroLesson): MicroLesson {
  const override = RISK_PORTFOLIO_ASSESSMENT_OVERRIDES[lesson.id];
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
