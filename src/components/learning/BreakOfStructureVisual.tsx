import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface BreakOfStructureVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function BreakOfStructureVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: BreakOfStructureVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'BOS = anlamlı seviye + kapanış teyidi' : 'BOS = meaningful level + close confirmation'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Seviyeyi yalnızca fitille aşmak, tek başına yapı kırılımı değildir.'
              : 'Moving beyond a level with only a wick is not a structure break by itself.'}
          </Text>
        </View>

        <BreakCase
          styles={styles}
          kind="wick"
          eyebrow={tr ? 'SADECE TAŞMA' : 'OVERSHOOT ONLY'}
          closeLabel={tr ? 'Kapanış tekrar seviyenin altında' : 'Close returns below the level'}
          verdict={tr ? 'Tek başına BOS değil' : 'Not a BOS by itself'}
        />

        <BreakCase
          styles={styles}
          kind="close"
          eyebrow={tr ? 'DAHA ANLAMLI KANIT' : 'STRONGER EVIDENCE'}
          closeLabel={tr ? 'Kapanış anlamlı tepenin üzerinde' : 'Close finishes above the meaningful high'}
          verdict={tr ? 'BOS için daha güçlü kanıt' : 'Stronger BOS evidence'}
        />

        <View style={styles.evidenceCard}>
          <Text style={styles.evidenceTitle}>{tr ? 'ÖNCE ŞUNLARI KONTROL ET' : 'CHECK THESE FIRST'}</Text>
          <EvidenceRow styles={styles} index="1" text={tr ? 'Kırılan tepe/dip gerçekten anlamlı mı?' : 'Is the broken high/low actually meaningful?'} />
          <EvidenceRow styles={styles} index="2" text={tr ? 'Kapanış seviyenin ötesinde mi?' : 'Did the candle close beyond the level?'} />
          <EvidenceRow styles={styles} index="3" text={tr ? 'Zaman dilimi ve ana yapı ne söylüyor?' : 'What do the timeframe and broader structure show?'} />
        </View>

        <View style={styles.boundary}>
          <Text style={styles.boundaryMark}>!</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'BOS devam yönünde bir yapı kanıtı olabilir; kesinlik veya tek başına işlem sinyali değildir.'
              : 'A BOS can be structural evidence for continuation; it is not certainty or a trade signal by itself.'}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function BreakCase({
  styles,
  kind,
  eyebrow,
  closeLabel,
  verdict,
}: {
  styles: ReturnType<typeof createStyles>;
  kind: 'wick' | 'close';
  eyebrow: string;
  closeLabel: string;
  verdict: string;
}) {
  const confirmed = kind === 'close';
  return (
    <View style={[styles.caseCard, confirmed ? styles.confirmedCard : styles.wickCard]}>
      <View style={styles.caseTop}>
        <Text style={[styles.caseEyebrow, confirmed ? styles.confirmedText : styles.wickText]}>{eyebrow}</Text>
        <Text style={[styles.verdict, confirmed ? styles.confirmedText : styles.wickText]}>
          {confirmed ? '✓' : '×'} {verdict}
        </Text>
      </View>

      <View style={styles.chart}>
        <View style={styles.levelLine} />
        <Text style={styles.levelLabel}>SWING HIGH</Text>
        <View style={styles.priorSwing}>
          <View style={styles.priorStem} />
          <View style={styles.priorBody} />
        </View>
        <View style={styles.breakCandleSlot}>
          <View style={[styles.breakWick, confirmed ? styles.confirmedWick : styles.wickOnlyWick]} />
          <View style={[styles.breakBody, confirmed ? styles.confirmedBody : styles.wickOnlyBody]} />
          {confirmed ? <View style={styles.closeDot} /> : null}
        </View>
      </View>

      <Text style={styles.closeLabel}>{closeLabel}</Text>
    </View>
  );
}

