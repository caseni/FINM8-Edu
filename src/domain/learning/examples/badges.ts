import type { LearningBadge } from '../types';

export const INITIAL_BADGES: readonly LearningBadge[] = [
  {
    id: 'badge.first-proof',
    title: { tr: 'İlk Kanıt', en: 'First Proof' },
    description: {
      tr: 'İlk mikro dersi, grafik görevini ve quizini başarıyla tamamla.',
      en: 'Complete your first micro lesson, chart task, and quiz.',
    },
    credentialType: 'learning_achievement',
    definitionVersion: '0.1.0',
    requirements: [
      {
        kind: 'lesson_completion',
        targetId: 'lesson.market-structure.bos.001',
        threshold: 1,
      },
      {
        kind: 'practical_task',
        targetId: 'task.bos.001',
        threshold: 1,
      },
      {
        kind: 'quiz_accuracy',
        targetId: 'quiz.bos.001',
        threshold: 67,
      },
    ],
    disclaimer: {
      tr: 'Bu badge bir öğrenme başarısıdır; sertifika veya mesleki yeterlilik değildir.',
      en: 'This badge is a learning achievement, not a certificate or professional qualification.',
    },
  },
  {
    id: 'badge.market-literacy.foundation',
    title: { tr: 'Piyasa Temelleri', en: 'Market Foundations' },
    description: {
      tr: 'Piyasa okuryazarlığı başlangıç challenge’ını başarıyla tamamla.',
      en: 'Complete the foundation market-literacy challenge.',
    },
    credentialType: 'learning_achievement',
    definitionVersion: '0.1.0',
    requirements: [
      {
        kind: 'challenge_completion',
        targetId: 'challenge.market-literacy.foundation',
        threshold: 1,
      },
    ],
    disclaimer: {
      tr: 'Bu badge bir öğrenme başarısıdır; sertifika veya mesleki yeterlilik değildir.',
      en: 'This badge is a learning achievement, not a certificate or professional qualification.',
    },
  },
  {
    id: 'badge.risk-guardian.foundation',
    title: { tr: 'Risk Koruyucusu', en: 'Risk Guardian' },
    description: {
      tr: 'Temel risk görevlerini ve final challenge’ını tamamla.',
      en: 'Complete the foundation risk tasks and final challenge.',
    },
    credentialType: 'learning_achievement',
    definitionVersion: '0.1.0',
    requirements: [
      {
        kind: 'challenge_completion',
        targetId: 'challenge.risk.foundation',
        threshold: 1,
      },
    ],
    disclaimer: {
      tr: 'Bu badge bir öğrenme başarısıdır; sertifika veya mesleki yeterlilik değildir.',
      en: 'This badge is a learning achievement, not a certificate or professional qualification.',
    },
  },
  {
    id: 'badge.evidence-detective.foundation',
    title: { tr: 'Kanıt Dedektifi', en: 'Evidence Detective' },
    description: {
      tr: 'Kanıt kalitesi becerisinde en az %75 ustalık göster.',
      en: 'Demonstrate at least 75% mastery in evidence quality.',
    },
    credentialType: 'learning_achievement',
    definitionVersion: '0.1.0',
    requirements: [
      {
        kind: 'mastery',
        targetId: 'skill.evidence-literacy',
        threshold: 75,
      },
    ],
    disclaimer: {
      tr: 'Bu badge bir öğrenme başarısıdır; sertifika veya mesleki yeterlilik değildir.',
      en: 'This badge is a learning achievement, not a certificate or professional qualification.',
    },
  },
];
