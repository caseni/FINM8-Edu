import { createFoundationLesson } from '../wave1/foundationLessonFactory';
import { BEHAVIOR_EVIDENCE_SOURCES } from '../wave1/behaviorEvidenceSources';

const lossAversion = createFoundationLesson({
  id: 'lesson.behavior.loss-aversion.001',
  slug: 'kayip-korkusu-karari-nasil-bozar',
  conceptKey: 'behavior.loss_aversion',
  skillId: 'skill.market-psychology',
  competencyId: 'competency.recognize-loss-aversion.foundation',
  title: 'Kayıptan kaçınma kararını nasıl bozar?',
  titleEn: 'How can loss aversion distort a decision?',
  objective: 'Kayıpların neden kazançlardan daha güçlü hissedilebildiğini ve bunun kararı nasıl bozduğunu öğren.',
  objectiveEn: 'Explain how losses can feel more psychologically powerful than equal-sized gains and distort decision rules.',
  minutes: 5,
  hook: 'Aynı miktardaki kayıp, aynı miktardaki kazançtan neden daha güçlü hissedilebilir?',
  hookEn: 'Why can a loss of the same size feel stronger than an equal gain?',
  explanation: 'Kayıptan kaçınma, aynı büyüklükteki kaybın kazançtan daha ağır hissedilmesidir. Bu yüzden kişi zararı kabul etmemek için planını bozabilir, pozisyonu gereğinden uzun tutabilir veya kaybı geri almak için daha fazla risk alabilir.',
  explanationEn: 'Loss aversion is the tendency to react more strongly to losses than to gains of similar size. In markets it can show up as refusing to accept a loss, breaking a plan, or taking excessive risk simply to avoid realizing a loss.',
  proExplanation: 'Kayıptan kaçınma prospect theory çerçevesinde referans noktasına duyarlıdır. Kararın kalitesi, gerçekleşen P&L yerine önceden tanımlı risk ve geçersizlik koşullarıyla değerlendirilmelidir.',
  proExplanationEn: 'In prospect theory, loss aversion depends on a reference point. Decision quality should be evaluated against predefined risk and invalidation conditions rather than realized P&L alone.',
  misconception: 'Zararı kapatmamak için beklemeyi otomatik olarak sabır sanma.',
  misconceptionEn: 'Common mistake: assuming that refusing to close a loss is automatically patience or discipline.',
  takeaway: 'Kaybı hissetmemek için planı değiştiriyorsan kararın bozulabilir.',
  takeawayEn: 'Loss aversion can damage decision quality when you change the plan simply to avoid feeling a loss.',
  prerequisiteConceptKeys: ['behavior.decision_journal', 'risk.basics'],
  relatedConceptKeys: ['behavior.outcome_bias', 'behavior.disposition_effect', 'risk.position_sizing'],
  visualAlt: 'Aynı büyüklükte kazanç ve kaybın farklı psikolojik ağırlık yarattığını gösteren dengeli karar görseli',
  visualAltEn: 'Decision visual showing equal-sized gains and losses carrying different psychological weight',
  taskPrompt: 'Hangi davranış kayıptan kaçınmaya daha güçlü işaret eder?',
  taskPromptEn: 'Which behavior is a stronger sign of loss aversion?',
  taskChoices: [
    { id: 'change', label: 'Sadece zararı realize etmemek için önceden belirlenmiş çıkış kuralını değiştirmek', labelEn: 'Changing a predefined exit rule only to avoid realizing a loss' },
    { id: 'review', label: 'Yeni veri geldiğinde tezi yeniden değerlendirmek', labelEn: 'Reassessing the thesis when new evidence arrives' },
    { id: 'size', label: 'Pozisyon boyutunu işlem öncesi belirlemek', labelEn: 'Sizing the position before the trade' },
  ],
  taskCorrectIds: ['change'],
  questions: [
    { prompt: 'Kayıptan kaçınma neyi anlatır?', promptEn: 'What does loss aversion describe?', choices: [{ id: 'a', label: 'Kayıpların benzer kazançlardan daha güçlü hissedilebilmesini', labelEn: 'Losses feeling stronger than similar gains' }, { id: 'b', label: 'Her kaybın yanlış karar olduğunu', labelEn: 'Every loss being a bad decision' }, { id: 'c', label: 'Riskin tamamen yok edilebileceğini', labelEn: 'Risk can be eliminated completely' }], correctId: 'a', explanation: 'Kavram psikolojik ağırlık farkını açıklar.', explanationEn: 'The concept describes an asymmetry in psychological weight.' },
    { prompt: 'Kayıptan kaçınma hangi davranışı tetikleyebilir?', promptEn: 'What can loss aversion trigger?', choices: [{ id: 'a', label: 'Planı yalnız zararı kabul etmemek için bozmayı', labelEn: 'Breaking the plan only to avoid accepting a loss' }, { id: 'b', label: 'Kaynak kontrolünü', labelEn: 'Source checking' }, { id: 'c', label: 'Pozisyonu önceden boyutlandırmayı', labelEn: 'Pre-sizing the position' }], correctId: 'a', explanation: 'Duygusal kayıp kaçınması önceden belirlenmiş kuralları aşındırabilir.', explanationEn: 'Emotional loss avoidance can erode predefined rules.' },
    { prompt: 'Bir kayıp tek başına kararın kötü olduğunu kanıtlar mı?', promptEn: 'Does a loss by itself prove the decision was bad?', choices: [{ id: 'a', label: 'Hayır', labelEn: 'No' }, { id: 'b', label: 'Evet', labelEn: 'Yes' }, { id: 'c', label: 'Yalnız kısa vadede', labelEn: 'Only short term' }], correctId: 'a', explanation: 'Karar kalitesi süreç ve kanıtla değerlendirilir.', explanationEn: 'Decision quality is assessed through process and evidence.' },
  ],
  sources: [BEHAVIOR_EVIDENCE_SOURCES.behavior],
});

