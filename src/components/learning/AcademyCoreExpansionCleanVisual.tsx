import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Scene =
  | { kind: 'flow'; labels: string[]; warn?: number }
  | { kind: 'bars'; values: number[]; labels: string[]; warn?: number }
  | { kind: 'compare'; left: number[]; right: number[]; labels: [string, string] }
  | { kind: 'chart'; mode: 'up' | 'range' | 'gap' | 'mean' | 'cycle' | 'track' }
  | { kind: 'network'; center: string; nodes: string[] }
  | { kind: 'levels'; labels: string[] }
  | { kind: 'matrix'; labels: string[] }
  | { kind: 'labor'; labels: [string, string, string, string] }
  | { kind: 'clock' }
  | { kind: 'rings'; labels: string[] };

export interface AcademyCoreExpansionCleanVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

const tx = (tr: boolean, a: string, b: string) => tr ? a : b;

function sceneFor(assetRef: string, tr: boolean, role: LessonSupportingVisualRole): Scene | undefined {
  const warn = role === 'risk' || role === 'misconception';

  // Economy expansion
  if (assetRef.includes('issizlik-verisi-ne-anlatir')) return { kind: 'labor', labels: [tx(tr,'İŞGÜCÜ','LABOR FORCE'),tx(tr,'İSTİHDAM','EMPLOYED'),tx(tr,'İŞSİZ','UNEMPLOYED'),tx(tr,'İŞGÜCÜ DIŞINDA','OUTSIDE LABOR FORCE')] };
  if (assetRef.includes('maliye-politikasi-nedir')) return { kind: 'flow', labels: [tx(tr,'VERGİ','TAX'),tx(tr,'BÜTÇE','BUDGET'),tx(tr,'HARCAMA','SPEND'),tx(tr,'TALEP','DEMAND')], warn: warn ? 2 : undefined };
  if (assetRef.includes('doviz-kuru-neden-degisir')) return { kind: 'network', center: 'FX', nodes: [tx(tr,'FAİZ','RATE'),tx(tr,'ENF.','INFL.'),tx(tr,'AKIM','FLOW'),tx(tr,'RİSK','RISK')] };
  if (assetRef.includes('verimlilik-neden-onemlidir')) return { kind: 'compare', left: [36,36,36], right: [48,64,82], labels: [tx(tr,'GİRDİ','INPUT'),tx(tr,'ÇIKTI','OUTPUT')] };
  if (assetRef.includes('ekonomik-veri-nasil-okunur')) return { kind: 'flow', labels: [tx(tr,'VERİ','DATA'),tx(tr,'BEKLENTİ','EXPECT.'),tx(tr,'ÖNCEKİ','PRIOR'),tx(tr,'REVİZE','REVISE')] };
  if (assetRef.includes('reel-ve-nominal-farki')) return { kind: 'compare', left: [82,82], right: [82,58], labels: [tx(tr,'NOMİNAL','NOMINAL'),tx(tr,'REEL','REAL')] };

  // Financial markets expansion
  if (assetRef.includes('kripto-piyasasi-nasil-farklidir')) return { kind: 'network', center: 'CRYPTO', nodes: ['SPOT','PERP','DEX','CEX'] };
  if (assetRef.includes('piyasa-seanslari-neden-onemlidir')) return { kind: 'clock' };
  if (assetRef.includes('islem-hacmi-ne-anlatir')) return { kind: 'bars', values: [34,58,92,48,76], labels: ['1','2','3','4','5'], warn: warn ? 4 : undefined };
  if (assetRef.includes('market-maker-ne-yapar')) return { kind: 'flow', labels: [tx(tr,'ALICI','BUY'),tx(tr,'DERİNLİK','DEPTH'),tx(tr,'SATICI','SELL')] };
  if (assetRef.includes('birincil-ve-ikincil-piyasa')) return { kind: 'flow', labels: [tx(tr,'İHRAÇ','ISSUE'),tx(tr,'YATIRIMCI','INVESTOR'),tx(tr,'PİYASA','MARKET'),tx(tr,'YATIRIMCI','INVESTOR')] };
  if (assetRef.includes('turev-urun-nedir')) return { kind: 'flow', labels: [tx(tr,'DAYANAK','UNDERLYING'),tx(tr,'SÖZLEŞME','CONTRACT'),tx(tr,'VADE/RİSK','TERM/RISK')], warn: warn ? 2 : undefined };

  // Technical expansion
  if (assetRef.includes('rsi-ne-anlatir-ne-anlatmaz')) return { kind: 'levels', labels: ['70','50','30'] };
  if (assetRef.includes('macd-ne-gosterir')) return { kind: 'chart', mode: 'track' };
  if (assetRef.includes('coklu-zaman-dilimi-nasil-kullanilir')) return { kind: 'compare', left: [30,55,80], right: [78,58,36], labels: ['15M','1D'] };
  if (assetRef.includes('formasyonlar-neden-kesin-degildir')) return { kind: 'compare', left: [28,56,82,46], right: [28,56,42,76], labels: [tx(tr,'AYNI ŞEKİL','SAME SHAPE'),tx(tr,'FARKLI SONUÇ','DIFF. OUTCOME')] };
  if (assetRef.includes('confluence-nedir')) return { kind: 'network', center: tx(tr,'FİYAT','PRICE'), nodes: [tx(tr,'YAPI','STRUCT.'),tx(tr,'SEVİYE','LEVEL'),tx(tr,'MOM.','MOM.'),tx(tr,'HACİM','VOLUME')] };
  if (assetRef.includes('indikatorlerin-sinirlari')) return { kind: 'flow', labels: [tx(tr,'FİYAT','PRICE'),tx(tr,'HESAP','CALC.'),tx(tr,'GÖSTERGE','INDIC.'),tx(tr,'YORUM','INTERP.')], warn: warn ? 3 : undefined };

  // Fundamental expansion
  if (assetRef.includes('buyume-kalitesi-nasil-okunur')) return { kind: 'compare', left: [42,68,94], right: [42,57,61], labels: [tx(tr,'SATIŞ','SALES'),tx(tr,'NAKİT','CASH')] };
  if (assetRef.includes('hisse-basina-metrikler-neden-onemlidir')) return { kind: 'flow', labels: [tx(tr,'TOPLAM','TOTAL'),tx(tr,'PAY','SHARES'),tx(tr,'HİSSE BAŞI','PER SHARE')] };
  if (assetRef.includes('degerleme-carpanlari-nasil-okunur')) return { kind: 'matrix', labels: ['P/E','EV/S','P/B','FCF'] };
  if (assetRef.includes('dcf-mantigi-nedir')) return { kind: 'flow', labels: [tx(tr,'GELECEK NAKİT','FUTURE CASH'),tx(tr,'İSKONTO','DISCOUNT'),tx(tr,'BUGÜN','TODAY')], warn: warn ? 1 : undefined };
  if (assetRef.includes('benzer-sirket-karsilastirmasi-nasil-yapilir')) return { kind: 'matrix', labels: ['A','B','C',tx(tr,'MEDYAN','MEDIAN')] };
  if (assetRef.includes('temel-analizin-sinirlari')) return { kind: 'network', center: tx(tr,'DEĞER','VALUE'), nodes: [tx(tr,'TAHMİN','EST.'),tx(tr,'VERİ','DATA'),tx(tr,'REJİM','REGIME'),tx(tr,'RİSK','RISK')] };

  // Risk & portfolio expansion
  if (assetRef.includes('portfoy-risk-faktorleri')) return { kind: 'network', center: tx(tr,'PORTFÖY','PORTF.'), nodes: [tx(tr,'FAİZ','RATE'),'FX',tx(tr,'BETA','BETA'),tx(tr,'KREDİ','CREDIT')] };
  if (assetRef.includes('yeniden-dengeleme-neden-yapilir')) return { kind: 'compare', left: [72,28], right: [50,50], labels: [tx(tr,'KAYMIŞ','DRIFTED'),tx(tr,'HEDEF','TARGET')] };
  if (assetRef.includes('likidite-riski-ne-zaman-buyur')) return { kind: 'compare', left: [90,72,55], right: [90,42,18], labels: [tx(tr,'NORMAL','NORMAL'),tx(tr,'STRES','STRESS')] };
  if (assetRef.includes('tail-risk-nedir')) return { kind: 'bars', values: [96,82,68,50,28,12], labels: ['','','','','',''], warn: 5 };
  if (assetRef.includes('stres-testi-ne-ise-yarar')) return { kind: 'matrix', labels: [tx(tr,'FAİZ↑','RATE↑'),'FX±',tx(tr,'HİSSE↓','EQ↓'),tx(tr,'LİKİDİTE↓','LIQ↓')] };
  if (assetRef.includes('buyuk-kayip-neden-zor-toparlanir')) return { kind: 'compare', left: [100,50], right: [50,100], labels: [tx(tr,'−50%','−50%'),tx(tr,'+100%','+100%')] };

  return undefined;
}

