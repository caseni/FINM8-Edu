import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'exchange' | 'index' | 'etf' | 'bond' | 'forex' | 'commodity';

export interface FinancialMarketsSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('borsa-ve-islem-yeri-nedir')) return 'exchange';
  if (assetRef.includes('borsa-endeksi-ne-anlatir')) return 'index';
  if (assetRef.includes('etf-nedir-nasil-calisir')) return 'etf';
  if (assetRef.includes('tahvil-fiyati-ve-getirisi')) return 'bond';
  if (assetRef.includes('forex-piyasasi-nasil-calisir')) return 'forex';
  if (assetRef.includes('emtia-piyasalari-nasil-calisir')) return 'commodity';
  return undefined;
}

export function isFinancialMarketsSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function FinancialMarketsSlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: FinancialMarketsSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'exchange' ? <ExchangeScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'index' ? <IndexScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'etf' ? <EtfScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'bond' ? <BondScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'forex' ? <ForexScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'commodity' ? <CommodityScene role={role} tr={tr} styles={styles} /> : null}
      </View>
    </View>
  );
}

type SceneProps = { role: SlideRole; tr: boolean; styles: ReturnType<typeof createStyles> };

function Header({ styles, title, detail }: { styles: ReturnType<typeof createStyles>; title: string; detail: string }) {
  return <View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>;
}

function Card({ styles, label, value, tone = 'neutral' }: { styles: ReturnType<typeof createStyles>; label: string; value: string; tone?: 'neutral' | 'success' | 'warning' | 'risk' }) {
  return <View style={styles.card}><Text style={styles.cardLabel}>{label}</Text><Text style={[styles.cardValue, tone === 'success' ? styles.success : tone === 'warning' ? styles.warning : tone === 'risk' ? styles.risk : undefined]}>{value}</Text></View>;
}

function Rule({ styles, title, detail, warning = false }: { styles: ReturnType<typeof createStyles>; title: string; detail: string; warning?: boolean }) {
  return <View style={[styles.rule, warning && styles.ruleWarning]}><Text style={[styles.ruleTitle, warning && styles.warning]}>{title}</Text><Text style={styles.ruleDetail}>{detail}</Text></View>;
}

function ExchangeScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Emrin nereye gider?' : 'Where does your order go?'} detail={tr ? 'İşlem yeri alıcı ve satıcı emirlerini kurallar altında buluşturur.' : 'A trading venue brings buyer and seller orders together under rules.'} /><VenueFlow styles={styles} tr={tr} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Emir → İşlem yeri → Eşleşme' : 'Order → Venue → Match'} detail={tr ? 'Fiyat, katılımcı emirlerinin eşleşmesiyle keşfedilir.' : 'Price is discovered as participant orders match.'} /><VenueFlow styles={styles} tr={tr} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Piyasalar aynı altyapıya sahip değildir' : 'Markets do not share one identical structure'} detail={tr ? 'Borsa, dealer ve OTC yapıları farklı olabilir.' : 'Exchange, dealer, and OTC structures can differ.'} /><View style={styles.row}><Card styles={styles} label="EXCHANGE" value={tr ? 'MERKEZİ' : 'CENTRAL'} /><Card styles={styles} label="OTC" value={tr ? 'DAĞINIK' : 'DECENTRAL'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'BORSA FİYATI SEÇMEZ' : 'THE EXCHANGE DOES NOT PICK THE PRICE'} detail={tr ? 'Altyapı ve kuralları sağlar; fiyat keşfi emirlerle oluşur.' : 'It provides rules and infrastructure; orders drive price discovery.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'İŞLEM YERİ DEĞİŞİRSE KURALLAR DA DEĞİŞEBİLİR' : 'VENUE CHANGES CAN CHANGE RULES'} detail={tr ? 'Saat, erişim, şeffaflık ve gerçekleşme koşullarını kontrol et.' : 'Check hours, access, transparency, and execution conditions.'} />;
  return <Rule styles={styles} title={tr ? 'İŞLEM YERİ = KURALLI EŞLEŞME ALTYAPISI' : 'VENUE = RULE-BASED MATCHING INFRASTRUCTURE'} detail={tr ? 'Fiyatı tek başına belirleyen merkez değildir.' : 'It is not a central authority that chooses prices.'} />;
}

function IndexScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Endeks ↑ ama bazı hisseler ↓ olabilir' : 'Index ↑ while some stocks ↓'} detail={tr ? 'Bileşen ağırlıkları toplam sonucu değiştirir.' : 'Constituent weights shape the total result.'} /><IndexWeights styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Birçok bileşen → tek özet değer' : 'Many constituents → one summary measure'} detail={tr ? 'Dahil etme ve ağırlıklandırma kuralları önemlidir.' : 'Inclusion and weighting rules matter.'} /><IndexWeights styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Ağırlık sonucu değiştirir' : 'Weighting changes the result'} detail={tr ? 'Büyük ağırlıklı şirket küçükleri baskınlaştırabilir.' : 'A heavily weighted company can dominate smaller constituents.'} /><View style={styles.row}><Card styles={styles} label="A · 40%" value="+3" tone="success" /><Card styles={styles} label="B · 10%" value="−2" tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'ENDEKS ↑ ≠ HER BİLEŞEN ↑' : 'INDEX ↑ ≠ EVERY CONSTITUENT ↑'} detail={tr ? 'Endeks tek bir özet ölçüdür.' : 'An index is one summary measure.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'METODOLOJİYİ BİLMEDEN ENDEKSİ YORUMLAMA' : 'KNOW THE INDEX METHODOLOGY'} detail={tr ? 'Ağırlık, yeniden dengeleme ve temettü yaklaşımı sonucu etkiler.' : 'Weighting, rebalancing, and dividend treatment matter.'} />;
  return <Rule styles={styles} title={tr ? 'ENDEKS = SEÇİLMİŞ GRUBUN ÖZETİ' : 'INDEX = SUMMARY OF A SELECTED GROUP'} detail={tr ? 'İçindeki varlıkların aynı davranmasını gerektirmez.' : 'Its constituents do not need to behave identically.'} />;
}

function EtfScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Tek pay, bir sepet maruziyeti' : 'One share, basket exposure'} detail={tr ? 'ETF payı altında birçok varlık bulunabilir.' : 'One ETF share can represent exposure to many assets.'} /><EtfBasket styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title="ETF" detail={tr ? 'Borsada işlem gören fon payı → izlenen sepet veya strateji' : 'Exchange-traded fund share → tracked basket or strategy'} /><EtfBasket styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'ETF etiketine değil içeriğine bak' : 'Look through the ETF label'} detail={tr ? 'Hisse, tahvil, emtia veya yoğun tek sektör olabilir.' : 'Exposure may be equities, bonds, commodities, or a concentrated sector.'} /><View style={styles.row}><Card styles={styles} label="ETF A" value={tr ? '500 HİSSE' : '500 STOCKS'} tone="success" /><Card styles={styles} label="ETF B" value={tr ? '1 SEKTÖR' : '1 SECTOR'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'ETF ≠ OTOMATİK DÜŞÜK RİSK' : 'ETF ≠ AUTOMATICALLY LOW RISK'} detail={tr ? 'Risk, izlenen varlıklara ve ürün yapısına bağlıdır.' : 'Risk depends on underlying exposure and structure.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'FİYAT ≠ NAV HER AN TAM EŞİT' : 'MARKET PRICE ≠ NAV AT EVERY MOMENT'} detail={tr ? 'Spread, likidite ve takip farkını kontrol et.' : 'Check spreads, liquidity, and tracking difference.'} />;
  return <Rule styles={styles} title={tr ? 'ETF = ERİŞİM ARACI · RİSK = İÇERİK + YAPI' : 'ETF = ACCESS VEHICLE · RISK = EXPOSURE + STRUCTURE'} detail={tr ? 'Önce neyi izlediğini öğren.' : 'Start by understanding what it tracks.'} />;
}

function BondScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Fiyat ↓, getiri ↑ nasıl olur?' : 'How can price ↓ while yield ↑?'} detail={tr ? 'Aynı nakit akışını daha düşük fiyattan almak getiriyi yükseltebilir.' : 'Buying the same cash flows more cheaply can raise yield.'} /><BondInverse styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Sabit kupon · Değişen piyasa fiyatı' : 'Fixed coupon · Changing market price'} detail={tr ? 'Bu yüzden fiyat ve piyasa getirisi genellikle ters hareket eder.' : 'That is why price and market yield generally move inversely.'} /><BondInverse styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Aynı 5 kupon, farklı alış fiyatı' : 'Same coupon, different purchase price'} detail={tr ? 'Daha düşük fiyat yeni alıcının getirisini artırabilir.' : 'A lower price can raise the new buyer’s yield.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'FİYAT 100' : 'PRICE 100'} value="YIELD 5" /><Card styles={styles} label={tr ? 'FİYAT 90' : 'PRICE 90'} value="YIELD ↑" tone="success" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? '“SABİT GETİRİ” ≠ SABİT PİYASA FİYATI' : '“FIXED INCOME” ≠ FIXED MARKET PRICE'} detail={tr ? 'Faiz, vade ve kredi riski fiyatı değiştirebilir.' : 'Rates, maturity, and credit risk can move the price.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'YIELD ≠ GARANTİLİ GERÇEKLEŞEN GETİRİ' : 'YIELD ≠ GUARANTEED REALIZED RETURN'} detail={tr ? 'Kredi, yeniden yatırım ve satış zamanı önemlidir.' : 'Credit, reinvestment, and sale timing matter.'} />;
  return <Rule styles={styles} title={tr ? 'TAHVİL FİYATI ↕ · PİYASA GETİRİSİ ↕ TERS YÖN' : 'BOND PRICE ↕ · MARKET YIELD ↕ INVERSE'} detail={tr ? 'Sabit kuponlu tahviller için temel ilişki.' : 'A core relationship for fixed-coupon bonds.'} />;
}

function ForexScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'EUR/USD = iki taraflı fiyat' : 'EUR/USD = a two-sided relative price'} detail={tr ? 'Euro baz, dolar karşıt para birimidir.' : 'Euro is the base; dollar is the quote currency.'} /><ForexPair styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Birini alırken diğerine göre değer biçersin' : 'One currency is valued relative to the other'} detail={tr ? 'Kur tek başına mutlak değer değildir.' : 'An exchange rate is not an absolute value.'} /><ForexPair styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title="EUR/USD ↑" detail={tr ? 'Euro dolar karşısında göreli olarak güçlenmiştir.' : 'The euro has strengthened relative to the dollar.'} /><View style={styles.row}><Card styles={styles} label="EUR" value="↑" tone="success" /><Card styles={styles} label="USD" value={tr ? 'GÖRELİ' : 'RELATIVE'} /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? '“EURO YÜKSELDİ” TEK BAŞINA EKSİK' : '“EURO ROSE” IS INCOMPLETE'} detail={tr ? 'Hangi para birimine göre olduğunu belirt.' : 'State the currency it strengthened against.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'FOREX = SPOT, FORWARD, SWAP, FUTURES AYNI DEĞİL' : 'SPOT, FORWARDS, SWAPS, FUTURES DIFFER'} detail={tr ? 'Kaldıraç ve finansman yapısını ürün bazında kontrol et.' : 'Check leverage and financing by product.'} />;
  return <Rule styles={styles} title={tr ? 'FOREX = İKİ PARA ARASINDA GÖRELİ FİYAT' : 'FOREX = RELATIVE PRICE BETWEEN TWO CURRENCIES'} detail={tr ? 'Her pozisyon iki taraflıdır.' : 'Every quote has two sides.'} />;
}

function CommodityScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Petrol grafiği = fiziksel varil mi?' : 'Oil chart = physical barrel?'} detail={tr ? 'Spot, futures ve fon fiyatları farklı yapıları temsil edebilir.' : 'Spot, futures, and fund prices can represent different structures.'} /><CommodityLayers styles={styles} tr={tr} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Fiziksel → Spot → Futures' : 'Physical → Spot → Futures'} detail={tr ? 'Aynı emtiaya farklı piyasa yapılarıyla maruz kalabilirsin.' : 'The same commodity can be accessed through different market structures.'} /><CommodityLayers styles={styles} tr={tr} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Futures = vade + sözleşme koşulları' : 'Futures = maturity + contract terms'} detail={tr ? 'Fiziksel mala hemen sahip olmakla aynı değildir.' : 'It is not the same as immediate physical ownership.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'FİZİKSEL' : 'PHYSICAL'} value={tr ? 'MAL' : 'GOOD'} /><Card styles={styles} label="FUTURES" value={tr ? 'SÖZLEŞME' : 'CONTRACT'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'HER EMTİA FİYATI ≠ SPOT FİYAT' : 'EVERY COMMODITY QUOTE ≠ SPOT PRICE'} detail={tr ? 'Grafiğin hangi sözleşmeyi gösterdiğini kontrol et.' : 'Check which market or contract the chart represents.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'VADE EĞRİSİ VE TAŞIMA MALİYETİ ÖNEMLİ' : 'CURVE AND CARRY MATTER'} detail={tr ? 'Contango/backwardation tek başına yön sinyali değildir.' : 'Contango/backwardation is not a standalone direction signal.'} />;
  return <Rule styles={styles} title={tr ? 'EMTİA MARUZİYETİ = HANGİ PİYASA/YAPI?' : 'COMMODITY EXPOSURE = WHICH MARKET/STRUCTURE?'} detail={tr ? 'Spot, futures ve fonları birbirinden ayır.' : 'Separate spot, futures, and fund exposure.'} />;
}

function VenueFlow({ styles, tr }: { styles: ReturnType<typeof createStyles>; tr: boolean }) {
  return <View style={styles.flow}><Card styles={styles} label={tr ? 'ALICI' : 'BUYER'} value="BUY" /><Text style={styles.arrow}>→</Text><View style={styles.venue}><Text style={styles.venueText}>{tr ? 'İŞLEM\nYERİ' : 'VENUE'}</Text></View><Text style={styles.arrow}>←</Text><Card styles={styles} label={tr ? 'SATICI' : 'SELLER'} value="SELL" /></View>;
}

