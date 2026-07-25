import React from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LessonPlayer } from '../../components/learning';
import { getMicroLessonById } from '../../domain/learning/catalog';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningUiStore } from '../../store/useLearningUiStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MicroLesson'>;

export function MicroLessonScreen({ route, navigation }: Props) {
  const lesson = getMicroLessonById(route.params.lessonId);
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const presentationMode = useLearningUiStore((state) => state.presentationMode);
  const checkpoint = useLearningProgressStore((state) => state.lessonCheckpoints[route.params.lessonId]);
  const saveLessonCheckpoint = useLearningProgressStore((state) => state.saveLessonCheckpoint);
  const completeCurrentQuizReview = useLearningProgressStore(
    (state) => state.completeCurrentQuizReview
  );
  const currentQuizReview = route.params.currentQuizReview;
  const isReadOnlyReview = route.params.review || Boolean(currentQuizReview);

  if (!lesson) return <View><Text>Ders bulunamadı.</Text></View>;

  return (
    <LessonPlayer
      lesson={lesson}
      language={language}
      presentationMode={presentationMode}
      initialStepIndex={isReadOnlyReview ? 0 : checkpoint?.stepIndex ?? 0}
      onStepChange={(stepIndex) => {
        if (!isReadOnlyReview) saveLessonCheckpoint(lesson.id, 'lesson', stepIndex);
      }}
      assessmentLabel={
        currentQuizReview
          ? { tr: 'Tekrarı tamamla', en: 'Complete review' }
          : route.params.review
            ? { tr: 'Önizlemeyi kapat', en: 'Close preview' }
            : undefined
      }
      onExit={() => navigation.goBack()}
      onStartAssessment={() => {
        if (currentQuizReview) {
          completeCurrentQuizReview({
            conceptKey: currentQuizReview.conceptKey,
            lessonId: lesson.id,
            reviewedEvidenceThroughAt:
              currentQuizReview.reviewedEvidenceThroughAt,
            completedAt: new Date().toISOString(),
          });
          navigation.goBack();
          return;
        }
        if (route.params.review) {
          navigation.goBack();
          return;
        }
        saveLessonCheckpoint(lesson.id, 'task', checkpoint?.stepIndex ?? 0);
        navigation.replace('PracticalTask', { lessonId: lesson.id });
      }}
    />
  );
}