export function isAcademyCoreExpansionCleanAsset(assetRef: string): boolean {
  return Boolean(sceneFor(assetRef, true, 'concept'));
}

export function AcademyCoreExpansionCleanVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: AcademyCoreExpansionCleanVisualProps) {
  const scene = sceneFor(assetRef, language === 'tr', role);
  if (!scene) return null;
  const s = createStyles(theme);
  const warn = role === 'risk' || role === 'misconception';
  return <View style={[s.shell, role === 'hook' && s.shellHook, role === 'summary' && s.shellSummary, scene.kind === 'matrix' && role !== 'summary' && s.shellMatrix, scene.kind === 'labor' && role !== 'summary' && s.shellLabor]} accessibilityRole="image" accessibilityLabel={alt}>{render(scene,s,warn)}</View>;
}

type S = ReturnType<typeof createStyles>;
function Node({ s, label, good, warn, matrixCell = false }: { s:S; label:string; good?:boolean; warn?:boolean; matrixCell?:boolean }) { return <View style={[s.node,matrixCell&&s.matrixNode,good&&s.nodeGood,warn&&s.nodeWarn]}><Text style={[s.nodeText,good&&s.good,warn&&s.warn]}>{label}</Text></View>; }
function render(scene: Scene, s:S, warn:boolean): React.ReactNode {
  switch(scene.kind){
    case 'flow': return <View style={s.flow}>{scene.labels.map((label,index)=><React.Fragment key={`${label}-${index}`}><Node s={s} label={label} good={index===scene.labels.length-1&&!warn} warn={scene.warn===index}/>{index<scene.labels.length-1?<Text style={s.arrow}>→</Text>:null}</React.Fragment>)}</View>;
    case 'bars': return <View style={s.bars}>{scene.values.map((height,index)=><View key={index} style={s.barSlot}><View style={[s.bar,{height},index===scene.warn?s.barWarn:index===scene.values.length-1?s.barGood:undefined]}/><Text style={s.micro}>{scene.labels[index]}</Text></View>)}</View>;
    case 'compare': return <View style={s.compare}><MiniBars s={s} values={scene.left} label={scene.labels[0]}/><MiniBars s={s} values={scene.right} label={scene.labels[1]} warn={warn}/></View>;
    case 'chart': return <Chart s={s} mode={scene.mode} warn={warn}/>;
    case 'network': return <Network s={s} center={scene.center} nodes={scene.nodes} warn={warn}/>;
    case 'levels': return <View style={s.levels}>{scene.labels.map((label,index)=><View key={label} style={[s.level,index===1&&s.levelMid]}><Text style={s.levelText}>{label}</Text></View>)}</View>;
    case 'matrix': return <View style={s.matrix}>{scene.labels.map((label,index)=><Node key={`${label}-${index}`} s={s} label={label} matrixCell good={index===0&&!warn} warn={warn&&index===2}/>)}</View>;
    case 'labor': return <LaborMap s={s} labels={scene.labels} />;
    case 'clock': return <View style={s.clockWrap}><View style={s.clock}><View style={s.hand}/><View style={s.clockCore}/></View><View style={[s.event,warn&&s.eventWarn]}/></View>;
    case 'rings': return <View style={s.rings}><View style={s.ringOuter}><Text style={s.ringText}>{scene.labels[2]}</Text><View style={s.ringMid}><Text style={s.ringText}>{scene.labels[1]}</Text><View style={s.ringInner}><Text style={s.ringCore}>{scene.labels[0]}</Text></View></View></View></View>;
  }
}
function LaborMap({s,labels}:{s:S;labels:[string,string,string,string]}){return <View style={s.labor}><View style={s.laborForce}><Text style={s.laborForceText}>{labels[0]}</Text></View><View style={s.laborJoin}><Node s={s} label={labels[1]} good/><Text style={s.arrow}>+</Text><Node s={s} label={labels[2]}/></View><View style={s.laborOutside}><Text style={s.laborOutsideText}>{labels[3]}</Text></View></View>}
function MiniBars({s,values,label,warn}:{s:S;values:number[];label:string;warn?:boolean}){return <View style={s.panel}><Text style={s.panelLabel}>{label}</Text><View style={s.miniBars}>{values.map((h,index)=><View key={index} style={[s.miniBar,{height:h},index===values.length-1&&!warn&&s.barGood,warn&&index===values.length-1&&s.barWarn]}/>)}</View></View>}
function Chart({s,mode,warn}:{s:S;mode:'up'|'range'|'gap'|'mean'|'cycle'|'track';warn:boolean}){const sets={up:[72,60,48,37,28,20],range:[58,38,60,40,57,42],gap:[68,60,54,28,70,62],mean:[22,48,70,54,31,47],cycle:[66,38,27,51,72,43],track:[66,57,49,54,43,35]};const ys=sets[mode];return <View style={s.chart}>{mode==='mean'?<View style={s.midLine}/>:null}{mode==='gap'?<View style={s.gapZone}/>:null}{mode==='track'?<><View style={s.track2}/><View style={s.track3}/></>:null}{ys.map((y,index)=><View key={index} style={[s.chartDot,{left:`${8+index*17}%`,top:`${y}%`},warn&&index===ys.length-1&&s.chartWarn]}/>)}</View>}
function Network({s,center,nodes,warn}:{s:S;center:string;nodes:string[];warn:boolean}){return <View style={s.network}><View style={s.centerNode}><Text style={s.centerText}>{center}</Text></View>{nodes.slice(0,4).map((label,index)=><View key={`${label}-${index}`} style={[s.netNode,index===0?s.top:index===1?s.right:index===2?s.bottom:s.left,warn&&index===3&&s.nodeWarn]}><Text style={s.micro}>{label}</Text></View>)}<View style={s.netH}/><View style={s.netV}/></View>}
const createStyles=(_theme:LearningTheme)=>StyleSheet.create({shell:{width:'100%',minHeight:260,borderRadius:18,borderWidth:1,borderColor:'#24465C',backgroundColor:'#081725',padding:14,justifyContent:'center',overflow:'hidden'},shellHook:{minHeight:270,borderRadius:22,backgroundColor:'#071521'},shellSummary:{minHeight:180},shellMatrix:{minHeight:260},shellLabor:{minHeight:296},good:{color:'#5EEAD4'},warn:{color:'#D09263'},micro:{color:'#A5B6C0',fontSize:8,fontWeight:'900',textAlign:'center'},flow:{minHeight:150,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,flexWrap:'wrap'},node:{minWidth:58,minHeight:58,paddingHorizontal:8,borderRadius:14,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center'},nodeGood:{borderColor:'#2E756D',backgroundColor:'#0E3334'},nodeWarn:{borderColor:'#805F45',backgroundColor:'#241D18'},nodeText:{color:'#E7EEF2',fontSize:9,fontWeight:'900',textAlign:'center'},arrow:{color:'#55D0BF',fontSize:18,fontWeight:'900'},bars:{minHeight:160,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around',paddingHorizontal:18,paddingBottom:10},barSlot:{flex:1,alignItems:'center',justifyContent:'flex-end',gap:7},bar:{width:'58%',minHeight:12,borderTopLeftRadius:8,borderTopRightRadius:8,backgroundColor:'#6C8999'},barGood:{backgroundColor:'#55D0BF'},barWarn:{backgroundColor:'#B87C52'},compare:{minHeight:160,flexDirection:'row',gap:10},panel:{flex:1,borderRadius:15,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',padding:10,justifyContent:'space-between'},panelLabel:{color:'#A5B6C0',fontSize:8,fontWeight:'900',textAlign:'center'},miniBars:{flex:1,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around',paddingTop:10},miniBar:{width:16,minHeight:10,borderTopLeftRadius:5,borderTopRightRadius:5,backgroundColor:'#6C8999'},chart:{height:165,borderRadius:14,borderWidth:1,borderColor:'#28495C',backgroundColor:'#0A1C29',position:'relative',overflow:'hidden'},chartDot:{position:'absolute',width:12,height:12,borderRadius:6,backgroundColor:'#55D0BF'},chartWarn:{backgroundColor:'#B87C52'},midLine:{position:'absolute',left:'7%',right:'7%',top:'50%',height:3,backgroundColor:'#537B87'},gapZone:{position:'absolute',left:'48%',top:'28%',width:'17%',height:'44%',borderLeftWidth:1,borderRightWidth:1,borderColor:'#8B6749',backgroundColor:'rgba(139,103,73,0.08)'},track2:{position:'absolute',left:'7%',right:'7%',top:'48%',height:3,backgroundColor:'#5C7A8A'},track3:{position:'absolute',left:'7%',right:'7%',top:'58%',height:3,backgroundColor:'#9A704F'},network:{height:170,position:'relative',alignItems:'center',justifyContent:'center'},centerNode:{width:74,height:74,borderRadius:37,borderWidth:2,borderColor:'#2E756D',backgroundColor:'#0E3334',alignItems:'center',justifyContent:'center',zIndex:3},centerText:{color:'#5EEAD4',fontSize:10,fontWeight:'900'},netNode:{position:'absolute',width:62,height:48,borderRadius:14,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center',zIndex:2},top:{top:3},right:{right:2},bottom:{bottom:3},left:{left:2},netH:{position:'absolute',left:'19%',right:'19%',top:'50%',height:2,backgroundColor:'#35566A'},netV:{position:'absolute',top:'17%',bottom:'17%',left:'50%',width:2,backgroundColor:'#35566A'},levels:{minHeight:160,justifyContent:'space-around',paddingVertical:12},level:{height:36,borderRadius:12,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center'},levelMid:{borderColor:'#2E756D',backgroundColor:'#0E3334'},levelText:{color:'#A7B7C1',fontSize:9,fontWeight:'900'},matrix:{minHeight:176,flexDirection:'row',flexWrap:'wrap',gap:10,alignContent:'center',justifyContent:'space-between'},matrixNode:{width:'47%',minWidth:0,minHeight:74},labor:{minHeight:220,justifyContent:'center',gap:12},laborForce:{alignSelf:'center',paddingHorizontal:14,paddingVertical:7,borderRadius:999,borderWidth:1,borderColor:'#2E756D',backgroundColor:'#0E3334'},laborForceText:{color:'#5EEAD4',fontSize:10,fontWeight:'900',letterSpacing:1},laborJoin:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},laborOutside:{alignItems:'center',paddingTop:12,borderTopWidth:1,borderTopColor:'#24465C'},laborOutsideText:{color:'#A5B6C0',fontSize:9,fontWeight:'900',letterSpacing:.65},clockWrap:{height:170,alignItems:'center',justifyContent:'center',position:'relative'},clock:{width:125,height:125,borderRadius:63,borderWidth:10,borderColor:'#3A5C6F',alignItems:'center',justifyContent:'center'},hand:{position:'absolute',width:4,height:44,borderRadius:2,backgroundColor:'#55D0BF',top:22,transform:[{rotate:'28deg'}]},clockCore:{width:15,height:15,borderRadius:8,backgroundColor:'#55D0BF'},event:{position:'absolute',right:'15%',top:'22%',width:34,height:34,borderRadius:17,backgroundColor:'#55D0BF'},eventWarn:{backgroundColor:'#B87C52'},rings:{minHeight:170,alignItems:'center',justifyContent:'center'},ringOuter:{width:180,height:150,borderRadius:75,borderWidth:2,borderColor:'#775A43',alignItems:'center',justifyContent:'center'},ringMid:{width:130,height:104,borderRadius:52,borderWidth:2,borderColor:'#557485',alignItems:'center',justifyContent:'center'},ringInner:{width:76,height:62,borderRadius:31,borderWidth:2,borderColor:'#2E756D',backgroundColor:'#0E3334',alignItems:'center',justifyContent:'center'},ringText:{color:'#8FA4B1',fontSize:7,fontWeight:'900'},ringCore:{color:'#5EEAD4',fontSize:8,fontWeight:'900'}});