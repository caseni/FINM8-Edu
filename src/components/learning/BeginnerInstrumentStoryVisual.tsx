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

type InstrumentKind = 'stock' | 'bond' | 'fx' | 'commodity';

type InstrumentLabel = {
  kind: InstrumentKind;
  tr: string;
  en: string;
};

const INSTRUMENTS: readonly InstrumentLabel[] = [
  { kind: 'stock', tr: 'HİSSE', en: 'STOCK' },
  { kind: 'bond', tr: 'TAHVİL', en: 'BOND' },
  { kind: 'fx', tr: 'DÖVİZ', en: 'FX' },
  { kind: 'commodity', tr: 'EMTİA', en: 'COMMODITY' },
] as const;

const instrumentSvgArtwork: Record<LessonSupportingVisualRole, ImageSourcePropType> = {
  hook: require('../../../assets/learning/beginner/markets/instrument-types-hook.svg'),
  concept: require('../../../assets/learning/beginner/markets/instrument-types-concept.svg'),
  practice: require('../../../assets/learning/beginner/markets/instrument-types-concept.svg'),
  misconception: require('../../../assets/learning/beginner/markets/instrument-types-concept.svg'),
  risk: require('../../../assets/learning/beginner/markets/instrument-types-concept.svg'),
  summary: require('../../../assets/learning/beginner/markets/instrument-types-summary.svg'),
};

export interface BeginnerInstrumentStoryVisualProps {
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

/**
 * Financial instruments share one visual field. Icons show the identity of the
 * thing being bought; short localized labels are layered outside the SVG so the
 * artwork stays language-neutral and avoids turning into a four-card dashboard.
 */
export function BeginnerInstrumentStoryVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerInstrumentStoryVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const styles = createStyles(theme, wide);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {Platform.OS === 'web' ? (
        <Image source={instrumentSvgArtwork[role]} resizeMode="contain" style={styles.webImage} />
      ) : (
        <NativeInstrumentField role={role} styles={styles} />
      )}
      <LocalizedLabels role={role} tr={tr} styles={styles} />
    </View>
  );
}

type SceneStyles = ReturnType<typeof createStyles>;

function LocalizedLabels({ role, tr, styles }: { role: LessonSupportingVisualRole; tr: boolean; styles: SceneStyles }) {
  if (role === 'hook') {
    return (
      <>
        <Text style={[styles.label, styles.hookLeftLabel]}>{tr ? 'HİSSE' : 'STOCK'}</Text>
        <Text style={[styles.label, styles.hookRightLabel]}>{tr ? 'EMTİA' : 'COMMODITY'}</Text>
      </>
    );
  }

  return (
    <>
      {INSTRUMENTS.map((item) => (
        <Text key={item.kind} style={[styles.label, styles[`${item.kind}Label`]]}>
          {tr ? item.tr : item.en}
        </Text>
      ))}
    </>
  );
}

function NativeInstrumentField({ role, styles }: { role: LessonSupportingVisualRole; styles: SceneStyles }) {
  if (role === 'hook') {
    return (
      <>
        <View style={styles.glow} />
        <View style={styles.hookRail} />
        <CompanyIcon styles={styles} style={styles.hookCompany} />
        <CommodityIcon styles={styles} style={styles.hookCommodity} />
        <View style={styles.hub}><View style={styles.hubCore} /></View>
        <Text style={styles.notEqual}>≠</Text>
      </>
    );
  }

  const summary = role === 'summary';
  return (
    <>
      <View style={styles.glow} />
      {summary ? <View style={styles.summaryRail} /> : null}
      {!summary ? (
        <>
          <View style={[styles.spoke, styles.spokeStock]} />
          <View style={[styles.spoke, styles.spokeBond]} />
          <View style={[styles.spoke, styles.spokeFx]} />
          <View style={[styles.spoke, styles.spokeCommodity]} />
        </>
      ) : null}
      <View style={styles.hub}><View style={styles.hubCore} /></View>
      <CompanyIcon styles={styles} style={summary ? styles.summaryStock : styles.stockIcon} />
      <BondIcon styles={styles} style={summary ? styles.summaryBond : styles.bondIcon} />
      <FxIcon styles={styles} style={summary ? styles.summaryFx : styles.fxIcon} />
      <CommodityIcon styles={styles} style={summary ? styles.summaryCommodity : styles.commodityIcon} />
    </>
  );
}

function CompanyIcon({ styles, style }: { styles: SceneStyles; style: object }) {
  return (
    <View style={[styles.iconWrap, style]}>
      <View style={styles.companyRoof} />
      <View style={styles.companyBody}>
        <View style={styles.windowRow}><View style={styles.window} /><View style={styles.window} /></View>
      </View>
    </View>
  );
}

function BondIcon({ styles, style }: { styles: SceneStyles; style: object }) {
  return (
    <View style={[styles.iconWrap, style]}>
      <View style={styles.paper}>
        <View style={styles.paperLine} />
        <View style={[styles.paperLine, styles.paperLineShort]} />
        <View style={styles.paperSeal} />
      </View>
    </View>
  );
}

function FxIcon({ styles, style }: { styles: SceneStyles; style: object }) {
  return (
    <View style={[styles.iconWrap, style]}>
      <View style={[styles.coin, styles.coinLeft]}><Text style={styles.coinText}>₺</Text></View>
      <View style={[styles.coin, styles.coinRight]}><Text style={styles.coinText}>$</Text></View>
    </View>
  );
}

