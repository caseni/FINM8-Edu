import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'probability' | 'expectancy' | 'winratePayoff' | 'backtest' | 'outOfSample' | 'costs' | 'overfitting' | 'lookahead' | 'survivorship' | 'leakage' | 'robustness' | 'automation';

export interface AlgoQuantSlideVisualProps { assetRef: string; alt: string; language: LearningLanguage; role: SlideRole; theme?: LearningTheme; }

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('olaslikla-dusunmek')) return 'probability';
  if (assetRef.includes('expectancy-nedir')) return 'expectancy';
  if (assetRef.includes('win-rate-payoff-dengesi')) return 'winratePayoff';
  if (assetRef.includes('backtest-ne-soyler')) return 'backtest';
  if (assetRef.includes('orneklem-ve-out-of-sample')) return 'outOfSample';
  if (assetRef.includes('backtestte-islem-maliyetleri')) return 'costs';
  if (assetRef.includes('overfitting-nedir')) return 'overfitting';
  if (assetRef.includes('look-ahead-bias-nedir')) return 'lookahead';
  if (assetRef.includes('survivorship-bias-nedir')) return 'survivorship';
  if (assetRef.includes('data-leakage-nedir')) return 'leakage';
  if (assetRef.includes('robustness-nasil-test-edilir')) return 'robustness';
  if (assetRef.includes('otomasyonun-sinirlari')) return 'automation';
  return undefined;
}

export function isAlgoQuantSlideAsset(assetRef: string): boolean { return Boolean(topicForAsset(assetRef)); }

const TITLES: Record<Topic, { tr: string; en: string }> = {
  probability: { tr: 'Tek sonuç değil, dağılım', en: 'Distribution, not one outcome' },
  expectancy: { tr: 'Olasılık × payoff = expectancy', en: 'Probability × payoff = expectancy' },
  winratePayoff: { tr: 'Win rate ≠ strateji kalitesi', en: 'Win rate ≠ strategy quality' },
  backtest: { tr: 'Veri → Kural → Simülasyon → Sonuç', en: 'Data → Rules → Simulation → Result' },
  outOfSample: { tr: 'Araştırma verisi ≠ doğrulama verisi', en: 'Research data ≠ validation data' },
  costs: { tr: 'Brüt avantaj − gerçek maliyetler', en: 'Gross edge − real costs' },
  overfitting: { tr: 'Örüntüyü öğrenmek ≠ geçmişi ezberlemek', en: 'Learn the pattern ≠ memorize history' },
  lookahead: { tr: 'Karar anında ne biliniyordu?', en: 'What was known at decision time?' },
  survivorship: { tr: 'Sadece hayatta kalanlara bakma', en: 'Do not test only survivors' },
  leakage: { tr: 'Test bilgisi train tarafına sızmasın', en: 'Keep test information out of training' },
  robustness: { tr: 'Tek zirve değil, dayanıklı plato', en: 'Stable plateau, not one perfect peak' },
  automation: { tr: 'Otomasyon + kontrol katmanı', en: 'Automation + control layer' },
};

const ROLE: Record<SlideRole, { tr: string; en: string }> = {
  hook: { tr: 'Soruyu görselleştir', en: 'Visualize the question' }, concept: { tr: 'Mekanizmayı kur', en: 'Build the mechanism' }, practice: { tr: 'Test mantığına uygula', en: 'Apply the test logic' },
  misconception: { tr: 'Yanlış güveni ayır', en: 'Separate false confidence' }, risk: { tr: 'Bias ve kırılganlığı gör', en: 'See bias and fragility' }, summary: { tr: 'Tek araştırma kuralı', en: 'One research rule' },
};

export function AlgoQuantSlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: AlgoQuantSlideVisualProps) {
  const topic = topicForAsset(assetRef); if (!topic) return null;
  const s = createStyles(theme); const tr = language === 'tr';
  return <View style={s.shell} accessibilityLabel={alt}><View style={s.header}><Text style={s.title}>{TITLES[topic][language]}</Text><Text style={s.detail}>{ROLE[role][language]}</Text></View><View style={s.canvas}>{render(topic, role, s, tr)}</View></View>;
}

