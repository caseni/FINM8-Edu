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
  const narrow = width < 380;
  const styles = createStyles(theme, wide, narrow);
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

const createStyles = (theme: LearningTheme, wide: boolean, narrow: boolean) => StyleSheet.create({
  layout: {
    width: '100%',
    flexDirection: wide ? 'row' : 'column',
    alignItems: 'stretch',
    gap: wide ? 26 : narrow ? 13 : 16,
  },
  copyPane: {
    flex: wide ? 0.95 : undefined,
    width: '100%',
    minWidth: 0,
    justifyContent: 'center',
    gap: wide ? 14 : narrow ? 9 : 11,
  },
  visualPane: {
    flex: wide ? 1.05 : undefined,
    width: '100%',
    maxWidth: wide ? undefined : 430,
    minWidth: 0,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: narrow ? 10 : 11,
    lineHeight: narrow ? 14 : 15,
    fontWeight: '900',
    letterSpacing: 0.9,
  },
  intro: {
    color: theme.colors.text,
    fontSize: wide ? 19 : narrow ? 15 : 16,
    lineHeight: wide ? 28 : narrow ? 22 : 24,
    fontWeight: '600',
  },
});
