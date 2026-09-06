import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface ChangeOfCharacterVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function ChangeOfCharacterVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: ChangeOfCharacterVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'CHoCH = yapıda olası karakter değişimi' : 'CHoCH = possible change in structure character'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Örnek: yükseliş yapısında korunan anlamlı dip karşı yönde kaybediliyor.'
              : 'Example: a meaningful protected low is lost against an upward structure.'}
          </Text>
        </View>

        <View style={styles.stageCard}>
          <View style={styles.stageTop}>
            <Text style={styles.stageNumber}>1</Text>
            <View style={styles.stageCopy}>
              <Text style={styles.stageLabel}>{tr ? 'YAPI KORUNUYOR' : 'STRUCTURE HOLDS'}</Text>
              <Text style={styles.stageText}>{tr ? 'Daha yüksek dip korunuyor.' : 'The higher low remains protected.'}</Text>
            </View>
          </View>

          <View style={styles.swingRow}>
            <SwingBadge styles={styles} label="HL" note={tr ? 'dip' : 'low'} />
            <Text style={styles.arrow}>↗</Text>
            <SwingBadge styles={styles} label="HH" note={tr ? 'tepe' : 'high'} />
            <Text style={styles.arrow}>↘</Text>
            <SwingBadge styles={styles} label="HL" note={tr ? 'korunan dip' : 'protected low'} protected />
          </View>
          <View style={styles.protectedBand}>
            <Text style={styles.protectedBandText}>{tr ? 'KORUNAN ANLAMLI DİP' : 'MEANINGFUL PROTECTED LOW'}</Text>
          </View>
        </View>

        <View style={[styles.stageCard, styles.changeCard]}>
          <View style={styles.stageTop}>
            <Text style={[styles.stageNumber, styles.stageNumberChange]}>2</Text>
            <View style={styles.stageCopy}>
              <Text style={[styles.stageLabel, styles.changeLabel]}>{tr ? 'KARŞI YÖNLÜ İHLAL' : 'COUNTER-DIRECTION BREAK'}</Text>
              <Text style={styles.stageText}>{tr ? 'Kapanış korunan seviyenin altında.' : 'The close finishes below the protected level.'}</Text>
            </View>
          </View>

          <View style={styles.breakChart}>
            <View style={styles.protectedLine} />
            <Text style={styles.protectedLineText}>{tr ? 'korunan dip' : 'protected low'}</Text>
            <View style={styles.breakCandleSlot}>
              <View style={styles.breakWick} />
              <View style={styles.breakBody} />
              <Text style={styles.closeTag}>{tr ? 'KAPANIŞ ↓' : 'CLOSE ↓'}</Text>
            </View>
            <View style={styles.chochPill}><Text style={styles.chochText}>CHoCH?</Text></View>
          </View>
        </View>

        <View style={styles.checks}>
          <Check styles={styles} number="1" text={tr ? 'Kırılan seviye gerçekten korunan anlamlı swing mi?' : 'Is the broken level really a meaningful protected swing?'} />
          <Check styles={styles} number="2" text={tr ? 'Karşı yönde yapısal kapanış var mı?' : 'Is there a structural close in the opposing direction?'} />
          <Check styles={styles} number="3" text={tr ? 'Yeni yönde devam yapısı oluşuyor mu?' : 'Does continuation structure form in the new direction?'} />
        </View>

        <View style={styles.boundary}>
          <Text style={styles.boundaryMark}>!</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'CHoCH bir değişim uyarısıdır; kesin trend dönüşü veya işlem talimatı değildir.'
              : 'CHoCH is a change warning, not a certain trend reversal or trade instruction.'}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function SwingBadge({
  styles,
  label,
  note,
  protected: isProtected = false,
}: {
  styles: ReturnType<typeof createStyles>;
  label: string;
  note: string;
  protected?: boolean;
}) {
  return (
    <View style={[styles.swingBadge, isProtected && styles.swingBadgeProtected]}>
      <Text style={[styles.swingLabel, isProtected && styles.swingLabelProtected]}>{label}</Text>
      <Text style={styles.swingNote}>{note}</Text>
    </View>
  );
}

