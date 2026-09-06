import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type Topic = 'methodology' | 'sweep' | 'grab' | 'inducement' | 'displacement' | 'fvg' | 'orderBlock' | 'mitigation' | 'range' | 'premium' | 'mss' | 'confluence';

export interface AcademySmcPremiumHookVisualProps { assetRef: string; alt: string; theme?: LearningTheme; }

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

export function isAcademySmcPremiumHookAsset(assetRef: string): boolean { return Boolean(topicFor(assetRef)); }

export function AcademySmcPremiumHookVisual({ assetRef, alt, theme = defaultLearningTheme }: AcademySmcPremiumHookVisualProps) {
  const topic = topicFor(assetRef); if (!topic) return null;
  const s = createStyles(theme);
  return (
    <View style={s.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={s.gridH1} /><View style={s.gridH2} /><View style={s.gridV1} /><View style={s.gridV2} />
      {topic === 'methodology' ? <Methodology s={s} /> : null}
      {topic === 'sweep' ? <Sweep s={s} /> : null}
      {topic === 'grab' ? <Grab s={s} /> : null}
      {topic === 'inducement' ? <Inducement s={s} /> : null}
      {topic === 'displacement' ? <Displacement s={s} /> : null}
      {topic === 'fvg' ? <Fvg s={s} /> : null}
      {topic === 'orderBlock' ? <OrderBlock s={s} /> : null}
      {topic === 'mitigation' ? <Mitigation s={s} /> : null}
      {topic === 'range' ? <Range s={s} /> : null}
      {topic === 'premium' ? <Premium s={s} /> : null}
      {topic === 'mss' ? <Mss s={s} /> : null}
      {topic === 'confluence' ? <Confluence s={s} /> : null}
    </View>
  );
}

type S = ReturnType<typeof createStyles>;
function Seg({ s, left, top, width, rotate, accent = false, muted = false, warn = false }: { s:S; left:`${number}%`; top:`${number}%`; width:`${number}%`; rotate:number; accent?:boolean; muted?:boolean; warn?:boolean }) { return <View style={[s.seg, accent&&s.segAccent, muted&&s.segMuted, warn&&s.segWarn, { left, top, width, transform:[{rotate:`${rotate}deg`}]}]} />; }
function P({ s, left, top, accent=false, warn=false }: { s:S; left:`${number}%`; top:`${number}%`; accent?:boolean; warn?:boolean }) { return <View style={[s.point, accent&&s.pointAccent, warn&&s.pointWarn, { left, top }]} />; }
function Level({ s, top, tone='neutral' }: { s:S; top:`${number}%`; tone?:'neutral'|'good'|'warn' }) { return <View style={[s.level,{top},tone==='good'&&s.levelGood,tone==='warn'&&s.levelWarn]} />; }

function Methodology({s}:{s:S}) { return <View style={s.stage}><View style={s.methodObservation}><Seg s={s} left="8%" top="65%" width="25%" rotate={-18} muted/><Seg s={s} left="29%" top="58%" width="23%" rotate={20} muted/><Seg s={s} left="48%" top="62%" width="25%" rotate={-30} accent/><Seg s={s} left="68%" top="43%" width="20%" rotate={25} accent/></View><View style={s.methodSplit}><View style={s.methodCard}><View style={s.methodGlyph}><View style={s.methodGlyphLine}/></View></View><View style={s.methodStem}/><View style={s.methodCard}><View style={[s.methodGlyph,s.methodGlyphAlt]}><View style={s.methodGlyphLine}/></View></View></View></View>; }
function Sweep({s}:{s:S}) { return <View style={s.stage}><Level s={s} top="42%" tone="warn"/><Seg s={s} left="7%" top="69%" width="22%" rotate={-16} muted/><Seg s={s} left="26%" top="62%" width="22%" rotate={14} muted/><Seg s={s} left="45%" top="57%" width="22%" rotate={-34} accent/><P s={s} left="63%" top="34%" accent/><Seg s={s} left="61%" top="35%" width="18%" rotate={38} accent/><Seg s={s} left="76%" top="50%" width="16%" rotate={18} muted/><P s={s} left="79%" top="51%" warn/><View style={s.sweepHalo}/></View>; }
function Grab({s}:{s:S}) { return <View style={s.stage}><View style={s.twin}><MiniSpike s={s} broad={false}/><MiniSpike s={s} broad/></View></View>; }
function MiniSpike({s,broad}:{s:S;broad:boolean}) { return <View style={s.mini}><Level s={s} top="48%" tone="warn"/><View style={[s.spike,{height:broad?92:58,top:broad?26:48}]} /><View style={[s.spikeReturn,{width:broad?'44%':'27%'}]} /></View>; }
function Inducement({s}:{s:S}) { return <View style={s.stage}><Seg s={s} left="7%" top="69%" width="19%" rotate={-28} muted/><Seg s={s} left="23%" top="54%" width="18%" rotate={28} muted/><Seg s={s} left="38%" top="63%" width="19%" rotate={-27} muted/><P s={s} left="54%" top="54%" warn/><View style={s.questionRing}/><Seg s={s} left="53%" top="55%" width="20%" rotate={-23} accent/><Seg s={s} left="70%" top="44%" width="20%" rotate={-25} accent/><P s={s} left="88%" top="32%" accent/></View>; }
function Displacement({s}:{s:S}) { return <View style={s.stage}><View style={s.candleRow}>{[42,52,47,62,98,128].map((h,i)=><View key={i} style={[s.candle,{height:h},i>=4&&s.candleAccent]}><View style={s.wick}/></View>)}</View><View style={s.displacementTrail}/></View>; }
function Fvg({s}:{s:S}) { return <View style={s.stage}><View style={s.fvgCandles}><Candle s={s} h={72}/><Candle s={s} h={142} accent/><Candle s={s} h={76}/></View><View style={s.fvgZone}><Text style={s.fvgText}>FVG</Text></View></View>; }
function Candle({s,h,accent=false}:{s:S;h:number;accent?:boolean}) { return <View style={[s.bigCandle,{height:h},accent&&s.bigCandleAccent]}><View style={s.bigWick}/></View>; }
function OrderBlock({s}:{s:S}) { return <View style={s.stage}><View style={s.obZone}><Text style={s.obText}>OB</Text></View><View style={s.obCandles}><Candle s={s} h={50}/><Candle s={s} h={68}/><Candle s={s} h={118} accent/><Candle s={s} h={145} accent/></View><View style={s.departureArrow}/></View>; }
function Mitigation({s}:{s:S}) { return <View style={s.stage}><View style={s.mitigationZone}/><Seg s={s} left="10%" top="62%" width="22%" rotate={-24} accent/><Seg s={s} left="29%" top="50%" width="24%" rotate={-24} accent/><Seg s={s} left="50%" top="38%" width="22%" rotate={24} muted/><Seg s={s} left="68%" top="47%" width="18%" rotate={33} muted/><P s={s} left="82%" top="61%" warn/><View style={s.revisitHalo}/></View>; }
function Range({s}:{s:S}) { return <View style={s.stage}><Level s={s} top="24%" tone="warn"/><Level s={s} top="50%"/><Level s={s} top="76%" tone="good"/><Seg s={s} left="8%" top="68%" width="18%" rotate={-32} muted/><Seg s={s} left="23%" top="52%" width="18%" rotate={29} muted/><Seg s={s} left="38%" top="62%" width="18%" rotate={-28} muted/><Seg s={s} left="53%" top="48%" width="18%" rotate={27} accent/><Seg s={s} left="68%" top="57%" width="18%" rotate={-27} accent/></View>; }
function Premium({s}:{s:S}) { return <View style={s.stage}><View style={s.premiumHalf}/><View style={s.discountHalf}/><View style={s.eqLine}/><View style={s.locationDot}/><View style={s.locationHalo}/></View>; }
function Mss({s}:{s:S}) { return <View style={s.stage}><Seg s={s} left="7%" top="66%" width="21%" rotate={-26} muted/><Seg s={s} left="25%" top="53%" width="20%" rotate={20} muted/><Seg s={s} left="42%" top="57%" width="18%" rotate={-24} muted/><Level s={s} top="58%"/><Seg s={s} left="57%" top="52%" width="18%" rotate={34} warn/><Seg s={s} left="72%" top="66%" width="20%" rotate={22} warn/><View style={s.mssImpulse}/></View>; }
function Confluence({s}:{s:S}) { return <View style={s.stage}><View style={s.coreMove}><Seg s={s} left="12%" top="63%" width="24%" rotate={-22} accent/><Seg s={s} left="33%" top="51%" width="22%" rotate={17} accent/><Seg s={s} left="52%" top="55%" width="25%" rotate={-25} accent/></View>{[['15%','22%'],['39%','16%'],['67%','18%'],['79%','67%'],['28%','74%']].map(([l,t],i)=><View key={i} style={[s.evidenceNode,{left:l as `${number}%`,top:t as `${number}%`}]}><View style={s.evidenceInner}/></View>)}<View style={s.coreHalo}/></View>; }

const createStyles=(theme:LearningTheme)=>StyleSheet.create({
  shell:{width:'100%',minHeight:300,overflow:'hidden',borderRadius:22,borderWidth:1,borderColor:'#244B61',backgroundColor:'#071521',padding:16,position:'relative'},
  stage:{flex:1,minHeight:266,position:'relative',overflow:'hidden',borderRadius:18,backgroundColor:'#091B29',borderWidth:1,borderColor:'#1D4054'},
  gridH1:{position:'absolute',left:16,right:16,top:'34%',height:1,backgroundColor:'#102E40'},gridH2:{position:'absolute',left:16,right:16,top:'67%',height:1,backgroundColor:'#102E40'},gridV1:{position:'absolute',top:16,bottom:16,left:'36%',width:1,backgroundColor:'#102E40'},gridV2:{position:'absolute',top:16,bottom:16,left:'69%',width:1,backgroundColor:'#102E40'},
  seg:{position:'absolute',height:5,borderRadius:3,backgroundColor:'#6D8798'},segAccent:{backgroundColor:'#58DDCB'},segMuted:{backgroundColor:'#7891A0'},segWarn:{backgroundColor:'#C98F60'},point:{position:'absolute',width:11,height:11,marginLeft:-5,marginTop:-5,borderRadius:6,backgroundColor:'#90A6B4',borderWidth:2,borderColor:'#0A1C29'},pointAccent:{backgroundColor:'#61E2D0'},pointWarn:{backgroundColor:'#CA9162'},level:{position:'absolute',left:'7%',right:'7%',height:2,backgroundColor:'#426074',opacity:.75},levelGood:{backgroundColor:'#2D7E75'},levelWarn:{backgroundColor:'#7A6043'},
  methodObservation:{position:'absolute',left:'5%',right:'46%',top:'16%',bottom:'18%',borderRadius:16,borderWidth:1,borderColor:'#315166',backgroundColor:'#0D2231'},methodSplit:{position:'absolute',right:'7%',top:'21%',bottom:'21%',width:'34%',justifyContent:'space-between',alignItems:'center'},methodCard:{width:'100%',height:74,borderRadius:16,borderWidth:1,borderColor:'#34576B',backgroundColor:'#11283A',alignItems:'center',justifyContent:'center'},methodStem:{width:2,flex:1,backgroundColor:'#385D70'},methodGlyph:{width:52,height:28,borderRadius:8,borderWidth:1,borderColor:'#5EDCCB',justifyContent:'center',paddingHorizontal:7},methodGlyphAlt:{borderColor:'#7D93A2'},methodGlyphLine:{height:4,borderRadius:2,backgroundColor:'#6CDACB',transform:[{rotate:'-9deg'}]},
  sweepHalo:{position:'absolute',width:72,height:72,borderRadius:36,borderWidth:2,borderColor:'#9B704D',left:'54%',top:'23%',opacity:.75},twin:{flex:1,flexDirection:'row',gap:12,padding:16},mini:{flex:1,borderRadius:16,borderWidth:1,borderColor:'#2E4F63',backgroundColor:'#0D2231',position:'relative',overflow:'hidden'},spike:{position:'absolute',width:6,borderRadius:3,backgroundColor:'#5ADACA',left:'54%'},spikeReturn:{position:'absolute',height:5,borderRadius:3,backgroundColor:'#7F94A2',left:'54%',top:'46%',transform:[{rotate:'25deg'}]},questionRing:{position:'absolute',width:58,height:58,borderRadius:29,borderWidth:2,borderColor:'#9B704D',left:'45%',top:'43%'},
  candleRow:{position:'absolute',left:'9%',right:'9%',bottom:34,height:160,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around'},candle:{width:24,borderRadius:6,backgroundColor:'#536E80',position:'relative'},candleAccent:{backgroundColor:'#45C9B8'},wick:{position:'absolute',width:2,top:-18,bottom:-18,left:11,backgroundColor:'#7895A4'},displacementTrail:{position:'absolute',right:22,top:30,width:72,height:3,borderRadius:2,backgroundColor:'#58DDCB',transform:[{rotate:'-35deg'}]},
  fvgCandles:{position:'absolute',left:'16%',right:'16%',bottom:36,height:170,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around'},bigCandle:{width:38,borderRadius:8,backgroundColor:'#607D8F',position:'relative'},bigCandleAccent:{backgroundColor:'#42C9B7'},bigWick:{position:'absolute',width:2,top:-22,bottom:-22,left:18,backgroundColor:'#829EAD'},fvgZone:{position:'absolute',left:'42%',top:'38%',width:'25%',height:48,borderRadius:10,borderWidth:1,borderColor:'#9B704D',backgroundColor:'rgba(155,112,77,0.16)',alignItems:'center',justifyContent:'center'},fvgText:{color:'#B99B78',fontSize:12,fontWeight:'900',letterSpacing:1},
  obZone:{position:'absolute',left:'9%',bottom:34,width:'31%',height:68,borderRadius:12,borderWidth:1,borderColor:'#8C6B4C',backgroundColor:'rgba(139,101,68,0.16)',alignItems:'center',justifyContent:'center'},obText:{color:'#B59674',fontSize:12,fontWeight:'900'},obCandles:{position:'absolute',left:'19%',right:'13%',bottom:35,height:168,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around'},departureArrow:{position:'absolute',right:25,top:42,width:72,height:5,borderRadius:3,backgroundColor:'#5ADACA',transform:[{rotate:'-38deg'}]},
  mitigationZone:{position:'absolute',left:'7%',right:'7%',top:'60%',height:44,borderRadius:10,borderWidth:1,borderColor:'#8B6849',backgroundColor:'rgba(139,104,73,0.14)'},revisitHalo:{position:'absolute',width:62,height:62,borderRadius:31,borderWidth:2,borderColor:'#C38C5D',left:'74%',top:'52%',opacity:.75},
  premiumHalf:{position:'absolute',left:'7%',right:'7%',top:'9%',height:'39%',borderRadius:14,borderWidth:1,borderColor:'#71583E',backgroundColor:'rgba(119,84,52,0.16)'},discountHalf:{position:'absolute',left:'7%',right:'7%',bottom:'9%',height:'39%',borderRadius:14,borderWidth:1,borderColor:'#2C6C66',backgroundColor:'rgba(35,111,102,0.15)'},eqLine:{position:'absolute',left:'7%',right:'7%',top:'50%',height:2,backgroundColor:'#60798A'},locationDot:{position:'absolute',width:18,height:18,borderRadius:9,backgroundColor:'#5ADACA',right:'24%',top:'26%'},locationHalo:{position:'absolute',width:60,height:60,borderRadius:30,borderWidth:2,borderColor:'#4BC4B4',right:'18%',top:'18%',opacity:.45},
  mssImpulse:{position:'absolute',right:'13%',bottom:'17%',width:70,height:5,borderRadius:3,backgroundColor:'#C98F60',transform:[{rotate:'25deg'}]},coreMove:{...StyleSheet.absoluteFillObject},evidenceNode:{position:'absolute',width:42,height:42,borderRadius:21,borderWidth:1,borderColor:'#49677A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center'},evidenceInner:{width:12,height:12,borderRadius:6,backgroundColor:'#7895A4'},coreHalo:{position:'absolute',width:92,height:92,borderRadius:46,borderWidth:2,borderColor:'#53D3C2',left:'45%',top:'35%',opacity:.35},
});