function IndexWeights({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.indexBars}>{[['A', 76, true], ['B', 52, true], ['C', 34, false], ['D', 22, false]].map(([label, height, up]) => <View key={String(label)} style={styles.indexColumn}><View style={[styles.indexBar, { height: Number(height) }, !up && styles.indexBarDown]} /><Text style={styles.cardLabel}>{String(label)}</Text></View>)}</View>;
}

function EtfBasket({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.etfWrap}><View style={styles.etfShare}><Text style={styles.etfText}>ETF</Text></View><Text style={styles.arrow}>→</Text><View style={styles.basket}>{['A', 'B', 'C', 'D', 'E', 'F'].map((item) => <View key={item} style={styles.assetDot}><Text style={styles.assetText}>{item}</Text></View>)}</View></View>;
}

function BondInverse({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.row}><Card styles={styles} label="PRICE" value="↓" tone="risk" /><View style={styles.inverse}><Text style={styles.inverseText}>↕</Text></View><Card styles={styles} label="YIELD" value="↑" tone="success" /></View>;
}

function ForexPair({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.fxPair}><View style={styles.currency}><Text style={styles.currencyText}>EUR</Text><Text style={styles.cardLabel}>BASE</Text></View><Text style={styles.fxSlash}>/</Text><View style={styles.currency}><Text style={styles.currencyText}>USD</Text><Text style={styles.cardLabel}>QUOTE</Text></View><Text style={styles.fxRate}>1.10</Text></View>;
}

function CommodityLayers({ styles, tr }: { styles: ReturnType<typeof createStyles>; tr: boolean }) {
  return <View style={styles.three}><Card styles={styles} label={tr ? 'FİZİKSEL' : 'PHYSICAL'} value="●" /><Card styles={styles} label="SPOT" value="NOW" /><Card styles={styles} label="FUTURES" value="T+" tone="warning" /></View>;
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 14, padding: 14 },
  header: { gap: 4 },
  title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' },
  detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'stretch', gap: 9 },
  three: { flexDirection: 'row', gap: 8 },
  flow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  arrow: { color: theme.colors.textMuted, fontSize: 18, fontWeight: '900', alignSelf: 'center' },
  card: { flex: 1, minWidth: 68, minHeight: 82, justifyContent: 'center', gap: 7, padding: 9, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  cardLabel: { color: theme.colors.textMuted, fontSize: 8, lineHeight: 11, fontWeight: '900', letterSpacing: 0.35, textAlign: 'center' },
  cardValue: { color: theme.colors.text, fontSize: 12, lineHeight: 17, fontWeight: '900', textAlign: 'center' },
  success: { color: theme.colors.success },
  warning: { color: theme.colors.warning },
  risk: { color: theme.colors.risk },
  rule: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(45,212,191,0.22)', backgroundColor: 'rgba(45,212,191,0.06)' },
  ruleWarning: { borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' },
  ruleTitle: { color: theme.colors.primary, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
  ruleDetail: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  venue: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(45,212,191,0.40)', backgroundColor: 'rgba(45,212,191,0.08)' },
  venueText: { color: theme.colors.primary, fontSize: 10, lineHeight: 14, fontWeight: '900', textAlign: 'center' },
  indexBars: { minHeight: 116, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 12, padding: 12, borderRadius: 12, backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border },
  indexColumn: { alignItems: 'center', gap: 4 },
  indexBar: { width: 28, borderRadius: 6, backgroundColor: 'rgba(45,212,191,0.28)' },
  indexBarDown: { backgroundColor: 'rgba(251,113,133,0.24)' },
  etfWrap: { minHeight: 112, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 },
  etfShare: { width: 68, height: 68, alignItems: 'center', justifyContent: 'center', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(45,212,191,0.42)', backgroundColor: 'rgba(45,212,191,0.08)' },
  etfText: { color: theme.colors.primary, fontSize: 16, fontWeight: '900' },
  basket: { width: 116, minHeight: 88, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 9, borderRadius: 14, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  assetDot: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: '#102033', borderWidth: 1, borderColor: '#294057' },
  assetText: { color: theme.colors.text, fontSize: 8, fontWeight: '900' },
  inverse: { width: 48, alignItems: 'center', justifyContent: 'center' },
  inverseText: { color: theme.colors.warning, fontSize: 26, fontWeight: '900' },
  fxPair: { minHeight: 112, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  currency: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(45,212,191,0.36)', backgroundColor: 'rgba(45,212,191,0.07)' },
  currencyText: { color: theme.colors.primary, fontSize: 13, fontWeight: '900' },
  fxSlash: { color: theme.colors.textMuted, fontSize: 22, fontWeight: '900' },
  fxRate: { color: theme.colors.text, fontSize: 14, fontWeight: '900' },
});
