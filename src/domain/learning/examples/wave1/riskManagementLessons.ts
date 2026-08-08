import type { MicroLesson } from '../../types';
import { createFoundationLesson } from './foundationLessonFactory';
import { RISK_MANAGEMENT_SOURCES } from './riskManagementSources';

const uncertainty = createFoundationLesson({
  id: 'lesson.risk.uncertainty.001', slug: 'risk-belirsizlik-kayip', conceptKey: 'risk.basics',
  skillId: 'skill.risk-management', competencyId: 'competency.distinguish-risk-uncertainty-loss.foundation',
  title: 'Risk, belirsizlik ve kayıp aynı şey mi?', titleEn: 'Are risk, uncertainty, and loss the same thing?', objective: 'Risk olasılığı, belirsizlik ve gerçekleşmiş kaybı ayırt eder.', objectiveEn: 'Distinguish risk probability, uncertainty, and a realized loss.', minutes: 4,
  hook: 'Henüz zarar oluşmadan da risk var mıdır?', hookEn: 'Can risk exist before any loss has occurred?',
  explanation: 'Risk, bir kararın beklenenden farklı ve finansal olarak olumsuz sonuçlanabilme ihtimalidir. Belirsizlik, olası sonuçları veya olasılıklarını tam bilememektir. Kayıp ise olumsuz sonucun gerçekleşmiş hâlidir. Risk yönetimi kaybı tamamen yok etmez; olası etkinin kabul edilebilir sınırda tutulmasını amaçlar.',
  explanationEn: 'Risk is the possibility that a decision produces a financially adverse result that differs from expectations. Uncertainty means that outcomes or their probabilities are not fully known. A loss is an adverse outcome that has already happened. Risk management does not eliminate every loss; it aims to keep the possible impact within an acceptable limit.',
  proExplanation: 'Risk; piyasa, likidite, kredi, operasyon ve model gibi farklı kaynaklardan gelebilir. Olasılık tahmini belirsiz olduğunda yalnız beklenen getiriye değil, zarar büyüklüğüne ve dayanıklılığa da bakılır.',
  proExplanationEn: 'Risk can come from market, liquidity, credit, operational, and model sources. When probability estimates are uncertain, consider loss size and resilience as well as expected return.',
  misconception: 'Yaygın hata: Henüz zarar olmadığı için risk de olmadığını düşünmek.', misconceptionEn: 'Common mistake: assuming there is no risk because no loss has occurred yet.',
  takeaway: 'Kayıp gerçekleşmiş sonuçtur; risk ise karar anında taşınan olumsuz sonuç ihtimalidir.', takeawayEn: 'Loss is a realized outcome; risk is the possibility of an adverse outcome carried at the time of a decision.',
  visualAlt: 'Kayıp, belirsizlik ve kazanç olasılıklarını tek sonuç yerine bir aralık olarak gösteren şema', visualAltEn: 'Diagram showing loss, uncertainty, and gain as a range rather than one outcome',
  prerequisiteConceptKeys: [], relatedConceptKeys: ['risk.volatility', 'risk.position_sizing'],
  taskPrompt: 'Hangisi gerçekleşmiş kayıp değil, karar anındaki riski anlatır?', taskPromptEn: 'Which describes risk at the time of a decision rather than a realized loss?',
  taskChoices: [{ id: 'possible', label: 'Sonucu belirsiz yatırımın değer kaybetme ihtimali', labelEn: 'The possibility that an uncertain investment loses value' }, { id: 'realized', label: 'Hesaba geçmiş 1.000 TL zarar', labelEn: 'A TRY 1,000 loss already recorded in the account' }, { id: 'guaranteed', label: 'Kesin ve değişmez getiri', labelEn: 'A certain, unchanged return' }], taskCorrectIds: ['possible'],
  questions: [
    { prompt: 'Finansal risk en temel olarak neyi içerir?', promptEn: 'At its core, what does financial risk include?', choices: [{ id: 'a', label: 'Belirsizlik ve potansiyel finansal kaybı', labelEn: 'Uncertainty and potential financial loss' }, { id: 'b', label: 'Yalnız gerçekleşmiş zararı', labelEn: 'Only a realized loss' }, { id: 'c', label: 'Kesin kazancı', labelEn: 'Certain profit' }], correctId: 'a', explanation: 'Risk karar anında gelecekteki olumsuz sonuç ihtimalini içerir.', explanationEn: 'Risk includes the possibility of an adverse future outcome at the time of a decision.' },
    { prompt: 'Risk yönetiminin gerçekçi amacı nedir?', promptEn: 'What is a realistic goal of risk management?', choices: [{ id: 'a', label: 'Riski ve olası etkiyi sınırlandırmak', labelEn: 'Limit risk and its possible impact' }, { id: 'b', label: 'Tüm kayıpları garantiyle yok etmek', labelEn: 'Eliminate every loss with certainty' }, { id: 'c', label: 'Her fırsatı kullanmak', labelEn: 'Take every opportunity' }], correctId: 'a', explanation: 'Hiçbir yöntem tüm piyasa riskini ortadan kaldırmaz.', explanationEn: 'No method removes all market risk.' },
    { prompt: 'Belirsizlik neyi anlatır?', promptEn: 'What does uncertainty describe?', choices: [{ id: 'a', label: 'Sonuçları veya olasılıkları tam bilememeyi', labelEn: 'Not fully knowing outcomes or their probabilities' }, { id: 'b', label: 'Kesinleşmiş hesap bakiyesini', labelEn: 'A finalized account balance' }, { id: 'c', label: 'Yalnız fiyat artışını', labelEn: 'Only price appreciation' }], correctId: 'a', explanation: 'Belirsizlik bilgi sınırlarını ifade eder.', explanationEn: 'Uncertainty describes the limits of available knowledge.' },
  ], sources: [RISK_MANAGEMENT_SOURCES.investorRisk, RISK_MANAGEMENT_SOURCES.finraRisk],
});

