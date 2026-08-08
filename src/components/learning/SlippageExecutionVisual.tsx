import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface SlippageExecutionVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function SlippageExecutionVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: SlippageExecutionVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Görülen fiyat ≠ gerçekleşme fiyatı' : 'Displayed price ≠ execution price'}
          </Text>
          <Text style={styles.subtitle}>
            {tr
              ? 'Tek emir birden fazla fiyat seviyesini tüketebilir'
              : 'One order can consume multiple price levels'}
          </Text>
        </View>

        <View style={styles.referenceRow}>
          <View style={styles.referenceCard}>
            <Text style={styles.referenceEyebrow}>{tr ? 'EKRANDAKİ SON FİYAT' : 'LAST PRICE ON SCREEN'}</Text>
            <Text style={styles.referencePrice}>100.0</Text>
            <Text style={styles.referenceCaption}>
              {tr ? 'geçmişteki son eşleşme' : 'the latest completed match'}
            </Text>
          </View>

          <Text style={styles.referenceArrow}>→</Text>

          <View style={styles.orderCard}>
            <Text style={styles.orderEyebrow}>{tr ? 'PİYASA ALIM EMRİ' : 'MARKET BUY ORDER'}</Text>
            <Text style={styles.orderSize}>{tr ? '6 birim' : '6 units'}</Text>
            <Text style={styles.orderCaption}>
              {tr ? 'mevcut satış emirlerini sırayla tüketir' : 'consumes available sell orders in sequence'}
            </Text>
          </View>
        </View>

        <View style={styles.depthCard}>
          <View style={styles.depthHeader}>
            <Text style={styles.depthEyebrow}>{tr ? 'MEVCUT SATIŞ SEVİYELERİ' : 'AVAILABLE SELL LEVELS'}</Text>
            <Text style={styles.depthHint}>{tr ? 'şematik örnek' : 'schematic example'}</Text>
          </View>

          <FillLevel
            styles={styles}
            price="100.0"
            quantity={tr ? '2 birim' : '2 units'}
            width="44%"
            step="1"
          />
          <FillLevel
            styles={styles}
            price="100.2"
            quantity={tr ? '2 birim' : '2 units'}
            width="66%"
            step="2"
          />
          <FillLevel
            styles={styles}
            price="100.5"
            quantity={tr ? '2 birim' : '2 units'}
            width="88%"
            step="3"
          />
        </View>

        <View style={styles.resultRow}>
          <View style={styles.resultCard}>
            <Text style={styles.resultEyebrow}>{tr ? 'ORTALAMA GERÇEKLEŞME' : 'AVERAGE EXECUTION'}</Text>
            <Text style={styles.resultPrice}>100.23</Text>
            <Text style={styles.resultCaption}>
              (100.0×2 + 100.2×2 + 100.5×2) / 6
            </Text>
          </View>

          <View style={styles.slippageCard}>
            <Text style={styles.slippageEyebrow}>{tr ? 'KAYMA / SLIPPAGE' : 'SLIPPAGE'}</Text>
            <Text style={styles.slippageValue}>+0.23</Text>
            <Text style={styles.slippageCaption}>
              {tr ? 'beklenen 100.0 → ortalama 100.23' : 'expected 100.0 → average 100.23'}
            </Text>
          </View>
        </View>

        <View style={styles.boundary}>
          <Text style={styles.boundaryEyebrow}>{tr ? 'NEDEN OLABİLİR?' : 'WHY CAN THIS HAPPEN?'}</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Fiyat değişimi, gecikme, spread, emir büyüklüğü ve sığ derinlik gerçekleşmeyi ekrandaki referanstan uzaklaştırabilir.'
              : 'Price moves, latency, spread, order size, and shallow depth can move execution away from the displayed reference.'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function FillLevel({
  styles,
  price,
  quantity,
  width,
  step,
}: {
  styles: ReturnType<typeof createStyles>;
  price: string;
  quantity: string;
  width: '44%' | '66%' | '88%';
  step: string;
}) {
  return (
    <View style={styles.levelRow}>
      <View style={styles.levelStep}>
        <Text style={styles.levelStepText}>{step}</Text>
      </View>
      <View style={styles.levelMeta}>
        <Text style={styles.levelPrice}>{price}</Text>
        <Text style={styles.levelQuantity}>{quantity}</Text>
      </View>
      <View style={styles.levelTrack}>
        <View style={[styles.levelFill, { width }]} />
      </View>
      <Text style={styles.levelConsumed}>✓</Text>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 382,
      overflow: 'hidden',
      borderRadius: theme.radius.large,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    canvas: {
      minHeight: 334,
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
    referenceRow: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: 7,
    },
    referenceCard: {
      flex: 1,
      minHeight: 82,
      justifyContent: 'center',
      gap: 2,
      padding: 9,
      borderRadius: 11,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: 'rgba(159,176,195,0.14)',
    },
    referenceEyebrow: {
      color: theme.colors.textMuted,
      fontSize: 7,
      lineHeight: 10,
      fontWeight: '900',
      letterSpacing: 0.45,
    },
    referencePrice: {
      color: theme.colors.text,
      fontSize: 22,
      lineHeight: 26,
      fontWeight: '900',
    },
    referenceCaption: {
      color: theme.colors.textMuted,
      fontSize: 8,
      lineHeight: 11,
      fontWeight: '700',
    },
    referenceArrow: {
      alignSelf: 'center',
      color: theme.colors.primary,
      fontSize: 17,
      fontWeight: '900',
    },
    orderCard: {
      flex: 1,
      minHeight: 82,
      justifyContent: 'center',
      gap: 2,
      padding: 9,
      borderRadius: 11,
      backgroundColor: 'rgba(45,212,191,0.07)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.25)',
    },
    orderEyebrow: {
      color: theme.colors.primary,
      fontSize: 7,
      lineHeight: 10,
      fontWeight: '900',
      letterSpacing: 0.45,
    },
    orderSize: {
      color: theme.colors.text,
      fontSize: 16,
      lineHeight: 21,
      fontWeight: '900',
    },
    orderCaption: {
      color: theme.colors.textMuted,
      fontSize: 8,
      lineHeight: 11,
      fontWeight: '700',
    },
    depthCard: {
      gap: 6,
      padding: 9,
      borderRadius: 11,
      backgroundColor: 'rgba(159,176,195,0.04)',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    depthHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    depthEyebrow: {
      color: theme.colors.text,
      fontSize: 8,
      lineHeight: 11,
      fontWeight: '900',
      letterSpacing: 0.4,
    },
    depthHint: {
      color: theme.colors.textMuted,
      fontSize: 7,
      lineHeight: 10,
      fontWeight: '700',
    },
    levelRow: {
      minHeight: 26,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    levelStep: {
      width: 18,
      height: 18,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9,
      backgroundColor: 'rgba(45,212,191,0.10)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.20)',
    },
    levelStepText: {
      color: theme.colors.primary,
      fontSize: 7,
      fontWeight: '900',
    },
    levelMeta: { width: 58, gap: 0 },
    levelPrice: {
      color: theme.colors.text,
      fontSize: 9,
      lineHeight: 11,
      fontWeight: '900',
    },
    levelQuantity: {
      color: theme.colors.textMuted,
      fontSize: 7,
      lineHeight: 9,
      fontWeight: '700',
    },
    levelTrack: {
      flex: 1,
      height: 8,
      overflow: 'hidden',
      borderRadius: 5,
      backgroundColor: 'rgba(159,176,195,0.09)',
    },
    levelFill: {
      height: '100%',
      borderRadius: 5,
      backgroundColor: 'rgba(45,212,191,0.48)',
    },
    levelConsumed: {
      width: 14,
      color: theme.colors.success,
      fontSize: 10,
      fontWeight: '900',
      textAlign: 'center',
    },
    resultRow: {
      flexDirection: 'row',
      gap: 7,
    },
    resultCard: {
      flex: 1,
      minHeight: 74,
      justifyContent: 'center',
      gap: 1,
      padding: 9,
      borderRadius: 11,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: 'rgba(159,176,195,0.13)',
    },
    resultEyebrow: {
      color: theme.colors.textMuted,
      fontSize: 7,
      lineHeight: 10,
      fontWeight: '900',
      letterSpacing: 0.4,
    },
    resultPrice: {
      color: theme.colors.text,
      fontSize: 18,
      lineHeight: 22,
      fontWeight: '900',
    },
    resultCaption: {
      color: theme.colors.textMuted,
      fontSize: 6,
      lineHeight: 9,
      fontWeight: '700',
    },
    slippageCard: {
      flex: 1,
      minHeight: 74,
      justifyContent: 'center',
      gap: 1,
      padding: 9,
      borderRadius: 11,
      backgroundColor: 'rgba(250,204,21,0.06)',
      borderWidth: 1,
      borderColor: 'rgba(250,204,21,0.24)',
    },
    slippageEyebrow: {
      color: theme.colors.warning,
      fontSize: 7,
      lineHeight: 10,
      fontWeight: '900',
      letterSpacing: 0.4,
    },
    slippageValue: {
      color: theme.colors.warning,
      fontSize: 18,
      lineHeight: 22,
      fontWeight: '900',
    },
    slippageCaption: {
      color: theme.colors.textMuted,
      fontSize: 7,
      lineHeight: 10,
      fontWeight: '700',
    },
    boundary: {
      gap: 2,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 10,
      backgroundColor: 'rgba(45,212,191,0.06)',
      borderWidth: 1,
      borderColor: 'rgba(45,212,191,0.20)',
    },
    boundaryEyebrow: {
      color: theme.colors.primary,
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 0.45,
    },
    boundaryText: {
      color: theme.colors.text,
      fontSize: 8,
      lineHeight: 12,
      fontWeight: '700',
    },
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
