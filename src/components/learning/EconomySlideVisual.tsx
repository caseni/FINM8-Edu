import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'inflation' | 'rates' | 'centralBank' | 'monetaryPolicy' | 'growth' | 'cycle';

export interface EconomySlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('enflasyon-satin-alma-gucu')) return 'inflation';
  if (assetRef.includes('faiz-orani-ne-anlatir')) return 'rates';
  if (assetRef.includes('merkez-bankasi-ne-yapar')) return 'centralBank';
  if (assetRef.includes('faiz-karari-ekonomiye-nasil-yansir')) return 'monetaryPolicy';
  if (assetRef.includes('gsyh-buyume-ne-anlatir')) return 'growth';
  if (assetRef.includes('ekonomik-dongu-resesyon')) return 'cycle';
  return undefined;
}

export function isEconomySlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function EconomySlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: EconomySlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'inflation' ? <InflationScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'rates' ? <RatesScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'centralBank' ? <CentralBankScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'monetaryPolicy' ? <PolicyScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'growth' ? <GrowthScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'cycle' ? <CycleScene role={role} tr={tr} styles={styles} /> : null}
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

function InflationScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Aynı para, daha az ürün' : 'Same money, fewer goods'} detail={tr ? 'Satın alma gücü fiyatlar yükseldikçe azalabilir.' : 'Purchasing power can fall as prices rise.'} /><Basket styles={styles} before={5} after={3} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Genel fiyat düzeyi ↑' : 'General price level ↑'} detail={tr ? 'Enflasyon tek ürünü değil geniş fiyat sepetini anlatır.' : 'Inflation concerns a broad basket, not one item.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'FİYAT SEPETİ' : 'PRICE BASKET'} value="↑" tone="warning" /><Card styles={styles} label={tr ? 'SATIN ALMA GÜCÜ' : 'PURCHASING POWER'} value="↓" tone="risk" /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Tek ürün mü, geniş sepet mi?' : 'One item or a broad basket?'} detail={tr ? 'Genel enflasyon için daha geniş fiyat hareketine bak.' : 'Use broader price movement when thinking about inflation.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'TEK ÜRÜN' : 'ONE ITEM'} value="+20%" tone="warning" /><Card styles={styles} label={tr ? 'GENİŞ SEPET' : 'BROAD BASKET'} value="+6%" tone="success" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? '1 ÜRÜN ↑ ≠ GENEL ENFLASYON' : '1 ITEM ↑ ≠ BROAD INFLATION'} detail={tr ? 'Tek fiyat hareketi ekonominin tamamını temsil etmez.' : 'One price move does not represent the whole economy.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'TEK VERİ NOKTASI ≠ KALICI TREND' : 'ONE DATA POINT ≠ PERSISTENT TREND'} detail={tr ? 'Sepet, dönem ve ölçüm yöntemini birlikte değerlendir.' : 'Consider the basket, period, and methodology together.'} />;
  return <Rule styles={styles} title={tr ? 'ENFLASYON ↑ → SATIN ALMA GÜCÜ BASKI ALTINDA' : 'INFLATION ↑ → PURCHASING POWER UNDER PRESSURE'} detail={tr ? 'Gelir aynı hızda artmıyorsa aynı para daha az şey alabilir.' : 'If income does not keep pace, the same money can buy less.'} />;
}

function RatesScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Paranın zaman içindeki bedeli' : 'The price of money over time'} detail={tr ? 'Borç alan için maliyet, tasarruf eden için getiri olabilir.' : 'It can be a cost to borrow and a return to save.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'BORÇ' : 'BORROW'} value={tr ? 'MALİYET' : 'COST'} tone="risk" /><Card styles={styles} label={tr ? 'TASARRUF' : 'SAVE'} value={tr ? 'GETİRİ' : 'RETURN'} tone="success" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Faiz yükselirse finansman maliyeti değişir' : 'Higher rates change financing cost'} detail={tr ? 'Yeni borçlanma genellikle daha pahalı hâle gelebilir.' : 'New borrowing can generally become more expensive.'} /><RateMeter styles={styles} high /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Aynı kredi, farklı faiz' : 'Same loan, different rate'} detail={tr ? 'Faiz oranı ödeme maliyetini değiştirir.' : 'The interest rate changes borrowing cost.'} /><View style={styles.row}><Card styles={styles} label="%5" value={tr ? 'DAHA DÜŞÜK' : 'LOWER'} tone="success" /><Card styles={styles} label="%15" value={tr ? 'DAHA YÜKSEK' : 'HIGHER'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'EKONOMİDE TEK FAİZ YOK' : 'THERE IS NOT ONE SINGLE RATE'} detail={tr ? 'Vade, kredi riski ve ürün özellikleri oranları değiştirebilir.' : 'Maturity, credit risk, and product features can change rates.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'NOMİNAL FAİZ TEK BAŞINA YETERLİ DEĞİL' : 'NOMINAL RATE ALONE IS NOT ENOUGH'} detail={tr ? 'Enflasyon beklentisi ve diğer riskleri de düşün.' : 'Consider inflation expectations and other risks too.'} />;
  return <Rule styles={styles} title={tr ? 'FAİZ = PARAYI ZAMAN İÇİNDE KULLANMANIN BEDELİ' : 'INTEREST = PRICE OF USING MONEY OVER TIME'} detail={tr ? 'Borçlanma ve tasarruf kararlarını etkiler.' : 'It affects borrowing and saving decisions.'} />;
}

function CentralBankScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Merkez bankası neden izlenir?' : 'Why do markets watch central banks?'} detail={tr ? 'Para politikası finansal koşulları etkileyebilir.' : 'Monetary policy can influence financial conditions.'} /><Hub styles={styles} tr={tr} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Araçlar → finansal koşullar' : 'Tools → financial conditions'} detail={tr ? 'Politika faizi önemli ama tek araç değildir.' : 'The policy rate is important, but not the only tool.'} /><Hub styles={styles} tr={tr} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Doğrudan mı, dolaylı mı?' : 'Direct or indirect?'} detail={tr ? 'Merkez bankası her piyasa fiyatını tek tek belirlemez.' : 'A central bank does not set every market price directly.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'POLİTİKA' : 'POLICY'} value={tr ? 'KOŞULLARI ETKİLER' : 'INFLUENCES'} tone="success" /><Card styles={styles} label={tr ? 'HİSSE FİYATI' : 'STOCK PRICE'} value={tr ? 'DOĞRUDAN DEĞİL' : 'NOT DIRECT'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'MERKEZ BANKASI ≠ HER FİYATIN YÖNETİCİSİ' : 'CENTRAL BANK ≠ MANAGER OF EVERY PRICE'} detail={tr ? 'Piyasa fiyatları çok sayıda etken ve işlemle oluşur.' : 'Market prices form through many factors and transactions.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'GÖREVLER ÜLKEYE GÖRE DEĞİŞEBİLİR' : 'MANDATES CAN DIFFER BY COUNTRY'} detail={tr ? 'Fiyat istikrarı, istihdam ve finansal istikrar ağırlıkları aynı olmayabilir.' : 'Price stability, employment, and financial-stability mandates can differ.'} />;
  return <Rule styles={styles} title={tr ? 'MERKEZ BANKASI FİNANSAL KOŞULLARI ETKİLER' : 'CENTRAL BANKS INFLUENCE FINANCIAL CONDITIONS'} detail={tr ? 'Her piyasa fiyatını doğrudan belirlemez.' : 'They do not directly set every market price.'} />;
}

function PolicyScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Faiz kararı neden hemen sonuç vermez?' : 'Why does a rate decision take time?'} detail={tr ? 'Etki ekonomiye bir zincir üzerinden yayılır.' : 'The effect spreads through a transmission chain.'} /><PolicyFlow styles={styles} tr={tr} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Para politikası aktarım zinciri' : 'Monetary-policy transmission'} detail={tr ? 'Faiz → finansal koşullar → harcama/tasarruf → talep → fiyat baskıları' : 'Rates → financial conditions → spending/saving → demand → price pressures'} /><PolicyFlow styles={styles} tr={tr} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Aynı karar, farklı ekonomik ortam' : 'Same decision, different environment'} detail={tr ? 'Borçluluk, beklentiler ve finansal sistem aktarımı değiştirebilir.' : 'Leverage, expectations, and the financial system can change transmission.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'ORTAM A' : 'CONTEXT A'} value={tr ? 'GÜÇLÜ AKTARIM' : 'STRONG'} tone="success" /><Card styles={styles} label={tr ? 'ORTAM B' : 'CONTEXT B'} value={tr ? 'ZAYIF AKTARIM' : 'WEAK'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'FAİZ KARARI ≠ ERTESİ GÜN KESİN SONUÇ' : 'RATE DECISION ≠ GUARANTEED NEXT-DAY RESULT'} detail={tr ? 'Beklentiler ve mevcut koşullar sonucu değiştirebilir.' : 'Expectations and prevailing conditions can change the outcome.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'AKTARIM GECİKMELİ VE DEĞİŞKENDİR' : 'TRANSMISSION IS DELAYED AND VARIABLE'} detail={tr ? 'Politika bir düğme gibi mekanik çalışmaz.' : 'Policy does not work like a mechanical switch.'} />;
  return <Rule styles={styles} title={tr ? 'PARA POLİTİKASI = ZİNCİR + ZAMAN + BAĞLAM' : 'MONETARY POLICY = CHAIN + TIME + CONTEXT'} detail={tr ? 'Tek kararın etkisi ekonomi içinde aşamalarla yayılır.' : 'One decision spreads through the economy in stages.'} />;
}

function GrowthScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Ekonomi büyüdü: ne büyüdü?' : 'The economy grew: what grew?'} detail={tr ? 'GSYH toplam üretim faaliyetini ölçmeye çalışır.' : 'GDP seeks to measure aggregate production activity.'} /><OutputBars styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Reel büyüme fiyat etkisini ayırmaya çalışır' : 'Real growth seeks to separate price effects'} detail={tr ? 'Üretim miktarındaki değişimi daha net görmek için.' : 'To better see changes in production volume.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'NOMİNAL' : 'NOMINAL'} value={tr ? 'FİYAT + MİKTAR' : 'PRICE + VOLUME'} /><Card styles={styles} label={tr ? 'REEL' : 'REAL'} value={tr ? 'MİKTAR ODAKLI' : 'VOLUME FOCUS'} tone="success" /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Toplam büyüme herkese eşit dağılır mı?' : 'Is aggregate growth shared equally?'} detail={tr ? 'GSYH dağılımı tek başına açıklamaz.' : 'GDP alone does not describe distribution.'} /><View style={styles.row}><Card styles={styles} label="GDP" value="+4%" tone="success" /><Card styles={styles} label={tr ? 'HERKESİN GELİRİ' : 'EVERYONE INCOME'} value="?" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'GSYH ↑ ≠ HERKESİN GELİRİ AYNI ORANDA ↑' : 'GDP ↑ ≠ EVERYONE’S INCOME ↑ EQUALLY'} detail={tr ? 'Toplam üretim ile dağılım farklı kavramlardır.' : 'Aggregate production and distribution are different concepts.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'TEK ÇEYREK ≠ YAPISAL TREND' : 'ONE QUARTER ≠ STRUCTURAL TREND'} detail={tr ? 'Baz etkileri ve revizyonlar yorumu değiştirebilir.' : 'Base effects and revisions can change interpretation.'} />;
  return <Rule styles={styles} title={tr ? 'GSYH = TOPLAM ÜRETİM FAALİYETİ GÖSTERGESİ' : 'GDP = AGGREGATE OUTPUT MEASURE'} detail={tr ? 'Refahın bütün boyutlarını tek başına ölçmez.' : 'It does not capture every dimension of well-being.'} />;
}

function CycleScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Bir zayıf çeyrek = resesyon?' : 'One weak quarter = recession?'} detail={tr ? 'Tek veri noktası her durumda yeterli değildir.' : 'One data point is not always enough.'} /><CycleBars styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Genişleme → tepe → daralma → toparlanma' : 'Expansion → peak → contraction → recovery'} detail={tr ? 'Ekonomik faaliyet zaman içinde hızlanıp yavaşlayabilir.' : 'Economic activity can accelerate and slow over time.'} /><CycleBars styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Resesyonda üç boyuta bak' : 'Use three dimensions when assessing recession'} detail={tr ? 'Süre · Yaygınlık · Derinlik' : 'Duration · Breadth · Depth'} /><View style={styles.three}><Card styles={styles} label={tr ? 'SÜRE' : 'DURATION'} value="↔" /><Card styles={styles} label={tr ? 'YAYGINLIK' : 'BREADTH'} value="◎" /><Card styles={styles} label={tr ? 'DERİNLİK' : 'DEPTH'} value="↓" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? '2 NEGATİF ÇEYREK ≠ HER RESMÎ TANIM' : '2 NEGATIVE QUARTERS ≠ EVERY OFFICIAL DEFINITION'} detail={tr ? 'Bazı kurumlar daha geniş gösterge seti kullanır.' : 'Some institutions use a broader set of indicators.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'PİYASA DÜŞÜŞÜ ≠ OTOMATİK RESESYON' : 'MARKET DROP ≠ AUTOMATIC RECESSION'} detail={tr ? 'Finansal fiyatlarla ekonomik faaliyet aynı ölçüm değildir.' : 'Financial prices and economic activity are not the same measure.'} />;
  return <Rule styles={styles} title={tr ? 'DÖNGÜ = GENİŞLEME + DARALMA EVRELERİ' : 'CYCLE = EXPANSION + CONTRACTION PHASES'} detail={tr ? 'Resesyon değerlendirmesi tek sayıdan daha geniştir.' : 'Recession assessment is broader than one number.'} />;
}

function Basket({ styles, before, after }: { styles: ReturnType<typeof createStyles>; before: number; after: number }) {
  return <View style={styles.row}><ProductCard styles={styles} label="T0" count={before} /><Text style={styles.arrow}>→</Text><ProductCard styles={styles} label="T1" count={after} /></View>;
}

function ProductCard({ styles, label, count }: { styles: ReturnType<typeof createStyles>; label: string; count: number }) {
  return <View style={styles.card}><Text style={styles.cardLabel}>{label} · 100</Text><View style={styles.products}>{Array.from({ length: count }).map((_, index) => <View key={index} style={styles.product} />)}</View></View>;
}

function RateMeter({ styles, high }: { styles: ReturnType<typeof createStyles>; high: boolean }) {
  return <View style={styles.meter}><Text style={styles.cardLabel}>{high ? 'RATE ↑' : 'RATE ↓'}</Text><View style={styles.meterTrack}><View style={[styles.meterFill, { width: high ? '78%' : '32%' }]} /></View><Text style={[styles.cardValue, high ? styles.warning : styles.success]}>{high ? 'COST ↑' : 'COST ↓'}</Text></View>;
}

function Hub({ styles, tr }: { styles: ReturnType<typeof createStyles>; tr: boolean }) {
  return <View style={styles.hub}><View style={styles.hubCenter}><Text style={styles.hubCenterText}>{tr ? 'MERKEZ\nBANKASI' : 'CENTRAL\nBANK'}</Text></View><View style={styles.hubItems}><Card styles={styles} label={tr ? 'FAİZ' : 'RATES'} value="↕" /><Card styles={styles} label={tr ? 'LİKİDİTE' : 'LIQUIDITY'} value="↕" /><Card styles={styles} label={tr ? 'İLETİŞİM' : 'GUIDANCE'} value="→" /></View></View>;
}