function render(topic: Topic, role: SlideRole, s: ReturnType<typeof createStyles>, tr: boolean) {
  switch (topic) {
    case 'probability': return <View style={s.stack}><View style={s.barRow}><Bar s={s} label="A" h={34}/><Bar s={s} label="B" h={78} good/><Bar s={s} label="C" h={51}/><Bar s={s} label="D" h={21} risk={role==='risk'}/></View><Rule s={s} text={tr?'En olası sonuç bile kesin değildir':'Even the most likely outcome is not certain'} /></View>;
    case 'expectancy': return <View style={s.stack}><View style={s.row}><Card s={s} label={tr?'KAZANMA':'WIN'} value="p × avg+" good/><Text style={s.operator}>−</Text><Card s={s} label={tr?'KAYBETME':'LOSS'} value="q × avg−" risk/></View><Rule s={s} text={tr?'Tek işlem değil, uzun dönem ortalaması':'Not one trade—the long-run average'} /></View>;
    case 'winratePayoff': return <View style={s.row}><View style={s.compare}><Text style={s.compareTitle}>A · 80%</Text><Mini s={s} good={24} risk={70}/><Text style={s.note}>{tr?'Sık küçük + / seyrek büyük −':'Many small + / rare large −'}</Text></View><View style={s.compare}><Text style={s.compareTitle}>B · 40%</Text><Mini s={s} good={76} risk={28}/><Text style={s.note}>{tr?'Daha az + / daha büyük payoff':'Fewer wins / larger payoff'}</Text></View></View>;
    case 'backtest': return <View style={s.flow}><Tag s={s} text={tr?'GEÇMİŞ VERİ':'HISTORY'}/><Text style={s.arrow}>→</Text><Tag s={s} text={tr?'KURAL':'RULES'}/><Text style={s.arrow}>→</Text><Tag s={s} text={tr?'SİMÜLASYON':'SIM'}/><Text style={s.arrow}>→</Text><Tag s={s} text={tr?'RAPOR':'REPORT'} good={role==='practice'||role==='summary'}/></View>;
    case 'outOfSample': return <View style={s.stack}><View style={s.timeline}><View style={[s.segment,{flex:2}]}><Text style={s.segmentText}>{tr?'ARAŞTIR / AYARLA':'RESEARCH / TUNE'}</Text></View><View style={[s.segment,s.holdout,{flex:1}]}><Text style={[s.segmentText,s.good]}>{tr?'DOKUNMA':'HOLD OUT'}</Text></View></View><Rule s={s} text={tr?'Doğrulama verisini eğitim setine dönüştürme':'Do not turn validation data into training data'} /></View>;
    case 'costs': return <View style={s.stack}><Meter s={s} label={tr?'BRÜT AVANTAJ':'GROSS EDGE'} w="92%" good/><Meter s={s} label="FEE + SPREAD" w="58%" risk={role==='risk'}/><Meter s={s} label="SLIPPAGE + IMPACT" w="39%" risk/><Rule s={s} text={tr?'Net avantaj = uygulamadan sonra kalan':'Net edge = what remains after implementation'} /></View>;
    case 'overfitting': return <View style={s.row}><Curve s={s} mode="stable"/><Curve s={s} mode={role==='risk'||role==='misconception'?'jagged':'jagged'}/></View>;
    case 'lookahead': return <View style={s.stack}><View style={s.timeline}><View style={[s.segment,{flex:2}]}><Text style={s.segmentText}>{tr?'KARAR ANI':'DECISION'}</Text></View><View style={[s.segment,s.future,{flex:1}]}><Text style={[s.segmentText,s.bad]}>{tr?'GELECEK VERİ':'FUTURE DATA'}</Text></View></View><View style={s.flow}><Tag s={s} text={tr?'GELECEK':'FUTURE'} risk/><Text style={[s.arrow,s.bad]}>↩</Text><Tag s={s} text={tr?'GEÇMİŞ KARAR':'PAST DECISION'}/></View></View>;
    case 'survivorship': return <View style={s.stack}><View style={s.survivors}>{[0,1,2,3,4,5,6,7].map(i=><View key={i} style={[s.assetDot,(i===1||i===5||i===6)&&s.deadDot]}/>)}</View><Rule s={s} text={tr?(role==='misconception'?'Bugünün kazananlarını geçmişe taşıma':'Elenenleri ve delist olanları da geçmiş evrene dahil et'):(role==='misconception'?'Do not backfill today’s winners':'Include removals and delistings in historical universes')} /></View>;
    case 'leakage': return <View style={s.stack}><View style={s.row}><Card s={s} label="TRAIN" value={tr?'Öğren':'Fit'} good/><Card s={s} label="TEST" value={tr?'Sadece ölç':'Evaluate'} /></View><View style={s.flow}><Tag s={s} text="TEST" risk/><Text style={[s.arrow,s.bad]}>→ ✕ →</Text><Tag s={s} text="TRAIN"/></View></View>;
    case 'robustness': return <View style={s.row}><View style={s.compare}><Text style={s.compareTitle}>{tr?'KIRILGAN':'FRAGILE'}</Text><Spike s={s}/></View><View style={s.compare}><Text style={s.compareTitle}>{tr?'ROBUST':'ROBUST'}</Text><Plateau s={s}/></View></View>;
    case 'automation': return <View style={s.stack}><View style={s.flow}><Tag s={s} text={tr?'VERİ':'DATA'}/><Text style={s.arrow}>→</Text><Tag s={s} text={tr?'MODEL':'MODEL'}/><Text style={s.arrow}>→</Text><Tag s={s} text={tr?'EMİR':'EXEC'}/></View><View style={s.flow}><Tag s={s} text={tr?'MONITOR':'MONITOR'} good/><Tag s={s} text={tr?'LİMİT':'LIMIT'} good/><Tag s={s} text="KILL-SWITCH" risk={role==='risk'||role==='summary'}/></View></View>;
  }
}

