import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

export interface DiversificationVisualProps {
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function DiversificationVisual({
  alt,
  language,
  theme = defaultLearningTheme,
}: DiversificationVisualProps) {
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tr ? 'Çeşitlendirme = sadece varlık sayısı değil' : 'Diversification = more than asset count'}
          </Text>
          <Text style={styles.subtitle}>
            {tr ? 'Asıl soru: aynı risk kaynağına mı bağlılar?' : 'The key question: do they share the same risk source?'}
          </Text>
        </View>

        <View style={styles.comparison}>
          <BasketCard
            styles={styles}
            tone="risk"
            eyebrow={tr ? 'ÇOK İSİM · TEK ETKEN' : 'MANY NAMES · ONE DRIVER'}
            items={tr ? ['Varlık A', 'Varlık B', 'Varlık C'] : ['Asset A', 'Asset B', 'Asset C']}
            driver={tr ? 'AYNI SEKTÖR / ORTAK RİSK' : 'SAME SECTOR / SHARED RISK'}
            result={tr ? 'Birlikte etkilenebilir' : 'Can be hit together'}
          />
          <BasketCard
            styles={styles}
            tone="balanced"
            eyebrow={tr ? 'FARKLI RİSK KAYNAKLARI' : 'DIFFERENT RISK SOURCES'}
            items={tr ? ['Hisse', 'Tahvil', 'Nakit'] : ['Stock', 'Bond', 'Cash']}
            driver={tr ? 'FARKLI ETKENLER' : 'DIFFERENT DRIVERS'}
            result={tr ? 'Tek etkene bağımlılık azalabilir' : 'Reliance on one driver can fall'}
          />
        </View>

        <View style={styles.logicCard}>
          <Text style={styles.logicEyebrow}>{tr ? '5 SANİYELİK KONTROL' : '5-SECOND CHECK'}</Text>
          <View style={styles.logicRow}>
            <Text style={styles.logicNumber}>1</Text>
            <Text style={styles.logicText}>{tr ? 'Kaç varlık var?' : 'How many holdings?'}</Text>
          </View>
          <Text style={styles.logicArrow}>↓</Text>
          <View style={[styles.logicRow, styles.logicRowActive]}>
            <Text style={[styles.logicNumber, styles.logicNumberActive]}>2</Text>
            <Text style={styles.logicTextStrong}>
              {tr ? 'Aynı şokta birlikte mi etkilenirler?' : 'Would the same shock affect them together?'}
            </Text>
          </View>
        </View>

        <View style={styles.traderCard}>
          <Text style={styles.traderEyebrow}>{tr ? 'TRADER PRATİK' : 'TRADER PRACTICAL'}</Text>
          <Text style={styles.traderText}>
            {tr
              ? 'Farklı semboller taşımak tek başına yeterli değildir. Ortak sektör, faiz, kur, piyasa ve likidite etkilerini de kontrol et.'
              : 'Different tickers alone are not enough. Also check shared sector, rates, currency, market, and liquidity drivers.'}
          </Text>
        </View>

        <View style={styles.boundaryCard}>
          <Text style={styles.boundaryMark}>!</Text>
          <Text style={styles.boundaryText}>
            {tr
              ? 'Çeşitlendirme yoğunlaşma riskini azaltabilir; piyasa çapındaki kaybı garantiyle engellemez.'
              : 'Diversification can reduce concentration risk; it cannot guarantee protection from market-wide losses.'}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
      </View>
    </View>
  );
}

