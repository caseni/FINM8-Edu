import type { MicroLesson } from '../../types';
import { BEHAVIOR_EVIDENCE_SOURCES } from './behaviorEvidenceSources';
import { createFoundationLesson } from './foundationLessonFactory';

const fomo = createFoundationLesson({
  id: 'lesson.behavior.fomo.001', slug: 'fomo-karari-nasil-bozar', conceptKey: 'behavior.fomo',
  skillId: 'skill.behavior-evidence', competencyId: 'competency.recognize-fomo.foundation',
  title: 'FOMO kararını nasıl bozar?', objective: 'Fırsatı kaçırma korkusunun karar sürecindeki işaretlerini tanır.', minutes: 4,
  hook: '“Şimdi girmezsem bir daha asla fırsat bulamam” düşüncesi kanıt mı, baskı mı?',
  explanation: 'FOMO, başkalarının kazandığını görme veya hızla yükselen fiyatı kaçırma korkusunun kararı aceleye getirmesidir. Plan, risk sınırı ve karşı kanıt geri plana itilir. Duygu tek başına yanlış değildir; sorun, karar sürecinin yerine geçmesidir.',
  proExplanation: 'FOMO; recency, sosyal kanıt ve regret aversion ile birleşebilir. Önceden tanımlı bekleme süresi, giriş kriteri ve maksimum risk, dürtü ile karar arasına ölçülebilir sürtünme koyar.',
  misconception: 'Yaygın hata: Yoğun aciliyet hissini piyasanın güçlü kanıtı sanmak.', takeaway: 'Acil hissetmek, acil karar gerektiğini kanıtlamaz.',
  prerequisiteConceptKeys: [], relatedConceptKeys: ['behavior.overtrading', 'behavior.decision_journal'],
  visualAlt: 'Hızla yükselen fiyat, sosyal mesajlar ve duraklatılmış karar kontrol listesini karşılaştıran şema',
  taskPrompt: 'Hangileri FOMO etkisine işaret eder?',
  taskChoices: [{ id: 'urgency', label: 'Plan dışı “hemen şimdi” baskısı' }, { id: 'others', label: 'Başkalarının kazancını görüp risk kontrolünü bırakmak' }, { id: 'checklist', label: 'Önceden belirlenmiş kriterleri sakin biçimde kontrol etmek' }, { id: 'pause', label: 'Karar öncesi bekleme süresi uygulamak' }], taskCorrectIds: ['urgency', 'others'],
  questions: [
    { prompt: 'FOMO’nun karar üzerindeki temel etkisi nedir?', choices: [{ id: 'a', label: 'Aciliyet yaratarak planı geri plana itmek' }, { id: 'b', label: 'Veri kalitesini otomatik artırmak' }, { id: 'c', label: 'Riski ortadan kaldırmak' }], correctId: 'a', explanation: 'FOMO karar kriterlerini dürtüyle değiştirebilir.' },
    { prompt: 'FOMO’yu yönetmeye hangisi yardım eder?', choices: [{ id: 'a', label: 'Önceden tanımlı kriter ve bekleme süresi' }, { id: 'b', label: 'Her yükselişi takip etmek' }, { id: 'c', label: 'Risk sınırını kaldırmak' }], correctId: 'a', explanation: 'Süreç kuralları duyguyla eylem arasına kontrol noktası koyar.' },
    { prompt: 'Yoğun aciliyet hissi neyi kanıtlar?', choices: [{ id: 'a', label: 'Tek başına piyasa yönünü kanıtlamaz' }, { id: 'b', label: 'Kesin yükselişi' }, { id: 'c', label: 'Kesin fırsatı' }], correctId: 'a', explanation: 'Duygu içsel durumdur, dış piyasa kanıtı değildir.' },
  ], sources: [BEHAVIOR_EVIDENCE_SOURCES.investorRisk, BEHAVIOR_EVIDENCE_SOURCES.behavior],
});

