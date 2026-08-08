import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface CandleAnatomyVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function CandleAnatomyVisual({
  language,
  theme = defaultLearningTheme,
}: CandleAnatomyVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';
  const accessibilityLabel = tr
    ? 'Gövdesi ile üst ve alt fitilleri gösterilen tek mum şeması'
    : 'Single candlestick diagram showing its body and upper and lower wicks';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Bir mum, seçilen sürenin özetidir' : 'One candle summarizes the selected period'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Başlangıç, bitiş ve ulaşılan uç noktaları gösterir.'
              : 'It shows the start, the finish, and the extremes reached.'}
          </Text>
        </View>

        <View style={styles.diagramCard}>
          <View style={styles.candleColumn}>
            <Text style={styles.edgeLabel}>{tr ? 'ÜST UÇ' : 'UPPER END'}</Text>
            <View style={styles.candle}>
              <View style={styles.wick} />
              <View style={styles.body}>
                <Text style={styles.bodyText}>
                  {tr ? 'BAŞLANGIÇ\n↕\nBİTİŞ' : 'START\n↕\nFINISH'}
                </Text>
              </View>
              <View style={styles.wick} />
            </View>
            <Text style={styles.edgeLabel}>{tr ? 'ALT UÇ' : 'LOWER END'}</Text>
          </View>
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendCard}>
            <View style={styles.bodySwatch} />
            <View style={styles.legendCopy}>
              <Text style={styles.legendTitle}>{tr ? 'GÖVDE' : 'BODY'}</Text>
              <Text style={styles.legendText}>
                {tr ? 'Başlangıç ile bitiş arasındaki bölüm' : 'The section between start and finish'}
              </Text>
            </View>
          </View>
          <View style={styles.legendCard}>
            <View style={styles.wickSwatch} />
            <View style={styles.legendCopy}>
              <Text style={styles.legendTitle}>{tr ? 'FİTİL' : 'WICK'}</Text>
              <Text style={styles.legendText}>
                {tr ? 'Gövdenin üstündeki ve altındaki ince çizgi' : 'The thin line above and below the body'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.boundary}>
          <Text style={styles.boundaryMark}>!</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Mum yalnız seçilen dönemi anlatır; sonraki hareketi garanti etmez.'
              : 'A candle describes only the selected period; it does not guarantee the next move.'}
          </Text>
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
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
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
    diagramCard: {
      minHeight: 138,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 13,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    candleColumn: {
      alignItems: 'center',
      gap: 5,
    },
    edgeLabel: {
      color: theme.colors.textMuted,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.7,
    },
    candle: {
      alignItems: 'center',
    },
    wick: {
      width: 2,
      height: 27,
      borderRadius: 1,
      backgroundColor: 'rgba(159,176,195,0.76)',
    },
    body: {
      width: 66,
      minHeight: 58,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      borderRadius: 7,
      backgroundColor: 'rgba(45,212,191,0.14)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.34)',
    },
    bodyText: {
      color: theme.colors.primary,
      fontSize: 9,
      lineHeight: 12,
      fontWeight: '900',
      letterSpacing: 0.45,
      textAlign: 'center',
    },
    legendRow: {
      flexDirection: 'row',
      gap: 8,
    },
    legendCard: {
      flex: 1,
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 9,
      borderRadius: 10,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    bodySwatch: {
      width: 14,
      height: 28,
      borderRadius: 4,
      backgroundColor: 'rgba(45,212,191,0.14)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.34)',
    },
    wickSwatch: {
      width: 2,
      height: 31,
      marginHorizontal: 6,
      borderRadius: 1,
      backgroundColor: 'rgba(159,176,195,0.76)',
    },
    legendCopy: {
      flex: 1,
      gap: 2,
    },
    legendTitle: {
      color: theme.colors.text,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.6,
    },
    legendText: {
      color: theme.colors.textMuted,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '700',
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
