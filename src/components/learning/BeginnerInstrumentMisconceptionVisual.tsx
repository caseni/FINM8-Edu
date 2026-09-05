import React from 'react';
import { Image, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface BeginnerInstrumentMisconceptionVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

/**
 * One identical chart can belong to very different products. The scene starts
 * from one chart and branches into two identities rather than comparing two
 * chart cards side by side.
 */
export function BeginnerInstrumentMisconceptionVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: BeginnerInstrumentMisconceptionVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const styles = createStyles(theme, wide);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {Platform.OS === 'web' ? (
        <Image
          source={require('../../../assets/learning/beginner/markets/instrument-types-misconception.svg')}
          resizeMode="contain"
          style={styles.webImage}
        />
      ) : (
        <NativeMisconceptionScene styles={styles} />
      )}
      <Text style={[styles.label, styles.stockLabel]}>{tr ? 'HİSSE' : 'STOCK'}</Text>
      <Text style={[styles.label, styles.goldLabel]}>{tr ? 'ALTIN' : 'GOLD'}</Text>
      <View style={styles.qaMarkers} pointerEvents="none">
        <View style={styles.qaMarker} accessibilityLabel="instrument-misconception-stock" />
        <View style={styles.qaMarker} accessibilityLabel="instrument-misconception-gold" />
      </View>
    </View>
  );
}

function NativeMisconceptionScene({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return (
    <>
      <View style={styles.glow} />
      <View style={styles.chart}>
        <View style={styles.chartAxisY} />
        <View style={styles.chartAxisX} />
        <View style={[styles.chartPoint, styles.chartPointOne]} />
        <View style={[styles.chartPoint, styles.chartPointTwo]} />
        <View style={[styles.chartPoint, styles.chartPointThree]} />
        <View style={[styles.chartLine, styles.chartLineOne]} />
        <View style={[styles.chartLine, styles.chartLineTwo]} />
      </View>
      <View style={styles.branchStem} />
      <View style={[styles.branchLine, styles.branchLeft]} />
      <View style={[styles.branchLine, styles.branchRight]} />
      <View style={styles.companyIcon}>
        <View style={styles.companyRoof} />
        <View style={styles.companyBody}>
          <View style={styles.windowRow}><View style={styles.window} /><View style={styles.window} /></View>
        </View>
      </View>
      <View style={styles.goldIcon}>
        <View style={styles.goldBar} />
        <View style={[styles.goldBar, styles.goldBarShift]} />
      </View>
      <Text style={styles.notEqual}>≠</Text>
    </>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean) => StyleSheet.create({
  shell: {
    width: '100%',
    maxWidth: wide ? 620 : 460,
    aspectRatio: 1.5,
    alignSelf: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#071522',
  },
  webImage: { width: '100%', height: '100%' },
  glow: {
    position: 'absolute',
    width: '66%',
    aspectRatio: 1,
    left: '17%',
    top: '-14%',
    borderRadius: 999,
    backgroundColor: 'rgba(71, 215, 195, 0.06)',
  },
  chart: { position: 'absolute', left: '32%', top: '14%', width: '36%', height: '27%' },
  chartAxisY: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: 2, backgroundColor: '#355365' },
  chartAxisX: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, borderRadius: 2, backgroundColor: '#355365' },
  chartPoint: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: '#47D7C3' },
  chartPointOne: { left: '12%', bottom: '23%' },
  chartPointTwo: { left: '48%', bottom: '55%' },
  chartPointThree: { right: '7%', top: '8%' },
  chartLine: { position: 'absolute', height: 5, borderRadius: 3, backgroundColor: '#47D7C3' },
  chartLineOne: { left: '14%', bottom: '40%', width: '42%', transform: [{ rotate: '-24deg' }] },
  chartLineTwo: { left: '50%', top: '31%', width: '43%', transform: [{ rotate: '-27deg' }] },
  branchStem: { position: 'absolute', left: '49.7%', top: '42%', width: 3, height: '10%', backgroundColor: '#31586B' },
  branchLine: { position: 'absolute', top: '53%', width: '25%', height: 3, borderRadius: 2, backgroundColor: '#31586B' },
  branchLeft: { left: '26%', transform: [{ rotate: '-22deg' }] },
  branchRight: { right: '26%', transform: [{ rotate: '22deg' }] },
  companyIcon: { position: 'absolute', left: '23%', bottom: '18%', width: wide ? 76 : 58, height: wide ? 76 : 58, alignItems: 'center', justifyContent: 'center' },
  companyRoof: { width: 0, height: 0, borderLeftWidth: wide ? 26 : 20, borderRightWidth: wide ? 26 : 20, borderBottomWidth: wide ? 17 : 13, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#7894A6' },
  companyBody: { width: wide ? 50 : 39, height: wide ? 31 : 24, paddingHorizontal: 8, paddingTop: 7, backgroundColor: '#405E72' },
  windowRow: { flexDirection: 'row', justifyContent: 'space-between' },
  window: { width: wide ? 9 : 7, height: wide ? 7 : 5, borderRadius: 1, backgroundColor: '#B5CBD4' },
  goldIcon: { position: 'absolute', right: '23%', bottom: '18%', width: wide ? 76 : 58, height: wide ? 76 : 58, alignItems: 'center', justifyContent: 'center' },
  goldBar: { width: wide ? 60 : 46, height: wide ? 19 : 14, borderRadius: 4, backgroundColor: '#B58A42', transform: [{ skewX: '-12deg' }] },
  goldBarShift: { marginTop: -3, marginLeft: 8, backgroundColor: '#8E6E37' },
  notEqual: { position: 'absolute', left: '47%', bottom: '25%', color: '#47D7C3', fontSize: wide ? 32 : 25, fontWeight: '900' },
  label: { position: 'absolute', bottom: '8%', color: '#D2E1E6', fontSize: wide ? 12 : 9, fontWeight: '900', letterSpacing: 0.4, textAlign: 'center' },
  stockLabel: { left: '17%', width: '25%' },
  goldLabel: { right: '17%', width: '25%' },
  qaMarkers: { position: 'absolute', width: 1, height: 1, left: 0, top: 0, opacity: 0 },
  qaMarker: { width: 1, height: 1 },
});
