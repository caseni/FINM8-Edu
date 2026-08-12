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
  'lesson.fundamental.statements.001': {
    title: p('Bir şirketi anlamak için neden tek sayı yetmez?', 'Why is one number not enough to understand a company?'),
    objective: p('Şirketin kazancını, sahip olduklarını ve gerçek para hareketini ayrı ayrı görmen gerektiğini anla.', 'Understand why company profit, what it owns and owes, and actual cash movement need to be viewed separately.'),
    hook: p('Şirket kâr açıkladı diye kasasında aynı miktarda para olmak zorunda mı?', 'If a company reports profit, must it have the same amount of cash?'),
    explanation: p('Hayır. Bir şirketi üç farklı pencereden izlemek gerekir. Gelir tablosu dönem içinde ne kazandığını ve ne harcadığını, bilanço belirli bir anda neye sahip olup ne borçlu olduğunu, nakit akışı ise paranın gerçekten nereden gelip nereye gittiğini gösterir. Tek bir tablo bütün resmi vermez.', 'No. A company needs to be viewed through three different windows. The income statement shows what it earned and spent during a period, the balance sheet shows what it owns and owes at a point in time, and cash flow shows where money actually came from and went. One statement alone does not show the full picture.'),
    misconception: p('Yalnız kâra bakıp şirketin sağlıklı olduğuna karar verme. Kâr artarken nakit azalabilir veya borç büyüyebilir.', 'Do not judge company health from profit alone. Profit can rise while cash weakens or debt grows.'),
    takeaway: p('Şirketi anlamak için üç soruyu birlikte sor: Ne kazandı? Neye sahip ve ne borçlu? Para gerçekten nereye gitti?', 'To understand a company, ask three questions together: What did it earn? What does it own and owe? Where did the cash actually go?'),
    visualAlt: p('Aynı şirketi kazanç, sahip olunanlar ve para hareketi olarak üç sade pencereden gösteren görsel', 'Simple visual showing one company through three windows: earnings, what it owns and owes, and cash movement'),
    taskPrompt: p('Şirket kâr ediyor ama kasadaki para azalıyor. İlk ne yapmalısın?', 'A company is profitable but its cash balance is falling. What should you do first?'),
    taskCorrect: [p('Kârın neden nakde dönüşmediğini diğer tablolarla birlikte incelemek', 'Check the other statements to understand why profit is not turning into cash')],
    taskIncorrect: [p('Kâr pozitif olduğu için diğer bilgileri yok saymak', 'Ignore the other information because profit is positive'), p('Yalnız hisse fiyatına bakmak', 'Look only at the share price')],
    questions: [
      { prompt: p('Bir şirketin yalnız kârına bakmak neden yeterli değildir?', 'Why is looking only at company profit not enough?'), correct: p('Nakit ve borç durumu farklı bir tablo gösterebilir', 'Cash and debt can tell a different story'), incorrect: [p('Kâr hiçbir bilgi vermediği için', 'Because profit gives no information at all'), p('Şirketlerin hiç borcu olmadığı için', 'Because companies never have debt')], explanation: p('Kâr önemli bir bilgidir ama şirketin nakit ve finansal durumunu tek başına açıklamaz.', 'Profit matters, but it does not explain cash and financial position by itself.') },
      { prompt: p('Şirketin belirli bir anda neye sahip ve ne borçlu olduğunu hangi tablo gösterir?', 'Which statement shows what a company owns and owes at a point in time?'), correct: p('Bilanço', 'Balance sheet'), incorrect: [p('Yalnız gelir tablosu', 'Only the income statement'), p('Fiyat grafiği', 'The price chart')], explanation: p('Bilanço şirketin belirli bir tarihteki varlık ve yükümlülüklerini gösterir.', 'The balance sheet shows company assets and obligations at a specific date.') },
      { prompt: p('Paranın gerçekten nereden gelip nereye gittiğini en doğrudan hangi tablo gösterir?', 'Which statement most directly shows where cash came from and where it went?'), correct: p('Nakit akış tablosu', 'Cash-flow statement'), incorrect: [p('Yalnız bilanço', 'Only the balance sheet'), p('Hisse fiyatı', 'Share price')], explanation: p('Nakit akışı, muhasebe kârından ayrı olarak gerçek para giriş ve çıkışlarını izler.', 'Cash flow tracks actual money in and out separately from accounting profit.') },
    ],
  },
  'lesson.fundamental.income-statement.001': {
    title: p('Satış artarken kâr neden düşebilir?', 'Why can profit fall while sales rise?'),
    objective: p('Şirketin satışından maliyetleri çıktıktan sonra gerçekte ne kadar kaldığını takip etmeyi öğren.', 'Learn to follow how much remains after a company pays the costs of generating its sales.'),
    hook: p('Satışlar yüzde 20 arttıysa kâr da yüzde 20 artmak zorunda mı?', 'If sales rise 20%, must profit also rise 20%?'),
    explanation: p('Hayır. Şirket satış yapar, sonra ürünü üretmenin ve işi yürütmenin maliyetlerini öder. Maliyetler satışlardan daha hızlı büyürse, satış yükselse bile elde kalan kâr azalabilir. Gelir tablosu bu akışı gösterir: satış → maliyetler → giderler → elde kalan kâr.', 'No. A company makes sales and then pays the costs of producing and running the business. If costs grow faster than sales, profit can fall even when sales rise. The income statement shows this flow: sales → costs → expenses → profit left over.'),
    misconception: p('Satış büyümesini otomatik olarak daha çok kâr sanma. Önemli olan maliyetlerden sonra ne kadar kaldığıdır.', 'Do not assume higher sales automatically mean higher profit. What matters is how much remains after costs.'),
    takeaway: p('Satışın büyümesi iyi bir başlangıçtır; ama şirketin ne kadarını elinde tuttuğuna da bak.', 'Sales growth can be a good start, but also check how much the company keeps after costs.'),
    visualAlt: p('100 birim satıştan maliyet ve giderler çıktıktan sonra kalan kârı gösteren sade şirket akışı', 'Simple company flow showing profit left after costs and expenses are deducted from 100 units of sales'),
    taskPrompt: p('Satış artıyor ama kâr düşüyor. İlk hangi soruyu sormalısın?', 'Sales are rising but profit is falling. What should you ask first?'),
    taskCorrect: [p('Maliyet ve giderler satışlardan daha hızlı mı arttı?', 'Did costs and expenses grow faster than sales?')],
    taskIncorrect: [p('Satış arttıysa kâr düşüşünü yok saymalı mıyım?', 'Should I ignore falling profit because sales rose?'), p('Şirket logosunu değiştirdi mi?', 'Did the company change its logo?')],
    questions: [
      { prompt: p('Satışlar yükselirken kâr düşebilir mi?', 'Can profit fall while sales rise?'), correct: p('Evet, maliyetler daha hızlı artabilir', 'Yes, costs can rise faster'), incorrect: [p('Hayır, bu mümkün değildir', 'No, that is impossible'), p('Yalnız hisse fiyatı düşerse', 'Only if share price falls')], explanation: p('Satış büyümesi tek başına kâr büyümesini garanti etmez; maliyetler de birlikte izlenmelidir.', 'Sales growth alone does not guarantee profit growth; costs must be tracked too.') },
      { prompt: p('Gelir tablosu en basit neyi gösterir?', 'What does an income statement most simply show?'), correct: p('Bir dönemde satış, maliyet ve kârın nasıl oluştuğunu', 'How sales, costs, and profit formed during a period'), incorrect: [p('Şirketin gelecekteki kesin fiyatını', 'The company’s certain future price'), p('Yalnız kasadaki nakdi', 'Only cash in the bank')], explanation: p('Gelir tablosu dönem içindeki iş performansını satıştan kâra kadar izler.', 'The income statement follows business performance from sales to profit over a period.') },
      { prompt: p('Şirketin 100 lira satıştan ne kadarını kâr olarak tuttuğunu anlamak için neye bakarsın?', 'What helps show how much profit a company keeps from 100 of sales?'), correct: p('Satışa göre kalan kâr oranına', 'The profit remaining relative to sales'), incorrect: [p('Yalnız şirket adının uzunluğuna', 'Only the length of the company name'), p('Grafiğin arka plan rengine', 'The chart background color')], explanation: p('Satıştan ne kadar kâr kaldığı şirketin maliyetleri ne kadar iyi yönettiğini anlamaya yardım eder.', 'How much profit remains from sales helps show how effectively the company manages costs.') },
    ],
  },
  'lesson.fundamental.balance-sheet.001': {
    title: p('Şirketin sahip oldukları ve borçları neden birlikte okunur?', 'Why should company assets and debts be read together?'),
    objective: p('Bir şirketin neye sahip olduğunu, ne borçlu olduğunu ve aradaki farkın neden önemli olduğunu anla.', 'Understand what a company owns, what it owes, and why the difference matters.'),
    hook: p('Çok varlığı olan bir şirket otomatik olarak güçlü müdür?', 'Is a company with many assets automatically strong?'),
    explanation: p('Hayır. Şirketin nakit, stok, alacak, bina veya ekipman gibi sahip olduklarına varlık denir. Bankalara, tedarikçilere veya diğer taraflara ödemesi gerekenler ise borç ve yükümlülüklerdir. Şirketin gücünü değerlendirirken yalnız ne kadar varlığı olduğuna değil, bu varlıkların ne kadar borçla finanse edildiğine de bak.', 'No. Cash, inventory, receivables, buildings, and equipment are examples of assets a company owns. Amounts owed to banks, suppliers, and others are liabilities. To judge financial strength, look not only at how much the company owns but also at how much debt supports those assets.'),
    misconception: p('“Çok varlığı var” cümlesi tek başına yeterli değildir. Büyük varlıkların yanında daha büyük borçlar da olabilir.', '“It has many assets” is not enough by itself. Large assets can come with even larger obligations.'),
    takeaway: p('Şirkete bakarken iki tarafı birlikte gör: neye sahip ve ne kadar borçlu?', 'When looking at a company, see both sides together: what does it own and how much does it owe?'),
    visualAlt: p('Bir tarafta şirketin sahip oldukları, diğer tarafta ödemesi gereken borçları gösteren sade bilanço karşılaştırması', 'Simple balance-sheet comparison showing what a company owns on one side and what it owes on the other'),
    taskPrompt: p('Bir şirketin finansal gücünü anlamak için hangisini birlikte değerlendirmelisin?', 'What should you consider together to understand a company’s financial strength?'),
    taskCorrect: [p('Sahip olduğu varlıklar ile borç ve yükümlülükleri', 'Its assets together with its debts and obligations')],
    taskIncorrect: [p('Yalnız toplam varlık sayısını', 'Only total assets'), p('Yalnız günlük hisse fiyatını', 'Only the daily share price')],
    questions: [
      { prompt: p('Bilanço en basit hangi iki tarafı birlikte gösterir?', 'What two sides does a balance sheet most simply show together?'), correct: p('Şirketin sahip oldukları ve borçları', 'What the company owns and owes'), incorrect: [p('Yalnız satış ve reklamı', 'Only sales and advertising'), p('Yalnız hisse fiyatı ve hacmi', 'Only share price and volume')], explanation: p('Bilanço belirli bir andaki varlıkları ve bu varlıkların nasıl finanse edildiğini gösterir.', 'The balance sheet shows assets at a point in time and how those assets are financed.') },
      { prompt: p('Çok varlık sahibi olmak neden tek başına yeterli değildir?', 'Why are many assets not enough by themselves?'), correct: p('Şirketin çok büyük borçları da olabilir', 'The company may also have very large debts'), incorrect: [p('Varlıkların hiç değeri olmadığı için', 'Because assets never have value'), p('Borçlar şirketleri hiç etkilemediği için', 'Because debt never affects companies')], explanation: p('Finansal yapı, varlıklarla birlikte borçların büyüklüğü ve ödeme zamanına da bağlıdır.', 'Financial strength depends on debts and their timing as well as the assets held.') },
      { prompt: p('Şirketin sahip olduğu nakit, stok ve ekipman genel olarak ne olarak adlandırılır?', 'What are company cash, inventory, and equipment generally called?'), correct: p('Varlıklar', 'Assets'), incorrect: [p('Yalnız kâr', 'Only profit'), p('Piyasa emri', 'Market orders')], explanation: p('Şirketin kontrol ettiği ekonomik kaynaklar bilanço üzerinde varlık olarak gösterilir.', 'Economic resources controlled by the company are shown as assets on the balance sheet.') },
    ],
  },
  'lesson.fundamental.cash-flow.001': {
    title: p('Kâr eden şirketin kasası neden boşalabilir?', 'Why can a profitable company still run low on cash?'),
    objective: p('Muhasebe kârı ile gerçek para giriş çıkışının aynı şey olmadığını anla.', 'Understand that accounting profit and actual cash movement are not the same thing.'),
    hook: p('Şirket kâr ediyor ama bankadaki parası azalıyor. Bu mümkün mü?', 'A company is profitable but its bank cash is falling. Is that possible?'),
    explanation: p('Evet. Şirket satış yapmış olabilir ama müşteriler henüz ödeme yapmamış olabilir; stok için para harcamış veya yeni ekipman almış olabilir. Bu yüzden kâr ile kasaya giren para aynı anda oluşmak zorunda değildir. Nakit akış tablosu gerçek para giriş ve çıkışlarını izler.', 'Yes. A company may have made sales but not yet collected from customers, spent cash on inventory, or bought new equipment. Profit and cash do not have to appear at the same time. The cash-flow statement tracks actual money moving in and out.'),
    misconception: p('Net kârı kasadaki para sanma. Şirket kârlı görünürken nakit sıkışıklığı yaşayabilir.', 'Do not treat net income as cash in the bank. A company can look profitable and still face cash pressure.'),
    takeaway: p('Kâr “iş nasıl sonuçlandı?” sorusuna, nakit akışı ise “para gerçekten nereye gitti?” sorusuna cevap verir.', 'Profit answers “how did the business perform?” while cash flow answers “where did the money actually go?”'),
    visualAlt: p('Kâr gösteren bir şirketin alacak, stok ve yatırım nedeniyle kasadaki parasının azalabildiğini gösteren sade para akışı', 'Simple cash-flow scene showing a profitable company with lower cash because of receivables, inventory, and investment'),
    taskPrompt: p('Şirket kâr ediyor ama nakdi azalıyor. Hangisi bunun nedeni olabilir?', 'A company is profitable but cash is falling. What could explain this?'),
    taskCorrect: [p('Müşterilerin henüz ödemediği alacakların veya stokların artması', 'Growth in unpaid receivables or inventory')],
    taskIncorrect: [p('Kâr varsa nakit mutlaka aynı miktarda artar', 'If there is profit, cash must rise by the same amount'), p('Şirketin hisse kodunun değişmesi', 'The company ticker changing')],
    questions: [
      { prompt: p('Kâr ile nakit aynı şey midir?', 'Are profit and cash the same thing?'), correct: p('Hayır', 'No'), incorrect: [p('Evet, her zaman', 'Yes, always'), p('Yalnız büyük şirketlerde aynıdır', 'They are the same only for large companies')], explanation: p('Gelir ve giderlerin muhasebeleşme zamanı gerçek para hareketinden farklı olabilir.', 'The timing of accounting revenue and expenses can differ from actual cash movement.') },
      { prompt: p('Nakit akış tablosu en doğrudan neyi izler?', 'What does the cash-flow statement most directly track?'), correct: p('Gerçek para giriş ve çıkışlarını', 'Actual cash coming in and going out'), incorrect: [p('Gelecek yılın kesin hisse fiyatını', 'Next year’s certain share price'), p('Yalnız şirket çalışan sayısını', 'Only employee count')], explanation: p('Nakit akışı paranın işletmeye nasıl girdiğini ve hangi amaçlarla çıktığını gösterir.', 'Cash flow shows how money enters the business and what it is spent on.') },
      { prompt: p('Şirket satış yaptı ama müşteri henüz ödemedi. Ne olabilir?', 'A company made a sale but the customer has not paid yet. What can happen?'), correct: p('Kâr kaydı oluşurken nakit henüz gelmemiş olabilir', 'Profit may be recorded before cash arrives'), incorrect: [p('Kâr ve nakit her zaman aynı anda oluşur', 'Profit and cash always happen at the same time'), p('Bilanço otomatik olarak sıfırlanır', 'The balance sheet automatically becomes zero')], explanation: p('Vadeli satışlarda muhasebe geliri nakit tahsilatından önce oluşabilir.', 'With credit sales, accounting revenue can be recorded before cash is collected.') },
    ],
  },
  'lesson.fundamental.profitability.001': {
    title: p('100 liralık satıştan şirkete ne kadar kalıyor?', 'How much does a company keep from 100 of sales?'),
    objective: p('Şirketin satışından maliyetleri çıktıktan sonra kalan payın kârlılığı anlamada neden önemli olduğunu öğren.', 'Learn why the share remaining after costs matters when understanding profitability.'),
    hook: p('İki şirket de 10 lira kâr ediyor. Biri 100, diğeri 250 lira satış yaptıysa aynı derecede kârlı mı?', 'Two companies each make 10 profit. If one had 100 of sales and the other 250, are they equally profitable?'),
    explanation: p('Hayır. Kârı satışa oranlamak şirketin her 100 liralık satıştan ne kadarını elinde tuttuğunu gösterir. Buna kâr marjı denir. Aynı miktarda kâr eden iki şirketin satış büyüklüğü farklıysa verimlilikleri de farklı olabilir. Ancak farklı sektörlerin maliyet yapıları farklı olduğu için marjları körü körüne karşılaştırma.', 'No. Comparing profit with sales shows how much the company keeps from each 100 of sales. This is called a profit margin. Two companies with the same profit but different sales can have very different efficiency. But do not compare margins blindly across industries because cost structures differ.'),
    misconception: p('Yüksek marjı tek başına “iyi şirket” etiketi yapma. Marjın sürdürülebilirliği, nakit ve sektör yapısı da önemlidir.', 'Do not use a high margin alone as a “good company” label. Sustainability, cash, and industry structure also matter.'),
    takeaway: p('Kârın büyüklüğüne değil yalnız; satışın ne kadarının kâra dönüştüğüne de bak.', 'Do not look only at profit size; also look at how much of sales turns into profit.'),
    visualAlt: p('100 liralık satıştan maliyetler çıktıktan sonra kalan kâr payını gösteren sade oran görseli', 'Simple visual showing the share of 100 in sales that remains as profit after costs'),
    taskPrompt: p('Aynı 10 lira kârı üreten iki şirketten hangisi daha yüksek kâr marjına sahiptir?', 'Two companies both make 10 profit. Which has the higher profit margin?'),
    taskCorrect: [p('10 kârı 100 satışla üreten şirket', 'The company making 10 profit from 100 sales')],
    taskIncorrect: [p('10 kârı 250 satışla üreten şirket', 'The company making 10 profit from 250 sales'), p('Satış büyüklüğüne bakmadan ikisi kesin aynıdır', 'They are certainly identical without considering sales')],
    questions: [
      { prompt: p('Kâr marjı en basit neyi anlatır?', 'What does profit margin most simply show?'), correct: p('Satışın ne kadarının kâr olarak kaldığını', 'How much of sales remains as profit'), incorrect: [p('Hissenin yarınki kesin fiyatını', 'Tomorrow’s certain share price'), p('Şirketin logo büyüklüğünü', 'Company logo size')], explanation: p('Marj, kârı satışla ilişkilendirerek şirketin satıştan ne kadar tuttuğunu gösterir.', 'Margin relates profit to sales and shows how much the company keeps from its revenue.') },
      { prompt: p('Aynı kârı daha az satışla üreten şirketin marjı ne olur?', 'What happens to margin if the same profit is generated from fewer sales?'), correct: p('Daha yüksek olabilir', 'It can be higher'), incorrect: [p('Mutlaka sıfır olur', 'It must be zero'), p('Satışla hiçbir ilgisi yoktur', 'It has no relationship to sales')], explanation: p('Aynı kâr daha küçük satış tabanından geliyorsa satış başına kalan kâr payı daha yüksektir.', 'If the same profit comes from a smaller sales base, the share of profit per unit of sales is higher.') },
      { prompt: p('Farklı sektörlerin marjları doğrudan karşılaştırılır mı?', 'Should margins from different industries be compared directly?'), correct: p('Dikkatli karşılaştırılmalıdır; maliyet yapıları farklı olabilir', 'They should be compared carefully because cost structures differ'), incorrect: [p('Evet, her sektör tamamen aynıdır', 'Yes, every industry is identical'), p('Marj hiçbir sektörde kullanılamaz', 'Margins are useless in every industry')], explanation: p('Sektörün iş modeli ve maliyet yapısı normal marj seviyesini ciddi biçimde değiştirebilir.', 'Industry business models and cost structures can materially change normal margin levels.') },
    ],
  },
  'lesson.fundamental.debt-liquidity.001': {
    title: p('Şirketin borcu ne zaman tehlikeli hale gelir?', 'When can company debt become dangerous?'),
    objective: p('Borç miktarı kadar ödeme zamanı ve şirketin elindeki nakdin de önemli olduğunu anla.', 'Understand that debt amount, payment timing, and available cash all matter.'),
    hook: p('Aynı borca sahip iki şirketten biri neden daha riskli olabilir?', 'Why can one of two companies with the same debt be riskier?'),
    explanation: p('Çünkü borcun yalnız toplamı değil, ne zaman ödeneceği ve şirketin bunu karşılayacak nakit üretip üretemediği önemlidir. Yakında büyük ödeme yapması gereken ama elinde az nakit bulunan şirket daha fazla baskı yaşayabilir. Buna likidite riski denir. Borcu değerlendirirken miktar + vade + nakit birlikte düşünülür.', 'Because the total debt is not the only thing that matters. Timing and the company’s ability to generate cash to meet payments matter too. A company with a large payment due soon but little cash can face more pressure. This is liquidity risk. When judging debt, consider amount + timing + cash together.'),
    misconception: p('“Borcu var” veya “borcu az” tek başına yeterli değildir. Borcun vadesi ve şirketin ödeme gücü sonucu değiştirebilir.', '“It has debt” or “it has little debt” is not enough by itself. Debt maturity and the company’s ability to pay can change the picture.'),
    takeaway: p('Borçta üç şeyi birlikte gör: ne kadar, ne zaman ödenecek, karşılayacak nakit var mı?', 'For debt, look at three things together: how much, when is it due, and is there enough cash to meet it?'),
    visualAlt: p('Yakında ödenecek borç ile şirketin elindeki nakdi yan yana karşılaştıran sade şirket likidite sahnesi', 'Simple company liquidity scene comparing debt due soon with cash available'),
    taskPrompt: p('Aynı toplam borca sahip iki şirketten hangisi daha fazla kısa vadeli baskı yaşayabilir?', 'Two companies have the same total debt. Which may face more short-term pressure?'),
    taskCorrect: [p('Yakında büyük ödeme yapacak ama elinde az nakit olan şirket', 'The company with a large payment due soon and little cash')],
    taskIncorrect: [p('Borcu daha uzun vadeye yayılmış ve güçlü nakdi olan şirket', 'The company with debt spread over longer maturities and stronger cash'), p('Yalnız logosu daha küçük olan şirket', 'The company with the smaller logo')],
    questions: [
      { prompt: p('Borç riskini değerlendirirken toplam borcun yanında ne önemlidir?', 'Besides total debt, what matters when assessing debt risk?'), correct: p('Ödeme zamanı ve şirketin nakit gücü', 'Payment timing and company cash strength'), incorrect: [p('Yalnız şirket adının uzunluğu', 'Only the length of the company name'), p('Grafiğin rengi', 'Chart color')], explanation: p('Aynı borç, farklı ödeme takvimleri ve nakit seviyelerinde çok farklı baskı yaratabilir.', 'The same debt can create very different pressure depending on payment timing and cash levels.') },
      { prompt: p('Likidite riski bu derste en basit neyi anlatır?', 'What does liquidity risk most simply mean here?'), correct: p('Yaklaşan ödemeleri karşılayacak nakit bulmakta zorlanma riskini', 'The risk of struggling to find enough cash for upcoming payments'), incorrect: [p('Hissenin kesin düşeceğini', 'That the stock will certainly fall'), p('Şirketin hiç satış yapamayacağını', 'That the company can never make sales')], explanation: p('Şirketin ödeme zamanı geldiğinde yeterli nakde veya finansmana erişebilmesi kritik olabilir.', 'It can be critical for a company to have enough cash or financing when payments come due.') },
      { prompt: p('Borç için sağlıklı ilk kontrol hangisidir?', 'What is a useful first check for debt?'), correct: p('Miktar + vade + nakdi birlikte görmek', 'View amount + timing + cash together'), incorrect: [p('Yalnız toplam borca bakmak', 'Look only at total debt'), p('Yalnız hisse fiyatına bakmak', 'Look only at share price')], explanation: p('Borç yükünün gerçek etkisi, ödeme takvimi ve nakit üretme kapasitesiyle birlikte anlaşılır.', 'The real effect of debt is understood together with maturity timing and cash-generation capacity.') },
    ],
  },
};

function replaceNormal<T extends { normal: LocalizedText; pro?: LocalizedText }>(copy: T, value: CopyPair): T {
  return { ...copy, normal: localized(value) };
}

export function normalizeAcademyFundamentalEditorial(lesson: MicroLesson): MicroLesson {
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
