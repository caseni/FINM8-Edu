import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'horizon' | 'trend' | 'meanReversion' | 'breakout' | 'momentum' | 'swingPosition' | 'hypothesis' | 'rules' | 'regime' | 'costs' | 'diversification' | 'review';

export interface StrategySlideVisualProps { assetRef: string; alt: string; language: LearningLanguage; role: SlideRole; theme?: LearningTheme; }

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('strateji-amaci-ve-zaman-ufku')) return 'horizon';
  if (assetRef.includes('trend-following-nasil-dusunur')) return 'trend';
  if (assetRef.includes('mean-reversion-ne-varsayar')) return 'meanReversion';
  if (assetRef.includes('breakout-stratejisi-ne-yapar')) return 'breakout';
  if (assetRef.includes('momentum-stratejisi-ne-yapar')) return 'momentum';
  if (assetRef.includes('swing-ve-position-farki')) return 'swingPosition';
  if (assetRef.includes('strateji-hipotezi-nedir')) return 'hypothesis';
  if (assetRef.includes('giris-cikis-invalidation-kurallari')) return 'rules';
  if (assetRef.includes('strateji-rejime-uyar-mi')) return 'regime';
  if (assetRef.includes('turnover-ve-maliyet')) return 'costs';
  if (assetRef.includes('strateji-cesitlendirmesi')) return 'diversification';
  if (assetRef.includes('stratejiyi-ne-zaman-review-etmeli')) return 'review';
  return undefined;
}

export function isStrategySlideAsset(assetRef: string): boolean { return Boolean(topicForAsset(assetRef)); }

const TITLES: Record<Topic, { tr: string; en: string }> = {
  horizon: { tr: 'Amaç → Ufuk → Veri → Risk', en: 'Objective → Horizon → Evidence → Risk' },
  trend: { tr: 'Trend oluşur → Katıl → Bozulursa çık', en: 'Trend forms → Participate → Exit when broken' },
  meanReversion: { tr: 'Sapma → Referans → Dönüş hipotezi', en: 'Deviation → Reference → Reversion hypothesis' },
  breakout: { tr: 'Kırılım olayı → Strateji kuralları', en: 'Breakout event → Strategy rules' },
  momentum: { tr: 'Performans → Sıralama → Risk filtresi', en: 'Performance → Rank → Risk filter' },
  swingPosition: { tr: 'Swing ≠ Position: ufuk ve kanıt değişir', en: 'Swing ≠ Position: horizon and evidence differ' },
  hypothesis: { tr: 'Neden çalışmalı? Ne bozabilir?', en: 'Why should it work? What can break it?' },
  rules: { tr: 'Giriş → Risk → Invalidation → Çıkış', en: 'Entry → Risk → Invalidation → Exit' },
  regime: { tr: 'Aynı strateji, farklı rejim', en: 'Same strategy, different regime' },
  costs: { tr: 'Brüt avantaj − maliyet = net sonuç', en: 'Gross edge − costs = net result' },
  diversification: { tr: 'Farklı isim değil, farklı davranış', en: 'Different behavior, not just different names' },
  review: { tr: 'Kötü sonuç mu, bozuk süreç mi?', en: 'Bad outcome or broken process?' },
};

const ROLE: Record<SlideRole, { tr: string; en: string }> = {
  hook: { tr: 'Soruyu çerçevele', en: 'Frame the question' }, concept: { tr: 'Yöntemin mekanizması', en: 'How the method works' }, practice: { tr: 'Kurala dönüştür', en: 'Turn it into a rule' },
  misconception: { tr: 'Yanlış kısa yolu ayır', en: 'Separate the shortcut' }, risk: { tr: 'Trade-off ve kırılma noktası', en: 'Trade-off and failure point' }, summary: { tr: 'Tek cümlelik strateji kuralı', en: 'One-line strategy rule' },
};

export function StrategySlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: StrategySlideVisualProps) {
  const topic = topicForAsset(assetRef); if (!topic) return null;
  const s = createStyles(theme); const tr = language === 'tr';
  return <View style={s.shell} accessibilityLabel={alt}><View style={s.header}><Text style={s.title}>{TITLES[topic][language]}</Text><Text style={s.detail}>{ROLE[role][language]}</Text></View><View style={s.canvas}>{render(topic, role, s, tr)}</View></View>;
}