function BasketCard({
  styles,
  tone,
  eyebrow,
  items,
  driver,
  result,
}: {
  styles: ReturnType<typeof createStyles>;
  tone: 'risk' | 'balanced';
  eyebrow: string;
  items: readonly string[];
  driver: string;
  result: string;
}) {
  const risk = tone === 'risk';
  return (
    <View style={[styles.basketCard, risk ? styles.basketRisk : styles.basketBalanced]}>
      <Text style={[styles.basketEyebrow, risk ? styles.riskText : styles.goodText]}>{eyebrow}</Text>
      <View style={styles.itemStack}>
        {items.map((item) => (
          <View key={item} style={styles.assetChip}>
            <View style={[styles.assetDot, risk ? styles.assetDotRisk : styles.assetDotGood]} />
            <Text style={styles.assetText}>{item}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.downArrow}>↓</Text>
      <View style={[styles.driverPill, risk ? styles.driverRisk : styles.driverGood]}>
        <Text style={[styles.driverText, risk ? styles.riskText : styles.goodText]}>{driver}</Text>
      </View>
      <Text style={styles.resultText}>{result}</Text>
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
    canvas: { padding: theme.spacing.md, gap: 12 },
    header: { alignItems: 'center', gap: 4, paddingHorizontal: 4 },
    title: { color: theme.colors.text, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
    subtitle: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
    comparison: { flexDirection: 'row', gap: 10 },
    basketCard: { flex: 1, gap: 7, padding: 10, borderRadius: 12, borderWidth: 1, backgroundColor: theme.colors.surfaceMuted },
    basketRisk: { borderColor: 'rgba(251,113,133,0.30)' },
    basketBalanced: { borderColor: 'rgba(45,212,191,0.30)' },
    basketEyebrow: { minHeight: 26, fontSize: 9, lineHeight: 13, fontWeight: '900', letterSpacing: 0.35, textAlign: 'center' },
    riskText: { color: theme.colors.risk },
    goodText: { color: theme.colors.primary },
    itemStack: { gap: 5 },
    assetChip: { minHeight: 25, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 7, borderRadius: 7, backgroundColor: theme.colors.background },
    assetDot: { width: 7, height: 7, borderRadius: 4 },
    assetDotRisk: { backgroundColor: theme.colors.risk },
    assetDotGood: { backgroundColor: theme.colors.primary },
    assetText: { flex: 1, color: theme.colors.text, fontSize: 9, fontWeight: '800' },
    downArrow: { color: theme.colors.textMuted, fontSize: 13, lineHeight: 14, fontWeight: '900', textAlign: 'center' },
    driverPill: { minHeight: 31, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, borderRadius: 8, borderWidth: 1 },
    driverRisk: { borderColor: 'rgba(251,113,133,0.34)', backgroundColor: 'rgba(251,113,133,0.07)' },
    driverGood: { borderColor: 'rgba(45,212,191,0.34)', backgroundColor: 'rgba(45,212,191,0.07)' },
    driverText: { fontSize: 8, lineHeight: 12, fontWeight: '900', textAlign: 'center' },
    resultText: { minHeight: 28, color: theme.colors.textMuted, fontSize: 9, lineHeight: 13, fontWeight: '700', textAlign: 'center' },
    logicCard: { gap: 5, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    logicEyebrow: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    logicRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, backgroundColor: theme.colors.background },
    logicRowActive: { borderWidth: 1, borderColor: 'rgba(45,212,191,0.34)', backgroundColor: 'rgba(45,212,191,0.05)' },
    logicNumber: { width: 19, height: 19, borderRadius: 10, overflow: 'hidden', color: theme.colors.textMuted, fontSize: 9, lineHeight: 19, textAlign: 'center', fontWeight: '900', backgroundColor: 'rgba(159,176,195,0.14)' },
    logicNumberActive: { color: theme.colors.primaryText, backgroundColor: theme.colors.primary },
    logicText: { flex: 1, color: theme.colors.textMuted, fontSize: 10, lineHeight: 14, fontWeight: '700' },
    logicTextStrong: { flex: 1, color: theme.colors.text, fontSize: 10, lineHeight: 14, fontWeight: '900' },
    logicArrow: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 11, fontWeight: '900', textAlign: 'center' },
    traderCard: { gap: 4, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(45,212,191,0.25)', backgroundColor: 'rgba(45,212,191,0.05)' },
    traderEyebrow: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    traderText: { color: theme.colors.text, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    boundaryCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' },
    boundaryMark: { width: 18, color: theme.colors.warning, fontSize: 17, lineHeight: 20, fontWeight: '900' },
    boundaryText: { flex: 1, color: theme.colors.textMuted, fontSize: 10, lineHeight: 15, fontWeight: '700' },
    footer: { minHeight: 44, justifyContent: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
    alt: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  });
