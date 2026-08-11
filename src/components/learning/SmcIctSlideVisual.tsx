import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'methodology' | 'sweep' | 'grab' | 'inducement' | 'displacement' | 'fvg' | 'orderBlock' | 'mitigation' | 'range' | 'premium' | 'mss' | 'confluence';

export interface SmcIctSlideVisualProps { assetRef: string; alt: string; language: LearningLanguage; role: SlideRole; theme?: LearningTheme; }

function topicFor(assetRef: string): Topic | undefined {
  if (assetRef.includes('smc-ict-dili-neden-metodolojiye-bagli')) return 'methodology';
  if (assetRef.includes('liquidity-sweep-nedir')) return 'sweep';
  if (assetRef.includes('liquidity-grab-ve-sweep-farki')) return 'grab';
  if (assetRef.includes('inducement-ne-anlatir')) return 'inducement';
  if (assetRef.includes('displacement-nasil-okunur')) return 'displacement';
  if (assetRef.includes('fvg-smc-baglaminda-nasil-okunur')) return 'fvg';
  if (assetRef.includes('order-block-smc-baglaminda-nasil-tanimlanir')) return 'orderBlock';
  if (assetRef.includes('mitigation-ne-anlatir')) return 'mitigation';
  if (assetRef.includes('dealing-range-ve-equilibrium')) return 'range';
  if (assetRef.includes('premium-discount-ne-anlatir')) return 'premium';
  if (assetRef.includes('mss-choch-ile-ayni-mi')) return 'mss';
  if (assetRef.includes('smc-confluence-nasil-kullanilmali')) return 'confluence';
  return undefined;
}

export function isSmcIctSlideAsset(assetRef: string): boolean { return Boolean(topicFor(assetRef)); }

const TITLES: Record<Topic, { tr: string; en: string }> = {
  methodology: { tr: 'Gözlem ≠ metodoloji etiketi', en: 'Observation ≠ methodology label' },
  sweep: { tr: 'Seviye ötesi → geri dönüş', en: 'Beyond level → return' },
  grab: { tr: 'Grab / Sweep · kriteri önce yaz', en: 'Grab / Sweep · define criteria first' },
  inducement: { tr: 'Ara referans ≠ kanıtlanmış niyet', en: 'Intermediate reference ≠ proven intent' },
  displacement: { tr: 'Hız + genişleme + yapı', en: 'Speed + expansion + structure' },
  fvg: { tr: 'FVG · hızlı fiyatlama izi', en: 'FVG · rapid repricing footprint' },
  orderBlock: { tr: 'Order Block · bağlamlı alan', en: 'Order Block · contextual zone' },
  mitigation: { tr: 'Alana dönüş ≠ garanti tepki', en: 'Zone revisit ≠ guaranteed reaction' },
  range: { tr: 'Low · Equilibrium · High', en: 'Low · Equilibrium · High' },
  premium: { tr: 'Göreli konum, değerleme değil', en: 'Relative location, not valuation' },
  mss: { tr: 'MSS / CHoCH · tanım önce', en: 'MSS / CHoCH · definition first' },
  confluence: { tr: 'Etiket sayma · kanıt kaynağını ayır', en: 'Do not count labels · separate evidence' },
};

const ROLE_TEXT: Record<SlideRole, { tr: string; en: string }> = {
  hook: { tr: 'Önce gözlemi gör', en: 'See the observation first' }, concept: { tr: 'Tanımı sadeleştir', en: 'Simplify the definition' }, practice: { tr: 'Grafikte uygula', en: 'Apply it on the chart' },
  misconception: { tr: 'Etiket tuzağını ayır', en: 'Separate the label trap' }, risk: { tr: 'Garanti dilini kaldır', en: 'Remove certainty language' }, summary: { tr: 'Tek metodoloji kuralı', en: 'One methodology rule' },
};

export function SmcIctSlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: SmcIctSlideVisualProps) {
  const topic = topicFor(assetRef); if (!topic) return null;
  const s = createStyles(theme); const tr = language === 'tr';
  return <View style={s.shell} accessibilityLabel={alt}><View style={s.header}><Text style={s.title}>{TITLES[topic][language]}</Text><Text style={s.detail}>{ROLE_TEXT[role][language]}</Text></View><View style={s.canvas}>{render(topic, role, s, tr)}</View></View>;
}

