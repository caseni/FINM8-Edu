import React from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LessonPlayer } from '../../components/learning';
import { getMicroLessonById } from '../../domain/learning/catalog';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import { useLearningUiStore } from '../../store/useLearningUiStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MicroLesson'>;

export function MicroLessonScreen({ route, navigation }: Props) {
  const lesson = getMicroLessonById(route.params.lessonId);
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const presentationMode = useLearningUiStore((state) => state.presentationMode);
  const completeLesson = useLearningProgressStore((state) => state.completeLesson);

  if (!lesson) return <View><Text>Ders bulunamadı.</Text></View>;

  return (
    <LessonPlayer
      lesson={lesson}
      language={language}
      presentationMode={presentationMode}
      onExit={() => navigation.goBack()}
      onStartAssessment={() => {
        completeLesson(lesson, new Date().toISOString());
        navigation.replace('LessonQuiz', { lessonId: lesson.id });
      }}
    />
  );
}

