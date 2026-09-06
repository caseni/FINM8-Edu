import { microLessonSchema } from '../../schemas';
import type { LocalizedText, MicroLesson } from '../../types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface AssessmentCopyOverride {
  readonly taskChoices?: OptionCopyMap;
  readonly questionOptionsByIndex?: readonly OptionCopyMap[];
}

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const SMC_ICT_ASSESSMENT_OVERRIDES: Readonly<Record<string, AssessmentCopyOverride>> = {
  'lesson.smc.methodology.001': {
    questionOptionsByIndex: [
      {
        a: copy('Hayır; aynı terim farklı kaynaklarda farklı operasyonel kriterlerle tanımlanabilir', 'No; the same term can use different operational criteria across sources'),
        b: copy('Evet; SMC/ICT terimlerinin tek ve evrensel teknik tanımı vardır', 'Yes; SMC/ICT terms have one universal technical definition'),
        c: copy('Tanım farkı yalnız varlık sınıfından gelir, metodolojiden gelmez', 'Definition differences come only from asset class, not methodology'),
      },
      {
        a: copy('Hayır; etiket bağlam, risk ve doğrulama olmadan tek başına işlem sinyali değildir', 'No; a label is not a standalone trade signal without context, risk, and validation'),
        b: copy('Evet; doğru etiket bulunduğunda ek bağlam veya risk değerlendirmesi gerekmez', 'Yes; once the correct label is found no further context or risk assessment is needed'),
        c: copy('Yalnız yüksek zaman dilimindeki etiketler tek başına işlem sinyali sayılır', 'Only higher-timeframe labels count as standalone trade signals'),
      },
      {
        a: copy('Hayır; grafik davranışı gözlenir ama katılımcı niyeti doğrudan kanıtlanmaz', 'No; chart behavior is observable but participant intent is not directly proven'),
        b: copy('Evet; doğru SMC etiketi kurumsal niyetin kimden geldiğini kanıtlar', 'Yes; the correct SMC label proves whose institutional intent caused the move'),
        c: copy('Niyet yalnız displacement eşlik ettiğinde kesin olarak okunabilir', 'Intent can be known with certainty only when displacement is present'),
      },
    ],
  },
  'lesson.smc.liquidity-sweep.001': {
    questionOptionsByIndex: [
      {
        a: copy('Hayır; sweep sonrası yapı devam edebilir veya farklı davranabilir', 'No; structure can continue or behave differently after a sweep'),
        b: copy('Evet; belirgin seviyenin sweep edilmesi zorunlu olarak ters yön başlatır', 'Yes; sweeping a clear level necessarily starts a reversal'),
        c: copy('Yalnız referans günlük seviyedeyse dönüş garanti kabul edilir', 'A reversal can be treated as guaranteed only when the reference is a daily level'),
      },
      {
        a: copy('Evet; hangi swing veya seviyenin referans alındığı tanımın anlamını belirler', 'Yes; the chosen swing or level determines what the definition means'),
        b: copy('Hayır; herhangi küçük taşma aynı sweep kalitesini taşır', 'No; any minor overshoot has the same sweep quality'),
        c: copy('Referans seviyesi yalnız hacim verisi yoksa önem kazanır', 'The reference level matters only when volume data is unavailable'),
      },
      {
        a: copy('Hayır; sweep fiyat davranışını tarif eder, manipülasyon niyetini kanıtlamaz', 'No; a sweep describes price behavior and does not prove manipulative intent'),
        b: copy('Evet; seviye ötesine geçiş tek başına manipülasyonun doğrudan kanıtıdır', 'Yes; trading beyond a level alone is direct proof of manipulation'),
        c: copy('Manipülasyon yalnız seviye fitille aşıldığında kesinleşir', 'Manipulation becomes certain only when the level is breached by a wick'),
      },
    ],
  },
  'lesson.smc.liquidity-grab.001': {
    questionOptionsByIndex: [
      {
        a: copy('Evet; bazı yöntemler grab ve sweep’i ayırırken bazıları örtüşen terimler olarak kullanır', 'Yes; some methods distinguish grab from sweep while others use overlapping terms'),
        b: copy('Hayır; grab ve sweep arasında tüm kaynakların kabul ettiği sabit bir sınır vardır', 'No; there is one fixed boundary between grab and sweep accepted by every source'),
        c: copy('Tanım farkı yalnız forex piyasasında görülür', 'Definition differences occur only in FX markets'),
      },
      {
        a: copy('Önceden belirlenmiş kriter olmadığı için sonuç görüldükten sonra etiketi uyarlamaya yol açabilir', 'Without predefined criteria it can lead to fitting the label after seeing the outcome'),
        b: copy('Etiketi sonradan seçmek yalnız spread ölçümünü etkiler, yorum tarafsız kalır', 'Choosing the label afterward affects only spread measurement while interpretation stays neutral'),
        c: copy('Sonradan etiketleme yalnız yüksek hacimli piyasalarda güvenilirdir', 'Post-hoc labeling is reliable only in high-volume markets'),
      },
      {
        a: copy('Hayır; grab etiketi bağlam ve risk değerlendirmesinin yerine geçmez', 'No; a grab label does not replace context and risk assessment'),
        b: copy('Evet; grab görüldüğünde yön ve giriş noktası otomatik belirlenmiş olur', 'Yes; once a grab appears direction and entry are automatically determined'),
        c: copy('Yalnız grab küçük zaman diliminde oluşursa otomatik sinyal sayılır', 'A grab is automatic only when it occurs on a lower timeframe'),
      },
    ],
  },
  'lesson.smc.inducement.001': {
    questionOptionsByIndex: [
      {
        a: copy('Hayır; inducement etiketi bir ara referansı tarif edebilir ama kasıtlı kandırmayı kanıtlamaz', 'No; an inducement label can describe an intermediate reference but does not prove intentional deception'),
        b: copy('Evet; ara swing’in kırılması bir aktörün traderları kasıtlı kandırdığını gösterir', 'Yes; breaking an intermediate swing shows that an actor intentionally deceived traders'),
        c: copy('Kasıt yalnız aynı bölgede liquidity sweep de oluşursa kesinleşir', 'Intent becomes certain only when a liquidity sweep also occurs in the same area'),
      },
      {
        a: copy('Evet; hangi ara seviyenin inducement sayılacağı kullanılan çerçeveye göre değişebilir', 'Yes; which intermediate level qualifies as inducement can vary by framework'),
        b: copy('Hayır; her metodoloji aynı swing seçme kuralını kullanır', 'No; every methodology uses the same swing-selection rule'),
        c: copy('Tanım yalnız hisse piyasasında metodolojiye bağlıdır', 'The definition is methodology-dependent only in equities'),
      },
      {
        a: copy('Evet; yorumun hangi koşulda geçersiz sayılacağı önceden tanımlanmalıdır', 'Yes; the condition that invalidates the interpretation should be defined in advance'),
        b: copy('Hayır; inducement etiketi konduktan sonra yorumun geçersizleşme koşuluna gerek yoktur', 'No; once inducement is labeled there is no need for an invalidation condition'),
        c: copy('Falsification yalnız tamamen otomatik stratejilerde gerekir', 'Falsification is required only for fully automated strategies'),
      },
    ],
  },
  'lesson.smc.displacement.001': {
    taskChoices: {
      size: copy('Tek mumun son döneme göre gerçekten olağan dışı olup olmadığını ve yapısal sonuç üretip üretmediğini ayırmadan yalnız mutlak boyuta bakmak', 'Judge only absolute candle size without comparing it with recent volatility or structural consequence'),
      color: copy('Yönlü gövde görünümünü tek başına yeterli sayıp follow-through ve kırılan yapıyı dikkate almamak', 'Treat directional candle appearance as sufficient while ignoring follow-through and broken structure'),
    },
    questionOptionsByIndex: [
      {
        a: copy('Hayır; boyutun yanında hız, göreli volatilite, yapı ve devam davranışı gerekir', 'No; size must be combined with speed, relative volatility, structure, and follow-through'),
        b: copy('Evet; görsel olarak uzun her mum bağlamdan bağımsız displacement sayılır', 'Yes; every visually long candle is displacement regardless of context'),
        c: copy('Yalnız haber saatinde oluşan büyük mumlar displacement sayılır', 'Only large candles formed around news events count as displacement'),
      },
      {
        a: copy('Evet; mum genişlemesinin olağan dışı olup olmadığı yakın dönem volatilitesine göre değerlendirilir', 'Yes; whether range expansion is unusual is assessed relative to recent volatility'),
        b: copy('Hayır; displacement yalnız mutlak puan veya yüzde büyüklüğüyle tanımlanır', 'No; displacement is defined only by absolute point or percentage size'),
        c: copy('Yakın dönem volatilitesi yalnız aylık grafiklerde dikkate alınır', 'Recent volatility matters only on monthly charts'),
      },
      {
        a: copy('Hayır; displacement gözlemi giriş kararı için bağlam, risk ve devam kanıtının yerine geçmez', 'No; observing displacement does not replace context, risk, and follow-through for an entry decision'),
        b: copy('Evet; displacement görüldüğü anda yön ve giriş otomatik doğrulanmış olur', 'Yes; direction and entry are automatically validated as soon as displacement appears'),
        c: copy('Yalnız yükseliş displacement’ı tek başına giriş sinyali sayılır', 'Only bullish displacement counts as a standalone entry signal'),
      },
    ],
  },
  'lesson.smc.fvg-context.001': {
    questionOptionsByIndex: [
      {
        a: copy('Hayır; fiyat FVG’ye hiç dönmeyebilir, kısmen etkileşebilir veya alanı aşabilir', 'No; price may never revisit an FVG, may interact partially, or may trade through it'),
        b: copy('Evet; her FVG ileride tamamen doldurulmak zorundadır', 'Yes; every FVG must eventually be filled completely'),
        c: copy('FVG yalnız oluştuğu seans bitmeden tamamen dolmak zorundadır', 'An FVG must be fully filled before the session in which it formed ends'),
      },
      {
        a: copy('Evet; wick/body, minimum boyut ve fill kriterleri kullanılan yönteme göre değişebilir', 'Yes; wick/body, minimum-size, and fill criteria can vary by methodology'),
        b: copy('Hayır; tüm FVG tanımları aynı üç mum kuralını aynı eşiklerle uygular', 'No; every FVG definition applies the same three-candle rule with identical thresholds'),
        c: copy('Tanım farkları yalnız kripto piyasasında görülür', 'Definition differences occur only in crypto markets'),
      },
      {
        a: copy('Evet; displacement FVG’nin hızlı yeniden fiyatlama içindeki bağlamını değerlendirmeye yardım eder', 'Yes; displacement helps evaluate an FVG in the context of rapid repricing'),
        b: copy('Hayır; FVG’nin nasıl oluştuğu ve önceki fiyat hareketi değerlendirmeyle ilgisizdir', 'No; how the FVG formed and the prior price move are irrelevant to evaluation'),
        c: copy('Displacement yalnız FVG tamamen dolduktan sonra anlamlı hale gelir', 'Displacement becomes relevant only after the FVG has fully filled'),
      },
    ],
  },
  'lesson.smc.order-block-context.001': {
    questionOptionsByIndex: [
      {
        a: copy('Hayır; aday alanı anlamlı yapan displacement, yapı sonucu ve yöntem kriterleri ayrıca gerekir', 'No; displacement, structural consequence, and methodology criteria are also needed to make a candidate area meaningful'),
        b: copy('Evet; güçlü hareketten önceki son ters renkli mum otomatik olarak Order Block’tur', 'Yes; the last opposite-colored candle before a strong move is automatically an Order Block'),
        c: copy('Yalnız mumun gövdesi büyükse son ters mum otomatik Order Block sayılır', 'The last opposite candle is automatic only when its body is large'),
      },
      {
        a: copy('Evet; alan seçimi, wick/body, freshness ve invalidation kriterleri çerçeveye göre değişebilir', 'Yes; zone selection, wick/body, freshness, and invalidation criteria can vary by framework'),
        b: copy('Hayır; tüm metodolojiler aynı mum aralığını ve aynı invalidation kuralını kullanır', 'No; every methodology uses the same candle range and invalidation rule'),
        c: copy('Tanım farkı yalnız forexte oluşur, diğer piyasalarda standarttır', 'Definitions vary only in FX and are standardized in other markets'),
      },
      {
        a: copy('Hayır; işaretli alan tepki verebilir, ihlal edilebilir veya hiç yeniden test edilmeyebilir', 'No; a marked area may react, be violated, or never be retested'),
        b: copy('Evet; geçerli Order Block ilk temasta mutlaka fiyatı tersine çevirir', 'Yes; a valid Order Block must reverse price on the first touch'),
        c: copy('Tepki yalnız alan daha önce test edilmemişse garanti kabul edilir', 'A reaction is guaranteed only when the area has not been tested before'),
      },
    ],
  },
  'lesson.smc.mitigation.001': {
    questionOptionsByIndex: [
      {
        a: copy('Hayır; geri dönüş yalnız alan etkileşimidir, sonraki yapı ayrıca değerlendirilir', 'No; a revisit is only a zone interaction and subsequent structure must still be evaluated'),
        b: copy('Evet; mitigation teması işaretli alandan kesin dönüş anlamına gelir', 'Yes; a mitigation touch means a certain reversal from the marked area'),
        c: copy('Dönüş yalnız ilk mitigation temasında garanti kabul edilir', 'A reversal is guaranteed only on the first mitigation touch'),
      },
      {
        a: copy('Evet; bir alanın fresh sayılma ve önceki temaslarla durum değiştirme kuralları yönteme göre değişebilir', 'Yes; rules for freshness and state changes after prior interactions can vary by methodology'),
        b: copy('Hayır; tüm yöntemler tested/fresh alanları aynı biçimde sınıflandırır', 'No; every method classifies tested and fresh zones in the same way'),
        c: copy('Freshness yalnız hisse piyasasında kullanılan bir ayrımdır', 'Freshness is a distinction used only in equities'),
      },
      {
        a: copy('Evet; alan fikrinin hangi fiyat davranışında artık geçersiz sayılacağı açık olmalıdır', 'Yes; the price behavior that invalidates the zone idea should be explicit'),
        b: copy('Hayır; mitigation etiketi varsa alanın invalidation koşulu tanımlanmak zorunda değildir', 'No; if mitigation is labeled the zone does not need an invalidation condition'),
        c: copy('Invalidation yalnız trend yönü değiştikten sonra geriye dönük belirlenir', 'Invalidation is defined retrospectively only after the trend changes'),
      },
    ],
  },
  'lesson.smc.dealing-range.001': {
    questionOptionsByIndex: [
      {
        a: copy('Seçilen low-high aralığının yaklaşık orta noktasını; mutlak piyasa değerini değil', 'The approximate midpoint of the selected low-high range, not absolute market value'),
        b: copy('Varlığın temel analizle hesaplanan kesin adil değerini', 'The asset’s exact fair value calculated through fundamental analysis'),
        c: copy('Fiyatın mutlaka ulaşacağı sonraki hedef seviyeyi', 'The next price target that price must reach'),
      },
      {
        a: copy('Evet; referans low-high değişince aynı fiyatın range içindeki göreli konumu da değişebilir', 'Yes; changing the reference low-high can change the same price’s relative location within the range'),
        b: copy('Hayır; premium/discount etiketi hangi range seçilirse seçilsin değişmez', 'No; the premium/discount label stays the same regardless of the selected range'),
        c: copy('Range seçimi yalnız forexte etiketi etkiler', 'Range selection affects the label only in FX'),
      },
      {
        a: copy('Hayır; farklı zaman dilimi ve yapı hiyerarşileri farklı çalışma range’leri üretebilir', 'No; different timeframe and structural hierarchies can produce different working ranges'),
        b: copy('Evet; her grafikte tüm analistlerin kullanması gereken tek evrensel dealing range vardır', 'Yes; every chart has one universal dealing range that all analysts must use'),
        c: copy('Yalnız en geniş görünen low-high çifti geçerli dealing range sayılır', 'Only the widest visible low-high pair can be a valid dealing range'),
      },
    ],
  },
  'lesson.smc.premium-discount.001': {
    questionOptionsByIndex: [
      {
        a: copy('Hayır; premium/discount seçilmiş range içindeki göreli fiyat konumudur, içsel değer hesabı değildir', 'No; premium/discount is relative position within a selected range, not an intrinsic-value calculation'),
        b: copy('Evet; premium temel olarak pahalı, discount temel olarak ucuz olduğu anlamına gelir', 'Yes; premium fundamentally means expensive and discount fundamentally means cheap'),
        c: copy('Temel değerleme anlamı yalnız hisse senetlerinde geçerlidir', 'The fundamental-valuation meaning applies only to equities'),
      },
      {
        a: copy('Hayır; discount bölgesi tek başına yön, zamanlama veya risk kararını belirlemez', 'No; a discount zone alone does not determine direction, timing, or risk'),
        b: copy('Evet; fiyat discount bölgesine girince otomatik alım koşulu oluşur', 'Yes; entering the discount zone automatically creates a buy condition'),
        c: copy('Otomatik alım yalnız daha geniş trend yükselişse geçerli olur', 'The automatic buy condition applies only when the broader trend is bullish'),
      },
      {
        a: copy('Seçilmiş dealing range’e; etiket o aralığın içindeki göreli konumu anlatır', 'The selected dealing range; the label describes relative position within it'),
        b: copy('Şirketin bilanço verilerinden türetilen içsel değere', 'Intrinsic value derived from company financial statements'),
        c: copy('Tek bir teknik indikatörün aşırı alım/aşırı satım seviyesine', 'A single technical indicator’s overbought/oversold level'),
      },
    ],
  },
  'lesson.smc.mss.001': {
    questionOptionsByIndex: [
      {
        a: copy('Hayır; bazı yöntemler MSS ve CHoCH’u benzer kullanırken bazıları ek displacement veya teyit ister', 'No; some methods use MSS and CHoCH similarly while others require added displacement or confirmation'),
        b: copy('Evet; MSS ve CHoCH tüm kaynaklarda aynı kriterlerle tanımlanan eş anlamlı terimlerdir', 'Yes; MSS and CHoCH are synonyms defined by identical criteria in every source'),
        c: copy('Fark yalnız kullanılan piyasa türünden gelir, metodolojiden gelmez', 'The difference comes only from market type, not methodology'),
      },
      {
        a: copy('Hayır; MSS mevcut yapıda değişim ihtimalini anlatabilir ama devam kanıtı olmadan dönüş garantisi değildir', 'No; MSS can describe a possible structural shift but is not a reversal guarantee without follow-through'),
        b: copy('Evet; ilk MSS etiketi daha geniş trendin kesin olarak döndüğünü kanıtlar', 'Yes; the first MSS label proves the broader trend has definitively reversed'),
        c: copy('Dönüş yalnız displacement mumu büyükse garanti kabul edilir', 'A reversal is guaranteed only when the displacement candle is large'),
      },
      {
        a: copy('Evet; küçük iç yapı değişirken daha geniş zaman dilimi yapısı korunabilir', 'Yes; smaller internal structure can change while broader-timeframe structure remains intact'),
        b: copy('Hayır; MSS hangi zaman diliminde görülürse görülsün aynı yapısal anlamı taşır', 'No; MSS has the same structural meaning regardless of timeframe'),
        c: copy('Zaman dilimi hiyerarşisi yalnız scalping stratejilerinde önemlidir', 'Timeframe hierarchy matters only in scalping strategies'),
      },
    ],
  },
  'lesson.smc.confluence-limits.001': {
    questionOptionsByIndex: [
      {
        a: copy('Hayır; aynı fiyat hareketinden türeyen etiketler ortak veri kaynağını tekrar sayıyor olabilir', 'No; labels derived from the same price move may be recounting the same data source'),
        b: copy('Evet; farklı isim taşıyan her SMC etiketi otomatik olarak bağımsız kanıttır', 'Yes; every differently named SMC label is automatically independent evidence'),
        c: copy('Bağımsızlık yalnız etiketler farklı zaman dilimindeyse otomatik oluşur', 'Independence arises automatically only when labels are on different timeframes'),
      },
      {
        a: copy('Hayır; birden çok kanıt hizalansa bile fikrin ne zaman geçersizleşeceği açık kalmalıdır', 'No; even when multiple evidence sources align the invalidation point should remain explicit'),
        b: copy('Evet; yeterli sayıda confluence etiketi oluşunca invalidation gereksiz hale gelir', 'Yes; once enough confluence labels appear invalidation becomes unnecessary'),
        c: copy('Invalidation yalnız iki veya daha az etiket varken gerekir', 'Invalidation is needed only when there are two or fewer labels'),
      },
      {
        a: copy('Aynı bilgiyi farklı adlarla tekrar sayma riskini azaltır ve kanıt kaynaklarını ayırmaya yardım eder', 'It reduces double-counting the same information under different names and helps separate evidence sources'),
        b: copy('Bağımsız veri bulunduğunda işlemin sonucunu garanti eder', 'Independent evidence guarantees the trade outcome'),
        c: copy('Bağımsız kanıtın tek görevi kullanılan indikatör sayısını artırmaktır', 'The only purpose of independent evidence is to increase the number of indicators used'),
      },
    ],
  },
};

export function normalizeSmcIctAssessmentQuality(lesson: MicroLesson): MicroLesson {
  const override = SMC_ICT_ASSESSMENT_OVERRIDES[lesson.id];
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

  const questions = lesson.quiz.questions.map((question, index) => {
    const optionOverrides = override.questionOptionsByIndex?.[index];
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
