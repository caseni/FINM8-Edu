import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'correlation' | 'drawdown' | 'leverage' | 'concentration' | 'riskBudget' | 'construction';

export interface RiskPortfolioSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('korelasyon-ne-anlatir')) return 'correlation';
  if (assetRef.includes('drawdown-nedir')) return 'drawdown';
  if (assetRef.includes('kaldirac-riski-nasil-buyutur')) return 'leverage';
  if (assetRef.includes('yogunlasma-riski-nedir')) return 'concentration';
  if (assetRef.includes('risk-butcesi-nedir')) return 'riskBudget';
  if (assetRef.includes('portfoy-nasil-kurulur')) return 'construction';
  return undefined;
}

export function isRiskPortfolioSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function RiskPortfolioSlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: RiskPortfolioSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'correlation' ? <CorrelationScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'drawdown' ? <DrawdownScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'leverage' ? <LeverageScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'concentration' ? <ConcentrationScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'riskBudget' ? <RiskBudgetScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'construction' ? <ConstructionScene role={role} tr={tr} styles={styles} /> : null}
      </View>
    </View>
  );
}

type SceneProps = { role: SlideRole; tr: boolean; styles: ReturnType<typeof createStyles> };

function Header({ styles, title, detail }: { styles: ReturnType<typeof createStyles>; title: string; detail: string }) {
  return <View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>;
}

function Card({ styles, label, value, accent = false, warning = false }: { styles: ReturnType<typeof createStyles>; label: string; value: string; accent?: boolean; warning?: boolean }) {
  return <View style={[styles.card, accent && styles.cardAccent, warning && styles.cardWarning]}><Text style={styles.cardLabel}>{label}</Text><Text style={[styles.cardValue, accent && styles.primary, warning && styles.warning]}>{value}</Text></View>;
}

function roleDetail(role: SlideRole, tr: boolean, concept: string) {
  const details: Record<SlideRole, [string, string]> = {
    hook: ['İlk bakışta aynı görünen şey gerçekten aynı risk mi?', 'Does what looks similar at first really carry the same risk?'],
    concept: [`${concept}: mekanizmayı gör`, `${concept}: see the mechanism`],
    practice: ['Kararı tek sayıdan değil, ilişkiden oku.', 'Read the relationship, not one number.'],
    misconception: ['Yaygın kısa yol burada yanıltır.', 'The common shortcut is misleading here.'],
    risk: ['Stres koşulunda ne değişebilir?', 'What can change under stress?'],
    summary: ['Tek cümlelik risk resmi.', 'The one-line risk picture.'],
  };
  return details[role][tr ? 0 : 1];
}

function CorrelationScene({ role, tr, styles }: SceneProps) {
  const diverge = role === 'risk' || role === 'misconception';
  return <><Header styles={styles} title={tr ? 'Korelasyon' : 'Correlation'} detail={roleDetail(role, tr, tr ? 'ortak hareket' : 'co-movement')} /><View style={styles.series}><View style={styles.seriesRow}><Text style={styles.seriesLabel}>A</Text><Text style={styles.primary}>↗  ↘  ↗  ↗</Text></View><View style={styles.seriesRow}><Text style={styles.seriesLabel}>B</Text><Text style={diverge ? styles.warning : styles.success}>{diverge ? '↘  ↗  ↘  ↗' : '↗  ↘  ↗  ↗'}</Text></View></View><Text style={styles.caption}>{tr ? (diverge ? 'İlişki rejimle değişebilir.' : 'Birlikte hareket eğilimi ≠ kesin bağ') : (diverge ? 'The relationship can change with regime.' : 'Co-movement tendency ≠ certainty')}</Text></>;
}

function DrawdownScene({ role, tr, styles }: SceneProps) {
  const deep = role === 'risk' || role === 'misconception';
  return <><Header styles={styles} title="Drawdown" detail={roleDetail(role, tr, tr ? 'zirveden gerileme' : 'decline from peak')} /><View style={styles.drawdownTrack}><View style={styles.peak}><Text style={styles.markerText}>{tr ? 'ZİRVE' : 'PEAK'}</Text></View><View style={[styles.drop, deep && styles.dropDeep]} /><View style={styles.trough}><Text style={styles.markerText}>{tr ? 'DİP' : 'TROUGH'}</Text></View></View><View style={styles.row}><Card styles={styles} label={tr ? 'SONUÇ' : 'END'} value="0%" /><Card styles={styles} label="MAX DD" value={deep ? '-30%' : '-12%'} warning /></View></>;
}

function LeverageScene({ role, tr, styles }: SceneProps) {
  const loss = role === 'risk' || role === 'misconception';
  return <><Header styles={styles} title={tr ? 'Kaldıraç' : 'Leverage'} detail={roleDetail(role, tr, tr ? 'maruziyet büyütme' : 'exposure amplification')} /><View style={styles.row}><Card styles={styles} label="1×" value={loss ? '-5%' : '+5%'} /><Card styles={styles} label="3×" value={loss ? '-15%' : '+15%'} warning={loss} accent={!loss} /></View><View style={styles.flow}><Text style={styles.flowText}>{tr ? 'AYNI FİYAT HAREKETİ' : 'SAME PRICE MOVE'}</Text><Text style={styles.arrow}>→</Text><Text style={styles.flowText}>{tr ? 'FARKLI HESAP ETKİSİ' : 'DIFFERENT ACCOUNT IMPACT'}</Text></View></>;
}

