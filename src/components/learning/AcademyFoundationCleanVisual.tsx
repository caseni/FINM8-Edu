import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic =
  | 'exchange' | 'index' | 'etf' | 'bond' | 'forex' | 'commodity'
  | 'statements' | 'income' | 'balance' | 'cashFlow' | 'profitability' | 'debt'
  | 'correlation' | 'drawdown' | 'leverage' | 'concentration' | 'riskBudget' | 'construction'
  | 'breakout' | 'falseBreakout' | 'pullback' | 'range' | 'momentum' | 'movingAverage';

export interface AcademyFoundationCleanVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: Exclude<LessonSupportingVisualRole, 'hook'>;
  theme?: LearningTheme;
}

function topicFor(assetRef: string): Topic | undefined {
  if (assetRef.includes('borsa-ve-islem-yeri-nedir')) return 'exchange';
  if (assetRef.includes('borsa-endeksi-ne-anlatir')) return 'index';
  if (assetRef.includes('etf-nedir-nasil-calisir')) return 'etf';
  if (assetRef.includes('tahvil-fiyati-ve-getirisi')) return 'bond';
  if (assetRef.includes('forex-piyasasi-nasil-calisir')) return 'forex';
  if (assetRef.includes('emtia-piyasalari-nasil-calisir')) return 'commodity';
  if (assetRef.includes('finansal-tablolar-birlikte-ne-anlatir')) return 'statements';
  if (assetRef.includes('gelir-tablosu-nasil-okunur')) return 'income';
  if (assetRef.includes('bilanco-ne-anlatir')) return 'balance';
  if (assetRef.includes('nakit-akisi-neden-farklidir')) return 'cashFlow';
  if (assetRef.includes('marjlar-ne-anlatir')) return 'profitability';
  if (assetRef.includes('borc-ve-likidite-nasil-okunur')) return 'debt';
  if (assetRef.includes('korelasyon-ne-anlatir')) return 'correlation';
  if (assetRef.includes('drawdown-nedir')) return 'drawdown';
  if (assetRef.includes('kaldirac-riski-nasil-buyutur')) return 'leverage';
  if (assetRef.includes('yogunlasma-riski-nedir')) return 'concentration';
  if (assetRef.includes('risk-butcesi-nedir')) return 'riskBudget';
  if (assetRef.includes('portfoy-nasil-kurulur')) return 'construction';
  if (assetRef.includes('breakout-ne-zaman-anlamli')) return 'breakout';
  if (assetRef.includes('false-breakout-nasil-okunur')) return 'falseBreakout';
  if (assetRef.includes('pullback-trend-donusu-degildir')) return 'pullback';
  if (assetRef.includes('range-konsolidasyon-nasil-okunur')) return 'range';
  if (assetRef.includes('momentum-ne-anlatir')) return 'momentum';
  if (assetRef.includes('hareketli-ortalama-ne-yapar')) return 'movingAverage';
  return undefined;
}

export function isAcademyFoundationCleanAsset(assetRef: string): boolean {
  return Boolean(topicFor(assetRef));
}

