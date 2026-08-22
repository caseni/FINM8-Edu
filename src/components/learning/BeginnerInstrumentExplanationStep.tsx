import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import { BeginnerInstrumentMeaningMap } from './BeginnerInstrumentMeaningMap';
import { LessonSupportingVisual } from './LessonSupportingVisual';

export interface BeginnerInstrumentExplanationStepProps {
  language: LearningLanguage;
  assetRef: string;
  alt: string;
  theme?: LearningTheme;
}

export function BeginnerInstrumentExplanationStep({
  language,
  assetRef,
  alt,
  theme = defaultLearningTheme,
}: BeginnerInstrumentExplanationStepProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const styles = createStyles(theme, wide);
  const tr = language === 'tr';

  return (
    <View style={styles.layout}>
      <View style={styles.copyPane}>
        <Text style={styles.eyebrow}>{tr ? 'KISA MANTIK' : 'CORE IDEA'}</Text>
        <Text style={styles.intro}>
          {tr
            ? 'Hayır. Bu dört araç dört farklı şeyi temsil eder.'
            : 'No. These four instruments represent four different things.'}
        </Text>
        <BeginnerInstrumentMeaningMap language={language} theme={theme} />
      </View>

      <View style={styles.visualPane}>
        <LessonSupportingVisual
          assetRef={assetRef}
          alt={alt}
          language={language}
          role="concept"
          theme={theme}
        />
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean) => StyleSheet.create({
  layout: {
    width: '100%',
    flexDirection: wide ? 'row' : 'column',
    alignItems: 'stretch',
    gap: wide ? 26 : 16,
  },
  copyPane: {
    flex: wide ? 0.95 : undefined,
    minWidth: 0,
    justifyContent: 'center',
    gap: wide ? 14 : 11,
  },
  visualPane: {
    flex: wide ? 1.05 : undefined,
    minWidth: 0,
    justifyContent: 'center',
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '900',
    letterSpacing: 0.9,
  },
  intro: {
    color: theme.colors.text,
    fontSize: wide ? 19 : 16,
    lineHeight: wide ? 28 : 24,
    fontWeight: '600',
  },
});