function render(topic: Topic, role: SlideRole, s: ReturnType<typeof createStyles>, tr: boolean) {
  switch (topic) {
    case 'horizon': return <View style={s.stack}><View style={s.row}><Card s={s} label={tr?'KISA':'SHORT'} value={tr?'Sık karar':'High cadence'} /><Card s={s} label={tr?'ORTA':'MEDIUM'} value={tr?'Swing':'Swing'} /><Card s={s} label={tr?'UZUN':'LONG'} value={tr?'Tema / yatırım':'Theme / invest'} /></View><Rule s={s} text={tr?'Ufuk değişirse veri ve risk de değişir':'Change the horizon → change evidence and risk'} /></View>;
    case 'trend': return <View style={s.stack}><Path s={s} mode="up" /><View style={s.flow}><Tag s={s} text={tr?'TREND':'TREND'} good /><Text style={s.arrow}>→</Text><Tag s={s} text={tr?'TAKİP':'FOLLOW'} good /><Text style={s.arrow}>→</Text><Tag s={s} text={tr?'BOZULMA':'BREAK'} risk={role==='risk'||role==='misconception'} /></View></View>;
    case 'meanReversion': return <View style={s.stack}><View style={s.band}><View style={s.meanLine}/><Text style={s.meanLabel}>{tr?'REFERANS':'REFERENCE'}</Text><View style={[s.priceDot,{top: role==='risk'?8:20}]}/><View style={[s.priceDot,s.priceDot2,{bottom: role==='risk'?8:20}]}/></View><Rule s={s} text={tr?(role==='misconception'?'Uzaklık ≠ kesin dönüş':'Dönüş hipotezi, garanti değil'):(role==='misconception'?'Distance ≠ guaranteed reversion':'A reversion hypothesis, not a guarantee')} /></View>;
    case 'breakout': return <View style={s.flow}><Tag s={s} text={tr?'KIRILIM':'BREAK'} /><Text style={s.arrow}>→</Text><Tag s={s} text={tr?'TEYİT':'CONFIRM'} /><Text style={s.arrow}>→</Text><Tag s={s} text={tr?'GİRİŞ':'ENTRY'} good /><Text style={s.arrow}>→</Text><Tag s={s} text={tr?'INVALIDATION':'INVALIDATION'} risk /></View>;
    case 'momentum': return <View style={s.stack}><View style={s.rank}><Meter s={s} label="A" w="88%"/><Meter s={s} label="B" w="64%"/><Meter s={s} label="C" w="36%"/></View><Rule s={s} text={tr?(role==='misconception'?'Sıralama + kural ≠ FOMO':'Lookback + evren + rebalance + risk'):(role==='misconception'?'Ranking + rules ≠ FOMO':'Lookback + universe + rebalance + risk')} /></View>;
    case 'swingPosition': return <View style={s.row}><Card s={s} label="SWING" value={tr?'Orta ufuk\nDaha sık karar':'Medium horizon\nMore decisions'} /><Card s={s} label="POSITION" value={tr?'Uzun ufuk\nDaha yavaş tez':'Long horizon\nSlower thesis'} /></View>;
    case 'hypothesis': return <View style={s.stack}><Rule s={s} text={tr?'“X koşulunda Y davranışı neden sürmeli?”':'“Why should Y persist under condition X?”'} /><View style={s.flow}><Tag s={s} text={tr?'KANIT':'EVIDENCE'} good/><Tag s={s} text={tr?'KARŞI KANIT':'COUNTER'} risk/><Tag s={s} text={tr?'TEST':'TEST'} /></View></View>;
    case 'rules': return <View style={s.flow}><Tag s={s} text={tr?'GİRİŞ':'ENTRY'} /><Text style={s.arrow}>→</Text><Tag s={s} text={tr?'RİSK':'RISK'} /><Text style={s.arrow}>→</Text><Tag s={s} text="INVALID" risk/><Text style={s.arrow}>→</Text><Tag s={s} text={tr?'ÇIKIŞ':'EXIT'} good/></View>;
    case 'regime': return <View style={s.row}><View style={s.regime}><Text style={s.regimeTitle}>{tr?'TREND':'TREND'}</Text><Path s={s} mode="up"/></View><View style={s.regime}><Text style={s.regimeTitle}>{tr?'RANGE':'RANGE'}</Text><Path s={s} mode="flat"/></View></View>;
    case 'costs': return <View style={s.stack}><Meter s={s} label={tr?'BRÜT AVANTAJ':'GROSS EDGE'} w="90%" good/><Meter s={s} label={tr?'SPREAD + FEE + SLIPPAGE':'SPREAD + FEE + SLIPPAGE'} w={role==='risk'?'72%':'46%'} risk/><Rule s={s} text={tr?'Net avantaj maliyetten sonra kalandır':'Net edge is what remains after costs'} /></View>;
    case 'diversification': return <View style={s.stack}><View style={s.row}><Tag s={s} text="TREND"/><Tag s={s} text="MEAN REV"/><Tag s={s} text="MOMENTUM"/></View><Rule s={s} text={tr?'Aynı risk faktörünü üç isimle çoğaltma':'Do not multiply one risk factor under three names'} /></View>;
    case 'review': return <View style={s.stack}><View style={s.row}><Card s={s} label={tr?'SONUÇ':'OUTCOME'} value={role==='misconception'?'−':'?'} /><Card s={s} label={tr?'SÜREÇ':'PROCESS'} value={role==='practice'?'CHECK':'?'} /><Card s={s} label={tr?'REJİM':'REGIME'} value="?" /></View><Rule s={s} text={tr?'Kuralı P&L öfkesinde değil, review sürecinde değiştir':'Change rules in review—not in reaction to P&L'} /></View>;
  }
}
function Card({s,label,value}:{s:ReturnType<typeof createStyles>;label:string;value:string}){return <View style={s.card}><Text style={s.cardLabel}>{label}</Text><Text style={s.cardValue}>{value}</Text></View>}
function Tag({s,text,good,risk}:{s:ReturnType<typeof createStyles>;text:string;good?:boolean;risk?:boolean}){return <View style={[s.tag,good&&s.goodBorder,risk&&s.riskBorder]}><Text style={[s.tagText,good&&s.good,risk&&s.bad]}>{text}</Text></View>}
function Rule({s,text}:{s:ReturnType<typeof createStyles>;text:string}){return <View style={s.rule}><Text style={s.ruleText}>{text}</Text></View>}
function Meter({s,label,w,good,risk}:{s:ReturnType<typeof createStyles>;label:string;w:`${number}%`;good?:boolean;risk?:boolean}){return <View style={s.meterRow}><Text style={s.meterLabel}>{label}</Text><View style={s.track}><View style={[s.fill,{width:w},good&&s.goodBg,risk&&s.riskBg]}/></View></View>}
function Path({s,mode}:{s:ReturnType<typeof createStyles>;mode:'up'|'flat'}){return <View style={s.path}>{[0,1,2,3,4,5].map((i)=><View key={i} style={[s.pathDot,{left:`${8+i*17}%`,bottom:mode==='up'?10+i*9:20+(i%2)*18}]}/>)}</View>}
const createStyles=(theme:LearningTheme)=>StyleSheet.create({shell:{minHeight:220,borderRadius:theme.radius.medium,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.background,overflow:'hidden'},header:{paddingHorizontal:14,paddingTop:14,gap:3},title:{color:theme.colors.text,fontSize:15,lineHeight:20,fontWeight:'900'},detail:{color:theme.colors.textMuted,fontSize:10,lineHeight:15,fontWeight:'700'},canvas:{flex:1,justifyContent:'center',padding:14},stack:{gap:11},row:{flexDirection:'row',gap:9,alignItems:'stretch'},flow:{flexDirection:'row',gap:6,alignItems:'center',justifyContent:'center',flexWrap:'wrap'},card:{flex:1,minHeight:76,justifyContent:'center',alignItems:'center',gap:5,padding:9,borderRadius:11,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.surfaceMuted},cardLabel:{color:theme.colors.textMuted,fontSize:8,fontWeight:'900',letterSpacing:.5},cardValue:{color:theme.colors.text,fontSize:11,lineHeight:15,fontWeight:'900',textAlign:'center'},tag:{paddingVertical:10,paddingHorizontal:10,borderRadius:10,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.surfaceMuted},tagText:{color:theme.colors.text,fontSize:9,fontWeight:'900'},goodBorder:{borderColor:'rgba(45,212,191,0.38)'},riskBorder:{borderColor:'rgba(248,113,113,0.38)'},good:{color:theme.colors.success},bad:{color:theme.colors.risk},arrow:{color:theme.colors.textMuted,fontSize:17,fontWeight:'900'},rule:{minHeight:52,justifyContent:'center',alignItems:'center',padding:10,borderRadius:11,borderWidth:1,borderColor:'rgba(45,212,191,0.25)',backgroundColor:'rgba(45,212,191,0.05)'},ruleText:{color:theme.colors.text,fontSize:10,lineHeight:15,fontWeight:'800',textAlign:'center'},band:{height:105,position:'relative',borderRadius:12,backgroundColor:theme.colors.surfaceMuted},meanLine:{position:'absolute',left:12,right:12,top:'49%',height:2,backgroundColor:theme.colors.primary},meanLabel:{position:'absolute',left:12,top:'52%',color:theme.colors.textMuted,fontSize:8,fontWeight:'900'},priceDot:{position:'absolute',right:'25%',width:13,height:13,borderRadius:7,backgroundColor:theme.colors.warning},priceDot2:{right:'65%',backgroundColor:theme.colors.risk},rank:{gap:8},meterRow:{gap:4},meterLabel:{color:theme.colors.text,fontSize:8,fontWeight:'900'},track:{height:12,borderRadius:99,backgroundColor:theme.colors.surfaceMuted,overflow:'hidden'},fill:{height:'100%',borderRadius:99,backgroundColor:theme.colors.primary},goodBg:{backgroundColor:theme.colors.success},riskBg:{backgroundColor:theme.colors.risk},regime:{flex:1,gap:6},regimeTitle:{color:theme.colors.text,fontSize:9,fontWeight:'900',textAlign:'center'},path:{height:82,position:'relative',borderRadius:11,backgroundColor:theme.colors.surfaceMuted},pathDot:{position:'absolute',width:9,height:9,borderRadius:5,backgroundColor:theme.colors.primary}});