const volatility = createFoundationLesson({
  id: 'lesson.risk.volatility.001', slug: 'volatilite-once-risktir', conceptKey: 'risk.volatility',
  skillId: 'skill.risk-management', competencyId: 'competency.explain-volatility-risk.foundation',
  title: 'Volatilite neyi ölçer, neyi söylemez?', titleEn: 'What does volatility measure—and what does it not tell us?', objective: 'Fiyat hareket genişliğinin pozisyon riskini nasıl etkilediğini açıklar.', objectiveEn: 'Explain how the size of price moves affects position risk.', minutes: 4,
  hook: 'Fiyatın hızlı hareket etmesi yönü mü, hareketin büyüklüğünü mü anlatır?', hookEn: 'Does rapid price movement tell us direction, or the size of movement?',
  explanation: 'Volatilite, fiyatın ne kadar geniş ve hızlı dalgalandığını anlatır. Yüksek volatilite kazanç ihtimali kadar kayıp, kayma ve stop seviyesinin beklenenden farklı gerçekleşmesi riskini de büyütebilir. Aynı pozisyon büyüklüğü daha hareketli piyasada daha büyük parasal dalgalanma yaratabilir.',
  explanationEn: 'Volatility describes how widely and quickly prices fluctuate. Higher volatility can increase the possibility of gains, but also losses, slippage, and fills that differ from the intended stop level. The same position size can create a larger cash fluctuation in a more active market.',
  proExplanation: 'Volatilite yön söylemez. Realized ve implied ölçümler farklıdır; rejim değişimi, gap ve likidite koşulları tarihsel ölçümlerin ötesinde kuyruk riski yaratabilir.', proExplanationEn: 'Volatility does not state direction. Realized and implied measures differ; regime changes, gaps, and liquidity conditions can create tail risk beyond historical measures.',
  traderTip: 'Volatilite belirgin biçimde arttığında aynı pozisyon büyüklüğünü ve aynı dar risk mesafesini otomatik olarak korumak, aynı parasal riski korumayabilir. Birçok trader hareket genişliğini, likiditeyi ve kabul ettiği parasal riski yeniden değerlendirir. Volatilite tek başına yön sinyali değildir.',
  traderTipEn: 'When volatility rises materially, automatically keeping the same position size and the same tight risk distance may not preserve the same cash risk. Many traders reassess movement range, liquidity, and the amount of cash risk they accept. Volatility is not a direction signal by itself.',
  misconception: 'Yaygın hata: Yüksek volatiliteyi otomatik olarak yüksek kazanç fırsatı sayıp aşağı yönlü etkiyi ihmal etmek.', misconceptionEn: 'Common mistake: treating high volatility as automatic profit opportunity and ignoring downside impact.',
  takeaway: 'Volatilite yönü söylemez; hareket genişliğini ve pozisyonun taşıyabileceği dalgalanmayı anlamaya yardım eder.', takeawayEn: 'Volatility does not tell direction; it helps explain movement range and the fluctuation a position may carry.',
  prerequisiteConceptKeys: ['risk.basics'], relatedConceptKeys: ['risk.position_sizing', 'market.execution.slippage'],
  visualAlt: 'Aynı sermaye için düşük ve yüksek volatilite fiyat yollarının karşılaştırması', visualAltEn: 'Comparison of low- and high-volatility price paths for the same capital',
  taskKind: 'chart_identification', taskAssetRef: 'edu://charts/volatility-range-001',
  taskPrompt: 'Aynı büyüklükte iki pozisyondan hangisi daha yüksek kısa vadeli dalgalanma riski taşır?', taskPromptEn: 'Which of two equal-sized positions carries greater short-term fluctuation risk?',
  taskChoices: [{ id: 'high-vol', label: 'Günlük hareket aralığı belirgin biçimde daha geniş olan', labelEn: 'The one with a clearly wider daily movement range' }, { id: 'low-vol', label: 'Dar ve istikrarlı aralıkta hareket eden', labelEn: 'The one moving in a narrow, stable range' }, { id: 'logo', label: 'Logosu daha büyük olan', labelEn: 'The one with a larger logo' }], taskCorrectIds: ['high-vol'],
  questions: [
    { prompt: 'Volatilite neyi ölçmeye çalışır?', promptEn: 'What does volatility seek to measure?', choices: [{ id: 'a', label: 'Fiyat dalgalanmasının genişliğini', labelEn: 'The range of price fluctuation' }, { id: 'b', label: 'Kesin yönü', labelEn: 'Its certain direction' }, { id: 'c', label: 'Şirket çalışan sayısını', labelEn: 'A company’s employee count' }], correctId: 'a', explanation: 'Volatilite hareket büyüklüğüyle ilgilidir, yönü garanti etmez.', explanationEn: 'Volatility concerns movement size; it does not guarantee direction.' },
    { prompt: 'Yüksek volatilitede hangisi artabilir?', promptEn: 'What can increase in high volatility?', choices: [{ id: 'a', label: 'Kayıp ve gerçekleşme belirsizliği', labelEn: 'Loss and fill uncertainty' }, { id: 'b', label: 'Kesin kazanç', labelEn: 'Certain profit' }, { id: 'c', label: 'Fiyat garantisi', labelEn: 'A price guarantee' }], correctId: 'a', explanation: 'Geniş hareketler iki yönde de riski büyütebilir.', explanationEn: 'Wide moves can increase risk in either direction.' },
    { prompt: 'Aynı pozisyon büyüklüğü farklı volatilitede aynı riski taşır mı?', promptEn: 'Does the same position size carry identical risk in different volatility?', choices: [{ id: 'a', label: 'Her zaman taşımaz', labelEn: 'Not always' }, { id: 'b', label: 'Her zaman taşır', labelEn: 'Always' }, { id: 'c', label: 'Volatiliteyle ilgisi yoktur', labelEn: 'It is unrelated to volatility' }], correctId: 'a', explanation: 'Hareket aralığı büyüdükçe aynı miktarın parasal dalgalanması büyüyebilir.', explanationEn: 'As the movement range grows, the same amount can create a larger cash fluctuation.' },
  ], sources: [RISK_MANAGEMENT_SOURCES.investorRisk, RISK_MANAGEMENT_SOURCES.methodology],
});

