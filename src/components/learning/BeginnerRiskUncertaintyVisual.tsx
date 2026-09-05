import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

export interface BeginnerRiskUncertaintyVisualProps {
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

const artwork: Record<LessonSupportingVisualRole, ImageSourcePropType> = {
  hook: require('../../../assets/learning/beginner/risk/risk-uncertainty-hook.svg'),
  concept: require('../../../assets/learning/beginner/risk/risk-uncertainty-concept.svg'),
  practice: require('../../../assets/learning/beginner/risk/risk-uncertainty-practice.svg'),
  misconception: require('../../../assets/learning/beginner/risk/risk-uncertainty-misconception.svg'),
  risk: require('../../../assets/learning/beginner/risk/risk-uncertainty-misconception.svg'),
  summary: require('../../../assets/learning/beginner/risk/risk-uncertainty-summary.svg'),
};

/**
 * The first risk lesson is intentionally diagram-first: one decision, an
 * uncertainty field and possible outcomes. No character crowd and no paired
 * dashboard cards are needed to explain the idea.
 */
export function BeginnerRiskUncertaintyVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerRiskUncertaintyVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const styles = createStyles(theme, wide);

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {Platform.OS === 'web' ? (
        <Image source={artwork[role]} resizeMode="contain" style={styles.image} />
      ) : (
        <NativeRiskScene role={role} styles={styles} />
      )}
      <Text style={styles.hiddenContext} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {language === 'tr' ? 'Karar, belirsizlik ve olası sonuç akışı' : 'Decision, uncertainty and possible outcome flow'}
      </Text>
    </View>
  );
}

type SceneStyles = ReturnType<typeof createStyles>;

function NativeRiskScene({ role, styles }: { role: LessonSupportingVisualRole; styles: SceneStyles }) {
  const misconception = role === 'misconception' || role === 'risk';
  const concept = role === 'concept';
  const summary = role === 'summary';

  if (misconception) {
    return (
      <>
        <View style={styles.glow} />
        <View style={[styles.node, styles.zeroNode]}><Text style={styles.nodeText}>0</Text></View>
        <Text style={styles.notEqual}>≠</Text>
        <View style={[styles.uncertaintyRing, styles.uncertaintyRight]}><Text style={styles.question}>?</Text></View>
        <View style={[styles.branch, styles.branchUpRight]} />
        <View style={[styles.branch, styles.branchDownRight]} />
      </>
    );
  }

  return (
    <>
      <View style={styles.glow} />
      <View style={[styles.node, styles.decisionNode]}><Text style={styles.arrow}>→</Text></View>
      <View style={styles.stem} />
      <View style={styles.uncertaintyRing}><Text style={styles.question}>?</Text></View>
      {concept ? <View style={styles.cone} /> : null}
      <View style={[styles.branch, styles.branchUp]} />
      <View style={[styles.branch, styles.branchMid]} />
      <View style={[styles.branch, styles.branchDown]} />
      <View style={[styles.outcome, styles.outcomeGood]} />
      <View style={[styles.outcome, styles.outcomeNeutral]} />
      <View style={[styles.outcome, styles.outcomeBad]} />
      {concept ? <Text style={styles.lossValue}>−500</Text> : null}
      {summary ? <View style={styles.summaryPulse} /> : null}
    </>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean) => StyleSheet.create({
  shell: {
    width: '100%',
    maxWidth: wide ? 620 : 460,
    aspectRatio: 1.5,
    alignSelf: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#071522',
  },
  image: { width: '100%', height: '100%' },
  glow: {
    position: 'absolute',
    width: '62%',
    aspectRatio: 1,
    left: '23%',
    top: '-8%',
    borderRadius: 999,
    backgroundColor: 'rgba(71, 215, 195, 0.07)',
  },
  node: {
    position: 'absolute',
    width: wide ? 46 : 38,
    height: wide ? 46 : 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E3B3F',
    borderWidth: 2,
    borderColor: '#47D7C3',
  },
  decisionNode: { left: '19%', top: '48%' },
  zeroNode: { left: '28%', top: '52%', backgroundColor: '#172C3A', borderColor: '#718894' },
  nodeText: { color: '#DCE8EC', fontSize: wide ? 21 : 17, fontWeight: '900' },
  arrow: { color: '#8AEADD', fontSize: wide ? 25 : 20, lineHeight: wide ? 28 : 23, fontWeight: '900' },
  stem: {
    position: 'absolute', left: '27%', top: '54%', width: '20%', height: 5,
    borderRadius: 999, backgroundColor: '#47D7C3',
  },
  uncertaintyRing: {
    position: 'absolute', left: '46%', top: '43%', width: wide ? 72 : 58, height: wide ? 72 : 58,
    borderRadius: 999, borderWidth: 3, borderStyle: 'dashed', borderColor: '#47D7C3',
    alignItems: 'center', justifyContent: 'center',
  },
  uncertaintyRight: { left: '62%', top: '48%' },
  question: { color: '#E8F4F5', fontSize: wide ? 30 : 24, fontWeight: '900' },
  cone: {
    position: 'absolute', left: '55%', top: '31%', width: '28%', height: '46%',
    borderLeftWidth: 2, borderTopWidth: 2, borderBottomWidth: 2,
    borderStyle: 'dashed', borderColor: '#456D7D', opacity: 0.34,
  },
  branch: { position: 'absolute', height: 4, borderRadius: 999, backgroundColor: '#718894' },
  branchUp: { left: '57%', top: '42%', width: '20%', transform: [{ rotate: '-25deg' }], backgroundColor: '#47D7C3' },
  branchMid: { left: '57%', top: '54%', width: '22%' },
  branchDown: { left: '57%', top: '66%', width: '20%', transform: [{ rotate: '25deg' }], backgroundColor: '#C78E79' },
  branchUpRight: { left: '71%', top: '42%', width: '17%', transform: [{ rotate: '-28deg' }], backgroundColor: '#47D7C3' },
  branchDownRight: { left: '71%', top: '66%', width: '17%', transform: [{ rotate: '28deg' }], backgroundColor: '#C78E79' },
  outcome: { position: 'absolute', right: '15%', width: wide ? 22 : 18, height: wide ? 22 : 18, borderRadius: 999 },
  outcomeGood: { top: '31%', backgroundColor: '#8AEADD' },
  outcomeNeutral: { top: '51%', backgroundColor: '#718894' },
  outcomeBad: { top: '71%', backgroundColor: '#D0A08D' },
  lossValue: { position: 'absolute', right: '8%', bottom: '10%', color: '#DAB09F', fontSize: wide ? 20 : 16, fontWeight: '900' },
  notEqual: { position: 'absolute', left: '47%', top: '50%', color: '#91A6B0', fontSize: wide ? 34 : 28, fontWeight: '900' },
  summaryPulse: {
    position: 'absolute', right: '13%', top: '26%', width: wide ? 84 : 68, height: wide ? 84 : 68,
    borderRadius: 999, borderWidth: 2, borderColor: 'rgba(71, 215, 195, 0.3)',
  },
  hiddenContext: { position: 'absolute', width: 1, height: 1, opacity: 0 },
});
