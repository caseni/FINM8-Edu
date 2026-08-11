import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'lossAversion' | 'anchoring' | 'recency' | 'overconfidence' | 'revenge' | 'outcome' | 'disposition' | 'herd' | 'sunkCost' | 'availability' | 'actionBias' | 'precommitment';

export interface MarketPsychologySlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('kayip-korkusu-karari-nasil-bozar')) return 'lossAversion';
  if (assetRef.includes('ilk-fiyata-capalanmak')) return 'anchoring';
  if (assetRef.includes('son-olay-her-sey-midir')) return 'recency';
  if (assetRef.includes('asiri-guven-nasil-fark-edilir')) return 'overconfidence';
  if (assetRef.includes('revenge-trading-nedir')) return 'revenge';
  if (assetRef.includes('iyi-sonuc-iyi-karar-midir')) return 'outcome';
  if (assetRef.includes('kazanan-erken-kaybeden-gec')) return 'disposition';
  if (assetRef.includes('kalabalik-hakli-midir')) return 'herd';
  if (assetRef.includes('batik-maliyet-karari')) return 'sunkCost';
  if (assetRef.includes('akla-gelen-en-onemli-mi')) return 'availability';
  if (assetRef.includes('bir-sey-yapmak-zorunda-misin')) return 'actionBias';
  if (assetRef.includes('karari-onceden-kurmak')) return 'precommitment';
  return undefined;
}

export function isMarketPsychologySlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

const ROLE_COPY: Record<SlideRole, { tr: string; en: string }> = {
  hook: { tr: 'İlk dürtüyü fark et', en: 'Notice the first impulse' },
  concept: { tr: 'Mekanizmayı ayır', en: 'Separate the mechanism' },
  practice: { tr: 'Kararı teste sok', en: 'Put the decision to a test' },
  misconception: { tr: 'Yanlış gerekçeyi gör', en: 'Spot the false rationale' },
  risk: { tr: 'Davranışın risk etkisi', en: 'Behavioral risk impact' },
  summary: { tr: 'Kuralı sadeleştir', en: 'Reduce it to one rule' },
};

const TOPIC_TITLES: Record<Topic, { tr: string; en: string }> = {
  lossAversion: { tr: 'Kayıp > aynı büyüklükte kazanç hissi', en: 'Loss feels heavier than an equal gain' },
  anchoring: { tr: 'Eski referans ≠ güncel değer', en: 'Old reference ≠ current value' },
  recency: { tr: 'Son olay ≠ tüm örneklem', en: 'Latest event ≠ full sample' },
  overconfidence: { tr: 'Güven artabilir; risk kuralı sabit kalmalı', en: 'Confidence can rise; risk rules should stay stable' },
  revenge: { tr: 'Kayıp → dürtü → hızlı yeniden giriş', en: 'Loss → impulse → rapid re-entry' },
  outcome: { tr: 'Süreç ve sonuç ayrı eksenlerdir', en: 'Process and outcome are separate axes' },
  disposition: { tr: 'Kazananı erken / kaybedeni geç bırakma', en: 'Sell winners early / hold losers too long' },
  herd: { tr: 'Kalabalık veri olabilir; gerekçe değildir', en: 'The crowd can be data; it is not a rationale' },
  sunkCost: { tr: 'Geçmiş maliyet ≠ bugünkü zorunluluk', en: 'Past cost ≠ present obligation' },
  availability: { tr: 'Hatırlanabilirlik ≠ olasılık', en: 'Memorability ≠ probability' },
  actionBias: { tr: 'İşlem / Bekle / Veri topla', en: 'Trade / Wait / Gather data' },
  precommitment: { tr: 'Sakin zamanda kural, zor anda uygulama', en: 'Rule while calm, execute under pressure' },
};

export function MarketPsychologySlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: MarketPsychologySlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  return (
    <View style={styles.shell} accessibilityLabel={alt}>
      <View style={styles.header}>
        <Text style={styles.title}>{TOPIC_TITLES[topic][language]}</Text>
        <Text style={styles.detail}>{ROLE_COPY[role][language]}</Text>
      </View>
      <View style={styles.canvas}>{renderTopic(topic, role, styles, language)}</View>
    </View>
  );
}

