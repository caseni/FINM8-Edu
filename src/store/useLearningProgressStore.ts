import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  calculateLearnerLevel,
  calculateReviewDueAt,
  createXpEvent,
  isBadgeEligible,
  scoreQuiz,
  updateLearningStreak,
  updateMasteryFromAssessment,
  type QuizResult,
  type QuizSubmission,
} from '../domain/learning/progressionEngine';
import type {
  BadgeAward,
  LearningBadge,
  LearningProfile,
  LessonCheckpoint,
  LessonJourneyStage,
  LearningStreak,
  Mastery,
  MicroLesson,
  XpEvent,
} from '../domain/learning/types';

interface LearningProgressState {
  hasHydrated: boolean;
  hydrationError?: 'progress_load_failed';
  profile: LearningProfile;
  xpEvents: XpEvent[];
  totalXp: number;
  level: number;
  completedLessonIds: string[];
  quizScores: Record<string, number>;
  passedPracticalTaskIds: string[];
  completedChallengeIds: string[];
  masteryBySkill: Record<string, Mastery>;
  badgeAwards: BadgeAward[];
  streak: LearningStreak;
  lessonCheckpoints: Record<string, LessonCheckpoint>;
  setProfile: (profile: LearningProfile) => void;
  completeLesson: (lesson: MicroLesson, completedAt: string) => void;
  submitQuiz: (
    lesson: MicroLesson,
    submissions: readonly QuizSubmission[],
    submittedAt: string
  ) => QuizResult;
  submitReview: (
    lesson: MicroLesson,
    submissions: readonly QuizSubmission[],
    submittedAt: string
  ) => QuizResult;
  passPracticalTask: (lesson: MicroLesson, passedAt: string) => void;
  completeChallenge: (challengeId: string, completedAt: string) => void;
  tryAwardBadge: (badge: LearningBadge, awardedAt: string) => boolean;
  saveLessonCheckpoint: (lessonId: string, stage: LessonJourneyStage, stepIndex?: number) => void;
  clearLessonCheckpoint: (lessonId: string) => void;
  resetLocalProgress: () => void;
  setHydrationState: (
    hasHydrated: boolean,
    hydrationError?: 'progress_load_failed'
  ) => void;
}

const initialProfile: LearningProfile = {
  userId: 'local-learner',
  selectedStage: 'foundation',
  goals: ['financial_literacy'],
  preferredMarketScopes: ['general'],
};

const initialStreak: LearningStreak = {
  userId: initialProfile.userId,
  currentDays: 0,
  longestDays: 0,
  graceCredits: 1,
};

function learningDate(isoDateTime: string) {
  return isoDateTime.slice(0, 10);
}

