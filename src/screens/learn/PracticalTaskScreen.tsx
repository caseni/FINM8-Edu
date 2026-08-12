import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LearningFlowHeader, PracticalTaskPlayer } from '../../components/learning';
import { BeginnerPracticalTaskPlayer } from '../../components/learning/BeginnerPracticalTaskPlayer';
import { BEGINNER_SECTIONS } from '../../domain/learning/beginnerJourney';
import { getMicroLessonById } from '../../domain/learning/catalog';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import { useLearningUiStore } from '../../store/useLearningUiStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PracticalTask'>;

const BEGINNER_LESSON_IDS = new Set(
  Object.values(BEGINNER_SECTIONS).flatMap((section) => [...section.lessonIds])
);

export function PracticalTaskScreen({ route, navigation }: Props) {
  const lesson = getMicroLessonById(route.params.lessonId);
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const presentationMode = useLearningUiStore((state) => state.presentationMode);
  const passPracticalTask = useLearningProgressStore((state) => state.passPracticalTask);
  const saveLessonCheckpoint = useLearningProgressStore((state) => state.saveLessonCheckpoint);

  useEffect(() => {
    if (lesson && !route.params.review) saveLessonCheckpoint(lesson.id, 'task');
  }, [lesson, route.params.review, saveLessonCheckpoint]);

  const returnToEntry = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Home');
  };

  if (!lesson) return <SafeAreaView style={styles.safeArea}><Text style={styles.error}>Ders bulunamadı.</Text></SafeAreaView>;

  const beginner = BEGINNER_LESSON_IDS.has(lesson.id);
  const reinforcementBlock = lesson.contentBlocks.find((block) => block.kind === 'visual');
  const commonProps = {
    task: lesson.practicalTask,
    language,
    presentationMode,
    completionLabel: route.params.review ? { tr: 'Önizlemeyi kapat', en: 'Close preview' } as const : undefined,
    onComplete: (passed: boolean) => {
      if (!passed) return;
      if (route.params.review) {
        returnToEntry();
        return;
      }
      passPracticalTask(lesson, new Date().toISOString());
      saveLessonCheckpoint(lesson.id, 'quiz');
      navigation.replace('LessonQuiz', { lessonId: lesson.id });
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LearningFlowHeader
        language={language}
        stage={2}
        onExit={returnToEntry}
      />
      {beginner ? (
        <BeginnerPracticalTaskPlayer
          {...commonProps}
          takeaway={lesson.takeaway}
          reinforcementVisual={reinforcementBlock && reinforcementBlock.kind === 'visual'
            ? { assetRef: reinforcementBlock.assetRef, alt: reinforcementBlock.alt }
            : undefined}
        />
      ) : (
        <PracticalTaskPlayer {...commonProps} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  error: { color: '#F8FAFC' },
});