const anchoring = createFoundationLesson({
  id: 'lesson.behavior.anchoring.001', slug: 'ilk-fiyata-capalanmak', conceptKey: 'behavior.anchoring', skillId: 'skill.market-psychology', competencyId: 'competency.recognize-anchoring.foundation',
  title: 'İlk gördüğün fiyata neden çapalanırsın?', titleEn: 'Why do you anchor to the first price you see?',
  objective: 'İlk gördüğün fiyatın sonraki kararlarını neden gereğinden fazla etkileyebildiğini öğren.', objectiveEn: 'Explain how an initial price, target, or opinion can exert too much influence on later judgments.', minutes: 5,
  hook: 'Bir varlığı 100’den gördüğün için 80 sana otomatik olarak “ucuz” gelir mi?', hookEn: 'If you first saw an asset at 100, does 80 automatically become “cheap”?',
  explanation: 'Çapalama, ilk gördüğün sayı veya fikri gereğinden güçlü referans yapmaktır. Eski fiyat, analist hedefi veya kendi alış fiyatın yeni verilerden daha önemliymiş gibi gelebilir.', explanationEn: 'Anchoring occurs when an initial number or idea becomes an overly powerful reference for later judgments. An old price, analyst target, or your own entry price can begin to matter more than new evidence.',
  proExplanation: 'Anchor etkisi değerleme, hedef fiyat ve zarar yönetiminde görülebilir. Güncel koşullar değiştiğinde referans noktasını veriyle yeniden kurmak gerekir.', proExplanationEn: 'Anchors can affect valuation, target prices, and loss management. When conditions change, the reference point should be rebuilt from current evidence.',
  misconception: '“Eskiden 100’dü, şimdi 80; demek ki ucuz” diye ek kanıt olmadan karar verme.', misconceptionEn: 'Common mistake: concluding “it was 100, now it is 80, so it must be cheap” without other evidence.',
  takeaway: 'Eski fiyat referanstır; ucuzluk kanıtı değildir.', takeawayEn: 'An old price is a reference point, not evidence of value.',
  prerequisiteConceptKeys: ['evidence.data_quality'], relatedConceptKeys: ['fundamental.valuation_multiples', 'behavior.confirmation_bias', 'behavior.sunk_cost'],
  visualAlt: '100 seviyesindeki eski referans ile 80 seviyesindeki güncel fiyatın yeni veriden ayrı tutulduğunu gösteren sade görsel', visualAltEn: 'Simple visual separating an old 100 reference from a current price of 80 and new evidence',
  taskPrompt: 'Hangi ifade çapalama örneğidir?', taskPromptEn: 'Which statement is an example of anchoring?',
  taskChoices: [{ id: 'old', label: '“Geçen ay 100’dü; 80 mutlaka ucuzdur.”', labelEn: '“It was 100 last month; 80 must be cheap.”' }, { id: 'new', label: '“Yeni verilerle varsayımlarımı yeniden kuracağım.”', labelEn: '“I will rebuild my assumptions using new evidence.”' }, { id: 'range', label: '“Fiyat tek başına değer değildir.”', labelEn: '“Price alone is not value.”' }], taskCorrectIds: ['old'],
  questions: [
    { prompt: 'Çapalama nedir?', promptEn: 'What is anchoring?', choices: [{ id: 'a', label: 'İlk referansın sonraki yargıları gereğinden fazla etkilemesi', labelEn: 'An initial reference exerting too much influence on later judgments' }, { id: 'b', label: 'Her yeni veriyi eşit tartmak', labelEn: 'Weighing every new datum equally' }, { id: 'c', label: 'Sadece teknik analiz kullanmak', labelEn: 'Using only technical analysis' }], correctId: 'a', explanation: 'Anchor, ilk referansın gereğinden fazla ağırlık kazanmasıdır.', explanationEn: 'An anchor is an initial reference that receives too much weight.' },
    { prompt: 'Giriş fiyatın şirketin gerçek değerini belirler mi?', promptEn: 'Does your entry price determine a company’s true value?', choices: [{ id: 'a', label: 'Hayır', labelEn: 'No' }, { id: 'b', label: 'Evet', labelEn: 'Yes' }, { id: 'c', label: 'Yalnız zarardayken', labelEn: 'Only when losing' }], correctId: 'a', explanation: 'Giriş fiyatın sana özeldir; piyasa ve temel veriler ondan bağımsızdır.', explanationEn: 'Your entry price is personal; market and fundamental evidence are independent of it.' },
    { prompt: 'Çapalamayı azaltmak için ne yapılabilir?', promptEn: 'What can reduce anchoring?', choices: [{ id: 'a', label: 'Güncel veriyle referansı yeniden kurmak', labelEn: 'Rebuild the reference using current evidence' }, { id: 'b', label: 'İlk fiyatı hiç değiştirmemek', labelEn: 'Never change the first reference' }, { id: 'c', label: 'Sadece sosyal medyaya bakmak', labelEn: 'Use only social media' }], correctId: 'a', explanation: 'Yeni bilgi eski referansın ağırlığını yeniden değerlendirmeyi gerektirir.', explanationEn: 'New information requires reassessing the old reference.' },
  ], sources: [BEHAVIOR_EVIDENCE_SOURCES.behavior],
});

