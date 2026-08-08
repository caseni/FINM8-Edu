import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface OrderTypesVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function OrderTypesVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: OrderTypesVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Her emir farklı bir şeyi kontrol eder' : 'Each order controls something different'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Hız · fiyat kontrolü · tetikleme' : 'Speed · price control · triggering'}
          </Text>
        </View>

        <View style={styles.cards}>
          <OrderCard
            styles={styles}
            eyebrow={tr ? 'PİYASA' : 'MARKET'}
            headline={tr ? 'Şimdi gerçekleşmeyi hedefler' : 'Targets execution now'}
            control={tr ? 'Öncelik: gerçekleşme' : 'Priority: execution'}
            boundary={tr ? 'Fiyat garanti değil' : 'Price is not guaranteed'}
            signal="→"
            tone="primary"
          />
          <OrderCard
            styles={styles}
            eyebrow={tr ? 'LİMİT' : 'LIMIT'}
            headline={tr ? 'Fiyat sınırı koyar' : 'Sets a price boundary'}
            control={tr ? 'Kontrol: fiyat' : 'Control: price'}
            boundary={tr ? 'Gerçekleşme garanti değil' : 'Execution is not guaranteed'}
            signal="≤"
            tone="success"
          />
          <OrderCard
            styles={styles}
            eyebrow={tr ? 'STOP' : 'STOP'}
            headline={tr ? 'Seviyede tetiklenir' : 'Triggers at a level'}
            control={tr ? 'Kontrol: tetikleyici' : 'Control: trigger'}
            boundary={tr ? 'Stop fiyatı = kesin gerçekleşme değil' : 'Stop price ≠ guaranteed fill'}
            signal="⚡"
            tone="warning"
          />
        </View>

        <View style={styles.flowCard}>
          <View style={styles.flowNode}>
            <Text style={styles.flowLabel}>{tr ? 'STOP 98' : 'STOP 98'}</Text>
            <Text style={styles.flowCaption}>{tr ? 'seviye görülür' : 'level is reached'}</Text>
          </View>
          <Text style={styles.flowArrow}>→</Text>
          <View style={styles.flowNode}>
            <Text style={styles.flowLabel}>{tr ? 'TETİKLENİR' : 'TRIGGERS'}</Text>
            <Text style={styles.flowCaption}>
              {tr ? 'standart stop çoğunlukla piyasa emrine döner' : 'a standard stop often becomes a market order'}
            </Text>
          </View>
          <Text style={styles.flowArrow}>→</Text>
          <View style={[styles.flowNode, styles.flowNodeRisk]}>
            <Text style={styles.flowLabel}>{tr ? 'GERÇEKLEŞME' : 'FILL'}</Text>
            <Text style={styles.flowCaption}>{tr ? 'farklı fiyatta olabilir' : 'may occur at another price'}</Text>
          </View>
        </View>

        <View style={styles.tradeoff}>
          <Text style={styles.tradeoffEyebrow}>{tr ? 'TEMEL TAKAS' : 'CORE TRADEOFF'}</Text>
          <Text style={styles.tradeoffText}>
            {tr
              ? 'Tek bir emir hem fiyatı hem gerçekleşmeyi aynı anda garanti etmez.'
              : 'A single order does not guarantee both price and execution at the same time.'}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function OrderCard({
  styles,
  eyebrow,
  headline,
  control,
  boundary,
  signal,
  tone,
}: {
  styles: ReturnType<typeof createStyles>;
  eyebrow: string;
  headline: string;
  control: string;
  boundary: string;
  signal: string;
  tone: 'primary' | 'success' | 'warning';
}) {
  const accent =
    tone === 'success'
      ? styles.successText
      : tone === 'warning'
        ? styles.warningText
        : styles.primaryText;
  const card =
    tone === 'success'
      ? styles.successCard
      : tone === 'warning'
        ? styles.warningCard
        : styles.primaryCard;

  return (
    <View style={[styles.orderCard, card]}>
      <View style={styles.orderTop}>
        <Text style={[styles.orderEyebrow, accent]}>{eyebrow}</Text>
        <Text style={[styles.signal, accent]}>{signal}</Text>
      </View>
      <Text style={styles.orderHeadline}>{headline}</Text>
      <View style={styles.controlRow}>
        <Text style={styles.controlDot}>●</Text>
        <Text style={styles.controlText}>{control}</Text>
      </View>
      <View style={styles.boundaryRow}>
        <Text style={styles.boundaryMark}>×</Text>
        <Text style={styles.boundaryText}>{boundary}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 354,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: {
      minHeight: 306,
      padding: theme.spacing.md,
      justifyContent: 'center',
      gap: 10,
    },
    header: { alignItems: 'center', gap: 3 },
    title: {
      color: theme.colors.text,
      fontSize: 14,
      lineHeight: 19,
      fontWeight: '900',
      textAlign: 'center',
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '700',
      textAlign: 'center',
    },
    cards: { flexDirection: 'row', gap: 7 },
    orderCard: {
      flex: 1,
      minHeight: 128,
      gap: 6,
      padding: 9,
      borderRadius: 11,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
    },
    primaryCard: { borderColor: 'rgba(45,212,191,0.34)' },
    successCard: { borderColor: 'rgba(74,222,128,0.30)' },
    warningCard: { borderColor: 'rgba(250,204,21,0.28)' },
    orderTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
    orderEyebrow: { fontSize: 8, fontWeight: '900', letterSpacing: 0.55 },
    signal: { fontSize: 15, lineHeight: 18, fontWeight: '900' },
    primaryText: { color: theme.colors.primary },
    successText: { color: theme.colors.success },
    warningText: { color: theme.colors.warning },
    orderHeadline: { color: theme.colors.text, fontSize: 10, lineHeight: 14, fontWeight: '900' },
    controlRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 5 },
    controlDot: { color: theme.colors.primary, fontSize: 7, lineHeight: 13 },
    controlText: { flex: 1, color: theme.colors.textMuted, fontSize: 8, lineHeight: 12, fontWeight: '700' },
    boundaryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 5 },
    boundaryMark: { color: theme.colors.risk, fontSize: 11, lineHeight: 13, fontWeight: '900' },
    boundaryText: { flex: 1, color: theme.colors.textMuted, fontSize: 8, lineHeight: 12, fontWeight: '700' },
    flowCard: {
      minHeight: 74,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      padding: 8,
      borderRadius: 11,
      backgroundColor: 'rgba(159,176,195,0.05)',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    flowNode: {
      flex: 1,
      minHeight: 54,
      justifyContent: 'center',
      gap: 2,
      paddingHorizontal: 6,
      paddingVertical: 5,
      borderRadius: 8,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: 'rgba(159,176,195,0.10)',
    },
    flowNodeRisk: { borderColor: 'rgba(248,113,113,0.26)' },
    flowLabel: { color: theme.colors.text, fontSize: 8, fontWeight: '900', textAlign: 'center' },
    flowCaption: { color: theme.colors.textMuted, fontSize: 7, lineHeight: 10, fontWeight: '700', textAlign: 'center' },
    flowArrow: { color: theme.colors.primary, fontSize: 13, fontWeight: '900' },
    tradeoff: {
      gap: 2,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 10,
      backgroundColor: 'rgba(45,212,191,0.07)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.24)',
    },
    tradeoffEyebrow: { color: theme.colors.primary, fontSize: 8, fontWeight: '900', letterSpacing: 0.55 },
    tradeoffText: { color: theme.colors.text, fontSize: 9, lineHeight: 13, fontWeight: '800' },
    footer: {
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
