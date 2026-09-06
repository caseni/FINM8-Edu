import { microLessonSchema } from './schemas';
import type { LocalizedText, MicroLesson } from './types';

type OptionCopyMap = Readonly<Record<string, LocalizedText>>;

const copy = (tr: string, en: string): LocalizedText => ({ tr, en });

const RESIDUAL_QUESTION_OPTIONS: Readonly<Record<string, Readonly<Record<string, OptionCopyMap>>>> = {
  'lesson.fundamental.growth-quality.001': {
    'question.buyume-kalitesi-nasil-okunur.2': {
      c: copy(
        'Evet; büyüme sektör ortalamasını geçiyorsa marj ve nakit ayrıca incelenmez',
        'Yes; if growth beats the industry average, margins and cash do not need separate review',
      ),
    },
  },
  'lesson.fundamental.per-share.001': {
    'question.hisse-basina-metrikler-neden-onemlidir.3': {
      c: copy(
        'Evet; hisse sayısındaki artış yalnız fiyatı etkiler, EPS’yi etkilemez',
        'Yes; an increase in share count affects only price, not EPS',
      ),
    },
  },
  'lesson.fundamental.valuation-multiples.001': {
    'question.degerleme-carpanlari-nasil-okunur.2': {
      c: copy(
        'Evet; P/E sektör, büyüme ve riskten bağımsız okunabilir',
        'Yes; P/E can be read independently of industry, growth, and risk',
      ),
    },
  },
  'lesson.fundamental.dcf.001': {
    'question.dcf-mantigi-nedir.3': {
      c: copy(
        'Evet; iskonto oranı seçildikten sonra diğer varsayımlar sonucu değiştirmez',
        'Yes; once the discount rate is chosen, other assumptions no longer change the result',
      ),
    },
  },
  'lesson.fundamental.peer-comparison.001': {
    'question.benzer-sirket-karsilastirmasi-nasil-yapilir.1': {
      c: copy(
        'Evet; aynı sektörde olmak büyüme ve borç farklarını önemsiz kılar',
        'Yes; being in the same industry makes growth and debt differences irrelevant',
      ),
    },
  },
  'lesson.behavior.precommitment.001': {
    'question.karari-onceden-kurmak.2': {
      b: copy(
        'Asla; önceden yazılan kural her koşulda aynen kalmalıdır',
        'Never; a predefined rule should remain unchanged under every condition',
      ),
    },
  },
  'lesson.strategy.hypothesis.001': {
    'question.strateji-hipotezi-nedir.2': {
      b: copy(
        'Evet; geçmiş sonuçlara uyan bir açıklama tek başına hipotez sayılır',
        'Yes; an explanation that fits past results is enough to count as a hypothesis',
      ),
    },
  },
  'lesson.strategy.rules.001': {
    'question.giris-cikis-invalidation-kurallari.2': {
      a: copy(
        'Hayır; stop riski sınırlarken tez farklı bir noktada geçersizleşebilir',
        'No; a stop can limit risk before the thesis itself is invalidated',
      ),
    },
  },
  'lesson.asset.commodity.spot-futures.001': {
    'question.emtiada-spot-ve-vadeli-fiyat.1': {
      a: copy(
        'Evet; vadeli kontrat taşıma maliyetini ve teslim zamanını fiyatlayabilir',
        'Yes; futures can price carrying costs and time to delivery',
      ),
    },
  },
  'lesson.asset.crypto.onchain-limits.001': {
    'question.onchain-veri-ne-soyler-ne-soylemez.1': {
      a: copy(
        'Hayır; zincirde görülen hareket niyetin kendisi değildir',
        'No; observable blockchain activity does not by itself reveal intent',
      ),
    },
  },
  'lesson.risk.loss-recovery.001': {
    'question.buyuk-kayip-neden-zor-toparlanir.2': {
      a: copy(
        'Hayır; toparlanma daha düşük sermaye tabanından başlar',
        'No; the same percentage gain cannot recover the smaller post-loss base',
      ),
    },
  },
};

export function normalizeAcademyExpansionAssessmentResidualQuality(lesson: MicroLesson): MicroLesson {
  const questionOverrides = RESIDUAL_QUESTION_OPTIONS[lesson.id];
  if (!questionOverrides) return lesson;

  return microLessonSchema.parse({
    ...lesson,
    quiz: {
      ...lesson.quiz,
      questions: lesson.quiz.questions.map((question) => {
        const optionCopy = questionOverrides[question.id];
        if (!optionCopy) return question;
        return {
          ...question,
          options: question.options.map((option) =>
            optionCopy[option.id]
              ? {
                  ...option,
                  label: optionCopy[option.id],
                }
              : option,
          ),
        };
      }),
    },
  });
}
