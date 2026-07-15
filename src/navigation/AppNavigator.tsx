import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { HomeScreen } from '../screens/home/HomeScreen';
import { CourseDetailScreen } from '../screens/course/CourseDetailScreen';
import { LearnHomeScreen } from '../screens/learn/LearnHomeScreen';
import { LearningOnboardingScreen } from '../screens/learn/LearningOnboardingScreen';
import { MicroLessonScreen } from '../screens/learn/MicroLessonScreen';
import { LessonQuizScreen } from '../screens/learn/LessonQuizScreen';
import { PracticalTaskScreen } from '../screens/learn/PracticalTaskScreen';
import { LearningChallengeScreen } from '../screens/learn/LearningChallengeScreen';
import { LearningReviewScreen } from '../screens/learn/LearningReviewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
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
          component={LearnHomeScreen}
          options={{
            headerShown: false,
          }}
        />
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