const positionSizing = createFoundationLesson({
  id: 'lesson.risk.position-sizing.001', slug: 'pozisyon-buyuklugu-once-gelir', conceptKey: 'risk.position_sizing',
  skillId: 'skill.risk-management', competencyId: 'competency.reason-position-size.foundation',
  title: 'Pozisyon büyüklüğü neden sonuçtan önce gelir?', objective: 'Pozisyon büyüklüğünün kayıp etkisini nasıl belirlediğini açıklar.', minutes: 5,
  hook: 'Aynı yanlış karar iki kişiden birini sarsmazken diğerini neden oyundan çıkarabilir?',
  explanation: 'Pozisyon büyüklüğü, fiyat hareketinin hesabı ne kadar etkileyeceğini belirler. Önce kabul edilebilir parasal risk, ardından geçersizlik noktası ve bu mesafeye uygun büyüklük düşünülür. Büyük pozisyon küçük fiyat hareketini bile büyük kayba çevirebilir.',
  proExplanation: 'Basit çerçevede pozisyon miktarı, kabul edilen parasal riskin giriş ile risk sınırı arasındaki birim riske bölünmesiyle ilişkilidir. Gap, kayma, korelasyon ve kaldıraç gerçek kaybı bu tahminden büyütebilir.',
  misconception: 'Yaygın hata: Önce en büyük alınabilir miktarı seçip riski sonradan düşünmek.',
  takeaway: 'Pozisyon büyüklüğü bir getiri aracı değil, hesabın tek bir karara maruz kalma sınırıdır.',
  visualAlt: 'Aynı risk sınırında dar ve geniş stop mesafesi için değişen pozisyon boyutunu gösteren şema', visualAltEn: 'Diagram showing how position size changes for tight and wide stop distances under the same risk limit',
  prerequisiteConceptKeys: ['risk.volatility'], relatedConceptKeys: ['risk.risk_reward', 'risk.stop_orders'],
  taskPrompt: 'Aynı risk sınırında stop mesafesi iki katına çıkarsa temel olarak hangi yaklaşım daha tutarlıdır?',
  taskChoices: [{ id: 'smaller', label: 'Pozisyon miktarını azaltmak' }, { id: 'larger', label: 'Pozisyon miktarını iki katına çıkarmak' }, { id: 'ignore', label: 'Mesafeyi tamamen yok saymak' }], taskCorrectIds: ['smaller'],
  questions: [
    { prompt: 'Pozisyon büyüklüğü en doğrudan neyi etkiler?', choices: [{ id: 'a', label: 'Fiyat hareketinin hesaptaki parasal etkisini' }, { id: 'b', label: 'Piyasanın yönünü' }, { id: 'c', label: 'Haberin yayın saatini' }], correctId: 'a', explanation: 'Aynı yüzde hareket farklı miktarlarda farklı parasal sonuç üretir.' },
    { prompt: 'Sağlıklı sıralama hangisidir?', choices: [{ id: 'a', label: 'Risk sınırı, geçersizlik mesafesi, uygun büyüklük' }, { id: 'b', label: 'Maksimum büyüklük, sonra risk' }, { id: 'c', label: 'Yalnız beklenen getiri' }], correctId: 'a', explanation: 'Büyüklük, önceden tanımlanan risk kapasitesinden türetilir.' },
    { prompt: 'Hesaplanan risk neden yine aşılabilir?', choices: [{ id: 'a', label: 'Gap, kayma ve likidite nedeniyle' }, { id: 'b', label: 'Matematik her zaman fiyatı durdurduğu için' }, { id: 'c', label: 'Risk sınırı garanti olduğu için' }], correctId: 'a', explanation: 'Gerçekleşme koşulları teorik seviyeden farklı olabilir.' },
  ], sources: [RISK_MANAGEMENT_SOURCES.finraRisk, RISK_MANAGEMENT_SOURCES.methodology],
});