function Check({ styles, number, text }: { styles: ReturnType<typeof createStyles>; number: string; text: string }) {
  return (
    <View style={styles.checkRow}>
      <View style={styles.checkNumber}><Text style={styles.checkNumberText}>{number}</Text></View>
      <Text style={styles.checkText}>{text}</Text>
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
    canvas: { padding: theme.spacing.md, gap: 10 },
    header: { gap: 4, alignItems: 'center', paddingHorizontal: 4 },
    title: { color: theme.colors.text, fontSize: 15, lineHeight: 21, fontWeight: '900', textAlign: 'center' },
    subtitle: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
    stageCard: { gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(45,212,191,0.25)', backgroundColor: theme.colors.surfaceMuted },
    changeCard: { borderColor: 'rgba(248,113,113,0.28)' },
    stageTop: { flexDirection: 'row', alignItems: 'center', gap: 9 },
    stageNumber: { width: 25, height: 25, borderRadius: 13, textAlign: 'center', textAlignVertical: 'center', color: theme.colors.primaryText, backgroundColor: theme.colors.primary, fontSize: 11, fontWeight: '900' },
    stageNumberChange: { backgroundColor: theme.colors.risk },
    stageCopy: { flex: 1, gap: 2 },
    stageLabel: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    changeLabel: { color: theme.colors.risk },
    stageText: { color: theme.colors.text, fontSize: 11, lineHeight: 15, fontWeight: '800' },
    swingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5 },
    swingBadge: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 9, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: 'rgba(159,176,195,0.04)' },
    swingBadgeProtected: { borderColor: 'rgba(45,212,191,0.42)', backgroundColor: 'rgba(45,212,191,0.08)' },
    swingLabel: { color: theme.colors.text, fontSize: 14, fontWeight: '900' },
    swingLabelProtected: { color: theme.colors.primary },
    swingNote: { color: theme.colors.textMuted, fontSize: 8, marginTop: 2, fontWeight: '700', textAlign: 'center' },
    arrow: { color: theme.colors.textMuted, fontSize: 16, fontWeight: '900' },
    protectedBand: { minHeight: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 7, borderWidth: 1, borderColor: 'rgba(45,212,191,0.26)', backgroundColor: 'rgba(45,212,191,0.07)' },
    protectedBandText: { color: theme.colors.primary, fontSize: 8, fontWeight: '900', letterSpacing: 0.45 },
    breakChart: { height: 92, position: 'relative', overflow: 'hidden', borderRadius: 9, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: 'rgba(7,17,31,0.72)' },
    protectedLine: { position: 'absolute', left: 10, right: 10, top: 35, height: 2, backgroundColor: theme.colors.warning },
    protectedLineText: { position: 'absolute', left: 10, top: 20, color: theme.colors.warning, fontSize: 8, fontWeight: '900' },
    breakCandleSlot: { position: 'absolute', right: '28%', top: 13, width: 28, height: 70, alignItems: 'center' },
    breakWick: { position: 'absolute', top: 1, width: 2, height: 60, borderRadius: 1, backgroundColor: 'rgba(159,176,195,0.62)' },
    breakBody: { position: 'absolute', top: 29, width: 15, height: 27, borderRadius: 3, backgroundColor: theme.colors.risk },
    closeTag: { position: 'absolute', top: 57, width: 70, textAlign: 'center', color: theme.colors.risk, fontSize: 8, fontWeight: '900' },
    chochPill: { position: 'absolute', right: 9, bottom: 9, paddingVertical: 5, paddingHorizontal: 8, borderRadius: 999, backgroundColor: 'rgba(248,113,113,0.10)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.30)' },
    chochText: { color: theme.colors.risk, fontSize: 9, fontWeight: '900' },
    checks: { gap: 6, padding: 10, borderRadius: 11, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: 'rgba(159,176,195,0.04)' },
    checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    checkNumber: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border },
    checkNumberText: { color: theme.colors.primary, fontSize: 9, fontWeight: '900' },
    checkText: { flex: 1, color: theme.colors.text, fontSize: 10, lineHeight: 14, fontWeight: '700' },
    boundary: { flexDirection: 'row', gap: 8, padding: 10, borderRadius: 11, borderWidth: 1, borderColor: 'rgba(250,204,21,0.22)', backgroundColor: 'rgba(250,204,21,0.06)' },
    boundaryMark: { color: theme.colors.warning, fontSize: 14, fontWeight: '900' },
    boundaryText: { flex: 1, color: theme.colors.text, fontSize: 10, lineHeight: 15, fontWeight: '800' },
    footer: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
