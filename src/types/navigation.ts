import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  LearningOnboarding: undefined;
  MicroLesson: { lessonId: string; review?: boolean };
  PracticalTask: { lessonId: string; review?: boolean };
  LessonQuiz: { lessonId: string; review?: boolean; spacedReview?: boolean };
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
  LearningOnboarding: undefined;
  MicroLesson: { lessonId: string; review?: boolean };
  PracticalTask: { lessonId: string; review?: boolean };
  LessonQuiz: { lessonId: string; review?: boolean; spacedReview?: boolean };
  LearningChallenge: { challengeId: string; review?: boolean };
  LearningReview: undefined;
  LegacyCatalog: undefined;
  CourseDetail: { courseId: number };
};