const riskReward = createFoundationLesson({
  id: 'lesson.risk.reward.001', slug: 'risk-getiri-tek-basina-yetmez', conceptKey: 'risk.risk_reward',
  skillId: 'skill.risk-management', competencyId: 'competency.interpret-risk-reward.intermediate', learningStage: 'intermediate',
  title: 'Risk/getiri oranı tek başına yeterli mi?', objective: 'Risk/getiri oranını olasılık ve gerçekleşme belirsizliğiyle birlikte yorumlar.', minutes: 5,
  hook: '1 birim risk edip 3 birim hedeflemek işlemi otomatik olarak iyi yapar mı?',
  explanation: 'Risk/getiri oranı, planlanan olumsuz ve olumlu sonuç büyüklüklerini karşılaştırır; gerçekleşme olasılığını söylemez. Uzak bir hedef kâğıt üzerinde yüksek oran gösterebilir fakat düşük ihtimalli olabilir. Oran, veri kalitesi, olasılık, maliyet ve gerçekleşme riskiyle birlikte yorumlanmalıdır.',
  proExplanation: 'Pozitif expectancy için payoff oranı ile gerçekleşme olasılığı birlikte gerekir. Komisyon, spread, slippage ve tail loss dağılımı nominal R oranını bozabilir.',
  misconception: 'Yaygın hata: Yüksek yazılmış hedef oranını tek başına kaliteli karar kanıtı saymak.',
  takeaway: 'Risk/getiri oranı sonuç büyüklüğünü karşılaştırır; olasılığı ve kaliteyi tek başına ölçmez.',
  visualAlt: 'Bir birim olası kaybı ve iki birim hedefi gösteren, olasılığın ayrıca değerlendirilmesi gerektiğini anlatan şema', visualAltEn: 'Diagram showing one unit of potential loss and two units of target while noting probability must be assessed separately',
  prerequisiteConceptKeys: ['risk.position_sizing'], relatedConceptKeys: ['risk.stop_orders', 'evidence.data_quality'],
  taskPrompt: 'Kağıt üzerinde 1:5 oran görülen bir planı değerlendirirken hangi iki ek bilgi gerekir?',
  taskChoices: [{ id: 'probability', label: 'Hedef ve risk senaryolarının olasılığına dair kanıt' }, { id: 'costs', label: 'Spread, komisyon ve kayma etkisi' }, { id: 'color', label: 'Grafik arka plan rengi' }, { id: 'guarantee', label: 'Oranın kazancı garanti ettiği varsayımı' }], taskCorrectIds: ['probability', 'costs'],
  questions: [
    { prompt: 'Risk/getiri oranı neyi karşılaştırır?', choices: [{ id: 'a', label: 'Planlanan kayıp ve kazanç büyüklüğünü' }, { id: 'b', label: 'Kesin başarı olasılığını' }, { id: 'c', label: 'Yalnız işlem süresini' }], correctId: 'a', explanation: 'Oran payoff büyüklüklerini karşılaştırır.' },
    { prompt: 'Yüksek oran neden tek başına yeterli değildir?', choices: [{ id: 'a', label: 'Gerçekleşme olasılığını ve maliyetleri içermediği için' }, { id: 'b', label: 'Her zaman düşük kazanç verdiği için' }, { id: 'c', label: 'Fiyatı durdurduğu için' }], correctId: 'a', explanation: 'Olasılık ve gerçek execution sonucu ayrıca gerekir.' },
    { prompt: 'Nominal oranı hangisi bozabilir?', choices: [{ id: 'a', label: 'Komisyon, spread ve kayma' }, { id: 'b', label: 'Ders başlığı' }, { id: 'c', label: 'Rozet rengi' }], correctId: 'a', explanation: 'Maliyetler gerçekleşen kaybı büyütüp kazancı azaltabilir.' },
  ], sources: [RISK_MANAGEMENT_SOURCES.methodology, RISK_MANAGEMENT_SOURCES.finraRisk],
});

