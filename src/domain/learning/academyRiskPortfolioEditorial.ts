import { microLessonSchema } from './schemas';
import type { LocalizedText, MicroLesson } from './types';

type CopyPair = { tr: string; en: string };
type QuestionCopy = { prompt: CopyPair; correct: CopyPair; incorrect: readonly CopyPair[]; explanation: CopyPair };
type LessonCopy = {
  title: CopyPair;
  objective: CopyPair;
  hook: CopyPair;
  explanation: CopyPair;
  misconception: CopyPair;
  takeaway: CopyPair;
  visualAlt: CopyPair;
  taskPrompt: CopyPair;
  taskCorrect: readonly CopyPair[];
  taskIncorrect: readonly CopyPair[];
  questions: readonly [QuestionCopy, QuestionCopy, QuestionCopy];
};

const p = (tr: string, en: string): CopyPair => ({ tr, en });
const localized = (value: CopyPair): LocalizedText => ({ tr: value.tr, en: value.en });

const COPY: Readonly<Record<string, LessonCopy>> = {
  'lesson.portfolio.correlation.001': {
    title: p('İki yatırım hep birlikte hareket ediyorsa gerçekten farklı mı?', 'If two investments always move together, are they really different?'),
    objective: p('Varlıkların birlikte hareket etme eğiliminin çeşitlendirmeyi nasıl etkilediğini anla.', 'Understand how the tendency of assets to move together affects diversification.'),
    hook: p('İki farklı isim taşıyan yatırım çoğu gün aynı yönde hareket ediyorsa riskin gerçekten dağılmış mıdır?', 'If two investments with different names move in the same direction most days, is your risk really spread out?'),
    explanation: p('Her yatırımın adı farklı olsa da fiyatları benzer koşullarda birlikte hareket edebilir. Bu birlikte hareket eğilimine korelasyon denir. Çok yüksek birlikte hareket varsa, bir sorun iki yatırımı da aynı anda etkileyebilir. Ama bu ilişki sabit değildir; stres dönemlerinde değişebilir.', 'Investments can have different names yet still move together under similar conditions. This tendency to move together is called correlation. If co-movement is very high, one shock can affect both at the same time. But the relationship is not fixed and can change in stressed markets.'),
    misconception: p('“İsimleri farklı” demek otomatik olarak “riskleri farklı” demek değildir. Aynı ekonomik olaya birlikte tepki verebilirler.', 'Different names do not automatically mean different risks. They can react to the same economic event together.'),
    takeaway: p('Çeşitlendirmede yalnız kaç yatırımın olduğuna değil, kötü günde birlikte hareket edip etmediklerine de bak.', 'For diversification, look not only at how many investments you hold but also at whether they move together on bad days.'),
    visualAlt: p('İki yatırımın bazı dönemlerde birlikte, bazı dönemlerde ayrışarak hareket ettiğini gösteren sade karşılaştırma', 'Simple comparison showing two investments moving together in some periods and diverging in others'),
    taskPrompt: p('Hangisi riskin daha iyi dağılmış olabileceğine dair daha güçlü işarettir?', 'Which is stronger evidence that risk may be better spread out?'),
    taskCorrect: [p('Yatırımların farklı koşullarda her zaman aynı yönde hareket etmemesi', 'The investments do not always move in the same direction across different conditions')],
    taskIncorrect: [p('Farklı isim taşısalar da hemen her gün birlikte hareket etmeleri', 'They have different names but move together almost every day'), p('Yalnız sembollerinin farklı olması', 'Only their symbols are different')],
    questions: [
      { prompt: p('Korelasyon en basit neyi anlatır?', 'What does correlation most simply describe?'), correct: p('İki yatırımın birlikte hareket etme eğilimini', 'The tendency of two investments to move together'), incorrect: [p('Gelecekteki kesin getiriyi', 'Certain future return'), p('Birinin diğerine kesin olarak neden olduğunu', 'That one certainly causes the other')], explanation: p('Korelasyon ortak hareket eğilimini özetler; gelecek veya neden-sonuç garantisi vermez.', 'Correlation summarizes co-movement; it does not guarantee the future or prove causation.') },
      { prompt: p('İki yatırımın ilişkisi zamanla değişebilir mi?', 'Can the relationship between two investments change over time?'), correct: p('Evet', 'Yes'), incorrect: [p('Hayır, bir kez ölçülünce hep aynıdır', 'No, once measured it never changes'), p('Yalnız isimleri değişirse', 'Only if their names change')], explanation: p('Piyasa koşulları değiştikçe birlikte hareket etme eğilimi de değişebilir.', 'As market conditions change, the tendency to move together can change too.') },
      { prompt: p('Düşük geçmiş korelasyon tek başına yeterli çeşitlendirme kanıtı mıdır?', 'Is low historical correlation enough by itself to prove diversification?'), correct: p('Hayır', 'No'), incorrect: [p('Evet, her zaman', 'Yes, always'), p('Yalnız bir aylık veride yeterlidir', 'It is enough with one month of data')], explanation: p('Ağırlıklar, ortak risk kaynakları ve stres dönemlerindeki davranış da önemlidir.', 'Weights, shared risk sources, and behavior during stress also matter.') },
    ],
  },
  'lesson.portfolio.drawdown.001': {
    title: p('Portföy yol boyunca ne kadar düşmüş olabilir?', 'How far may a portfolio have fallen along the way?'),
    objective: p('Son sonuç aynı görünse bile yol içinde yaşanan büyük düşüşün neden önemli olduğunu anla.', 'Understand why a large decline along the way matters even when the ending result looks similar.'),
    hook: p('Portföy yıl sonunda yeniden başladığı seviyeye geldiyse arada yüzde 30 düşmüş olması önemsiz midir?', 'If a portfolio ends the year back where it started, does a 30% decline during the year not matter?'),
    explanation: p('Önemlidir. Portföyün ulaştığı en yüksek seviyeden ne kadar gerilediğine drawdown denir. Örneğin 100’den 70’e düşmek yüzde 30 gerilemedir. Sonradan toparlansa bile yatırımcının yol boyunca taşıdığı baskı ve kayıp riski farklıdır. Yalnız sonuca değil, o sonuca nasıl gelindiğine de bak.', 'It matters. The decline from a portfolio’s previous high is called drawdown. For example, falling from 100 to 70 is a 30% drawdown. Even if the portfolio later recovers, the pressure and loss risk experienced along the way were different. Look not only at the ending result but also at the path taken.'),
    misconception: p('Yıl sonu getirisi iyi diye aradaki büyük düşüşleri yok sayma. O düşüşler gerçek risk deneyiminin parçasıdır.', 'Do not ignore large declines just because the year-end return looks good. Those declines are part of the real risk experience.'),
    takeaway: p('Drawdown şu soruyu cevaplar: En yüksek noktadan ne kadar aşağı geldim?', 'Drawdown answers one question: how far did I fall from my previous high?'),
    visualAlt: p('100 seviyesindeki zirveden 70 seviyesindeki dibe inip sonra toparlanan portföy yolunu gösteren sade grafik', 'Simple chart showing a portfolio falling from a peak of 100 to a trough of 70 and later recovering'),
    taskPrompt: p('100’den 70’e düşen portföyde drawdown hangi harekettir?', 'For a portfolio falling from 100 to 70, which move is the drawdown?'),
    taskCorrect: [p('Önceki zirveden sonraki düşük seviyeye gerileme', 'The decline from the previous peak to the later low')],
    taskIncorrect: [p('Dipten tekrar yükselme', 'The recovery from the low'), p('Yalnız son günün değişimi', 'Only the final day’s change')],
    questions: [
      { prompt: p('Drawdown neye göre ölçülür?', 'What is drawdown measured relative to?'), correct: p('Önceki en yüksek seviyeye göre', 'A previous high'), incorrect: [p('Yalnız ilk yatırılan paraya göre', 'Only the original investment'), p('Yalnız son günün fiyatına göre', 'Only the last day’s price')], explanation: p('Drawdown, portföyün bir önceki zirvesinden sonraki gerilemesini ölçer.', 'Drawdown measures the decline from a prior portfolio peak.') },
      { prompt: p('Aynı yıl sonu sonucuna sahip iki portföy aynı riski yaşamış mıdır?', 'Did two portfolios with the same year-end result necessarily experience the same risk?'), correct: p('Hayır, yol içindeki düşüşleri farklı olabilir', 'No, their declines along the way can differ'), incorrect: [p('Evet, son sonuç aynıysa bütün yol aynıdır', 'Yes, if the ending result is the same, the whole path is the same'), p('Yalnız varlık isimleri aynıysa', 'Only if the asset names are the same')], explanation: p('Aynı sonuca farklı düşüş ve toparlanma yollarıyla ulaşılabilir.', 'The same ending result can be reached through very different decline and recovery paths.') },
      { prompt: p('Drawdown tek başına bütün riski anlatır mı?', 'Does drawdown explain all risk by itself?'), correct: p('Hayır', 'No'), incorrect: [p('Evet, tek başına yeterlidir', 'Yes, it is sufficient by itself'), p('Yalnız uzun vadede anlatır', 'Only over long periods')], explanation: p('Likidite, kaldıraç, yoğunlaşma ve diğer risk kaynakları ayrıca değerlendirilir.', 'Liquidity, leverage, concentration, and other risk sources also need to be considered.') },
    ],
  },
  'lesson.risk.leverage.001': {
    title: p('Aynı fiyat hareketi kaldıraçla neden daha sert hissedilir?', 'Why does the same price move feel larger with leverage?'),
    objective: p('Kaldıracın aynı fiyat hareketinin hesaptaki etkisini büyütebildiğini anla.', 'Understand how leverage can amplify the effect of the same price move on an account.'),
    hook: p('Fiyat yüzde 5 düşüyor. Neden bir hesap yüzde 5, diğeri çok daha fazla etkilenebilir?', 'Price falls 5%. Why can one account be affected 5% while another is hit much harder?'),
    explanation: p('Kaldıraç, sahip olduğun paradan daha büyük bir piyasa büyüklüğünü kontrol etmene izin verir. Bu nedenle fiyat aynı oranda hareket etse bile hesabındaki etki büyür. Örneğin yaklaşık 3 kat maruziyet, aynı hareketin etkisini de yaklaşık üç kat büyütebilir. Kaldıraç yön tahmini değildir; yalnız mevcut hareketi büyütür.', 'Leverage lets you control market exposure larger than the capital you put in. Because of that, the same price move can have a larger effect on your account. Roughly three times the exposure can roughly triple the impact of the same move. Leverage does not predict direction; it only amplifies the move you already face.'),
    misconception: p('Kaldıracı yalnız daha fazla kazanç yolu olarak görme. Aynı büyütme kayıp tarafında da çalışır.', 'Do not view leverage only as a way to increase gains. The same amplification also works on losses.'),
    takeaway: p('Kaldıraç doğru yönü bulmaz; doğru veya yanlış hareketin hesabındaki etkisini büyütür.', 'Leverage does not find the correct direction; it amplifies the account impact of whatever move occurs.'),
    visualAlt: p('Aynı yüzde 5 fiyat hareketinin 1x ve 3x maruziyette hesaba farklı büyüklükte yansımasını gösteren sade karşılaştırma', 'Simple comparison showing the same 5% price move having different account impacts at 1x and 3x exposure'),
    taskPrompt: p('Aynı yüzde 5 düşüşte hangi hesap daha fazla etkilenebilir?', 'With the same 5% decline, which account can be affected more?'),
    taskCorrect: [p('Daha yüksek kaldıraçla daha büyük maruziyet taşıyan hesap', 'The account carrying larger exposure through higher leverage')],
    taskIncorrect: [p('Kaldıraç kullanmayan daha küçük maruziyetli hesap', 'The unleveraged account with smaller exposure'), p('İki hesap mutlaka aynı etkilenir', 'Both accounts must always be affected equally')],
    questions: [
      { prompt: p('Kaldıraç en basit neyi büyütür?', 'What does leverage most simply amplify?'), correct: p('Fiyat hareketinin hesaptaki etkisini', 'The account impact of price movement'), incorrect: [p('Tahminin doğruluk oranını', 'Forecast accuracy'), p('Piyasanın işlem saatlerini', 'Market trading hours')], explanation: p('Kaldıraç maruziyeti büyüttüğü için aynı fiyat hareketi hesaba daha büyük yansıyabilir.', 'Because leverage increases exposure, the same price move can have a larger account impact.') },
      { prompt: p('Kaldıraç yalnız kazancı mı büyütür?', 'Does leverage only amplify gains?'), correct: p('Hayır, kaybı da büyütebilir', 'No, it can amplify losses too'), incorrect: [p('Evet, yalnız kazanç tarafında çalışır', 'Yes, it works only on gains'), p('Fiyat düşerse kaldıraç kapanır', 'Leverage disappears when price falls')], explanation: p('Kaldıraç yön seçmez; olumlu ve olumsuz hareketlerin etkisini büyütebilir.', 'Leverage does not choose direction; it can amplify both favorable and unfavorable moves.') },
      { prompt: p('Kaldıraç kullanırken hangi ek tehlike önemlidir?', 'What additional danger matters when using leverage?'), correct: p('Kayıp büyüdükçe zorunlu pozisyon azaltma veya kapanma riski', 'The risk of forced position reduction or closure as losses grow'), incorrect: [p('Yalnız uygulama renginin değişmesi', 'Only the app color changing'), p('Grafiğin artık hareket etmemesi', 'The chart no longer moving')], explanation: p('Margin kuralları büyük kayıplarda pozisyonun zorla küçülmesine veya kapanmasına yol açabilir.', 'Margin rules can force a position to be reduced or closed during large losses.') },
    ],
  },
  'lesson.portfolio.concentration.001': {
    title: p('Çok yatırım yapmak neden her zaman riski dağıtmaz?', 'Why does owning many investments not always spread risk?'),
    objective: p('Farklı isimlerin aynı risk kaynağına bağlı olabileceğini ve bunun yoğunlaşma yaratabileceğini anla.', 'Understand how different investments can depend on the same risk source and still create concentration.'),
    hook: p('Altı farklı yatırımın hepsi aynı olaydan etkileniyorsa portföy gerçekten çeşitlenmiş midir?', 'If six different investments are all affected by the same event, is the portfolio truly diversified?'),
    explanation: p('Hayır. Portföyde çok sayıda isim bulunması tek başına riskin dağıldığını göstermez. Varlıkların hepsi aynı sektör, ülke, faiz hareketi veya benzer ekonomik koşula bağlıysa tek bir olay hepsini birlikte etkileyebilir. Buna yoğunlaşma riski denir.', 'No. Holding many names does not by itself mean risk is diversified. If all assets depend on the same sector, country, interest-rate move, or similar economic condition, one event can affect them together. This is concentration risk.'),
    misconception: p('“Altı farklı yatırımım var” cümlesi tek başına çeşitlendirme kanıtı değildir. Ortak risk kaynağına da bak.', '“I own six different investments” is not enough to prove diversification. Look at their shared risk source too.'),
    takeaway: p('Gerçek çeşitlendirme isim sayısını değil, risk kaynaklarının ne kadar farklı olduğunu sorar.', 'Real diversification asks how different the risk sources are, not just how many names you hold.'),
    visualAlt: p('Altı farklı yatırımın tek bir ortak risk kaynağına bağlandığı ve alternatif olarak farklı kaynaklara dağıldığı sade karşılaştırma', 'Simple comparison showing six different investments tied to one common risk source versus spread across different sources'),
    taskPrompt: p('Hangisi daha yüksek yoğunlaşma riski taşır?', 'Which carries greater concentration risk?'),
    taskCorrect: [p('Farklı isimlerde olsa da aynı ekonomik olaya bağlı yatırımlar', 'Investments with different names but exposure to the same economic event')],
    taskIncorrect: [p('Farklı risk kaynaklarına yayılan yatırımlar', 'Investments spread across different risk sources'), p('Yalnız isim sayısına bakarak karar vermemek', 'Not judging diversification from name count alone')],
    questions: [
      { prompt: p('Yoğunlaşma riski en basit ne zaman oluşur?', 'When does concentration risk most simply arise?'), correct: p('Portföyün büyük bölümü aynı risk kaynağına bağlı olduğunda', 'When a large part of the portfolio depends on the same risk source'), incorrect: [p('Her yatırımın adı farklı olduğunda', 'Whenever every investment has a different name'), p('Portföyde nakit bulunduğunda', 'Whenever the portfolio contains cash')], explanation: p('Ortak risk kaynağı, farklı görünen yatırımların aynı anda etkilenmesine yol açabilir.', 'A shared risk source can cause investments that look different to be affected at the same time.') },
      { prompt: p('Çok sayıda varlık otomatik olarak çeşitlendirme sağlar mı?', 'Does holding many assets automatically create diversification?'), correct: p('Hayır', 'No'), incorrect: [p('Evet, sayı ne kadar çoksa risk kesin o kadar düşer', 'Yes, more names always guarantee lower risk'), p('Yalnız ondan fazla varlık varsa', 'Only if there are more than ten assets')], explanation: p('Varlık sayısından çok ortak ekonomik risk kaynakları önemlidir.', 'Shared economic risk sources matter more than the raw number of holdings.') },
      { prompt: p('Yoğunlaşmayı anlamak için neye bakmak yararlıdır?', 'What is useful for understanding concentration?'), correct: p('Pozisyonların büyüklüğüne ve ortak risk kaynaklarına', 'Position sizes and shared risk sources'), incorrect: [p('Yalnız varlık isimlerine', 'Only asset names'), p('Yalnız uygulama temasına', 'Only the app theme')], explanation: p('Büyük ağırlıklar ve ortak risk faktörleri portföyün gerçek yoğunlaşmasını belirler.', 'Large weights and shared risk factors determine real portfolio concentration.') },
    ],
  },
  'lesson.portfolio.risk-budget.001': {
    title: p('Parayı eşit bölmek riski de eşit böler mi?', 'Does splitting money equally also split risk equally?'),
    objective: p('Sermaye ağırlığı ile risk katkısının aynı şey olmadığını anla.', 'Understand that capital weight and risk contribution are not the same thing.'),
    hook: p('Portföyün yarısı A, yarısı B. A çok daha sert hareket ediyorsa ikisi gerçekten eşit risk mi taşıyor?', 'Half the portfolio is A and half is B. If A moves much more violently, are they really contributing equal risk?'),
    explanation: p('Hayır. Parayı yüzde 50 / yüzde 50 bölmek, riskin de yüzde 50 / yüzde 50 olduğu anlamına gelmez. Daha hareketli veya diğer varlıklarla daha çok birlikte hareket eden yatırım portföy riskinin daha büyük kısmını taşıyabilir. Risk bütçesi, “parayı nereye koydum?”dan çok “riski nerede taşıyorum?” sorusudur.', 'No. Splitting capital 50/50 does not mean risk is also split 50/50. A more volatile investment, or one that moves more with the rest of the portfolio, can contribute much more to total risk. A risk budget asks not only “where did I put the money?” but “where am I carrying the risk?”'),
    misconception: p('Eşit para dağılımını otomatik olarak eşit risk dağılımı sanma. Hareketlilik ve birlikte hareket ilişkisi sonucu değiştirebilir.', 'Do not assume equal capital automatically means equal risk. Volatility and co-movement can change the result.'),
    takeaway: p('Risk bütçesi sermayeyi değil, portföydeki riskin nereden geldiğini dengeler.', 'A risk budget balances where portfolio risk comes from, not just where capital is allocated.'),
    visualAlt: p('Yüzde 50 yüzde 50 sermaye dağılımının yüzde 75 yüzde 25 risk katkısına dönüşebildiğini gösteren sade karşılaştırma', 'Simple comparison showing a 50/50 capital split turning into a 75/25 risk contribution'),
    taskPrompt: p('İki pozisyona eşit para ayrılmışken hangisi daha fazla risk katkısı yapabilir?', 'Two positions have equal capital. Which can contribute more risk?'),
    taskCorrect: [p('Daha hareketli ve portföyle daha güçlü birlikte hareket eden pozisyon', 'The more volatile position that moves more strongly with the portfolio')],
    taskIncorrect: [p('Eşit para ayrıldığı için ikisinin riski kesin eşittir', 'Their risk must be equal because capital is equal'), p('Yalnız adı daha kısa olan pozisyon', 'The position with the shorter name')],
    questions: [
      { prompt: p('Yüzde 50 / yüzde 50 sermaye dağılımı neyi garanti etmez?', 'What does a 50/50 capital split not guarantee?'), correct: p('Risk katkısının da yüzde 50 / yüzde 50 olmasını', 'That risk contribution is also 50/50'), incorrect: [p('Toplam sermayenin iki parçaya ayrılmasını', 'That total capital is split into two parts'), p('İki pozisyon bulunduğunu', 'That there are two positions')], explanation: p('Farklı hareketlilik ve korelasyonlar iki pozisyonun risk katkısını farklılaştırabilir.', 'Different volatility and correlations can make the two positions contribute different amounts of risk.') },
      { prompt: p('Risk bütçesi hangi soruya daha yakındır?', 'Which question is closer to risk budgeting?'), correct: p('Portföy riskinin ne kadarı hangi pozisyondan geliyor?', 'How much portfolio risk comes from each position?'), incorrect: [p('Hangi varlığın adı daha popüler?', 'Which asset name is more popular?'), p('Portföyde kaç farklı renk var?', 'How many colors are in the portfolio?')], explanation: p('Risk bütçesi sermaye tutarından çok toplam risk içindeki katkıya odaklanır.', 'Risk budgeting focuses on contribution to total risk rather than capital amount alone.') },
      { prompt: p('Risk katkıları zamanla değişebilir mi?', 'Can risk contributions change over time?'), correct: p('Evet', 'Yes'), incorrect: [p('Hayır, bir kez hesaplanınca sabittir', 'No, once calculated they are fixed'), p('Yalnız portföy adı değişirse', 'Only if the portfolio name changes')], explanation: p('Volatilite ve birlikte hareket ilişkileri değiştikçe risk katkıları da değişebilir.', 'Risk contributions can change as volatility and co-movement relationships change.') },
    ],
  },
  'lesson.portfolio.construction.001': {
    title: p('Portföy kurarken ilk soru ne olmalı?', 'What should be the first question when building a portfolio?'),
    objective: p('Portföy kurmanın tek tek ürün seçmekten önce amaç ve risk sınırını tanımlamakla başladığını anla.', 'Understand that portfolio construction starts with defining the goal and risk limits before selecting individual products.'),
    hook: p('“Hangi varlığı alayım?” sorusu gerçekten ilk soru mu?', 'Is “which asset should I buy?” really the first question?'),
    explanation: p('Genellikle hayır. Sağlıklı portföy tasarımı önce amacı sorar: para ne zaman lazım, ne kadar düşüş tolere edilebilir, nakit ihtiyacı var mı? Sonra bu sınırlara uygun varlıklar ve ağırlıklar seçilir. Portföy tek tek iyi görünen ürünlerin toplamı değil, birlikte çalışan bir risk sistemidir.', 'Usually not. A sound portfolio starts with the goal: when is the money needed, how much decline can be tolerated, and is liquidity required? Assets and weights are chosen after those constraints. A portfolio is not just a collection of individually attractive products; it is a risk system that must work together.'),
    misconception: p('Önce popüler varlıkları seçip sonra neden aldığını açıklamaya çalışma. Amaç ve risk sınırı seçimden önce gelir.', 'Do not pick popular assets first and explain the reason later. The goal and risk limits come before selection.'),
    takeaway: p('Portföy sırası basit: amaç → sınırlar → dağılım → risk kontrolü → zamanla yeniden gözden geçirme.', 'A simple portfolio sequence is: goal → limits → allocation → risk check → review over time.'),
    visualAlt: p('Amaçtan başlayıp risk sınırı, dağılım ve izlemeye ilerleyen sade portföy kurma yolu', 'Simple portfolio-building path moving from goal to risk limits, allocation, and monitoring'),
    taskPrompt: p('Yeni portföy kurarken ilk adım hangisidir?', 'What is the first step when building a new portfolio?'),
    taskCorrect: [p('Amaç, zaman ufku ve kabul edilebilir riski tanımlamak', 'Define the goal, time horizon, and acceptable risk')],
    taskIncorrect: [p('En popüler varlığı hemen seçmek', 'Immediately choose the most popular asset'), p('Önce maksimum sayıda ürün eklemek', 'First add the maximum number of products')],
    questions: [
      { prompt: p('Portföy kurarken neden amaç önce gelir?', 'Why does the goal come first in portfolio construction?'), correct: p('Uygun risk ve varlık dağılımını amaç belirlediği için', 'Because the goal helps determine suitable risk and asset allocation'), incorrect: [p('Amaç fiyatı kesin tahmin ettiği için', 'Because the goal predicts prices with certainty'), p('Amaç bütün kayıpları engellediği için', 'Because the goal prevents every loss')], explanation: p('Zaman ufku, nakit ihtiyacı ve kayıp toleransı uygun portföy yapısını doğrudan etkiler.', 'Time horizon, liquidity needs, and loss tolerance directly shape a suitable portfolio structure.') },
      { prompt: p('Portföy yalnız iyi görünen varlıkların toplamı mıdır?', 'Is a portfolio just a collection of assets that look good individually?'), correct: p('Hayır, varlıkların birlikte nasıl davrandığı da önemlidir', 'No, how the assets behave together also matters'), incorrect: [p('Evet, her varlık ayrı düşünülebilir', 'Yes, every asset can be considered in isolation'), p('Yalnız varlık sayısı önemlidir', 'Only the number of assets matters')], explanation: p('Portföy riski ağırlıkların ve varlıklar arası ilişkilerin birlikte sonucudur.', 'Portfolio risk results from both weights and relationships among assets.') },
      { prompt: p('Portföy bir kez kurulduktan sonra hiç değişmemeli midir?', 'Should a portfolio never change once built?'), correct: p('Hayır, amaçlar ve risk koşulları değiştikçe gözden geçirilmelidir', 'No, it should be reviewed as goals and risk conditions change'), incorrect: [p('Evet, ilk dağılım sonsuza kadar aynıdır', 'Yes, the first allocation should remain forever'), p('Yalnız fiyat yükselince değişmelidir', 'It should change only when prices rise')], explanation: p('Piyasa koşulları ve kişisel hedefler zamanla değişebildiği için portföy de yeniden değerlendirilir.', 'Because market conditions and personal goals can change, a portfolio should be reassessed over time.') },
    ],
  },
};

