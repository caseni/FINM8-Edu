import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'growth' | 'perShare' | 'multiples' | 'dcf' | 'peers' | 'limits';

export interface FundamentalAnalysisExpansionSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('buyume-kalitesi-nasil-okunur')) return 'growth';
  if (assetRef.includes('hisse-basina-metrikler-neden-onemlidir')) return 'perShare';
  if (assetRef.includes('degerleme-carpanlari-nasil-okunur')) return 'multiples';
  if (assetRef.includes('dcf-mantigi-nedir')) return 'dcf';
  if (assetRef.includes('benzer-sirket-karsilastirmasi-nasil-yapilir')) return 'peers';
  if (assetRef.includes('temel-analizin-sinirlari')) return 'limits';
  return undefined;
}

export function isFundamentalAnalysisExpansionSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function FundamentalAnalysisExpansionSlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: FundamentalAnalysisExpansionSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';
  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'growth' ? <GrowthScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'perShare' ? <PerShareScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'multiples' ? <MultiplesScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'dcf' ? <DcfScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'peers' ? <PeersScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'limits' ? <LimitsScene role={role} tr={tr} styles={styles} /> : null}
      </View>
    </View>
  );
}

type SceneProps = { role: SlideRole; tr: boolean; styles: ReturnType<typeof createStyles> };
const Header = ({ styles, title, detail }: { styles: ReturnType<typeof createStyles>; title: string; detail: string }) => <View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>;
const Rule = ({ styles, title, detail, warning = false }: { styles: ReturnType<typeof createStyles>; title: string; detail: string; warning?: boolean }) => <View style={[styles.rule, warning && styles.ruleWarning]}><Text style={[styles.ruleTitle, warning && styles.warning]}>{title}</Text><Text style={styles.ruleDetail}>{detail}</Text></View>;
const Card = ({ styles, label, value, tone = 'neutral' }: { styles: ReturnType<typeof createStyles>; label: string; value: string; tone?: 'neutral' | 'success' | 'warning' | 'risk' }) => <View style={styles.card}><Text style={styles.cardLabel}>{label}</Text><Text style={[styles.cardValue, tone === 'success' ? styles.success : tone === 'warning' ? styles.warning : tone === 'risk' ? styles.risk : undefined]}>{value}</Text></View>;

function GrowthScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? '%25 = aynı kalite mi?' : '25% = same quality?'} detail={tr ? 'Büyümenin kaynağı ve nakde dönüşümü farklı olabilir.' : 'Growth source and cash conversion can differ.'} /><View style={styles.row}><GrowthCard styles={styles} label="A" price="+5" volume="+20" cash="+18" /><GrowthCard styles={styles} label="B" price="+22" volume="+3" cash="−4" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Oran + kaynak + kalite' : 'Rate + source + quality'} detail={tr ? 'Fiyat · hacim · satın alma · marj · nakit' : 'Price · volume · acquisition · margin · cash'} /><View style={styles.grid}><Chip styles={styles} text={tr ? 'HACİM' : 'VOLUME'} /><Chip styles={styles} text={tr ? 'FİYAT' : 'PRICE'} /><Chip styles={styles} text={tr ? 'MARJ' : 'MARGIN'} /><Chip styles={styles} text={tr ? 'NAKİT' : 'CASH'} /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Büyüme güçlü, nakit zayıf' : 'Strong growth, weak cash'} detail={tr ? 'Nedenini ayrıca incele.' : 'Investigate the reason separately.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'GELİR' : 'REVENUE'} value="+28%" tone="success" /><Card styles={styles} label={tr ? 'İŞL. NAKİT' : 'OPERATING CASH'} value="−8%" tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'EN HIZLI BÜYÜYEN ≠ EN KALİTELİ' : 'FASTEST GROWTH ≠ HIGHEST QUALITY'} detail={tr ? 'Kaynak, marj ve nakit dönüşümünü kontrol et.' : 'Check source, margins, and cash conversion.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'GEÇİCİ BÜYÜME ETKİLERİ' : 'TEMPORARY GROWTH EFFECTS'} detail={tr ? 'Kur, satın alma veya baz etkisini ayır.' : 'Separate FX, acquisitions, and base effects.'} />;
  return <Rule styles={styles} title={tr ? 'BÜYÜME = ORAN + KAYNAK + NAKİT' : 'GROWTH = RATE + SOURCE + CASH'} detail={tr ? 'Sürdürülebilirliği bu üçlüyle sorgula.' : 'Use all three to question durability.'} />;
}

function PerShareScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Kâr ↑ ama EPS ↓ olabilir mi?' : 'Profit ↑ while EPS ↓?'} detail={tr ? 'Hisse sayısı daha hızlı artabilir.' : 'Share count can rise faster.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'NET KÂR' : 'NET INCOME'} value="+10%" tone="success" /><Card styles={styles} label={tr ? 'HİSSE SAYISI' : 'SHARES'} value="+20%" tone="warning" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title="EPS = EARNINGS / SHARES" detail={tr ? 'Toplam sonucu pay başına çevirir.' : 'Converts total earnings into a per-share measure.'} /><ShareSplit styles={styles} shares={5} /><ShareSplit styles={styles} shares={9} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Seyrelme etkisi' : 'Dilution effect'} detail={tr ? 'Aynı ekonomik pasta daha fazla paya bölünebilir.' : 'The same economic pie can be split across more shares.'} /><View style={styles.flow}><Card styles={styles} label={tr ? 'KÂR' : 'EARNINGS'} value="100" /><Text style={styles.arrow}>÷</Text><Card styles={styles} label={tr ? 'HİSSE' : 'SHARES'} value="↑" tone="warning" /><Text style={styles.arrow}>→</Text><Card styles={styles} label="EPS" value="↓" tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'TOPLAM KÂR ↑ ≠ EPS ↑' : 'TOTAL PROFIT ↑ ≠ EPS ↑'} detail={tr ? 'Hisse sayısını ve diluted share count’u kontrol et.' : 'Check share count and diluted share count.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'GERİ ALIM DA BAĞLAM İSTER' : 'BUYBACKS ALSO NEED CONTEXT'} detail={tr ? 'Fiyat, finansman ve fırsat maliyeti önemlidir.' : 'Price, financing, and opportunity cost matter.'} />;
  return <Rule styles={styles} title={tr ? 'ŞİRKET TOPLAMI + PAY BAŞINA SONUÇ' : 'COMPANY TOTAL + PER-SHARE RESULT'} detail={tr ? 'İkisini birlikte izle.' : 'Track both.'} />;
}

function MultiplesScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? '8x kesin ucuz, 25x kesin pahalı?' : '8x certainly cheap, 25x certainly expensive?'} detail={tr ? 'Çarpan bağlam olmadan hüküm vermez.' : 'A multiple does not judge value without context.'} /><View style={styles.row}><Card styles={styles} label="A · P/E" value="8x" tone="success" /><Card styles={styles} label="B · P/E" value="25x" tone="warning" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Değer / finansal ölçü' : 'Value / financial measure'} detail={tr ? 'P/E ve EV/EBITDA farklı paydaları kullanır.' : 'P/E and EV/EBITDA use different denominators.'} /><View style={styles.row}><Card styles={styles} label="P/E" value="EQUITY / EARNINGS" /><Card styles={styles} label="EV/EBITDA" value="EV / EBITDA" /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Çarpanı açıklayan farklar' : 'What explains multiple differences?'} detail={tr ? 'Büyüme · marj · risk · sermaye ihtiyacı' : 'Growth · margin · risk · capital needs'} /><View style={styles.grid}><Chip styles={styles} text={tr ? 'BÜYÜME' : 'GROWTH'} /><Chip styles={styles} text={tr ? 'MARJ' : 'MARGIN'} /><Chip styles={styles} text={tr ? 'RİSK' : 'RISK'} /><Chip styles={styles} text={tr ? 'SERMAYE' : 'CAPITAL'} /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'DÜŞÜK ÇARPAN ≠ OTOMATİK UCUZ' : 'LOW MULTIPLE ≠ AUTOMATICALLY CHEAP'} detail={tr ? 'Risk ve düşen kâr beklentisi de fiyatlanıyor olabilir.' : 'Risk or falling earnings expectations may be priced in.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'PAYDAYI KONTROL ET' : 'CHECK THE DENOMINATOR'} detail={tr ? 'Negatif veya döngüsel kâr çarpanı bozabilir.' : 'Negative or cyclical earnings can distort multiples.'} />;
  return <Rule styles={styles} title={tr ? 'ÇARPAN = KARŞILAŞTIRMA ARACI' : 'MULTIPLE = COMPARISON TOOL'} detail={tr ? 'Karar veya kesin değer değildir.' : 'Not a decision or certain value.'} />;
}

function DcfScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? '10 yıl sonraki 100 = bugünkü 100?' : '100 in ten years = 100 today?'} detail={tr ? 'Zaman ve risk bugünkü değeri değiştirir.' : 'Time and risk change present value.'} /><Timeline styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Gelecek nakit → bugünkü değer' : 'Future cash → present value'} detail={tr ? 'Nakit akışlarını iskonto oranıyla bugüne getir.' : 'Discount future cash flows back to today.'} /><Timeline styles={styles} labels /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'İskonto oranı ↑' : 'Discount rate ↑'} detail={tr ? 'Diğer her şey aynıyken bugünkü değer genellikle ↓' : 'All else equal, present value generally ↓'} /><View style={styles.flow}><Card styles={styles} label={tr ? 'İSKONTO' : 'DISCOUNT'} value="↑" tone="warning" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'BUGÜNKÜ DEĞER' : 'PRESENT VALUE'} value="↓" tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'DCF ÇIKTISI ≠ GERÇEK DEĞER' : 'DCF OUTPUT ≠ TRUE VALUE'} detail={tr ? 'Sonuç varsayımlara bağlıdır.' : 'The result depends on assumptions.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'HASSASİYETİ TEST ET' : 'TEST SENSITIVITY'} detail={tr ? 'Büyüme, marj, terminal değer ve iskonto oranını değiştir.' : 'Vary growth, margins, terminal value, and discount rate.'} />;
  return <Rule styles={styles} title={tr ? 'NAKİT + ZAMAN + RİSK + VARSAYIM' : 'CASH + TIME + RISK + ASSUMPTIONS'} detail={tr ? 'DCF’nin temel mantığı.' : 'The core logic of DCF.'} />;
}

function PeersScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Aynı sektör = iyi peer?' : 'Same sector = good peer?'} detail={tr ? 'İş modeli ve finansallar farklı olabilir.' : 'Business models and financials can differ.'} /><PeerMatrix styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Benzerlik filtresi' : 'Comparability filter'} detail={tr ? 'İş modeli · büyüme · marj · borç · coğrafya' : 'Business model · growth · margin · debt · geography'} /><PeerMatrix styles={styles} labels /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Aynı P/E, farklı şirket' : 'Same P/E, different company'} detail={tr ? 'Çarpanı açıklayan ekonomik farkları bul.' : 'Find the economic differences behind the multiple.'} /><View style={styles.row}><Card styles={styles} label="A" value="P/E 16x" /><Card styles={styles} label="B" value="P/E 16x" /><Text style={styles.notEqual}>≠</Text></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'SEKTÖR KODU ≠ EŞDEĞER ŞİRKET' : 'SECTOR CODE ≠ EQUIVALENT COMPANY'} detail={tr ? 'Karşılaştırılabilirliği ayrıca kontrol et.' : 'Assess comparability separately.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'MUHASEBE VE DÖNGÜ FARKLARI' : 'ACCOUNTING AND CYCLE DIFFERENCES'} detail={tr ? 'Ham peer çarpanını yanıltabilir.' : 'Can distort raw peer multiples.'} />;
  return <Rule styles={styles} title={tr ? 'PEER = BENZERLİK + AÇIK FARKLAR' : 'PEER = SIMILARITY + EXPLICIT DIFFERENCES'} detail={tr ? 'İyi karşılaştırmanın temeli.' : 'The basis of a useful comparison.'} />;
}

function LimitsScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'İyi şirket = her fiyattan iyi yatırım?' : 'Good company = good investment at any price?'} detail={tr ? 'Kalite ile ödenen fiyat farklı boyutlardır.' : 'Quality and price paid are different dimensions.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'ŞİRKET KALİTESİ' : 'QUALITY'} value="HIGH" tone="success" /><Card styles={styles} label={tr ? 'FİYAT/BEKLENTİ' : 'PRICE/EXPECT.'} value="?" tone="warning" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Üç belirsizlik katmanı' : 'Three uncertainty layers'} detail={tr ? 'Geçmiş veri · gelecek tahmini · değerleme varsayımı' : 'Historical data · forecast · valuation assumption'} /><View style={styles.three}><Card styles={styles} label={tr ? 'RAPOR' : 'REPORT'} value={tr ? 'GEÇMİŞ' : 'PAST'} /><Card styles={styles} label={tr ? 'TAHMİN' : 'FORECAST'} value="?" /><Card styles={styles} label={tr ? 'DEĞER' : 'VALUE'} value={tr ? 'ARALIK' : 'RANGE'} /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Güçlü finansal + yüksek beklenti' : 'Strong financials + high expectations'} detail={tr ? 'Şirket kalitesini fiyatlama koşulundan ayır.' : 'Separate business quality from what is already priced in.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'FİNANSAL' : 'FINANCIALS'} value="STRONG" tone="success" /><Card styles={styles} label={tr ? 'BEKLENTİ' : 'EXPECTATIONS'} value="HIGH" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'GÜÇLÜ TEMEL ≠ FİYAT KESİN YÜKSELİR' : 'STRONG FUNDAMENTALS ≠ PRICE MUST RISE'} detail={tr ? 'Beklentiler ve ödenen fiyat sonucu etkiler.' : 'Expectations and price paid affect outcomes.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'MODEL RİSKİ' : 'MODEL RISK'} detail={tr ? 'Tahmin, muhasebe ve rejim değişimi sonuçları bozabilir.' : 'Forecast, accounting, and regime changes can alter conclusions.'} />;
  return <Rule styles={styles} title={tr ? 'ANLA · DEĞERLENDİR · BELİRSİZLİĞİ KORU' : 'UNDERSTAND · VALUE · KEEP UNCERTAINTY'} detail={tr ? 'Temel analizin sağlıklı sınırı.' : 'A healthy boundary for fundamental analysis.'} />;
}

