import React from 'react';
import { Image, Platform, StyleSheet, Text, useWindowDimensions, View, type ImageSourcePropType } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type CoreChartTopic = 'candle' | 'timeframe' | 'trend';
type Props = { assetRef: string; alt: string; language: LearningLanguage; role: LessonSupportingVisualRole; theme?: LearningTheme };
type ArtworkSet = Record<LessonSupportingVisualRole, ImageSourcePropType>;

const artwork: Record<CoreChartTopic, ArtworkSet> = {
  candle: {
    hook: require('../../../assets/learning/beginner/charts/candle-hook.svg'), concept: require('../../../assets/learning/beginner/charts/candle-concept.svg'), practice: require('../../../assets/learning/beginner/charts/candle-practice.svg'), misconception: require('../../../assets/learning/beginner/charts/candle-misconception.svg'), risk: require('../../../assets/learning/beginner/charts/candle-misconception.svg'), summary: require('../../../assets/learning/beginner/charts/candle-summary.svg'),
  },
  timeframe: {
    hook: require('../../../assets/learning/beginner/charts/timeframe-hook.svg'), concept: require('../../../assets/learning/beginner/charts/timeframe-concept.svg'), practice: require('../../../assets/learning/beginner/charts/timeframe-practice.svg'), misconception: require('../../../assets/learning/beginner/charts/timeframe-misconception.svg'), risk: require('../../../assets/learning/beginner/charts/timeframe-misconception.svg'), summary: require('../../../assets/learning/beginner/charts/timeframe-summary.svg'),
  },
  trend: {
    hook: require('../../../assets/learning/beginner/charts/trend-hook.svg'), concept: require('../../../assets/learning/beginner/charts/trend-concept.svg'), practice: require('../../../assets/learning/beginner/charts/trend-practice.svg'), misconception: require('../../../assets/learning/beginner/charts/trend-misconception.svg'), risk: require('../../../assets/learning/beginner/charts/trend-misconception.svg'), summary: require('../../../assets/learning/beginner/charts/trend-summary.svg'),
  },
};

function topicForAsset(assetRef: string): CoreChartTopic | undefined {
  if (assetRef.includes('bir-mum-bize-ne-soyler')) return 'candle';
  if (assetRef.includes('zaman-dilimi-neyi-degistirir')) return 'timeframe';
  if (assetRef.includes('trend-yon-mu-yapi-mi')) return 'trend';
  return undefined;
}

export function isBeginnerCoreChartStoryAsset(assetRef: string): boolean { return Boolean(topicForAsset(assetRef)); }

export function BeginnerCoreChartStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: Props) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const { width } = useWindowDimensions();
  const compact = width < 520;
  const styles = createStyles(theme, compact);
  if (Platform.OS === 'web') return <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}><Image source={artwork[topic][role]} style={styles.artwork} resizeMode="contain" accessible={false} /></View>;
  return <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}><NativeChart topic={topic} role={role} language={language} styles={styles} /></View>;
}

function NativeChart({ topic, role, language, styles }: { topic: CoreChartTopic; role: LessonSupportingVisualRole; language: LearningLanguage; styles: ReturnType<typeof createStyles> }) {
  const tr = language === 'tr';
  const isWarning = role === 'misconception' || role === 'risk';
  if (topic === 'candle') return <View style={styles.centerScene}><View style={styles.candleRow}>{[true, true, false, true, false].map((up, index) => <View key={index} style={styles.candleWrap}><View style={styles.wick} /><View style={[styles.candleBody, up ? styles.up : styles.down, index === 2 && styles.tallBody]} /><View style={styles.wick} /></View>)}</View>{role === 'concept' || role === 'practice' ? <Text style={styles.micro}>106 · 104 · 100 · 98</Text> : null}{isWarning ? <Text style={styles.question}>?</Text> : null}</View>;
  if (topic === 'timeframe') return <View style={styles.splitScene}><NativeBars values={[68, 56, 46, 38, 31]} down styles={styles} /><View style={styles.divider} /><NativeBars values={[28, 38, 47, 58, 70]} styles={styles} /><View style={styles.scaleLabels}><Text style={styles.micro}>15m</Text><Text style={styles.micro}>1D</Text></View></View>;
  return <View style={styles.centerScene}><NativeBars values={isWarning ? [70, 61, 51, 42, 34, 47] : [28, 52, 39, 65, 51, 76]} down={isWarning} styles={styles} /><Text style={styles.micro}>{tr ? 'YAPI' : 'STRUCTURE'}</Text></View>;
}

function NativeBars({ values, down = false, styles }: { values: number[]; down?: boolean; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.bars}>{values.map((height, index) => <View key={`${height}.${index}`} style={styles.barSlot}><View style={[styles.bar, { height }, down && styles.barDown]} /></View>)}</View>;
}

const createStyles = (theme: LearningTheme, compact: boolean) => StyleSheet.create({
  shell: { width: '100%', maxWidth: 620, aspectRatio: 1.5, alignSelf: 'center', borderRadius: compact ? 16 : 18, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: '#071522', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  artwork: { width: '100%', height: '100%' }, centerScene: { width: '88%', height: '78%', alignItems: 'center', justifyContent: 'center', gap: 14 }, splitScene: { width: '88%', height: '76%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, position: 'relative' }, candleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '84%' }, candleWrap: { width: 28, alignItems: 'center' }, wick: { width: 3, height: compact ? 16 : 22, backgroundColor: '#8297A3' }, candleBody: { width: compact ? 17 : 22, height: compact ? 44 : 58, borderRadius: 5 }, tallBody: { height: compact ? 62 : 78 }, up: { backgroundColor: '#55CDBF' }, down: { backgroundColor: '#A76561' }, bars: { flex: 1, height: '72%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: 5 }, barSlot: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' }, bar: { width: '70%', minWidth: 8, maxWidth: 24, borderRadius: 6, backgroundColor: '#55CDBF' }, barDown: { backgroundColor: '#A76561' }, divider: { width: 2, height: '68%', backgroundColor: '#29465A' }, scaleLabels: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-around' }, micro: { color: '#91A7B4', fontSize: compact ? 10 : 12, fontWeight: '800', letterSpacing: 0.4 }, question: { color: '#DCE8EC', fontSize: compact ? 38 : 48, fontWeight: '900' },
});