const overtrading = createFoundationLesson({
  id: 'lesson.behavior.overtrading.001', slug: 'asiri-islem-nasil-fark-edilir', conceptKey: 'behavior.overtrading',
  skillId: 'skill.behavior-evidence', competencyId: 'competency.recognize-overtrading.foundation',
  title: 'Aşırı işlem nasıl fark edilir?', objective: 'Plan dışı işlem sıklığı ve dürtüsel karar işaretlerini tanır.', minutes: 4,
  hook: 'Daha çok işlem yapmak daha çok öğrenmek veya daha iyi sonuç demek midir?',
  explanation: 'Aşırı işlem, işlem sayısının tek başına yüksek olması değil; kararların plan, kanıt ve risk sınırından kopmasıdır. Kayıptan hemen sonra geri kazanma isteği, sık kriter değiştirme ve zayıf kanıtla tekrar giriş önemli işaretlerdir. Daha fazla işlem maliyet ve hata maruziyetini artırabilir.',
  proExplanation: 'Overtrading; turnover, plan dışı giriş oranı, cooldown ihlali ve işlem başına kanıt kalitesiyle izlenebilir. Gamification işlem sıklığını değil, bekleme ve kaliteli karar davranışını ödüllendirmelidir.',
  misconception: 'Yaygın hata: Ekranda daha uzun kalmayı ve daha çok tıklamayı disiplin sanmak.', takeaway: 'İşlem sayısı başarı ölçütü değildir; planla uyumlu karar kalitesi önemlidir.',
  visualAlt: 'Az sayıda planlı karar ile hızla artan plansız işlem sayısını karşılaştıran şema', visualAltEn: 'Diagram comparing a few planned decisions with rapidly increasing unplanned trade count',
  prerequisiteConceptKeys: ['behavior.fomo'], relatedConceptKeys: ['behavior.decision_journal', 'risk.position_sizing'],
  taskPrompt: 'Hangileri aşırı işlem riski için güçlü işarettir?',
  taskChoices: [{ id: 'revenge', label: 'Kayıptan hemen sonra plansız geri kazanma işlemi' }, { id: 'weak', label: 'Kriter oluşmadan tekrar tekrar giriş' }, { id: 'planned', label: 'Önceden tanımlı tek planı uygulamak' }, { id: 'pause', label: 'Cooldown süresine uymak' }], taskCorrectIds: ['revenge', 'weak'],
  questions: [
    { prompt: 'Aşırı işlemi en iyi ne tanımlar?', choices: [{ id: 'a', label: 'İşlemlerin plan ve kanıttan kopması' }, { id: 'b', label: 'Herhangi iki işlem yapmak' }, { id: 'c', label: 'Yalnız uzun vadeli yatırım' }], correctId: 'a', explanation: 'Bağlam ve süreç ihlali ham sayıdan daha anlamlıdır.' },
    { prompt: 'Daha fazla işlem hangisini artırabilir?', choices: [{ id: 'a', label: 'Maliyet ve hata maruziyetini' }, { id: 'b', label: 'Kesin kazancı' }, { id: 'c', label: 'Veri doğruluğunu' }], correctId: 'a', explanation: 'Her ek karar yeni maliyet ve hata fırsatı taşır.' },
    { prompt: 'M8 EDU neyi ödüllendirmemelidir?', choices: [{ id: 'a', label: 'İşlem sıklığını veya kârı' }, { id: 'b', label: 'Quiz başarısını' }, { id: 'c', label: 'Kanıt kalitesini' }], correctId: 'a', explanation: 'Ödül sistemi risk almayı teşvik etmemelidir.' },
  ], sources: [BEHAVIOR_EVIDENCE_SOURCES.behavior, BEHAVIOR_EVIDENCE_SOURCES.investorRisk],
});

