import { learningChallengeSchema } from '../../progressionSchemas';
import { WAVE1_MARKET_FOUNDATION_LESSONS } from './marketFoundationsLessons';
import {
  WAVE1_CHART_LITERACY_CORE_LESSONS,
  WAVE1_MARKET_STRUCTURE_LESSONS,
} from './levelledLessonGroups';
import { WAVE1_RISK_MANAGEMENT_LESSONS } from './riskManagementLessons';
import { WAVE1_BEHAVIOR_EVIDENCE_LESSONS } from './behaviorEvidenceLessons';
import type { LearningChallenge } from '../../types';

const challengeQuestions = WAVE1_MARKET_FOUNDATION_LESSONS.map((lesson, index) => ({
  ...lesson.quiz.questions[0],
  id: `question.challenge.market-foundations.${index + 1}`,
}));

export const MARKET_FOUNDATIONS_CHALLENGE = learningChallengeSchema.parse({
  id: 'challenge.market-foundations.foundation',
  title: { tr: 'Piyasa Mekaniği · Bölüm Sonu Uygulaması', en: 'Market Mechanics · Module Wrap-Up' },
  description: {
    tr: 'Fiyat oluşumu, likidite, spread, emir türleri ve gerçekleşme riskini birlikte değerlendir.',
  },
  stage: 'foundation',
  skillIds: ['skill.market-foundations'],
  prerequisiteLessonIds: WAVE1_MARKET_FOUNDATION_LESSONS.map((lesson) => lesson.id),
  questions: challengeQuestions,
  practicalTasks: [
    {
      ...WAVE1_MARKET_FOUNDATION_LESSONS[2].practicalTask,
      id: 'task.challenge.market-foundations.liquidity',
    },
    {
      ...WAVE1_MARKET_FOUNDATION_LESSONS[4].practicalTask,
      id: 'task.challenge.market-foundations.orders',
    },
  ],
  passingScore: 75,
  xpReward: 100,
  badgeId: 'badge.market-foundations.module',
});

const chartQuestions = WAVE1_CHART_LITERACY_CORE_LESSONS.map((lesson, index) => ({
  ...lesson.quiz.questions[0],
  id: `question.challenge.chart-literacy.${index + 1}`,
}));

export const CHART_LITERACY_CHALLENGE = learningChallengeSchema.parse({
  id: 'challenge.chart-literacy.foundation',
  title: { tr: 'Grafik Dedektifi · Bölüm Sonu Uygulaması', en: 'Chart Detective · Module Wrap-Up' },
  description: {
    tr: 'Mum, zaman dilimi, trend ve destek/direnç bölgesini birlikte değerlendir.',
  },
  stage: 'foundation',
  skillIds: ['skill.chart-literacy'],
  prerequisiteLessonIds: WAVE1_CHART_LITERACY_CORE_LESSONS.map((lesson) => lesson.id),
  questions: chartQuestions,
  practicalTasks: [
    {
      ...WAVE1_CHART_LITERACY_CORE_LESSONS[2].practicalTask,
      id: 'task.challenge.chart-literacy.trend',
    },
    {
      ...WAVE1_CHART_LITERACY_CORE_LESSONS[3].practicalTask,
      id: 'task.challenge.chart-literacy.support-resistance',
    },
  ],
  passingScore: 75,
  xpReward: 100,
  badgeId: 'badge.chart-literacy.module',
});

const marketStructureQuestions = WAVE1_MARKET_STRUCTURE_LESSONS.map((lesson, index) => ({
  ...lesson.quiz.questions[0],
  id: `question.challenge.market-structure.${index + 1}`,
}));

export const MARKET_STRUCTURE_CHALLENGE = learningChallengeSchema.parse({
  id: 'challenge.market-structure.intermediate',
  title: { tr: 'Piyasa Yapısı · Bölüm Sonu Uygulaması', en: 'Market Structure · Module Wrap-Up' },
  description: {
    tr: 'BOS ve CHoCH kavramlarını anlamlı swing, kapanış ve bağlam üzerinden ayırt et.',
    en: 'Distinguish BOS and CHoCH through meaningful swings, closes, and context.',
  },
  stage: 'intermediate',
  skillIds: ['skill.market-structure'],
  prerequisiteLessonIds: WAVE1_MARKET_STRUCTURE_LESSONS.map((lesson) => lesson.id),
  questions: marketStructureQuestions,
  practicalTasks: [
    {
      ...WAVE1_MARKET_STRUCTURE_LESSONS[0].practicalTask,
      id: 'task.challenge.market-structure.bos',
    },
    {
      ...WAVE1_MARKET_STRUCTURE_LESSONS[1].practicalTask,
      id: 'task.challenge.market-structure.choch',
    },
  ],
  passingScore: 75,
  xpReward: 100,
  badgeId: 'badge.market-structure.intermediate',
});