const recency = createFoundationLesson({
  id: 'lesson.behavior.recency-bias.001', slug: 'son-olay-her-sey-midir', conceptKey: 'behavior.recency_bias', skillId: 'skill.market-psychology', competencyId: 'competency.recognize-recency.foundation',
  title: 'Son yaşanan olay neden gözünde büyür?', titleEn: 'Why can the latest event loom too large?',
  objective: 'Son yaşanan olayların neden gözünde gereğinden fazla büyüyebildiğini öğren.', objectiveEn: 'Distinguish when recent events receive too much weight compared with older but relevant evidence.', minutes: 5,
  hook: 'Üç güçlü gün gördün diye trendin artık hep güçlü kalacağını düşünmek mantıklı mı?', hookEn: 'After three strong days, is it reasonable to assume the trend will stay strong indefinitely?',
  explanation: 'Yakın geçmiş yanlılığı, son yaşanan olayların zihinde daha canlı olduğu için fazla önemli görünmesidir. Son birkaç kazanç, kayıp veya haber bütün resmi temsil etmeyebilir.', explanationEn: 'Recency bias makes the newest events feel more important because they are easier to recall. A few recent gains, losses, or headlines may not represent the full evidence set.',
  proExplanation: 'Kısa örneklem ve rejim değişimleri recency bias ile birleştiğinde trend extrapolation ve yanlış güven yaratabilir. Farklı dönemleri ve baz oranlarını karşılaştırmak yararlıdır.', proExplanationEn: 'Small samples and regime shifts can combine with recency bias to create trend extrapolation and false confidence. Comparing different periods and base rates helps.',
  misconception: 'Son birkaç olayı uzun dönemin güvenilir özeti sanma.', misconceptionEn: 'Common mistake: treating the last few observations as a reliable summary of long-run behavior.',
  takeaway: 'Yeni bilgi önemlidir; en önemli bilgi olmak zorunda değildir.', takeawayEn: 'New information matters, but being recent does not automatically make it the most important information.',
  prerequisiteConceptKeys: ['evidence.freshness'], relatedConceptKeys: ['behavior.availability_bias', 'market.technical.momentum', 'portfolio.stress_testing'],
  visualAlt: 'Son üç veri noktasının parlak, daha uzun geçmişin ise arka planda kaldığını ve tüm örneklemin birlikte okunması gerektiğini gösteren görsel', visualAltEn: 'Visual showing the latest three observations standing out while a longer history remains relevant',
  taskPrompt: 'Hangi düşünce recency bias örneğidir?', taskPromptEn: 'Which thought is an example of recency bias?',
  taskChoices: [{ id: 'recent', label: '“Son üç işlem kazandı; yöntem artık kesin çalışıyor.”', labelEn: '“The last three trades won; the method now definitely works.”' }, { id: 'sample', label: '“Daha uzun örnekleme ve farklı koşullara bakmalıyım.”', labelEn: '“I should examine a longer sample and different conditions.”' }, { id: 'fresh', label: '“Yeni veriyi eski verilerle birlikte değerlendireceğim.”', labelEn: '“I will evaluate new evidence alongside older evidence.”' }], taskCorrectIds: ['recent'],
  questions: [
    { prompt: 'Recency bias ne yapar?', promptEn: 'What does recency bias do?', choices: [{ id: 'a', label: 'Yakın geçmişe gereğinden fazla ağırlık verir', labelEn: 'Overweights recent events' }, { id: 'b', label: 'Tüm veriyi eşit tartar', labelEn: 'Weights all data equally' }, { id: 'c', label: 'Riski ortadan kaldırır', labelEn: 'Eliminates risk' }], correctId: 'a', explanation: 'Yakın olaylar zihinde daha erişilebilir olduğu için daha önemli görünebilir.', explanationEn: 'Recent events can feel more important because they are easier to recall.' },
    { prompt: 'Son üç kazanç uzun dönem üstünlüğü kanıtlar mı?', promptEn: 'Do three recent wins prove long-term edge?', choices: [{ id: 'a', label: 'Hayır', labelEn: 'No' }, { id: 'b', label: 'Evet', labelEn: 'Yes' }, { id: 'c', label: 'Yalnız yüksek hacimde', labelEn: 'Only at high volume' }], correctId: 'a', explanation: 'Küçük örneklem uzun dönem davranışını kanıtlamaz.', explanationEn: 'A small sample does not prove long-run behavior.' },
    { prompt: 'Recency bias’i azaltmak için ne faydalıdır?', promptEn: 'What helps reduce recency bias?', choices: [{ id: 'a', label: 'Daha uzun dönem ve farklı rejimleri incelemek', labelEn: 'Examine longer periods and different regimes' }, { id: 'b', label: 'Yalnız son güne bakmak', labelEn: 'Look only at the last day' }, { id: 'c', label: 'Sonucu önceden seçmek', labelEn: 'Choose the conclusion first' }], correctId: 'a', explanation: 'Daha geniş bağlam son olayların ağırlığını dengeler.', explanationEn: 'Broader context balances the weight of recent events.' },
  ], sources: [BEHAVIOR_EVIDENCE_SOURCES.behavior],
});

