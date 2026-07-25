import {
  BEHAVIOR_EVIDENCE_CHALLENGE,
  CHART_LITERACY_CHALLENGE,
  MARKET_FOUNDATIONS_CHALLENGE,
  RISK_MANAGEMENT_CHALLENGE,
} from './examples/wave1/challenges';
import { WAVE1_MARKET_FOUNDATION_LESSONS } from './examples/wave1/marketFoundationsLessons';
import type { LearningStage, LocalizedText, PresentationMode } from './types';

export const CURRENT_QUIZ_EVIDENCE_DIMENSIONS = [
  'concept_application',
  'chart_interpretation',
  'observation_interpretation_separation',
  'source_and_freshness',
  'risk_and_uncertainty',
  'delayed_retention',
] as const;

export type CurrentQuizEvidenceDimension =
  (typeof CURRENT_QUIZ_EVIDENCE_DIMENSIONS)[number];

export const CURRENT_QUIZ_EVIDENCE_LABELS: Readonly<
  Record<CurrentQuizEvidenceDimension, LocalizedText>
> = {
  concept_application: {
    tr: 'Kavramı güncel olaya uygulama',
    en: 'Applying a concept to a current event',
  },
  chart_interpretation: {
    tr: 'Grafik yorumlama',
    en: 'Chart interpretation',
  },
  observation_interpretation_separation: {
    tr: 'Gözlem ile yorumu ayırma',
    en: 'Separating observation from interpretation',
  },
  source_and_freshness: {
    tr: 'Kaynak ve veri güncelliği',
    en: 'Source and data freshness',
  },
  risk_and_uncertainty: {
    tr: 'Risk ve belirsizlik farkındalığı',
    en: 'Risk and uncertainty awareness',
  },
  delayed_retention: {
    tr: 'Bilgiyi zaman içinde hatırlama',
    en: 'Retaining knowledge over time',
  },
};

export type CurrentQuizTrackId =
  | 'daily_basics'
  | 'market_context'
  | 'chart_context'
  | 'risk_context'
  | 'multi_evidence';

interface CurrentQuizTrackDefinition {
  readonly id: CurrentQuizTrackId;
  readonly title: LocalizedText;
  readonly description: LocalizedText;
  readonly evidenceDimensions: readonly CurrentQuizEvidenceDimension[];
  readonly access: 'core' | 'extended';
}

export const CURRENT_QUIZ_TRACKS: readonly CurrentQuizTrackDefinition[] = [
  {
    id: 'daily_basics',
    title: { tr: 'Günün 3 Sorusu', en: "Today's 3 Questions" },
    description: {
      tr: 'Basit haber ve piyasa olaylarını öğrendiğin kavramlarla ilişkilendir.',
      en: 'Connect simple news and market events with concepts you have learned.',
    },
    evidenceDimensions: [
      'concept_application',
      'observation_interpretation_separation',
      'delayed_retention',
    ],
    access: 'core',
  },
  {
    id: 'market_context',
    title: { tr: 'Güncel piyasa bağlamı', en: 'Current market context' },
    description: {
      tr: 'Fiyat, likidite, spread ve emir kavramlarını güncel bağlamda uygula.',
      en: 'Apply price, liquidity, spread, and order concepts in a current context.',
    },
    evidenceDimensions: [
      'concept_application',
      'observation_interpretation_separation',
      'source_and_freshness',
    ],
    access: 'core',
  },
  {
    id: 'chart_context',
    title: { tr: 'Güncel grafik okuma', en: 'Current chart reading' },
    description: {
      tr: 'Zaman damgalı mini grafikte görülen kanıtı ayırt et.',
      en: 'Distinguish the evidence visible on a timestamped mini chart.',
    },
    evidenceDimensions: [
      'chart_interpretation',
      'observation_interpretation_separation',
      'source_and_freshness',
    ],
    access: 'core',
  },
  {
    id: 'risk_context',
    title: { tr: 'Güncel risk senaryosu', en: 'Current risk scenario' },
    description: {
      tr: 'Volatilite, boyutlandırma ve belirsizliği birlikte değerlendir.',
      en: 'Assess volatility, sizing, and uncertainty together.',
    },
    evidenceDimensions: [
      'concept_application',
      'risk_and_uncertainty',
      'source_and_freshness',
    ],
    access: 'core',
  },
  {
    id: 'multi_evidence',
    title: { tr: 'Çoklu kanıt senaryosu', en: 'Multi-evidence scenario' },
    description: {
      tr: 'Haber, grafik, veri kalitesi ve riski aynı senaryoda karşılaştır.',
      en: 'Compare news, charts, data quality, and risk in one scenario.',
    },
    evidenceDimensions: CURRENT_QUIZ_EVIDENCE_DIMENSIONS,
    access: 'core',
  },
];