function ConcentrationScene({ role, tr, styles }: SceneProps) {
  const hidden = role === 'misconception' || role === 'risk';
  return <><Header styles={styles} title={tr ? 'Yoğunlaşma' : 'Concentration'} detail={roleDetail(role, tr, tr ? 'ortak risk kaynağı' : 'common risk source')} /><View style={styles.holdings}>{['A','B','C','D','E','F'].map((x) => <View key={x} style={styles.holding}><Text style={styles.holdingText}>{x}</Text></View>)}</View><Text style={styles.arrow}>↓</Text><View style={[styles.factor, hidden && styles.factorWarning]}><Text style={styles.factorText}>{hidden ? (tr ? 'TEK FAKTÖR' : 'ONE FACTOR') : (tr ? 'RİSK KAYNAKLARI' : 'RISK SOURCES')}</Text></View><Text style={styles.caption}>{tr ? 'Varlık sayısı ekonomik çeşitliliği garanti etmez.' : 'Holding count does not guarantee economic diversification.'}</Text></>;
}

function RiskBudgetScene({ role, tr, styles }: SceneProps) {
  const equal = role === 'hook' || role === 'misconception';
  return <><Header styles={styles} title={tr ? 'Risk Bütçesi' : 'Risk Budget'} detail={roleDetail(role, tr, tr ? 'sermaye ≠ risk katkısı' : 'capital ≠ risk contribution')} /><View style={styles.row}><Card styles={styles} label={tr ? 'SERMAYE A' : 'CAPITAL A'} value="50%" /><Card styles={styles} label={tr ? 'SERMAYE B' : 'CAPITAL B'} value="50%" /></View><View style={styles.row}><Card styles={styles} label={tr ? 'RİSK A' : 'RISK A'} value={equal ? '50%?' : '75%'} warning /><Card styles={styles} label={tr ? 'RİSK B' : 'RISK B'} value={equal ? '50%?' : '25%'} accent /></View></>;
}

function ConstructionScene({ role, tr, styles }: SceneProps) {
  const labels = tr ? ['AMAÇ', 'KISIT', 'AĞIRLIK', 'RİSK', 'İZLE'] : ['GOAL', 'LIMITS', 'WEIGHTS', 'RISK', 'MONITOR'];
  return <><Header styles={styles} title={tr ? 'Portföy Oluşturma' : 'Portfolio Construction'} detail={roleDetail(role, tr, tr ? 'birlikte tasarım' : 'system design')} /><View style={styles.construction}>{labels.map((label, index) => <React.Fragment key={label}><View style={[styles.node, role === 'risk' && label === (tr ? 'RİSK' : 'RISK') && styles.nodeWarning]}><Text style={styles.nodeText}>{label}</Text></View>{index < labels.length - 1 ? <Text style={styles.miniArrow}>→</Text> : null}</React.Fragment>)}</View><Text style={styles.caption}>{tr ? 'Tek tek varlık değil, birlikte çalışan risk sistemi.' : 'Not isolated picks—a risk system that works together.'}</Text></>;
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 13, padding: 14 },
  header: { gap: 4 },
  title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' },
  detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  caption: { color: theme.colors.textMuted, fontSize: 10, lineHeight: 15, fontWeight: '700', textAlign: 'center' },
  row: { flexDirection: 'row', gap: 9 },
  card: { flex: 1, minHeight: 70, justifyContent: 'center', gap: 5, padding: 10, borderRadius: 11, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  cardAccent: { borderColor: theme.colors.primary },
  cardWarning: { borderColor: theme.colors.warning },
  cardLabel: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  cardValue: { color: theme.colors.text, fontSize: 15, fontWeight: '900' },
  primary: { color: theme.colors.primary }, success: { color: theme.colors.success }, warning: { color: theme.colors.warning },
  series: { gap: 8, padding: 10, borderRadius: 12, backgroundColor: theme.colors.surfaceMuted },
  seriesRow: { flexDirection: 'row', alignItems: 'center', gap: 12 }, seriesLabel: { width: 20, color: theme.colors.text, fontSize: 11, fontWeight: '900' },
  drawdownTrack: { minHeight: 76, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' },
  peak: { marginTop: 2, padding: 7, borderRadius: 9, backgroundColor: theme.colors.surfaceMuted },
  trough: { marginTop: 48, padding: 7, borderRadius: 9, backgroundColor: theme.colors.surfaceMuted },
  markerText: { color: theme.colors.text, fontSize: 9, fontWeight: '900' },
  drop: { width: 70, height: 34, marginTop: 22, borderBottomWidth: 3, borderColor: theme.colors.warning, transform: [{ rotate: '24deg' }] },
  dropDeep: { height: 52, transform: [{ rotate: '34deg' }] },
  flow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, flowText: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900' }, arrow: { color: theme.colors.primary, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  holdings: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 7 }, holding: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 17, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }, holdingText: { color: theme.colors.text, fontSize: 10, fontWeight: '900' },
  factor: { alignSelf: 'center', paddingVertical: 9, paddingHorizontal: 22, borderRadius: 999, borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: theme.colors.surfaceMuted }, factorWarning: { borderColor: theme.colors.warning }, factorText: { color: theme.colors.text, fontSize: 10, fontWeight: '900' },
  construction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 5 }, node: { paddingVertical: 9, paddingHorizontal: 10, borderRadius: 9, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }, nodeWarning: { borderColor: theme.colors.warning }, nodeText: { color: theme.colors.text, fontSize: 8, fontWeight: '900' }, miniArrow: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '900' },
});