const confirmationBias = createFoundationLesson({
  id: 'lesson.behavior.confirmation-bias.001', slug: 'sadece-hakli-cikaran-kanit', conceptKey: 'behavior.confirmation_bias',
  skillId: 'skill.behavior-evidence', competencyId: 'competency.counter-confirmation-bias.foundation',
  title: 'Sadece haklı çıkaran kanıtı mı görüyorsun?', objective: 'Onaylama yanlılığını ve karşı kanıt arama ihtiyacını açıklar.', minutes: 4,
  hook: 'Bir görüş oluşturduktan sonra yalnız onu destekleyen haberleri seçiyor olabilir misin?',
  explanation: 'Onaylama yanlılığı, mevcut görüşü destekleyen bilgiyi arama ve karşı kanıtı küçümseme eğilimidir. İyi karar süreci yalnız “neden doğruyum?” değil, “hangi kanıt beni yanlış çıkarır?” sorusunu da içerir. Görüş ile gözlemi ayrı kaydetmek bu hatayı görünür kılar.',
  proExplanation: 'Pre-mortem, disconfirming evidence alanı ve önceden tanımlı invalidation kriteri, tez değiştirmenin duygusal maliyetini azaltır. Karşı kanıt sonradan yeniden yazılmamalıdır.',
  misconception: 'Yaygın hata: Çok sayıda aynı yönlü kaynak görmeyi bağımsız doğrulama sanmak.', takeaway: 'Güçlü tez, karşı kanıttan kaçmayan tezdir.',
  visualAlt: 'Bir görüşü destekleyen ve onu zorlayan kanıtların birlikte aranmasını gösteren şema', visualAltEn: 'Diagram showing evidence that supports and challenges a view being sought together',
  prerequisiteConceptKeys: ['behavior.fomo'], relatedConceptKeys: ['evidence.data_quality', 'behavior.decision_journal'],
  taskPrompt: 'Bir yükseliş tezi için sağlıklı iki kontrolü seç.',
  taskChoices: [{ id: 'against', label: 'Teze karşı olan veriyi özellikle ara' }, { id: 'invalidate', label: 'Tezi hangi koşulun geçersiz kılacağını yaz' }, { id: 'only-support', label: 'Yalnız destekleyen hesapları takip et' }, { id: 'hide', label: 'Olumsuz veriyi kayıttan çıkar' }], taskCorrectIds: ['against', 'invalidate'],
  questions: [
    { prompt: 'Onaylama yanlılığı nedir?', choices: [{ id: 'a', label: 'Mevcut görüşü destekleyen bilgiyi kayırmak' }, { id: 'b', label: 'Her kaynağı eşit doğrulamak' }, { id: 'c', label: 'Karşı kanıt aramak' }], correctId: 'a', explanation: 'Yanlılık arama, yorumlama ve hatırlama sürecini etkileyebilir.' },
    { prompt: 'Hangi soru yanlılığı azaltır?', choices: [{ id: 'a', label: 'Beni hangi kanıt yanlış çıkarır?' }, { id: 'b', label: 'Beni kim destekliyor?' }, { id: 'c', label: 'Olumsuz veriyi nasıl gizlerim?' }], correctId: 'a', explanation: 'Geçersizlik koşulu karşı kanıtı süreç içine alır.' },
    { prompt: 'Aynı bilgiyi kopyalayan çok hesap bağımsız doğrulama mıdır?', choices: [{ id: 'a', label: 'Hayır' }, { id: 'b', label: 'Her zaman evet' }, { id: 'c', label: 'Takipçi sayısı yüksekse kesin evet' }], correctId: 'a', explanation: 'Kaynak sayısı ile bağımsız kaynak sayısı aynı değildir.' },
  ], sources: [BEHAVIOR_EVIDENCE_SOURCES.behavior, BEHAVIOR_EVIDENCE_SOURCES.evidence],
});

const dataQuality = createFoundationLesson({
  id: 'lesson.evidence.data-quality.001', slug: 'her-veri-ayni-kalitede-degildir', conceptKey: 'evidence.data_quality',
  skillId: 'skill.behavior-evidence', competencyId: 'competency.assess-data-quality.foundation',
  title: 'Her veri aynı kalitede değildir', objective: 'Eksik, tutarsız ve doğrulanmamış veriyi güvenilir kanıttan ayırır.', minutes: 5,
  hook: 'Bir sayı ekranda göründüğü için otomatik olarak güvenilir midir?',
  explanation: 'Veri kalitesi; kaynağın kimliği, ölçüm yöntemi, kapsam, tutarlılık, eksik alanlar ve doğrulanabilirlikle değerlendirilir. Tek bir ekran görüntüsü veya kaynağı belirsiz sayı bağlamdan kopuk olabilir. Eksik veri “olumsuz kanıt yok” anlamına gelmez; bilinmeyen olarak işaretlenmelidir.',
  proExplanation: 'FINM8 kanıtı provenance, provider, observedAt, market/timeframe kapsamı ve quality flag ile taşır. Kaynaklar birleşmeden önce semantik uyum ve çelişki kontrolü gerekir.',
  misconception: 'Yaygın hata: Sayısal hassasiyeti veri doğruluğuyla karıştırmak.', takeaway: 'Kesin görünen sayı değil, izlenebilir ve bağlamı belli veri güçlü kanıttır.',
  visualAlt: 'Kaynak, bağlam ve eksik veri durumunu farklı güven düzeyleriyle gösteren şema', visualAltEn: 'Diagram showing source, context, and missing data at different confidence levels',
  prerequisiteConceptKeys: [], relatedConceptKeys: ['evidence.freshness', 'behavior.confirmation_bias'],
  taskPrompt: 'Hangileri daha güçlü veri kalitesi kanıtıdır?',
  taskChoices: [{ id: 'source', label: 'Kaynak ve ölçüm yönteminin belli olması' }, { id: 'scope', label: 'Piyasa, zaman dilimi ve gözlem zamanının belirtilmesi' }, { id: 'screenshot', label: 'Kaynağı olmayan kırpılmış ekran görüntüsü' }, { id: 'precision', label: 'Çok ondalıklı ama doğrulanamayan sayı' }], taskCorrectIds: ['source', 'scope'],
  questions: [
    { prompt: 'Veri kalitesinde en önemli özelliklerden biri nedir?', choices: [{ id: 'a', label: 'Kaynak ve kapsamın izlenebilir olması' }, { id: 'b', label: 'Çok renkli görünmesi' }, { id: 'c', label: 'Yalnız ondalık sayısı' }], correctId: 'a', explanation: 'Provenance ve kapsam doğrulama için gereklidir.' },
    { prompt: 'Eksik veri nasıl temsil edilmelidir?', choices: [{ id: 'a', label: 'Bilinmeyen veya eksik olarak' }, { id: 'b', label: 'Otomatik olumlu kanıt olarak' }, { id: 'c', label: 'Kesin sıfır olarak her zaman' }], correctId: 'a', explanation: 'Eksiklik ayrı bir durumdur ve varsayımla doldurulmamalıdır.' },
    { prompt: 'Sayısal hassasiyet doğruluğu garanti eder mi?', choices: [{ id: 'a', label: 'Hayır' }, { id: 'b', label: 'Evet' }, { id: 'c', label: 'Yalnız sekiz ondalıkta' }], correctId: 'a', explanation: 'Yanlış ölçüm de çok hassas biçimde yazılabilir.' },
  ], sources: [BEHAVIOR_EVIDENCE_SOURCES.evidence],
});

