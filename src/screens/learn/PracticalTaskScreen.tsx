import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PracticalTaskPlayer } from '../../components/learning';
import { getMicroLessonById } from '../../domain/learning/catalog';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import { useLearningUiStore } from '../../store/useLearningUiStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PracticalTask'>;

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

  if (!lesson) return <SafeAreaView style={styles.safeArea}><Text style={styles.error}>Ders bulunamadı.</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PracticalTaskPlayer
          task={lesson.practicalTask}
          language={language}
          presentationMode={presentationMode}
          completionLabel={route.params.review ? { tr: 'Önizlemeyi kapat', en: 'Close preview' } : undefined}
          onComplete={(passed) => {
            if (!passed) return;
            if (route.params.review) {
              navigation.goBack();
              return;
            }
            passPracticalTask(lesson, new Date().toISOString());
            saveLessonCheckpoint(lesson.id, 'quiz');
            navigation.replace('LessonQuiz', { lessonId: lesson.id });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  content: { flexGrow: 1, justifyContent: 'center', width: '100%', padding: 16 },
  error: { color: '#F8FAFC' },
});