function CommodityIcon({ styles, style }: { styles: SceneStyles; style: object }) {
  return (
    <View style={[styles.iconWrap, style]}>
      <View style={styles.goldBar} />
      <View style={[styles.goldBar, styles.goldBarShift]} />
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean) => {
  const iconSize = wide ? 76 : 58;
  return StyleSheet.create({
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
      width: '68%',
      aspectRatio: 1,
      left: '16%',
      top: '-15%',
      borderRadius: 999,
      backgroundColor: 'rgba(71, 215, 195, 0.07)',
    },
    hub: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: wide ? 72 : 56,
      height: wide ? 72 : 56,
      marginLeft: wide ? -36 : -28,
      marginTop: wide ? -36 : -28,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      borderWidth: 3,
      borderColor: '#47D7C3',
      backgroundColor: '#0D303A',
    },
    hubCore: { width: wide ? 16 : 12, height: wide ? 16 : 12, borderRadius: 999, backgroundColor: '#8AEADD' },
    hookRail: { position: 'absolute', left: '30%', right: '30%', top: '50%', height: 4, borderRadius: 2, backgroundColor: '#31586B' },
    notEqual: { position: 'absolute', left: '47%', top: '65%', color: '#47D7C3', fontSize: wide ? 30 : 23, fontWeight: '900' },
    spoke: { position: 'absolute', width: '23%', height: 3, borderRadius: 2, backgroundColor: '#31586B' },
    spokeStock: { left: '27%', top: '38%', transform: [{ rotate: '32deg' }] },
    spokeBond: { right: '27%', top: '38%', transform: [{ rotate: '-32deg' }] },
    spokeFx: { left: '27%', bottom: '38%', transform: [{ rotate: '-32deg' }] },
    spokeCommodity: { right: '27%', bottom: '38%', transform: [{ rotate: '32deg' }] },
    summaryRail: { position: 'absolute', left: '17%', right: '17%', top: '50%', height: 4, borderRadius: 2, backgroundColor: '#284B5D' },
    iconWrap: { position: 'absolute', width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' },
    hookCompany: { left: '22%', top: '40%' },
    hookCommodity: { right: '22%', top: '40%' },
    stockIcon: { left: '21%', top: '20%' },
    bondIcon: { right: '21%', top: '20%' },
    fxIcon: { left: '21%', bottom: '18%' },
    commodityIcon: { right: '21%', bottom: '18%' },
    summaryStock: { left: '14%', top: '40%' },
    summaryBond: { left: '34%', top: '40%' },
    summaryFx: { right: '34%', top: '40%' },
    summaryCommodity: { right: '14%', top: '40%' },
    companyRoof: { width: 0, height: 0, borderLeftWidth: wide ? 25 : 19, borderRightWidth: wide ? 25 : 19, borderBottomWidth: wide ? 16 : 12, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#7894A6' },
    companyBody: { width: wide ? 48 : 38, height: wide ? 30 : 24, paddingHorizontal: 8, paddingTop: 7, backgroundColor: '#405E72' },
    windowRow: { flexDirection: 'row', justifyContent: 'space-between' },
    window: { width: wide ? 9 : 7, height: wide ? 7 : 5, borderRadius: 1, backgroundColor: '#B5CBD4' },
    paper: { width: wide ? 50 : 39, height: wide ? 62 : 48, padding: wide ? 10 : 8, borderRadius: 5, backgroundColor: '#D8E2E6', opacity: 0.84 },
    paperLine: { height: 3, marginTop: 5, borderRadius: 2, backgroundColor: '#617A88' },
    paperLineShort: { width: '68%' },
    paperSeal: { position: 'absolute', right: 7, bottom: 7, width: wide ? 14 : 11, height: wide ? 14 : 11, borderRadius: 999, backgroundColor: '#47D7C3' },
    coin: { position: 'absolute', width: wide ? 42 : 32, height: wide ? 42 : 32, alignItems: 'center', justifyContent: 'center', borderRadius: 999, borderWidth: 2 },
    coinLeft: { left: wide ? 4 : 2, borderColor: '#47D7C3', backgroundColor: '#18414A' },
    coinRight: { right: wide ? 4 : 2, borderColor: '#7897A9', backgroundColor: '#263C4E' },
    coinText: { color: '#DCEAEC', fontSize: wide ? 17 : 13, fontWeight: '900' },
    goldBar: { width: wide ? 58 : 45, height: wide ? 18 : 14, borderRadius: 4, backgroundColor: '#B58A42', transform: [{ skewX: '-12deg' }] },
    goldBarShift: { marginTop: -3, marginLeft: 8, backgroundColor: '#8E6E37' },
    label: { position: 'absolute', color: '#D2E1E6', fontSize: wide ? 12 : 9, fontWeight: '900', letterSpacing: 0.35, textAlign: 'center' },
    hookLeftLabel: { left: '17%', width: '27%', bottom: '21%' },
    hookRightLabel: { right: '14%', width: '30%', bottom: '21%' },
    stockLabel: { left: '14%', width: '28%', top: '35%' },
    bondLabel: { right: '14%', width: '28%', top: '35%' },
    fxLabel: { left: '14%', width: '28%', bottom: '9%' },
    commodityLabel: { right: '12%', width: '32%', bottom: '9%' },
  });
};