const freshness = createFoundationLesson({
  id: 'lesson.evidence.freshness.001', slug: 'dogru-veri-ne-zaman-eskir', conceptKey: 'evidence.freshness',
  skillId: 'skill.behavior-evidence', competencyId: 'competency.assess-evidence-freshness.intermediate', learningStage: 'intermediate',
  title: 'Doğru veri ne zaman eskir?', objective: 'Veri güncelliğini piyasa ve zaman dilimi bağlamında değerlendirir.', minutes: 4,
  hook: 'Dün doğru olan veri bugün hâlâ aynı kararda kullanılabilir mi?',
  explanation: 'Veri üretildiği anda doğru olabilir fakat piyasa, zaman dilimi ve karar türüne göre hızla eskir. Güncellik yalnız takvim yaşı değildir; verinin temsil ettiği koşulun hâlâ geçerli olup olmadığıdır. Her kanıt gözlem zamanı ve kapsamıyla birlikte okunmalıdır.',
  proExplanation: 'Freshness threshold source × timeframe × market bağlamına göre değişir. Stale veri silinmek yerine observedAt ve stale flag ile saklanır; yeni gerçek gibi sunulmaz.',
  misconception: 'Yaygın hata: Kaynak güvenilir olduğu için verinin süresiz geçerli olduğunu düşünmek.', takeaway: 'Güvenilir kaynak eski veri üretebilir; kanıtın zamanı bağlamın parçasıdır.',
  visualAlt: 'Gözlem zamanı ile şimdi arasındaki farkı ve eski verinin yeniden doğrulanması gerektiğini gösteren zaman çizelgesi', visualAltEn: 'Timeline showing the gap between observation time and now, and the need to re-check stale data',
  prerequisiteConceptKeys: ['evidence.data_quality'], relatedConceptKeys: ['market.chart.timeframes', 'market.timeframe.alignment'],
  taskPrompt: 'Bir verinin güncelliğini değerlendirirken hangi iki bilgi gerekir?',
  taskChoices: [{ id: 'observed', label: 'Gözlem zamanı' }, { id: 'scope', label: 'Piyasa ve zaman dilimi kapsamı' }, { id: 'logo', label: 'Kaynağın logo rengi' }, { id: 'followers', label: 'Paylaşanın takipçi sayısı' }], taskCorrectIds: ['observed', 'scope'],
  questions: [
    { prompt: 'Veri güncelliği neye bağlıdır?', choices: [{ id: 'a', label: 'Zaman, kaynak, piyasa ve kullanım bağlamına' }, { id: 'b', label: 'Yalnız dosya adına' }, { id: 'c', label: 'Süresizdir' }], correctId: 'a', explanation: 'Farklı veriler farklı hızlarda geçerliliğini kaybeder.' },
    { prompt: 'Eski veri nasıl sunulmalıdır?', choices: [{ id: 'a', label: 'Gözlem zamanı ve stale durumu açıkça gösterilerek' }, { id: 'b', label: 'Yeni veri gibi' }, { id: 'c', label: 'Zamanı silinerek' }], correctId: 'a', explanation: 'Zaman bilgisi doğru yorumun temelidir.' },
    { prompt: 'Güvenilir kaynak verinin güncel olduğunu garanti eder mi?', choices: [{ id: 'a', label: 'Hayır' }, { id: 'b', label: 'Her zaman evet' }, { id: 'c', label: 'Yalnız grafikte' }], correctId: 'a', explanation: 'Kaynak güvenilirliği ile gözlem güncelliği farklı boyutlardır.' },
  ], sources: [BEHAVIOR_EVIDENCE_SOURCES.evidence],
});

