import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type NonHookRole = Exclude<LessonSupportingVisualRole, 'hook'>;
type ChartPattern = 'up'|'range'|'breakout'|'falseBreakout'|'pullback'|'gap'|'mean'|'sweep'|'revisit'|'cycle'|'track3';
type Scene =
  | { kind:'flow'; labels:string[]; warnIndex?:number }
  | { kind:'bars'; values:number[]; labels?:string[]; warnIndex?:number }
  | { kind:'compare'; left:number[]; right:number[]; labels?:[string,string] }
  | { kind:'chart'; pattern:ChartPattern }
  | { kind:'split'; left:string; right:string; blocked?:boolean }
  | { kind:'levels'; labels:string[] }
  | { kind:'timeline'; count:number; hot?:number[] }
  | { kind:'matrix'; labels:string[] }
  | { kind:'network'; center:string; nodes:string[] }
  | { kind:'rings'; labels:string[] }
  | { kind:'choices'; labels:string[]; goodIndex?:number }
  | { kind:'layers'; labels:string[] }
  | { kind:'check'; labels:string[] }
  | { kind:'candles'; zone?:'gap'|'block' }
  | { kind:'clock' }
  | { kind:'chain' };

export interface AcademyAdvancedCleanVisualProps {
  assetRef:string;
  alt:string;
  language:LearningLanguage;
  role:NonHookRole;
  theme?:LearningTheme;
}

const t=(tr:boolean,a:string,b:string)=>tr?a:b;

