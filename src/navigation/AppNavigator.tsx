import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { HomeScreen } from '../screens/home/HomeScreen';
import { CourseDetailScreen } from '../screens/course/CourseDetailScreen';
import { AcademyHomeScreen } from '../screens/learn/AcademyHomeScreen';
import { LearnLandingScreen } from '../screens/learn/LearnLandingScreen';
import { LearningOnboardingScreen } from '../screens/learn/LearningOnboardingScreen';
import { MicroLessonScreen } from '../screens/learn/MicroLessonScreen';
import { LessonQuizScreen } from '../screens/learn/LessonQuizScreen';
import { PracticalTaskScreen } from '../screens/learn/PracticalTaskScreen';
import { LearningChallengeScreen } from '../screens/learn/LearningChallengeScreen';
import { LearningReviewScreen } from '../screens/learn/LearningReviewScreen';
import { PublicLearnArticleScreen } from '../screens/learn/PublicLearnArticleScreen';
import { PublicLearnIndexScreen } from '../screens/learn/PublicLearnIndexScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  config: {
    screens: {
      Home: '',
      Academy: 'academy',
      PublicLearnIndex: 'learn',
      PublicLearn: 'learn/:slug',
      LearningOnboarding: 'onboarding',
      MicroLesson: 'lesson/:lessonId',
      PracticalTask: 'lesson/:lessonId/task',
      LessonQuiz: 'lesson/:lessonId/quiz',
      LearningChallenge: 'challenge/:challengeId',
      LearningReview: 'review',
      LegacyCatalog: 'legacy',
      CourseDetail: 'course/:courseId',
    },
  },
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366F1',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={LearnLandingScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Academy" component={AcademyHomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PublicLearnIndex" component={PublicLearnIndexScreen} options={{ headerShown: false, title: 'FINM8 Learn' }} />
        <Stack.Screen name="PublicLearn" component={PublicLearnArticleScreen} options={{ headerShown: false, title: 'FINM8 Learn' }} />
        <Stack.Screen name="LearningOnboarding" component={LearningOnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MicroLesson" component={MicroLessonScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PracticalTask" component={PracticalTaskScreen} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="LessonQuiz" component={LessonQuizScreen} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="LearningChallenge" component={LearningChallengeScreen} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="LearningReview" component={LearningReviewScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LegacyCatalog" component={HomeScreen} options={{ title: 'Eski Kurs Arşivi' }} />
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{
            title: 'Kurs Detayı',
            headerBackTitle: 'Geri',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
