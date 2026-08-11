import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'priceFormation' | 'instruments' | 'liquidity' | 'bidAsk' | 'orderTypes' | 'slippage';

export interface MarketFoundationSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('fiyat-piyasada-nasil-olusur')) return 'priceFormation';
  if (assetRef.includes('piyasa-araclari-ayni-degildir')) return 'instruments';
  if (assetRef.includes('likidite-neden-onemlidir')) return 'liquidity';
  if (assetRef.includes('bid-ask-spread-nedir')) return 'bidAsk';
  if (assetRef.includes('piyasa-limit-stop-emirleri')) return 'orderTypes';
  if (assetRef.includes('gerceklesme-fiyati-kayma')) return 'slippage';
  return undefined;
}

export function isMarketFoundationSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function MarketFoundationSlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: MarketFoundationSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'priceFormation' ? <PriceScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'instruments' ? <InstrumentScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'liquidity' ? <LiquidityScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'bidAsk' ? <BidAskScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'orderTypes' ? <OrderScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'slippage' ? <SlippageScene role={role} tr={tr} styles={styles} /> : null}
      </View>
    </View>
  );
}

type SceneProps = { role: SlideRole; tr: boolean; styles: ReturnType<typeof createStyles> };

function Header({ styles, title, detail }: { styles: ReturnType<typeof createStyles>; title: string; detail: string }) {
  return <View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>;
}

function Rule({ styles, title, detail, warning = false }: { styles: ReturnType<typeof createStyles>; title: string; detail: string; warning?: boolean }) {
  return <View style={[styles.rule, warning && styles.ruleWarning]}><Text style={[styles.ruleTitle, warning && styles.warning]}>{title}</Text><Text style={styles.ruleDetail}>{detail}</Text></View>;
}

function Card({ styles, label, value, tone = 'neutral' }: { styles: ReturnType<typeof createStyles>; label: string; value: string; tone?: 'neutral' | 'success' | 'warning' | 'risk' }) {
  return <View style={styles.card}><Text style={styles.cardLabel}>{label}</Text><Text style={[styles.cardValue, tone === 'success' ? styles.success : tone === 'warning' ? styles.warning : tone === 'risk' ? styles.risk : undefined]}>{value}</Text></View>;
}

function PriceScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Fiyatı kim belirler?' : 'Who sets the price?'} detail={tr ? 'Şirket değil; alıcı ve satıcının eşleşmesi.' : 'Not the company; buyer and seller matching.'} /><Match styles={styles} tr={tr} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Teklifler eşleşince işlem oluşur' : 'A trade forms when offers match'} detail={tr ? 'Son fiyat, gerçekleşmiş son eşleşmenin kaydıdır.' : 'Last price records the latest completed match.'} /><Match styles={styles} tr={tr} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Yeni emir dengeyi değiştirebilir' : 'New orders can change the balance'} detail={tr ? 'Yeni alıcı ve satıcı tercihleri yeni fiyatlar oluşturabilir.' : 'New buyer and seller preferences can form new prices.'} /><View style={styles.flow}><Card styles={styles} label={tr ? 'YENİ EMİR' : 'NEW ORDER'} value="+" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'EŞLEŞME' : 'MATCH'} value="✓" tone="success" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'SON FİYAT' : 'LAST PRICE'} value="100.2" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? '“ŞİRKET FİYATI SEÇER” ✕' : '“THE COMPANY PICKS THE PRICE” ✕'} detail={tr ? 'Piyasa fiyatı emirlerin eşleşmesiyle keşfedilir.' : 'Market price is discovered through order matching.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'SON FİYAT ≠ GELECEK FİYAT' : 'LAST PRICE ≠ FUTURE PRICE'} detail={tr ? 'Son işlem bir sonraki eşleşmeyi garanti etmez.' : 'The last trade does not guarantee the next match.'} />;
  return <Rule styles={styles} title={tr ? 'FİYAT = SÜREKLİ DEĞİŞEN EŞLEŞME' : 'PRICE = CONTINUOUS MATCHING'} detail={tr ? 'Sabit bir etiket değildir.' : 'It is not a fixed label.'} />;
}

function InstrumentScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Hepsi grafik; hepsi aynı şey mi?' : 'They all have charts; are they the same?'} detail={tr ? 'Hayır. Temsil ettikleri ekonomik yapı farklıdır.' : 'No. Their economic meaning differs.'} /><InstrumentGrid styles={styles} tr={tr} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Dört araç, dört farklı anlam' : 'Four instruments, four different meanings'} detail={tr ? 'Ortaklık · Borç · Kur · Fiziksel değer' : 'Ownership · Debt · Exchange rate · Physical value'} /><InstrumentGrid styles={styles} tr={tr} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Önce neyi aldığını sor' : 'First ask what you are buying'} detail={tr ? 'Araç türü değişince temel riskler de değişir.' : 'When the instrument changes, core risks change too.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'HİSSE' : 'STOCK'} value={tr ? 'ORTAKLIK' : 'OWNERSHIP'} tone="success" /><Card styles={styles} label={tr ? 'TAHVİL' : 'BOND'} value={tr ? 'BORÇ' : 'DEBT'} /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'BENZER GRAFİK ≠ AYNI ÜRÜN' : 'SIMILAR CHART ≠ SAME PRODUCT'} detail={tr ? 'Ekonomik yapı ve risk kaynağı farklı olabilir.' : 'Economic structure and risk sources can differ.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'TEK ANALİZ ŞABLONU HER ARACA UYMAZ' : 'ONE ANALYSIS TEMPLATE DOES NOT FIT ALL'} detail={tr ? 'Vade, kredi, para politikası ve taşıma maliyetleri farklılaşabilir.' : 'Maturity, credit, policy sensitivity, and carry can differ.'} />;
  return <Rule styles={styles} title={tr ? 'ARAÇ DEĞİŞİRSE RİSK DEĞİŞİR' : 'DIFFERENT INSTRUMENT · DIFFERENT RISK'} detail={tr ? 'Önce neyi temsil ettiğini bil.' : 'Know what the instrument represents first.'} />;
}

function LiquidityScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Ekrandaki fiyattan hemen satabilir misin?' : 'Can you sell immediately at the displayed price?'} detail={tr ? 'Karşı tarafta yeterli emir yoksa zorlaşabilir.' : 'It can be harder without enough opposing orders.'} /><Depth styles={styles} tr={tr} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Derin piyasa, daha kolay gerçekleşme' : 'Deeper market, easier execution'} detail={tr ? 'Likidite yalnız hacim değil; derinlik ve fiyat etkisidir.' : 'Liquidity is not just volume; depth and price impact matter.'} /><Depth styles={styles} tr={tr} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Aynı emir, farklı fiyat etkisi' : 'Same order, different price impact'} detail={tr ? 'Sığ piyasada aynı emir daha fazla kaydırabilir.' : 'The same order can move price more in a shallow market.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'DERİN' : 'DEEP'} value="Δ 0.1" tone="success" /><Card styles={styles} label={tr ? 'SIĞ' : 'SHALLOW'} value="Δ 1.2" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'YÜKSEK HACİM ≠ HER AN YÜKSEK LİKİDİTE' : 'HIGH VOLUME ≠ ALWAYS HIGH LIQUIDITY'} detail={tr ? 'Emir büyüklüğü ve anlık defter derinliği önemlidir.' : 'Order size and current book depth matter.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'DÜŞÜK LİKİDİTE = DAHA FAZLA FİYAT ETKİSİ' : 'LOW LIQUIDITY = MORE PRICE IMPACT'} detail={tr ? 'İstenen fiyata yakın gerçekleşme zorlaşabilir.' : 'Execution near the desired price can become harder.'} />;
  return <Rule styles={styles} title={tr ? 'LİKİDİTE = GERÇEKLEŞEBİLİRLİK + FİYAT ETKİSİ' : 'LIQUIDITY = EXECUTABILITY + PRICE IMPACT'} detail={tr ? 'Yalnız işlem adedi değildir.' : 'It is more than trade count.'} />;
}

function BidAskScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Aldığın ve sattığın fiyat neden farklı?' : 'Why are buy and sell prices different?'} detail={tr ? 'Bid ile ask arasında spread vardır.' : 'There is a spread between bid and ask.'} /><Quote styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title="BID · ASK · SPREAD" detail={tr ? 'Bid alıcı teklifi · Ask satıcı teklifi' : 'Bid is buyer offer · Ask is seller offer'} /><Quote styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Spread işlem maliyetinin parçasıdır' : 'Spread is part of trading cost'} detail={tr ? 'Piyasa emri karşı taraftaki fiyatla eşleşmeye çalışır.' : 'A market order tries to match the opposing quote.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'SATIŞ' : 'SELL'} value="BID 99" /><Card styles={styles} label={tr ? 'ALIŞ' : 'BUY'} value="ASK 101" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'SON FİYAT ≠ BID ≠ ASK' : 'LAST ≠ BID ≠ ASK'} detail={tr ? 'Üçü farklı piyasa bilgisidir.' : 'They are different pieces of market information.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'SPREAD GENİŞLEYEBİLİR' : 'SPREAD CAN WIDEN'} detail={tr ? 'Stresli veya sığ piyasalarda işlem maliyeti artabilir.' : 'Trading cost can rise in stressed or shallow markets.'} />;
  return <Rule styles={styles} title={tr ? 'SPREAD = ASK − BID' : 'SPREAD = ASK − BID'} detail={tr ? 'Küçük görünse bile gerçek maliyetin parçasıdır.' : 'Even when small, it is part of real trading cost.'} />;
}

function OrderScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Emri nasıl verdiğin neden önemli?' : 'Why does order type matter?'} detail={tr ? 'Hız, fiyat kontrolü ve tetikleme farklıdır.' : 'Speed, price control, and triggers differ.'} /><OrderGrid styles={styles} tr={tr} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Üç farklı kontrol biçimi' : 'Three different forms of control'} detail={tr ? 'Piyasa · Limit · Stop' : 'Market · Limit · Stop'} /><OrderGrid styles={styles} tr={tr} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Önceliğin ne?' : 'What is your priority?'} detail={tr ? 'Hız mı, fiyat sınırı mı, tetik koşulu mu?' : 'Speed, price boundary, or trigger condition?'} /><View style={styles.three}><Card styles={styles} label="MARKET" value={tr ? 'HIZ' : 'SPEED'} /><Card styles={styles} label="LIMIT" value={tr ? 'FİYAT' : 'PRICE'} tone="success" /><Card styles={styles} label="STOP" value={tr ? 'TETİK' : 'TRIGGER'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'EMİR TÜRÜ ≠ SONUÇ GARANTİSİ' : 'ORDER TYPE ≠ OUTCOME GUARANTEE'} detail={tr ? 'Her emir türünün ayrı gerçekleşme riski vardır.' : 'Each order type carries different execution risk.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'MARKET: FİYAT BELİRSİZ · LIMIT: FILL BELİRSİZ' : 'MARKET: PRICE UNCERTAIN · LIMIT: FILL UNCERTAIN'} detail={tr ? 'Kontrol türünü seçerken trade-off’u bil.' : 'Know the trade-off behind the control you choose.'} />;
  return <Rule styles={styles} title={tr ? 'HIZ · FİYAT · TETİK' : 'SPEED · PRICE · TRIGGER'} detail={tr ? 'Emir türü hangi kontrolü önceliklendirdiğini belirler.' : 'Order type determines which control you prioritize.'} />;
}

function SlippageScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? '100 görüp neden 100,3’ten işlem olur?' : 'Why can 100 display but 100.3 execute?'} detail={tr ? 'Ekrandaki fiyat ile gerçekleşme fiyatı aynı olmak zorunda değildir.' : 'Displayed price and execution price do not have to match.'} /><FillSteps styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Slippage = beklenen ve gerçekleşen fiyat farkı' : 'Slippage = expected vs executed price'} detail={tr ? 'Emir karşı taraftaki likiditeyi tüketirken ortalama fiyat değişebilir.' : 'Average fill can change as the order consumes liquidity.'} /><FillSteps styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Slippage ne zaman büyüyebilir?' : 'When can slippage grow?'} detail={tr ? 'Büyük emir · düşük likidite · hızlı hareket' : 'Large order · low liquidity · fast movement'} /><View style={styles.three}><Card styles={styles} label={tr ? 'EMİR' : 'SIZE'} value="↑" tone="warning" /><Card styles={styles} label={tr ? 'LİKİDİTE' : 'LIQUIDITY'} value="↓" tone="risk" /><Card styles={styles} label="VOL" value="↑" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'SON FİYAT ≠ SENİN KESİN FILL FİYATIN' : 'LAST PRICE ≠ YOUR GUARANTEED FILL'} detail={tr ? 'Yeni emir farklı fiyat seviyelerinde gerçekleşebilir.' : 'A new order can execute across different price levels.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'GERÇEKLEŞME KALİTESİ PİYASA KOŞULUNA BAĞLIDIR' : 'EXECUTION QUALITY DEPENDS ON MARKET CONDITIONS'} detail={tr ? 'Likidite, volatilite ve emir boyutu birlikte etkiler.' : 'Liquidity, volatility, and order size interact.'} />;
  return <Rule styles={styles} title={tr ? 'EKRAN FİYATI ≠ GARANTİLİ GERÇEKLEŞME' : 'DISPLAYED PRICE ≠ GUARANTEED EXECUTION'} detail={tr ? 'Gerçek fill piyasa koşullarında oluşur.' : 'The actual fill forms under live market conditions.'} />;
}

function Match({ styles, tr }: { styles: ReturnType<typeof createStyles>; tr: boolean }) {
  return <View style={styles.row}><Card styles={styles} label={tr ? 'ALIŞ' : 'BUY'} value="99.8" /><View style={styles.match}><Text style={styles.matchText}>100</Text><Text style={styles.cardLabel}>MATCH</Text></View><Card styles={styles} label={tr ? 'SATIŞ' : 'SELL'} value="100.2" /></View>;
}