const overconfidence = createFoundationLesson({
  id: 'lesson.behavior.overconfidence.001', slug: 'asiri-guven-nasil-fark-edilir', conceptKey: 'behavior.overconfidence', skillId: 'skill.market-psychology', competencyId: 'competency.recognize-overconfidence.foundation',
  title: 'Aşırı güven nasıl fark edilir?', titleEn: 'How can overconfidence be recognized?',
  objective: 'Aşırı güvenin risk kurallarını nasıl gevşetebildiğini öğren.', objectiveEn: 'Explain how overestimating forecast accuracy, information quality, or control can distort risk decisions.', minutes: 5,
  hook: 'Arka arkaya birkaç doğru tahmin yaptıysan, daha büyük pozisyon almak otomatik olarak mantıklı olur mu?', hookEn: 'After several correct calls in a row, does taking a larger position automatically become rational?',
  explanation: 'Aşırı güven, kendi bilgi ve tahmin gücünü olduğundan yüksek görmektir. Birkaç doğru tahmin sonrası pozisyonu büyütmek, karşı kanıtı küçümsemek veya belirsizliği unutmak şeklinde görülebilir.', explanationEn: 'Overconfidence means overestimating your information or forecasting ability. It can appear as increasing size after a winning streak, discounting contrary evidence, or forgetting uncertainty.',
  proExplanation: 'Calibration, tahmin aralıkları ve ex-ante olasılık kaydı aşırı güveni görünür kılabilir. Doğru sonuç ile doğru olasılık tahmini aynı şey değildir.', proExplanationEn: 'Calibration, forecast ranges, and ex-ante probability records can expose overconfidence. A correct outcome is not the same as a well-calibrated probability estimate.',
  misconception: 'Sonuçlar iyi gidiyor diye tahmin gücünün kesin arttığını sanma.', misconceptionEn: 'Common mistake: treating recent good outcomes as proof that forecasting skill has definitely improved.',
  takeaway: 'Güven artsa da risk kuralları gevşememeli.', takeawayEn: 'When confidence rises, risk rules should not loosen; uncertainty still needs to be measured.',
  prerequisiteConceptKeys: ['behavior.decision_journal'], relatedConceptKeys: ['behavior.outcome_bias', 'behavior.recency_bias', 'risk.position_sizing'],
  visualAlt: 'Kazanç serisi sonrası güven göstergesinin yükselirken sabit risk kuralının yerinde kaldığını gösteren sade görsel', visualAltEn: 'Visual showing confidence rising after wins while the risk rule remains fixed',
  taskPrompt: 'Hangi davranış aşırı güvene daha çok işaret eder?', taskPromptEn: 'Which behavior more strongly indicates overconfidence?',
  taskChoices: [{ id: 'size', label: 'Son üç kazançtan sonra kanıt değişmeden pozisyonu iki katına çıkarmak', labelEn: 'Doubling position size after three wins without new evidence' }, { id: 'rule', label: 'Aynı risk limitini korumak', labelEn: 'Keeping the same risk limit' }, { id: 'counter', label: 'Karşı kanıt aramak', labelEn: 'Searching for contrary evidence' }], taskCorrectIds: ['size'],
  questions: [
    { prompt: 'Aşırı güven nedir?', promptEn: 'What is overconfidence?', choices: [{ id: 'a', label: 'Kendi bilgi veya tahmin gücünü olduğundan yüksek görmek', labelEn: 'Overestimating one’s knowledge or forecasting ability' }, { id: 'b', label: 'Her karardan kaçınmak', labelEn: 'Avoiding every decision' }, { id: 'c', label: 'Yalnız düşük volatilite', labelEn: 'Only low volatility' }], correctId: 'a', explanation: 'Aşırı güven öz değerlendirmeyi ve risk algısını şişirebilir.', explanationEn: 'Overconfidence can inflate self-assessment and perceived control.' },
    { prompt: 'Kazanç serisi pozisyon boyutunu otomatik artırmalı mı?', promptEn: 'Should a winning streak automatically increase position size?', choices: [{ id: 'a', label: 'Hayır', labelEn: 'No' }, { id: 'b', label: 'Evet', labelEn: 'Yes' }, { id: 'c', label: 'Her zaman iki katına', labelEn: 'Always double it' }], correctId: 'a', explanation: 'Boyut risk planı ve kanıta göre belirlenir.', explanationEn: 'Size should follow the risk plan and evidence.' },
    { prompt: 'Aşırı güveni ölçmek için ne yardımcı olur?', promptEn: 'What helps detect overconfidence?', choices: [{ id: 'a', label: 'Tahminleri önceden kaydetmek ve sonradan kalibrasyonu kontrol etmek', labelEn: 'Record forecasts in advance and review calibration later' }, { id: 'b', label: 'Yalnız kazançları hatırlamak', labelEn: 'Remember only wins' }, { id: 'c', label: 'Risk limitini kaldırmak', labelEn: 'Remove risk limits' }], correctId: 'a', explanation: 'Ex-ante kayıt, güven ile gerçekleşen sonuç arasındaki farkı görünür kılar.', explanationEn: 'Ex-ante records reveal gaps between confidence and realized outcomes.' },
  ], sources: [BEHAVIOR_EVIDENCE_SOURCES.behavior],
});

