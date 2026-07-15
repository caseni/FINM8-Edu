import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  LearningOnboarding: undefined;
  MicroLesson: { lessonId: string };
  PracticalTask: { lessonId: string };
  LessonQuiz: { lessonId: string };
  LearningChallenge: { challengeId: string };
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
  MicroLesson: { lessonId: string };
  PracticalTask: { lessonId: string };
  LessonQuiz: { lessonId: string };
  LearningChallenge: { challengeId: string };
  LegacyCatalog: undefined;
  CourseDetail: { courseId: number };
};