function render(topic: Topic, role: SlideRole, s: ReturnType<typeof createStyles>, tr: boolean) {
  if (topic === 'methodology') return <View style={s.stack}><View style={s.row}><LabelBox s={s} title={tr?'GÖZLEM':'OBSERVATION'} value={tr?'Tepe aşıldı → geri dönüldü':'High breached → returned'} good/><LabelBox s={s} title="FRAMEWORK A" value="SWEEP"/><LabelBox s={s} title="FRAMEWORK B" value="GRAB"/></View><Rule s={s} text={tr?'Ortak gerçek fiyat davranışı; etiket yönteme bağlı':'Shared fact is price behavior; label depends on methodology'} /></View>;
  if (topic === 'sweep') return <ChartBox s={s}><Level s={s} top={54}/><Path s={s} points={[[5,72],[24,60],[42,55],[57,31],[68,20],[78,58],[94,67]]} risk={role==='misconception'}/><Badge s={s} text={tr?'AŞIM':'BREACH'} left="61%" top={16}/><Badge s={s} text={tr?'GERİ DÖNÜŞ':'RETURN'} left="76%" top={61} good/></ChartBox>;
  if (topic === 'grab') return <View style={s.row}><Scenario s={s} title="GRAB?" heights={[48,30,72,54]} note={tr?'kısa / keskin':'short / sharp'}/><Scenario s={s} title="SWEEP?" heights={[47,26,20,29]} note={tr?'daha geniş / uzun':'broader / longer'}/></View>;
  if (topic === 'inducement') return <ChartBox s={s}><Path s={s} points={[[4,72],[20,44],[35,61],[50,39],[63,57],[80,24],[96,17]]}/><Badge s={s} text={tr?'ARA SWING':'INTERMEDIATE'} left="52%" top={55}/><Badge s={s} text={tr?'NİYET? BİLİNMİYOR':'INTENT? UNKNOWN'} left="10%" top={12} risk={role==='risk'||role==='misconception'}/></ChartBox>;
  if (topic === 'displacement') return <View style={s.row}><Scenario s={s} title={tr?'NORMAL':'NORMAL'} heights={[35,43,38,47]} note={tr?'yakın dönem aralık':'recent range'}/><Scenario s={s} title="DISPLACEMENT" heights={[28,48,78,86]} note={tr?'genişleme + yapı':'expansion + structure'} good/></View>;
  if (topic === 'fvg') return <ChartBox s={s}><Candle s={s} x="18%" bottom={30} h={48}/><Candle s={s} x="43%" bottom={41} h={82} good/><Candle s={s} x="70%" bottom={66} h={46}/><View style={s.fvgZone}><Text style={s.zoneText}>FVG</Text></View><Text style={s.noGuarantee}>{tr?'DOLMA GARANTİSİ YOK':'NO FILL GUARANTEE'}</Text></ChartBox>;
  if (topic === 'orderBlock') return <ChartBox s={s}><View style={s.orderZone}><Text style={s.zoneText}>OB?</Text></View><Candle s={s} x="22%" bottom={26} h={35} risk={role==='misconception'}/><Candle s={s} x="42%" bottom={33} h={55}/><Candle s={s} x="61%" bottom={51} h={74} good/><Candle s={s} x="79%" bottom={76} h={45} good/></ChartBox>;
  if (topic === 'mitigation') return <ChartBox s={s}><View style={s.orderZone}><Text style={s.zoneText}>{tr?'ALAN':'ZONE'}</Text></View><Path s={s} points={[[4,28],[21,21],[40,17],[57,35],[70,58],[80,69],[92,49]]}/><Badge s={s} text={tr?'TEMAS':'REVISIT'} left="73%" top={66} good={role==='practice'}/></ChartBox>;
  if (topic === 'range') return <View style={s.range}><Text style={s.rangeTop}>HIGH · 100%</Text><View style={s.rangeLine}/><Text style={s.eq}>EQUILIBRIUM · 50%</Text><View style={s.rangeLine}/><Text style={s.rangeBottom}>LOW · 0%</Text></View>;
  if (topic === 'premium') return <View style={s.range}><View style={[s.half,s.premium]}><Text style={s.halfTitle}>PREMIUM</Text><Text style={s.halfNote}>{tr?'üst yarı · göreli':'upper half · relative'}</Text></View><Text style={s.eq}>EQ · 50%</Text><View style={[s.half,s.discount]}><Text style={s.halfTitle}>DISCOUNT</Text><Text style={s.halfNote}>{tr?'alt yarı · göreli':'lower half · relative'}</Text></View></View>;
  if (topic === 'mss') return <View style={s.stack}><View style={s.row}><LabelBox s={s} title="CHoCH" value={tr?'erken yapı değişimi?':'early structure change?'}/><LabelBox s={s} title="MSS" value={tr?'bazı yöntemlerde + displacement':'some frameworks + displacement'} good/></View><Rule s={s} text={tr?'Evrensel eş anlamlı değil · kriteri belirt':'Not universally synonymous · state your criteria'} /></View>;
  return <View style={s.stack}><View style={s.sharedSource}><Text style={s.sharedTitle}>{tr?'AYNI FİYAT HAREKETİ':'SAME PRICE MOVE'}</Text><View style={s.tags}><SmallTag s={s} text="SWEEP"/><SmallTag s={s} text="FVG"/><SmallTag s={s} text="OB"/><SmallTag s={s} text="MSS"/><SmallTag s={s} text="DISP."/></View></View><Rule s={s} text={tr?'5 etiket ≠ 5 bağımsız kanıt':'5 labels ≠ 5 independent evidence sources'} /></View>;
}