function PolicyFlow({ styles, tr }: { styles: ReturnType<typeof createStyles>; tr: boolean }) {
  const steps = tr ? ['FAİZ', 'FİNANS', 'HARCAMA', 'TALEP', 'FİYAT'] : ['RATE', 'FINANCE', 'SPEND', 'DEMAND', 'PRICES'];
  return <View style={styles.policyFlow}>{steps.map((step, index) => <React.Fragment key={step}><View style={styles.flowNode}><Text style={styles.flowNodeText}>{step}</Text></View>{index < steps.length - 1 ? <Text style={styles.flowArrow}>→</Text> : null}</React.Fragment>)}</View>;
}

function OutputBars({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.outputBars}>{[38, 50, 61, 74, 86].map((height, index) => <View key={index} style={[styles.outputBar, { height }]} />)}</View>;
}

function CycleBars({ styles }: { styles: ReturnType<typeof createStyles> }) {
  const heights = [30, 46, 65, 82, 70, 52, 35, 48, 64];
  return <View style={styles.outputBars}>{heights.map((height, index) => <View key={index} style={[styles.cycleBar, { height }, index >= 4 && index <= 6 && styles.cycleDown]} />)}</View>;
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 14, padding: 14 },
  header: { gap: 4 },
  title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' },
  detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  three: { flexDirection: 'row', gap: 8 },
  arrow: { color: theme.colors.textMuted, fontSize: 20, fontWeight: '900', alignSelf: 'center' },
  success: { color: theme.colors.success },
  warning: { color: theme.colors.warning },
  risk: { color: theme.colors.risk },
  card: { flex: 1, minHeight: 84, justifyContent: 'center', gap: 7, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  cardLabel: { color: theme.colors.textMuted, fontSize: 9, lineHeight: 12, fontWeight: '900', letterSpacing: 0.45, textAlign: 'center' },
  cardValue: { color: theme.colors.text, fontSize: 13, lineHeight: 18, fontWeight: '900', textAlign: 'center' },
  rule: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(45,212,191,0.22)', backgroundColor: 'rgba(45,212,191,0.06)' },
  ruleWarning: { borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' },
  ruleTitle: { color: theme.colors.primary, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
  ruleDetail: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  products: { minHeight: 48, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 5 },
  product: { width: 18, height: 18, borderRadius: 5, backgroundColor: 'rgba(45,212,191,0.24)', borderWidth: 1, borderColor: 'rgba(45,212,191,0.38)' },
  meter: { minHeight: 112, justifyContent: 'center', gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  meterTrack: { height: 10, overflow: 'hidden', borderRadius: 5, backgroundColor: theme.colors.background },
  meterFill: { height: 10, borderRadius: 5, backgroundColor: theme.colors.warning },
  hub: { minHeight: 124, flexDirection: 'row', alignItems: 'center', gap: 10 },
  hubCenter: { width: 88, height: 88, alignItems: 'center', justifyContent: 'center', borderRadius: 44, borderWidth: 1, borderColor: 'rgba(45,212,191,0.38)', backgroundColor: 'rgba(45,212,191,0.08)' },
  hubCenterText: { color: theme.colors.primary, fontSize: 10, lineHeight: 14, fontWeight: '900', textAlign: 'center' },
  hubItems: { flex: 1, gap: 6 },
  policyFlow: { minHeight: 110, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  flowNode: { minWidth: 45, paddingHorizontal: 6, paddingVertical: 14, borderRadius: 9, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  flowNodeText: { color: theme.colors.text, fontSize: 8, fontWeight: '900', textAlign: 'center' },
  flowArrow: { color: theme.colors.textMuted, fontSize: 13, fontWeight: '900' },
  outputBars: { minHeight: 116, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  outputBar: { width: 24, borderRadius: 6, backgroundColor: 'rgba(45,212,191,0.28)' },
  cycleBar: { width: 18, borderRadius: 5, backgroundColor: 'rgba(45,212,191,0.28)' },
  cycleDown: { backgroundColor: 'rgba(251,113,133,0.24)' },
});
