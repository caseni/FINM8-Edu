import type { MicroLesson } from './types';

type Localized = { tr: string; en: string };

type BeginnerLessonCopy = {
  title: Localized;
  objective: Localized;
  hook: Localized;
  explanation: Localized;
  misconception: Localized;
  takeaway: Localized;
  visualAlt: Localized;
  taskPrompt: Localized;
  taskChoices: readonly Localized[];
  questions: readonly {
    prompt: Localized;
    choices: readonly Localized[];
    explanation: Localized;
  }[];
};

const COPY: Readonly<Record<string, BeginnerLessonCopy>> = {
  'lesson.market.price-formation.001': {
    title: { tr: 'Bir fiyat nasıl ortaya çıkar?', en: 'How does a price appear?' },
    objective: { tr: 'Alıcı ve satıcı aynı fiyatta buluştuğunda işlemin ve piyasa fiyatının nasıl oluştuğunu anla.', en: 'Understand how a trade and market price form when a buyer and seller meet at the same price.' },
    hook: { tr: 'Bir ürünün fiyatını kim seçiyor?', en: 'Who chooses the price of something?' },
    explanation: { tr: 'Piyasada alıcılar ne kadar ödemek istediklerini, satıcılar da kaça satmak istediklerini söyler. İki taraf aynı fiyatta buluştuğunda işlem olur. Ekranda gördüğün fiyat, gerçekleşen son işlemin fiyatıdır.', en: 'In a market, buyers say what they are willing to pay and sellers say what they are willing to accept. A trade happens when both sides meet at the same price. The price on screen is the price of the latest completed trade.' },
    misconception: { tr: 'Fiyatı şirket veya borsa tek başına belirlemez. Fiyat, alıcı ve satıcıların buluşmasıyla oluşur.', en: 'A company or exchange does not choose the price by itself. Price forms when buyers and sellers meet.' },
    takeaway: { tr: 'Fiyat sabit bir etiket değil; alıcı ve satıcının buluştuğu noktadır.', en: 'Price is not a fixed label; it is the point where a buyer and seller meet.' },
    visualAlt: { tr: 'Bir alıcı ile bir satıcının aynı fiyatta buluşup işlem oluşturduğunu gösteren sade piyasa sahnesi', en: 'Simple market scene showing a buyer and seller meeting at the same price to create a trade' },
    taskPrompt: { tr: 'Bir piyasa fiyatını en basit şekilde ne oluşturur?', en: 'What most simply creates a market price?' },
    taskChoices: [
      { tr: 'Alıcı ve satıcının aynı fiyatta buluşması', en: 'A buyer and seller meeting at the same price' },
      { tr: 'Şirketin her dakika yeni fiyat seçmesi', en: 'The company choosing a new price every minute' },
      { tr: 'Eski fiyatın hiç değişmeden kalması', en: 'The old price never changing' },
    ],
    questions: [
      { prompt: { tr: 'Bir işlem ne zaman oluşur?', en: 'When does a trade happen?' }, choices: [{ tr: 'Alıcı ve satıcı aynı fiyatta buluştuğunda', en: 'When a buyer and seller meet at the same price' }, { tr: 'Şirket yeni fiyat yazdığında', en: 'When the company writes a new price' }, { tr: 'Grafik açıldığında', en: 'When a chart is opened' }], explanation: { tr: 'İşlem, uyumlu bir alış ve satış isteği buluştuğunda gerçekleşir.', en: 'A trade happens when compatible buy and sell intentions meet.' } },
      { prompt: { tr: 'Ekrandaki son fiyat neyi gösterir?', en: 'What does the last price on screen show?' }, choices: [{ tr: 'Gelecekteki kesin fiyatı', en: 'The guaranteed future price' }, { tr: 'Gerçekleşmiş son işlemin fiyatını', en: 'The price of the latest completed trade' }, { tr: 'Şirketin hedef fiyatını', en: "The company's target price" }], explanation: { tr: 'Son fiyat geçmişte gerçekleşen en son işlemdir; sonraki fiyatı garanti etmez.', en: 'The last price is the most recent completed trade; it does not guarantee the next price.' } },
      { prompt: { tr: 'Yeni alıcılar ve satıcılar gelirse ne olabilir?', en: 'What can happen when new buyers and sellers arrive?' }, choices: [{ tr: 'Fiyat değişebilir', en: 'Price can change' }, { tr: 'Fiyat sonsuza kadar aynı kalır', en: 'Price stays the same forever' }, { tr: 'Piyasa kapanır', en: 'The market closes' }], explanation: { tr: 'Yeni alış ve satış istekleri buluşma noktasını değiştirebilir.', en: 'New buy and sell intentions can change the point where they meet.' } },
    ],
  },
  'lesson.market.instruments.001': {
    title: { tr: 'Piyasada aldığın şey aslında nedir?', en: 'What are you actually buying in a market?' },
    objective: { tr: 'Hisse, tahvil, döviz ve emtianın aynı şeyi temsil etmediğini günlük dille ayırt et.', en: 'Distinguish in plain language that stocks, bonds, currencies, and commodities do not represent the same thing.' },
    hook: { tr: 'Bir hisse almakla altın almak aynı şey mi?', en: 'Is buying a stock the same as buying gold?' },
    explanation: { tr: 'Hayır. Hisse bir şirkette küçük bir ortaklığı, tahvil bir kuruma borç vermeyi, döviz bir paranın başka bir paraya göre değerini, emtia ise altın veya petrol gibi bir ürünü temsil eder.', en: 'No. A stock represents a small ownership stake in a company, a bond represents lending to an issuer, foreign exchange compares one currency with another, and a commodity represents a product such as gold or oil.' },
    misconception: { tr: 'Grafikleri benziyor diye hepsini aynı ürün sanma. Ne aldığın değişince taşıdığın risk de değişir.', en: 'Do not treat them as the same product just because their charts look similar. Different things carry different risks.' },
    takeaway: { tr: 'Önce ne aldığını bil; neyi temsil ettiği değişince riski de değişir.', en: 'Know what you are buying first; when what it represents changes, its risks change too.' },
    visualAlt: { tr: 'Şirket ortaklığı, borç, para birimleri ve altın gibi gerçek varlıkları birbirinden ayıran sade görsel', en: 'Simple visual separating company ownership, lending, currencies, and real assets such as gold' },
    taskPrompt: { tr: 'Hangisi bir şirkete küçük bir ortaklığı temsil eder?', en: 'Which represents a small ownership stake in a company?' },
    taskChoices: [{ tr: 'Hisse senedi', en: 'Stock' }, { tr: 'Tahvil', en: 'Bond' }, { tr: 'Döviz çifti', en: 'Currency pair' }],
    questions: [
      { prompt: { tr: 'Tahvil en basit hâliyle neyi temsil eder?', en: 'What does a bond most simply represent?' }, choices: [{ tr: 'Bir kuruma borç vermeyi', en: 'Lending to an issuer' }, { tr: 'Bir şirkete ortak olmayı', en: 'Owning part of a company' }, { tr: 'Altın satın almayı', en: 'Buying gold' }], explanation: { tr: 'Tahvil, parayı belirli koşullarla bir kuruma borç verme ilişkisidir.', en: 'A bond represents lending money to an issuer under defined terms.' } },
      { prompt: { tr: 'Döviz neyi karşılaştırır?', en: 'What does foreign exchange compare?' }, choices: [{ tr: 'Bir şirketin kârını', en: "A company's profit" }, { tr: 'İki para biriminin birbirine göre değerini', en: 'The value of two currencies relative to each other' }, { tr: 'Bir fabrikanın üretimini', en: "A factory's output" }], explanation: { tr: 'Döviz piyasasında bir para biriminin diğerine göre değeri izlenir.', en: 'Foreign exchange tracks the value of one currency relative to another.' } },
      { prompt: { tr: 'Neden her piyasa aracını aynı şekilde değerlendirmemelisin?', en: 'Why should you not treat every market instrument the same way?' }, choices: [{ tr: 'Farklı şeyleri temsil ettikleri için', en: 'Because they represent different things' }, { tr: 'Hepsinin fiyatı sabit olduğu için', en: 'Because all their prices are fixed' }, { tr: 'Hiçbirinin riski olmadığı için', en: 'Because none of them has risk' }], explanation: { tr: 'Araç değiştiğinde ekonomik anlamı ve temel risk kaynağı da değişebilir.', en: 'When the instrument changes, its economic meaning and core risk source can change too.' } },
    ],
  },
  'lesson.market.liquidity.001': {
    title: { tr: 'Neden bazen alıp satmak kolay, bazen zor?', en: 'Why is buying and selling sometimes easy and sometimes hard?' },
    objective: { tr: 'Karşı tarafta yeterli alıcı ve satıcı olmasının işlem kolaylığını nasıl etkilediğini anla.', en: 'Understand how having enough buyers and sellers affects how easy it is to trade.' },
    hook: { tr: 'Bir şeyi satmak istediğinde karşıda alıcı yoksa ne olur?', en: 'What happens if you want to sell but there is no buyer on the other side?' },
    explanation: { tr: 'Alıcı ve satıcı çoksa işlem yapmak genellikle kolaydır. Karşı taraf azsa istediğin fiyata yakın alıp satmak zorlaşabilir. Bu işlem kolaylığına likidite denir.', en: 'Trading is usually easier when there are many buyers and sellers. If there are few people on the other side, it can be harder to trade near the price you want. This ease of trading is called liquidity.' },
    misconception: { tr: 'Bir piyasada çok işlem görülmesi, her anda istediğin miktarı istediğin fiyata yakın satabileceğin anlamına gelmez.', en: 'A market having many trades does not mean you can always trade any size near the price you want.' },
    takeaway: { tr: 'Likidite, alıp satmanın ne kadar kolay olduğunu anlatır.', en: 'Liquidity describes how easy it is to buy or sell.' },
    visualAlt: { tr: 'Kalabalık alıcı-satıcı bulunan bir piyasa ile karşı tarafın az olduğu sakin bir piyasayı karşılaştıran sade sahne', en: 'Simple scene comparing a busy market with many buyers and sellers against a quiet market with few participants' },
    taskPrompt: { tr: 'Hangi durumda satış yapmak daha zor olabilir?', en: 'In which situation can selling be harder?' },
    taskChoices: [{ tr: 'Karşı tarafta az alıcı olduğunda', en: 'When there are few buyers on the other side' }, { tr: 'Karşı tarafta çok sayıda alıcı olduğunda', en: 'When there are many buyers on the other side' }, { tr: 'Ürünün tanınmış bir adı olduğunda', en: 'When the product has a well-known name' }],
    questions: [
      { prompt: { tr: 'Likidite en basit hâliyle neyi anlatır?', en: 'What does liquidity most simply describe?' }, choices: [{ tr: 'Alıp satmanın ne kadar kolay olduğunu', en: 'How easy it is to buy or sell' }, { tr: 'Bir şirketin kaç çalışanı olduğunu', en: 'How many employees a company has' }, { tr: 'Grafiğin rengini', en: 'The color of a chart' }], explanation: { tr: 'Likidite, işlem yapmak için karşı tarafta yeterli ilgi bulunup bulunmadığıyla ilgilidir.', en: 'Liquidity is about whether there is enough interest on the other side to trade.' } },
      { prompt: { tr: 'Karşı tarafta alıcı azsa ne olabilir?', en: 'What can happen when there are few buyers?' }, choices: [{ tr: 'İstediğin fiyata yakın satmak zorlaşabilir', en: 'Selling near the price you want can become harder' }, { tr: 'Satış her zaman daha kolay olur', en: 'Selling always becomes easier' }, { tr: 'Fiyat otomatik sabitlenir', en: 'Price automatically becomes fixed' }], explanation: { tr: 'Az sayıda alıcı olduğunda satıcı daha düşük fiyatları kabul etmek zorunda kalabilir.', en: 'With fewer buyers, a seller may need to accept lower prices to complete a trade.' } },
      { prompt: { tr: 'Çok işlem görülmesi tek başına her an yüksek likiditeyi garanti eder mi?', en: 'Do many trades alone guarantee high liquidity at every moment?' }, choices: [{ tr: 'Hayır', en: 'No' }, { tr: 'Evet, her zaman', en: 'Yes, always' }, { tr: 'Yalnız hafta sonu', en: 'Only on weekends' }], explanation: { tr: 'Önemli olan o anda ve senin işlem büyüklüğün için yeterli karşı taraf bulunmasıdır.', en: 'What matters is whether enough opposing interest exists at that moment for the size you want to trade.' } },
    ],
  },
  'lesson.market.bid-ask.001': {
    title: { tr: 'Alış ve satış fiyatı neden farklı olabilir?', en: 'Why can the buy and sell prices be different?' },
    objective: { tr: 'Aynı varlık için alıcının teklifi ile satıcının teklifi arasındaki farkı anla.', en: 'Understand the difference between the buyer offer and seller offer for the same asset.' },
    hook: { tr: 'Aynı varlık için neden iki fiyat görürsün?', en: 'Why can you see two prices for the same asset?' },
    explanation: { tr: 'Bir tarafta alıcıların ödemek istediği en yüksek fiyat, diğer tarafta satıcıların kabul ettiği en düşük fiyat vardır. Bu iki fiyatın arasındaki fark küçük bir işlem maliyetidir. Bu farka spread denir.', en: 'On one side is the highest price buyers are willing to pay; on the other is the lowest price sellers are willing to accept. The gap between these two prices is a small trading cost called the spread.' },
    misconception: { tr: 'Ekrandaki son işlem fiyatı, şu anda hem alış hem de satış fiyatın değildir.', en: 'The last traded price on screen is not both your current buy price and sell price.' },
    takeaway: { tr: 'Alıcının teklifi ile satıcının teklifi farklı olabilir; aradaki fark spread’dir.', en: 'The buyer offer and seller offer can differ; the gap between them is the spread.' },
    visualAlt: { tr: 'Aynı ürün için solda alıcı teklifi, sağda satıcı teklifi ve ortada aradaki küçük farkı gösteren sade görsel', en: 'Simple visual showing a buyer offer on the left, a seller offer on the right, and the small gap between them' },
    taskPrompt: { tr: 'Alıcı 99, satıcı 101 diyorsa aradaki fark kaçtır?', en: 'If the buyer offers 99 and the seller asks 101, what is the gap?' },
    taskChoices: [{ tr: '2', en: '2' }, { tr: '1', en: '1' }, { tr: '200', en: '200' }],
    questions: [
      { prompt: { tr: 'Alıcının teklifi neyi gösterir?', en: "What does the buyer's offer show?" }, choices: [{ tr: 'Alıcının ödemeye hazır olduğu fiyatı', en: 'The price the buyer is willing to pay' }, { tr: 'Satıcının istediği fiyatı', en: 'The price the seller wants' }, { tr: 'Dünkü kapanışı', en: "Yesterday's close" }], explanation: { tr: 'Alış teklifi, alıcının o anda ödemeye hazır olduğu fiyatı gösterir.', en: 'The buy offer shows the price a buyer is willing to pay at that moment.' } },
      { prompt: { tr: 'Satıcının teklifi neyi gösterir?', en: "What does the seller's offer show?" }, choices: [{ tr: 'Alıcının istediği fiyatı', en: 'The price the buyer wants' }, { tr: 'Satıcının kabul etmeye hazır olduğu fiyatı', en: 'The price the seller is willing to accept' }, { tr: 'Bir şirketin kârını', en: "A company's profit" }], explanation: { tr: 'Satış teklifi, satıcının o anda kabul etmeye hazır olduğu fiyatı gösterir.', en: 'The sell offer shows the price a seller is willing to accept at that moment.' } },
      { prompt: { tr: 'İki teklif arasındaki farkın adı nedir?', en: 'What is the gap between the two offers called?' }, choices: [{ tr: 'Spread', en: 'Spread' }, { tr: 'Temettü', en: 'Dividend' }, { tr: 'Bilanço', en: 'Balance sheet' }], explanation: { tr: 'Alış ve satış teklifleri arasındaki fark spread olarak adlandırılır.', en: 'The gap between the buy and sell offers is called the spread.' } },
    ],
  },
  'lesson.market.order-types.001': {
    title: { tr: 'Emir verirken aslında ne seçiyorsun?', en: 'What are you really choosing when you place an order?' },
    objective: { tr: 'Hız, fiyat sınırı ve tetikleme arasında emir türlerinin temel farkını anla.', en: 'Understand the basic difference between order types in speed, price limits, and triggers.' },
    hook: { tr: 'Hemen işlem yapmak mı, fiyatı sınırlamak mı?', en: 'Trade now, or control the price?' },
    explanation: { tr: 'Piyasa emri hızlı gerçekleşmeyi hedefler ama fiyatı garanti etmez. Limit emir bir fiyat sınırı koyar ama işlem hiç olmayabilir. Stop emir ise belirli bir seviyeye gelindiğinde devreye girmesi için bekler.', en: 'A market order aims to trade quickly but does not guarantee the price. A limit order sets a price boundary but may never trade. A stop order waits until a chosen level is reached before it activates.' },
    misconception: { tr: 'Hiçbir emir türü hem kesin fiyatı hem de kesin gerçekleşmeyi aynı anda garanti etmez.', en: 'No order type guarantees both an exact price and certain execution at the same time.' },
    takeaway: { tr: 'Emir türü, hız ile fiyat kontrolü arasında nasıl tercih yaptığını belirler.', en: 'Order type determines how you trade off speed against price control.' },
    visualAlt: { tr: 'Hemen işlem, fiyat sınırı ve bekleyen tetik olmak üzere üç basit işlem seçeneğini karşılaştıran görsel', en: 'Simple visual comparing trade now, set a price boundary, and wait for a trigger' },
    taskPrompt: { tr: 'Belirlediğin fiyattan daha pahalı almak istemiyorsan hangi emir daha uygundur?', en: 'Which order is more suitable if you do not want to buy above a chosen price?' },
    taskChoices: [{ tr: 'Limit emir', en: 'Limit order' }, { tr: 'Piyasa emri', en: 'Market order' }, { tr: 'Emir türü fark etmez', en: 'Order type does not matter' }],
    questions: [
      { prompt: { tr: 'Piyasa emri neyi garanti etmez?', en: 'What does a market order not guarantee?' }, choices: [{ tr: 'Tam olarak hangi fiyattan gerçekleşeceğini', en: 'The exact price at which it will execute' }, { tr: 'Bir emir olduğunu', en: 'That it is an order' }, { tr: 'Piyasaya gönderildiğini', en: 'That it was sent to the market' }], explanation: { tr: 'Piyasa emri hızı önceler; gerçekleşme anındaki fiyat değişebilir.', en: 'A market order prioritizes speed; the price can change by the time it executes.' } },
      { prompt: { tr: 'Limit emrinin temel riski nedir?', en: 'What is the main risk of a limit order?' }, choices: [{ tr: 'Hiç gerçekleşmeyebilir', en: 'It may not execute at all' }, { tr: 'Her fiyattan gerçekleşir', en: 'It executes at any price' }, { tr: 'Otomatik olarak stop olur', en: 'It automatically becomes a stop order' }], explanation: { tr: 'Fiyat belirlediğin sınıra gelmezse limit emir beklemeye devam edebilir veya hiç gerçekleşmeyebilir.', en: 'If price never reaches your boundary, a limit order can remain unfilled.' } },
      { prompt: { tr: 'Stop emir ne zaman devreye girer?', en: 'When does a stop order activate?' }, choices: [{ tr: 'Belirlenen tetik seviyesine gelindiğinde', en: 'When the chosen trigger level is reached' }, { tr: 'Emir yazıldığı anda her zaman', en: 'Immediately every time it is entered' }, { tr: 'Piyasa kapandığında', en: 'When the market closes' }], explanation: { tr: 'Stop seviyesi emrin devreye girmesi için kullanılan tetiktir; gerçekleşme fiyatı ayrıca piyasa koşullarına bağlıdır.', en: 'The stop level is the trigger that activates the order; the execution price still depends on market conditions.' } },
    ],
  },
  'lesson.market.slippage.001': {
    title: { tr: 'Ekrandaki fiyat neden işlem fiyatın olmayabilir?', en: 'Why might the screen price not be your trade price?' },
    objective: { tr: 'Gördüğün son fiyat ile emrinin gerçekleştiği fiyatın neden biraz farklı olabileceğini anla.', en: 'Understand why the last price you see and the price your order receives can be slightly different.' },
    hook: { tr: 'Ekranda 100 gördün; neden 100,3’ten işlem olabilir?', en: 'You saw 100 on screen; why might your trade happen at 100.3?' },
    explanation: { tr: 'Ekrandaki fiyat, az önce gerçekleşmiş son işlemdir. Senin emrin gerçekleşene kadar fiyat değişebilir veya karşı tarafta yeterli miktar olmayabilir. Gördüğün fiyatla gerçekleşen fiyat arasındaki farka kayma denir.', en: 'The screen price is the most recent trade that already happened. Before your order executes, price can move or there may not be enough quantity on the other side. The difference between the price you saw and the price you receive is called slippage.' },
    misconception: { tr: 'Emir düğmesine bastığın anda ekrandaki fiyat kilitlenmez.', en: 'The price on screen does not lock the moment you press the order button.' },
    takeaway: { tr: 'Görülen fiyat bir referanstır; gerçek işlem fiyatı piyasa koşullarına göre biraz farklı olabilir.', en: 'The displayed price is a reference; the actual trade price can be slightly different depending on market conditions.' },
    visualAlt: { tr: 'Ekranda görülen 100 fiyatından emrin 100,3 civarında gerçekleşmesine giden sade işlem sahnesi', en: 'Simple trade scene moving from a displayed price of 100 to an execution around 100.3' },
    taskPrompt: { tr: 'Kayma hangi durumda daha olasıdır?', en: 'When is slippage more likely?' },
    taskChoices: [{ tr: 'Alıcı-satıcının az olduğu hızlı piyasada büyük emir verirken', en: 'When placing a large order in a fast market with few buyers and sellers' }, { tr: 'Alıcı-satıcının çok olduğu sakin piyasada küçük emir verirken', en: 'When placing a small order in a calm market with many buyers and sellers' }, { tr: 'Hiç emir vermediğinde', en: 'When you place no order' }],
    questions: [
      { prompt: { tr: 'Son fiyat neden işlem garantisi değildir?', en: 'Why is the last price not an execution guarantee?' }, choices: [{ tr: 'Çünkü geçmişte gerçekleşmiş son işlemi gösterir', en: 'Because it shows the latest trade that already happened' }, { tr: 'Çünkü her zaman yanlış yazılır', en: 'Because it is always displayed incorrectly' }, { tr: 'Çünkü yalnız şirket görür', en: 'Because only the company can see it' }], explanation: { tr: 'Senin emrin gelene kadar piyasa değişebilir ve karşı taraftaki fiyatlar hareket edebilir.', en: 'The market can change and opposing prices can move before your order reaches execution.' } },
      { prompt: { tr: 'Gördüğün fiyat ile gerçekleşen fiyat arasındaki farka ne denir?', en: 'What is the difference between the displayed price and the execution price called?' }, choices: [{ tr: 'Kayma', en: 'Slippage' }, { tr: 'Temettü', en: 'Dividend' }, { tr: 'Faiz', en: 'Interest' }], explanation: { tr: 'Bu küçük fark fiyat kayması veya slippage olarak adlandırılır.', en: 'This difference is called price slippage, or simply slippage.' } },
      { prompt: { tr: 'Kayma riski ne zaman artabilir?', en: 'When can slippage risk increase?' }, choices: [{ tr: 'Piyasa hızlı hareket ederken veya karşı taraf az olduğunda', en: 'When the market moves quickly or there are few participants on the other side' }, { tr: 'Fiyat hiç değişmiyorsa', en: 'When price never moves' }, { tr: 'Hiç emir yoksa', en: 'When no order is placed' }], explanation: { tr: 'Hızlı hareket ve düşük likidite, görülen fiyat ile gerçekleşen fiyat arasındaki farkı büyütebilir.', en: 'Fast movement and low liquidity can increase the gap between displayed and executed prices.' } },
    ],
  },
};

