import { learningChallengeSchema } from '../../progressionSchemas';
import { WAVE1_MARKET_FOUNDATION_LESSONS } from './marketFoundationsLessons';
import { WAVE1_CHART_LITERACY_LESSONS } from './chartLiteracyLessons';
import { WAVE1_RISK_MANAGEMENT_LESSONS } from './riskManagementLessons';
import type { LearningChallenge } from '../../types';

const challengeQuestions = WAVE1_MARKET_FOUNDATION_LESSONS.map((lesson, index) => ({
  ...lesson.quiz.questions[0],
  id: `question.challenge.market-foundations.${index + 1}`,
}));

export const MARKET_FOUNDATIONS_CHALLENGE = learningChallengeSchema.parse({
  id: 'challenge.market-foundations.foundation',
  title: { tr: 'Piyasa Mekaniği Challenge' },
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

const chartQuestions = WAVE1_CHART_LITERACY_LESSONS.map((lesson, index) => ({
  ...lesson.quiz.questions[0],
  id: `question.challenge.chart-literacy.${index + 1}`,
}));

export const CHART_LITERACY_CHALLENGE = learningChallengeSchema.parse({
  id: 'challenge.chart-literacy.foundation',
  title: { tr: 'Grafik Dedektifi Challenge' },
  description: {
    tr: 'Mum, zaman dilimi, trend, tepki bölgesi, BOS ve CHoCH kanıtlarını birlikte değerlendir.',
  },
  stage: 'foundation',
  skillIds: ['skill.chart-literacy', 'skill.market-structure'],
  prerequisiteLessonIds: WAVE1_CHART_LITERACY_LESSONS.map((lesson) => lesson.id),
  questions: chartQuestions,
  practicalTasks: [
    {
      ...WAVE1_CHART_LITERACY_LESSONS[2].practicalTask,
      id: 'task.challenge.chart-literacy.trend',
    },
    {
      ...WAVE1_CHART_LITERACY_LESSONS[5].practicalTask,
      id: 'task.challenge.chart-literacy.structure-change',
    },
  ],
  passingScore: 75,
  xpReward: 100,
  badgeId: 'badge.chart-literacy.module',
});

const riskQuestions = WAVE1_RISK_MANAGEMENT_LESSONS.map((lesson, index) => ({
  ...lesson.quiz.questions[0],
  id: `question.challenge.risk-management.${index + 1}`,
}));

export const RISK_MANAGEMENT_CHALLENGE = learningChallengeSchema.parse({
  id: 'challenge.risk.foundation',
  title: { tr: 'Risk Koruyucusu Challenge' },
  description: {
    tr: 'Belirsizlik, volatilite, pozisyon boyutu, stop sınırlamaları ve çeşitlendirmeyi tek risk planında değerlendir.',
  },
  stage: 'foundation',
  skillIds: ['skill.risk-management'],
  prerequisiteLessonIds: WAVE1_RISK_MANAGEMENT_LESSONS.map((lesson) => lesson.id),
  questions: riskQuestions,
  practicalTasks: [
    {
      ...WAVE1_RISK_MANAGEMENT_LESSONS[2].practicalTask,
      id: 'task.challenge.risk-management.position-size',
    },
    {
      ...WAVE1_RISK_MANAGEMENT_LESSONS[5].practicalTask,
      id: 'task.challenge.risk-management.diversification',
    },
  ],
  passingScore: 75,
  xpReward: 100,
  badgeId: 'badge.risk-guardian.foundation',
});

export const LEARNING_CHALLENGE_CATALOG: readonly LearningChallenge[] = [
  MARKET_FOUNDATIONS_CHALLENGE,
  CHART_LITERACY_CHALLENGE,
  RISK_MANAGEMENT_CHALLENGE,
];

export function getLearningChallengeById(challengeId: string) {
  return LEARNING_CHALLENGE_CATALOG.find((challenge) => challenge.id === challengeId);
}
