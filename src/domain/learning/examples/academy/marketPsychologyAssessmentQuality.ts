import { microLessonSchema } from '../../schemas';
import type { LocalizedText, MicroLesson } from '../../types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const MARKET_PSYCHOLOGY_QUESTION_OVERRIDES: Readonly<
  Record<string, Readonly<Record<string, OptionCopyMap>>>
> = {
  'lesson.behavior.loss-aversion.001': {
    'question.kayip-korkusu-karari-nasil-bozar.3': {
      a: copy(
        'Hayır; kötü sonuç ile kötü karar aynı şey değildir, süreç ve ex-ante kanıt ayrıca değerlendirilir',
        'No; a bad outcome and a bad decision are not the same, so process and ex-ante evidence need separate review',
      ),
      b: copy(
        'Evet; gerçekleşen her kayıp karar anındaki sürecin yanlış olduğunu gösterir',
        'Yes; every realized loss proves the decision process was wrong at the time',
      ),
      c: copy(
        'Yalnız stop kullanılan işlemlerde kayıp karar kalitesini doğrudan gösterir',
        'Only when a stop is used does a loss directly reveal decision quality',
      ),
    },
  },
  'lesson.behavior.anchoring.001': {
    'question.ilk-fiyata-capalanmak.2': {
      a: copy(
        'Hayır; giriş fiyatı kişisel referanstır, şirketin güncel ekonomik değerini belirlemez',
        'No; entry price is a personal reference and does not determine current economic value',
      ),
      b: copy(
        'Evet; yatırımcının giriş fiyatı sonraki değerleme için objektif referans oluşturur',
        'Yes; an investor’s entry price creates an objective reference for subsequent valuation',
      ),
      c: copy(
        'Giriş fiyatı yalnız pozisyon zarardaysa gerçek değer için geçerli referans olur',
        'Entry price becomes a valid reference for true value only when the position is losing',
      ),
    },
  },
  'lesson.behavior.recency-bias.001': {
    'question.son-olay-her-sey-midir.2': {
      a: copy(
        'Hayır; üç sonuç uzun dönem dağılımını ve farklı rejimleri temsil etmeye yetmez',
        'No; three outcomes are not enough to represent the long-run distribution and different regimes',
      ),
      b: copy(
        'Evet; üç ardışık kazanç yöntemin edge’inin kalıcı olduğunu doğrular',
        'Yes; three consecutive wins confirm that the method’s edge is persistent',
      ),
      c: copy(
        'Yalnız işlemler yüksek hacimde gerçekleştiyse üç kazanç uzun dönem üstünlüğü kanıtlar',
        'Three wins prove long-run edge only when the trades occurred at high volume',
      ),
    },
  },
  'lesson.behavior.overconfidence.001': {
    'question.asiri-guven-nasil-fark-edilir.2': {
      a: copy(
        'Hayır; pozisyon boyutu kazanç serisinden değil risk bütçesi ve yeni kanıttan türemelidir',
        'No; position size should come from the risk budget and new evidence, not from a winning streak',
      ),
      b: copy(
        'Evet; ardışık doğru tahminler sonraki pozisyonda daha fazla risk almayı haklı çıkarır',
        'Yes; consecutive correct calls justify taking more risk on the next position',
      ),
      c: copy(
        'Pozisyonu büyütmek yalnız son üç işlem aynı varlıktaysa otomatik olarak mantıklıdır',
        'Increasing size becomes automatically rational only when the last three trades were in the same asset',
      ),
    },
  },
  'lesson.behavior.availability-bias.001': {
    'question.akla-gelen-en-onemli-mi.2': {
      a: copy(
        'Hayır; tek çarpıcı örnek olayın gerçek sıklığını ölçmez, baz oran için daha geniş veri gerekir',
        'No; one vivid example does not measure true frequency, so a broader sample is needed for the base rate',
      ),
      b: copy(
        'Evet; en dikkat çekici haber genellikle olayın normal sıklığını temsil eder',
        'Yes; the most striking headline usually represents the event’s normal frequency',
      ),
      c: copy(
        'Çarpıcı haber yalnız güvenilir bir kaynaktan geldiyse baz oran yerine kullanılabilir',
        'A vivid headline can substitute for a base rate only when it comes from a reliable source',
      ),
    },
  },
  'lesson.behavior.action-bias.001': {
    'question.bir-sey-yapmak-zorunda-misin.2': {
      a: copy(
        'Evet; koşul oluşmadığında beklemek sermayeyi ve karar kalitesini koruyan aktif bir seçim olabilir',
        'Yes; when conditions are absent, waiting can be an active choice that protects capital and decision quality',
      ),
      b: copy(
        'Hayır; işlem açılmadığı gün strateji hiçbir karar üretmemiş sayılır',
        'No; a day without a trade means the strategy made no decision at all',
      ),
      c: copy(
        'No-trade kararı yalnız piyasa kapalıyken geçerli bir karar sayılır',
        'A no-trade decision counts as a valid decision only when the market is closed',
      ),
    },
  },
};

export function normalizeMarketPsychologyAssessmentQuality(lesson: MicroLesson): MicroLesson {
  const lessonOverrides = MARKET_PSYCHOLOGY_QUESTION_OVERRIDES[lesson.id];
  if (!lessonOverrides) return lesson;

  const questions = lesson.quiz.questions.map((question) => {
    const optionOverrides = lessonOverrides[question.id];
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
    quiz: {
      ...lesson.quiz,
      questions,
    },
  });
}
