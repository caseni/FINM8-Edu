import { microLessonSchema } from './schemas';
import type { LocalizedText, MicroLesson } from './types';

type CopyPair = { tr: string; en: string };
type QuestionCopy = {
  prompt: CopyPair;
  correct: CopyPair;
  incorrect: readonly CopyPair[];
  explanation: CopyPair;
};
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
  'lesson.markets.exchanges.001': {
    title: p('Borsa ne işe yarar?', 'What does an exchange do?'),
    objective: p('Borsanın alıcı ve satıcı emirlerini kurallı bir ortamda buluşturduğunu anla.', 'Understand that an exchange brings buyer and seller orders together in a rule-based market.'),
    hook: p('Bir hisse almak istediğinde emrin nereye gider?', 'When you want to buy a stock, where does your order go?'),
    explanation: p('Borsa, almak isteyenlerle satmak isteyenlerin emirlerini aynı kurallar altında buluşturan bir pazardır. Fiyatı borsa seçmez; uygun alış ve satış emirleri eşleştiğinde işlem oluşur. Farklı piyasaların saatleri ve kuralları farklı olabilir.', 'An exchange is a market that brings buy and sell orders together under the same rules. The exchange does not choose the price; a trade forms when compatible orders match. Different markets can have different hours and rules.'),
    misconception: p('Borsa herkese uygulanacak bir fiyat etiketi yazmaz. Piyasa fiyatı katılımcıların emirleri buluştuğunda oluşur.', 'An exchange does not write one price tag for everyone. Market prices form when participant orders meet.'),
    takeaway: p('Borsa fiyatı seçen yer değil; alıcı ve satıcıların kurallı biçimde buluştuğu yerdir.', 'An exchange does not choose prices; it is the place where buyers and sellers meet under common rules.'),
    visualAlt: p('Alıcı emri ile satıcı emrinin borsa üzerinden buluşup işleme dönüştüğünü gösteren sade sahne', 'Simple scene showing a buy order and sell order meeting through an exchange to form a trade'),
    taskPrompt: p('Borsanın en temel işi hangisidir?', 'What is the most basic job of an exchange?'),
    taskCorrect: [p('Alıcı ve satıcı emirlerinin kurallı bir ortamda eşleşmesini sağlamak', 'Provide a rule-based place for buyer and seller orders to match')],
    taskIncorrect: [p('Her varlığın fiyatını tek başına belirlemek', 'Set every asset price by itself'), p('Yatırımcıların kazancını garanti etmek', 'Guarantee investor profits')],
    questions: [
      { prompt: p('Bir borsada fiyat en temelde nasıl oluşur?', 'How does price most basically form on an exchange?'), correct: p('Alış ve satış emirleri eşleştiğinde', 'When buy and sell orders match'), incorrect: [p('Borsa yönetimi fiyatı seçtiğinde', 'When exchange management chooses it'), p('Grafik açıldığında', 'When a chart is opened')], explanation: p('Borsa ortamı sağlar; fiyat, katılımcıların uyumlu emirleri eşleştiğinde ortaya çıkar.', 'The exchange provides the environment; price forms when compatible participant orders match.') },
      { prompt: p('Bütün piyasaların saatleri ve kuralları aynı mıdır?', 'Do all markets have the same hours and rules?'), correct: p('Hayır, piyasalara göre değişebilir', 'No, they can differ by market'), incorrect: [p('Evet, bütün dünyada aynıdır', 'Yes, they are identical worldwide'), p('Yalnız fiyat değişir, kurallar hiç değişmez', 'Only prices change; rules never do')], explanation: p('İşlem saatleri, erişim ve emir kuralları piyasa yapısına göre değişebilir.', 'Trading hours, access, and order rules can vary by market structure.') },
      { prompt: p('Borsa fiyatı tek başına belirler mi?', 'Does the exchange set price by itself?'), correct: p('Hayır', 'No'), incorrect: [p('Evet, her işlemin fiyatını merkezden seçer', 'Yes, it centrally chooses every trade price'), p('Yalnız yükselen fiyatları seçer', 'It only chooses rising prices')], explanation: p('Fiyat keşfi alıcı ve satıcı emirlerinden gelir; borsa bu emirlerin buluşacağı altyapıyı sağlar.', 'Price discovery comes from buyer and seller orders; the exchange provides the infrastructure where they meet.') },
    ],
  },
  'lesson.markets.indices.001': {
    title: p('Endeks neyi gösterir?', 'What does an index show?'),
    objective: p('Endeksin seçilmiş bir varlık grubunun genel hareketini tek ölçüde özetlediğini anla.', 'Understand that an index summarizes the overall movement of a selected group of assets in one measure.'),
    hook: p('BIST 100 yükseldiğinde içindeki 100 şirketin hepsi yükselmiş midir?', 'If the BIST 100 rises, did every company inside it rise?'),
    explanation: p('Endeks, seçilmiş bir grup varlığın genel hareketini tek sayıda özetler. İçindeki bazı hisseler düşerken endeks yine yükselebilir; çünkü şirketlerin endeksteki etkisi aynı olmayabilir. Endeksi tek tek şirketlerin yerine geçen bir sonuç değil, grubun genel özeti olarak düşün.', 'An index summarizes the overall movement of a selected group of assets in one number. Some stocks can fall while the index still rises because not every company has the same influence. Think of an index as a group summary, not as the result of every company inside it.'),
    misconception: p('Endeks yükseldi diye içindeki her hisse yükselmiş olmak zorunda değildir.', 'An index rising does not mean every stock inside it must have risen.'),
    takeaway: p('Endeks bir grubun genel özetidir; grubun bütün üyeleri aynı yönde hareket etmek zorunda değildir.', 'An index is a summary of a group; every member of that group does not have to move in the same direction.'),
    visualAlt: p('Bazıları yükselip biri düşen birkaç şirketin tek bir endeks özetinde birleşmesini gösteren sade sahne', 'Simple scene showing several companies with mixed moves combining into one index summary'),
    taskPrompt: p('Bir endeks yükselirken içindeki bazı hisseler düşebilir mi?', 'Can some stocks fall while an index rises?'),
    taskCorrect: [p('Evet, grubun içindeki şirketler farklı hareket edebilir', 'Yes, companies inside the group can move differently')],
    taskIncorrect: [p('Hayır, bütün hisseler aynı yönde gitmek zorundadır', 'No, every stock must move in the same direction'), p('Endeks yalnız tek bir şirketi gösterir', 'An index only represents one company')],
    questions: [
      { prompt: p('Endeks en basit hâliyle ne yapar?', 'What does an index most simply do?'), correct: p('Seçilmiş bir grubun genel hareketini özetler', 'Summarizes the overall movement of a selected group'), incorrect: [p('Her hisseye aynı fiyatı verir', 'Gives every stock the same price'), p('Gelecekteki kazancı garanti eder', 'Guarantees future gains')], explanation: p('Endeks, belirlenmiş bir varlık grubunu tek bir özet ölçüyle takip etmeyi kolaylaştırır.', 'An index makes it easier to track a defined group of assets through one summary measure.') },
      { prompt: p('Endeks yükselirken bir bileşen düşebilir mi?', 'Can one constituent fall while the index rises?'), correct: p('Evet', 'Yes'), incorrect: [p('Hayır, bu mümkün değildir', 'No, that is impossible'), p('Yalnız piyasa kapalıysa', 'Only when the market is closed')], explanation: p('Grubun üyeleri farklı yönlerde hareket edebilir ve toplam sonuç yine pozitif olabilir.', 'Members of the group can move in different directions while the overall result remains positive.') },
      { prompt: p('Endeksi nasıl düşünmek daha doğrudur?', 'What is the better way to think about an index?'), correct: p('Bir grubun genel özeti olarak', 'As a broad summary of a group'), incorrect: [p('İçindeki her şirketin birebir aynı sonucu olarak', 'As the exact same result for every company inside it'), p('Kesin gelecek tahmini olarak', 'As a certain forecast of the future')], explanation: p('Endeks genel resmi özetler; tek tek şirketlerin davranışını ayrı ayrı açıklamaz.', 'An index summarizes the broad picture; it does not explain every company individually.') },
    ],
  },
  'lesson.markets.etf.001': {
    title: p('Tek işlemle bir sepete nasıl yatırım yapılır?', 'How can one trade give access to a basket?'),
    objective: p('ETF’nin borsada alınabilen ve içinde bir varlık sepeti taşıyabilen fon payı olduğunu anla.', 'Understand that an ETF is a fund share traded on an exchange that can hold a basket of assets.'),
    hook: p('Tek tek onlarca varlık almak yerine bir sepeti tek işlemle almak mümkün mü?', 'Can you buy a basket in one trade instead of buying dozens of assets one by one?'),
    explanation: p('Evet. Bazı fonların payları borsada hisse gibi alınıp satılır ve içinde bir grup varlık bulunabilir. Bu yapıya ETF denir. Bir ETF’nin riskini anlamak için önce adından çok, hangi varlıkları veya hangi alanı taşıdığına bak.', 'Yes. Some fund shares trade on an exchange like stocks and can hold a group of assets. This structure is called an ETF. To understand an ETF’s risk, look first at what assets or exposure it actually holds rather than just its name.'),
    misconception: p('ETF etiketi otomatik olarak güvenli veya iyi çeşitlendirilmiş anlamına gelmez. İçindeki sepet dar veya riskli olabilir.', 'The ETF label does not automatically mean safe or well diversified. The basket inside can still be narrow or risky.'),
    takeaway: p('ETF bir paket gibidir; karar vermeden önce paketin içinde ne olduğuna bak.', 'An ETF is like a package; look at what is inside before judging it.'),
    visualAlt: p('Tek bir ETF payının altında birkaç farklı varlıktan oluşan sade bir sepet gösteren sahne', 'Simple scene showing one ETF share linked to a basket of several different assets'),
    taskPrompt: p('Bir ETF’yi anlamak için ilk bakman gereken şey nedir?', 'What should you look at first to understand an ETF?'),
    taskCorrect: [p('Hangi varlıkları veya alanı taşıdığı', 'Which assets or exposure it actually holds')],
    taskIncorrect: [p('Yalnız adında ETF yazması', 'Only that ETF appears in its name'), p('Logosunun nasıl göründüğü', 'What its logo looks like')],
    questions: [
      { prompt: p('ETF en basit hâliyle nedir?', 'What is an ETF most simply?'), correct: p('Borsada işlem görebilen bir fon payı', 'A fund share that can trade on an exchange'), incorrect: [p('Kesin kazanç veren bir hesap', 'An account that guarantees profit'), p('Tek bir şirketin zorunlu olarak hissesi', 'Always the stock of one company')], explanation: p('ETF, bir fon yapısına erişim sağlayan ve borsada alınıp satılabilen paydır.', 'An ETF is a share that provides access to a fund structure and can be bought or sold on an exchange.') },
      { prompt: p('Her ETF çok sayıda farklı varlık taşır mı?', 'Does every ETF hold many different assets?'), correct: p('Hayır, bazı ETF’ler dar bir alana yoğunlaşabilir', 'No, some ETFs can be concentrated in a narrow area'), incorrect: [p('Evet, her ETF otomatik olarak geniş çeşitlendirilmiştir', 'Yes, every ETF is automatically broadly diversified'), p('ETF’lerin içinde hiç varlık bulunmaz', 'ETFs never contain any assets')], explanation: p('ETF’nin içeriği ürüne göre değişir; bazıları geniş, bazıları ise oldukça dar bir sepete sahip olabilir.', 'ETF holdings vary by product; some are broad while others can be quite concentrated.') },
      { prompt: p('ETF’nin riskini anlamada en önemli ilk soru nedir?', 'What is the most important first question when judging ETF risk?'), correct: p('Bu ETF aslında neyi taşıyor?', 'What does this ETF actually hold?'), incorrect: [p('Adı ne kadar kısa?', 'How short is its name?'), p('Grafiğin rengi ne?', 'What color is the chart?')], explanation: p('ETF’nin temel riski büyük ölçüde içindeki varlıkların ve izlediği alanın riskinden gelir.', 'Much of an ETF’s core risk comes from the assets and exposure inside it.') },
    ],
  },
  'lesson.markets.bonds.001': {
    title: p('Tahvil nedir, fiyatı neden değişebilir?', 'What is a bond, and why can its price change?'),
    objective: p('Tahvilin bir borç ilişkisi olduğunu ve piyasa faizleri değiştikçe tahvil fiyatının da değişebildiğini anla.', 'Understand that a bond is a lending relationship and that its market price can change as market interest rates change.'),
    hook: p('Bir devlete veya şirkete borç vermek yatırım olabilir mi?', 'Can lending money to a government or company be an investment?'),
    explanation: p('Tahvil, bir devletin ya da şirketin borçlanmak için çıkardığı araçtır. Tahvil alan kişi belirli koşullarla borç verir ve karşılığında ödeme bekler. Piyasadaki faizler değiştiğinde eski tahvillerin cazibesi değişebildiği için fiyatları da yükselebilir veya düşebilir.', 'A bond is an instrument a government or company uses to borrow money. The buyer lends under defined terms and expects payments in return. When market interest rates change, older bonds can become more or less attractive, so their market prices can rise or fall.'),
    misconception: p('Tahvile “sabit getirili” denmesi, tahvilin piyasa fiyatının sabit kalacağı anlamına gelmez.', 'Calling a bond “fixed income” does not mean its market price stays fixed.'),
    takeaway: p('Tahvil bir borç ilişkisidir; piyasadaki faizler değiştikçe tahvilin piyasa fiyatı da değişebilir.', 'A bond is a lending relationship; as market rates change, the bond’s market price can change too.'),
    visualAlt: p('Yatırımcıdan devlet veya şirkete giden borç ve geri dönen ödemeleri gösteren sade tahvil sahnesi', 'Simple bond scene showing money lent from an investor to a government or company and payments returning'),
    taskPrompt: p('Tahvili en basit hangi cümle açıklar?', 'Which sentence most simply describes a bond?'),
    taskCorrect: [p('Bir devlete veya şirkete belirli koşullarla borç vermek', 'Lending to a government or company under defined terms')],
    taskIncorrect: [p('Bir şirkete doğrudan ortak olmak', 'Becoming a direct owner of a company'), p('Fiyatı hiç değişmeyen para tutmak', 'Holding money whose price never changes')],
    questions: [
      { prompt: p('Tahvil en basit hâliyle neyi temsil eder?', 'What does a bond most simply represent?'), correct: p('Borç verme ilişkisini', 'A lending relationship'), incorrect: [p('Şirkete ortak olmayı', 'Ownership in a company'), p('Bir emtiayı fiziksel olarak taşımayı', 'Physically carrying a commodity')], explanation: p('Tahvil alan kişi ihraççıya belirli koşullarla borç vermiş olur.', 'A bond buyer lends money to the issuer under defined terms.') },
      { prompt: p('Tahvilin piyasa fiyatı neden değişebilir?', 'Why can a bond’s market price change?'), correct: p('Piyasa faizleri ve risk algısı değişebildiği için', 'Because market rates and perceived risk can change'), incorrect: [p('Tahvil fiyatı hiçbir zaman değişmez', 'Bond prices never change'), p('Yalnız şirket logosu değiştiği için', 'Only because a company logo changes')], explanation: p('Yeni faiz koşulları eski tahvilin cazibesini değiştirerek piyasa fiyatını etkileyebilir.', 'New interest-rate conditions can change the appeal of an existing bond and affect its market price.') },
      { prompt: p('“Sabit getirili” ifadesi ne anlama gelmez?', 'What does “fixed income” not mean?'), correct: p('Piyasa fiyatının her zaman sabit kalacağını', 'That the market price will always stay fixed'), incorrect: [p('Tahvilin belirli ödeme koşulları olabileceğini', 'That a bond can have defined payment terms'), p('Tahvilin bir borç aracı olabileceğini', 'That a bond can be a debt instrument')], explanation: p('Tahvilin ödeme yapısı belirli olabilir ancak ikincil piyasadaki fiyatı yine değişebilir.', 'A bond can have defined payment terms while its secondary-market price can still change.') },
    ],
  },
  'lesson.markets.forex.001': {
    title: p('Döviz kuru aslında neyi karşılaştırır?', 'What does an exchange rate actually compare?'),
    objective: p('Döviz kurunun iki para biriminin birbirine göre değerini gösterdiğini anla.', 'Understand that an exchange rate shows the value of one currency relative to another.'),
    hook: p('EUR/USD 1,10 yazması ne demek?', 'What does EUR/USD 1.10 mean?'),
    explanation: p('Döviz kuru iki para biriminin birbirine göre değerini gösterir. EUR/USD 1,10 ise 1 euro yaklaşık 1,10 dolar değerindedir. Bu yüzden “euro yükseldi” demek tek başına eksiktir; hangi paraya göre yükseldiğini söylemek gerekir.', 'An exchange rate shows the value of one currency relative to another. If EUR/USD is 1.10, one euro is worth about 1.10 dollars. That is why saying “the euro rose” is incomplete unless you say relative to which currency.'),
    misconception: p('Döviz kuru bir paranın tek başına mutlak değeri değildir; iki para arasındaki karşılaştırmadır.', 'An exchange rate is not the absolute value of one currency by itself; it is a comparison between two currencies.'),
    takeaway: p('Kur her zaman iki taraflıdır: bir para diğerine göre değerlenir veya zayıflar.', 'An exchange rate is always relative: one currency strengthens or weakens against another.'),
    visualAlt: p('Bir euro ile karşılığındaki dolar miktarını yan yana gösteren sade döviz karşılaştırması', 'Simple currency comparison showing one euro beside its dollar equivalent'),
    taskPrompt: p('EUR/USD kuru en basit neyi gösterir?', 'What does EUR/USD most simply show?'),
    taskCorrect: [p('Euro ile doların birbirine göre değerini', 'The value of the euro relative to the dollar')],
    taskIncorrect: [p('Euro’nun tek başına değişmez değerini', 'An unchanging absolute value of the euro'), p('Bir şirketin kârını', 'A company’s profit')],
    questions: [
      { prompt: p('Döviz kuru neyi karşılaştırır?', 'What does an exchange rate compare?'), correct: p('İki para biriminin birbirine göre değerini', 'The value of two currencies relative to each other'), incorrect: [p('İki şirketin çalışan sayısını', 'The employee counts of two companies'), p('Bir emtianın ağırlığını', 'The weight of a commodity')], explanation: p('Kur, bir para biriminin diğer para cinsinden ne kadar değer taşıdığını gösterir.', 'An exchange rate shows how much one currency is worth in terms of another.') },
      { prompt: p('EUR/USD yükselirse ne söyleyebilirsin?', 'If EUR/USD rises, what can you say?'), correct: p('Euro dolar karşısında göreli olarak güçlenmiştir', 'The euro has strengthened relative to the dollar'), incorrect: [p('Bütün para birimleri aynı anda güçlenmiştir', 'Every currency strengthened at the same time'), p('Doların dünyadaki bütün fiyatları sabitlenmiştir', 'All dollar prices worldwide became fixed')], explanation: p('Bir döviz çiftindeki hareket her zaman iki para arasındaki göreli değişimi anlatır.', 'A currency-pair move always describes a relative change between two currencies.') },
      { prompt: p('“Euro yükseldi” cümlesi neden eksik olabilir?', 'Why can the sentence “the euro rose” be incomplete?'), correct: p('Hangi para birimine göre yükseldiğini söylemediği için', 'Because it does not say relative to which currency'), incorrect: [p('Döviz kurları hiç değişmediği için', 'Because exchange rates never change'), p('Euro bir para birimi olmadığı için', 'Because the euro is not a currency')], explanation: p('Döviz değeri daima başka bir para birimine göre ifade edilir.', 'Currency value is always expressed relative to another currency.') },
    ],
  },
  'lesson.markets.commodities.001': {
    title: p('Altın, petrol ve buğday neden aynı grupta?', 'Why are gold, oil, and wheat in the same group?'),
    objective: p('Emtianın altın, petrol veya buğday gibi ticareti yapılan temel ürünleri ifade ettiğini anla.', 'Understand that commodities are basic traded goods such as gold, oil, or wheat.'),
    hook: p('Altınla petrolün ortak noktası nedir?', 'What do gold and oil have in common?'),
    explanation: p('Altın, petrol, buğday gibi ticareti yapılan temel ürünlere emtia denir. Fiyatları arz, talep, üretim, hava koşulları, stoklar ve küresel gelişmelerden etkilenebilir. Hepsi emtia olsa da aynı nedenle veya aynı yönde hareket etmek zorunda değildir.', 'Basic traded goods such as gold, oil, and wheat are called commodities. Their prices can be affected by supply, demand, production, weather, inventories, and global events. Even though they are all commodities, they do not have to move for the same reasons or in the same direction.'),
    misconception: p('Emtia tek bir ürün değildir. Altın, petrol ve tarım ürünlerinin fiyatını etkileyen koşullar birbirinden farklı olabilir.', 'Commodities are not one single product. Gold, oil, and agricultural goods can be driven by very different conditions.'),
    takeaway: p('Emtia gerçek bir ürünü temsil eder; fiyatını o ürünün kendi arz ve talep koşulları etkiler.', 'A commodity represents a real good; its price is influenced by the supply and demand conditions of that good.'),
    visualAlt: p('Altın külçesi, petrol varili ve buğdayı üç farklı gerçek ürün olarak gösteren sade emtia sahnesi', 'Simple commodity scene showing a gold bar, oil barrel, and wheat as three different real goods'),
    taskPrompt: p('Hangisi emtiaya örnektir?', 'Which is an example of a commodity?'),
    taskCorrect: [p('Altın, petrol veya buğday gibi temel ürünler', 'Basic goods such as gold, oil, or wheat')],
    taskIncorrect: [p('Bir şirketin yönetim kurulu', 'A company board of directors'), p('Bir uygulamanın kullanıcı adı', 'An app username')],
    questions: [
      { prompt: p('Emtia en basit hâliyle nedir?', 'What is a commodity most simply?'), correct: p('Ticareti yapılan temel bir ürün', 'A basic good that is traded'), incorrect: [p('Bir şirketin ortaklık payı', 'An ownership stake in a company'), p('Bir bankanın şube kodu', 'A bank branch code')], explanation: p('Altın, petrol ve tarım ürünleri gibi temel mallar emtia piyasalarında alınıp satılabilir.', 'Basic goods such as gold, oil, and agricultural products can trade in commodity markets.') },
      { prompt: p('Bütün emtialar aynı nedenle mi hareket eder?', 'Do all commodities move for the same reasons?'), correct: p('Hayır, her ürünün arz ve talep koşulları farklı olabilir', 'No, each product can have different supply and demand conditions'), incorrect: [p('Evet, hepsi her zaman aynı yönde gider', 'Yes, they always move in the same direction'), p('Emtia fiyatları hiç değişmez', 'Commodity prices never change')], explanation: p('Petrol, altın ve buğdayın üretim, stok ve talep koşulları birbirinden farklı olabilir.', 'Oil, gold, and wheat can have very different production, inventory, and demand conditions.') },
      { prompt: p('Bir emtianın fiyatını ne etkileyebilir?', 'What can affect a commodity price?'), correct: p('Arz, talep ve o ürüne özgü gelişmeler', 'Supply, demand, and events specific to that good'), incorrect: [p('Yalnız uygulama temasının rengi', 'Only the color of an app theme'), p('Hiçbir dış koşul', 'No external conditions')], explanation: p('Emtia fiyatı gerçek ürünün bulunabilirliği ve talebi gibi fiziksel ve ekonomik koşullara duyarlıdır.', 'Commodity prices respond to physical and economic conditions such as availability and demand for the real good.') },
    ],
  },
};

function replaceNormal<T extends { normal: LocalizedText; pro?: LocalizedText }>(copy: T, value: CopyPair): T {
  return { ...copy, normal: localized(value) };
}

export function normalizeAcademyMarketsEditorial(lesson: MicroLesson): MicroLesson {
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
    const pool = taskCorrectIds.has(choice.id) ? copy.taskCorrect : copy.taskIncorrect;
    const index = taskCorrectIds.has(choice.id) ? correctTaskIndex++ : incorrectTaskIndex++;
    return { ...choice, label: localized(pool[index % pool.length]) };
  });

  const questions = lesson.quiz.questions.map((question, questionIndex) => {
    const questionCopy = copy.questions[questionIndex];
    let incorrectIndex = 0;
    const options = question.options.map((option) => ({
      ...option,
      label: localized(
        option.id === question.correctOptionId
          ? questionCopy.correct
          : questionCopy.incorrect[(incorrectIndex++) % questionCopy.incorrect.length],
      ),
    }));
    return {
      ...question,
      prompt: localized(questionCopy.prompt),
      options,
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
