import { microLessonSchema } from '../../schemas';
import type { LocalizedText, MicroLesson } from '../../types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface AssessmentCopyOverride {
  readonly taskChoices?: OptionCopyMap;
  readonly questionOptions?: Readonly<Record<string, OptionCopyMap>>;
}

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const ASSET_SCHOOL_ASSESSMENT_OVERRIDES: Readonly<Record<string, AssessmentCopyOverride>> = {
  'lesson.asset.cross-market.001': {
    taskChoices: {
      color: copy(
        'Varlık türünün yalnız isimlendirmeyi değiştirdiğini, execution ve taşıma riskini değiştirmediğini varsaymak',
        'Assuming the asset type changes only the label, not execution or carrying risk',
      ),
    },
    questionOptions: {
      'question.ayni-grafik-farkli-piyasa.1': {
        a: copy(
          'Hayır; execution, carry, kontrat ve piyasa yapısı riski değiştirebilir',
          'No; execution, carry, contract, and market structure can change the risk',
        ),
        b: copy(
          'Evet; aynı teknik formasyon aynı uygulama riskini üretir',
          'Yes; the same technical pattern produces the same implementation risk',
        ),
        c: copy(
          'Yalnız volatilite aynıysa uygulama riski de aynı kabul edilir',
          'Implementation risk can be treated as identical whenever volatility is identical',
        ),
      },
      'question.ayni-grafik-farkli-piyasa.2': {
        b: copy(
          'Yalnız fiyat grafiğini ve indikatör hesaplarını',
          'Only the price chart and indicator calculations',
        ),
        c: copy(
          'Yalnız varlığın geçmişteki yönünü',
          'Only the asset’s historical direction',
        ),
      },
      'question.ayni-grafik-farkli-piyasa.3': {
        b: copy(
          'Evet; ürün farkları teknik analizi tamamen geçersiz kılar',
          'Yes; product differences make technical analysis entirely invalid',
        ),
        c: copy(
          'Yalnız uzun vadeli işlemlerde ürün bağlamı gerekir',
          'Product context matters only for long-horizon trades',
        ),
      },
    },
  },
  'lesson.asset.equity.corporate-actions.001': {
    questionOptions: {
      'question.hisselerde-corporate-actions.1': {
        a: copy(
          'Hayır; birim fiyat ve pay sayısı mekanik olarak değişebilir',
          'No; unit price and share count can change mechanically',
        ),
        b: copy(
          'Evet; split şirket değerini aynı oranda azaltır',
          'Yes; a split reduces company value by the same proportion',
        ),
        c: copy(
          'Yalnız reverse split şirket değerini mekanik olarak değiştirir',
          'Only a reverse split mechanically changes company value',
        ),
      },
      'question.hisselerde-corporate-actions.2': {
        a: copy(
          'Evet; adjusted seri corporate action etkilerini tarihsel karşılaştırmadan ayırmaya yardım eder',
          'Yes; an adjusted series helps separate corporate-action effects from historical comparison',
        ),
        b: copy(
          'Hayır; backtest her durumda yalnız ham kapanış fiyatını kullanmalıdır',
          'No; a backtest should always use only raw closing prices',
        ),
        c: copy(
          'Yalnız temettü ödemeyen şirketlerde adjusted fiyat önemlidir',
          'Adjusted prices matter only for companies that do not pay dividends',
        ),
      },
      'question.hisselerde-corporate-actions.3': {
        b: copy(
          'Yalnız toplam şirket değerini; hisse başına metrikleri değiştirmez',
          'Only total company value; it does not affect per-share metrics',
        ),
        c: copy(
          'Yalnız işlem hacmini; sahiplik oranı ve pay sayısı etkilenmez',
          'Only trading volume; ownership percentages and share count are unaffected',
        ),
      },
    },
  },
  'lesson.asset.equity.earnings-gaps.001': {
    questionOptions: {
      'question.hisselerde-earnings-gap-riski.1': {
        a: copy(
          'Hayır; stop tetiklenebilir ama sonraki mevcut fiyattan gerçekleşebilir',
          'No; the stop can trigger but fill at the next available price',
        ),
        b: copy(
          'Evet; stop seviyesi aynı zamanda gerçekleşme fiyatını garanti eder',
          'Yes; the stop level also guarantees the execution price',
        ),
        c: copy(
          'Yalnız likit hisselerde stop seviyesi gap boyunca garanti edilir',
          'Only in liquid stocks is the stop level guaranteed through a gap',
        ),
      },
      'question.hisselerde-earnings-gap-riski.2': {
        a: copy(
          'Evet; yeni bilgi seans dışında beklentileri ve kotasyonları değiştirebilir',
          'Yes; new information can change expectations and quotes outside regular hours',
        ),
        b: copy(
          'Hayır; şirket fiyatı yalnız normal seans açıkken değişebilir',
          'No; an equity price can change only while the regular session is open',
        ),
        c: copy(
          'Yalnız temettü haberleri seans dışında fiyatlanabilir',
          'Only dividend news can be priced outside regular hours',
        ),
      },
      'question.hisselerde-earnings-gap-riski.3': {
        a: copy(
          'Evet; aynı gap daha büyük pozisyonda daha büyük hesap etkisi yaratır',
          'Yes; the same gap has a larger account impact on a larger position',
        ),
        b: copy(
          'Hayır; gap riski pozisyon büyüklüğünden bağımsızdır',
          'No; gap risk is independent of position size',
        ),
        c: copy(
          'Pozisyon büyüklüğü yalnız stop kullanılmıyorsa önemlidir',
          'Position size matters only when no stop is used',
        ),
      },
    },
  },
  'lesson.asset.etf.nav-tracking.001': {
    questionOptions: {
      'question.etf-nav-ve-tracking-farki.1': {
        a: copy(
          'Evet; borsa fiyatı arz-talep nedeniyle NAV üstü veya altı işlem görebilir',
          'Yes; exchange price can trade above or below NAV because of supply and demand',
        ),
        b: copy(
          'Hayır; creation/redemption mekanizması fiyatı her an NAV’a kilitler',
          'No; the creation/redemption mechanism locks price to NAV at every moment',
        ),
        c: copy(
          'Yalnız fon kapanışından sonra NAV sapması oluşabilir',
          'A NAV deviation can occur only after the fund closes',
        ),
      },
      'question.etf-nav-ve-tracking-farki.2': {
        b: copy(
          'Fonun gün içi bid-ask spreadinin büyüklüğünü',
          'The size of the fund’s intraday bid-ask spread',
        ),
        c: copy(
          'ETF pay sayısının benchmark ağırlıklarını otomatik değiştirmesini',
          'The ETF share count automatically changing benchmark weights',
        ),
      },
      'question.etf-nav-ve-tracking-farki.3': {
        a: copy(
          'Evet; ücretler benchmark’a göre kalıcı getiri farkı yaratabilir',
          'Yes; fees can create a persistent return difference versus the benchmark',
        ),
        b: copy(
          'Hayır; tracking yalnız piyasa fiyatı ile NAV arasındaki anlık farktır',
          'No; tracking is only the instantaneous gap between market price and NAV',
        ),
        c: copy(
          'Ücretler yalnız aktif ETFlerde tracking’i etkiler',
          'Fees affect tracking only in actively managed ETFs',
        ),
      },
    },
  },
  'lesson.asset.etf.leveraged-inverse.001': {
    questionOptions: {
      'question.kaldiracli-ve-ters-etf-gunluk-reset.1': {
        a: copy(
          'Evet; günlük reset ve bileşik getiri yolu çok günlük sonucu değiştirebilir',
          'Yes; daily reset and the compounded return path can change multi-day results',
        ),
        b: copy(
          'Hayır; 2× hedefi tüm holding period boyunca sabit çarpan verir',
          'No; a 2× target gives a fixed multiple over the entire holding period',
        ),
        c: copy(
          'Günlük reset yalnız endeks düştüğünde sonucu etkiler',
          'Daily reset affects results only when the index falls',
        ),
      },
      'question.kaldiracli-ve-ters-etf-gunluk-reset.2': {
        a: copy(
          'Hayır; çoğu ürün günlük benchmark hareketine göre hedef tanımlar',
          'No; many products define their objective versus the benchmark’s daily move',
        ),
        b: copy(
          'Evet; 2× etiketi her holding period için tam iki katı garanti eder',
          'Yes; the 2× label guarantees exactly twice the return over every holding period',
        ),
        c: copy(
          'Yalnız bir haftadan kısa tutuşlarda 2× sonucu garanti eder',
          'It guarantees 2× only for holding periods shorter than one week',
        ),
      },
      'question.kaldiracli-ve-ters-etf-gunluk-reset.3': {
        a: copy(
          'Evet; aynı başlangıç ve bitiş seviyesinde farklı fiyat yolu farklı ETF sonucu yaratabilir',
          'Yes; different price paths can produce different ETF results even with the same start and end levels',
        ),
        b: copy(
          'Hayır; yalnız benchmark’ın toplam getirisi sonucu belirler',
          'No; only the benchmark’s total return determines the result',
        ),
        c: copy(
          'Path dependency yalnız inverse ETFlerde vardır',
          'Path dependency exists only in inverse ETFs',
        ),
      },
    },
  },
  'lesson.asset.fx.carry-rollover.001': {
    taskChoices: {
      dividend: copy(
        'Paritenin yönünün carry etkisini otomatik olarak sıfırlaması',
        'Assuming spot direction automatically cancels the carry effect',
      ),
    },
    questionOptions: {
      'question.fx-carry-ve-rollover.1': {
        a: copy(
          'Evet; rollover/carry spot değişmeden de P&L yaratabilir',
          'Yes; rollover/carry can affect P&L even when spot is unchanged',
        ),
        b: copy(
          'Hayır; kur değişmediyse toplam sonuç sıfır kalır',
          'No; if spot is unchanged the total result must remain zero',
        ),
        c: copy(
          'Carry yalnız merkez bankası toplantısı gecelerinde oluşur',
          'Carry exists only on central-bank meeting nights',
        ),
      },
      'question.fx-carry-ve-rollover.2': {
        a: copy(
          'Hayır; forward points, broker markup ve settlement koşulları da etkileyebilir',
          'No; forward points, broker markup, and settlement conventions can also matter',
        ),
        b: copy(
          'Evet; carry politika faizi farkının aynısıdır',
          'Yes; carry is identical to the policy-rate differential',
        ),
        c: copy(
          'Broker koşulları yalnız faiz farkı pozitif olduğunda önemlidir',
          'Broker conventions matter only when the rate differential is positive',
        ),
      },
      'question.fx-carry-ve-rollover.3': {
        b: copy(
          'Spot yönü ve işlem hacmi; finansman sonucu etkilemez',
          'Spot direction and trading volume; financing does not affect the result',
        ),
        c: copy(
          'Yalnız carry; spread ve slippage gerçek sonucu değiştirmez',
          'Only carry; spread and slippage do not change realized results',
        ),
      },
    },
  },
};

export function normalizeAssetSchoolAssessmentQuality(lesson: MicroLesson): MicroLesson {
  const override = ASSET_SCHOOL_ASSESSMENT_OVERRIDES[lesson.id];
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