function sceneFor(assetRef:string,tr:boolean,role:NonHookRole):Scene|undefined{
  const warn=role==='risk'||role==='misconception';
  // Economy
  if(assetRef.includes('enflasyon-satin-alma-gucu')) return {kind:'compare',left:[82,72,66,55,48],right:[82,62,38],labels:[t(tr,'ÖNCE','BEFORE'),t(tr,'SONRA','AFTER')]};
  if(assetRef.includes('faiz-orani-ne-anlatir')) return {kind:'compare',left:[34,34],right:[34,34,34,34],labels:[t(tr,'DÜŞÜK','LOW'),t(tr,'YÜKSEK','HIGH')]};
  if(assetRef.includes('merkez-bankasi-ne-yapar')) return {kind:'network',center:'CB',nodes:[t(tr,'FAİZ','RATE'),t(tr,'KREDİ','CREDIT'),t(tr,'TALEP','DEMAND'),t(tr,'FİYAT','PRICE')]};
  if(assetRef.includes('faiz-karari-ekonomiye-nasil-yansir')) return {kind:'flow',labels:[t(tr,'FAİZ','RATE'),t(tr,'KREDİ','CREDIT'),t(tr,'HARCAMA','SPEND'),t(tr,'YATIRIM','INVEST')]};
  if(assetRef.includes('gsyh-buyume-ne-anlatir')) return {kind:'bars',values:[42,61,83,110],labels:['Q1','Q2','Q3','Q4'],warnIndex:warn?3:undefined};
  if(assetRef.includes('ekonomik-dongu-resesyon')) return {kind:'chart',pattern:'cycle'};

  // Quant
  if(assetRef.includes('olaslikla-dusunmek')) return {kind:'bars',values:[34,78,51,21],labels:['A','B','C','D'],warnIndex:warn?3:undefined};
  if(assetRef.includes('expectancy-nedir')) return {kind:'compare',left:[76,52],right:[44,72],labels:[t(tr,'KAZANÇ','WIN'),t(tr,'KAYIP','LOSS')]};
  if(assetRef.includes('win-rate-payoff-dengesi')) return {kind:'compare',left:[88,24],right:[42,78],labels:['80%','40%']};
  if(assetRef.includes('backtest-ne-soyler')) return {kind:'flow',labels:[t(tr,'VERİ','DATA'),t(tr,'KURAL','RULE'),t(tr,'SİM','SIM'),t(tr,'RAPOR','REPORT')]};
  if(assetRef.includes('orneklem-ve-out-of-sample')) return {kind:'split',left:t(tr,'ARAŞTIR','RESEARCH'),right:'OOS',blocked:true};
  if(assetRef.includes('backtestte-islem-maliyetleri')) return {kind:'bars',values:[100,72,52],labels:[t(tr,'BRÜT','GROSS'),'FEE',t(tr,'NET','NET')],warnIndex:1};
  if(assetRef.includes('overfitting-nedir')) return {kind:'compare',left:[28,39,48,57,65],right:[22,76,30,82,24],labels:[t(tr,'SİNYAL','SIGNAL'),'OVERFIT']};
  if(assetRef.includes('look-ahead-bias-nedir')) return {kind:'split',left:t(tr,'KARAR','DECISION'),right:t(tr,'GELECEK','FUTURE'),blocked:true};
  if(assetRef.includes('survivorship-bias-nedir')) return {kind:'timeline',count:9,hot:[1,5,7]};
  if(assetRef.includes('data-leakage-nedir')) return {kind:'split',left:'TRAIN',right:'TEST',blocked:true};
  if(assetRef.includes('robustness-nasil-test-edilir')) return {kind:'compare',left:[14,18,92,17,13],right:[54,61,65,60,53],labels:[t(tr,'KIRILGAN','FRAGILE'),'ROBUST']};
  if(assetRef.includes('otomasyonun-sinirlari')) return {kind:'flow',labels:[t(tr,'VERİ','DATA'),t(tr,'MODEL','MODEL'),t(tr,'EMİR','EXEC'),t(tr,'KONTROL','CONTROL')],warnIndex:warn?2:undefined};

  // SMC / ICT
  if(assetRef.includes('smc-ict-dili-neden-metodolojiye-bagli')) return {kind:'flow',labels:[t(tr,'GÖZLEM','OBS'),'A','B']};
  if(assetRef.includes('liquidity-sweep-nedir')) return {kind:'chart',pattern:'sweep'};
  if(assetRef.includes('liquidity-grab-ve-sweep-farki')) return {kind:'compare',left:[34,82,46],right:[34,72,58,44],labels:['GRAB','SWEEP']};
  if(assetRef.includes('inducement-ne-anlatir')) return {kind:'chart',pattern:'pullback'};
  if(assetRef.includes('displacement-nasil-okunur')) return {kind:'compare',left:[30,38,34,42],right:[24,48,78,112],labels:[t(tr,'NORMAL','NORMAL'),'DISP.']};
  if(assetRef.includes('fvg-smc-baglaminda-nasil-okunur')) return {kind:'candles',zone:'gap'};
  if(assetRef.includes('order-block-smc-baglaminda-nasil-tanimlanir')) return {kind:'candles',zone:'block'};
  if(assetRef.includes('mitigation-ne-anlatir')) return {kind:'chart',pattern:'revisit'};
  if(assetRef.includes('dealing-range-ve-equilibrium')) return {kind:'levels',labels:['HIGH','EQ','LOW']};
  if(assetRef.includes('premium-discount-ne-anlatir')) return {kind:'levels',labels:['PREMIUM','EQ','DISCOUNT']};
  if(assetRef.includes('mss-choch-ile-ayni-mi')) return {kind:'split',left:'CHoCH',right:'MSS'};
  if(assetRef.includes('smc-confluence-nasil-kullanilmali')) return {kind:'network',center:t(tr,'FİYAT','PRICE'),nodes:['SWEEP','FVG','OB','MSS']};

  // Strategy
  if(assetRef.includes('strateji-amaci-ve-zaman-ufku')) return {kind:'choices',labels:[t(tr,'KISA','SHORT'),t(tr,'ORTA','MID'),t(tr,'UZUN','LONG')],goodIndex:1};
  if(assetRef.includes('trend-following-nasil-dusunur')) return {kind:'chart',pattern:'up'};
  if(assetRef.includes('mean-reversion-ne-varsayar')) return {kind:'chart',pattern:'mean'};
  if(assetRef.includes('breakout-stratejisi-ne-yapar')) return {kind:'flow',labels:[t(tr,'KIR','BREAK'),t(tr,'TEYİT','CONFIRM'),t(tr,'GİRİŞ','ENTRY'),'INVALID'],warnIndex:warn?3:undefined};
  if(assetRef.includes('momentum-stratejisi-ne-yapar')) return {kind:'bars',values:[92,67,38],labels:['A','B','C']};
  if(assetRef.includes('swing-ve-position-farki')) return {kind:'split',left:'SWING',right:'POSITION'};
  if(assetRef.includes('strateji-hipotezi-nedir')) return {kind:'flow',labels:[t(tr,'TEZ','THESIS'),t(tr,'KANIT','EVIDENCE'),t(tr,'TEST','TEST')],warnIndex:warn?0:undefined};
  if(assetRef.includes('giris-cikis-invalidation-kurallari')) return {kind:'flow',labels:[t(tr,'GİRİŞ','ENTRY'),t(tr,'RİSK','RISK'),'INVALID',t(tr,'ÇIKIŞ','EXIT')],warnIndex:2};
  if(assetRef.includes('strateji-rejime-uyar-mi')) return {kind:'compare',left:[24,44,66,88],right:[48,66,45,63],labels:['TREND','RANGE']};
  if(assetRef.includes('turnover-ve-maliyet')) return {kind:'bars',values:[100,67,44],labels:[t(tr,'BRÜT','GROSS'),t(tr,'MALİYET','COST'),t(tr,'NET','NET')],warnIndex:1};
  if(assetRef.includes('strateji-cesitlendirmesi')) return {kind:'network',center:t(tr,'RİSK','RISK'),nodes:['TREND','MEAN','MOM.','ALT']};
  if(assetRef.includes('stratejiyi-ne-zaman-review-etmeli')) return {kind:'matrix',labels:[t(tr,'SONUÇ','OUTCOME'),t(tr,'SÜREÇ','PROCESS'),t(tr,'REJİM','REGIME'),t(tr,'KURAL','RULE')]};

  // Psychology
  if(assetRef.includes('kayip-korkusu-karari-nasil-bozar')) return {kind:'compare',left:[52],right:[94],labels:[t(tr,'KAZANÇ','GAIN'),t(tr,'KAYIP','LOSS')]};
  if(assetRef.includes('ilk-fiyata-capalanmak')) return {kind:'flow',labels:[t(tr,'ESKİ','OLD'),'100',t(tr,'YENİ KANIT','NEW DATA'),'80'],warnIndex:warn?0:undefined};
  if(assetRef.includes('son-olay-her-sey-midir')) return {kind:'timeline',count:9,hot:[6,7,8]};
  if(assetRef.includes('asiri-guven-nasil-fark-edilir')) return {kind:'bars',values:[94,56,60],labels:[t(tr,'GÜVEN','CONF.'),t(tr,'KANIT','EVID.'),t(tr,'LİMİT','LIMIT')],warnIndex:0};
  if(assetRef.includes('revenge-trading-nedir')) return {kind:'flow',labels:[t(tr,'KAYIP','LOSS'),t(tr,'DÜRTÜ','IMPULSE'),t(tr,'ARA','PAUSE'),t(tr,'KARAR','DECIDE')],warnIndex:warn?1:undefined};
  if(assetRef.includes('iyi-sonuc-iyi-karar-midir')) return {kind:'matrix',labels:[t(tr,'İYİ SÜREÇ','GOOD PROC.'),t(tr,'KÖTÜ SONUÇ','BAD OUT.'),t(tr,'KÖTÜ SÜREÇ','BAD PROC.'),t(tr,'İYİ SONUÇ','GOOD OUT.')]};
  if(assetRef.includes('kazanan-erken-kaybeden-gec')) return {kind:'compare',left:[44,62],right:[92,84],labels:[t(tr,'KAZANAN','WINNER'),t(tr,'KAYBEDEN','LOSER')]};
  if(assetRef.includes('kalabalik-hakli-midir')) return {kind:'network',center:t(tr,'KARAR','DECIDE'),nodes:[t(tr,'KALABALIK','CROWD'),t(tr,'KANIT','EVID.'),t(tr,'RİSK','RISK'),t(tr,'PLAN','PLAN')]};
  if(assetRef.includes('batik-maliyet-karari')) return {kind:'split',left:t(tr,'GEÇMİŞ','PAST'),right:t(tr,'BUGÜN','TODAY'),blocked:true};
  if(assetRef.includes('akla-gelen-en-onemli-mi')) return {kind:'timeline',count:12,hot:[10]};
  if(assetRef.includes('bir-sey-yapmak-zorunda-misin')) return {kind:'choices',labels:[t(tr,'İŞLEM','TRADE'),t(tr,'BEKLE','WAIT'),t(tr,'VERİ','DATA')],goodIndex:1};
  if(assetRef.includes('karari-onceden-kurmak')) return {kind:'check',labels:[t(tr,'RİSK','RISK'),t(tr,'ARA','PAUSE'),'INVALID']};

  // Asset school
  if(assetRef.includes('ayni-grafik-farkli-piyasa')) return {kind:'network',center:t(tr,'GRAFİK','CHART'),nodes:['EQ','ETF','FX','CMD']};
  if(assetRef.includes('hisselerde-corporate-actions')) return {kind:'flow',labels:['1×',t(tr,'SPLIT','SPLIT'),'2×']};
  if(assetRef.includes('hisselerde-earnings-gap-riski')) return {kind:'chart',pattern:'gap'};
  if(assetRef.includes('etf-nav-ve-tracking-farki')) return {kind:'chart',pattern:'track3'};
  if(assetRef.includes('kaldiracli-ve-ters-etf-gunluk-reset')) return {kind:'compare',left:[44,82,52],right:[32,112,46],labels:['INDEX','2× DAILY']};
  if(assetRef.includes('fx-carry-ve-rollover')) return {kind:'flow',labels:['FX',t(tr,'CARRY','CARRY'),t(tr,'MALİYET','COST')]};
  if(assetRef.includes('fx-seans-ve-makro-olay-riski')) return {kind:'clock'};
  if(assetRef.includes('emtiada-spot-ve-vadeli-fiyat')) return {kind:'levels',labels:['SPOT','1M','3M','6M']};
  if(assetRef.includes('contango-backwardation-ve-roll')) return {kind:'compare',left:[28,44,60,82],right:[82,64,45,28],labels:['CONTANGO','BACKWARD.']};
  if(assetRef.includes('kripto-perpetual-ve-funding')) return {kind:'split',left:'SPOT',right:'PERP'};
  if(assetRef.includes('kripto-venue-custody-ve-karsi-taraf-riski')) return {kind:'rings',labels:['ASSET','CUSTODY','VENUE']};
  if(assetRef.includes('onchain-veri-ne-soyler-ne-soylemez')) return {kind:'chain'};
  return undefined;
}