function InstrumentGrid({ styles, tr }: { styles: ReturnType<typeof createStyles>; tr: boolean }) {
  const items = tr ? [['HİSSE', 'ORTAKLIK'], ['TAHVİL', 'BORÇ'], ['DÖVİZ', 'KUR'], ['EMTİA', 'ÜRÜN']] : [['STOCK', 'OWNERSHIP'], ['BOND', 'DEBT'], ['FX', 'RATE'], ['COMMODITY', 'PRODUCT']];
  return <View style={styles.grid}>{items.map(([label, value]) => <Card key={label} styles={styles} label={label} value={value} />)}</View>;
}

function Depth({ styles, tr }: { styles: ReturnType<typeof createStyles>; tr: boolean }) {
  return <View style={styles.row}><DepthCard styles={styles} label={tr ? 'DERİN' : 'DEEP'} bars={[90, 74, 62, 48]} good /><DepthCard styles={styles} label={tr ? 'SIĞ' : 'SHALLOW'} bars={[42, 28, 18, 10]} /></View>;
}

function DepthCard({ styles, label, bars, good = false }: { styles: ReturnType<typeof createStyles>; label: string; bars: number[]; good?: boolean }) {
  return <View style={styles.depthCard}><Text style={[styles.cardLabel, good ? styles.success : styles.warning]}>{label}</Text>{bars.map((width, index) => <View key={index} style={[styles.depthBar, { width: `${width}%` }, good && styles.depthGood]} />)}</View>;
}

function Quote({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.row}><Card styles={styles} label="BID" value="99" /><View style={styles.spread}><Text style={styles.spreadValue}>2</Text><Text style={styles.cardLabel}>SPREAD</Text></View><Card styles={styles} label="ASK" value="101" /></View>;
}

function OrderGrid({ styles, tr }: { styles: ReturnType<typeof createStyles>; tr: boolean }) {
  return <View style={styles.three}><Card styles={styles} label="MARKET" value={tr ? 'HIZ' : 'SPEED'} /><Card styles={styles} label="LIMIT" value={tr ? 'SINIR' : 'BOUNDARY'} tone="success" /><Card styles={styles} label="STOP" value={tr ? 'TETİK' : 'TRIGGER'} tone="warning" /></View>;
}

function FillSteps({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.fillSteps}><View style={[styles.fillStep, { flex: 2 }]}><Text style={styles.fillText}>100.0</Text></View><View style={[styles.fillStep, styles.fillStep2, { flex: 3 }]}><Text style={styles.fillText}>100.2</Text></View><View style={[styles.fillStep, styles.fillStep3, { flex: 4 }]}><Text style={styles.fillText}>100.5</Text></View></View>;
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 14, padding: 14 },
  header: { gap: 4 },
  title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' },
  detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  three: { flexDirection: 'row', gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  flow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  arrow: { color: theme.colors.textMuted, fontSize: 19, fontWeight: '900' },
  success: { color: theme.colors.success },
  warning: { color: theme.colors.warning },
  risk: { color: theme.colors.risk },
  card: { flex: 1, minWidth: 78, minHeight: 82, justifyContent: 'center', gap: 7, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  cardLabel: { color: theme.colors.textMuted, fontSize: 9, lineHeight: 12, fontWeight: '900', letterSpacing: 0.45, textAlign: 'center' },
  cardValue: { color: theme.colors.text, fontSize: 13, lineHeight: 18, fontWeight: '900', textAlign: 'center' },
  rule: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(45,212,191,0.22)', backgroundColor: 'rgba(45,212,191,0.06)' },
  ruleWarning: { borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' },
  ruleTitle: { color: theme.colors.primary, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
  ruleDetail: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  match: { width: 68, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 34, borderWidth: 1, borderColor: 'rgba(45,212,191,0.36)', backgroundColor: 'rgba(45,212,191,0.08)' },
  matchText: { color: theme.colors.primary, fontSize: 18, fontWeight: '900' },
  depthCard: { flex: 1, minHeight: 108, justifyContent: 'center', gap: 7, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  depthBar: { height: 9, borderRadius: 5, backgroundColor: 'rgba(251,191,36,0.28)' },
  depthGood: { backgroundColor: 'rgba(45,212,191,0.30)' },
  spread: { width: 66, alignItems: 'center', justifyContent: 'center', gap: 4 },
  spreadValue: { color: theme.colors.warning, fontSize: 20, fontWeight: '900' },
  fillSteps: { minHeight: 104, flexDirection: 'row', alignItems: 'stretch', overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border },
  fillStep: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(45,212,191,0.12)' },
  fillStep2: { backgroundColor: 'rgba(251,191,36,0.10)' },
  fillStep3: { backgroundColor: 'rgba(251,113,133,0.10)' },
  fillText: { color: theme.colors.text, fontSize: 12, fontWeight: '900' },
});