const revengeTrading = createFoundationLesson({
  id: 'lesson.behavior.revenge-trading.001', slug: 'revenge-trading-nedir', conceptKey: 'behavior.revenge_trading', skillId: 'skill.market-psychology', competencyId: 'competency.recognize-revenge-trading.foundation',
  title: 'Revenge trading nedir?', titleEn: 'What is revenge trading?',
  objective: 'Kayıp sonrası zararı hemen geri alma dürtüsünün neden tehlikeli olduğunu öğren.', objectiveEn: 'Identify the urge to recover a loss quickly by breaking risk and trading rules.', minutes: 5,
  hook: 'Bir kayıptan hemen sonra “şimdi geri almalıyım” düşüncesi neden tehlikelidir?', hookEn: 'Why is “I need to win it back now” dangerous immediately after a loss?',
  explanation: 'Revenge trading, kaybı hızla geri alma isteğiyle plansız işlem yapmaktır. Bu dürtü işlem sıklığını, pozisyon büyüklüğünü veya giriş kalitesini bozabilir.', explanationEn: 'Revenge trading is unplanned trading driven by the urge to erase the discomfort or anger of a loss quickly. Frequency, position size, or entry standards can deteriorate because the goal becomes recovering the loss.',
  proExplanation: 'Revenge trading, loss aversion ve action bias ile birlikte görülebilir. Cooling-off rule, günlük risk limiti ve önceden tanımlı reset prosedürü davranış zincirini kırabilir.', proExplanationEn: 'Revenge trading can combine with loss aversion and action bias. Cooling-off rules, daily risk limits, and predefined reset procedures can interrupt the loop.',
  misconception: 'Kayıptan hemen sonra işlem açmayı otomatik olarak disiplin sanma.', misconceptionEn: 'Common mistake: treating an immediate post-loss trade as disciplined opportunity-taking without checking whether standards changed.',
  takeaway: 'Amaç kaybı hemen geri almaksa kararın odağı bozulmuştur.', takeawayEn: 'When the goal becomes winning the loss back immediately, the focus has shifted from the market to emotional recovery.',
  prerequisiteConceptKeys: ['behavior.overtrading', 'behavior.loss_aversion'], relatedConceptKeys: ['behavior.action_bias', 'risk.position_sizing', 'behavior.precommitment'],
  visualAlt: 'Kayıp sonrası öfke, hızlı yeniden giriş ve büyüyen risk döngüsünü; yanında duraklatma ve reset yolunu gösteren görsel', visualAltEn: 'Visual comparing a loss-anger-reentry-risk loop with a pause-and-reset path',
  taskPrompt: 'Hangi davranış revenge trading’e daha yakın?', taskPromptEn: 'Which behavior is closer to revenge trading?',
  taskChoices: [{ id: 'recover', label: 'Kayıptan hemen sonra “geri almak” için normalden büyük işlem açmak', labelEn: 'Taking a larger-than-normal trade immediately to win the loss back' }, { id: 'pause', label: 'Planlı ara verip işlem kriterlerini yeniden kontrol etmek', labelEn: 'Taking a planned pause and rechecking criteria' }, { id: 'limit', label: 'Günlük risk limitini korumak', labelEn: 'Keeping the daily risk limit' }], taskCorrectIds: ['recover'],
  questions: [
    { prompt: 'Revenge trading’in temel dürtüsü nedir?', promptEn: 'What is the core urge behind revenge trading?', choices: [{ id: 'a', label: 'Kaybı hızlıca geri alma isteği', labelEn: 'The urge to win a loss back quickly' }, { id: 'b', label: 'Uzun dönem veri toplama', labelEn: 'Long-term data collection' }, { id: 'c', label: 'Portföyü dengeleme', labelEn: 'Portfolio rebalancing' }], correctId: 'a', explanation: 'Odak, işlem kalitesinden kaybı telafi etmeye kayar.', explanationEn: 'The focus shifts from decision quality to recovering the loss.' },
    { prompt: 'Revenge trading’de hangi kural bozulabilir?', promptEn: 'Which rule can deteriorate during revenge trading?', choices: [{ id: 'a', label: 'Pozisyon büyüklüğü ve giriş standardı', labelEn: 'Position size and entry standards' }, { id: 'b', label: 'Dil tercihi', labelEn: 'Language preference' }, { id: 'c', label: 'Saat biçimi', labelEn: 'Time format' }], correctId: 'a', explanation: 'Duygusal telafi dürtüsü risk ve kalite eşiklerini gevşetebilir.', explanationEn: 'The urge to recover can loosen risk and quality thresholds.' },
    { prompt: 'Hangi araç döngüyü kırmaya yardım edebilir?', promptEn: 'What can help break the loop?', choices: [{ id: 'a', label: 'Önceden tanımlı ara ve günlük risk limiti', labelEn: 'A predefined pause and daily risk limit' }, { id: 'b', label: 'Pozisyonu sürekli büyütmek', labelEn: 'Continuously increase position size' }, { id: 'c', label: 'Kayıpları kaydetmemek', labelEn: 'Stop recording losses' }], correctId: 'a', explanation: 'Önceden belirlenen reset kuralları duygusal anda karar yükünü azaltır.', explanationEn: 'Predefined reset rules reduce decision load during emotional moments.' },
  ], sources: [BEHAVIOR_EVIDENCE_SOURCES.behavior],
});

