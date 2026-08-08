import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface SupportResistanceZoneVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function SupportResistanceZoneVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: SupportResistanceZoneVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Destek ve direnç çoğu zaman bir bölgedir' : 'Support and resistance are often zones'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Tepkiler aynı alanda olabilir; aynı fiyatta olmak zorunda değildir.'
              : 'Reactions can cluster in the same area without occurring at one exact price.'}
          </Text>
        </View>

        <ReactionZone
          styles={styles}
          tone="resistance"
          title={tr ? 'DİRENÇ BÖLGESİ · 108–110' : 'RESISTANCE ZONE · 108–110'}
          note={tr ? 'Satıcı tepkileri bu aralıkta görülmüş' : 'Seller reactions appeared in this range'}
          detail={tr ? 'Fitiller ve kapanışlar aynı alanda kümeleniyor.' : 'Wicks and closes cluster in the same area.'}
          arrows={['↓', '↓', '↓']}
        />

        <View style={styles.middleHint}>
          <Text style={styles.middleHintText}>
            {tr ? 'Fiyat iki alan arasında hareket eder' : 'Price moves between the two areas'}
          </Text>
        </View>

        <ReactionZone
          styles={styles}
          tone="support"
          title={tr ? 'DESTEK BÖLGESİ · 98–100' : 'SUPPORT ZONE · 98–100'}
          note={tr ? 'Alıcı tepkileri bu aralıkta görülmüş' : 'Buyer reactions appeared in this range'}
          detail={tr ? 'Tepkiler tek bir kusursuz fiyata sıkışmaz.' : 'Reactions do not have to land on one perfect price.'}
          arrows={['↑', '↑', '↑']}
        />

        <View style={styles.compareCard}>
          <View style={styles.compareRow}>
            <Text style={styles.cross}>×</Text>
            <View style={styles.compareCopy}>
              <Text style={styles.compareLabel}>{tr ? 'TEK ÇİZGİ' : 'ONE LINE'}</Text>
              <Text style={styles.compareText}>{tr ? '109.0 kesin duvar gibi düşünmek' : 'Treating 109.0 like a certain wall'}</Text>
            </View>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.check}>✓</Text>
            <View style={styles.compareCopy}>
              <Text style={styles.compareLabel}>{tr ? 'BÖLGE' : 'ZONE'}</Text>
              <Text style={styles.compareText}>{tr ? '108–110 aralığını tepki alanı olarak okumak' : 'Reading 108–110 as a reaction area'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.boundary}>
          <Text style={styles.boundaryMark}>!</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Geçmişte tepki verdi diye bölgenin tekrar tutması veya kırılması garanti değildir.'
              : 'Past reactions do not guarantee that the zone will hold or break next time.'}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function ReactionZone({
  styles,
  tone,
  title,
  note,
  detail,
  arrows,
}: {
  styles: ReturnType<typeof createStyles>;
  tone: 'support' | 'resistance';
  title: string;
  note: string;
  detail: string;
  arrows: readonly string[];
}) {
  const support = tone === 'support';
  return (
    <View style={[styles.zoneCard, support ? styles.supportCard : styles.resistanceCard]}>
      <View style={styles.zoneHeader}>
        <View style={styles.zoneCopy}>
          <Text style={[styles.zoneTitle, support ? styles.supportText : styles.resistanceText]}>{title}</Text>
          <Text style={styles.zoneNote}>{note}</Text>
        </View>
        <View style={styles.reactions}>
          {arrows.map((arrow, index) => (
            <View key={`${tone}.${index}`} style={[styles.reactionDot, support ? styles.supportDot : styles.resistanceDot]}>
              <Text style={[styles.reactionArrow, support ? styles.supportText : styles.resistanceText]}>{arrow}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={[styles.rangeBand, support ? styles.supportBand : styles.resistanceBand]}>
        <View style={styles.rangeTick} />
        <View style={styles.rangeTick} />
        <View style={styles.rangeTick} />
      </View>
      <Text style={styles.zoneDetail}>{detail}</Text>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 420,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: {
      padding: theme.spacing.md,
      gap: 10,
    },
    header: { gap: 4, alignItems: 'center', paddingHorizontal: 4 },
    title: { color: theme.colors.text, fontSize: 15, lineHeight: 21, fontWeight: '900', textAlign: 'center' },
    subtitle: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
    zoneCard: { gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, backgroundColor: theme.colors.surfaceMuted },
    resistanceCard: { borderColor: 'rgba(248,113,113,0.28)' },
    supportCard: { borderColor: 'rgba(45,212,191,0.30)' },
    zoneHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    zoneCopy: { flex: 1, gap: 3 },
    zoneTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    resistanceText: { color: theme.colors.risk },
    supportText: { color: theme.colors.primary },
    zoneNote: { color: theme.colors.text, fontSize: 11, lineHeight: 15, fontWeight: '800' },
    reactions: { flexDirection: 'row', gap: 5 },
    reactionDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    resistanceDot: { backgroundColor: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.26)' },
    supportDot: { backgroundColor: 'rgba(45,212,191,0.08)', borderColor: 'rgba(45,212,191,0.28)' },
    reactionArrow: { fontSize: 14, fontWeight: '900' },
    rangeBand: { height: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderRadius: 8, borderWidth: 1 },
    resistanceBand: { backgroundColor: 'rgba(248,113,113,0.10)', borderColor: 'rgba(248,113,113,0.24)' },
    supportBand: { backgroundColor: 'rgba(45,212,191,0.10)', borderColor: 'rgba(45,212,191,0.25)' },
    rangeTick: { width: 3, height: 16, borderRadius: 2, backgroundColor: 'rgba(159,176,195,0.62)' },
    zoneDetail: { color: theme.colors.textMuted, fontSize: 10, lineHeight: 14, fontWeight: '700' },
    middleHint: { alignItems: 'center', paddingVertical: 2 },
    middleHintText: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '800' },
    compareCard: { gap: 7, padding: 10, borderRadius: 11, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: 'rgba(159,176,195,0.04)' },
    compareRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    compareCopy: { flex: 1, gap: 1 },
    compareLabel: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
    compareText: { color: theme.colors.text, fontSize: 10, lineHeight: 14, fontWeight: '800' },
    cross: { width: 16, color: theme.colors.risk, fontSize: 15, lineHeight: 18, fontWeight: '900' },
    check: { width: 16, color: theme.colors.success, fontSize: 14, lineHeight: 18, fontWeight: '900' },
    boundary: { flexDirection: 'row', gap: 8, padding: 10, borderRadius: 11, borderWidth: 1, borderColor: 'rgba(250,204,21,0.22)', backgroundColor: 'rgba(250,204,21,0.06)' },
    boundaryMark: { color: theme.colors.warning, fontSize: 14, fontWeight: '900' },
    boundaryText: { flex: 1, color: theme.colors.text, fontSize: 10, lineHeight: 15, fontWeight: '800' },
    footer: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