function replaceNormal<T extends { normal: LocalizedText; pro?: LocalizedText }>(copy: T, value: CopyPair): T {
  return { ...copy, normal: localized(value) };
}

export function normalizeAcademyRiskPortfolioEditorial(lesson: MicroLesson): MicroLesson {
  const copy = COPY[lesson.id];
  if (!copy) return lesson;

  const contentBlocks = lesson.contentBlocks.map((block) => {
    if (block.kind === 'prompt') return { ...block, copy: replaceNormal(block.copy, copy.hook) };
    if (block.kind === 'explanation') return { ...block, copy: replaceNormal(block.copy, copy.explanation) };
    if (block.kind === 'misconception') return { ...block, copy: replaceNormal(block.copy, copy.misconception) };
    if (block.kind === 'visual') return { ...block, alt: localized(copy.visualAlt) };
    return block;
  });

  const taskCorrectIds = new Set(lesson.practicalTask.expectedEvidence);
  let correctTaskIndex = 0;
  let incorrectTaskIndex = 0;
  const taskChoices = lesson.practicalTask.choices?.map((choice) => {
    const correct = taskCorrectIds.has(choice.id);
    const pool = correct ? copy.taskCorrect : copy.taskIncorrect;
    const index = correct ? correctTaskIndex++ : incorrectTaskIndex++;
    return { ...choice, label: localized(pool[index % pool.length]) };
  });

  const questions = lesson.quiz.questions.map((question, questionIndex) => {
    const questionCopy = copy.questions[questionIndex];
    let incorrectIndex = 0;
    return {
      ...question,
      prompt: localized(questionCopy.prompt),
      options: question.options.map((option) => ({
        ...option,
        label: localized(option.id === question.correctOptionId
          ? questionCopy.correct
          : questionCopy.incorrect[(incorrectIndex++) % questionCopy.incorrect.length]),
      })),
      explanation: localized(questionCopy.explanation),
    };
  });

  return microLessonSchema.parse({
    ...lesson,
    title: localized(copy.title),
    learningObjective: localized(copy.objective),
    contentBlocks,
    takeaway: localized(copy.takeaway),
    practicalTask: {
      ...lesson.practicalTask,
      prompt: replaceNormal(lesson.practicalTask.prompt, copy.taskPrompt),
      ...(taskChoices ? { choices: taskChoices } : {}),
    },
    quiz: { ...lesson.quiz, questions },
  });
}
