import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'riskFactors' | 'rebalancing' | 'liquidityRisk' | 'tailRisk' | 'stressTesting' | 'lossRecovery';

export interface RiskPortfolioExpansionSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('portfoy-risk-faktorleri')) return 'riskFactors';
  if (assetRef.includes('yeniden-dengeleme-neden-yapilir')) return 'rebalancing';
  if (assetRef.includes('likidite-riski-ne-zaman-buyur')) return 'liquidityRisk';
  if (assetRef.includes('tail-risk-nedir')) return 'tailRisk';
  if (assetRef.includes('stres-testi-ne-ise-yarar')) return 'stressTesting';
  if (assetRef.includes('buyuk-kayip-neden-zor-toparlanir')) return 'lossRecovery';
  return undefined;
}

export function isRiskPortfolioExpansionSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function RiskPortfolioExpansionSlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: RiskPortfolioExpansionSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';
  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'riskFactors' ? <RiskFactorsScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'rebalancing' ? <RebalancingScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'liquidityRisk' ? <LiquidityScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'tailRisk' ? <TailScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'stressTesting' ? <StressScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'lossRecovery' ? <RecoveryScene role={role} tr={tr} styles={styles} /> : null}
      </View>
    </View>
  );
}

type SceneProps = { role: SlideRole; tr: boolean; styles: ReturnType<typeof createStyles> };
function Header({ styles, title, detail }: { styles: ReturnType<typeof createStyles>; title: string; detail: string }) { return <View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>; }
function Box({ styles, label, warning = false }: { styles: ReturnType<typeof createStyles>; label: string; warning?: boolean }) { return <View style={[styles.box, warning && styles.boxWarning]}><Text style={styles.boxText}>{label}</Text></View>; }
function roleHint(role: SlideRole, tr: boolean) {
  const copy: Record<SlideRole, [string, string]> = {
    hook: ['İlk bakıştaki varsayımı sorgula.', 'Question the first assumption.'],
    concept: ['Mekanizmayı parçalara ayır.', 'Break the mechanism into parts.'],
    practice: ['Senaryoda hangi risk baskın?', 'Which risk dominates the scenario?'],
    misconception: ['Kısa yol yanıltabilir.', 'The shortcut can mislead.'],
    risk: ['Stres koşulunu düşün.', 'Think about stress conditions.'],
    summary: ['Ana risk ilişkisini hatırla.', 'Remember the core risk relationship.'],
  };
  return copy[role][tr ? 0 : 1];
}