function LabelBox({s,title,value,good}:{s:ReturnType<typeof createStyles>;title:string;value:string;good?:boolean}){return <View style={[s.labelBox,good&&s.goodBorder]}><Text style={s.labelTitle}>{title}</Text><Text style={[s.labelValue,good&&s.good]}>{value}</Text></View>}
function Rule({s,text}:{s:ReturnType<typeof createStyles>;text:string}){return <View style={s.rule}><Text style={s.ruleText}>{text}</Text></View>}
function ChartBox({s,children}:{s:ReturnType<typeof createStyles>;children:React.ReactNode}){return <View style={s.chart}>{children}<View style={[s.gridLine,{top:'33%'}]}/><View style={[s.gridLine,{top:'66%'}]}/></View>}
function Level({s,top}:{s:ReturnType<typeof createStyles>;top:number}){return <View style={[s.level,{top}]}/>} 
function Path({s,points,risk}:{s:ReturnType<typeof createStyles>;points:number[][];risk?:boolean}){return <>{points.map(([x,y],i)=><View key={i} style={[s.pathDot,risk&&s.riskBg,{left:`${x}%`,top:y}]}/>)}</>}
function Badge({s,text,left,top,good,risk}:{s:ReturnType<typeof createStyles>;text:string;left:`${number}%`;top:number;good?:boolean;risk?:boolean}){return <View style={[s.badge,{left,top},good&&s.goodBorder,risk&&s.riskBorder]}><Text style={[s.badgeText,good&&s.good,risk&&s.bad]}>{text}</Text></View>}
function Scenario({s,title,heights,note,good}:{s:ReturnType<typeof createStyles>;title:string;heights:number[];note:string;good?:boolean}){return <View style={[s.scenario,good&&s.goodBorder]}><Text style={s.scenarioTitle}>{title}</Text><View style={s.bars}>{heights.map((h,i)=><View key={i} style={[s.scenarioBar,{height:h},good&&i>1&&s.goodBg]}/>)}</View><Text style={s.scenarioNote}>{note}</Text></View>}
function Candle({s,x,bottom,h,good,risk}:{s:ReturnType<typeof createStyles>;x:`${number}%`;bottom:number;h:number;good?:boolean;risk?:boolean}){return <View style={[s.candle,{left:x,bottom,height:h},good&&s.goodBg,risk&&s.riskBg]}/>} 
function SmallTag({s,text}:{s:ReturnType<typeof createStyles>;text:string}){return <View style={s.smallTag}><Text style={s.smallTagText}>{text}</Text></View>}

