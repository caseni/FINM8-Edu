import { learningChallengeSchema } from '../../progressionSchemas';
import { WAVE1_MARKET_FOUNDATION_LESSONS } from './marketFoundationsLessons';

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

