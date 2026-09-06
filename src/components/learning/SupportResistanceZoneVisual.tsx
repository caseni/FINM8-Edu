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
          <Text style={styles.title}>{tr ? 'Destek ve direnç' : 'Support and resistance'}</Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Tek bir çizgi yerine tepki görülen alanlara bak.'
              : 'Look for reaction areas instead of one exact line.'}
          </Text>
        </View>

        <ReactionZone
          styles={styles}
          tone="resistance"
          title={tr ? 'DİRENÇ' : 'RESISTANCE'}
          note={tr ? 'Fiyatın daha önce zorlandığı üst alan' : 'Upper area where price struggled before'}
          bandLabel={tr ? 'TEPKİ ALANI' : 'REACTION AREA'}
        />

        <ReactionZone
          styles={styles}
          tone="support"
          title={tr ? 'DESTEK' : 'SUPPORT'}
          note={tr ? 'Fiyatın daha önce tepki aldığı alt alan' : 'Lower area where price reacted before'}
          bandLabel={tr ? 'TEPKİ ALANI' : 'REACTION AREA'}
        />

        <View style={styles.boundary}>
          <Text style={styles.boundaryMark}>!</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Bölge, fiyatın tekrar döneceğini garanti etmez.'
              : 'A zone does not guarantee that price will reverse there again.'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ReactionZone({
  styles,
  tone,
  title,
  note,
  bandLabel,
}: {
  styles: ReturnType<typeof createStyles>;
  tone: 'support' | 'resistance';
  title: string;
  note: string;
  bandLabel: string;
}) {
  const support = tone === 'support';
  const markers = [0, 1, 2] as const;

  return (
    <View style={[styles.zoneCard, support ? styles.supportCard : styles.resistanceCard]}>
      <View style={styles.zoneCopy}>
        <Text style={[styles.zoneTitle, support ? styles.supportText : styles.resistanceText]}>{title}</Text>
        <Text style={styles.zoneNote}>{note}</Text>
      </View>

      <View style={[styles.zoneBand, support ? styles.supportBand : styles.resistanceBand]}>
        <Text style={[styles.bandLabel, support ? styles.supportText : styles.resistanceText]}>{bandLabel}</Text>
        <View style={styles.markers}>
          {markers.map((marker) => (
            <View key={`${tone}.${marker}`} style={styles.marker}>
              <View style={[styles.markerWick, support ? styles.supportMarker : styles.resistanceMarker]} />
              <View style={[styles.markerBody, support ? styles.supportMarker : styles.resistanceMarker]} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 330,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.md,
      gap: 12,
    },
    header: {
      gap: 4,
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingBottom: 2,
    },
    title: {
      color: theme.colors.text,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '900',
      textAlign: 'center',
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 12,
      lineHeight: 17,
      fontWeight: '700',
      textAlign: 'center',
    },
    zoneCard: {
      gap: 10,
      padding: 13,
      borderRadius: 13,
      borderWidth: 1,
      backgroundColor: theme.colors.surfaceMuted,
    },
    resistanceCard: {
      borderColor: 'rgba(248,113,113,0.24)',
    },
    supportCard: {
      borderColor: 'rgba(45,212,191,0.26)',
    },
    zoneCopy: {
      gap: 3,
    },
    zoneTitle: {
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 0.7,
    },
    resistanceText: {
      color: theme.colors.risk,
    },
    supportText: {
      color: theme.colors.primary,
    },
    zoneNote: {
      color: theme.colors.text,
      fontSize: 12,
      lineHeight: 17,
      fontWeight: '800',
    },
    zoneBand: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
    },
    resistanceBand: {
      backgroundColor: 'rgba(248,113,113,0.08)',
      borderColor: 'rgba(248,113,113,0.20)',
    },
    supportBand: {
      backgroundColor: 'rgba(45,212,191,0.08)',
      borderColor: 'rgba(45,212,191,0.22)',
    },
    bandLabel: {
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.6,
    },
    markers: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },
    marker: {
      width: 8,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    markerWick: {
      position: 'absolute',
      width: 2,
      height: 26,
      borderRadius: 1,
      opacity: 0.45,
    },
    markerBody: {
      width: 7,
      height: 11,
      borderRadius: 2,
      opacity: 0.72,
    },
    resistanceMarker: {
      backgroundColor: theme.colors.risk,
    },
    supportMarker: {
      backgroundColor: theme.colors.primary,
    },
    boundary: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      padding: 10,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: 'rgba(250,204,21,0.20)',
      backgroundColor: 'rgba(250,204,21,0.05)',
    },
    boundaryMark: {
      color: theme.colors.warning,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '900',
    },
    boundaryText: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '800',
    },
  });
