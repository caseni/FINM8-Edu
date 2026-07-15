import type {
  LearningBadge,
  LearningStreak,
  Mastery,
  Quiz,
  XpEvent,
} from './types';

export interface QuizSubmission {
  readonly questionId: string;
  readonly selectedOptionId: string;
}

export interface QuizResult {
  readonly quizId: string;
  readonly correctAnswers: number;
  readonly totalQuestions: number;
  readonly score: number;
  readonly passed: boolean;
}

export interface AchievementEvidence {
  readonly completedLessonIds: readonly string[];
  readonly quizScores: Readonly<Record<string, number>>;
  readonly passedPracticalTaskIds: readonly string[];
  readonly masteryScores: Readonly<Record<string, number>>;
  readonly completedChallengeIds: readonly string[];
}

export const XP_REWARDS = {
  lesson_completed: 20,
  quiz_passed: 30,
  practical_task_passed: 40,
  review_completed: 50,
  challenge_completed: 100,
} as const;

export function scoreQuiz(
  quiz: Quiz,
  submissions: readonly QuizSubmission[]
): QuizResult {
  const answers = new Map(
    submissions.map((submission) => [
      submission.questionId,
      submission.selectedOptionId,
    ])
  );
  const correctAnswers = quiz.questions.filter(
    (question) => answers.get(question.id) === question.correctOptionId
  ).length;
  const score = Math.round((correctAnswers / quiz.questions.length) * 100);

  return {
    quizId: quiz.id,
    correctAnswers,
    totalQuestions: quiz.questions.length,
    score,
    passed: score >= quiz.passingScore,
  };
}

export function masteryStatusForScore(score: number): Mastery['status'] {
  if (score >= 90) return 'mastered';
  if (score >= 75) return 'competent';
  if (score >= 50) return 'practicing';
  if (score > 0) return 'introduced';
  return 'unseen';
}

export function updateMasteryFromAssessment(
  previous: Mastery,
  assessmentScore: number,
  assessedAt: string,
  reviewDueAt?: string
): Mastery {
  const boundedScore = Math.max(0, Math.min(100, assessmentScore));
  const weightedScore =
    previous.quizAttempts === 0
      ? boundedScore
      : Math.round(previous.score * 0.4 + boundedScore * 0.6);

  return {
    ...previous,
    score: weightedScore,
    status: masteryStatusForScore(weightedScore),
    quizAttempts: previous.quizAttempts + 1,
    lastAssessedAt: assessedAt,
    reviewDueAt,
  };
}

export function calculateReviewDueAt(score: number, assessedAt: string): string {
  const reviewDelayDays = score < 50 ? 1 : score < 75 ? 3 : score < 90 ? 7 : 14;
  const reviewDate = new Date(assessedAt);
  reviewDate.setUTCDate(reviewDate.getUTCDate() + reviewDelayDays);
  return reviewDate.toISOString();
}

export function calculateLearnerLevel(totalXp: number): number {
  return Math.floor(Math.max(0, totalXp) / 500) + 1;
}

export function createXpEvent(input: {
  userId: string;
  reason: XpEvent['reason'];
  sourceId: string;
  awardedAt: string;
}): XpEvent {
  return {
    id: `xp.${input.userId}.${input.reason}.${input.sourceId}`,
    userId: input.userId,
    reason: input.reason,
    points: XP_REWARDS[input.reason],
    sourceId: input.sourceId,
    idempotencyKey: `${input.userId}:${input.reason}:${input.sourceId}`,
    awardedAt: input.awardedAt,
  };
}

export function isBadgeEligible(
  badge: LearningBadge,
  evidence: AchievementEvidence
): boolean {
  return badge.requirements.every((requirement) => {
    switch (requirement.kind) {
      case 'lesson_completion':
        return evidence.completedLessonIds.includes(requirement.targetId);
      case 'quiz_accuracy':
        return (evidence.quizScores[requirement.targetId] ?? 0) >= requirement.threshold;
      case 'practical_task':
        return evidence.passedPracticalTaskIds.includes(requirement.targetId);
      case 'mastery':
        return (evidence.masteryScores[requirement.targetId] ?? 0) >= requirement.threshold;
      case 'challenge_completion':
        return evidence.completedChallengeIds.includes(requirement.targetId);
    }
  });
}

const DAY_MS = 86_400_000;

function dateToUtcDay(value: string): number {
  const [year, month, day] = value.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

export function updateLearningStreak(
  streak: LearningStreak,
  learningDate: string
): LearningStreak {
  if (!streak.lastLearningDate) {
    return { ...streak, currentDays: 1, longestDays: Math.max(1, streak.longestDays), lastLearningDate: learningDate };
  }
  const dayGap = Math.round(
    (dateToUtcDay(learningDate) - dateToUtcDay(streak.lastLearningDate)) / DAY_MS
  );
  if (dayGap <= 0) return streak;

  if (dayGap === 1) {
    const currentDays = streak.currentDays + 1;
    return {
      ...streak,
      currentDays,
      longestDays: Math.max(streak.longestDays, currentDays),
      lastLearningDate: learningDate,
    };
  }

  if (dayGap === 2 && streak.graceCredits > 0) {
    const currentDays = streak.currentDays + 1;
    return {
      ...streak,
      currentDays,
      longestDays: Math.max(streak.longestDays, currentDays),
      graceCredits: streak.graceCredits - 1,
      lastLearningDate: learningDate,
    };
  }

  return {
    ...streak,
    currentDays: 1,
    longestDays: Math.max(streak.longestDays, 1),
    lastLearningDate: learningDate,
  };
}