export function AcademyFoundationCleanVisual({
  assetRef,
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: AcademyFoundationCleanVisualProps) {
  const topic = topicFor(assetRef);
  if (!topic) return null;
  const s = createStyles(theme);
  const tr = language === 'tr';
  const warn = role === 'misconception' || role === 'risk';
  const summary = role === 'summary';
  return (
    <View style={[s.shell, summary && s.shellSummary]} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={s.gridH1} /><View style={s.gridH2} /><View style={s.gridV1} /><View style={s.gridV2} />
      {topic === 'exchange' ? <Exchange s={s} tr={tr} warn={warn} /> : null}
      {topic === 'index' ? <IndexScene s={s} warn={warn} /> : null}
      {topic === 'etf' ? <Etf s={s} warn={warn} /> : null}
      {topic === 'bond' ? <Bond s={s} tr={tr} warn={warn} /> : null}
      {topic === 'forex' ? <Forex s={s} warn={warn} /> : null}
      {topic === 'commodity' ? <Commodity s={s} /> : null}
      {topic === 'statements' ? <Statements s={s} tr={tr} warn={warn} /> : null}
      {topic === 'income' ? <Income s={s} tr={tr} warn={warn} /> : null}
      {topic === 'balance' ? <Balance s={s} tr={tr} warn={warn} /> : null}
      {topic === 'cashFlow' ? <CashFlow s={s} warn={warn} /> : null}
      {topic === 'profitability' ? <Profitability s={s} warn={warn} /> : null}
      {topic === 'debt' ? <Debt s={s} tr={tr} warn={warn} /> : null}
      {topic === 'correlation' ? <Correlation s={s} warn={warn} /> : null}
      {topic === 'drawdown' ? <Drawdown s={s} warn={warn} /> : null}
      {topic === 'leverage' ? <Leverage s={s} warn={warn} /> : null}
      {topic === 'concentration' ? <Concentration s={s} warn={warn} /> : null}
      {topic === 'riskBudget' ? <RiskBudget s={s} warn={warn} /> : null}
      {topic === 'construction' ? <Construction s={s} /> : null}
      {topic === 'breakout' ? <Breakout s={s} warn={warn} /> : null}
      {topic === 'falseBreakout' ? <FalseBreakout s={s} warn={warn} /> : null}
      {topic === 'pullback' ? <Pullback s={s} warn={warn} /> : null}
      {topic === 'range' ? <Range s={s} warn={warn} /> : null}
      {topic === 'momentum' ? <Momentum s={s} warn={warn} /> : null}
      {topic === 'movingAverage' ? <MovingAverage s={s} warn={warn} /> : null}
    </View>
  );
}

type S = ReturnType<typeof createStyles>;

function Arrow({ s, warn = false, reverse = false }: { s: S; warn?: boolean; reverse?: boolean }) {
  return <Text style={[s.arrow, warn && s.warn]}>{reverse ? '←' : '→'}</Text>;
}
function Pill({ s, text, accent = false, warn = false }: { s: S; text: string; accent?: boolean; warn?: boolean }) {
  return <View style={[s.pill, accent && s.pillAccent, warn && s.pillWarn]}><Text style={[s.pillText, accent && s.good, warn && s.warn]}>{text}</Text></View>;
}
function Exchange({ s, tr, warn }: { s: S; tr: boolean; warn: boolean }) {
  return <View style={s.exchange}>
    <View style={s.exchangeOrder}><Text style={s.micro}>{tr ? 'ALICI' : 'BUYER'}</Text><Text style={s.orderType}>{tr ? 'ALIŞ EMRİ' : 'BUY ORDER'}</Text><View style={s.orderLines}><View style={s.orderLine} /><View style={[s.orderLine, s.orderLineShort]} /></View></View>
    <Arrow s={s} />
    <View style={[s.hub, warn && s.hubWarn]}><Text style={s.hubText}>{tr ? 'EŞLEŞİR' : 'MATCH'}</Text><View style={s.hubRule} /><View style={s.hubRule} /></View>
    <Arrow s={s} reverse />
    <View style={s.exchangeOrder}><Text style={s.micro}>{tr ? 'SATICI' : 'SELLER'}</Text><Text style={s.orderType}>{tr ? 'SATIŞ EMRİ' : 'SELL ORDER'}</Text><View style={s.orderLines}><View style={s.orderLine} /><View style={[s.orderLine, s.orderLineShort]} /></View></View>
  </View>;
}
function IndexScene({ s, warn }: { s: S; warn: boolean }) {
  const dirs = warn ? ['↑','↓','↑'] : ['↑','↑','↓'];
  return <View style={s.rowCenter}><View style={s.memberStack}>{dirs.map((d,i)=><View key={i} style={s.member}><Text style={s.memberName}>{String.fromCharCode(65+i)}</Text><Text style={[s.memberDir,d==='↓'&&s.warn]}>{d}</Text></View>)}</View><Arrow s={s}/><View style={s.indexOrb}><Text style={s.indexValue}>Σ</Text></View></View>;
}
function Etf({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.rowCenter}><View style={[s.etfCard,warn&&s.pillWarn]}><Text style={s.etfText}>ETF</Text></View><Arrow s={s}/><View style={s.basketGrid}>{[0,1,2,3].map(i=><View key={i} style={[s.assetTile,warn&&i===3&&s.assetTileWarn]}><View style={[s.assetGlyph,i===1&&s.assetGlyphAlt]} /></View>)}</View></View>;
}
function Bond({ s, tr, warn }: { s: S; tr: boolean; warn: boolean }) {
  return <View style={s.rowCenter}><Pill s={s} text={tr?'YATIRIMCI':'INVESTOR'} /><View style={s.flowColumn}><Arrow s={s}/><Text style={s.micro}>{tr?'BORÇ':'LOAN'}</Text><Arrow s={s} reverse warn={warn}/></View><View style={[s.document,warn&&s.documentWarn]}><View style={s.docSeal}/><View style={s.docLine}/><View style={s.docLineShort}/></View></View>;
}
function Forex({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.rowCenter}><View style={s.fxCard}><Text style={s.fxCode}>EUR</Text></View><Text style={[s.swap,warn&&s.warn]}>⇄</Text><View style={[s.fxCard,s.fxCardAccent]}><Text style={s.fxCode}>USD</Text></View></View>;
}
function Commodity({ s }: { s: S }) {
  return <View style={s.commodityRow}><View style={s.gold}><View style={s.goldInset}/></View><View style={s.barrel}><View style={s.barrelBand}/><View style={s.barrelBand}/></View><View style={s.wheat}><View style={s.wheatStem}/>{[13,30,47,64].map((top,i)=><View key={i} style={[s.grain,{top,left:i%2===0?8:31,transform:[{rotate:i%2===0?'-26deg':'26deg'}]}]}/>)}</View></View>;
}
function Statements({ s, tr, warn }: { s: S; tr: boolean; warn: boolean }) {
  const labels = tr ? ['KÂR','DENGE','NAKİT'] : ['PROFIT','BALANCE','CASH'];
  return <View style={s.threeCards}>{labels.map((x,i)=><View key={x} style={[s.statementCard,warn&&i===0&&s.statementWarn]}><Text style={s.micro}>{x}</Text><View style={[s.statementIcon,i===2&&s.statementIconGood]}/></View>)}</View>;
}
function Income({ s, tr, warn }: { s: S; tr: boolean; warn: boolean }) {
  const labels = tr ? ['SATIŞ','MALİYET','KÂR'] : ['SALES','COST','PROFIT'];
  const widths = ['100%','68%','36%'] as const;
  return <View style={s.waterfall}>{labels.map((x,i)=><View key={x} style={s.waterRow}><Text style={s.waterLabel}>{x}</Text><View style={[s.waterBar,{width:widths[i]},i===1&&warn&&s.waterWarn,i===2&&s.waterGood]}/></View>)}</View>;
}
function Balance({ s, tr, warn }: { s: S; tr: boolean; warn: boolean }) {
  return <View style={s.balance}><View style={s.balanceHalf}><Text style={s.micro}>{tr?'VARLIKLAR':'ASSETS'}</Text><View style={s.balanceMass}/></View><View style={[s.balanceHalf,warn&&s.balanceHalfWarn]}><Text style={s.micro}>{tr?'BORÇ + ÖZKAYNAK':'DEBT + EQUITY'}</Text><View style={s.balanceDebt}/><View style={s.balanceEquity}/></View></View>;
}
function CashFlow({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.cashScene}><View style={s.cashIn}>{[0,1,2].map(i=><View key={i} style={s.cashDot}/>)}</View><Arrow s={s}/><View style={[s.cashCore,warn&&s.cashCoreWarn]}><View style={s.cashCoreInner}/></View><Arrow s={s} warn={warn}/><View style={s.cashOut}>{[0,1].map(i=><View key={i} style={[s.cashDot,s.cashDotOut]}/>)}</View></View>;
}
function Profitability({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.marginScene}><View style={s.marginTrack}><View style={[s.marginSales,{width:'100%'}]}/></View><View style={s.marginTrack}><View style={[s.marginProfit,{width:warn?'18%':'34%'}]}/></View><View style={s.marginBracket}/></View>;
}
function Debt({ s, tr, warn }: { s: S; tr: boolean; warn: boolean }) {
  return <View style={s.debtScene}><View style={s.liquidityPool}><Text style={s.micro}>{tr?'NAKİT':'CASH'}</Text></View><View style={s.timeline}>{[0,1,2,3].map(i=><View key={i} style={[s.dueDot,warn&&i<2&&s.dueDotWarn]}/>)}</View><View style={[s.debtBlock,warn&&s.debtBlockWarn]}><Text style={s.micro}>{tr?'BORÇ':'DEBT'}</Text></View></View>;
}
function Correlation({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.pathPair}>{['A','B'].map((x,i)=><View key={x} style={s.pathRow}><Text style={s.pathLabel}>{x}</Text><View style={s.pathGlyph}><View style={[s.pathSeg,{transform:[{rotate:i===1&&warn?'18deg':'-12deg'}]}]}/><View style={[s.pathSeg,{left:'38%',transform:[{rotate:i===1&&warn?'-16deg':'14deg'}]}]}/><View style={[s.pathSeg,{left:'70%',transform:[{rotate:i===1&&warn?'12deg':'-10deg'}]}]}/></View></View>)}</View>;
}
function Drawdown({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.rowCenter}><Pill s={s} text="100" accent/><Text style={s.down}>↘</Text><Pill s={s} text={warn?'60':'70'} warn/><Text style={s.up}>↗</Text><Pill s={s} text="100" accent/></View>;
}
function Leverage({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.dual}><View style={s.multCard}><Text style={s.mult}>1×</Text><View style={[s.impactBar,{height:warn?42:58}]}/></View><View style={[s.multCard,s.multCardAccent]}><Text style={s.mult}>3×</Text><View style={[s.impactBar,s.impactBarAccent,{height:warn?112:96}]}/></View></View>;
}
function Concentration({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.concentration}>{<View style={s.holdings}>{['A','B','C','D','E','F'].map(x=><View key={x} style={s.holding}><Text style={s.holdingText}>{x}</Text></View>)}</View>}<Text style={s.down}>↓</Text>{warn?<View style={s.oneRisk}><View style={s.oneRiskCore}/></View>:<View style={s.factorRow}>{[0,1,2].map(i=><View key={i} style={s.factor}/>)}</View>}</View>;
}
function RiskBudget({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.budgetRows}><View style={s.budgetRow}><View style={[s.budgetBar,s.budgetGood,{width:'50%'}]}/><View style={[s.budgetBar,{width:'50%'}]}/></View><View style={s.budgetRow}><View style={[s.budgetBar,s.budgetWarn,{width:warn?'82%':'70%'}]}/><View style={[s.budgetBar,{width:warn?'18%':'30%'}]}/></View></View>;
}
function Construction({ s }: { s: S }) {
  return <View style={s.plan}>{[0,1,2,3].map((i)=><React.Fragment key={i}><View style={[s.planNode,i===0&&s.planNodeAccent]}><View style={s.planGlyph}/></View>{i<3?<Arrow s={s}/>:null}</React.Fragment>)}</View>;
}
function Seg({ s, left, top, width, rotate, tone='neutral' }: { s:S; left:`${number}%`; top:`${number}%`; width:`${number}%`; rotate:number; tone?:'neutral'|'good'|'warn' }) {
  return <View style={[s.seg,tone==='good'&&s.segGood,tone==='warn'&&s.segWarn,{left,top,width,transform:[{rotate:`${rotate}deg`}]}]}/>;
}
function Breakout({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.chart}><View style={s.resistance}/><Seg s={s} left="8%" top="68%" width="22%" rotate={-18}/><Seg s={s} left="27%" top="60%" width="20%" rotate={18}/><Seg s={s} left="44%" top="63%" width="23%" rotate={-34} tone="good"/><Seg s={s} left="64%" top="42%" width="24%" rotate={warn ? 18 : -12} tone={warn?'warn':'good'}/></View>;
}
function FalseBreakout({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.chart}><View style={s.resistance}/><Seg s={s} left="8%" top="68%" width="22%" rotate={-20}/><Seg s={s} left="27%" top="60%" width="20%" rotate={18}/><Seg s={s} left="44%" top="62%" width="20%" rotate={-36} tone="good"/><Seg s={s} left="61%" top="39%" width="17%" rotate={38} tone="warn"/><Seg s={s} left="75%" top="54%" width="15%" rotate={18} tone={warn?'warn':'neutral'}/></View>;
}
function Pullback({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.chart}><View style={s.support}/><Seg s={s} left="8%" top="72%" width="20%" rotate={-25}/><Seg s={s} left="25%" top="58%" width="22%" rotate={-27} tone="good"/><Seg s={s} left="44%" top="45%" width="18%" rotate={warn?42:28} tone={warn?'warn':'neutral'}/><Seg s={s} left="59%" top="52%" width="25%" rotate={-25} tone="good"/></View>;
}
function Range({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.chart}><View style={s.rangeTop}/><View style={s.rangeBottom}/><Seg s={s} left="8%" top="66%" width="18%" rotate={-31}/><Seg s={s} left="23%" top="49%" width="18%" rotate={28}/><Seg s={s} left="38%" top="60%" width="18%" rotate={-29}/><Seg s={s} left="53%" top="45%" width="18%" rotate={27}/><Seg s={s} left="68%" top="56%" width="18%" rotate={warn?0:-27} tone={warn?'warn':'good'}/></View>;
}
function Momentum({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.momentum}>{[34,54,76,98,116].map((h,i)=><View key={i} style={[s.momentumBar,{height:warn&&i===4?64:h},i>2&&s.momentumBarGood]}/>)}</View>;
}
function MovingAverage({ s, warn }: { s: S; warn: boolean }) {
  return <View style={s.chart}><Seg s={s} left="7%" top="65%" width="14%" rotate={-22}/><Seg s={s} left="19%" top="59%" width="14%" rotate={30}/><Seg s={s} left="31%" top="67%" width="15%" rotate={-42}/><Seg s={s} left="44%" top="52%" width="15%" rotate={28}/><Seg s={s} left="57%" top="58%" width="15%" rotate={-34}/><Seg s={s} left="70%" top="46%" width="17%" rotate={warn?5:-22}/><View style={s.avgLine}/></View>;
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell:{width:'100%',minHeight:260,borderRadius:18,borderWidth:1,borderColor:'#24465C',backgroundColor:'#081725',padding:14,position:'relative',overflow:'hidden',justifyContent:'center'},
  shellSummary:{minHeight:180},gridH1:{position:'absolute',left:14,right:14,top:'34%',height:1,backgroundColor:'#102E40'},gridH2:{position:'absolute',left:14,right:14,top:'67%',height:1,backgroundColor:'#102E40'},gridV1:{position:'absolute',top:14,bottom:14,left:'36%',width:1,backgroundColor:'#102E40'},gridV2:{position:'absolute',top:14,bottom:14,left:'69%',width:1,backgroundColor:'#102E40'},
  rowCenter:{minHeight:160,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9},arrow:{color:'#55D0BF',fontSize:22,fontWeight:'900'},warn:{color:'#C78B5D'},good:{color:'#5EEAD4'},micro:{color:'#9EB1BD',fontSize:9,fontWeight:'900',textAlign:'center'},pill:{minWidth:66,minHeight:58,borderRadius:14,borderWidth:1,borderColor:'#35576A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center',padding:7},pillAccent:{borderColor:'#2E756D',backgroundColor:'#0E3334'},pillWarn:{borderColor:'#785A42',backgroundColor:'#241D18'},pillText:{color:'#E7EEF2',fontSize:9,fontWeight:'900'},exchange:{minHeight:160,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5},exchangeOrder:{width:74,minHeight:98,borderRadius:15,borderWidth:1,borderColor:'#35576A',backgroundColor:'#102638',padding:9,alignItems:'center',justifyContent:'center',gap:7},orderType:{color:'#E7EEF2',fontSize:8,fontWeight:'900',textAlign:'center'},orderLines:{width:'100%',gap:4},orderLine:{height:4,borderRadius:2,backgroundColor:'#6D899A'},orderLineShort:{width:'62%',alignSelf:'center'},hub:{width:70,height:94,borderRadius:19,borderWidth:1,borderColor:'#2E756D',backgroundColor:'#0E3334',alignItems:'center',justifyContent:'center',gap:7},hubWarn:{borderColor:'#785A42'},hubText:{color:'#5EEAD4',fontSize:8,fontWeight:'900'},hubRule:{width:28,height:3,borderRadius:2,backgroundColor:'#55D0BF'},memberStack:{gap:7},member:{width:82,height:36,borderRadius:10,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12},memberName:{color:'#A4B5BF',fontSize:10,fontWeight:'900'},memberDir:{color:'#55D0BF',fontSize:16,fontWeight:'900'},indexOrb:{width:78,height:78,borderRadius:39,borderWidth:2,borderColor:'#2E756D',backgroundColor:'#0E3334',alignItems:'center',justifyContent:'center'},indexValue:{color:'#55D0BF',fontSize:30,fontWeight:'900'},etfCard:{width:84,height:96,borderRadius:20,borderWidth:1,borderColor:'#2E756D',backgroundColor:'#0E3334',alignItems:'center',justifyContent:'center'},etfText:{color:'#5EEAD4',fontSize:18,fontWeight:'900'},basketGrid:{width:128,flexDirection:'row',flexWrap:'wrap',gap:8},assetTile:{width:58,height:58,borderRadius:14,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center'},assetTileWarn:{borderColor:'#785A42',backgroundColor:'#241D18'},assetGlyph:{width:23,height:23,borderRadius:6,backgroundColor:'#6D899A'},assetGlyphAlt:{borderRadius:12,backgroundColor:'#55D0BF'},flowColumn:{alignItems:'center',gap:2},document:{width:112,height:132,borderRadius:15,backgroundColor:'#D8E0E2',padding:14,alignItems:'center'},documentWarn:{backgroundColor:'#C9BEB4'},docSeal:{width:29,height:29,borderRadius:15,borderWidth:4,borderColor:'#63787E',marginBottom:18},docLine:{width:'72%',height:6,borderRadius:3,backgroundColor:'#768A90',marginBottom:8},docLineShort:{width:'48%',height:5,borderRadius:3,backgroundColor:'#99A7AA'},fxCard:{width:96,height:110,borderRadius:22,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center'},fxCardAccent:{borderColor:'#2E756D',backgroundColor:'#0E3334'},fxCode:{color:'#E7EEF2',fontSize:17,fontWeight:'900'},swap:{color:'#55D0BF',fontSize:28,fontWeight:'900'},commodityRow:{minHeight:165,flexDirection:'row',alignItems:'center',justifyContent:'space-around'},gold:{width:70,height:45,borderRadius:9,backgroundColor:'#8B7044',borderWidth:1,borderColor:'#B89B60',padding:7,transform:[{skewX:'-7deg'}]},goldInset:{flex:1,borderRadius:4,borderWidth:1,borderColor:'#C2A66C'},barrel:{width:55,height:82,borderRadius:16,backgroundColor:'#314D5D',justifyContent:'space-around',paddingVertical:13},barrelBand:{height:5,backgroundColor:'#728A96'},wheat:{width:54,height:105,position:'relative',alignItems:'center',justifyContent:'flex-end'},wheatStem:{width:4,height:88,borderRadius:2,backgroundColor:'#8A7D57'},grain:{position:'absolute',width:15,height:9,borderRadius:6,backgroundColor:'#B29D66'},threeCards:{minHeight:160,flexDirection:'row',gap:8,alignItems:'center'},statementCard:{flex:1,height:120,borderRadius:16,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center',gap:18},statementWarn:{borderColor:'#785A42'},statementIcon:{width:44,height:44,borderRadius:12,backgroundColor:'#6E8A9A'},statementIconGood:{backgroundColor:'#55D0BF'},waterfall:{minHeight:160,justifyContent:'center',gap:13},waterRow:{gap:6},waterLabel:{color:'#93A8B5',fontSize:8,fontWeight:'900'},waterBar:{height:20,borderRadius:7,backgroundColor:'#607E8E'},waterWarn:{backgroundColor:'#9C704E'},waterGood:{backgroundColor:'#4FCDBB'},balance:{minHeight:160,flexDirection:'row',gap:8},balanceHalf:{flex:1,borderRadius:16,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',padding:12,justifyContent:'center',gap:9},balanceHalfWarn:{borderColor:'#785A42'},balanceMass:{height:85,borderRadius:10,backgroundColor:'#4A687A'},balanceDebt:{height:48,borderRadius:8,backgroundColor:'#9B704E'},balanceEquity:{height:34,borderRadius:8,backgroundColor:'#4FCDBB'},cashScene:{minHeight:160,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},cashIn:{gap:7},cashOut:{gap:7},cashDot:{width:24,height:24,borderRadius:12,backgroundColor:'#55D0BF'},cashDotOut:{backgroundColor:'#7895A4'},cashCore:{width:82,height:82,borderRadius:23,borderWidth:1,borderColor:'#2E756D',backgroundColor:'#0E3334',alignItems:'center',justifyContent:'center'},cashCoreWarn:{borderColor:'#785A42'},cashCoreInner:{width:32,height:32,borderRadius:16,backgroundColor:'#55D0BF'},marginScene:{minHeight:160,justifyContent:'center',gap:22},marginTrack:{height:34,borderRadius:17,backgroundColor:'#172E40',overflow:'hidden'},marginSales:{height:'100%',backgroundColor:'#648293'},marginProfit:{height:'100%',backgroundColor:'#55D0BF'},marginBracket:{position:'absolute',right:'12%',top:'40%',height:70,width:20,borderRightWidth:2,borderTopWidth:2,borderBottomWidth:2,borderColor:'#55D0BF'},debtScene:{minHeight:160,position:'relative',justifyContent:'center'},liquidityPool:{position:'absolute',left:'5%',top:'36%',width:70,height:70,borderRadius:35,borderWidth:1,borderColor:'#2E756D',backgroundColor:'#0E3334',alignItems:'center',justifyContent:'center'},timeline:{position:'absolute',left:'29%',right:'30%',top:'50%',height:4,backgroundColor:'#526F80',flexDirection:'row',justifyContent:'space-around'},dueDot:{width:15,height:15,borderRadius:8,backgroundColor:'#7895A4',marginTop:-6},dueDotWarn:{backgroundColor:'#A87551'},debtBlock:{position:'absolute',right:'4%',top:'31%',width:78,height:88,borderRadius:17,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center'},debtBlockWarn:{borderColor:'#785A42',backgroundColor:'#241D18'},pathPair:{minHeight:160,justifyContent:'center',gap:10},pathRow:{height:58,borderRadius:14,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',flexDirection:'row',alignItems:'center',paddingHorizontal:12,gap:10},pathLabel:{width:18,color:'#A4B5BF',fontSize:10,fontWeight:'900'},pathGlyph:{flex:1,height:34,position:'relative'},pathSeg:{position:'absolute',left:'4%',top:'45%',width:'29%',height:4,borderRadius:2,backgroundColor:'#55D0BF'},down:{color:'#B17A53',fontSize:24,fontWeight:'900'},up:{color:'#55D0BF',fontSize:24,fontWeight:'900'},dual:{minHeight:160,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:14},multCard:{width:105,height:130,borderRadius:19,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'space-between',padding:12},multCardAccent:{borderColor:'#2E756D',backgroundColor:'#0E3334'},mult:{color:'#E7EEF2',fontSize:19,fontWeight:'900'},impactBar:{width:38,borderRadius:10,backgroundColor:'#708D9D'},impactBarAccent:{backgroundColor:'#55D0BF'},concentration:{minHeight:160,alignItems:'center',justifyContent:'center'},holdings:{flexDirection:'row',gap:7},holding:{width:34,height:34,borderRadius:11,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center'},holdingText:{color:'#A4B5BF',fontSize:9,fontWeight:'900'},oneRisk:{width:92,height:48,borderRadius:24,borderWidth:1,borderColor:'#785A42',backgroundColor:'#241D18',alignItems:'center',justifyContent:'center'},oneRiskCore:{width:48,height:8,borderRadius:4,backgroundColor:'#A87551'},factorRow:{flexDirection:'row',gap:13},factor:{width:36,height:36,borderRadius:18,backgroundColor:'#55D0BF'},budgetRows:{minHeight:160,justifyContent:'center',gap:16},budgetRow:{height:45,flexDirection:'row',borderRadius:14,overflow:'hidden',borderWidth:1,borderColor:'#35566A'},budgetBar:{height:'100%',backgroundColor:'#1B3344'},budgetGood:{backgroundColor:'#2D756D'},budgetWarn:{backgroundColor:'#8A6046'},plan:{minHeight:160,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:4},planNode:{width:48,height:62,borderRadius:15,borderWidth:1,borderColor:'#35566A',backgroundColor:'#102638',alignItems:'center',justifyContent:'center'},planNodeAccent:{borderColor:'#2E756D',backgroundColor:'#0E3334'},planGlyph:{width:20,height:20,borderRadius:10,backgroundColor:'#7895A4'},chart:{minHeight:166,position:'relative',borderRadius:14,borderWidth:1,borderColor:'#26495D',backgroundColor:'#0A1C29',overflow:'hidden'},seg:{position:'absolute',height:5,borderRadius:3,backgroundColor:'#718D9D'},segGood:{backgroundColor:'#55D0BF'},segWarn:{backgroundColor:'#A87551'},resistance:{position:'absolute',left:'6%',right:'6%',top:'42%',height:18,borderRadius:7,borderWidth:1,borderColor:'#755A42',backgroundColor:'rgba(117,90,66,0.13)'},support:{position:'absolute',left:'6%',right:'6%',top:'69%',height:14,borderRadius:7,borderWidth:1,borderColor:'#2E756D',backgroundColor:'rgba(46,117,109,0.12)'},rangeTop:{position:'absolute',left:'6%',right:'6%',top:'25%',height:2,backgroundColor:'#795E43'},rangeBottom:{position:'absolute',left:'6%',right:'6%',top:'75%',height:2,backgroundColor:'#2E756D'},momentum:{minHeight:166,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-around',paddingHorizontal:28,paddingBottom:22},momentumBar:{width:25,borderTopLeftRadius:8,borderTopRightRadius:8,backgroundColor:'#627F90'},momentumBarGood:{backgroundColor:'#55D0BF'},avgLine:{position:'absolute',left:'7%',right:'7%',top:'53%',height:6,borderRadius:3,backgroundColor:'#55D0BF',transform:[{rotate:'-13deg'}]},
});