const outcomeBias = createFoundationLesson({
  id: 'lesson.behavior.outcome-bias.001', slug: 'iyi-sonuc-iyi-karar-midir', conceptKey: 'behavior.outcome_bias', skillId: 'skill.market-psychology', competencyId: 'competency.recognize-outcome-bias.foundation',
  title: 'İyi sonuç her zaman iyi karar mıdır?', titleEn: 'Is a good outcome always a good decision?',
  objective: 'İyi sonuç ile iyi kararın neden aynı şey olmadığını öğren.', objectiveEn: 'Distinguish the error of judging decision quality only by the realized outcome.', minutes: 5,
  hook: 'Plansız bir işlem kâr ettiyse, o karar otomatik olarak iyi midir?', hookEn: 'If an unplanned trade made money, was the decision automatically good?',
  explanation: 'Sonuç yanlılığı, kararın kalitesini yalnız sonuca göre değerlendirmektir. Belirsiz piyasalarda kötü süreç bazen kâr, iyi süreç bazen zarar üretebilir. Bu yüzden karar, o anda kullanılan bilgi ve kuralla da değerlendirilir.', explanationEn: 'Outcome bias means judging a decision by its result rather than the information and process available at the time. In an uncertain world, a poor process can sometimes produce a good outcome and a good process can sometimes produce a bad outcome.',
  proExplanation: 'Ex-ante thesis, probability, invalidation and risk kayıtları ex-post outcome bias’i azaltır. Process scorecard, P&L’den bağımsız karar kalitesi ölçümü sağlar.', proExplanationEn: 'Ex-ante thesis, probability, invalidation, and risk records reduce ex-post outcome bias. A process scorecard evaluates decision quality separately from P&L.',
  misconception: 'Kâr eden plansız işlemi otomatik olarak doğru, zarar eden disiplinli işlemi yanlış sayma.', misconceptionEn: 'Common mistake: labeling an unplanned winner “correct” and a disciplined loser “wrong.”',
  takeaway: 'Sonuç, karar kalitesinin tek ölçüsü değildir.', takeawayEn: 'Outcomes matter, but they are not the sole measure of decision quality.',
  prerequisiteConceptKeys: ['behavior.decision_journal', 'risk.basics'], relatedConceptKeys: ['behavior.overconfidence', 'behavior.loss_aversion', 'evidence.data_quality'],
  visualAlt: 'İyi süreç-kötü sonuç ve kötü süreç-iyi sonuç kombinasyonlarını dört kutuda ayıran karar matrisi', visualAltEn: 'Decision matrix separating good-process/bad-outcome and bad-process/good-outcome combinations',
  taskPrompt: 'Hangi yorum outcome bias örneğidir?', taskPromptEn: 'Which statement is an example of outcome bias?',
  taskChoices: [{ id: 'profit', label: '“Kâr ettim; demek ki plansız giriş doğruymuş.”', labelEn: '“I made money, so the unplanned entry must have been correct.”' }, { id: 'process', label: '“Kararı o anda sahip olduğum kanıt ve kurallarla değerlendireceğim.”', labelEn: '“I will evaluate the decision using the evidence and rules available at the time.”' }, { id: 'journal', label: '“Sonuçtan önce tezimi kaydedeceğim.”', labelEn: '“I will record my thesis before the outcome.”' }], taskCorrectIds: ['profit'],
  questions: [
    { prompt: 'Outcome bias nedir?', promptEn: 'What is outcome bias?', choices: [{ id: 'a', label: 'Karar kalitesini yalnız gerçekleşen sonuçla yargılamak', labelEn: 'Judging decision quality only by the realized outcome' }, { id: 'b', label: 'Kaynakları karşılaştırmak', labelEn: 'Comparing sources' }, { id: 'c', label: 'Riski önceden sınırlamak', labelEn: 'Limiting risk in advance' }], correctId: 'a', explanation: 'Sonuç, karar anındaki süreçten farklı bir değerlendirme katmanıdır.', explanationEn: 'The outcome is a different evaluation layer from the process at decision time.' },
    { prompt: 'İyi süreç bazen kötü sonuç verebilir mi?', promptEn: 'Can a good process sometimes produce a bad outcome?', choices: [{ id: 'a', label: 'Evet', labelEn: 'Yes' }, { id: 'b', label: 'Hayır', labelEn: 'No' }, { id: 'c', label: 'Yalnız kriptoda', labelEn: 'Only in crypto' }], correctId: 'a', explanation: 'Belirsizlik nedeniyle iyi kararlar da kayıpla sonuçlanabilir.', explanationEn: 'Under uncertainty, good decisions can still end in losses.' },
    { prompt: 'Outcome bias’i azaltmak için ne yararlıdır?', promptEn: 'What helps reduce outcome bias?', choices: [{ id: 'a', label: 'Karar gerekçesini sonuçtan önce kaydetmek', labelEn: 'Record the decision rationale before the outcome' }, { id: 'b', label: 'Sadece kazananları incelemek', labelEn: 'Review only winners' }, { id: 'c', label: 'Sonucu bilmeden risk almamak', labelEn: 'Never take risk without knowing the outcome' }], correctId: 'a', explanation: 'Önceden kayıt, sonucun geçmiş kararı yeniden yazmasını zorlaştırır.', explanationEn: 'Pre-outcome records make it harder for results to rewrite the original decision.' },
  ], sources: [BEHAVIOR_EVIDENCE_SOURCES.behavior],
});

export const MARKET_PSYCHOLOGY_FOUNDATION_LESSONS = [lossAversion, anchoring, recency, overconfidence, revengeTrading, outcomeBias] as const;
