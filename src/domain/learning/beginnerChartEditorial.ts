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
  'lesson.chart.candles.001': {
    title: { tr: 'Grafikte gördüğün şey aslında nedir?', en: 'What are you actually seeing on a chart?' },
    objective: { tr: 'Grafiğin ve tek bir mumun neyi gösterdiğini öğren.', en: 'Learn what a chart and a single candle show.' },
    hook: { tr: 'Grafikteki mumlar neyin kaydı?', en: 'What do the candles on a chart record?' },
    explanation: { tr: 'Grafik, fiyatın zaman içindeki kaydıdır. Her mum seçilen bir süreyi özetler: başlangıç, bitiş, en yüksek ve en düşük fiyat. Bunlara açılış, kapanış, yüksek ve düşük denir.', en: 'A chart records price over time. Each candle summarizes one period: the start, finish, highest, and lowest price. These are called open, close, high, and low.' },
    misconception: { tr: 'Yeşil bir mum, sonraki mumun da yükseleceğini garanti etmez.', en: 'A green candle does not guarantee that the next candle will rise.' },
    takeaway: { tr: 'Her mum, geçmişteki bir zaman parçasını özetler.', en: 'Each candle summarizes one past period.' },
    visualAlt: { tr: 'Zaman boyunca ilerleyen fiyat kaydı ve tek bir mumun başlangıç, bitiş, en yüksek ve en düşük noktalarını gösteren sade grafik', en: 'Simple chart showing price over time and one candle with its start, finish, high, and low' },
    taskPrompt: { tr: 'Bir mumun en üst ucu neyi gösterir?', en: 'What does the top tip of a candle show?' },
    taskChoices: [
      { tr: 'O zaman aralığında ulaşılan en yüksek fiyatı', en: 'The highest price reached during that period' },
      { tr: 'O zaman aralığında ulaşılan en düşük fiyatı', en: 'The lowest price reached during that period' },
      { tr: 'Yalnız mumun rengini', en: 'Only the candle color' },
      { tr: 'Henüz oluşmamış sonraki fiyatı', en: 'The next price that has not happened yet' },
    ],
    questions: [
      { prompt: { tr: 'Grafik en temel olarak neyi gösterir?', en: 'What does a chart show most fundamentally?' }, choices: [{ tr: 'Fiyatın zaman içinde nasıl değiştiğini', en: 'How price changed over time' }, { tr: 'Gelecekteki kesin fiyatı', en: 'The certain future price' }, { tr: 'Yalnız şirketin adını', en: 'Only the company name' }], explanation: { tr: 'Grafik geçmiş ve mevcut fiyat hareketini zaman ekseninde düzenler.', en: 'A chart organizes past and current price movement across time.' } },
      { prompt: { tr: 'Bir mumun gövdesi neyi özetler?', en: 'What does a candle body summarize?' }, choices: [{ tr: 'Başlangıç ile bitiş fiyatı arasını', en: 'The range between the start and finish prices' }, { tr: 'Gelecek hedef fiyatını', en: 'A future target price' }, { tr: 'Yalnız işlem hacmini', en: 'Only trading volume' }], explanation: { tr: 'Gövde, o zaman parçasındaki açılış ve kapanış fiyatları arasındaki alanı gösterir.', en: 'The body shows the area between the open and close for that period.' } },
      { prompt: { tr: 'Tek bir yeşil mum sonraki hareketi garanti eder mi?', en: 'Does one green candle guarantee the next move?' }, choices: [{ tr: 'Hayır', en: 'No' }, { tr: 'Evet, her zaman', en: 'Yes, always' }, { tr: 'Yalnız günlük grafikte', en: 'Only on a daily chart' }], explanation: { tr: 'Mum geçmişte oluşmuş bir kayıttır; sonraki fiyatı kesin olarak bilmez.', en: 'A candle is a record of what already happened; it does not know the next price with certainty.' } },
    ],
  },
  'lesson.chart.timeframes.001': {
    title: { tr: 'Aynı grafik neden yakınlaştırınca değişir?', en: 'Why does the same chart change when you zoom in?' },
    objective: { tr: 'Aynı fiyat hareketinin farklı zaman dilimlerinde neden farklı göründüğünü öğren.', en: 'Learn why the same price move can look different across timeframes.' },
    hook: { tr: 'Yakından düşüş, uzaktan yükseliş görmek mümkün mü?', en: 'Can a move look down close-up but up from farther away?' },
    explanation: { tr: 'Evet. Her mum seçtiğin zaman kadar veriyi özetler. 15 dakikalık grafik küçük hareketleri gösterirken günlük grafik daha geniş resmi gösterir. Buna zaman dilimi denir.', en: 'Yes. Each candle summarizes the amount of time you choose. A 15-minute chart shows smaller moves, while a daily chart shows the broader picture. This is the timeframe.' },
    misconception: { tr: 'Kısa vadeli bir düşüş, daha geniş yükselişi tek başına bozmaz.', en: 'A short-term decline does not erase a broader rise by itself.' },
    takeaway: { tr: 'Aynı piyasa farklı zaman dilimlerinde farklı görünebilir.', en: 'The same market can look different across timeframes.' },
    visualAlt: { tr: 'Aynı fiyat yolunu yakın ve uzak görünümde karşılaştıran sade zaman ölçeği görseli', en: 'Simple visual comparing the same price path in close-up and broader time views' },
    taskPrompt: { tr: '15 dakikalık grafikte küçük bir düşüş varken günlük grafik hâlâ yukarı gidiyorsa hangileri birlikte doğru olabilir?', en: 'If a 15-minute chart is falling slightly while the daily chart still trends upward, which statements can both be true?' },
    taskChoices: [
      { tr: 'Yakın görünümde kısa bir geri çekilme vardır', en: 'There is a short pullback in the close-up view' },
      { tr: 'Geniş görünümde genel yükseliş hâlâ korunuyor olabilir', en: 'The broader upward move may still be intact' },
      { tr: 'Yalnız bir zaman ölçeği doğru olabilir', en: 'Only one time scale can be correct' },
      { tr: 'Günlük grafik geleceği garanti eder', en: 'The daily chart guarantees the future' },
    ],
    questions: [
      { prompt: { tr: 'Zaman dilimi neyi değiştirir?', en: 'What does the timeframe change?' }, choices: [{ tr: 'Her mumun kapsadığı süreyi', en: 'The amount of time each candle covers' }, { tr: 'Varlığın gerçek değerini', en: "The asset's true value" }, { tr: 'İşlemin kesin sonucunu', en: 'The certain result of a trade' }], explanation: { tr: 'Örneğin 15 dakikalık mum 15 dakikayı, günlük mum bir günü özetler.', en: 'For example, a 15-minute candle summarizes 15 minutes, while a daily candle summarizes one day.' } },
      { prompt: { tr: 'Neden yakın ve uzak görünüm farklı olabilir?', en: 'Why can close-up and broader views look different?' }, choices: [{ tr: 'Aynı hareketi farklı büyüklükte topladıkları için', en: 'Because they group the same movement at different scales' }, { tr: 'Fiyat verisi tamamen farklı olduğu için', en: 'Because the price data is completely different' }, { tr: 'Biri her zaman yanlış olduğu için', en: 'Because one is always wrong' }], explanation: { tr: 'Veri aynı piyasadan gelir; sadece bakılan zaman ölçeği değişir.', en: 'The data comes from the same market; only the time scale changes.' } },
      { prompt: { tr: 'Bir grafik yorumu yaparken hangi bilgi önemlidir?', en: 'What information matters when making a chart observation?' }, choices: [{ tr: 'Hangi zaman dilimine baktığın', en: 'Which timeframe you are viewing' }, { tr: 'Yalnız arka plan rengi', en: 'Only the background color' }, { tr: 'Kesin hedef fiyat', en: 'A certain target price' }], explanation: { tr: 'Aynı hareket farklı zaman dilimlerinde farklı anlam taşıyabilir.', en: 'The same move can have different context at different timeframes.' } },
    ],
  },
  'lesson.chart.trend.001': {
    title: { tr: 'Fiyat genel olarak hangi yöne gidiyor?', en: 'Which direction is price generally moving?' },
    objective: { tr: 'Fiyatın genel yönünü tek bir muma bakmadan ayırt etmeyi öğren.', en: 'Learn to identify broader price direction without judging one candle.' },
    hook: { tr: 'Bugün fiyat yükseldi diye genel yön mutlaka yukarı mı?', en: 'If price rose today, is the broader direction definitely up?' },
    explanation: { tr: 'Hayır. Peş peşe oluşan tepe ve diplere bakılır. İkisi de yukarı taşınıyorsa yükseliş, aşağı taşınıyorsa düşüş; belirgin yön yoksa yatay hareket denir. Bu genel yapıya trend denir.', en: 'No. Look at successive highs and lows. If both move higher, the trend is rising; if both move lower, it is falling; without clear direction, it is sideways. This broader structure is the trend.' },
    misconception: { tr: 'Son mumun rengi, genel yönü tek başına belirlemez.', en: 'The latest candle color does not determine the broader direction by itself.' },
    takeaway: { tr: 'Trend, fiyatın zaman içindeki genel yönüdür.', en: 'Trend is the broader direction of price over time.' },
    visualAlt: { tr: 'Yukarı, aşağı ve yatay ilerleyen üç sade fiyat yolunu karşılaştıran grafik', en: 'Simple chart comparing upward, downward, and sideways price paths' },
    taskPrompt: { tr: 'Genel yükselişi destekleyen iki özellik hangisidir?', en: 'Which two features support a broader upward move?' },
    taskChoices: [
      { tr: 'Yeni tepelerin zamanla daha yukarıda oluşması', en: 'New highs forming higher over time' },
      { tr: 'Yeni diplerin zamanla daha yukarıda oluşması', en: 'New lows forming higher over time' },
      { tr: 'Tek bir yeşil mum', en: 'One green candle' },
      { tr: 'Sabit bir hedef fiyat', en: 'A fixed target price' },
    ],
    questions: [
      { prompt: { tr: 'Genel yükselişi en iyi ne anlatır?', en: 'What best describes a broader upward move?' }, choices: [{ tr: 'Tepelerin ve diplerin zamanla yukarı taşınması', en: 'Highs and lows moving higher over time' }, { tr: 'Tek bir yeşil mum', en: 'One green candle' }, { tr: 'Her gün aynı fiyat', en: 'The same price every day' }], explanation: { tr: 'Genel yön, tek bir hareketten değil tekrarlayan fiyat dizisinden okunur.', en: 'Broader direction is read from a repeating price sequence, not one move.' } },
      { prompt: { tr: 'Son mum kırmızıysa genel yön kesin aşağı mıdır?', en: 'If the last candle is red, is the broader direction definitely down?' }, choices: [{ tr: 'Hayır', en: 'No' }, { tr: 'Evet, her zaman', en: 'Yes, always' }, { tr: 'Yalnız saatlik grafikte', en: 'Only on an hourly chart' }], explanation: { tr: 'Tek bir mum daha geniş fiyat yolunun yalnızca küçük bir parçasıdır.', en: 'One candle is only a small part of the broader price path.' } },
      { prompt: { tr: 'Yatay hareket neyi anlatır?', en: 'What does sideways movement describe?' }, choices: [{ tr: 'Belirgin bir yukarı veya aşağı ilerlemenin olmadığını', en: 'No clear upward or downward progress' }, { tr: 'Fiyatın bir daha değişmeyeceğini', en: 'Price will never change again' }, { tr: 'Kesin dönüş başladığını', en: 'A reversal has definitely begun' }], explanation: { tr: 'Yatay hareket, fiyatın bir süre belirgin yön göstermeden ilerlemesidir.', en: 'Sideways movement means price is not showing clear directional progress for a period.' } },
    ],
  },
  'lesson.chart.support-resistance.001': {
    title: { tr: 'Fiyat neden bazı bölgelerde tekrar durur?', en: 'Why does price often pause around the same areas?' },
    objective: { tr: 'Fiyatın sık tepki verdiği alanları çizgi yerine bölge olarak okumayı öğren.', en: 'Learn to read repeated reaction areas as zones rather than exact lines.' },
    hook: { tr: 'Fiyat neden bazen aynı bölgeye gelince tekrar tepki verir?', en: 'Why can price react again near the same area?' },
    explanation: { tr: 'Fiyat geçmişte bazı alanlarda birkaç kez tepki vermiş olabilir. Alt taraftaki bölgeye destek, üst taraftakine direnç denir. Bunlar tek bir kesin fiyat değil, yaklaşık alanlardır.', en: 'Price may have reacted several times around certain areas. The lower area is called support and the upper area resistance. These are approximate zones, not one exact price.' },
    misconception: { tr: 'Destek ve direnç duvar değildir; fiyat bölgeden geçebilir.', en: 'Support and resistance are not walls; price can move through them.' },
    takeaway: { tr: 'Destek ve direnç, yaklaşık tepki bölgeleridir.', en: 'Support and resistance are approximate reaction zones.' },
    visualAlt: { tr: 'Fiyatın birkaç kez benzer alt ve üst bölgelerde tepki verdiğini gösteren sade grafik', en: 'Simple chart showing price reacting several times around similar lower and upper areas' },
    taskPrompt: { tr: 'Bir tepki bölgesini tanımak için hangi iki gözlem daha anlamlıdır?', en: 'Which two observations are more useful for recognizing a reaction area?' },
    taskChoices: [
      { tr: 'Aynı alanda birden fazla anlamlı tepki görülmesi', en: 'Several meaningful reactions around the same area' },
      { tr: 'Tepkilerin yakın fiyatlardan oluşması', en: 'Reactions forming around nearby prices' },
      { tr: 'Tek piksel kalınlığında kusursuz çizgi aramak', en: 'Looking for a perfect one-pixel line' },
      { tr: 'Bölgenin mutlaka tutacağını varsaymak', en: 'Assuming the area must hold' },
    ],
    questions: [
      { prompt: { tr: 'Neden tek çizgi yerine bölge düşünmek daha gerçekçidir?', en: 'Why is thinking in zones more realistic than one exact line?' }, choices: [{ tr: 'Tepkiler yakın ama farklı fiyatlarda oluşabildiği için', en: 'Because reactions can happen at nearby but different prices' }, { tr: 'Grafikte çizgi çizilemediği için', en: 'Because charts cannot contain lines' }, { tr: 'Fiyat hiç değişmediği için', en: 'Because price never changes' }], explanation: { tr: 'Piyasa tepkileri çoğu zaman tek bir kusursuz fiyata denk gelmez.', en: 'Market reactions often do not occur at one perfect price.' } },
      { prompt: { tr: 'Destek bölgesi fiyatı kesin durdurur mu?', en: 'Does a support area stop price with certainty?' }, choices: [{ tr: 'Hayır', en: 'No' }, { tr: 'Evet, her zaman', en: 'Yes, always' }, { tr: 'Yalnız günlük grafikte', en: 'Only on a daily chart' }], explanation: { tr: 'Bölge geçmiş tepkiyi gösterir; yeni tepkiyi garanti etmez.', en: 'A zone shows past reaction; it does not guarantee a new one.' } },
      { prompt: { tr: 'Direnç bölgesi en basit hâliyle neyi gösterir?', en: 'What does a resistance area most simply show?' }, choices: [{ tr: 'Geçmişte satıcı tepkisinin arttığı yaklaşık bir alanı', en: 'An approximate area where seller reactions increased in the past' }, { tr: 'Kesin satış emrini', en: 'A certain sell order' }, { tr: 'Gelecekteki kesin zirveyi', en: 'The certain future top' }], explanation: { tr: 'Direnç, geçmişte üst tarafta tepkinin yoğunlaştığı fiyat alanını tarif eder.', en: 'Resistance describes an upper price area where reactions were stronger in the past.' } },
    ],
  },
  'lesson.technical.momentum.001': {
    title: { tr: 'Hareket neden bazen hızlanır, bazen yavaşlar?', en: 'Why does price sometimes speed up and slow down?' },
    objective: { tr: 'Fiyat hareketinin yönünden ayrı olarak hızını ve gücünü fark etmeyi öğren.', en: 'Learn to notice the speed and strength of a move separately from direction.' },
    hook: { tr: 'Fiyat yükselirken yükselişin gücü azalabilir mi?', en: 'Can an upward move lose strength while price is still rising?' },
    explanation: { tr: 'Evet. Fiyat aynı yönde giderken hareket hızlanabilir veya yavaşlayabilir. Bu hız ve devam gücüne momentum denir. Momentum zayıflarsa hareket yavaşlamıştır; bu, yönün kesin döneceği anlamına gelmez.', en: 'Yes. Price can keep moving in one direction while the move speeds up or slows down. This speed and persistence is momentum. Weaker momentum means the move has slowed, not that direction must reverse.' },
    misconception: { tr: 'Güçlü momentum, hareketin aynı hızda süreceğini garanti etmez.', en: 'Strong momentum does not guarantee that the move will continue at the same speed.' },
    takeaway: { tr: 'Momentum, hareketin hızını ve devam gücünü anlatır.', en: 'Momentum describes a move’s speed and persistence.' },
    visualAlt: { tr: 'Aynı yönde ilerleyen hızlı ve yavaş iki fiyat hareketini karşılaştıran sade grafik', en: 'Simple chart comparing fast and slow price moves in the same direction' },
    taskPrompt: { tr: 'Fiyat yükselmeye devam ederken hareket belirgin biçimde yavaşlıyorsa ne söylenebilir?', en: 'If price is still rising but the move clearly slows, what can be said?' },
    taskChoices: [
      { tr: 'Yükselişin momentumu zayıflıyor olabilir', en: 'The upward momentum may be weakening' },
      { tr: 'Kesin düşüş başlamıştır', en: 'A decline has definitely begun' },
      { tr: 'Hızın fiyat hareketiyle ilgisi yoktur', en: 'Speed has nothing to do with price movement' },
    ],
    questions: [
      { prompt: { tr: 'Momentum en basit hâliyle neyi anlatır?', en: 'What does momentum most simply describe?' }, choices: [{ tr: 'Hareketin hızını ve devam gücünü', en: 'The speed and persistence of a move' }, { tr: 'Gelecekteki kesin fiyatı', en: 'The certain future price' }, { tr: 'Şirketin çalışan sayısını', en: 'A company’s employee count' }], explanation: { tr: 'Momentum, fiyat hareketinin ne kadar hızlı ve ısrarlı ilerlediğini anlatır.', en: 'Momentum describes how quickly and persistently price is moving.' } },
      { prompt: { tr: 'Fiyat yükselirken momentum zayıflayabilir mi?', en: 'Can momentum weaken while price still rises?' }, choices: [{ tr: 'Evet', en: 'Yes' }, { tr: 'Hayır', en: 'No' }, { tr: 'Yalnız emtiada', en: 'Only in commodities' }], explanation: { tr: 'Fiyat hâlâ yukarı giderken hareketin hızı azalabilir.', en: 'Price can still move higher while the speed of the move decreases.' } },
      { prompt: { tr: 'Momentum zayıfladıysa yön kesin döner mi?', en: 'If momentum weakens, must direction reverse?' }, choices: [{ tr: 'Hayır', en: 'No' }, { tr: 'Evet, her zaman', en: 'Yes, always' }, { tr: 'Yalnız kısa grafikte', en: 'Only on a short chart' }], explanation: { tr: 'Momentum değişimi bir gözlemdir; yeni yön için başka kanıt gerekir.', en: 'A change in momentum is an observation; a new direction needs additional evidence.' } },
    ],
  },
  'lesson.technical.moving-average.001': {
    title: { tr: 'Grafikteki yardımcı çizgi geleceği bilir mi?', en: 'Does a helper line on the chart know the future?' },
    objective: { tr: 'Hareketli ortalamanın geçmiş fiyatları nasıl sadeleştirdiğini öğren.', en: 'Learn how a moving average simplifies past prices.' },
    hook: { tr: 'Fiyatın yanındaki yumuşak çizgi nereden geliyor?', en: 'Where does the smooth line beside price come from?' },
    explanation: { tr: 'Hareketli ortalama, geçmişteki fiyatları ortalayıp daha yumuşak bir çizgi oluşturur. Küçük dalgalanmalar arasında genel yönü görmeyi kolaylaştırabilir. Ama yalnız geçmiş veriden hesaplanır.', en: 'A moving average averages past prices into a smoother line. It can make the broader direction easier to see through small fluctuations, but it is calculated only from past data.' },
    misconception: { tr: 'Fiyat ortalamayı geçti diye sonraki yön kesinleşmez.', en: 'Crossing the average does not make the next direction certain.' },
    takeaway: { tr: 'Hareketli ortalama geçmiş fiyatları sadeleştirir.', en: 'A moving average simplifies past prices.' },
    visualAlt: { tr: 'Dalgalı fiyat yolu üzerinde geçmiş fiyatlardan oluşan daha yumuşak yardımcı çizgiyi gösteren sade grafik', en: 'Simple chart showing a smoother helper line built from past prices over a noisier price path' },
    taskPrompt: { tr: 'Daha uzun süreyi ortalayan çizgi genellikle nasıl görünür?', en: 'How does a line averaging a longer period usually look?' },
    taskChoices: [
      { tr: 'Daha yumuşak olur ve fiyat değişimine daha yavaş tepki verir', en: 'It is smoother and reacts more slowly to price changes' },
      { tr: 'Gelecek fiyatı önceden gösterir', en: 'It shows the future price in advance' },
      { tr: 'Fiyatı sabitler', en: 'It fixes the price' },
    ],
    questions: [
      { prompt: { tr: 'Hareketli ortalama hangi veriden oluşur?', en: 'What data is a moving average built from?' }, choices: [{ tr: 'Geçmiş fiyatlardan', en: 'Past prices' }, { tr: 'Henüz oluşmamış gelecek fiyatlardan', en: 'Future prices that have not happened yet' }, { tr: 'Yalnız haber başlıklarından', en: 'Only news headlines' }], explanation: { tr: 'Hareketli ortalama yalnız geçmiş fiyat gözlemlerini kullanır.', en: 'A moving average uses past price observations.' } },
      { prompt: { tr: 'Daha uzun ortalama genellikle nasıl davranır?', en: 'How does a longer average usually behave?' }, choices: [{ tr: 'Daha yumuşak ve daha yavaş hareket eder', en: 'It moves more smoothly and slowly' }, { tr: 'Her zaman daha hızlı hareket eder', en: 'It always moves faster' }, { tr: 'Geleceği daha iyi bilir', en: 'It knows the future better' }], explanation: { tr: 'Daha fazla geçmiş veri birlikte ortalandığında küçük hareketlerin etkisi azalır.', en: 'Averaging more past observations reduces the effect of small moves.' } },
      { prompt: { tr: 'Fiyat çizgiyi geçtiğinde kesin işlem sinyali oluşur mu?', en: 'Does a price crossing the line create a certain trading signal?' }, choices: [{ tr: 'Hayır', en: 'No' }, { tr: 'Evet, her zaman', en: 'Yes, always' }, { tr: 'Yalnız çizgi yeşilse', en: 'Only if the line is green' }], explanation: { tr: 'Yardımcı çizgi bağlam sağlar; tek başına gelecek yönü garanti etmez.', en: 'The helper line provides context; it does not guarantee future direction by itself.' } },
    ],
  },
};

function localized(value: Localized) {
  return { tr: value.tr, en: value.en };
}

function audience(value: Localized) {
  return { normal: localized(value) };
}

export function normalizeBeginnerChartEditorial(lesson: MicroLesson): MicroLesson {
  const copy = COPY[lesson.id];
  if (!copy) return lesson;

  const contentBlocks = lesson.contentBlocks
    .filter((block) => !block.id.endsWith('.trader-tip'))
    .map((block) => {
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