function EvidenceRow({
  styles,
  index,
  text,
}: {
  styles: ReturnType<typeof createStyles>;
  index: string;
  text: string;
}) {
  return (
    <View style={styles.evidenceRow}>
      <View style={styles.evidenceIndex}><Text style={styles.evidenceIndexText}>{index}</Text></View>
      <Text style={styles.evidenceText}>{text}</Text>
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
    canvas: { padding: theme.spacing.md, gap: 10 },
    header: { gap: 4, alignItems: 'center', paddingHorizontal: 4 },
    title: { color: theme.colors.text, fontSize: 15, lineHeight: 21, fontWeight: '900', textAlign: 'center' },
    subtitle: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
    caseCard: { gap: 8, padding: 11, borderRadius: 12, borderWidth: 1, backgroundColor: theme.colors.surfaceMuted },
    wickCard: { borderColor: 'rgba(250,204,21,0.24)' },
    confirmedCard: { borderColor: 'rgba(45,212,191,0.30)' },
    caseTop: { gap: 3 },
    caseEyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
    verdict: { fontSize: 11, lineHeight: 15, fontWeight: '900' },
    wickText: { color: theme.colors.warning },
    confirmedText: { color: theme.colors.success },
    chart: {
      height: 88,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 9,
      backgroundColor: 'rgba(7,17,31,0.55)',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    levelLine: { position: 'absolute', left: 10, right: 10, top: 35, height: 2, backgroundColor: theme.colors.warning },
    levelLabel: { position: 'absolute', left: 10, top: 20, color: theme.colors.warning, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
    priorSwing: { position: 'absolute', left: '34%', top: 18, width: 18, height: 54, alignItems: 'center' },
    priorStem: { position: 'absolute', top: 0, width: 2, height: 52, borderRadius: 1, backgroundColor: 'rgba(159,176,195,0.55)' },
    priorBody: { position: 'absolute', top: 22, width: 12, height: 22, borderRadius: 2, backgroundColor: 'rgba(45,212,191,0.56)' },
    breakCandleSlot: { position: 'absolute', right: '22%', top: 8, width: 28, height: 72, alignItems: 'center' },
    breakWick: { position: 'absolute', width: 2, borderRadius: 1, backgroundColor: 'rgba(159,176,195,0.75)' },
    wickOnlyWick: { top: 2, height: 58 },
    confirmedWick: { top: 1, height: 64 },
    breakBody: { position: 'absolute', width: 13, borderRadius: 2 },
    wickOnlyBody: { top: 36, height: 22, backgroundColor: 'rgba(251,191,36,0.58)' },
    confirmedBody: { top: 16, height: 25, backgroundColor: 'rgba(45,212,191,0.72)' },
    closeDot: { position: 'absolute', top: 17, right: -8, width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.success },
    closeLabel: { color: theme.colors.text, fontSize: 10, lineHeight: 14, fontWeight: '800' },
    evidenceCard: { gap: 7, padding: 10, borderRadius: 11, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: 'rgba(159,176,195,0.04)' },
    evidenceTitle: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
    evidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    evidenceIndex: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(45,212,191,0.10)', borderWidth: 1, borderColor: 'rgba(45,212,191,0.24)' },
    evidenceIndexText: { color: theme.colors.primary, fontSize: 9, fontWeight: '900' },
    evidenceText: { flex: 1, color: theme.colors.text, fontSize: 10, lineHeight: 14, fontWeight: '800' },
    boundary: { flexDirection: 'row', gap: 8, padding: 10, borderRadius: 11, borderWidth: 1, borderColor: 'rgba(248,113,113,0.20)', backgroundColor: 'rgba(248,113,113,0.05)' },
    boundaryMark: { color: theme.colors.risk, fontSize: 14, fontWeight: '900' },
    boundaryText: { flex: 1, color: theme.colors.text, fontSize: 10, lineHeight: 15, fontWeight: '800' },
    footer: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