function RiskFactorsScene({ role, tr, styles }: SceneProps) {
  return <>{role !== 'summary' ? <Header styles={styles} title={tr ? 'Risk Faktörleri' : 'Risk Factors'} detail={roleHint(role, tr)} /> : null}<View style={styles.row}><Box styles={styles} label="STOCK" /><Box styles={styles} label="ETF" /><Box styles={styles} label="BOND" /></View><Text style={styles.arrow}>↓</Text><View style={styles.row}><Box styles={styles} label={tr ? 'FAİZ' : 'RATES'} warning={role === 'risk'} /><Box styles={styles} label={tr ? 'BÜYÜME' : 'GROWTH'} /><Box styles={styles} label="FX" /></View></>;
}
function RebalancingScene({ role, tr, styles }: SceneProps) {
  const drift = role === 'hook' || role === 'misconception';
  return <>{role !== 'summary' ? <Header styles={styles} title={tr ? 'Yeniden Dengeleme' : 'Rebalancing'} detail={roleHint(role, tr)} /> : null}<View style={styles.row}><Box styles={styles} label={drift ? '70%' : '50%'} warning={drift} /><Box styles={styles} label={drift ? '30%' : '50%'} /></View><Text style={styles.arrow}>→</Text><View style={styles.target}><Text style={styles.targetText}>{tr ? 'HEDEF RİSK YAPISI' : 'TARGET RISK STRUCTURE'}</Text></View></>;
}
function LiquidityScene({ role, tr, styles }: SceneProps) {
  const stress = role === 'risk' || role === 'misconception';
  return <>{role !== 'summary' ? <Header styles={styles} title={tr ? 'Likidite Riski' : 'Liquidity Risk'} detail={roleHint(role, tr)} /> : null}<View style={styles.depth}><Text style={styles.depthLabel}>{tr ? 'POZİSYON' : 'POSITION'}</Text><View style={[styles.depthBar, { width: stress ? '88%' : '46%' }]} /></View><View style={styles.row}><Box styles={styles} label={stress ? (tr ? 'SIĞ' : 'SHALLOW') : (tr ? 'DERİN' : 'DEEP')} warning={stress} /><Box styles={styles} label={stress ? (tr ? 'GENİŞ SPREAD' : 'WIDE SPREAD') : (tr ? 'DAR SPREAD' : 'TIGHT SPREAD')} warning={stress} /></View></>;
}
function TailScene({ role, tr, styles }: SceneProps) {
  const emphasize = role === 'risk' || role === 'summary';
  return <>{role !== 'summary' ? <Header styles={styles} title="Tail Risk" detail={roleHint(role, tr)} /> : null}<View style={styles.distribution}>{[24,38,58,78,58,38,24].map((h, i) => <View key={i} style={[styles.distBar, { height: h }]} />)}<View style={[styles.tailBar, emphasize && styles.tailBarStrong]} /></View><Text style={styles.caption}>{tr ? 'Nadir ≠ önemsiz' : 'Rare ≠ irrelevant'}</Text></>;
}
function StressScene({ role, tr, styles }: SceneProps) {
  return <>{role !== 'summary' ? <Header styles={styles} title={tr ? 'Stres Testi' : 'Stress Test'} detail={roleHint(role, tr)} /> : null}<View style={styles.centerNode}><Text style={styles.centerText}>{tr ? 'PORTFÖY' : 'PORTFOLIO'}</Text></View><View style={styles.row}><Box styles={styles} label={tr ? 'FAİZ ŞOKU' : 'RATE SHOCK'} warning={role === 'risk'} /><Box styles={styles} label={tr ? 'KORELASYON ↑' : 'CORRELATION ↑'} /><Box styles={styles} label={tr ? 'LİKİDİTE ↓' : 'LIQUIDITY ↓'} /></View></>;
}
function RecoveryScene({ role, tr, styles }: SceneProps) {
  const warning = role === 'misconception' || role === 'risk';
  return <>{role !== 'summary' ? <Header styles={styles} title={tr ? 'Toparlanma Matematiği' : 'Recovery Math'} detail={roleHint(role, tr)} /> : null}<View style={styles.row}><Box styles={styles} label="100" /><Text style={styles.arrow}>→</Text><Box styles={styles} label="50  (-50%)" warning /><Text style={styles.arrow}>→</Text><Box styles={styles} label={warning ? '100  (+100%)' : '100'} warning={warning} /></View><Text style={styles.caption}>{tr ? '%50 kayıp ≠ %50 toparlanma' : '50% loss ≠ 50% recovery'}</Text></>;
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 260, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 13, padding: 14 },
  header: { gap: 4 }, title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' }, detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, flexWrap: 'wrap' },
  box: { minWidth: 72, flexGrow: 1, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 9, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }, boxWarning: { borderColor: theme.colors.warning }, boxText: { color: theme.colors.text, fontSize: 9, fontWeight: '900', textAlign: 'center' },
  arrow: { color: theme.colors.primary, fontSize: 18, fontWeight: '900', textAlign: 'center' }, caption: { color: theme.colors.textMuted, fontSize: 10, lineHeight: 15, fontWeight: '800', textAlign: 'center' },
  target: { alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999, borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: theme.colors.surfaceMuted }, targetText: { color: theme.colors.primary, fontSize: 9, fontWeight: '900' },
  depth: { gap: 6, padding: 10, borderRadius: 10, backgroundColor: theme.colors.surfaceMuted }, depthLabel: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900' }, depthBar: { height: 12, borderRadius: 6, backgroundColor: theme.colors.primary },
  distribution: { minHeight: 95, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 5, position: 'relative' }, distBar: { width: 16, borderRadius: 4, backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border }, tailBar: { position: 'absolute', right: 8, bottom: 0, width: 9, height: 28, borderRadius: 4, backgroundColor: theme.colors.warning }, tailBarStrong: { height: 58 },
  centerNode: { alignSelf: 'center', paddingVertical: 11, paddingHorizontal: 22, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: theme.colors.surfaceMuted }, centerText: { color: theme.colors.text, fontSize: 10, fontWeight: '900' },
});
