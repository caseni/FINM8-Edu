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
  'lesson.risk.uncertainty.001': {
    title: { tr: 'Kaybetmeden önce risk var mıdır?', en: 'Can risk exist before you lose money?' },
    objective: { tr: 'Riskin, kayıp gerçekleşmeden önce de var olan olumsuz sonuç ihtimali olduğunu anla.', en: 'Understand that risk is the possibility of a bad outcome that exists before a loss actually happens.' },
    hook: { tr: 'Henüz para kaybetmediysen hiç risk yok mudur?', en: 'If you have not lost money yet, is there no risk?' },
    explanation: { tr: 'Risk, bir kararın kötü sonuçlanabilme ihtimalidir. Kayıp ise o kötü sonucun gerçekten gerçekleşmiş hâlidir. Geleceği tam bilmediğimiz için karar verirken belirsizlik taşırız. Risk yönetimi bütün kayıpları yok etmez; tek bir kötü sonucun etkisini sınırlamaya çalışır.', en: 'Risk is the possibility that a decision turns out badly. A loss is the bad outcome after it has actually happened. Because the future is not fully known, decisions carry uncertainty. Risk management does not remove every loss; it tries to limit the impact of one bad outcome.' },
    misconception: { tr: 'Hesap bugün ekside değil diye risk sıfır değildir. Risk, sonuç ortaya çıkmadan önce de vardır.', en: 'Risk is not zero just because the account is not down today. Risk exists before the outcome is known.' },
    takeaway: { tr: 'Kayıp sonuçtur; risk ise sonuç belli olmadan önce taşıdığın ihtimaldir.', en: 'A loss is an outcome; risk is the possibility you carry before the outcome is known.' },
    visualAlt: { tr: 'Bir karar noktasından iyi, nötr ve kötü olası sonuçlara ayrılan sade risk yolu', en: 'Simple risk path branching from one decision into good, neutral, and bad possible outcomes' },
    taskPrompt: { tr: 'Hangisi henüz gerçekleşmiş kayıp değil, karar anındaki riski anlatır?', en: 'Which describes risk at decision time rather than a loss that already happened?' },
    taskChoices: [
      { tr: 'Değerin düşebilme ihtimali', en: 'The possibility that value could fall' },
      { tr: 'Hesaba geçmiş 1.000 TL zarar', en: 'A TRY 1,000 loss already recorded' },
      { tr: 'Kesin ve değişmez kazanç', en: 'A certain and unchanging gain' },
    ],
    questions: [
      { prompt: { tr: 'Risk en basit hâliyle nedir?', en: 'What is risk most simply?' }, choices: [{ tr: 'Olumsuz bir sonucun gerçekleşebilme ihtimali', en: 'The possibility of an adverse outcome' }, { tr: 'Yalnız gerçekleşmiş zarar', en: 'Only a loss that already happened' }, { tr: 'Kesin kazanç', en: 'Certain profit' }], explanation: { tr: 'Risk sonuç belli olmadan önce vardır ve olumsuz sonuç ihtimalini ifade eder.', en: 'Risk exists before the outcome is known and describes the possibility of an adverse result.' } },
      { prompt: { tr: 'Kayıp ile risk arasındaki temel fark nedir?', en: 'What is the basic difference between loss and risk?' }, choices: [{ tr: 'Kayıp gerçekleşmiştir, risk ise olasılıktır', en: 'A loss has happened; risk is a possibility' }, { tr: 'İkisi tamamen aynıdır', en: 'They are exactly the same' }, { tr: 'Risk yalnız kazanç demektir', en: 'Risk only means gain' }], explanation: { tr: 'Kayıp gerçekleşmiş sonuçtur; risk ise karar anında henüz gerçekleşmemiş olumsuz ihtimaldir.', en: 'A loss is a realized outcome; risk is an adverse possibility that has not yet happened.' } },
      { prompt: { tr: 'Risk yönetiminin gerçekçi amacı nedir?', en: 'What is a realistic goal of risk management?' }, choices: [{ tr: 'Kötü bir sonucun etkisini sınırlamak', en: 'Limit the impact of a bad outcome' }, { tr: 'Bütün kayıpları garantiyle yok etmek', en: 'Guarantee that every loss disappears' }, { tr: 'Her fırsatı kullanmak', en: 'Take every opportunity' }], explanation: { tr: 'Risk yönetimi geleceği kontrol etmez; olası kaybın etkisini daha yönetilebilir tutmaya çalışır.', en: 'Risk management does not control the future; it tries to keep possible losses more manageable.' } },
    ],
  },
  'lesson.risk.volatility.001': {
    title: { tr: 'Fiyat çok oynuyorsa neden daha dikkatli olmalısın?', en: 'Why should you be more careful when price moves a lot?' },
    objective: { tr: 'Geniş ve hızlı fiyat hareketlerinin aynı miktar parayı daha fazla dalgalandırabileceğini anla.', en: 'Understand that wide and fast price moves can make the same amount of money fluctuate more.' },
    hook: { tr: 'Aynı 1.000 TL, sakin ve çok hareketli iki piyasada aynı riski taşır mı?', en: 'Does the same TRY 1,000 carry the same risk in a calm and a very active market?' },
    explanation: { tr: 'Hayır. Bazı fiyatlar dar bir aralıkta sakin hareket ederken bazıları kısa sürede çok daha geniş hareket eder. Bu hareket genişliğine volatilite denir. Fiyat daha çok oynadığında aynı büyüklükteki pozisyonun parasal etkisi de büyüyebilir. Volatilite yönü söylemez; yalnız hareketin ne kadar geniş olduğunu anlatır.', en: 'No. Some prices move calmly in a narrow range while others move much more widely in a short time. This movement range is called volatility. When price swings more, the cash impact of the same-sized position can also grow. Volatility does not tell direction; it describes how wide the movement is.' },
    misconception: { tr: 'Çok hareketli piyasa yalnız daha çok kazanç ihtimali demek değildir. Aynı genişlik kaybı da büyütebilir.', en: 'A very active market does not only mean more gain potential. The same wide movement can also increase losses.' },
    takeaway: { tr: 'Fiyat daha çok oynadıkça aynı miktarın hesabındaki etkisi daha büyük olabilir.', en: 'As price swings more, the same amount can have a larger effect on your account.' },
    visualAlt: { tr: 'Aynı miktar için sakin dar fiyat yolu ile geniş ve hızlı fiyat yolunu karşılaştıran sade görsel', en: 'Simple visual comparing a calm narrow price path with a wide fast price path for the same amount' },
    taskPrompt: { tr: 'Aynı miktar parayla hangisi daha fazla kısa vadeli dalgalanma yaratabilir?', en: 'With the same amount of money, which can create more short-term fluctuation?' },
    taskChoices: [
      { tr: 'Fiyatı çok daha geniş aralıkta hareket eden piyasa', en: 'The market whose price moves through a much wider range' },
      { tr: 'Dar aralıkta sakin hareket eden piyasa', en: 'The market moving calmly in a narrow range' },
      { tr: 'Logosu daha büyük olan varlık', en: 'The asset with the larger logo' },
    ],
    questions: [
      { prompt: { tr: 'Volatilite en basit hâliyle neyi anlatır?', en: 'What does volatility most simply describe?' }, choices: [{ tr: 'Fiyat hareketinin ne kadar geniş olduğunu', en: 'How wide price movement is' }, { tr: 'Fiyatın kesin yönünü', en: 'The certain direction of price' }, { tr: 'Şirketin çalışan sayısını', en: 'The number of company employees' }], explanation: { tr: 'Volatilite hareketin büyüklüğünü anlatır; fiyatın yukarı mı aşağı mı gideceğini söylemez.', en: 'Volatility describes movement size; it does not say whether price will move up or down.' } },
      { prompt: { tr: 'Fiyat daha geniş hareket ederse aynı pozisyon ne yaşayabilir?', en: 'What can happen to the same position when price moves more widely?' }, choices: [{ tr: 'Parasal dalgalanması büyüyebilir', en: 'Its cash fluctuation can become larger' }, { tr: 'Riski otomatik sıfırlanır', en: 'Its risk automatically becomes zero' }, { tr: 'Fiyatı sabitlenir', en: 'Its price becomes fixed' }], explanation: { tr: 'Aynı miktar daha geniş fiyat hareketine maruz kaldığında hesap üzerindeki etkisi de büyüyebilir.', en: 'When the same amount is exposed to wider price movement, its impact on the account can grow.' } },
      { prompt: { tr: 'Yüksek volatilite kesin yükseliş demek midir?', en: 'Does high volatility mean price will certainly rise?' }, choices: [{ tr: 'Hayır', en: 'No' }, { tr: 'Evet, her zaman', en: 'Yes, always' }, { tr: 'Yalnız günlük grafikte', en: 'Only on a daily chart' }], explanation: { tr: 'Geniş hareket hem yukarı hem aşağı olabilir; volatilite tek başına yön vermez.', en: 'Wide movement can happen upward or downward; volatility alone does not provide direction.' } },
    ],
  },
  'lesson.risk.position-sizing.001': {
    title: { tr: 'Ne kadar aldığın neden önemlidir?', en: 'Why does how much you buy matter?' },
    objective: { tr: 'Aynı fiyat hareketinin küçük ve büyük miktarlarda hesabı farklı etkileyebileceğini anla.', en: 'Understand that the same price move can affect an account differently depending on how much you hold.' },
    hook: { tr: 'Fiyat aynı yüzde düşerse 1.000 TL ile 10.000 TL aynı kaybı mı yaşar?', en: 'If price falls by the same percentage, do TRY 1,000 and TRY 10,000 lose the same amount?' },
    explanation: { tr: 'Hayır. Ne kadar büyük miktar taşırsan aynı fiyat hareketinin hesabındaki parasal etkisi o kadar büyür. Buna pozisyon büyüklüğü denir. Bu yüzden risk düşünürken yalnız “fiyat ne kadar düşebilir?” değil, “ben ne kadar para koyuyorum?” sorusu da önemlidir. Büyük miktar küçük hareketi bile büyük kayba çevirebilir.', en: 'No. The larger the amount you hold, the larger the cash impact of the same price move can be. This is called position size. So risk is not only about how far price can move; it is also about how much money you put into the position. A large amount can turn a small move into a large loss.' },
    misconception: { tr: 'Alabileceğin en büyük miktarı almak, iyi risk yönetimi demek değildir. Miktar arttıkça tek kararın etkisi büyür.', en: 'Buying the largest amount you can afford is not the same as good risk management. As size grows, the impact of one decision grows too.' },
    takeaway: { tr: 'Aynı fiyat hareketinde kaybı büyüten şeylerden biri, ne kadar büyük miktar taşıdığındır.', en: 'One factor that increases loss from the same price move is how large an amount you hold.' },
    visualAlt: { tr: 'Aynı yüzde düşüşte küçük ve büyük para miktarlarının farklı parasal kayıp ürettiğini gösteren sade karşılaştırma', en: 'Simple comparison showing small and large amounts producing different cash losses under the same percentage decline' },
    taskPrompt: { tr: 'Aynı yüzde düşüşte hangi pozisyon daha büyük parasal kayıp yaratır?', en: 'Under the same percentage decline, which position creates the larger cash loss?' },
    taskChoices: [
      { tr: 'Daha büyük para miktarı taşıyan pozisyon', en: 'The position holding the larger amount of money' },
      { tr: 'Daha küçük para miktarı taşıyan pozisyon', en: 'The position holding the smaller amount of money' },
      { tr: 'İkisi her zaman aynı TL kaybeder', en: 'Both always lose the same cash amount' },
    ],
    questions: [
      { prompt: { tr: 'Pozisyon büyüklüğü en doğrudan neyi etkiler?', en: 'What does position size most directly affect?' }, choices: [{ tr: 'Fiyat hareketinin hesabındaki parasal etkisini', en: 'The cash impact of a price move on the account' }, { tr: 'Piyasanın hangi yöne gideceğini', en: 'Which direction the market will move' }, { tr: 'Haberin yayın saatini', en: 'The time a news item is published' }], explanation: { tr: 'Aynı fiyat hareketi daha büyük miktarda daha büyük parasal değişime dönüşebilir.', en: 'The same price move can become a larger cash change when the position size is larger.' } },
      { prompt: { tr: 'Büyük pozisyonun temel riski nedir?', en: 'What is the basic risk of a large position?' }, choices: [{ tr: 'Küçük fiyat hareketinin bile büyük parasal etkisi olabilir', en: 'Even a small price move can have a large cash impact' }, { tr: 'Fiyatı kesin yükseltir', en: 'It guarantees price will rise' }, { tr: 'Bütün kayıpları engeller', en: 'It prevents every loss' }], explanation: { tr: 'Miktar büyüdükçe aynı yüzdelik hareketin hesap üzerindeki parasal etkisi de büyür.', en: 'As size increases, the cash impact of the same percentage move on the account also increases.' } },
      { prompt: { tr: 'Risk düşünürken hangi iki soru birlikte önemlidir?', en: 'Which two questions matter together when thinking about risk?' }, choices: [{ tr: 'Fiyat ne kadar hareket edebilir ve ben ne kadar taşıyorum?', en: 'How far can price move and how much am I holding?' }, { tr: 'Logo ne renk ve uygulama ne kadar hızlı?', en: 'What color is the logo and how fast is the app?' }, { tr: 'Yalnız beklenen kazanç ne kadar?', en: 'Only how large is the expected gain?' }], explanation: { tr: 'Olası fiyat hareketi ile taşıdığın miktar birlikte parasal riski belirleyen temel parçalardır.', en: 'Possible price movement and the amount you hold are both basic parts of cash risk.' } },
    ],
  },
  'lesson.risk.reward.001': {
    title: { tr: 'Büyük hedef iyi karar demek midir?', en: 'Does a large target mean a good decision?' },
    objective: { tr: 'Büyük olası kazancın tek başına iyi karar anlamına gelmediğini; olasılık ve maliyetin de önemli olduğunu anla.', en: 'Understand that a large possible gain does not by itself make a good decision; probability and costs matter too.' },
    hook: { tr: '1 kaybedip 5 kazanma hedefi yazmak işlemi otomatik olarak iyi yapar mı?', en: 'Does writing a target of losing 1 to gain 5 automatically make a trade good?' },
    explanation: { tr: 'Hayır. Bir planın olası kaybı ile olası kazancı karşılaştırılabilir; buna risk/getiri karşılaştırması denir. Ama büyük hedefin gerçekleşme ihtimali çok düşük olabilir. Üstelik komisyon, alış-satış farkı ve fiyat kayması sonucu değiştirebilir. Bu yüzden yalnız hedefin büyük olması kararın iyi olduğunu kanıtlamaz.', en: 'No. A plan can compare its possible loss with its possible gain; this is called a risk-reward comparison. But a large target may have a very low chance of being reached. Fees, the buy-sell gap, and slippage can also change the result. A large target alone therefore does not prove a decision is good.' },
    misconception: { tr: '“1 kaybedip 5 kazanacağım” yazmak, 5’in gerçekleşeceği anlamına gelmez. Hedef ile olasılık aynı şey değildir.', en: 'Writing “lose 1 to gain 5” does not mean the 5 will happen. A target and its probability are not the same thing.' },
    takeaway: { tr: 'Büyük hedef tek başına kalite değildir; olasılık, maliyet ve gerçekleşme de önemlidir.', en: 'A large target is not quality by itself; probability, costs, and execution also matter.' },
    visualAlt: { tr: 'Küçük kayıp ve büyük hedef terazisinin yanında hedefe ulaşma olasılığı ve maliyetleri ayrı gösteren sade karar görseli', en: 'Simple decision visual showing a small loss and large target alongside separate probability and cost factors' },
    taskPrompt: { tr: 'Hangisi yalnız büyük hedefe bakmaktan daha sağlıklı bir değerlendirmedir?', en: 'Which is a healthier evaluation than looking only at a large target?' },
    taskChoices: [
      { tr: 'Olası kayıp, olası kazanç, gerçekleşme ihtimali ve maliyetleri birlikte düşünmek', en: 'Consider possible loss, possible gain, likelihood, and costs together' },
      { tr: 'Yalnız en büyük hedefi seçmek', en: 'Choose only the largest target' },
      { tr: 'Maliyetleri tamamen yok saymak', en: 'Ignore all costs completely' },
    ],
    questions: [
      { prompt: { tr: 'Büyük bir kazanç hedefi tek başına neyi söylemez?', en: 'What does a large gain target not tell you by itself?' }, choices: [{ tr: 'Hedefin gerçekleşme ihtimalini', en: 'The likelihood that the target will be reached' }, { tr: 'Hedefin büyük olduğunu', en: 'That the target is large' }, { tr: 'Bir hedef yazıldığını', en: 'That a target was written' }], explanation: { tr: 'Hedef büyüklüğü ile hedefin gerçekleşme olasılığı iki farklı bilgidir ve birlikte değerlendirilmelidir.', en: 'Target size and the probability of reaching it are different pieces of information and should be considered together.' } },
      { prompt: { tr: 'Gerçek sonucu hangileri değiştirebilir?', en: 'What can change the actual result?' }, choices: [{ tr: 'Komisyon, alış-satış farkı ve fiyat kayması', en: 'Fees, the buy-sell gap, and slippage' }, { tr: 'Ders kartının rengi', en: 'The color of the lesson card' }, { tr: 'Telefonun duvar kâğıdı', en: 'The phone wallpaper' }], explanation: { tr: 'İşlem maliyetleri ve gerçekleşme fiyatı, kâğıt üzerindeki hedef ile gerçek sonucu birbirinden ayırabilir.', en: 'Trading costs and execution price can make the real result differ from the target written on paper.' } },
      { prompt: { tr: 'İyi bir risk/getiri değerlendirmesinde ne eksik olmamalıdır?', en: 'What should not be missing from a sound risk-reward evaluation?' }, choices: [{ tr: 'Olasılık ve gerçekleşme koşulları', en: 'Probability and execution conditions' }, { tr: 'Yalnız en büyük sayı', en: 'Only the largest number' }, { tr: 'Kesin kazanç varsayımı', en: 'An assumption of certain profit' }], explanation: { tr: 'Oran tek başına yeterli değildir; olasılık ve gerçek gerçekleşme koşulları karar kalitesini etkiler.', en: 'The ratio alone is not enough; probability and actual execution conditions affect decision quality.' } },
    ],
  },
  'lesson.risk.stop-orders.001': {
    title: { tr: 'Çıkış fiyatı neden garanti değildir?', en: 'Why is an exit price not guaranteed?' },
    objective: { tr: 'Önceden çıkış seviyesi belirlemenin faydalı olabileceğini ama hızlı piyasanın gerçekleşme fiyatını değiştirebileceğini anla.', en: 'Understand that planning an exit level can be useful, but a fast market can still change the actual execution price.' },
    hook: { tr: '“95 olursa çıkarım” demek tam 95’ten çıkacağını garanti eder mi?', en: 'If you say “I will exit at 95,” does that guarantee an exit exactly at 95?' },
    explanation: { tr: 'Hayır. Stop emri, fiyat belirlediğin seviyeye geldiğinde çıkış emrini devreye sokar. Fiyat çok hızlı hareket ederse veya arada işlem oluşmazsa gerçek çıkış fiyatı daha kötü olabilir. Yani stop, çıkışı planlamaya yardım eder ama maksimum kaybı kesin olarak kilitlemez.', en: 'No. A stop order activates an exit order when price reaches the level you chose. If price moves very quickly or no trades occur between prices, the actual exit can be worse. A stop helps plan an exit, but it does not lock the maximum loss with certainty.' },
    misconception: { tr: 'Stop seviyesi bir duvar değildir. Piyasa hızlı atladığında gerçek işlem başka bir fiyattan gerçekleşebilir.', en: 'A stop level is not a wall. If the market jumps quickly, the actual trade can happen at a different price.' },
    takeaway: { tr: 'Çıkış seviyesi plan sağlar; gerçekleşme fiyatı yine piyasa koşullarına bağlıdır.', en: 'An exit level provides a plan; the actual execution price still depends on market conditions.' },
    visualAlt: { tr: 'Planlanan 95 çıkış seviyesi ile hızlı fiyat atlaması sonrası 93 gerçekleşme fiyatını karşılaştıran sade görsel', en: 'Simple visual comparing a planned exit level of 95 with actual execution at 93 after a fast price jump' },
    taskPrompt: { tr: 'Fiyat 100’den hızla 93’e atlayıp arada işlem oluşmazsa 95 stopu ne yaşayabilir?', en: 'If price jumps from 100 to 93 with no trades in between, what can happen to a stop at 95?' },
    taskChoices: [
      { tr: '95’ten daha kötü bir fiyattan gerçekleşebilir', en: 'It can execute at a worse price than 95' },
      { tr: 'Tam 95’ten gerçekleşmesi garanti olur', en: 'Execution exactly at 95 is guaranteed' },
      { tr: 'Fiyat otomatik olarak 95’e geri döner', en: 'Price automatically returns to 95' },
    ],
    questions: [
      { prompt: { tr: 'Stop seviyesi en temel olarak ne yapar?', en: 'What does a stop level basically do?' }, choices: [{ tr: 'Belirlenen seviyede çıkış emrini tetikler', en: 'Triggers an exit order at the chosen level' }, { tr: 'Fiyatı o seviyede durdurur', en: 'Stops price at that level' }, { tr: 'Kârı garanti eder', en: 'Guarantees profit' }], explanation: { tr: 'Stop seviyesi fiyatı durdurmaz; yalnız seçilen koşul gerçekleştiğinde çıkış emrini devreye sokar.', en: 'A stop level does not stop price; it activates an exit order when the chosen condition is met.' } },
      { prompt: { tr: 'Gerçek çıkış fiyatı neden stop seviyesinden farklı olabilir?', en: 'Why can the actual exit price differ from the stop level?' }, choices: [{ tr: 'Hızlı hareket, boşluk ve az likidite nedeniyle', en: 'Because of fast movement, price gaps, and low liquidity' }, { tr: 'Stop fiyatı hiç okunmadığı için', en: 'Because the stop price is never read' }, { tr: 'Grafik rengi değiştiği için', en: 'Because the chart color changed' }], explanation: { tr: 'Piyasa seçilen seviyeden daha hızlı geçerse emir mevcut karşı taraf fiyatından gerçekleşebilir.', en: 'If the market moves through the chosen level quickly, the order can execute at an available opposing price.' } },
      { prompt: { tr: 'Stop emri maksimum kaybı kesin olarak kilitler mi?', en: 'Does a stop order lock the maximum loss with certainty?' }, choices: [{ tr: 'Hayır', en: 'No' }, { tr: 'Evet, her piyasada', en: 'Yes, in every market' }, { tr: 'Yalnız fiyat yükselirken', en: 'Only when price is rising' }], explanation: { tr: 'Gerçekleşme fiyatı piyasa koşullarına bağlı olduğu için stop seviyesi kesin kayıp garantisi değildir.', en: 'Because execution price depends on market conditions, a stop level is not a guaranteed maximum loss.' } },
    ],
  },
  'lesson.portfolio.diversification.001': {
    title: { tr: 'Parayı farklı şeylere bölmek riski nasıl değiştirir?', en: 'How can spreading money across different things change risk?' },
    objective: { tr: 'Parayı gerçekten farklı risk kaynaklarına yaymanın tek bir olaya bağımlılığı azaltabileceğini anla.', en: 'Understand that spreading money across genuinely different risk sources can reduce dependence on one event.' },
    hook: { tr: 'On farklı isim almak gerçekten on farklı risk taşımak mıdır?', en: 'Does owning ten different names really mean having ten different risks?' },
    explanation: { tr: 'Her zaman değil. Parayı farklı yatırımlara yaymak, tek bir yatırımın kötü sonucuna bağımlılığı azaltabilir. Buna çeşitlendirme denir. Ama seçtiğin yatırımlar aynı nedenden birlikte düşüyorsa yalnız isim sayısını artırmış olursun. Önemli olan farklı isimler değil, gerçekten farklı risk kaynakları taşımaktır.', en: 'Not always. Spreading money across different investments can reduce dependence on one investment having a bad outcome. This is called diversification. But if the investments all fall for the same reason, you have only increased the number of names. What matters is not different names, but genuinely different sources of risk.' },
    misconception: { tr: 'Çok sayıda varlık otomatik olarak çeşitlendirme değildir. Hepsi aynı şeye bağlıysa risk hâlâ tek yerde yoğunlaşabilir.', en: 'Many assets do not automatically create diversification. If they all depend on the same thing, risk can still be concentrated.' },
    takeaway: { tr: 'Çeşitlendirme, isim sayısını değil tek bir risk kaynağına bağımlılığı azaltmayı hedefler.', en: 'Diversification aims to reduce dependence on one source of risk, not simply increase the number of names.' },
    visualAlt: { tr: 'Aynı risk kaynağına bağlı çok sayıda varlık ile farklı risk kaynaklarına yayılmış bir sepeti karşılaştıran sade görsel', en: 'Simple visual comparing many assets tied to one risk source with a basket spread across different risk sources' },
    taskPrompt: { tr: 'Hangisi daha güçlü çeşitlendirme örneğine yakındır?', en: 'Which is closer to stronger diversification?' },
    taskChoices: [
      { tr: 'Farklı ekonomik risk kaynaklarına bağlı yatırımları birlikte taşımak', en: 'Hold investments exposed to different economic risk sources' },
      { tr: 'Aynı sektörde birbirine çok benzeyen on varlık taşımak', en: 'Hold ten very similar assets from the same sector' },
      { tr: 'Yalnız varlık sayısını artırmak', en: 'Only increase the number of assets' },
    ],
    questions: [
      { prompt: { tr: 'Çeşitlendirmenin temel amacı nedir?', en: 'What is the basic goal of diversification?' }, choices: [{ tr: 'Tek bir risk kaynağına bağımlılığı azaltmak', en: 'Reduce dependence on one source of risk' }, { tr: 'Bütün kayıpları garantiyle yok etmek', en: 'Guarantee that every loss disappears' }, { tr: 'Yalnız varlık sayısını artırmak', en: 'Only increase the number of assets' }], explanation: { tr: 'Çeşitlendirme farklı risk kaynaklarına yayılmayı amaçlar; bütün kayıpları ortadan kaldırmayı garanti etmez.', en: 'Diversification aims to spread exposure across different risk sources; it does not guarantee eliminating every loss.' } },
      { prompt: { tr: 'On benzer varlık neden yeterli olmayabilir?', en: 'Why might ten similar assets still be insufficient?' }, choices: [{ tr: 'Aynı olaydan birlikte etkilenebilirler', en: 'They can all be affected by the same event' }, { tr: 'On sayısı çok küçük olduğu için', en: 'Because ten is too small a number' }, { tr: 'Grafikleri aynı renkte olduğu için', en: 'Because their charts use the same color' }], explanation: { tr: 'Varlıklar aynı risk faktörüne bağlıysa farklı isimler taşımak yoğunlaşmayı gerçekten azaltmayabilir.', en: 'If assets depend on the same risk factor, holding different names may not truly reduce concentration.' } },
      { prompt: { tr: 'Çeşitlendirme kaybı tamamen engeller mi?', en: 'Does diversification completely prevent loss?' }, choices: [{ tr: 'Hayır', en: 'No' }, { tr: 'Evet, her zaman', en: 'Yes, always' }, { tr: 'Yalnız piyasa yükselirken', en: 'Only while the market rises' }], explanation: { tr: 'Birçok yatırım aynı anda düşebilir; çeşitlendirme riski azaltmaya çalışır ama kaybı garantiyle engellemez.', en: 'Many investments can fall at the same time; diversification aims to reduce risk but does not guarantee preventing loss.' } },
    ],
  },
};

function localized(value: Localized) {
  return { tr: value.tr, en: value.en };
}

function audience(value: Localized) {
  return { normal: localized(value) };
}

export function normalizeBeginnerRiskEditorial(lesson: MicroLesson): MicroLesson {
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
    learningStage: 'foundation',
    contentBlocks,
    takeaway: localized(copy.takeaway),
    practicalTask,
    quiz,
  };
}