export function isAcademyAdvancedCleanAsset(assetRef:string):boolean{
  return Boolean(sceneFor(assetRef,true,'concept'));
}

export function AcademyAdvancedCleanVisual({assetRef,alt,language,role,theme=defaultLearningTheme}:AcademyAdvancedCleanVisualProps){
  const scene=sceneFor(assetRef,language==='tr',role); if(!scene)return null;
  const s=createStyles(theme); const warn=role==='risk'||role==='misconception';
  return <View style={[s.shell,role==='summary'&&s.shellSummary]} accessibilityRole="image" accessibilityLabel={alt}>{renderScene(scene,s,warn)}</View>;
}

type S=ReturnType<typeof createStyles>;
function renderScene(scene:Scene,s:S,warn:boolean):React.ReactNode{
  switch(scene.kind){
    case'flow':return <View style={s.flow}>{scene.labels.map((x,i)=><React.Fragment key={`${x}-${i}`}><Node s={s} label={x} good={i===scene.labels.length-1&&!warn} warn={scene.warnIndex===i}/>{i<scene.labels.length-1?<Text style={s.arrow}>→</Text>:null}</React.Fragment>)}</View>;
    case'bars':return <View style={s.bars}>{scene.values.map((v,i)=><View key={i} style={s.barSlot}><View style={[s.bar,{height:v},i===scene.warnIndex?s.barWarn:i===scene.values.length-1?s.barGood:null]}/>{scene.labels?<Text style={s.micro}>{scene.labels[i]}</Text>:null}</View>)}</View>;
    case'compare':return <View style={s.compare}><MiniBars s={s} values={scene.left} label={scene.labels?.[0]}/><MiniBars s={s} values={scene.right} label={scene.labels?.[1]} warn={warn}/></View>;
    case'chart':return <Chart s={s} pattern={scene.pattern} warn={warn}/>;
    case'split':return <View style={s.split}><Node s={s} label={scene.left}/><View style={[s.bridge,scene.blocked&&s.bridgeBlocked]}>{scene.blocked?<Text style={s.block}>×</Text>:<Text style={s.arrow}>⇄</Text>}</View><Node s={s} label={scene.right} good={!scene.blocked} warn={scene.blocked&&warn}/></View>;
    case'levels':return <View style={s.levels}>{scene.labels.map((x,i)=><View key={x} style={[s.level,i===Math.floor(scene.labels.length/2)&&s.levelMid]}><Text style={s.levelText}>{x}</Text></View>)}</View>;
    case'timeline':return <View style={s.timeline}>{Array.from({length:scene.count}).map((_,i)=><View key={i} style={[s.dot,scene.hot?.includes(i)&&s.dotHot]}/>)}</View>;
    case'matrix':return <View style={s.matrix}>{scene.labels.slice(0,4).map((x,i)=><Node key={`${x}-${i}`} s={s} label={x} good={i===0&&!warn} warn={warn&&i===2}/>)}</View>;
    case'network':return <View style={s.network}><View style={s.centerNode}><Text style={s.centerText}>{scene.center}</Text></View>{scene.nodes.slice(0,4).map((x,i)=><View key={`${x}-${i}`} style={[s.netNode,i===0?s.netTop:i===1?s.netRight:i===2?s.netBottom:s.netLeft]}><Text style={s.micro}>{x}</Text></View>)}<View style={s.netH}/><View style={s.netV}/></View>;
    case'rings':return <View style={s.rings}><View style={s.ringOuter}><Text style={s.ringLabel}>{scene.labels[2]}</Text><View style={s.ringMid}><Text style={s.ringLabel}>{scene.labels[1]}</Text><View style={s.ringInner}><Text style={s.ringCore}>{scene.labels[0]}</Text></View></View></View></View>;
    case'choices':return <View style={s.flow}>{scene.labels.map((x,i)=><Node key={x} s={s} label={x} good={scene.goodIndex===i}/>)}</View>;
    case'layers':return <View style={s.layers}>{scene.labels.map((x,i)=><View key={x} style={[s.layer,i===scene.labels.length-1&&s.layerGood]}><Text style={s.micro}>{x}</Text></View>)}</View>;
    case'check':return <View style={s.checks}>{scene.labels.map(x=><View key={x} style={s.check}><Text style={s.checkMark}>✓</Text><Text style={s.checkText}>{x}</Text></View>)}</View>;
    case'candles':return <Candles s={s} zone={scene.zone} warn={warn}/>;
    case'clock':return <Clock s={s} warn={warn}/>;
    case'chain':return <Chain s={s} warn={warn}/>;
  }
}
function Node({s,label,good,warn}:{s:S;label:string;good?:boolean;warn?:boolean}){return <View style={[s.node,good&&s.nodeGood,warn&&s.nodeWarn]}><Text style={[s.nodeText,good&&s.good,warn&&s.warn]}>{label}</Text></View>}
function MiniBars({s,values,label,warn}:{s:S;values:number[];label?:string;warn?:boolean}){return <View style={s.miniPanel}>{label?<Text style={s.panelLabel}>{label}</Text>:null}<View style={s.miniBars}>{values.map((h,i)=><View key={i} style={[s.miniBar,{height:h},i===values.length-1&&!warn&&s.barGood,warn&&i===values.length-1&&s.barWarn]}/>)}</View></View>}
function Chart({s,pattern,warn}:{s:S;pattern:ChartPattern;warn:boolean}){
 const pts:Record<ChartPattern,number[]>={up:[74,62,52,44,32,24],range:[62,38,60,40,58,42],breakout:[72,62,60,56,34,24],falseBreakout:[72,62,58,28,48,64],pullback:[74,58,42,54,38,26],gap:[70,62,58,32,72,66],mean:[22,56,74,52,30,48],sweep:[68,55,50,24,18,58],revisit:[28,22,18,34,56,46],cycle:[68,38,26,52,72,44],track3:[68,58,49,54,42,36]};
 const ys=pts[pattern];
 return <View style={s.chart}>{(pattern==='breakout'||pattern==='falseBreakout'||pattern==='sweep')?<View style={s.chartLevel}/>:null}{pattern==='mean'?<View style={s.meanLine}/>:null}{pattern==='gap'?<View style={s.gapZone}/>:null}{pattern==='track3'?<><View style={s.trackTwo}/><View style={s.trackThree}/></>:null}{ys.map((y,i)=><View key={i} style={[s.chartDot,{left:`${8+i*17}%`,top:`${y}%`},warn&&i===ys.length-1&&s.chartDotWarn]}/>)}</View>;
}
function Candles({s,zone,warn}:{s:S;zone?:'gap'|'block';warn:boolean}){return <View style={s.chart}>{zone?<View style={[s.zone,zone==='block'&&s.zoneBlock]}/>:null>{[0,1,2,3].map((i)=><View key={i} style={[s.candle,{left:`${14+i*21}%`,height:50+i*14,bottom:24+i*14},i>1&&s.candleGood,warn&&i===3&&s.candleWarn]}/>)}</View>}
function Clock({s,warn}:{s:S;warn:boolean}){return <View style={s.clockWrap}><View style={s.clock}><View style={s.clockHand}/><View style={s.clockCore}/></View><View style={[s.eventPulse,warn&&s.eventPulseWarn]}/></View>}
function Chain({s,warn}:{s:S;warn:boolean}){return <View style={s.chainWrap}><View style={s.chain}>{[0,1,2,3].map((i)=><React.Fragment key={i}><View style={[s.chainNode,i===2&&s.chainNodeGood]}/>{i<3?<View style={s.chainLink}/>:null}</React.Fragment>)}</View><View style={s.barrier}/><View style={[s.cloud,warn&&s.cloudWarn]}><View style={s.cloudDot}/><View style={[s.cloudDot,s.cloudDot2]}/><View style={[s.cloudDot,s.cloudDot3]}/></View></View>}

const createStyles=(theme:LearningTheme)=>StyleSheet.create({
 shell:{width:'100%',minHeight:210,borderRadius:18,borderWidth:1,borderColor:'#24465C',backgroundColor:'#081725',padding:14,justifyContent:'center',overflow:'hidden'},shellSummary:{minHeight:180},good:{color:'#5EEAD4'},warn:{color:'#D09263'},micro:{color:'#A5B6C0',fontSize:8,fontWeight:'900',textAlign:'center'},
 flow:{minHeight:150,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,flexWrap:'wrap'},node:{minWidth:60,minHeight:58,paddingHorizontal:8,borderRadius:14,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center'},nodeGood:{borderColor:'#2E756D',backgroundColor:'#0E3334'},nodeWarn:{borderColor:'#805F45',backgroundColor:'#241D18'},nodeText:{color:'#E7EEF2',fontSize:9,fontWeight:'900',textAlign:'center'},arrow:{color:'#55D0BF',fontSize:18,fontWeight:'900'},
 bars:{minHeight:160,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around',paddingHorizontal:18,paddingBottom:10},barSlot:{flex:1,alignItems:'center',justifyContent:'flex-end',gap:7},bar:{width:'58%',minHeight:18,borderTopLeftRadius:8,borderTopRightRadius:8,backgroundColor:'#6C8999'},barGood:{backgroundColor:'#55D0BF'},barWarn:{backgroundColor:'#B87C52'},
 compare:{minHeight:160,flexDirection:'row',gap:10,alignItems:'stretch'},miniPanel:{flex:1,borderRadius:15,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',padding:10,justifyContent:'space-between'},panelLabel:{color:'#A5B6C0',fontSize:8,fontWeight:'900',textAlign:'center'},miniBars:{flex:1,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around',paddingTop:10},miniBar:{width:16,minHeight:12,borderTopLeftRadius:5,borderTopRightRadius:5,backgroundColor:'#6C8999'},
 chart:{height:165,borderRadius:14,borderWidth:1,borderColor:'#28495C',backgroundColor:'#0A1C29',position:'relative',overflow:'hidden'},chartDot:{position:'absolute',width:11,height:11,borderRadius:6,backgroundColor:'#55D0BF'},chartDotWarn:{backgroundColor:'#B87C52'},chartLevel:{position:'absolute',left:'7%',right:'7%',top:'45%',height:2,backgroundColor:'#805F45'},meanLine:{position:'absolute',left:'7%',right:'7%',top:'50%',height:3,backgroundColor:'#537B87'},gapZone:{position:'absolute',left:'48%',top:'30%',width:'17%',height:'42%',borderLeftWidth:1,borderRightWidth:1,borderColor:'#8B6749',backgroundColor:'rgba(139,103,73,0.08)'},trackTwo:{position:'absolute',left:'7%',right:'7%',top:'48%',height:3,backgroundColor:'#5C7A8A'},trackThree:{position:'absolute',left:'7%',right:'7%',top:'58%',height:3,backgroundColor:'#9A704F'},
 split:{minHeight:150,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12},bridge:{minWidth:44,alignItems:'center',justifyContent:'center'},bridgeBlocked:{borderRadius:22,borderWidth:1,borderColor:'#805F45',height:44},block:{color:'#C78B5D',fontSize:19,fontWeight:'900'},
 levels:{minHeight:160,justifyContent:'space-around',paddingVertical:12},level:{height:36,borderRadius:12,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center'},levelMid:{borderColor:'#2E756D',backgroundColor:'#0E3334'},levelText:{color:'#A7B7C1',fontSize:9,fontWeight:'900'},
 timeline:{minHeight:150,flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:18},dot:{width:17,height:17,borderRadius:9,backgroundColor:'#607E8F'},dotHot:{backgroundColor:'#B87C52',transform:[{scale:1.25}]},
 matrix:{minHeight:160,flexDirection:'row',flexWrap:'wrap',gap:8,alignContent:'center',justifyContent:'center'},network:{height:170,position:'relative',alignItems:'center',justifyContent:'center'},centerNode:{width:74,height:74,borderRadius:37,borderWidth:2,borderColor:'#2E756D',backgroundColor:'#0E3334',alignItems:'center',justifyContent:'center',zIndex:3},centerText:{color:'#5EEAD4',fontSize:10,fontWeight:'900'},netNode:{position:'absolute',width:62,height:48,borderRadius:14,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center',zIndex:2},netTop:{top:3},netRight:{right:2},netBottom:{bottom:3},netLeft:{left:2},netH:{position:'absolute',left:'19%',right:'19%',top:'50%',height:2,backgroundColor:'#35566A'},netV:{position:'absolute',top:'17%',bottom:'17%',left:'50%',width:2,backgroundColor:'#35566A'},
 rings:{minHeight:170,alignItems:'center',justifyContent:'center'},ringOuter:{width:180,height:150,borderRadius:75,borderWidth:2,borderColor:'#775A43',backgroundColor:'rgba(119,90,67,0.08)',alignItems:'center',justifyContent:'center'},ringMid:{width:132,height:106,borderRadius:53,borderWidth:2,borderColor:'#557485',backgroundColor:'#102638',alignItems:'center',justifyContent:'center'},ringInner:{width:78,height:64,borderRadius:32,borderWidth:2,borderColor:'#2E756D',backgroundColor:'#0E3334',alignItems:'center',justifyContent:'center'},ringLabel:{color:'#8FA4B1',fontSize:7,fontWeight:'900'},ringCore:{color:'#5EEAD4',fontSize:8,fontWeight:'900'},
 layers:{minHeight:160,justifyContent:'center',gap:7},layer:{height:34,borderRadius:11,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center'},layerGood:{borderColor:'#2E756D',backgroundColor:'#0E3334'},checks:{minHeight:150,justifyContent:'center',gap:10,paddingHorizontal:20},check:{height:38,borderRadius:12,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12},checkMark:{color:'#55D0BF',fontSize:14,fontWeight:'900'},checkText:{color:'#A7B7C1',fontSize:9,fontWeight:'900'},
 zone:{position:'absolute',left:'41%',top:'35%',width:'22%',height:'30%',borderRadius:9,borderWidth:1,borderColor:'#8A6548',backgroundColor:'rgba(138,101,72,0.12)'},zoneBlock:{left:'14%',top:'52%',width:'26%',height:'23%',borderColor:'#527789'},candle:{position:'absolute',width:17,borderRadius:5,backgroundColor:'#718D9D'},candleGood:{backgroundColor:'#55D0BF'},candleWarn:{backgroundColor:'#B87C52'},
 clockWrap:{height:170,alignItems:'center',justifyContent:'center',position:'relative'},clock:{width:125,height:125,borderRadius:63,borderWidth:10,borderColor:'#3A5C6F',alignItems:'center',justifyContent:'center'},clockCore:{width:15,height:15,borderRadius:8,backgroundColor:'#55D0BF'},clockHand:{position:'absolute',width:4,height:44,borderRadius:2,backgroundColor:'#55D0BF',top:22,transform:[{rotate:'28deg'}]},eventPulse:{position:'absolute',right:'9%',top:'27%',width:55,height:55,borderRadius:28,borderWidth:2,borderColor:'#8B6749'},eventPulseWarn:{backgroundColor:'rgba(184,124,82,0.12)'},
 chainWrap:{height:170,position:'relative',justifyContent:'center'},chain:{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',paddingLeft:12},chainNode:{width:30,height:30,borderRadius:15,borderWidth:2,borderColor:'#607E8F',backgroundColor:'#102638'},chainNodeGood:{borderColor:'#2E756D',backgroundColor:'#0E3334'},chainLink:{width:18,height:4,borderRadius:2,backgroundColor:'#5D7B8C'},barrier:{position:'absolute',left:'61%',top:'26%',bottom:'26%',width:3,backgroundColor:'#8B6749'},cloud:{position:'absolute',right:'5%',top:'35%',width:82,height:70},cloudWarn:{opacity:.85},cloudDot:{position:'absolute',left:0,top:18,width:45,height:45,borderRadius:23,backgroundColor:'#5F493A'},cloudDot2:{left:20,top:2},cloudDot3:{left:38,top:20},
});