function localized(value: Localized) {
  return { tr: value.tr, en: value.en };
}

function audience(value: Localized) {
  return { normal: localized(value) };
}

export function normalizeBeginnerMarketEditorial(lesson: MicroLesson): MicroLesson {
  const copy = COPY[lesson.id];
  if (!copy) return lesson;

  const contentBlocks = lesson.contentBlocks.map((block) => {
    if (block.kind === 'prompt') return { ...block, copy: audience(copy.hook) };
    if (block.kind === 'explanation') {
      return {
        ...block,
        copy: {
          ...block.copy,
          normal: localized(copy.explanation),
        },
      };
    }
    if (block.kind === 'visual') return { ...block, alt: localized(copy.visualAlt) };
    if (block.kind === 'misconception') return { ...block, copy: audience(copy.misconception) };
    return block;
  });

  const practicalTask = {
    ...lesson.practicalTask,
    prompt: audience(copy.taskPrompt),
    choices: lesson.practicalTask.choices.map((choice, index) => ({
      ...choice,
      label: localized(copy.taskChoices[index] ?? copy.taskChoices[copy.taskChoices.length - 1]),
    })),
  };

  const quiz = {
    ...lesson.quiz,
    questions: lesson.quiz.questions.map((question, index) => {
      const replacement = copy.questions[index] ?? copy.questions[copy.questions.length - 1];
      return {
        ...question,
        prompt: localized(replacement.prompt),
        options: question.options.map((option, optionIndex) => ({
          ...option,
          label: localized(replacement.choices[optionIndex] ?? replacement.choices[replacement.choices.length - 1]),
        })),
        explanation: localized(replacement.explanation),
      };
    }),
  };

  return {
    ...lesson,
    title: localized(copy.title),
    learningObjective: localized(copy.objective),
    contentBlocks,
    takeaway: localized(copy.takeaway),
    practicalTask,
    quiz,
  };
}
