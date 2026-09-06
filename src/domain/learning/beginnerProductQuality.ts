import type { LocalizedText, MicroLesson } from './types';

type CopyPair = { readonly tr: string; readonly en: string };

type LessonPolish = {
  readonly hook?: CopyPair;
  readonly visualAlt?: CopyPair;
  readonly taskPrompt?: CopyPair;
  readonly taskChoiceLabels?: readonly CopyPair[];
};

const POLISH: Readonly<Record<string, LessonPolish>> = {
  'lesson.economy.growth.001': {
    hook: {
      tr: 'Tek bir şirketin değil, ekonomide üretilen mal ve hizmetlerin toplamına bakılır.',
      en: 'Look at the total goods and services produced across the economy, not just one company.',
    },
  },
  'lesson.market.price-formation.001': {
    visualAlt: {
      tr: 'Alış ve satış tekliflerinin ortadaki işlem fiyatında buluşmasını gösteren sade eşleşme görseli',
      en: 'Simple matching visual showing buy and sell offers meeting at a transaction price in the middle',
    },
    taskPrompt: {
      tr: 'Bir alıcı 100 TL ödemeye hazır, satıcı da 100 TL’den satmayı kabul ediyor. En olası sonuç nedir?',
      en: 'A buyer is willing to pay TRY 100 and a seller accepts TRY 100. What is the most likely result?',
    },
    taskChoiceLabels: [
      { tr: '100 TL’de işlem gerçekleşebilir', en: 'A trade can execute at TRY 100' },
      { tr: 'Fiyatı şirket tek başına belirler', en: 'The company sets the price by itself' },
      { tr: 'İki taraf anlaştığı hâlde işlem oluşamaz', en: 'No trade can form even though both sides agree' },
    ],
  },
  'lesson.market.instruments.001': {
    taskPrompt: {
      tr: 'Bir şirkete ortak olmak istiyorsun. Hangi araç bu isteğe en doğrudan karşılık gelir?',
      en: 'You want an ownership stake in a company. Which instrument most directly matches that goal?',
    },
  },
  'lesson.market.liquidity.001': {
    visualAlt: {
      tr: 'Aynı emrin farklı piyasa derinliğinde fiyatı ne kadar etkileyebildiğini gösteren sade likidite görseli',
      en: 'Simple liquidity visual showing how the same order can affect price differently at different market depths',
    },
  },
  'lesson.market.bid-ask.001': {
    hook: {
      tr: 'Alıcıların ödemek istediği fiyat ile satıcıların kabul ettiği fiyat aynı olmak zorunda değildir.',
      en: 'The price buyers are willing to pay does not have to match the price sellers are willing to accept.',
    },
  },
  'lesson.chart.support-resistance.001': {
    hook: {
      tr: 'Yakın fiyatlarda tekrar eden tepkiler, tek çizgiden çok bir bölgeyi işaret eder.',
      en: 'Repeated reactions around nearby prices point to a zone rather than one exact line.',
    },
  },
  'lesson.risk.uncertainty.001': {
    hook: {
      tr: 'Zarar henüz oluşmamış olsa bile sonuç belirsizse risk devam eder.',
      en: 'Risk remains while the outcome is uncertain, even before a loss has happened.',
    },
  },
  'lesson.risk.reward.001': {
    hook: {
      tr: '1:5 oranı hedef büyüklüğünü gösterir; hedefe ulaşma ihtimalini veya maliyeti göstermez.',
      en: 'A 1:5 ratio shows target size; it does not show the chance of reaching it or the trading cost.',
    },
  },
};

function localized(value: CopyPair): LocalizedText {
  return { tr: value.tr, en: value.en };
}

export function normalizeBeginnerProductQuality(lesson: MicroLesson): MicroLesson {
  const polish = POLISH[lesson.id];
  if (!polish) return lesson;

  const contentBlocks = lesson.contentBlocks.map((block) => {
    if (polish.hook && block.kind === 'prompt') {
      return {
        ...block,
        copy: {
          ...block.copy,
          normal: localized(polish.hook),
        },
      };
    }
    if (polish.visualAlt && block.kind === 'visual') {
      return { ...block, alt: localized(polish.visualAlt) };
    }
    return block;
  });

  const practicalTask = polish.taskPrompt || polish.taskChoiceLabels
    ? {
        ...lesson.practicalTask,
        prompt: polish.taskPrompt
          ? { ...lesson.practicalTask.prompt, normal: localized(polish.taskPrompt) }
          : lesson.practicalTask.prompt,
        choices: polish.taskChoiceLabels
          ? (lesson.practicalTask.choices ?? []).map((choice, index) => ({
              ...choice,
              label: localized(polish.taskChoiceLabels?.[index] ?? {
                tr: choice.label.tr,
                en: choice.label.en ?? choice.label.tr,
              }),
            }))
          : lesson.practicalTask.choices,
      }
    : lesson.practicalTask;

  return {
    ...lesson,
    contentBlocks,
    practicalTask,
  };
}
