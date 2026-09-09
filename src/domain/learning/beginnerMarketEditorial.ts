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
    objective: { tr: 'Alıcı ve satıcı buluşunca fiyatın nasıl oluştuğunu öğren.', en: 'Learn how a price forms when buyers and sellers meet.' },
    hook: { tr: 'Tek bir kişi seçmez; iki tarafın teklifleri buluşur.', en: 'No single person chooses it; the two sides’ offers meet.' },
    explanation: { tr: 'Alıcı bir fiyat teklif eder, satıcı da kabul edeceği fiyatı söyler. İkisi aynı noktada buluşursa işlem gerçekleşir. Ekrandaki son fiyat, bu son işlemin fiyatıdır.', en: 'A buyer offers a price and a seller states what they will accept. When they meet at the same point, a trade happens. The last price on screen is the price of that latest trade.' },
    misconception: { tr: 'Fiyatı tek başına şirket veya borsa belirlemez. İşlem, alıcı ve satıcı buluşunca oluşur.', en: 'A company or exchange does not set the price alone. A trade forms when buyer and seller meet.' },
    takeaway: { tr: 'Uyumlu teklifler, gerçekleşen son işlem fiyatını oluşturur.', en: 'Compatible orders create the latest trade price.' },
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
    objective: { tr: 'Hisse, tahvil, döviz ve emtianın neyi temsil ettiğini ayırt et.', en: 'Tell what stocks, bonds, currencies, and commodities represent.' },
    hook: { tr: 'Bir hisse almakla altın almak aynı şey mi?', en: 'Is buying a stock the same as buying gold?' },
    explanation: { tr: 'Hayır. Hisse şirkete ortaklıktır. Tahvil bir kuruma borç vermektir. Döviz iki paranın birbirine göre değeridir. Emtia ise altın veya petrol gibi bir üründür.', en: 'No. A stock is ownership in a company. A bond is lending to an issuer. Foreign exchange is the relative value of two currencies. A commodity is a product such as gold or oil.' },
    misconception: { tr: 'Grafikleri benzer görünse de aynı şeyi temsil etmezler.', en: 'Their charts can look similar, but they do not represent the same thing.' },
    takeaway: { tr: 'Dört araç, dört farklı ekonomik anlam taşır.', en: 'Four instruments carry four different economic meanings.' },
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
    objective: { tr: 'Bir şeyi alıp satmanın neden bazen kolay, bazen zor olduğunu öğren.', en: 'Learn why buying and selling can be easy at one moment and hard at another.' },
    hook: { tr: 'Satmak istiyorsun ama alıcı yok. Ne olur?', en: 'You want to sell, but there is no buyer. What happens?' },
    explanation: { tr: 'Karşı tarafta çok alıcı ve satıcı varsa işlem yapmak kolaylaşır. Azsa istediğin fiyata yakın işlem yapmak zorlaşır. Buna likidite denir.', en: 'Trading is easier when there are many buyers and sellers on the other side. With fewer participants, trading near the price you want becomes harder. This is liquidity.' },
    misconception: { tr: 'Çok işlem görmek, her an istediğin fiyattan işlem yapabileceğin anlamına gelmez.', en: 'Many trades do not mean you can always trade at the price you want.' },
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
    objective: { tr: 'Aynı varlıkta alış ve satış fiyatının neden farklı olabildiğini öğren.', en: 'Learn why buy and sell prices can differ for the same asset.' },
    hook: { tr: 'Aynı varlık için neden iki fiyat görürsün?', en: 'Why can you see two prices for the same asset?' },
    explanation: { tr: 'Alıcıların vermek istediği en yüksek fiyat ile satıcıların kabul ettiği en düşük fiyat aynı olmayabilir. Aradaki farka spread denir.', en: 'The highest price buyers offer and the lowest price sellers accept may differ. The gap between them is called the spread.' },
    misconception: { tr: 'Son işlem fiyatı, şu anki alış ve satış fiyatıyla aynı olmak zorunda değildir.', en: 'The last traded price does not have to match the current buy and sell prices.' },
    takeaway: { tr: 'Alış ile satış arasındaki fark spread’dir.', en: 'The gap between buy and sell is the spread.' },
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
    objective: { tr: 'Piyasa, limit ve stop emrinin temel farkını öğren.', en: 'Learn the basic difference between market, limit, and stop orders.' },
    hook: { tr: 'Hemen işlem yapmak mı, fiyatı sınırlamak mı?', en: 'Trade now, or control the price?' },
    explanation: { tr: 'Piyasa emri hızlı işlem ister; fiyat değişebilir. Limit emir fiyat sınırı koyar; işlem gerçekleşmeyebilir. Stop emir belirlediğin seviyede devreye girer.', en: 'A market order aims for speed, so the price can change. A limit order sets a price boundary, so it may not execute. A stop order activates at a chosen level.' },
    misconception: { tr: 'Hiçbir emir türü hem kesin fiyatı hem kesin gerçekleşmeyi garanti etmez.', en: 'No order type guarantees both an exact price and certain execution.' },
    takeaway: { tr: 'Emir türü, hız ile fiyat kontrolü arasındaki tercihtir.', en: 'Order type is a choice between speed and price control.' },
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
    objective: { tr: 'Gördüğün fiyatla gerçekleşen fiyatın neden farklı olabildiğini öğren.', en: 'Learn why the displayed price and execution price can differ.' },
    hook: { tr: 'Ekranda 100 gördün. Neden 100,3’ten işlem oldu?', en: 'You saw 100 on screen. Why did the trade happen at 100.3?' },
    explanation: { tr: 'Ekrandaki fiyat az önceki işlemdir. Senin emrin gerçekleşene kadar fiyat değişebilir veya o fiyatta yeterli miktar kalmayabilir. Aradaki farka kayma denir.', en: 'The screen price is the previous trade. Before your order executes, the price can move or there may not be enough quantity left at that price. The difference is called slippage.' },
    misconception: { tr: 'Emir verdiğin anda ekrandaki fiyat kilitlenmez.', en: 'The screen price does not lock when you place an order.' },
    takeaway: { tr: 'Gördüğün fiyat ile işlem fiyatın farklı olabilir.', en: 'The displayed price and your trade price can differ.' },
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
    choices: (lesson.practicalTask.choices ?? []).map((choice, index) => ({
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