export const useLearningProgressStore = create<LearningProgressState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      hydrationError: undefined,
      profile: initialProfile,
      xpEvents: [],
      totalXp: 0,
      level: 1,
      completedLessonIds: [],
      quizScores: {},
      passedPracticalTaskIds: [],
      completedChallengeIds: [],
      masteryBySkill: {},
      badgeAwards: [],
      streak: initialStreak,
      lessonCheckpoints: {},

      setHydrationState: (hasHydrated, hydrationError) =>
        set({ hasHydrated, hydrationError }),

      setProfile: (profile) =>
        set((state) => ({
          profile,
          streak: { ...state.streak, userId: profile.userId },
        })),

      completeLesson: (lesson, completedAt) =>
        set((state) => {
          if (state.completedLessonIds.includes(lesson.id)) {
            const { [lesson.id]: _finished, ...lessonCheckpoints } = state.lessonCheckpoints;
            return { lessonCheckpoints };
          }
          const event = createXpEvent({
            userId: state.profile.userId,
            reason: 'lesson_completed',
            sourceId: lesson.id,
            awardedAt: completedAt,
          });
          const totalXp = state.totalXp + event.points;
          const previousMastery = state.masteryBySkill[lesson.skillId] ?? {
            userId: state.profile.userId,
            skillId: lesson.skillId,
            status: 'introduced' as const,
            score: 0,
            lessonCompletions: 0,
            quizAttempts: 0,
            practicalAttempts: 0,
          };
          return {
            completedLessonIds: [...state.completedLessonIds, lesson.id],
            xpEvents: [...state.xpEvents, event],
            totalXp,
            level: calculateLearnerLevel(totalXp),
            masteryBySkill: {
              ...state.masteryBySkill,
              [lesson.skillId]: {
                ...previousMastery,
                status:
                  previousMastery.status === 'unseen'
                    ? 'introduced'
                    : previousMastery.status,
                lessonCompletions: previousMastery.lessonCompletions + 1,
              },
            },
            streak: updateLearningStreak(state.streak, learningDate(completedAt)),
            lessonCheckpoints: Object.fromEntries(
              Object.entries(state.lessonCheckpoints).filter(([lessonId]) => lessonId !== lesson.id)
            ),
          };
        }),

      submitQuiz: (lesson, submissions, submittedAt) => {
        const result = scoreQuiz(lesson.quiz, submissions);
        set((state) => {
          const previousScore = state.quizScores[lesson.quiz.id] ?? 0;
          const quizScores = {
            ...state.quizScores,
            [lesson.quiz.id]: Math.max(previousScore, result.score),
          };
          const previousMastery = state.masteryBySkill[lesson.skillId] ?? {
            userId: state.profile.userId,
            skillId: lesson.skillId,
            status: 'unseen' as const,
            score: 0,
            lessonCompletions: 0,
            quizAttempts: 0,
            practicalAttempts: 0,
          };
          const mastery = updateMasteryFromAssessment(
            previousMastery,
            result.score,
            submittedAt,
            calculateReviewDueAt(result.score, submittedAt)
          );
          const event = result.passed
            ? createXpEvent({
                userId: state.profile.userId,
                reason: 'quiz_passed',
                sourceId: lesson.quiz.id,
                awardedAt: submittedAt,
              })
            : undefined;
          const isNewEvent =
            event &&
            !state.xpEvents.some(
              (existing) => existing.idempotencyKey === event.idempotencyKey
            );
          const xpEvents = isNewEvent ? [...state.xpEvents, event] : state.xpEvents;
          const totalXp = isNewEvent ? state.totalXp + event.points : state.totalXp;
          return {
            quizScores,
            masteryBySkill: { ...state.masteryBySkill, [lesson.skillId]: mastery },
            xpEvents,
            totalXp,
            level: calculateLearnerLevel(totalXp),
            streak: updateLearningStreak(state.streak, learningDate(submittedAt)),
          };
        });
        return result;
      },

      submitReview: (lesson, submissions, submittedAt) => {
        const result = get().submitQuiz(lesson, submissions, submittedAt);
        if (!result.passed) return result;
        set((state) => {
          const event = createXpEvent({
            userId: state.profile.userId,
            reason: 'review_completed',
            sourceId: lesson.id,
            awardedAt: submittedAt,
          });
          if (state.xpEvents.some((existing) => existing.idempotencyKey === event.idempotencyKey)) {
            return state;
          }
          const totalXp = state.totalXp + event.points;
          return {
            xpEvents: [...state.xpEvents, event],
            totalXp,
            level: calculateLearnerLevel(totalXp),
          };
        });
        return result;
      },

      passPracticalTask: (lesson, passedAt) =>
        set((state) => {
          const taskId = lesson.practicalTask.id;
          if (state.passedPracticalTaskIds.includes(taskId)) return state;
          const event = createXpEvent({
            userId: state.profile.userId,
            reason: 'practical_task_passed',
            sourceId: taskId,
            awardedAt: passedAt,
          });
          const mastery = state.masteryBySkill[lesson.skillId] ?? {
            userId: state.profile.userId,
            skillId: lesson.skillId,
            status: 'introduced' as const,
            score: 0,
            lessonCompletions: 0,
            quizAttempts: 0,
            practicalAttempts: 0,
          };
          const totalXp = state.totalXp + event.points;
          return {
            passedPracticalTaskIds: [...state.passedPracticalTaskIds, taskId],
            xpEvents: [...state.xpEvents, event],
            totalXp,
            level: calculateLearnerLevel(totalXp),
            masteryBySkill: {
              ...state.masteryBySkill,
              [lesson.skillId]: {
                ...mastery,
                practicalAttempts: mastery.practicalAttempts + 1,
              },
            },
            streak: updateLearningStreak(state.streak, learningDate(passedAt)),
          };
        }),

      completeChallenge: (challengeId, completedAt) =>
        set((state) => {
          if (state.completedChallengeIds.includes(challengeId)) return state;
          const event = createXpEvent({
            userId: state.profile.userId,
            reason: 'challenge_completed',
            sourceId: challengeId,
            awardedAt: completedAt,
          });
          const totalXp = state.totalXp + event.points;
          return {
            completedChallengeIds: [...state.completedChallengeIds, challengeId],
            xpEvents: [...state.xpEvents, event],
            totalXp,
            level: calculateLearnerLevel(totalXp),
            streak: updateLearningStreak(state.streak, learningDate(completedAt)),
          };
        }),

      tryAwardBadge: (badge, awardedAt) => {
        const state = get();
        if (state.badgeAwards.some((award) => award.badgeId === badge.id)) return false;
        const eligible = isBadgeEligible(badge, {
          completedLessonIds: state.completedLessonIds,
          quizScores: state.quizScores,
          passedPracticalTaskIds: state.passedPracticalTaskIds,
          masteryScores: Object.fromEntries(
            Object.entries(state.masteryBySkill).map(([skillId, mastery]) => [
              skillId,
              mastery.score,
            ])
          ),
          completedChallengeIds: state.completedChallengeIds,
        });
        if (!eligible) return false;

        const evidenceRefs = badge.requirements.map(
          (requirement) => `${requirement.kind}:${requirement.targetId}`
        );
        const award: BadgeAward = {
          id: `badge-award.${state.profile.userId}.${badge.id}`,
          userId: state.profile.userId,
          badgeId: badge.id,
          badgeDefinitionVersion: badge.definitionVersion,
          evidenceRefs,
          awardedAt,
        };
        set({ badgeAwards: [...state.badgeAwards, award] });
        return true;
      },

      saveLessonCheckpoint: (lessonId, stage, stepIndex = 0) =>
        set((state) => ({
          lessonCheckpoints: {
            ...state.lessonCheckpoints,
            [lessonId]: {
              lessonId,
              stage,
              stepIndex: Math.max(0, stepIndex),
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      clearLessonCheckpoint: (lessonId) =>
        set((state) => ({
          lessonCheckpoints: Object.fromEntries(
            Object.entries(state.lessonCheckpoints).filter(([storedLessonId]) => storedLessonId !== lessonId)
          ),
        })),

      resetLocalProgress: () =>
        set({
          profile: initialProfile,
          xpEvents: [],
          totalXp: 0,
          level: 1,
          completedLessonIds: [],
          quizScores: {},
          passedPracticalTaskIds: [],
          completedChallengeIds: [],
          masteryBySkill: {},
          badgeAwards: [],
          streak: initialStreak,
          lessonCheckpoints: {},
        }),
    }),
    {
      name: '@finm8_edu_progress_v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ hasHydrated, hydrationError, setHydrationState, ...progress }) => progress,
      onRehydrateStorage: () => (state, error) => {
        state?.setHydrationState(
          true,
          error ? 'progress_load_failed' : undefined
        );
      },
    }
  )
);