function renderTopic(topic: Topic, role: SlideRole, s: ReturnType<typeof createStyles>, language: LearningLanguage) {
  const tr = language === 'tr';
  switch (topic) {
    case 'lossAversion':
      return <View style={s.stack}><Meter s={s} label={tr ? 'KAZANÇ +10' : 'GAIN +10'} width="48%" tone="success" /><Meter s={s} label={tr ? 'KAYIP -10' : 'LOSS -10'} width={role === 'summary' ? '72%' : '88%'} tone="risk" /><Rule s={s} text={tr ? (role === 'misconception' ? 'Zararı hissetmemek ≠ iyi karar' : 'Aynı büyüklük, farklı psikolojik ağırlık') : (role === 'misconception' ? 'Avoiding the feeling ≠ good decision' : 'Same size, different psychological weight')} /></View>;
    case 'anchoring':
      return <View style={s.flow}><Card s={s} label={tr ? 'ESKİ REFERANS' : 'OLD ANCHOR'} value="100" tone="warning" /><Text style={s.arrow}>→</Text><Card s={s} label={tr ? 'GÜNCEL FİYAT' : 'CURRENT PRICE'} value="80" /><Text style={s.arrow}>+</Text><Card s={s} label={tr ? 'YENİ KANIT' : 'NEW EVIDENCE'} value={role === 'practice' ? '?' : '✓'} tone="success" /></View>;
    case 'recency':
      return <View style={s.stack}><View style={s.timeline}>{[0,1,2,3,4,5,6,7].map((i) => <View key={i} style={[s.dot, i > 4 && (role === 'hook' || role === 'misconception') ? s.dotHot : undefined]} />)}</View><Rule s={s} text={tr ? (role === 'summary' ? 'Son 3 gözlem tüm geçmiş değildir' : 'Kısa pencereyi uzun bağlamla karşılaştır') : (role === 'summary' ? 'The last 3 observations are not the full history' : 'Compare the short window with broader context')} /></View>;
    case 'overconfidence':
      return <View style={s.stack}><Meter s={s} label={tr ? 'GÜVEN' : 'CONFIDENCE'} width={role === 'risk' ? '94%' : '82%'} tone="warning" /><Meter s={s} label={tr ? 'KANIT' : 'EVIDENCE'} width="56%" /><Meter s={s} label={tr ? 'RİSK LİMİTİ' : 'RISK LIMIT'} width="60%" tone="success" /></View>;
    case 'revenge':
      return <View style={s.flow}><Card s={s} label={tr ? 'KAYIP' : 'LOSS'} value="-" tone="risk" /><Text style={s.arrow}>→</Text><Card s={s} label={tr ? 'DÜRTÜ' : 'IMPULSE'} value="!" tone="warning" /><Text style={s.arrow}>→</Text><Card s={s} label={tr ? (role === 'practice' ? 'ARA VER' : 'YENİDEN GİRİŞ') : (role === 'practice' ? 'PAUSE' : 'RE-ENTRY')} value={role === 'practice' || role === 'summary' ? '⏸' : '↻'} tone={role === 'practice' || role === 'summary' ? 'success' : 'risk'} /></View>;
    case 'outcome':
      return <View style={s.grid}><Card s={s} label={tr ? 'İYİ SÜREÇ' : 'GOOD PROCESS'} value={tr ? 'İyi sonuç' : 'Good outcome'} tone="success" /><Card s={s} label={tr ? 'İYİ SÜREÇ' : 'GOOD PROCESS'} value={tr ? 'Kötü sonuç' : 'Bad outcome'} /><Card s={s} label={tr ? 'KÖTÜ SÜREÇ' : 'BAD PROCESS'} value={tr ? 'İyi sonuç' : 'Good outcome'} tone="warning" /><Card s={s} label={tr ? 'KÖTÜ SÜREÇ' : 'BAD PROCESS'} value={tr ? 'Kötü sonuç' : 'Bad outcome'} tone="risk" /></View>;
    case 'disposition':
      return <View style={s.row}><View style={s.lane}><Text style={s.laneTitle}>{tr ? 'KAZANAN' : 'WINNER'}</Text><Meter s={s} label={tr ? 'ERKEN ÇIKIŞ' : 'EARLY EXIT'} width={role === 'misconception' ? '42%' : '66%'} tone="success" /></View><View style={s.lane}><Text style={s.laneTitle}>{tr ? 'KAYBEDEN' : 'LOSER'}</Text><Meter s={s} label={tr ? 'UZATILAN BEKLEYİŞ' : 'PROLONGED HOLD'} width="92%" tone="risk" /></View></View>;
    case 'herd':
      return <View style={s.stack}><View style={s.crowd}>{['→','→','→','→','→'].map((x,i) => <Text key={i} style={s.crowdArrow}>{x}</Text>)}</View><View style={s.flow}><Card s={s} label={tr ? 'KALABALIK' : 'CROWD'} value={role === 'hook' ? '???' : 'DATA'} /><Text style={s.arrow}>+</Text><Card s={s} label={tr ? 'BAĞIMSIZ KANIT' : 'INDEPENDENT EVIDENCE'} value="✓" tone="success" /></View></View>;
    case 'sunkCost':
      return <View style={s.flow}><Card s={s} label={tr ? 'GEÇMİŞ' : 'PAST'} value={tr ? 'Zaman / Para' : 'Time / Money'} tone="warning" /><Text style={s.stop}>×</Text><Card s={s} label={tr ? 'BUGÜN' : 'TODAY'} value={tr ? 'Risk + Beklenen Değer' : 'Risk + Expected Value'} tone="success" /></View>;
    case 'availability':
      return <View style={s.row}><View style={s.vivid}><Text style={s.vividBang}>!</Text><Text style={s.vividText}>{tr ? 'ÇARPICI TEK ÖRNEK' : 'ONE VIVID EXAMPLE'}</Text></View><View style={s.baseRates}>{[0,1,2,3,4,5,6,7,8,9,10,11].map(i => <View key={i} style={[s.baseDot, role === 'summary' && i < 8 ? s.baseDotOn : undefined]} />)}<Text style={s.baseLabel}>{tr ? 'BAZ ORANI' : 'BASE RATE'}</Text></View></View>;
    case 'actionBias':
      return <View style={s.flow}><Card s={s} label={tr ? 'İŞLEM' : 'TRADE'} value={role === 'misconception' ? '!' : '?'} tone="warning" /><Card s={s} label={tr ? 'BEKLE' : 'WAIT'} value="⏸" tone="success" /><Card s={s} label={tr ? 'VERİ TOPLA' : 'GATHER DATA'} value="+" /></View>;
    case 'precommitment':
      return <View style={s.stack}><View style={s.checklist}><Check s={s} text={tr ? 'Risk limiti' : 'Risk limit'} /><Check s={s} text={tr ? 'Ara verme kuralı' : 'Pause rule'} /><Check s={s} text={tr ? 'Geçersizlik koşulu' : 'Invalidation'} /></View><Text style={s.arrowDown}>↓</Text><Rule s={s} text={tr ? (role === 'practice' ? 'Eğer X olursa → Y yap' : 'Stres anında kuralı uygula') : (role === 'practice' ? 'If X happens → do Y' : 'Execute the rule under stress')} /></View>;
  }
}

