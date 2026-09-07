import React from 'react';
import { Image, Platform, StyleSheet, Text, useWindowDimensions, View, type ImageSourcePropType } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import { BeginnerEditorialImageVisual, hasBeginnerEditorialImage } from './BeginnerEditorialImageVisual';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic = 'zones' | 'momentum' | 'average';
type Props = { assetRef: string; alt: string; language: LearningLanguage; role: LessonSupportingVisualRole; theme?: LearningTheme };
type ArtworkSet = Record<LessonSupportingVisualRole, ImageSourcePropType>;
const artwork: Record<Topic, ArtworkSet> = {
  zones: { hook: require('../../../assets/learning/beginner/charts/zones-hook.svg'), concept: require('../../../assets/learning/beginner/charts/zones-concept.svg'), practice: require('../../../assets/learning/beginner/charts/zones-practice.svg'), misconception: require('../../../assets/learning/beginner/charts/zones-misconception.svg'), risk: require('../../../assets/learning/beginner/charts/zones-misconception.svg'), summary: require('../../../assets/learning/beginner/charts/zones-summary.svg') },
  momentum: { hook: require('../../../assets/learning/beginner/charts/momentum-hook.svg'), concept: require('../../../assets/learning/beginner/charts/momentum-concept.svg'), practice: require('../../../assets/learning/beginner/charts/momentum-practice.svg'), misconception: require('../../../assets/learning/beginner/charts/momentum-misconception.svg'), risk: require('../../../assets/learning/beginner/charts/momentum-misconception.svg'), summary: require('../../../assets/learning/beginner/charts/momentum-summary.svg') },
  average: { hook: require('../../../assets/learning/beginner/charts/average-hook.svg'), concept: require('../../../assets/learning/beginner/charts/average-concept.svg'), practice: require('../../../assets/learning/beginner/charts/average-practice.svg'), misconception: require('../../../assets/learning/beginner/charts/average-misconception.svg'), risk: require('../../../assets/learning/beginner/charts/average-misconception.svg'), summary: require('../../../assets/learning/beginner/charts/average-summary.svg') },
};
function topicForAsset(assetRef: string): Topic | undefined { if (assetRef.includes('destek-direnc-bolgedir')) return 'zones'; if (assetRef.includes('momentum-ne-anlatir')) return 'momentum'; if (assetRef.includes('hareketli-ortalama-ne-yapar')) return 'average'; return undefined; }
export function isBeginnerAppliedChartStoryAsset(assetRef: string): boolean { return Boolean(topicForAsset(assetRef)); }
export function BeginnerAppliedChartStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: Props) {
  const topic = topicForAsset(assetRef); if (!topic) return null; const { width } = useWindowDimensions(); const compact = width < 520; const styles = createStyles(theme, compact);
  // Canonical physical rendering path: when a role has a real editorial image
  // registered, defer to the shared BeginnerEditorialImageVisual (same component
  // Markets/Economy use) instead of the SVG/native scene fallback below.
  if (hasBeginnerEditorialImage(assetRef, role)) {
    return (
      <View style={{ width: '100%', maxWidth: 620, alignSelf: 'center' }}>
        <BeginnerEditorialImageVisual assetRef={assetRef} alt={alt} role={role} theme={theme} />
      </View>
    );
  }
  if (Platform.OS === 'web') return <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}><Image source={artwork[topic][role]} style={styles.artwork} resizeMode="contain" accessible={false} /></View>;
  return <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}><NativeScene topic={topic} role={role} language={language} styles={styles} /></View>;
}
function NativeScene({ topic, role, language, styles }: { topic: Topic; role: LessonSupportingVisualRole; language: LearningLanguage; styles: ReturnType<typeof createStyles> }) {
  const tr = language === 'tr'; const warning = role === 'misconception' || role === 'risk';
  if (topic === 'zones') return <View style={styles.stage}><View style={[styles.zoneBand, styles.resistance]} /><NativePath values={warning ? [35, 60, 42, 65, 48, 76] : [32, 62, 40, 66, 38, 63]} styles={styles} muted={warning} /><View style={[styles.zoneBand, styles.support]} /></View>;
  if (topic === 'momentum') return <View style={styles.stage}><NativePath values={warning ? [24, 48, 72, 84, 88, 90] : [20, 34, 52, 70, 86]} styles={styles} />{warning ? <Text style={styles.question}>?</Text> : <View style={styles.meter}><View style={styles.meterFill} /></View>}</View>;
  return <View style={styles.stage}><NativePath values={[28, 57, 39, 66, 48, 74, 58]} styles={styles} muted /><View style={styles.averageLine} />{warning ? <Text style={styles.question}>?</Text> : role === 'concept' ? <Text style={styles.micro}>{tr ? 'GEÇMİŞ → ORTALAMA' : 'PAST → AVERAGE'}</Text> : null}</View>;
}
function NativePath({ values, muted = false, styles }: { values: number[]; muted?: boolean; styles: ReturnType<typeof createStyles> }) { return <View style={styles.path}>{values.map((height, index) => <View key={`${height}.${index}`} style={styles.pathSlot}><View style={[styles.pathBar, { height }, muted && styles.pathMuted]} /></View>)}</View>; }
const createStyles = (theme: LearningTheme, compact: boolean) => StyleSheet.create({
  shell: { width: '100%', maxWidth: 620, aspectRatio: 1.5, alignSelf: 'center', borderRadius: compact ? 16 : 18, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: '#071522', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }, artwork: { width: '100%', height: '100%' }, stage: { width: '88%', height: '76%', alignItems: 'center', justifyContent: 'center', position: 'relative', gap: 10 }, zoneBand: { position: 'absolute', left: 0, right: 0, height: compact ? 34 : 44, borderRadius: 18 }, resistance: { top: '10%', backgroundColor: 'rgba(167,101,97,0.16)' }, support: { bottom: '10%', backgroundColor: 'rgba(85,205,191,0.16)' }, path: { width: '100%', height: '72%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: 5, zIndex: 2 }, pathSlot: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' }, pathBar: { width: '68%', minWidth: 8, maxWidth: 24, borderRadius: 6, backgroundColor: '#55CDBF' }, pathMuted: { backgroundColor: '#6F8796' }, meter: { width: '72%', height: compact ? 20 : 26, borderRadius: 20, backgroundColor: '#203B4A', overflow: 'hidden' }, meterFill: { width: '68%', height: '100%', borderRadius: 20, backgroundColor: '#55CDBF' }, averageLine: { position: 'absolute', left: '8%', right: '8%', top: '48%', height: 5, borderRadius: 5, backgroundColor: '#55CDBF', transform: [{ rotate: '-7deg' }] }, micro: { color: '#91A7B4', fontSize: compact ? 10 : 12, fontWeight: '800', letterSpacing: 0.3 }, question: { color: '#DCE8EC', fontSize: compact ? 38 : 48, fontWeight: '900' },
});
