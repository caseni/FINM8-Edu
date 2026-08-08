import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface PositionSizingVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function PositionSizingVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: PositionSizingVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Aynı risk bütçesi · farklı pozisyon' : 'Same risk budget · different position size'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Risk mesafesi büyüdükçe miktar küçülür.'
              : 'As risk distance grows, position size gets smaller.'}
          </Text>
        </View>

        <View style={styles.budgetCard}>
          <Text style={styles.budgetEyebrow}>{tr ? 'ÖRNEK RİSK BÜTÇESİ' : 'EXAMPLE RISK BUDGET'}</Text>
          <Text style={styles.budgetValue}>100</Text>
          <Text style={styles.budgetUnit}>{tr ? 'risk birimi' : 'risk units'}</Text>
        </View>

        <View style={styles.comparison}>
          <SizeCard
            styles={styles}
            title={tr ? 'DAR MESAFE' : 'TIGHTER DISTANCE'}
            distance="2"
            size="50"
            equation="2 × 50 = 100"
            tone="compact"
            distanceLabel={tr ? 'Risk mesafesi' : 'Risk distance'}
            sizeLabel={tr ? 'Pozisyon' : 'Position size'}
          />
          <SizeCard
            styles={styles}
            title={tr ? 'GENİŞ MESAFE' : 'WIDER DISTANCE'}
            distance="5"
            size="20"
            equation="5 × 20 = 100"
            tone="wide"
            distanceLabel={tr ? 'Risk mesafesi' : 'Risk distance'}
            sizeLabel={tr ? 'Pozisyon' : 'Position size'}
          />
        </View>

        <View style={styles.sequenceCard}>
          <Text style={styles.sequenceEyebrow}>{tr ? 'KARAR SIRASI' : 'DECISION ORDER'}</Text>
          <View style={styles.sequenceRow}>
            <Step styles={styles} number="1" text={tr ? 'Risk sınırı' : 'Risk limit'} />
            <Text style={styles.arrow}>→</Text>
            <Step styles={styles} number="2" text={tr ? 'Geçersizlik mesafesi' : 'Invalidation distance'} />
            <Text style={styles.arrow}>→</Text>
            <Step styles={styles} number="3" text={tr ? 'Uygun büyüklük' : 'Suitable size'} />
          </View>
        </View>

        <View style={styles.practiceCard}>
          <Text style={styles.practiceEyebrow}>{tr ? 'TRADER PRATİK' : 'TRADER PRACTICE'}</Text>
          <Text style={styles.practiceText}>
            {tr
              ? 'Pozisyonu büyütmek için stopu yapay biçimde daraltmak yerine, önce mantıklı geçersizlik noktasını belirleyip miktarı ona göre ayarlamak daha tutarlı bir risk yaklaşımıdır.'
              : 'Rather than artificially tightening a stop to make the position larger, a more consistent risk approach is to define a logical invalidation point first and size the position around it.'}
          </Text>
        </View>

        <View style={styles.boundaryCard}>
          <Text style={styles.boundaryMark}>!</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Hesaplanan risk garanti değildir; gap, kayma ve likidite gerçek kaybı büyütebilir.'
              : 'Calculated risk is not guaranteed; gaps, slippage, and liquidity can increase realized loss.'}
          </Text>
        </View>

        <Text style={styles.exampleNote}>{tr ? 'Rakamlar yalnız ilişkiyi göstermek için örnektir.' : 'Numbers are illustrative only.'}</Text>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function SizeCard({
  styles,
  title,
  distance,
  size,
  equation,
  tone,
  distanceLabel,
  sizeLabel,
}: {
  styles: ReturnType<typeof createStyles>;
  title: string;
  distance: string;
  size: string;
  equation: string;
  tone: 'compact' | 'wide';
  distanceLabel: string;
  sizeLabel: string;
}) {
  const wide = tone === 'wide';
  return (
    <View style={[styles.sizeCard, wide ? styles.wideCard : styles.compactCard]}>
      <Text style={[styles.cardTitle, wide ? styles.wideText : styles.compactText]}>{title}</Text>
      <View style={styles.metricRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{distanceLabel}</Text>
          <Text style={styles.metricValue}>{distance}</Text>
        </View>
        <Text style={styles.swap}>×</Text>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{sizeLabel}</Text>
          <Text style={[styles.metricValue, wide ? styles.smallSize : styles.largeSize]}>{size}</Text>
        </View>
      </View>
      <View style={[styles.distanceBar, wide ? styles.distanceWide : styles.distanceCompact]} />
      <Text style={styles.equation}>{equation}</Text>
    </View>
  );
}

function Step({ styles, number, text }: { styles: ReturnType<typeof createStyles>; number: string; text: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{number}</Text></View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 470,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: { padding: theme.spacing.md, gap: 12 },
    header: { gap: 4, alignItems: 'center', paddingHorizontal: 4 },
    title: { color: theme.colors.text, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
    subtitle: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
    budgetCard: { alignItems: 'center', gap: 1, padding: 9, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(45,212,191,0.24)', backgroundColor: 'rgba(45,212,191,0.05)' },
    budgetEyebrow: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    budgetValue: { color: theme.colors.text, fontSize: 24, lineHeight: 28, fontWeight: '900' },
    budgetUnit: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '700' },
    comparison: { flexDirection: 'row', gap: 10 },
    sizeCard: { flex: 1, gap: 8, padding: 11, borderRadius: 12, borderWidth: 1, backgroundColor: theme.colors.surfaceMuted },
    compactCard: { borderColor: 'rgba(45,212,191,0.28)' },
    wideCard: { borderColor: 'rgba(251,191,36,0.28)' },
    cardTitle: { fontSize: 9, lineHeight: 13, fontWeight: '900', letterSpacing: 0.35 },
    compactText: { color: theme.colors.primary },
    wideText: { color: theme.colors.warning },
    metricRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
    metric: { flex: 1, alignItems: 'center', gap: 2 },
    metricLabel: { color: theme.colors.textMuted, fontSize: 8, lineHeight: 11, fontWeight: '700', textAlign: 'center' },
    metricValue: { color: theme.colors.text, fontSize: 20, lineHeight: 24, fontWeight: '900' },
    largeSize: { color: theme.colors.primary },
    smallSize: { color: theme.colors.warning },
    swap: { color: theme.colors.textMuted, fontSize: 13, fontWeight: '900' },
    distanceBar: { height: 7, borderRadius: 4, alignSelf: 'flex-start' },
    distanceCompact: { width: '38%', backgroundColor: 'rgba(45,212,191,0.62)' },
    distanceWide: { width: '88%', backgroundColor: 'rgba(251,191,36,0.58)' },
    equation: { color: theme.colors.text, fontSize: 11, fontWeight: '900', textAlign: 'center' },
    sequenceCard: { gap: 8, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    sequenceEyebrow: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    sequenceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
    step: { flex: 1, alignItems: 'center', gap: 4 },
    stepNumber: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: 'rgba(45,212,191,0.07)' },
    stepNumberText: { color: theme.colors.primary, fontSize: 10, fontWeight: '900' },
    stepText: { color: theme.colors.text, fontSize: 9, lineHeight: 12, fontWeight: '800', textAlign: 'center' },
    arrow: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '900' },
    practiceCard: { gap: 3, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(52,211,153,0.24)', backgroundColor: 'rgba(52,211,153,0.05)' },
    practiceEyebrow: { color: theme.colors.success, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    practiceText: { color: theme.colors.text, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    boundaryCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(251,113,133,0.24)', backgroundColor: 'rgba(251,113,133,0.05)' },
    boundaryMark: { width: 16, color: theme.colors.risk, fontSize: 16, lineHeight: 18, fontWeight: '900' },
    boundaryText: { flex: 1, color: theme.colors.textMuted, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    exampleNote: { color: theme.colors.textMuted, fontSize: 9, textAlign: 'center' },
    footer: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