const stopOrders = createFoundationLesson({
  id: 'lesson.risk.stop-orders.001', slug: 'stop-emri-garanti-midir', conceptKey: 'risk.stop_orders',
  skillId: 'skill.risk-management', competencyId: 'competency.explain-stop-limitations.intermediate', learningStage: 'intermediate',
  title: 'Stop emri garanti midir?', objective: 'Stop emrinin tetiklenme ve gerçekleşme sınırlamalarını açıklar.', minutes: 5,
  hook: 'Stop fiyatını yazdığında maksimum kaybın kesin olarak kilitlenmiş olur mu?',
  explanation: 'Standart stop emri, stop seviyesine ulaşıldığında tetiklenir ve genellikle piyasa emrine dönüşür. Hızlı hareket, gap veya düşük likidite nedeniyle gerçekleşme fiyatı stop seviyesinden daha kötü olabilir. Stop-limit fiyat kontrolü ekler fakat bu kez emrin hiç gerçekleşmemesi riski vardır.',
  proExplanation: 'Stop trigger ile fill aynı olay değildir. Venue kuralları, trigger referansı, latency, queue ve book depth gerçekleşmeyi etkiler; bu nedenle stop seviyesi kesin maksimum zarar değildir.',
  misconception: 'Yaygın hata: Stop fiyatını garanti edilmiş çıkış ve kesin maksimum kayıp olarak görmek.',
  takeaway: 'Stop bir risk aracıdır ama fiyat garantisi değildir; tetiklenme ile gerçekleşmeyi ayır.',
  visualAlt: 'Stop seviyesini geçen hızlı fiyat hareketinde gerçekleşme fiyatının farklılaşabileceğini gösteren şema', visualAltEn: 'Diagram showing that a fill can differ when fast price movement crosses a stop level',
  prerequisiteConceptKeys: ['market.execution.order_types', 'risk.position_sizing'], relatedConceptKeys: ['market.execution.slippage', 'risk.volatility'],
  taskPrompt: 'Hızlı düşüşte stop fiyatı atlanırsa standart stop emri için en doğru beklenti hangisidir?',
  taskChoices: [{ id: 'worse-fill', label: 'Mevcut piyasada daha kötü fiyattan gerçekleşebilir' }, { id: 'guaranteed', label: 'Kesinlikle yazılan stop fiyatından gerçekleşir' }, { id: 'profit', label: 'Otomatik olarak kâra döner' }], taskCorrectIds: ['worse-fill'],
  questions: [
    { prompt: 'Standart stop emri tetiklenince genellikle neye dönüşür?', choices: [{ id: 'a', label: 'Piyasa emrine' }, { id: 'b', label: 'Kesin fiyat garantisine' }, { id: 'c', label: 'Temettü emrine' }], correctId: 'a', explanation: 'Stop seviyesi tetikleyicidir; piyasa emri fiyatı garanti etmez.' },
    { prompt: 'Stop-limit emrinin temel ek riski nedir?', choices: [{ id: 'a', label: 'Limit koşulu nedeniyle hiç gerçekleşmemesi' }, { id: 'b', label: 'Her fiyattan gerçekleşmesi' }, { id: 'c', label: 'Her zaman daha fazla kâr vermesi' }], correctId: 'a', explanation: 'Fiyat limitin dışına hızla çıkarsa emir açık kalabilir.' },
    { prompt: 'Stop seviyesi maksimum kaybı garanti eder mi?', choices: [{ id: 'a', label: 'Hayır' }, { id: 'b', label: 'Evet, her piyasada' }, { id: 'c', label: 'Yalnız mum yeşilse' }], correctId: 'a', explanation: 'Gap, kayma ve likidite gerçekleşme fiyatını değiştirebilir.' },
  ], sources: [RISK_MANAGEMENT_SOURCES.orderTypes, RISK_MANAGEMENT_SOURCES.methodology],
});

