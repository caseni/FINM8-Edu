import { NavigatorScreenParams } from '@react-navigation/native';
import type { BeginnerSectionId } from '../domain/learning/beginnerJourney';
import type { LearningConceptKey } from '../domain/learning/types';

interface CurrentQuizReviewRouteContext {
  conceptKey: LearningConceptKey;
  reviewedEvidenceThroughAt: string;
}

type LessonPresentationSource = 'beginner' | 'academy';

export type RootStackParamList = {
  Home: undefined;
  BeginnerSection: { sectionId: BeginnerSectionId };
  Academy: undefined;
  LearningOnboarding: undefined;
  MicroLesson: {
    lessonId: string;
    review?: boolean;
    currentQuizReview?: CurrentQuizReviewRouteContext;
    source?: LessonPresentationSource;
  };
  PracticalTask: {
    lessonId: string;
    review?: boolean;
    source?: LessonPresentationSource;
  };
  LessonQuiz: {
    lessonId: string;
    review?: boolean;
    spacedReview?: boolean;
    source?: LessonPresentationSource;
  };
  LearningChallenge: { challengeId: string; review?: boolean };
  LearningReview: undefined;
  LegacyCatalog: undefined;
  CourseDetail: { courseId: number };
  Auth: NavigatorScreenParams<AuthStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  BeginnerSection: { sectionId: BeginnerSectionId };
  Academy: undefined;
  LearningOnboarding: undefined;
  MicroLesson: {
    lessonId: string;
    review?: boolean;
    currentQuizReview?: CurrentQuizReviewRouteContext;
    source?: LessonPresentationSource;
  };
  PracticalTask: {
    lessonId: string;
    review?: boolean;
    source?: LessonPresentationSource;
  };
  LessonQuiz: {
    lessonId: string;
    review?: boolean;
    spacedReview?: boolean;
    source?: LessonPresentationSource;
  };
  LearningChallenge: { challengeId: string; review?: boolean };
  LearningReview: undefined;
  LegacyCatalog: undefined;
  CourseDetail: { courseId: number };
};