const createStyles=(theme:LearningTheme)=>StyleSheet.create({
  shell:{minHeight:220,borderRadius:theme.radius.medium,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.background,overflow:'hidden'},header:{paddingHorizontal:14,paddingTop:14,gap:3},title:{color:theme.colors.text,fontSize:15,lineHeight:20,fontWeight:'900'},detail:{color:theme.colors.textMuted,fontSize:10,lineHeight:15,fontWeight:'700'},canvas:{flex:1,justifyContent:'center',padding:14},stack:{gap:11},row:{flexDirection:'row',gap:8,alignItems:'stretch'},labelBox:{flex:1,minHeight:82,justifyContent:'center',alignItems:'center',gap:5,padding:8,borderRadius:11,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.surfaceMuted},labelTitle:{color:theme.colors.textMuted,fontSize:8,fontWeight:'900'},labelValue:{color:theme.colors.text,fontSize:9,lineHeight:13,fontWeight:'800',textAlign:'center'},good:{color:theme.colors.success},bad:{color:theme.colors.risk},goodBg:{backgroundColor:theme.colors.success},riskBg:{backgroundColor:theme.colors.risk},goodBorder:{borderColor:'rgba(45,212,191,0.42)'},riskBorder:{borderColor:'rgba(248,113,113,0.42)'},rule:{minHeight:48,justifyContent:'center',alignItems:'center',padding:9,borderRadius:10,borderWidth:1,borderColor:'rgba(45,212,191,0.24)',backgroundColor:'rgba(45,212,191,0.05)'},ruleText:{color:theme.colors.text,fontSize:10,lineHeight:15,fontWeight:'800',textAlign:'center'},chart:{height:132,borderRadius:11,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.surfaceMuted,position:'relative',overflow:'hidden'},gridLine:{position:'absolute',left:0,right:0,height:1,backgroundColor:theme.colors.border},level:{position:'absolute',left:'8%',right:'8%',height:1,borderStyle:'dashed',borderTopWidth:1,borderColor:theme.colors.textMuted},pathDot:{position:'absolute',width:9,height:9,borderRadius:5,backgroundColor:theme.colors.primary},badge:{position:'absolute',paddingVertical:3,paddingHorizontal:6,borderRadius:7,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.background},badgeText:{color:theme.colors.textMuted,fontSize:7,fontWeight:'900'},scenario:{flex:1,minHeight:128,padding:9,borderRadius:11,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.surfaceMuted,gap:6},scenarioTitle:{color:theme.colors.text,fontSize:9,fontWeight:'900',textAlign:'center'},bars:{height:82,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around',gap:5},scenarioBar:{flex:1,maxWidth:18,borderRadius:5,backgroundColor:theme.colors.primary},scenarioNote:{color:theme.colors.textMuted,fontSize:8,fontWeight:'700',textAlign:'center'},candle:{position:'absolute',width:13,borderRadius:4,backgroundColor:theme.colors.primary},fvgZone:{position:'absolute',left:'31%',right:'27%',top:53,height:24,borderWidth:1,borderColor:theme.colors.warning,backgroundColor:'rgba(245,158,11,0.10)',alignItems:'center',justifyContent:'center'},orderZone:{position:'absolute',left:'12%',width:'23%',top:48,height:40,borderWidth:1,borderColor:theme.colors.warning,backgroundColor:'rgba(245,158,11,0.09)',alignItems:'center',justifyContent:'center'},zoneText:{color:theme.colors.warning,fontSize:8,fontWeight:'900'},noGuarantee:{position:'absolute',right:8,bottom:7,color:theme.colors.textMuted,fontSize:7,fontWeight:'900'},range:{minHeight:140,borderRadius:11,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.surfaceMuted,justifyContent:'space-between',padding:12},rangeTop:{color:theme.colors.text,fontSize:9,fontWeight:'900',textAlign:'right'},rangeBottom:{color:theme.colors.text,fontSize:9,fontWeight:'900'},rangeLine:{height:1,backgroundColor:theme.colors.border},eq:{color:theme.colors.primary,fontSize:9,fontWeight:'900',textAlign:'center'},half:{flex:1,borderRadius:9,alignItems:'center',justifyContent:'center',gap:4},premium:{backgroundColor:'rgba(248,113,113,0.07)'},discount:{backgroundColor:'rgba(45,212,191,0.07)'},halfTitle:{color:theme.colors.text,fontSize:10,fontWeight:'900'},halfNote:{color:theme.colors.textMuted,fontSize:8,fontWeight:'700'},sharedSource:{minHeight:100,borderRadius:11,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.surfaceMuted,padding:10,gap:12,justifyContent:'center'},sharedTitle:{color:theme.colors.text,fontSize:10,fontWeight:'900',textAlign:'center'},tags:{flexDirection:'row',flexWrap:'wrap',gap:6,justifyContent:'center'},smallTag:{paddingVertical:5,paddingHorizontal:8,borderRadius:8,borderWidth:1,borderColor:theme.colors.primary,backgroundColor:'rgba(45,212,191,0.05)'},smallTagText:{color:theme.colors.primary,fontSize:7,fontWeight:'900'}
});
