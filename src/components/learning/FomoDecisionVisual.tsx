import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface FomoDecisionVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function FomoDecisionVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: FomoDecisionVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'FOMO = aciliyet hissinin planın önüne geçmesi' : 'FOMO = urgency overriding the plan'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Acil hissetmek, acil karar gerektiğini kanıtlamaz.' : 'Feeling urgency does not prove an urgent decision is needed.'}
          </Text>
        </View>

        <View style={styles.comparison}>
          <View style={[styles.card, styles.pressureCard]}>
            <Text style={styles.pressureEyebrow}>{tr ? 'BASKI ARTIYOR' : 'PRESSURE RISES'}</Text>
            <View style={styles.pricePanel}>
              <Text style={styles.priceArrow}>↗</Text>
              <Text style={styles.priceCopy}>{tr ? 'Fiyat hızlı yükseliyor' : 'Price is rising fast'}</Text>
            </View>
            <PressureRow styles={styles} text={tr ? '“Hemen şimdi”' : '“Right now”'} />
            <PressureRow styles={styles} text={tr ? '“Herkes kazanıyor”' : '“Everyone is winning”'} />
            <PressureRow styles={styles} text={tr ? '“Bir daha fırsat gelmez”' : '“There will not be another chance”'} />
            <View style={styles.impulsePill}>
              <Text style={styles.impulseText}>{tr ? 'DÜRTÜ → KARAR' : 'IMPULSE → DECISION'}</Text>
            </View>
          </View>

          <View style={[styles.card, styles.controlCard]}>
            <Text style={styles.controlEyebrow}>{tr ? 'KONTROL NOKTASI' : 'CONTROL POINT'}</Text>
            <CheckStep styles={styles} number="1" title={tr ? 'DUR' : 'PAUSE'} detail={tr ? 'Aciliyeti fark et' : 'Notice the urgency'} />
            <Text style={styles.arrow}>↓</Text>
            <CheckStep styles={styles} number="2" title={tr ? 'PLANI KONTROL ET' : 'CHECK THE PLAN'} detail={tr ? 'Kriter + risk sınırı' : 'Criteria + risk limit'} active />
            <Text style={styles.arrow}>↓</Text>
            <CheckStep styles={styles} number="3" title={tr ? 'KARŞI KANIT ARA' : 'SEEK COUNTER-EVIDENCE'} detail={tr ? 'Beni ne yanlış çıkarır?' : 'What could prove me wrong?'} />
          </View>
        </View>

        <View style={styles.traderCard}>
          <Text style={styles.traderEyebrow}>{tr ? 'TRADER PRATİK' : 'TRADER PRACTICAL'}</Text>
          <Text style={styles.traderText}>
            {tr
              ? 'Fiyat hızlandığında yeni kriter icat etmek yerine önceden yazılmış giriş, risk ve geçersizlik koşullarına geri dön. “Kaçırıyorum” hissi piyasa kanıtı değildir.'
              : 'When price accelerates, return to pre-written entry, risk, and invalidation criteria instead of inventing new rules. Feeling that you are missing out is not market evidence.'}
          </Text>
        </View>

        <View style={styles.boundaryCard}>
          <Text style={styles.boundaryMark}>!</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Amaç duyguyu yok etmek değil; duygunun karar kriterlerinin yerine geçmesini önlemektir.'
              : 'The goal is not to remove emotion; it is to stop emotion from replacing decision criteria.'}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function PressureRow({ styles, text }: { styles: ReturnType<typeof createStyles>; text: string }) {
  return (
    <View style={styles.pressureRow}>
      <View style={styles.pressureDot} />
      <Text style={styles.pressureText}>{text}</Text>
    </View>
  );
}

function CheckStep({
  styles,
  number,
  title,
  detail,
  active = false,
}: {
  styles: ReturnType<typeof createStyles>;
  number: string;
  title: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <View style={[styles.checkStep, active && styles.checkStepActive]}>
      <Text style={[styles.checkNumber, active && styles.checkNumberActive]}>{number}</Text>
      <View style={styles.checkCopy}>
        <Text style={styles.checkTitle}>{title}</Text>
        <Text style={styles.checkDetail}>{detail}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 430,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: { padding: theme.spacing.md, gap: 12 },
    header: { alignItems: 'center', gap: 4, paddingHorizontal: 4 },
    title: { color: theme.colors.text, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
    subtitle: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
    comparison: { flexDirection: 'row', gap: 10 },
    card: { flex: 1, gap: 7, padding: 10, borderRadius: 12, borderWidth: 1, backgroundColor: theme.colors.surfaceMuted },
    pressureCard: { borderColor: 'rgba(251,113,133,0.30)' },
    controlCard: { borderColor: 'rgba(45,212,191,0.30)' },
    pressureEyebrow: { color: theme.colors.risk, fontSize: 9, fontWeight: '900', letterSpacing: 0.45, textAlign: 'center' },
    controlEyebrow: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.45, textAlign: 'center' },
    pricePanel: { minHeight: 54, alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: 9, backgroundColor: 'rgba(251,113,133,0.06)' },
    priceArrow: { color: theme.colors.risk, fontSize: 25, lineHeight: 27, fontWeight: '900' },
    priceCopy: { color: theme.colors.textMuted, fontSize: 9, lineHeight: 13, fontWeight: '800', textAlign: 'center' },
    pressureRow: { minHeight: 26, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 7, borderRadius: 7, backgroundColor: theme.colors.background },
    pressureDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.risk },
    pressureText: { flex: 1, color: theme.colors.text, fontSize: 9, lineHeight: 13, fontWeight: '800' },
    impulsePill: { minHeight: 30, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 7, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(251,113,133,0.34)', backgroundColor: 'rgba(251,113,133,0.07)' },
    impulseText: { color: theme.colors.risk, fontSize: 8, lineHeight: 12, fontWeight: '900', letterSpacing: 0.4 },
    checkStep: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 7, padding: 7, borderRadius: 9, backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border },
    checkStepActive: { borderColor: 'rgba(45,212,191,0.42)', backgroundColor: 'rgba(45,212,191,0.06)' },
    checkNumber: { width: 20, height: 20, borderRadius: 10, overflow: 'hidden', color: theme.colors.textMuted, fontSize: 9, lineHeight: 20, textAlign: 'center', fontWeight: '900', backgroundColor: 'rgba(159,176,195,0.14)' },
    checkNumberActive: { color: theme.colors.primaryText, backgroundColor: theme.colors.primary },
    checkCopy: { flex: 1, gap: 1 },
    checkTitle: { color: theme.colors.text, fontSize: 9, lineHeight: 13, fontWeight: '900' },
    checkDetail: { color: theme.colors.textMuted, fontSize: 8, lineHeight: 12, fontWeight: '700' },
    arrow: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 11, fontWeight: '900', textAlign: 'center' },
    traderCard: { gap: 4, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(45,212,191,0.25)', backgroundColor: 'rgba(45,212,191,0.05)' },
    traderEyebrow: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    traderText: { color: theme.colors.text, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    boundaryCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' },
    boundaryMark: { width: 18, color: theme.colors.warning, fontSize: 17, lineHeight: 20, fontWeight: '900' },
    boundaryText: { flex: 1, color: theme.colors.textMuted, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    footer: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
