import { microLessonSchema } from '../../schemas';
import type { LocalizedText, MicroLesson } from '../../types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface AssessmentCopyOverride {
  readonly takeaway?: LocalizedText;
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
    takeaway: copy(
      'Kaldıraçlı ETF’de çarpanı değil önce hangi süre için hedeflendiğini oku.',
      'For leveraged ETFs, read the target horizon before the multiple.',
    ),
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
  'lesson.asset.fx.session-event.001': {
    questionOptions: {
      'question.fx-seans-ve-makro-olay-riski.1': {
        a: copy(
          'Evet; seans yoğunluğu, tatil ve haber akışı spreadi değiştirebilir',
          'Yes; session activity, holidays, and news flow can change spreads',
        ),
        b: copy(
          'Hayır; 24/5 işlem gören bir paritede spread gün boyunca sabittir',
          'No; a pair trading 24/5 has a constant spread throughout the day',
        ),
        c: copy(
          'Spread yalnız haftanın ilk işlem saatinde değişebilir',
          'Spreads can change only during the first trading hour of the week',
        ),
      },
      'question.fx-seans-ve-makro-olay-riski.2': {
        a: copy(
          'Evet; hızlı fiyatlama ve incelen likidite slippage riskini artırabilir',
          'Yes; rapid repricing and thinner liquidity can increase slippage risk',
        ),
        b: copy(
          'Hayır; makro veri yalnız yönü etkiler, execution kalitesini etkilemez',
          'No; macro data affects only direction, not execution quality',
        ),
        c: copy(
          'Makro veri slippage riskini yalnız egzotik paritelerde değiştirir',
          'Macro releases change slippage risk only in exotic pairs',
        ),
      },
      'question.fx-seans-ve-makro-olay-riski.3': {
        a: copy(
          'Hayır; ilgili finans merkezleri ve aktif katılımcılar pariteye göre değişir',
          'No; relevant financial centers and active participants differ by currency pair',
        ),
        b: copy(
          'Evet; tüm pariteler her seansı aynı yoğunlukta yaşar',
          'Yes; every currency pair experiences every session with the same intensity',
        ),
        c: copy(
          'Yalnız majör paritelerde seans etkisinin aynı olduğu varsayılabilir',
          'Session effects can be assumed identical only for major pairs',
        ),
      },
    },
  },
  'lesson.asset.commodity.spot-futures.001': {
    taskChoices: {
      color: copy(
        'Vadeli fiyatın spot fiyatından yalnız grafik sağlayıcısı nedeniyle farklılaştığını varsaymak',
        'Assuming futures differ from spot only because of the chart provider',
      ),
    },
    questionOptions: {
      'question.emtiada-spot-ve-vadeli-fiyat.1': {
        a: copy(
          'Evet; taşıma, depolama, stok ve vade koşulları fiyatları ayırabilir',
          'Yes; carry, storage, inventories, and maturity conditions can separate prices',
        ),
        b: copy(
          'Hayır; aynı emtianın spot ve vadeli fiyatı her an eşit olmalıdır',
          'No; spot and futures for the same commodity must be identical at all times',
        ),
        c: copy(
          'Yalnız değerli metallerde spot ve vadeli fiyat farklılaşabilir',
          'Only precious metals can have different spot and futures prices',
        ),
      },
      'question.emtiada-spot-ve-vadeli-fiyat.2': {
        a: copy(
          'Evet; her vade farklı taşıma ve arz-talep koşullarını fiyatlayabilir',
          'Yes; each maturity can price different carry and supply-demand conditions',
        ),
        b: copy(
          'Hayır; tüm vadeler aynı teslimat fiyatını paylaşmalıdır',
          'No; all maturities must share the same delivery price',
        ),
        c: copy(
          'Vadeler yalnız sözleşme adı değiştiği için farklı görünür, fiyat değişmez',
          'Maturities only look different because the contract name changes; price does not',
        ),
      },
      'question.emtiada-spot-ve-vadeli-fiyat.3': {
        a: copy(
          'Evet; depolama, teslimat, kalite ve stok koşulları fiyatlamaya girebilir',
          'Yes; storage, delivery, grade, and inventory conditions can enter pricing',
        ),
        b: copy(
          'Hayır; fiziksel özellikler finansal kontrat fiyatlamasından tamamen ayrıdır',
          'No; physical characteristics are completely separate from financial contract pricing',
        ),
        c: copy(
          'Fiziksel koşullar yalnız kontrat vadesi dolduktan sonra önem kazanır',
          'Physical conditions matter only after a futures contract expires',
        ),
      },
    },
  },
  'lesson.asset.commodity.term-structure.001': {
    taskChoices: {
      earnings: copy(
        'Spot yönü sabitse vade eğrisi ve roll yönteminin sonucu değiştirmediğini varsaymak',
        'Assuming the futures curve and roll method cannot affect returns when spot direction is unchanged',
      ),
    },
    questionOptions: {
      'question.contango-backwardation-ve-roll.1': {
        b: copy(
          'Yakın ve uzak vadelerin yaklaşık aynı fiyatlandığı düz eğriyi',
          'A roughly flat curve where near and later maturities trade at similar levels',
        ),
        c: copy(
          'Yakın vadelerin uzak vadelerden daha yüksek fiyatlandığı backwardation eğrisini',
          'A backwardation curve where near maturities trade above later ones',
        ),
      },
      'question.contango-backwardation-ve-roll.2': {
        b: copy(
          'Aynı kontratı vade sonundan sonra değişmeden taşımaya devam eder',
          'Keeps holding the same expired contract unchanged after maturity',
        ),
        c: copy(
          'Spot varlığı otomatik olarak vadeli kontrata dönüştürür',
          'Automatically converts the spot asset into a futures contract',
        ),
      },
      'question.contango-backwardation-ve-roll.3': {
        a: copy(
          'Evet; roll, collateral, ücret ve vade eğrisi spot getiriden ayrı etki yaratabilir',
          'Yes; roll, collateral, fees, and the futures curve can create effects separate from spot return',
        ),
        b: copy(
          'Hayır; futures tabanlı ürün spot getiriyi her koşulda birebir kopyalar',
          'No; a futures-based product replicates spot return exactly in every condition',
        ),
        c: copy(
          'Fark yalnız spot fiyat düşerse oluşur; yatay veya yükselen piyasada oluşmaz',
          'A difference occurs only when spot falls, not when it is flat or rising',
        ),
      },
    },
  },
  'lesson.asset.crypto.perpetual-funding.001': {
    taskChoices: {
      dividend: copy(
        'Perpetual kontratta spot yönü dışında ek taşıma bileşeni olmadığını varsaymak',
        'Assuming a perpetual has no carrying component beyond spot direction',
      ),
      split: copy(
        'Mark price spota yakınsa funding ödemesinin sonucu etkileyemeyeceğini varsaymak',
        'Assuming funding cannot affect P&L when mark price stays near spot',
      ),
    },
    questionOptions: {
      'question.kripto-perpetual-ve-funding.1': {
        a: copy(
          'Genellikle hayır; perpetual yapı sabit vade yerine devam eden türev exposure sunar',
          'Generally no; a perpetual provides continuing derivative exposure rather than a fixed expiry',
        ),
        b: copy(
          'Evet; tüm perpetual kontratlar standart üç aylık vadeyle sona erer',
          'Yes; all perpetual contracts expire on a standard three-month schedule',
        ),
        c: copy(
          'Venue’ye göre bir yıllık sabit vade seçilir ve sonra otomatik yenilenir',
          'A fixed one-year expiry is selected by venue and then automatically renewed',
        ),
      },
      'question.kripto-perpetual-ve-funding.2': {
        a: copy(
          'Evet; oran piyasa dengesi, formül ve venue koşullarına göre değişebilir',
          'Yes; the rate can change with market balance, formula, and venue conditions',
        ),
        b: copy(
          'Hayır; funding oranı kontrat açıldığında sabitlenir',
          'No; the funding rate is fixed when the contract is opened',
        ),
        c: copy(
          'Funding yalnız fiyat spotun altındayken değişebilir',
          'Funding can change only when the perpetual trades below spot',
        ),
      },
      'question.kripto-perpetual-ve-funding.3': {
        a: copy(
          'Hayır; fiyat, kaldıraç, liquidation ve venue riski devam eder',
          'No; price, leverage, liquidation, and venue risks remain',
        ),
        b: copy(
          'Evet; pozitif funding oranı yön ve liquidation riskini ortadan kaldırır',
          'Yes; positive funding removes directional and liquidation risk',
        ),
        c: copy(
          'Yalnız düşük kaldıraçta funding risk-free getiri sayılabilir',
          'Funding can be treated as risk-free only at low leverage',
        ),
      },
    },
  },
  'lesson.asset.crypto.venue-custody.001': {
    takeaway: copy(
      'Kriptoda neye sahip olduğun kadar nerede, nasıl ve hangi karşı tarafla tuttuğun da önemlidir.',
      'In crypto, where, how, and with whom you hold exposure matters alongside what you hold.',
    ),
    taskChoices: {
      candle: copy(
        'Fiyat volatilitesinin artması; custody ve karşı taraf yapısının değişmemesi',
        'Higher price volatility while custody and counterparty structure remain unchanged',
      ),
      trend: copy(
        'Spot yön tahmininin yanlış çıkması; platform erişiminin normal çalışması',
        'A wrong spot-direction thesis while platform access continues to work normally',
      ),
    },
    questionOptions: {
      'question.kripto-venue-custody-ve-karsi-taraf-riski.1': {
        a: copy(
          'Evet; erişim, karşı taraf veya operasyon sorunu fiyat yönünden bağımsız zarar yaratabilir',
          'Yes; access, counterparty, or operational failures can create losses independent of price direction',
        ),
        b: copy(
          'Hayır; fiyat yönü doğruysa venue ve custody riski ekonomik sonucu değiştiremez',
          'No; if price direction is right, venue and custody risk cannot change the economic outcome',
        ),
        c: copy(
          'Yalnız kaldıraç kullanıldığında venue riski fiyat yönünden bağımsız hale gelir',
          'Venue risk becomes independent of price direction only when leverage is used',
        ),
      },
      'question.kripto-venue-custody-ve-karsi-taraf-riski.2': {
        a: copy(
          'Evet; anahtar yönetimi, karşı taraf ve operasyon sorumluluğu yönteme göre değişir',
          'Yes; key management, counterparty exposure, and operational responsibility differ by method',
        ),
        b: copy(
          'Hayır; asset aynıysa tüm custody yöntemleri aynı risk profilini taşır',
          'No; if the asset is the same, every custody method has the same risk profile',
        ),
        c: copy(
          'Custody yöntemi yalnız işlem ücretini değiştirir, erişim veya karşı taraf riskini değiştirmez',
          'Custody changes only fees, not access or counterparty risk',
        ),
      },
      'question.kripto-venue-custody-ve-karsi-taraf-riski.3': {
        a: copy(
          'Hayır; rezerv görünümü tüm yükümlülük ve operasyon riskini tek başına kapsamaz',
          'No; reserve visibility alone does not cover all liabilities and operational risks',
        ),
        b: copy(
          'Evet; proof-of-reserves tüm bilanço ve saklama güvenliğini kanıtlar',
          'Yes; proof-of-reserves proves the full balance sheet and custody safety',
        ),
        c: copy(
          'Yalnız rezervler zincir üstünde görünüyorsa tüm yükümlülüklerin karşılandığı kabul edilir',
          'All liabilities can be assumed covered whenever reserves are visible on-chain',
        ),
      },
    },
  },
  'lesson.asset.crypto.onchain-limits.001': {
    questionOptions: {
      'question.onchain-veri-ne-soyler-ne-soylemez.1': {
        a: copy(
          'Hayır; transfer gözlenir ama ekonomik amaç ayrıca yorumlanır',
          'No; the transfer is observable but its economic purpose must be inferred separately',
        ),
        b: copy(
          'Evet; transfer yönü adres sahibinin sonraki alım-satım niyetini doğrudan gösterir',
          'Yes; transfer direction directly reveals the address owner’s next trading intent',
        ),
        c: copy(
          'Niyet yalnız borsa adresine giden transferlerde kesin olarak okunabilir',
          'Intent can be read with certainty only for transfers going to exchange addresses',
        ),
      },
      'question.onchain-veri-ne-soyler-ne-soylemez.2': {
        a: copy(
          'Hayır; merkezi borsa iç muhasebesi ve eşleşmeler off-chain gerçekleşebilir',
          'No; centralized-exchange internal accounting and matching can occur off-chain',
        ),
        b: copy(
          'Evet; merkezi borsadaki her emir ve eşleşme blockchain’e yazılır',
          'Yes; every order and match on a centralized exchange is written to the blockchain',
        ),
        c: copy(
          'Yalnız market emirleri chain üzerinde görünür, limit emirleri görünmez',
          'Only market orders appear on-chain; limit orders do not',
        ),
      },
      'question.onchain-veri-ne-soyler-ne-soylemez.3': {
        a: copy(
          'Evet; attribution çoğu zaman heuristics ve sağlayıcı verisine dayanır',
          'Yes; attribution often depends on heuristics and provider data',
        ),
        b: copy(
          'Hayır; bir kez etiketlenen adresin kimliği kalıcı ve kesin kabul edilir',
          'No; once an address is labeled its identity is permanently certain',
        ),
        c: copy(
          'Etiket doğruluğu yalnız zincirin işlem ücretine bağlıdır',
          'Label accuracy depends only on the blockchain transaction fee',
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
    takeaway: override.takeaway ?? lesson.takeaway,
    practicalTask,
    quiz: {
      ...lesson.quiz,
      questions,
    },
  });
}
