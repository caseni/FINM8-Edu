import { microLessonSchema } from './schemas';
import type { LocalizedText, MicroLesson } from './types';

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const QUIZ_EXPLANATION_OVERRIDES: Readonly<Record<string, LocalizedText>> = {
  'question.displacement-nasil-okunur.2': copy(
    'Mum büyüklüğü ancak yakın dönem volatilitesi ve yapı bağlamıyla karşılaştırıldığında anlamlı olur.',
    'Candle size becomes meaningful only when compared with recent volatility and structural context.',
  ),
  'question.backtest-ne-soyler.1': copy(
    'Backtest, geçmiş veride tanımlı kuralların nasıl davrandığını simüle eder; gelecekteki sonucu garanti etmez.',
    'A backtest simulates how defined rules behaved on historical data; it does not guarantee future results.',
  ),
  'question.data-leakage-nedir.1': copy(
    'Gelecek veya test bilgisi modele sızarsa test artık bağımsız olmaz ve performans olduğundan iyi görünebilir.',
    'If future or test information leaks into the model, evaluation is no longer independent and performance can look overstated.',
  ),
  'question.liquidity-sweep-nedir.3': copy(
    'Grafik fiyat davranışını gösterir; hareketin kim tarafından ve hangi niyetle yapıldığını doğrudan kanıtlamaz.',
    'A chart shows price behavior; it does not directly prove who caused the move or with what intent.',
  ),
  'question.liquidity-grab-ve-sweep-farki.1': copy(
    'Grab ve sweep ayrımı kaynaklara göre değişebilir; bu nedenle kullanılan operasyonel tanım açıkça belirtilmelidir.',
    'The grab-versus-sweep distinction can vary by source, so the operational definition being used should be stated explicitly.',
  ),
  'question.inducement-ne-anlatir.1': copy(
    'Inducement etiketi bir fiyat yapısını tarif edebilir; kasıtlı kandırma niyetini grafikten tek başına kanıtlayamaz.',
    'An inducement label can describe price structure, but the chart alone cannot prove intentional deception.',
  ),
  'question.risk-getiri-tek-basina-yetmez.1': copy(
    'Risk/getiri oranı kazanç ve kayıp büyüklüklerini karşılaştırır; olasılık ve gerçekleşme kalitesini tek başına göstermez.',
    'A risk/reward ratio compares payoff sizes; it does not by itself show probabilities or execution quality.',
  ),
  'question.piyasa-seanslari-neden-onemlidir.2': copy(
    'Seanslara göre katılımcı ve emir yoğunluğu değişebilir; bu da likiditeyi ve spread koşullarını etkileyebilir.',
    'Participation and order flow can vary by session, which can change liquidity and spread conditions.',
  ),
  'question.hisse-basina-metrikler-neden-onemlidir.3': copy(
    'Toplam şirket verisi aynı kalsa bile hisse sayısı değişirse hisse başına düşen ekonomik pay değişebilir.',
    'Even if total company figures stay unchanged, a changing share count can alter the economic amount attributable per share.',
  ),
  'question.risk-butcesi-nedir.3': copy(
    'Risk katkıları sabit değildir; volatilite ve korelasyon değiştikçe portföyün gerçek risk dağılımı da değişebilir.',
    'Risk contributions are not fixed; as volatility and correlations change, the portfolio’s actual risk allocation can change too.',
  ),
  'question.likidite-riski-ne-zaman-buyur.1': copy(
    'Likidite riski yalnız fiyat yönüyle değil, pozisyonun istenen zamanda ve maliyetle gerçekleştirilebilmesiyle ilgilidir.',
    'Liquidity risk is not only about price direction; it concerns whether a position can be executed at the desired time and cost.',
  ),
  'question.stres-testi-ne-ise-yarar.1': copy(
    'Stres testi olağandışı koşullar altında portföyün nerede kırılganlaşabileceğini görünür kılmak için kullanılır.',
    'Stress testing is used to reveal where a portfolio may become vulnerable under unusually adverse conditions.',
  ),
  'question.turnover-ve-maliyet.2': copy(
    'Aynı stratejinin gerçek işlem maliyeti spread, komisyon, likidite ve piyasa etkisine göre değişebilir.',
    'The same strategy’s realized trading cost can vary with spreads, commissions, liquidity, and market impact.',
  ),
  'question.turnover-ve-maliyet.3': copy(
    'Küçük bir brüt avantaj, sık işlem maliyetleri eklendiğinde azalabilir hatta tamamen ortadan kalkabilir.',
    'A small gross edge can shrink or disappear entirely once frequent trading costs are included.',
  ),
  'question.olaslikla-dusunmek.3': copy(
    'Düşük olasılık bir olayın nadir olduğunu söyler; olayın gerçekleşmesinin imkânsız olduğunu söylemez.',
    'A low probability means an event is uncommon; it does not mean the event is impossible.',
  ),
  'question.expectancy-nedir.1': copy(
    'Beklenti yalnız kazanma oranına değil, ortalama kazanç ile ortalama kaybın büyüklüğüne de bağlıdır.',
    'Expectancy depends not only on win rate but also on the size of average wins and average losses.',
  ),
  'question.win-rate-payoff-dengesi.1': copy(
    'Yüksek kazanma oranı tek başına yeterli değildir; nadir fakat çok büyük kayıplar toplam sonucu bozabilir.',
    'A high win rate is not sufficient by itself; infrequent but very large losses can still damage total results.',
  ),
  'question.backtest-ne-soyler.2': copy(
    'Geçmiş performans, piyasa rejimi ve varsayımlar değiştiğinde tekrarlanmayabilir; bu yüzden genellenebilirlik ayrıca test edilir.',
    'Historical performance may not repeat when regimes or assumptions change, so generalizability must be tested separately.',
  ),
  'question.backtestte-islem-maliyetleri.3': copy(
    'Komisyon, spread, slippage ve piyasa etkisi hesaba katılmadığında backtest uygulanabilir performansı olduğundan yüksek gösterebilir.',
    'If commissions, spreads, slippage, and market impact are omitted, a backtest can overstate implementable performance.',
  ),
  'question.robustness-nasil-test-edilir.3': copy(
    'Robustness testi geleceği garanti etmez; yalnız sonucun tek bir veri kesiti veya hassas ayara bağımlı olmadığını sınar.',
    'Robustness testing does not guarantee the future; it checks whether results depend excessively on one sample or fragile setting.',
  ),
  'question.liquidity-grab-ve-sweep-farki.3': copy(
    'Grab etiketi yön kararı vermez; yapı, zaman dilimi, invalidation ve risk birlikte değerlendirilmelidir.',
    'A grab label does not determine direction; structure, timeframe, invalidation, and risk still need to be evaluated together.',
  ),
  'question.fvg-smc-baglaminda-nasil-okunur.1': copy(
    'Bir FVG gelecekte mutlaka doldurulmaz; fiyat alanı hiç test etmeyebilir, kısmen test edebilir veya içinden geçebilir.',
    'An FVG does not have to be filled later; price may never revisit it, may test it partially, or may trade through it.',
  ),
  'question.mitigation-ne-anlatir.1': copy(
    'Mitigation teması yalnız bölge etkileşimini gösterir; sonraki yön ve yapı ayrıca gözlenmelidir.',
    'A mitigation touch only shows interaction with a zone; subsequent direction and structure still need separate observation.',
  ),
  'question.dealing-range-ve-equilibrium.2': copy(
    'Premium, discount ve equilibrium etiketleri seçilen range sınırlarına göre değişir; referans değişirse sınıflama da değişebilir.',
    'Premium, discount, and equilibrium labels depend on the chosen range boundaries; changing the reference can change the classification.',
  ),
  'question.premium-discount-ne-anlatir.1': copy(
    'Premium veya discount, seçilen range içindeki göreli fiyat konumunu anlatır; tek başına pahalı veya ucuz hükmü vermez.',
    'Premium or discount describes relative price location within a chosen range; it does not by itself prove something is expensive or cheap.',
  ),
  'question.premium-discount-ne-anlatir.2': copy(
    'Göreli fiyat konumu tek başına işlem kararı değildir; yapı, senaryo, invalidation ve risk bağlamı gerekir.',
    'Relative price location is not a trade decision by itself; structure, scenario, invalidation, and risk context are still required.',
  ),
  'question.mss-choch-ile-ayni-mi.1': copy(
    'MSS ve CHoCH için kullanılan swing, kapanış ve teyit kriterleri kaynağa göre değişebildiğinden terimler birebir eşit değildir.',
    'MSS and CHoCH are not automatically identical because swing, close, and confirmation criteria can vary across methodologies.',
  ),
  'question.etf-nav-ve-tracking-farki.2': copy(
    'Fonun maliyetleri ve uygulama yöntemi benchmark getirisiyle birebir eşleşmeyi engelleyebilir ve tracking farkı yaratabilir.',
    'Fund costs and implementation choices can prevent exact benchmark matching and create tracking differences.',
  ),
  'question.kaldiracli-ve-ters-etf-gunluk-reset.1': copy(
    'Günlük reset nedeniyle yüzdesel getiriler dönem boyunca bileşiklenir; uzun vadeli sonuç basit kat çarpımından sapabilir.',
    'Daily reset causes percentage returns to compound over time, so longer-horizon results can diverge from a simple leverage multiple.',
  ),
  'question.fx-carry-ve-rollover.1': copy(
    'Carry ve rollover, kur hareketinden ayrı bir finansman getiri veya maliyet bileşeni oluşturabilir.',
    'Carry and rollover can create a financing return or cost component that is separate from the currency move itself.',
  ),
};

export function normalizeQuizExplanationQuality(lesson: MicroLesson): MicroLesson {
  let changed = false;

  const questions = lesson.quiz.questions.map((question) => {
    const explanation = QUIZ_EXPLANATION_OVERRIDES[question.id];
    if (!explanation) return question;

    changed = true;
    return {
      ...question,
      explanation,
    };
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