function Card({s,label,value,good,risk}:{s:ReturnType<typeof createStyles>;label:string;value:string;good?:boolean;risk?:boolean}){return <View style={[s.card,good&&s.goodBorder,risk&&s.riskBorder]}><Text style={s.cardLabel}>{label}</Text><Text style={[s.cardValue,good&&s.good,risk&&s.bad]}>{value}</Text></View>}
function Tag({s,text,good,risk}:{s:ReturnType<typeof createStyles>;text:string;good?:boolean;risk?:boolean}){return <View style={[s.tag,good&&s.goodBorder,risk&&s.riskBorder]}><Text style={[s.tagText,good&&s.good,risk&&s.bad]}>{text}</Text></View>}
function Rule({s,text}:{s:ReturnType<typeof createStyles>;text:string}){return <View style={s.rule}><Text style={s.ruleText}>{text}</Text></View>}
function Meter({s,label,w,good,risk}:{s:ReturnType<typeof createStyles>;label:string;w:`${number}%`;good?:boolean;risk?:boolean}){return <View style={s.meterRow}><Text style={s.meterLabel}>{label}</Text><View style={s.track}><View style={[s.fill,{width:w},good&&s.goodBg,risk&&s.riskBg]}/></View></View>}
function Bar({s,label,h,good,risk}:{s:ReturnType<typeof createStyles>;label:string;h:number;good?:boolean;risk?:boolean}){return <View style={s.barSlot}><View style={[s.bar,{height:h},good&&s.goodBg,risk&&s.riskBg]}/><Text style={s.barLabel}>{label}</Text></View>}
function Mini({s,good,risk}:{s:ReturnType<typeof createStyles>;good:number;risk:number}){return <View style={s.mini}><View style={[s.miniBar,{width:`${good}%`},s.goodBg]}/><View style={[s.miniBar,{width:`${risk}%`},s.riskBg]}/></View>}
function Curve({s,mode}:{s:ReturnType<typeof createStyles>;mode:'stable'|'jagged'}){const pts=mode==='stable'?[24,35,46,54,62,69]:[24,68,32,76,38,70];return <View style={s.curve}>{pts.map((y,i)=><View key={i} style={[s.curveDot,{left:`${8+i*17}%`,bottom:y}]}/>) }<Text style={s.curveLabel}>{mode==='stable'?'SIGNAL':'OVERFIT'}</Text></View>}
function Spike({s}:{s:ReturnType<typeof createStyles>}){return <View style={s.shape}><View style={[s.shapeBar,{left:'45%',height:78}]}/></View>}
function Plateau({s}:{s:ReturnType<typeof createStyles>}){return <View style={s.shape}>{[20,32,44,56,68].map((x,i)=><View key={i} style={[s.shapeBar,{left:`${x}%`,height:48+(i%2)*6}]}/>)}</View>}