const decisionJournal = createFoundationLesson({
  id: 'lesson.behavior.decision-journal.001', slug: 'sonucu-degil-karari-kaydet', conceptKey: 'behavior.decision_journal',
  skillId: 'skill.behavior-evidence', competencyId: 'competency.structure-decision-journal.foundation',
  title: 'Sonucu değil karar kalitesini kaydet', objective: 'Bir karar günlüğünde gözlem, yorum ve sonucu ayrı kaydeder.', minutes: 5,
  hook: 'Kârlı sonuç her zaman iyi karar, zarar ise her zaman kötü karar mıdır?',
  explanation: 'İyi karar kötü sonuç, kötü karar iyi sonuç üretebilir. Karar günlüğü; o anda bilinen gözlemleri, bunlardan çıkarılan yorumu, karşı kanıtı, risk sınırını ve daha sonra gerçekleşen sonucu ayrı kaydeder. Böylece sonuç yanlılığı yerine süreç kalitesi incelenir.',
  proExplanation: 'Decision record immutable decision-time snapshot, thesis, invalidation, evidence refs ve evaluation horizon içermelidir. Sonuç verisi sonradan eklenir; ilk gerekçe geriye dönük değiştirilmez.',
  misconception: 'Yaygın hata: Yalnız kâr/zarar tutarını kaydedip karar anındaki kanıtı silmek.', takeaway: 'Sonuç öğrenme verisidir; karar kalitesi karar anındaki süreçle ölçülür.',
  visualAlt: 'Kanıt, risk ve geçersizlik koşulunu içeren kısa karar günlüğü kontrol listesini gösteren şema', visualAltEn: 'Diagram showing a concise decision-journal checklist for evidence, risk, and invalidation',
  prerequisiteConceptKeys: ['behavior.confirmation_bias'], relatedConceptKeys: ['evidence.data_quality', 'evidence.freshness'],
  taskPrompt: 'Karar günlüğünde karar anında kaydedilmesi gereken iki öğeyi seç.',
  taskChoices: [{ id: 'evidence', label: 'Gözlem ve kanıt referansları' }, { id: 'invalidation', label: 'Tezi geçersiz kılacak koşul ve risk sınırı' }, { id: 'rewrite', label: 'Sonuca göre geçmiş gerekçeyi yeniden yazmak' }, { id: 'profit-only', label: 'Yalnız kâr/zarar tutarı' }], taskCorrectIds: ['evidence', 'invalidation'],
  questions: [
    { prompt: 'Kârlı sonuç neyi garanti etmez?', choices: [{ id: 'a', label: 'Karar sürecinin kaliteli olduğunu' }, { id: 'b', label: 'Bir sonuç oluştuğunu' }, { id: 'c', label: 'Kayıt yapılabileceğini' }], correctId: 'a', explanation: 'Şans kötü süreci geçici olarak ödüllendirebilir.' },
    { prompt: 'Gözlem ve yorum neden ayrı yazılır?', choices: [{ id: 'a', label: 'Veri ile çıkarımı karıştırmamak için' }, { id: 'b', label: 'Kaydı uzatmak için' }, { id: 'c', label: 'Sonucu garanti etmek için' }], correctId: 'a', explanation: 'Ayrım, yorum hatasını ve yanlılığı görünür kılar.' },
    { prompt: 'İlk karar gerekçesi sonuçtan sonra ne olmalıdır?', choices: [{ id: 'a', label: 'Korunmalı; sonuç ayrı eklenmeli' }, { id: 'b', label: 'Sonuca uyacak şekilde değiştirilmeli' }, { id: 'c', label: 'Tamamen silinmeli' }], correctId: 'a', explanation: 'Değişmez karar anı kaydı gerçek öğrenme sağlar.' },
  ], sources: [BEHAVIOR_EVIDENCE_SOURCES.behavior, BEHAVIOR_EVIDENCE_SOURCES.evidence],
});

export const WAVE1_BEHAVIOR_EVIDENCE_LESSONS: readonly MicroLesson[] = [
  fomo, overtrading, confirmationBias, dataQuality, decisionJournal, freshness,
];