const diversification = createFoundationLesson({
  id: 'lesson.portfolio.diversification.001', slug: 'cok-varlik-cesitlendirme-degildir', conceptKey: 'portfolio.diversification',
  skillId: 'skill.risk-management', competencyId: 'competency.reason-diversification.foundation',
  title: 'Çok varlık her zaman çeşitlendirme değildir', objective: 'Varlık sayısı ile gerçek risk çeşitlendirmesi arasındaki farkı açıklar.', minutes: 5,
  hook: 'On farklı kripto varlık aynı risk faktörüne birlikte bağlıysa gerçekten çeşitlendirilmiş misindir?',
  explanation: 'Çeşitlendirme, parayı farklı yatırımlara yayarak tek bir kaynağın kaybına bağımlılığı azaltmayı amaçlar. Yalnız varlık sayısı yeterli değildir; varlıklar aynı piyasa, sektör veya risk faktörüne birlikte tepki veriyorsa yoğunlaşma sürer. Çeşitlendirme kaybı tamamen engellemez.',
  proExplanation: 'Gerçek çeşitlendirme marjinal risk katkısı, korelasyonun rejimlere göre değişimi, likidite ve ortak faktör maruziyetiyle değerlendirilir. Kriz dönemlerinde korelasyonlar artabilir ve çeşitlendirme beklenenden daha az koruma sağlayabilir.',
  misconception: 'Yaygın hata: Çok sayıda benzer varlığa sahip olmayı otomatik çeşitlendirme saymak.',
  takeaway: 'Çeşitlendirme adet değil, farklı kayıp kaynaklarına maruz kalma meselesidir.',
  prerequisiteConceptKeys: ['risk.basics'], relatedConceptKeys: ['market.basics.instruments', 'risk.volatility'],
  visualAlt: 'Aynı faktöre bağlı varlık sepeti ile farklı faktörlere yayılan sepetin karşılaştırması',
  taskPrompt: 'Hangi sepet daha güçlü çeşitlendirme mantığı gösterir?',
  taskChoices: [{ id: 'different', label: 'Farklı araç ve risk kaynaklarına dağılan sepet' }, { id: 'same-sector', label: 'Aynı sektörde birbirine çok benzer on varlık' }, { id: 'one-asset', label: 'Tek varlıkta tam yoğunlaşma' }], taskCorrectIds: ['different'],
  questions: [
    { prompt: 'Çeşitlendirmenin temel amacı nedir?', choices: [{ id: 'a', label: 'Tek bir kayıp kaynağına bağımlılığı azaltmak' }, { id: 'b', label: 'Tüm kayıpları garantiyle yok etmek' }, { id: 'c', label: 'Varlık sayısını rastgele artırmak' }], correctId: 'a', explanation: 'Farklı yatırımlara yayılma yoğunlaşma etkisini azaltmayı amaçlar.' },
    { prompt: 'On benzer varlık neden yeterli olmayabilir?', choices: [{ id: 'a', label: 'Aynı risk faktörüne birlikte tepki verebildikleri için' }, { id: 'b', label: 'On sayısı küçük olduğu için' }, { id: 'c', label: 'Grafikleri olmadığı için' }], correctId: 'a', explanation: 'Ortak faktör maruziyeti adet artsa da yoğunlaşmayı sürdürebilir.' },
    { prompt: 'Çeşitlendirme neyi garanti etmez?', choices: [{ id: 'a', label: 'Kayıp yaşanmayacağını' }, { id: 'b', label: 'Risk kaynaklarının yayılmasını' }, { id: 'c', label: 'Portföyde birden fazla varlık olmasını' }], correctId: 'a', explanation: 'Piyasa çapında veya ortak şoklarda çeşitlendirilmiş portföy de kaybedebilir.' },
  ], sources: [RISK_MANAGEMENT_SOURCES.diversification, RISK_MANAGEMENT_SOURCES.investorRisk],
});

export const WAVE1_RISK_MANAGEMENT_LESSONS: readonly MicroLesson[] = [
  uncertainty, volatility, positionSizing, riskReward, stopOrders, diversification,
];
