import { microLessonSchema } from '../../schemas';
import type { LocalizedText, MicroLesson } from '../../types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

interface AssessmentCopyOverride {
  readonly taskChoices?: OptionCopyMap;
  readonly questionOptions?: Readonly<Record<string, OptionCopyMap>>;
}

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const STRATEGY_ASSESSMENT_OVERRIDES: Readonly<Record<string, AssessmentCopyOverride>> = {
  'lesson.strategy.horizon-objective.001': {
    taskChoices: {
      color: copy('Önce kullanılacak indikatörü seçip amaç ve zaman ufkunu sonradan uydurmak', 'Choose the indicator first and fit the objective and horizon afterward'),
      logo: copy('Aynı giriş kuralını her amaç ve holding period için değişmeden kullanmak', 'Use the same entry rule unchanged for every objective and holding period'),
    },
  },
  'lesson.strategy.mean-reversion.001': {
    questionOptions: {
      'question.mean-reversion-ne-varsayar.3': {
        a: copy('Hayır; sapmanın tanımı, rejim, invalidation ve risk birlikte gerekir', 'No; deviation definition, regime, invalidation, and risk all matter'),
        b: copy('Evet; yeterince büyük düşüş kendi başına dönüş sinyalidir', 'Yes; a sufficiently large decline is a reversal signal by itself'),
        c: copy('Yalnız fiyat tarihsel ortalamanın altında kaldıysa dönüş zorunludur', 'Reversion is mandatory only when price remains below its historical average'),
      },
    },
  },
  'lesson.strategy.momentum.001': {
    questionOptions: {
      'question.momentum-stratejisi-ne-yapar.2': {
        b: copy('Yalnız grafiğin görüntü ölçeğini değiştirir; sinyal tanımını değiştirmez', 'It changes only chart display scale, not the signal definition'),
        c: copy('Lookback uzadıkça momentum sinyali otomatik olarak daha doğru olur', 'A longer lookback automatically makes a momentum signal more accurate'),
      },
      'question.momentum-stratejisi-ne-yapar.3': {
        a: copy('Hayır; momentum ölçülebilir kurallara dayanabilir, FOMO ise dürtüsel fiyat kovalamadır', 'No; momentum can follow measurable rules while FOMO is impulsive price chasing'),
        b: copy('Evet; yükselen varlığa katılmak iki yaklaşımı ekonomik olarak aynı yapar', 'Yes; participating in a rising asset makes the two approaches economically identical'),
        c: copy('Yalnız momentum pozisyonu kârdaysa FOMO ile aynı kabul edilir', 'Momentum becomes the same as FOMO only when the position is profitable'),
      },
    },
  },
  'lesson.strategy.swing-position.001': {
    questionOptions: {
      'question.swing-ve-position-farki.1': {
        a: copy('Hayır; süreyle birlikte kanıt sıklığı, invalidation ve risk toleransı da değişir', 'No; evidence frequency, invalidation, and risk tolerance change with horizon too'),
        b: copy('Evet; sınıflandırmayı yalnız pozisyonun açık kaldığı gün sayısı belirler', 'Yes; classification is determined only by the number of days the position stays open'),
        c: copy('Yalnız pozisyon hafta sonu taşınıyorsa swing ile position ayrımı oluşur', 'The distinction exists only when the position is held over a weekend'),
      },
      'question.swing-ve-position-farki.3': {
        b: copy('Hayır; seçilen ufuk stop mesafesi ve tolere edilen oynaklığı değiştirmez', 'No; the chosen horizon does not change stop distance or tolerated volatility'),
        c: copy('Pozisyon boyutu yalnız giriş fiyatına bağlıdır; horizon ve risk bütçesiyle ilişkili değildir', 'Position size depends only on entry price, not horizon or risk budget'),
      },
    },
  },
  'lesson.strategy.rules.001': {
    questionOptions: {
      'question.giris-cikis-invalidation-kurallari.1': {
        a: copy('Hayır; giriş risk alma koşulunu, çıkış ise exposure yönetimini tanımlar', 'No; entry defines when to take risk while exit manages exposure'),
        b: copy('Evet; doğru giriş tanımlandıysa ayrı çıkış kuralına ihtiyaç kalmaz', 'Yes; a correct entry removes the need for a separate exit rule'),
        c: copy('Yalnız hedef fiyat kullanılıyorsa giriş ve çıkış aynı soruya dönüşür', 'Entry and exit become the same question only when a price target is used'),
      },
      'question.giris-cikis-invalidation-kurallari.2': {
        a: copy('Hayır; operasyonel risk stopu ile analitik thesis invalidation farklı amaç taşıyabilir', 'No; an operational risk stop and analytical thesis invalidation can serve different purposes'),
        b: copy('Evet; her stratejide stop seviyesi aynı zamanda hipotezin tamamen yanlışlandığı seviyedir', 'Yes; in every strategy the stop level is also the point where the thesis is fully invalidated'),
        c: copy('Fark yalnız kaldıraçlı ürünlerde vardır; spot işlemlerde stop ve invalidation aynıdır', 'The distinction exists only in leveraged products; in spot positions stop and invalidation are identical'),
      },
    },
  },
  'lesson.strategy.regime-fit.001': {
    questionOptions: {
      'question.strateji-rejime-uyar-mi.1': {
        a: copy('Evet; trend, range, volatilite ve likidite yapısı yöntemin davranışını değiştirebilir', 'Yes; trend, range, volatility, and liquidity conditions can change strategy behavior'),
        b: copy('Hayır; kurallar aynıysa strateji her piyasa yapısında aynı edge’i taşır', 'No; if rules are unchanged, the strategy carries the same edge in every market structure'),
        c: copy('Rejim yalnız makro resesyon dönemlerinde strateji davranışını etkiler', 'Regime matters to strategy behavior only during macro recessions'),
      },
      'question.strateji-rejime-uyar-mi.3': {
        b: copy('Evet; yeterli veri varsa rejim etiketi karar anında kesin olarak bilinir', 'Yes; with enough data the regime label is known with certainty at decision time'),
        c: copy('Rejim tespiti gecikse bile hard switching ek karar hatası yaratmaz', 'Even if regime detection lags, hard switching creates no additional decision error'),
      },
    },
  },
  'lesson.strategy.costs-turnover.001': {
    questionOptions: {
      'question.turnover-ve-maliyet.1': {
        c: copy('Yalnız komisyonu; spread ve slippage strateji sonucundan ayrı tutulmalıdır', 'Only commissions; spread and slippage should be kept separate from strategy results'),
      },
      'question.turnover-ve-maliyet.2': {
        b: copy('Evet; slippage her ürün ve emir boyutunda sabit bir yüzde olarak modellenebilir', 'Yes; slippage can be modeled as one fixed percentage for every product and order size'),
        c: copy('Likidite yalnız işlem sayısını etkiler, slippage seviyesini etkilemez', 'Liquidity affects only trade count, not the level of slippage'),
      },
    },
  },
  'lesson.strategy.diversification.001': {
    questionOptions: {
      'question.strateji-cesitlendirmesi.1': {
        a: copy('Evet; farklı isimler aynı momentum, yön veya likidite faktörüne bağımlı olabilir', 'Yes; different names can depend on the same momentum, direction, or liquidity factor'),
        b: copy('Hayır; strateji isimleri farklıysa ekonomik risk kaynakları da farklıdır', 'No; different strategy names imply different economic risk sources'),
        c: copy('Aynı varlık üzerinde çalışan stratejiler dışında ortak risk faktörü oluşmaz', 'Shared risk factors cannot exist except between strategies trading the same asset'),
      },
      'question.strateji-cesitlendirmesi.2': {
        b: copy('Hayır; stratejiler arasındaki korelasyon tasarımda sabittir ve stresle değişmez', 'No; strategy correlation is fixed by design and does not change under stress'),
        c: copy('Korelasyon yalnız iki strateji aynı yönde pozisyon açtığında değişebilir', 'Correlation can change only when two strategies hold positions in the same direction'),
      },
    },
  },
  'lesson.strategy.review-discipline.001': {
    questionOptions: {
      'question.stratejiyi-ne-zaman-review-etmeli.1': {
        a: copy('Hayır; tek sonuç beklenen varyasyon, süreç ve hipotezden ayrı kanıt değildir', 'No; one outcome is not evidence independent of expected variation, process, and hypothesis'),
        b: copy('Evet; tek kayıp stratejinin edge’inin sona erdiğini göstermek için yeterlidir', 'Yes; one loss is enough to show the strategy edge has ended'),
        c: copy('Yalnız kayıp stop seviyesini aşarsa stratejinin bozulduğu kesinleşir', 'A strategy is proven broken only when a loss exceeds the stop level'),
      },
      'question.stratejiyi-ne-zaman-review-etmeli.3': {
        a: copy('Evet; şanslı sonuç süreç hatasını kısa süre gizleyebilir', 'Yes; a lucky outcome can temporarily hide a process failure'),
        b: copy('Hayır; pozitif P&L sürecin de doğru yürütüldüğünü gösterir', 'No; positive P&L shows that the process was also executed correctly'),
        c: copy('Yalnız backtest dışı manuel kararlarda iyi sonuç kötü süreci gizleyebilir', 'A good outcome can hide bad process only in discretionary decisions outside a backtest'),
      },
    },
  },
};

export function normalizeStrategyAssessmentQuality(lesson: MicroLesson): MicroLesson {
  const override = STRATEGY_ASSESSMENT_OVERRIDES[lesson.id];
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