function GrowthCard({ styles, label, price, volume, cash }: { styles: ReturnType<typeof createStyles>; label: string; price: string; volume: string; cash: string }) { return <View style={styles.card}><Text style={styles.cardLabel}>{label}</Text><Text style={styles.cardValue}>GROWTH 25%</Text><Text style={styles.meta}>PRICE {price} · VOL {volume} · CASH {cash}</Text></View>; }
function ShareSplit({ styles, shares }: { styles: ReturnType<typeof createStyles>; shares: number }) { return <View style={styles.shareRow}><Text style={styles.shareLabel}>100</Text><Text style={styles.arrow}>÷</Text><View style={styles.dots}>{Array.from({ length: shares }).map((_, i) => <View key={i} style={styles.dot} />)}</View><Text style={styles.arrow}>→</Text><Text style={styles.shareLabel}>{(100 / shares).toFixed(1)}</Text></View>; }
function Timeline({ styles, labels = false }: { styles: ReturnType<typeof createStyles>; labels?: boolean }) { const vals = [100, 86, 74, 63]; return <View style={styles.timeline}>{vals.map((v, i) => <View key={i} style={styles.timeNode}><Text style={styles.timeValue}>{v}</Text><Text style={styles.meta}>{labels ? (i === 0 ? 'FUTURE' : `PV-${i}`) : `Y${i + 1}`}</Text></View>)}</View>; }
function PeerMatrix({ styles, labels = false }: { styles: ReturnType<typeof createStyles>; labels?: boolean }) { return <View style={styles.peerMatrix}>{['A','B','C'].map((p, i) => <View key={p} style={styles.peerRow}><Text style={styles.peerName}>{p}</Text><Text style={styles.meta}>{labels ? ['GROWTH','MARGIN','DEBT'][i] : ['18% · 22% · LOW','7% · 11% · HIGH','21% · 20% · MED'][i]}</Text></View>)}</View>; }
function Chip({ styles, text }: { styles: ReturnType<typeof createStyles>; text: string }) { return <View style={styles.chip}><Text style={styles.chipText}>{text}</Text></View>; }

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 14, padding: 14 }, header: { gap: 4 }, title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' }, detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 }, three: { flexDirection: 'row', gap: 8 }, flow: { flexDirection: 'row', alignItems: 'center', gap: 7 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: { flex: 1, minHeight: 76, justifyContent: 'center', gap: 5, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }, cardLabel: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '900' }, cardValue: { color: theme.colors.text, fontSize: 12, fontWeight: '900' }, meta: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '800' },
  rule: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(45,212,191,0.22)', backgroundColor: 'rgba(45,212,191,0.06)' }, ruleWarning: { borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' }, ruleTitle: { color: theme.colors.primary, fontSize: 17, lineHeight: 22, fontWeight: '900', textAlign: 'center' }, ruleDetail: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  success: { color: theme.colors.success }, warning: { color: theme.colors.warning }, risk: { color: theme.colors.risk }, arrow: { color: theme.colors.textMuted, fontSize: 18, fontWeight: '900' }, notEqual: { color: theme.colors.warning, fontSize: 22, fontWeight: '900' },
  chip: { width: '47%', minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }, chipText: { color: theme.colors.text, fontSize: 9, fontWeight: '900' },
  shareRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 10, backgroundColor: theme.colors.surfaceMuted }, dots: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 4 }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary }, shareLabel: { color: theme.colors.text, fontSize: 12, fontWeight: '900' },
  timeline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 }, timeNode: { flex: 1, minHeight: 68, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }, timeValue: { color: theme.colors.primary, fontSize: 15, fontWeight: '900' },
  peerMatrix: { gap: 7 }, peerRow: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, borderRadius: 9, backgroundColor: theme.colors.surfaceMuted }, peerName: { width: 28, color: theme.colors.primary, fontSize: 12, fontWeight: '900' },
});