const createStyles=(theme:LearningTheme)=>StyleSheet.create({
  shell:{minHeight:220,borderRadius:theme.radius.medium,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.background,overflow:'hidden'},header:{paddingHorizontal:14,paddingTop:14,gap:3},title:{color:theme.colors.text,fontSize:15,lineHeight:20,fontWeight:'900'},detail:{color:theme.colors.textMuted,fontSize:10,lineHeight:15,fontWeight:'700'},canvas:{flex:1,justifyContent:'center',padding:14},stack:{gap:11},row:{flexDirection:'row',gap:9,alignItems:'stretch'},flow:{flexDirection:'row',gap:6,alignItems:'center',justifyContent:'center',flexWrap:'wrap'},card:{flex:1,minHeight:76,justifyContent:'center',alignItems:'center',gap:5,padding:9,borderRadius:11,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.surfaceMuted},cardLabel:{color:theme.colors.textMuted,fontSize:8,fontWeight:'900',letterSpacing:.5},cardValue:{color:theme.colors.text,fontSize:11,lineHeight:15,fontWeight:'900',textAlign:'center'},tag:{paddingVertical:10,paddingHorizontal:10,borderRadius:10,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.surfaceMuted},tagText:{color:theme.colors.text,fontSize:9,fontWeight:'900'},goodBorder:{borderColor:'rgba(45,212,191,0.38)'},riskBorder:{borderColor:'rgba(248,113,113,0.38)'},good:{color:theme.colors.success},bad:{color:theme.colors.risk},goodBg:{backgroundColor:theme.colors.success},riskBg:{backgroundColor:theme.colors.risk},operator:{alignSelf:'center',color:theme.colors.textMuted,fontSize:20,fontWeight:'900'},arrow:{color:theme.colors.textMuted,fontSize:17,fontWeight:'900'},rule:{minHeight:52,justifyContent:'center',alignItems:'center',padding:10,borderRadius:11,borderWidth:1,borderColor:'rgba(45,212,191,0.25)',backgroundColor:'rgba(45,212,191,0.05)'},ruleText:{color:theme.colors.text,fontSize:10,lineHeight:15,fontWeight:'800',textAlign:'center'},barRow:{height:105,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around',gap:8},barSlot:{flex:1,alignItems:'center',justifyContent:'flex-end',gap:5},bar:{width:'72%',borderRadius:7,backgroundColor:theme.colors.primary},barLabel:{color:theme.colors.textMuted,fontSize:8,fontWeight:'900'},compare:{flex:1,minHeight:112,padding:9,borderRadius:11,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.surfaceMuted,gap:8},compareTitle:{color:theme.colors.text,fontSize:10,fontWeight:'900',textAlign:'center'},note:{color:theme.colors.textMuted,fontSize:8,lineHeight:12,fontWeight:'700',textAlign:'center'},mini:{gap:6},miniBar:{height:12,borderRadius:99},timeline:{height:60,flexDirection:'row',gap:5},segment:{borderRadius:10,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.surfaceMuted,alignItems:'center',justifyContent:'center'},holdout:{borderColor:'rgba(45,212,191,0.38)'},future:{borderColor:'rgba(248,113,113,0.38)'},segmentText:{color:theme.colors.text,fontSize:9,fontWeight:'900',textAlign:'center'},meterRow:{gap:4},meterLabel:{color:theme.colors.text,fontSize:8,fontWeight:'900'},track:{height:12,borderRadius:99,backgroundColor:theme.colors.surfaceMuted,overflow:'hidden'},fill:{height:'100%',borderRadius:99,backgroundColor:theme.colors.primary},curve:{flex:1,height:112,position:'relative',borderRadius:11,backgroundColor:theme.colors.surfaceMuted},curveDot:{position:'absolute',width:9,height:9,borderRadius:5,backgroundColor:theme.colors.primary},curveLabel:{position:'absolute',bottom:8,left:8,color:theme.colors.textMuted,fontSize:8,fontWeight:'900'},survivors:{flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingVertical:22},assetDot:{width:20,height:20,borderRadius:10,backgroundColor:theme.colors.success},deadDot:{backgroundColor:theme.colors.surfaceMuted,borderWidth:1,borderColor:theme.colors.risk},shape:{height:90,position:'relative',borderRadius:11,backgroundColor:theme.colors.surfaceMuted},shapeBar:{position:'absolute',bottom:8,width:12,borderRadius:6,backgroundColor:theme.colors.primary},miniBar:{height:12,borderRadius:99}
});