function Card({ s, label, value, tone }: { s: ReturnType<typeof createStyles>; label: string; value: string; tone?: 'success'|'warning'|'risk' }) {
  return <View style={[s.card, tone === 'success' ? s.goodBorder : tone === 'warning' ? s.warnBorder : tone === 'risk' ? s.riskBorder : undefined]}><Text style={s.cardLabel}>{label}</Text><Text style={[s.cardValue, tone === 'success' ? s.good : tone === 'warning' ? s.warn : tone === 'risk' ? s.bad : undefined]}>{value}</Text></View>;
}
function Meter({ s, label, width, tone }: { s: ReturnType<typeof createStyles>; label: string; width: `${number}%`; tone?: 'success'|'warning'|'risk' }) {
  return <View style={s.meterRow}><Text style={s.meterLabel}>{label}</Text><View style={s.meterTrack}><View style={[s.meterFill, { width }, tone === 'success' ? s.goodBg : tone === 'warning' ? s.warnBg : tone === 'risk' ? s.riskBg : undefined]} /></View></View>;
}
function Rule({ s, text }: { s: ReturnType<typeof createStyles>; text: string }) { return <View style={s.rule}><Text style={s.ruleText}>{text}</Text></View>; }
function Check({ s, text }: { s: ReturnType<typeof createStyles>; text: string }) { return <View style={s.check}><Text style={s.checkMark}>✓</Text><Text style={s.checkText}>{text}</Text></View>; }

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background, overflow: 'hidden' },
  header: { paddingHorizontal: 14, paddingTop: 14, gap: 3 },
  title: { color: theme.colors.text, fontSize: 15, lineHeight: 20, fontWeight: '900' },
  detail: { color: theme.colors.textMuted, fontSize: 10, lineHeight: 15, fontWeight: '700' },
  canvas: { flex: 1, justifyContent: 'center', padding: 14 },
  stack: { gap: 11 }, row: { flexDirection: 'row', gap: 10, alignItems: 'stretch' }, flow: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: { flex: 1, minWidth: 76, minHeight: 72, justifyContent: 'center', alignItems: 'center', gap: 5, padding: 9, borderRadius: 11, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  cardLabel: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '900', letterSpacing: 0.5, textAlign: 'center' },
  cardValue: { color: theme.colors.text, fontSize: 13, lineHeight: 17, fontWeight: '900', textAlign: 'center' },
  goodBorder: { borderColor: 'rgba(45,212,191,0.38)' }, warnBorder: { borderColor: 'rgba(251,191,36,0.40)' }, riskBorder: { borderColor: 'rgba(248,113,113,0.38)' },
  good: { color: theme.colors.success }, warn: { color: theme.colors.warning }, bad: { color: theme.colors.risk },
  arrow: { color: theme.colors.textMuted, fontSize: 18, fontWeight: '900' }, arrowDown: { color: theme.colors.primary, fontSize: 22, textAlign: 'center', fontWeight: '900' }, stop: { color: theme.colors.risk, fontSize: 22, fontWeight: '900' },
  meterRow: { gap: 5 }, meterLabel: { color: theme.colors.text, fontSize: 9, fontWeight: '900', letterSpacing: 0.4 },
  meterTrack: { height: 13, borderRadius: 999, backgroundColor: theme.colors.surfaceMuted, overflow: 'hidden' }, meterFill: { height: '100%', borderRadius: 999, backgroundColor: theme.colors.primary },
  goodBg: { backgroundColor: theme.colors.success }, warnBg: { backgroundColor: theme.colors.warning }, riskBg: { backgroundColor: theme.colors.risk },
  rule: { minHeight: 54, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 11, borderWidth: 1, borderColor: 'rgba(45,212,191,0.28)', backgroundColor: 'rgba(45,212,191,0.06)' },
  ruleText: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '800', textAlign: 'center' },
  timeline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 22, paddingHorizontal: 6, borderRadius: 12, backgroundColor: theme.colors.surfaceMuted },
  dot: { width: 11, height: 11, borderRadius: 6, backgroundColor: 'rgba(159,176,195,0.35)' }, dotHot: { width: 16, height: 16, borderRadius: 8, backgroundColor: theme.colors.warning },
  lane: { flex: 1, gap: 10, padding: 10, borderRadius: 11, backgroundColor: theme.colors.surfaceMuted }, laneTitle: { color: theme.colors.text, fontSize: 10, fontWeight: '900', textAlign: 'center' },
  crowd: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderRadius: 10, backgroundColor: theme.colors.surfaceMuted }, crowdArrow: { color: theme.colors.warning, fontSize: 22, fontWeight: '900' },
  vivid: { flex: 1, minHeight: 110, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(251,191,36,0.32)', backgroundColor: 'rgba(251,191,36,0.06)' },
  vividBang: { color: theme.colors.warning, fontSize: 30, fontWeight: '900' }, vividText: { color: theme.colors.text, fontSize: 9, fontWeight: '900', textAlign: 'center' },
  baseRates: { flex: 1, minHeight: 110, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 6, padding: 12, borderRadius: 12, backgroundColor: theme.colors.surfaceMuted },
  baseDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(159,176,195,0.30)' }, baseDotOn: { backgroundColor: theme.colors.primary }, baseLabel: { width: '100%', marginTop: 5, color: theme.colors.textMuted, fontSize: 8, fontWeight: '900', textAlign: 'center' },
  checklist: { gap: 7 }, check: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, backgroundColor: theme.colors.surfaceMuted }, checkMark: { color: theme.colors.success, fontSize: 14, fontWeight: '900' }, checkText: { color: theme.colors.text, fontSize: 10, fontWeight: '800' },
});