const riskQuestions = WAVE1_RISK_MANAGEMENT_LESSONS.map((lesson, index) => ({
  ...lesson.quiz.questions[0],
  id: `question.challenge.risk-management.${index + 1}`,
}));
const riskPositionSizingLesson = WAVE1_RISK_MANAGEMENT_LESSONS.find(
  (lesson) => lesson.id === 'lesson.risk.position-sizing.001'
);
const riskDiversificationLesson = WAVE1_RISK_MANAGEMENT_LESSONS.find(
  (lesson) => lesson.id === 'lesson.portfolio.diversification.001'
);
if (!riskPositionSizingLesson || !riskDiversificationLesson) {
  throw new Error('Risk management challenge source lessons are missing');
}

export const RISK_MANAGEMENT_CHALLENGE = learningChallengeSchema.parse({
  id: 'challenge.risk.foundation',
  title: { tr: 'Risk Koruyucusu · Bölüm Sonu Uygulaması', en: 'Risk Guardian · Module Wrap-Up' },
  description: {
    tr: 'Belirsizlik, volatilite, pozisyon boyutu, stop sınırlamaları ve çeşitlendirmeyi tek risk planında değerlendir.',
  },
  stage: 'foundation',
  skillIds: ['skill.risk-management'],
  prerequisiteLessonIds: WAVE1_RISK_MANAGEMENT_LESSONS.map((lesson) => lesson.id),
  questions: riskQuestions,
  practicalTasks: [
    {
      ...riskPositionSizingLesson.practicalTask,
      id: 'task.challenge.risk-management.position-size',
    },
    {
      ...riskDiversificationLesson.practicalTask,
      id: 'task.challenge.risk-management.diversification',
    },
  ],
  passingScore: 75,
  xpReward: 100,
  badgeId: 'badge.risk-guardian.foundation',
});

const behaviorEvidenceQuestions = WAVE1_BEHAVIOR_EVIDENCE_LESSONS.map((lesson, index) => ({
  ...lesson.quiz.questions[0],
  id: `question.challenge.behavior-evidence.${index + 1}`,
}));
const behaviorConfirmationBiasLesson = WAVE1_BEHAVIOR_EVIDENCE_LESSONS.find(
  (lesson) => lesson.id === 'lesson.behavior.confirmation-bias.001'
);
const behaviorDecisionJournalLesson = WAVE1_BEHAVIOR_EVIDENCE_LESSONS.find(
  (lesson) => lesson.id === 'lesson.behavior.decision-journal.001'
);
if (!behaviorConfirmationBiasLesson || !behaviorDecisionJournalLesson) {
  throw new Error('Behavior/evidence challenge source lessons are missing');
}

export const BEHAVIOR_EVIDENCE_CHALLENGE = learningChallengeSchema.parse({
  id: 'challenge.behavior-evidence.foundation',
  title: { tr: 'Kanıt Dedektifi · Bölüm Sonu Uygulaması', en: 'Evidence Detective · Module Wrap-Up' },
  description: {
    tr: 'FOMO, aşırı işlem, doğrulama yanlılığı, veri kalitesi, güncellik ve karar günlüğünü birlikte değerlendir.',
  },
  stage: 'foundation',
  skillIds: ['skill.behavior-evidence'],
  prerequisiteLessonIds: WAVE1_BEHAVIOR_EVIDENCE_LESSONS.map((lesson) => lesson.id),
  questions: behaviorEvidenceQuestions,
  practicalTasks: [
    {
      ...behaviorConfirmationBiasLesson.practicalTask,
      id: 'task.challenge.behavior-evidence.confirmation-bias',
    },
    {
      ...behaviorDecisionJournalLesson.practicalTask,
      id: 'task.challenge.behavior-evidence.decision-journal',
    },
  ],
  passingScore: 75,
  xpReward: 100,
  badgeId: 'badge.evidence-detective.foundation',
});

export const LEARNING_CHALLENGE_CATALOG: readonly LearningChallenge[] = [
  MARKET_FOUNDATIONS_CHALLENGE,
  CHART_LITERACY_CHALLENGE,
  MARKET_STRUCTURE_CHALLENGE,
  RISK_MANAGEMENT_CHALLENGE,
  BEHAVIOR_EVIDENCE_CHALLENGE,
];

export function getLearningChallengeById(challengeId: string) {
  return LEARNING_CHALLENGE_CATALOG.find((challenge) => challenge.id === challengeId);
}
