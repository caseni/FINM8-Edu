import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

interface LearningVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function LearningVisual({ assetRef, alt, language, theme = defaultLearningTheme }: LearningVisualProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const progress = useMemo(() => new Animated.Value(1), []);
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => setReduceMotion(false));
  }, []);

  const play = () => {
    if (reduceMotion) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 900, useNativeDriver: true }).start();
  };

  useEffect(play, [assetRef, reduceMotion]);

  const animatedStyle = {
    opacity: progress,
    transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
  };

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <Animated.View style={[styles.canvas, animatedStyle]}>
        <VisualScene assetRef={assetRef} styles={styles} progress={progress} language={language} />
      </Animated.View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
        {!reduceMotion ? (
          <Pressable accessibilityRole="button" onPress={play} style={styles.replay}>
            <Text style={styles.replayText}>{language === 'tr' ? '↻ Tekrar' : '↻ Replay'}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function VisualScene({ assetRef, styles, progress, language }: { assetRef: string; styles: ReturnType<typeof createStyles>; progress: Animated.Value; language: LearningLanguage }) {
  if (assetRef.includes('bir-mum') || assetRef.includes('candle-ohlc')) return <CandleScene styles={styles} language={language} />;
  if (assetRef.includes('zaman-dilimi') || assetRef.includes('timeframes')) return <TimeframeScene styles={styles} language={language} />;
  if (assetRef.includes('trend-yon') || assetRef.includes('trend-structure')) return <TrendScene styles={styles} language={language} />;
  if (assetRef.includes('destek-direnc') || assetRef.includes('support-resistance')) return <ZoneScene styles={styles} language={language} />;
  if (assetRef.includes('bos-')) return <StructureScene styles={styles} progress={progress} mode="bos" language={language} />;
  if (assetRef.includes('choch')) return <StructureScene styles={styles} progress={progress} mode="choch" language={language} />;
  if (assetRef.includes('volatilite')) return <VolatilityScene styles={styles} language={language} />;
  if (assetRef.includes('cok-varlik')) return <DiversificationScene styles={styles} language={language} />;
  return <GenericScene styles={styles} language={language} />;
}

function CandleScene({ styles, language }: SceneProps) {
  return <View style={styles.center}><View style={styles.wick} /><View style={styles.candleBody} /><Label style={styles.highLabel} text={language === 'tr' ? 'En yüksek' : 'High'} /><Label style={styles.lowLabel} text={language === 'tr' ? 'En düşük' : 'Low'} /><Label style={styles.openLabel} text={language === 'tr' ? 'Açılış' : 'Open'} /><Label style={styles.closeLabel} text={language === 'tr' ? 'Kapanış' : 'Close'} /></View>;
}

function TimeframeScene({ styles, language }: SceneProps) {
  return <View style={styles.sceneColumn}><MiniBars styles={styles} count={12} activeEvery={3} /><Text style={styles.sceneLabel}>15m • {language === 'tr' ? 'ayrıntı' : 'detail'}</Text><MiniBars styles={styles} count={6} activeEvery={2} /><Text style={styles.sceneLabel}>1h • {language === 'tr' ? 'ara ölçek' : 'mid scale'}</Text><MiniBars styles={styles} count={3} activeEvery={1} /><Text style={styles.sceneLabel}>1D • {language === 'tr' ? 'geniş yapı' : 'broad structure'}</Text></View>;
}

function MiniBars({ styles, count, activeEvery }: { styles: ReturnType<typeof createStyles>; count: number; activeEvery: number }) {
  return <View style={styles.barRow}>{Array.from({ length: count }, (_, index) => <View key={index} style={[styles.miniBar, index % activeEvery === 0 && styles.miniBarActive, { height: 18 + ((index * 11) % 34) }]} />)}</View>;
}

function TrendScene({ styles, language }: SceneProps) {
  return <View style={styles.sceneColumn}><Text style={styles.sceneTitle}>{language === 'tr' ? 'Salınım dizisi' : 'Swing sequence'}</Text><View style={styles.trendRow}>{[18, 42, 28, 62, 46, 82].map((height, index) => <View key={index} style={styles.trendPointWrap}><View style={[styles.trendPoint, { bottom: height }]} /></View>)}</View><View style={styles.legendRow}><Text style={styles.positive}>HH ↑</Text><Text style={styles.positive}>HL ↑</Text><Text style={styles.sceneLabel}>{language === 'tr' ? 'tek mum değil' : 'not one candle'}</Text></View></View>;
}

function ZoneScene({ styles, language }: SceneProps) {
  return <View style={styles.sceneColumn}><View style={[styles.zone, styles.resistanceZone]}><Text style={styles.zoneText}>{language === 'tr' ? 'DİRENÇ BÖLGESİ' : 'RESISTANCE ZONE'}</Text></View><View style={styles.zoneCandles}>{[34, 68, 50, 78, 45, 62].map((height, index) => <View key={index} style={[styles.zoneCandle, { height }]} />)}</View><View style={[styles.zone, styles.supportZone]}><Text style={styles.zoneText}>{language === 'tr' ? 'DESTEK BÖLGESİ' : 'SUPPORT ZONE'}</Text></View></View>;
}

function StructureScene({ styles, progress, mode, language }: { styles: ReturnType<typeof createStyles>; progress: Animated.Value; mode: 'bos' | 'choch'; language: LearningLanguage }) {
  const markerX = progress.interpolate({ inputRange: [0, 1], outputRange: [-70, 70] });
  return <View style={styles.center}><View style={styles.structureLevel} /><Text style={styles.structureLabel}>{mode === 'bos' ? (language === 'tr' ? 'Anlamlı yapı seviyesi' : 'Meaningful structure level') : (language === 'tr' ? 'Korunan salınım' : 'Protected swing')}</Text><View style={styles.structurePath}>{[22, 52, 36, 76, 54].map((height, index) => <View key={index} style={[styles.structurePoint, { bottom: height }]} />)}</View><Animated.View style={[styles.breakMarker, { transform: [{ translateX: markerX }], backgroundColor: mode === 'bos' ? '#2DD4BF' : '#FBBF24' }]} /><Text style={styles.breakLabel}>{mode === 'bos' ? 'BOS' : 'CHoCH'} • {language === 'tr' ? 'teyit izle' : 'seek confirmation'}</Text></View>;
}

function VolatilityScene({ styles, language }: SceneProps) {
  return <View style={styles.sceneColumn}><Text style={styles.sceneLabel}>{language === 'tr' ? 'Düşük volatilite' : 'Lower volatility'}</Text><View style={styles.volRow}>{[28, 34, 30, 38, 32, 36].map((height, index) => <View key={index} style={[styles.volBar, { height }]} />)}</View><Text style={styles.warning}>{language === 'tr' ? 'Yüksek volatilite • daha geniş sonuç aralığı' : 'Higher volatility • wider outcome range'}</Text><View style={styles.volRow}>{[24, 72, 34, 88, 30, 76].map((height, index) => <View key={index} style={[styles.volBar, styles.volBarRisk, { height }]} />)}</View></View>;
}

function DiversificationScene({ styles, language }: SceneProps) {
  return <View style={styles.diversificationRow}><View style={styles.basket}><Text style={styles.sceneTitle}>{language === 'tr' ? 'Aynı faktör' : 'Same factor'}</Text><View style={styles.chipRow}>{['A', 'B', 'C', 'D'].map((item) => <View key={item} style={[styles.chip, styles.chipRisk]}><Text style={styles.chipText}>{item}</Text></View>)}</View><Text style={styles.warning}>{language === 'tr' ? 'Yoğunlaşma' : 'Concentration'}</Text></View><View style={styles.basket}><Text style={styles.sceneTitle}>{language === 'tr' ? 'Farklı riskler' : 'Different risks'}</Text><View style={styles.chipRow}>{['A', 'B', 'C', 'D'].map((item, index) => <View key={item} style={[styles.chip, index % 2 === 0 ? styles.chipGood : styles.chipWarn]}><Text style={styles.chipText}>{item}</Text></View>)}</View><Text style={styles.positive}>{language === 'tr' ? 'Dağılım' : 'Spread'}</Text></View></View>;
}

function GenericScene({ styles, language }: SceneProps) {
  return <View style={styles.center}><Text style={styles.genericIcon}>◎</Text><Text style={styles.sceneTitle}>{language === 'tr' ? 'Şematik eğitim görseli' : 'Schematic learning visual'}</Text></View>;
}

function Label({ style, text }: { style: object; text: string }) { return <Text style={[style]}>{text}</Text>; }
type SceneProps = { styles: ReturnType<typeof createStyles>; language: LearningLanguage };

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 250, overflow: 'hidden', borderRadius: theme.radius.large, backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border },
  canvas: { minHeight: 205, padding: theme.spacing.md, justifyContent: 'center' },
  footer: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
  alt: { flex: 1, color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  replay: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 9, backgroundColor: theme.colors.surfaceMuted },
  replayText: { color: theme.colors.primary, fontSize: 11, fontWeight: '800' },
  center: { height: 170, alignItems: 'center', justifyContent: 'center' },
  sceneColumn: { minHeight: 170, justifyContent: 'center', gap: 7 },
  sceneTitle: { color: theme.colors.text, fontSize: 13, fontWeight: '800', textAlign: 'center' },
  sceneLabel: { color: theme.colors.textMuted, fontSize: 10, textAlign: 'center' },
  wick: { position: 'absolute', width: 3, height: 145, backgroundColor: theme.colors.textMuted },
  candleBody: { width: 55, height: 78, borderRadius: 5, backgroundColor: theme.colors.primary, borderWidth: 2, borderColor: '#5EEAD4' },
  highLabel: { position: 'absolute', top: 4, color: theme.colors.warning, fontSize: 11, fontWeight: '700' },
  lowLabel: { position: 'absolute', bottom: 2, color: theme.colors.warning, fontSize: 11, fontWeight: '700' },
  openLabel: { position: 'absolute', left: '23%', top: 94, color: theme.colors.textMuted, fontSize: 11 },
  closeLabel: { position: 'absolute', right: '21%', top: 49, color: theme.colors.text, fontSize: 11 },
  barRow: { height: 44, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 4 },
  miniBar: { width: 9, borderRadius: 3, backgroundColor: '#294057' },
  miniBarActive: { backgroundColor: theme.colors.primary },
  trendRow: { height: 100, flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  trendPointWrap: { flex: 1, position: 'relative' },
  trendPoint: { position: 'absolute', left: '40%', width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.primary },
  legendRow: { flexDirection: 'row', justifyContent: 'space-around' },
  positive: { color: theme.colors.success, fontSize: 11, fontWeight: '800' },
  warning: { color: theme.colors.warning, fontSize: 11, fontWeight: '800', textAlign: 'center' },
  zone: { height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  resistanceZone: { backgroundColor: 'rgba(251,113,133,0.22)', borderWidth: 1, borderColor: theme.colors.risk },
  supportZone: { backgroundColor: 'rgba(45,212,191,0.18)', borderWidth: 1, borderColor: theme.colors.primary },
  zoneText: { color: theme.colors.text, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  zoneCandles: { height: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  zoneCandle: { width: 12, borderRadius: 3, backgroundColor: theme.colors.textMuted },
  structureLevel: { position: 'absolute', left: 30, right: 30, top: 58, height: 2, backgroundColor: theme.colors.warning },
  structureLabel: { position: 'absolute', top: 35, color: theme.colors.warning, fontSize: 10, fontWeight: '700' },
  structurePath: { position: 'absolute', left: 35, right: 35, bottom: 30, height: 110, flexDirection: 'row', justifyContent: 'space-around' },
  structurePoint: { position: 'relative', width: 11, height: 11, borderRadius: 6, backgroundColor: theme.colors.textMuted },
  breakMarker: { position: 'absolute', top: 48, width: 18, height: 18, borderRadius: 9 },
  breakLabel: { position: 'absolute', bottom: 3, color: theme.colors.text, fontSize: 11, fontWeight: '800' },
  volRow: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  volBar: { width: 15, borderRadius: 4, backgroundColor: theme.colors.primary },
  volBarRisk: { backgroundColor: theme.colors.risk },
  diversificationRow: { minHeight: 170, flexDirection: 'row', gap: 10 },
  basket: { flex: 1, justifyContent: 'center', gap: 14, padding: 10, borderRadius: 12, backgroundColor: theme.colors.surfaceMuted },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 7 },
  chip: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  chipRisk: { backgroundColor: theme.colors.risk },
  chipGood: { backgroundColor: theme.colors.primary },
  chipWarn: { backgroundColor: theme.colors.warning },
  chipText: { color: theme.colors.primaryText, fontSize: 11, fontWeight: '900' },
  genericIcon: { color: theme.colors.primary, fontSize: 54, fontWeight: '300' },
});
