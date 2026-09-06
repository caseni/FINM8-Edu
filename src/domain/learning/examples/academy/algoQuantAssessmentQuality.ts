import { microLessonSchema } from '../../schemas';
import type { LocalizedText, MicroLesson } from '../../types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface AssessmentCopyOverride {
  readonly taskChoices?: OptionCopyMap;
  readonly questionOptions?: Readonly<Record<string, OptionCopyMap>>;
}

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const ALGO_QUANT_ASSESSMENT_OVERRIDES: Readonly<Record<string, AssessmentCopyOverride>> = {
  'lesson.quant.probability.001': {
    questionOptions: {
      'question.olaslikla-dusunmek.2': {
        a: copy('Hayır; tek sonuç yöntem kalitesini ayırmaya yetmez', 'No; one outcome is not enough to judge process quality'),
        b: copy('Evet; gerçekleşen sonuç kararın ex-ante kalitesini doğrular', 'Yes; the realized outcome validates the ex-ante quality of the decision'),
        c: copy('Yalnız sonuç beklenen getiriden büyükse yöntemi kanıtlar', 'Only when the outcome exceeds expected return does it prove the method'),
      },
      'question.olaslikla-dusunmek.3': {
        a: copy('Evet; düşük olasılık sıfır olasılık değildir', 'Yes; low probability is not zero probability'),
        b: copy('Hayır; düşük olasılık pratikte gerçekleşmeyecek olay demektir', 'No; low probability means the event will not occur in practice'),
        c: copy('Yalnız örneklem büyüdükçe düşük olasılıklı olaylar imkânsızlaşır', 'Low-probability events become impossible only as the sample grows'),
      },
    },
  },
  'lesson.quant.expectancy.001': {
    questionOptions: {
      'question.expectancy-nedir.1': {
        a: copy('Hayır; win rate ile kazanç ve kayıp büyüklükleri birlikte gerekir', 'No; win rate must be combined with win and loss magnitudes'),
        b: copy('Evet; yeterli işlem varsa win rate expectancy’nin tamamını açıklar', 'Yes; with enough trades, win rate fully describes expectancy'),
        c: copy('Payoff yalnız win rate %50’nin altındaysa expectancy’ye girer', 'Payoff matters to expectancy only when win rate is below 50%'),
      },
      'question.expectancy-nedir.2': {
        a: copy('Hayır; pozitif ortalama beklenti tek bir sonraki sonucu belirlemez', 'No; a positive average expectation does not determine the next outcome'),
        b: copy('Evet; pozitif expectancy sonraki işlemin ekonomik olarak pozitif olmasını gerektirir', 'Yes; positive expectancy requires the next trade to have a positive economic outcome'),
        c: copy('Yalnız geçmiş win rate yüksekse sonraki sonucu garanti eder', 'It guarantees the next outcome only when historical win rate is high'),
      },
      'question.expectancy-nedir.3': {
        a: copy('Evet; az gözlem ortalama payoff ve olasılık tahminini oynak yapabilir', 'Yes; few observations can make payoff and probability estimates unstable'),
        b: copy('Hayır; expectancy formülü örneklem büyüklüğünden etkilenmez', 'No; the expectancy formula makes sample size irrelevant'),
        c: copy('Küçük örneklem yalnız işlem sayısını etkiler, tahmin belirsizliğini etkilemez', 'A small sample affects only trade count, not estimation uncertainty'),
      },
    },
  },
  'lesson.quant.winrate-payoff.001': {
    taskChoices: {
      color: copy('Kazanan işlemlerin ne kadar sık art arda geldiği', 'How often winning trades occur consecutively'),
    },
    questionOptions: {
      'question.win-rate-payoff-dengesi.1': {
        a: copy('Hayır; seyrek büyük kayıplar çok sayıdaki küçük kazancı aşabilir', 'No; rare large losses can outweigh many small wins'),
        b: copy('Evet; %80 win rate payoff büyüklüğünden bağımsız olarak pozitif sonuç verir', 'Yes; an 80% win rate produces a positive result regardless of payoff size'),
        c: copy('Yalnız işlem maliyeti sıfırsa %80 win rate kârlılığı garanti eder', 'An 80% win rate guarantees profitability only when transaction costs are zero'),
      },
      'question.win-rate-payoff-dengesi.2': {
        a: copy('Evet; ortalama kazanç kayıptan yeterince büyükse mümkün olabilir', 'Yes; it can be possible when average wins are sufficiently larger than losses'),
        b: copy('Hayır; pozitif expectancy için win rate mutlaka %50’nin üzerinde olmalıdır', 'No; positive expectancy always requires win rate above 50%'),
        c: copy('Yalnız risk/getiri oranı tam 1:1 ise düşük win rate pozitif olabilir', 'A low win rate can be positive only when risk/reward is exactly 1:1'),
      },
    },
  },
  'lesson.quant.backtest.001': {
    questionOptions: {
      'question.backtest-ne-soyler.2': {
        a: copy('Hayır; geçmiş uyumu rejim ve uygulama değişimlerine karşı garanti değildir', 'No; historical fit is not a guarantee against regime and implementation changes'),
        b: copy('Evet; yeterince düzgün equity curve gelecek performansını doğrular', 'Yes; a sufficiently smooth equity curve validates future performance'),
        c: copy('Yalnız uzun tarih kullanılırsa geçmiş performans gelecek garantisine dönüşür', 'Historical performance becomes a future guarantee only when the history is long enough'),
      },
      'question.backtest-ne-soyler.3': {
        a: copy('Evet; ücret, spread, slippage ve market impact uygulanabilir sonucu değiştirebilir', 'Yes; fees, spread, slippage, and market impact can change implementable results'),
        b: copy('Hayır; maliyetler yalnız canlı işlemde önemlidir, backtest araştırmasını etkilemez', 'No; costs matter only in live trading and do not affect backtest research'),
        c: copy('Maliyet modeline yalnız komisyon eklemek gerçekçilik için yeterlidir', 'Adding commissions alone is sufficient for realistic cost modeling'),
      },
    },
  },
  'lesson.quant.out-of-sample.001': {
    questionOptions: {
      'question.orneklem-ve-out-of-sample.1': {
        a: copy('Evet; aynı veriye göre seçim yapmak değerlendirmeyi iyimserleştirebilir', 'Yes; selecting on the same data can make evaluation optimistic'),
        b: copy('Hayır; kurallar açıkça yazıldıysa aynı veriyle seçim ve test bağımsız kalır', 'No; if rules are explicit, selection and testing on the same data remain independent'),
        c: copy('Risk yalnız veri seti küçük olduğunda vardır; büyük veride aynı örneklem kullanılabilir', 'The risk exists only with small datasets; large datasets can reuse the same sample'),
      },
      'question.orneklem-ve-out-of-sample.2': {
        b: copy('Kuralları sonuç iyileşene kadar yeniden ayarlamak için ayrılmış veri', 'Data reserved for retuning rules until results improve'),
        c: copy('Canlı performans yerine kullanılan kesin gelecek performansı tahmini', 'A definitive forecast of future performance used instead of live evidence'),
      },
      'question.orneklem-ve-out-of-sample.3': {
        a: copy('Evet; tekrar tekrar bakmak holdout’u dolaylı olarak tuning verisine dönüştürebilir', 'Yes; repeated peeking can indirectly turn the holdout into tuning data'),
        b: copy('Hayır; holdout etiketi veriyi kaç kez incelersen incele bağımsız tutar', 'No; the holdout label keeps data independent no matter how often it is inspected'),
        c: copy('Sorun yalnız holdout sonucuna göre kod değiştirildiğinde değil, parametre değiştirilmediğinde de yoktur', 'There is no issue unless code changes; parameter choices based on the holdout do not count'),
      },
    },
  },
  'lesson.quant.transaction-costs.001': {
    questionOptions: {
      'question.backtestte-islem-maliyetleri.1': {
        a: copy('Hayır; spread, slippage ve market impact da ekonomik maliyet yaratabilir', 'No; spread, slippage, and market impact can also create economic costs'),
        b: copy('Evet; komisyon sıfırsa stratejinin uygulanabilir işlem maliyeti de sıfırdır', 'Yes; if commission is zero, implementable trading cost is also zero'),
        c: copy('Spread ve slippage yalnız pozisyon kapatılırken maliyet sayılır', 'Spread and slippage count as costs only when positions are closed'),
      },
      'question.backtestte-islem-maliyetleri.2': {
        a: copy('Evet; aynı maliyet daha sık tekrarlandığı için net avantajı aşındırabilir', 'Yes; repeating the same cost more often can erode net edge'),
        b: copy('Hayır; turnover yalnız işlem sayısını değiştirir, strateji ekonomisini değiştirmez', 'No; turnover changes only trade count, not strategy economics'),
        c: copy('Yüksek turnover maliyeti yalnız büyük fonlarda artırır, küçük hesaplarda etkilemez', 'High turnover raises costs only for large funds, not smaller accounts'),
      },
      'question.backtestte-islem-maliyetleri.3': {
        a: copy('Hayır; net avantaj uygulama maliyetleri düşüldükten sonra kalan kısımdır', 'No; net edge is what remains after implementation costs'),
        b: copy('Evet; güçlü sinyal varsa brüt ve net avantaj ekonomik olarak aynı kabul edilir', 'Yes; with a strong signal, gross and net edge can be treated as economically identical'),
        c: copy('Brüt ve net farkı yalnız zarar eden stratejilerde önemlidir', 'The gross-versus-net difference matters only for losing strategies'),
      },
    },
  },
  'lesson.quant.overfitting.001': {
    questionOptions: {
      'question.overfitting-nedir.2': {
        a: copy('Hayır; ek parametreler geçmiş gürültüsüne uyum ve seçim riskini artırabilir', 'No; extra parameters can increase fitting to noise and selection risk'),
        b: copy('Evet; daha fazla parametre her zaman daha fazla gerçek piyasa bilgisini yakalar', 'Yes; more parameters always capture more real market information'),
        c: copy('Parametre sayısı yalnız hesaplama hızını etkiler, genelleme riskini etkilemez', 'Parameter count affects only computation speed, not generalization risk'),
      },
      'question.overfitting-nedir.3': {
        a: copy('Hayır; seçim süreci ve holdout’a tekrar bakma yine overfitting yaratabilir', 'No; selection and repeated holdout inspection can still create overfitting'),
        b: copy('Evet; tek bir out-of-sample bölümü bütün model-seçim yanlılığını ortadan kaldırır', 'Yes; one out-of-sample segment removes all model-selection bias'),
        c: copy('Yalnız holdout sonucu pozitifse overfitting riski tamamen biter', 'Overfitting risk ends completely whenever the holdout result is positive'),
      },
    },
  },
  'lesson.quant.lookahead-bias.001': {
    questionOptions: {
      'question.look-ahead-bias-nedir.2': {
        a: copy('Evet; revize değer ilk karar tarihinde bilinmiyor olabilir', 'Yes; a revised value may not have been known at the original decision time'),
        b: copy('Hayır; veri tabanındaki en güncel değer geçmiş tarih için de kullanılabilir', 'No; the latest database value can also be used for the historical date'),
        c: copy('Revizyon riski yalnız fiyat verisinde vardır, makro veride yoktur', 'Revision risk exists only in price data, not macro data'),
      },
      'question.look-ahead-bias-nedir.3': {
        a: copy('Evet; sinyalin bilindiği an ile emrin uygulanabildiği an uyumlu olmalıdır', 'Yes; signal availability and executable order timing must be aligned'),
        b: copy('Hayır; aynı mum içindeki sinyal ve gerçekleşme sırası backtest sonucunu etkilemez', 'No; signal and fill ordering within the same bar cannot affect a backtest result'),
        c: copy('Zamanlama yalnız günlükten daha kısa stratejilerde önemlidir', 'Timing matters only for strategies shorter than daily frequency'),
      },
    },
  },
  'lesson.quant.survivorship-bias.001': {
    questionOptions: {
      'question.survivorship-bias-nedir.2': {
        a: copy('Evet; gelecekte hangi varlıkların hayatta kalacağını geçmiş örnekleme taşır', 'Yes; it imports knowledge of future survivors into the historical sample'),
        b: copy('Hayır; bugünkü endeks üyeleri geçmiş performans için tarafsız bir evrendir', 'No; today’s index members are an unbiased universe for historical performance'),
        c: copy('Yalnız endeks bileşen sayısı değiştiğinde survivorship bias oluşur', 'Survivorship bias occurs only when the number of index constituents changes'),
      },
      'question.survivorship-bias-nedir.3': {
        a: copy('Evet; delisting ve evrenden çıkışlar tarihsel sonuçların gerçekçiliğini etkiler', 'Yes; delistings and removals affect the realism of historical outcomes'),
        b: copy('Hayır; delist olan varlıklar artık işlem görmediği için geçmiş testten çıkarılmalıdır', 'No; delisted assets should be removed from historical tests because they no longer trade'),
        c: copy('Delisting verisi yalnız temettü stratejilerinde veri kalitesi konusudur', 'Delisting data matters to data quality only for dividend strategies'),
      },
    },
  },
  'lesson.quant.data-leakage.001': {
    questionOptions: {
      'question.data-leakage-nedir.1': {
        b: copy('Train ve test sınırlarını koruyup yalnız eğitim verisinden özellik üretir', 'Preserves train/test boundaries and builds features only from training data'),
        c: copy('Test verisini yalnız final değerlendirme metriğini hesaplamak için kullanır', 'Uses test data only to calculate final evaluation metrics'),
      },
      'question.data-leakage-nedir.2': {
        a: copy('Evet; tüm veriyle fit edilen dönüşüm test dağılımını train tarafına taşıyabilir', 'Yes; a transformation fit on all data can carry test-distribution information into training'),
        b: copy('Hayır; hedef sütunu doğrudan kullanılmadığı sürece global preprocessing leakage yaratmaz', 'No; global preprocessing cannot leak information unless the target column is used directly'),
        c: copy('Global normalizasyon yalnız zaman serisi olmayan veride güvenlidir', 'Global normalization is safe only for non-time-series data'),
      },
      'question.data-leakage-nedir.3': {
        b: copy('Canlıda erişilemeyen bilgi yalnız backtest skorunu düşürür, genellemeyi bozmaz', 'Unavailable live information only lowers the backtest score; it does not harm generalization'),
        c: copy('Leakage canlıda aynı preprocessing tekrarlandığı sürece sorun olmaktan çıkar', 'Leakage stops being a problem as long as the same preprocessing is repeated live'),
      },
    },
  },
  'lesson.quant.robustness.001': {
    questionOptions: {
      'question.robustness-nasil-test-edilir.3': {
        a: copy('Hayır; dayanıklılık kanıt kalitesini artırır ama rejim değişimini ortadan kaldırmaz', 'No; robustness improves evidence quality but does not eliminate regime change'),
        b: copy('Evet; parametre platosu bulunan strateji gelecekte de çalışmayı garanti eder', 'Yes; a strategy with a parameter plateau is guaranteed to work in the future'),
        c: copy('Yalnız uzun backtest ve çoklu piyasa varsa robustness geleceği garanti eder', 'Robustness guarantees the future only with a long backtest across multiple markets'),
      },
    },
  },
  'lesson.quant.automation-limits.001': {
    taskChoices: {
      none: copy('Backtest başarılıysa canlı sistem için ek operasyon kontrolüne gerek olmadığını varsaymak', 'Assuming a successful backtest removes the need for live operational controls'),
      profit: copy('Sadece model sinyali ve pozisyon hedefi tanımlayıp stale-data veya execution kontrolü eklememek', 'Defining only model signals and position targets without stale-data or execution controls'),
    },
    questionOptions: {
      'question.otomasyonun-sinirlari.1': {
        a: copy('Hayır; otomasyon hatalı kuralı da hızlı ve tutarlı biçimde uygulayabilir', 'No; automation can execute a bad rule quickly and consistently'),
        b: copy('Evet; kural otomatik çalışıyorsa mantık hataları execution sırasında düzeltilir', 'Yes; once a rule is automated, logic errors are corrected during execution'),
        c: copy('Yalnız model istatistiksel ise otomasyon hatalı kuralı kendiliğinden düzeltir', 'Automation self-corrects bad rules only when the model is statistical'),
      },
      'question.otomasyonun-sinirlari.2': {
        a: copy('Evet; stale data doğru kodu yanlış veya eski bilgiyle çalıştırabilir', 'Yes; stale data can make correct code act on wrong or outdated information'),
        b: copy('Hayır; otomatik sistem veri timestampini kontrol etmese de son değeri güvenle kullanabilir', 'No; an automated system can safely use the latest value without checking timestamps'),
        c: copy('Stale data yalnız manuel karar gecikmelerinde risk yaratır', 'Stale data creates risk only through delays in manual decisions'),
      },
      'question.otomasyonun-sinirlari.3': {
        a: copy('Hayır; research kanıtı ile production monitoring, reconciliation ve kill-switch ayrı kapılardır', 'No; research evidence and production monitoring, reconciliation, and kill switches are separate gates'),
        b: copy('Evet; iyi out-of-sample sonuç production güvenliğini de doğrular', 'Yes; a strong out-of-sample result also validates production safety'),
        c: copy('Backtest maliyetleri gerçekçiyse operasyonel arıza riski ayrıca test edilmez', 'If backtest costs are realistic, operational failure risk does not need separate testing'),
      },
    },
  },
};

export function normalizeAlgoQuantAssessmentQuality(lesson: MicroLesson): MicroLesson {
  const override = ALGO_QUANT_ASSESSMENT_OVERRIDES[lesson.id];
  if (!override) return lesson;

  const practicalTask =
    override.taskChoices && lesson.practicalTask.choices
      ? {
          ...lesson.practicalTask,
          choices: lesson.practicalTask.choices.map((choice) => ({
            ...choice,
            label: override.taskChoices?.[choice.id] ?? choice.label,
          })),
        }
      : lesson.practicalTask;

  const questions = lesson.quiz.questions.map((question) => {
    const optionOverrides = override.questionOptions?.[question.id];
    if (!optionOverrides) return question;

    return {
      ...question,
      options: question.options.map((option) => ({
        ...option,
        label: optionOverrides[option.id] ?? option.label,
      })),
    };
  });

  return microLessonSchema.parse({
    ...lesson,
    practicalTask,
    quiz: {
      ...lesson.quiz,
      questions,
    },
  });
}