const DAILY_BASICS_PREREQUISITE_IDS = WAVE1_MARKET_FOUNDATION_LESSONS
  .slice(0, 3)
  .map((lesson) => lesson.id);

export interface CurrentQuizReadinessInput {
  readonly completedLessonIds: readonly string[];
  readonly completedChallengeIds: readonly string[];
  readonly selectedStage: LearningStage;
  readonly presentationMode: PresentationMode;
}

export interface CurrentQuizReadiness {
  readonly runtimeStatus: 'preview_only';
  readonly difficulty: LearningStage;
  readonly presentationMode: PresentationMode;
  readonly completedDailyPrerequisites: number;
  readonly dailyPrerequisiteCount: number;
  readonly unlockedTrackIds: readonly CurrentQuizTrackId[];
  readonly nextTrackId?: CurrentQuizTrackId;
  readonly nextRequirement: LocalizedText;
}

/**
 * Computes curriculum eligibility only. Live question retrieval and publication
 * stay disabled until timestamped sources and owner review are available.
 *
 * Presentation mode changes depth, never curriculum truth or difficulty.
 */
export function getCurrentQuizReadiness({
  completedLessonIds,
  completedChallengeIds,
  selectedStage,
  presentationMode,
}: CurrentQuizReadinessInput): CurrentQuizReadiness {
  const completedLessons = new Set(completedLessonIds);
  const completedChallenges = new Set(completedChallengeIds);
  const completedDailyPrerequisites = DAILY_BASICS_PREREQUISITE_IDS.filter((lessonId) =>
    completedLessons.has(lessonId)
  ).length;
  const unlockedTrackIds: CurrentQuizTrackId[] = [];

  if (completedDailyPrerequisites === DAILY_BASICS_PREREQUISITE_IDS.length) {
    unlockedTrackIds.push('daily_basics');
  }
  if (completedChallenges.has(MARKET_FOUNDATIONS_CHALLENGE.id)) {
    unlockedTrackIds.push('market_context');
  }
  if (completedChallenges.has(CHART_LITERACY_CHALLENGE.id)) {
    unlockedTrackIds.push('chart_context');
  }
  if (completedChallenges.has(RISK_MANAGEMENT_CHALLENGE.id)) {
    unlockedTrackIds.push('risk_context');
  }
  if (completedChallenges.has(BEHAVIOR_EVIDENCE_CHALLENGE.id)) {
    unlockedTrackIds.push('multi_evidence');
  }

  const nextTrack = CURRENT_QUIZ_TRACKS.find(
    (track) => !unlockedTrackIds.includes(track.id)
  );

  return {
    runtimeStatus: 'preview_only',
    difficulty: selectedStage,
    presentationMode,
    completedDailyPrerequisites,
    dailyPrerequisiteCount: DAILY_BASICS_PREREQUISITE_IDS.length,
    unlockedTrackIds,
    nextTrackId: nextTrack?.id,
    nextRequirement: getNextRequirement(nextTrack?.id, completedDailyPrerequisites),
  };
}

function getNextRequirement(
  nextTrackId: CurrentQuizTrackId | undefined,
  completedDailyPrerequisites: number
): LocalizedText {
  switch (nextTrackId) {
    case 'daily_basics':
      return {
        tr: `İlk 3 Piyasa Temelleri dersinden ${completedDailyPrerequisites}/3 tamamlandı.`,
        en: `${completedDailyPrerequisites}/3 of the first Market Foundations lessons completed.`,
      };
    case 'market_context':
      return {
        tr: 'Piyasa Mekaniği Challenge tamamlandığında yeni soru türleri açılır.',
        en: 'New question types unlock after the Market Mechanics Challenge.',
      };
    case 'chart_context':
      return {
        tr: 'Grafik Dedektifi Challenge tamamlandığında mini grafik soruları açılır.',
        en: 'Mini-chart questions unlock after the Chart Detective Challenge.',
      };
    case 'risk_context':
      return {
        tr: 'Risk Koruyucusu Challenge tamamlandığında risk senaryoları açılır.',
        en: 'Risk scenarios unlock after the Risk Guardian Challenge.',
      };
    case 'multi_evidence':
      return {
        tr: 'Davranış ve Kanıt Challenge tamamlandığında çoklu kanıt senaryoları açılır.',
        en: 'Multi-evidence scenarios unlock after the Behavior and Evidence Challenge.',
      };
    default:
      return {
        tr: 'Tüm güncel quiz soru türlerine uygunsun.',
        en: 'You are eligible for every current-quiz question type.',
      };
  }
}
