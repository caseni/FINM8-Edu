import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type RiskSlideRole =
  | 'hook'
  | 'concept'
  | 'practice'
  | 'misconception'
  | 'risk'
  | 'summary';

type RiskTopic =
  | 'basics'
  | 'volatility'
  | 'positionSizing'
  | 'riskReward'
  | 'stopOrders'
  | 'diversification';

export interface RiskLessonSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: RiskSlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): RiskTopic | undefined {
  if (assetRef.includes('risk-belirsizlik-kayip')) return 'basics';
  if (assetRef.includes('volatilite-once-risktir') || assetRef.includes('volatility-range')) return 'volatility';
  if (assetRef.includes('pozisyon-buyuklugu')) return 'positionSizing';
  if (assetRef.includes('risk-getiri')) return 'riskReward';
  if (assetRef.includes('stop-emri')) return 'stopOrders';
  if (assetRef.includes('cok-varlik')) return 'diversification';
  return undefined;
}

export function isRiskLessonSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function RiskLessonSlideVisual({
  assetRef,
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: RiskLessonSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'basics' ? <RiskBasicsScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'volatility' ? <VolatilityScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'positionSizing' ? <PositionScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'riskReward' ? <RewardScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'stopOrders' ? <StopScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'diversification' ? <DiversificationScene role={role} tr={tr} styles={styles} /> : null}
      </View>
    </View>
  );
}

type SceneProps = {
  role: RiskSlideRole;
  tr: boolean;
  styles: ReturnType<typeof createStyles>;
};

function Header({ styles, title, detail }: { styles: ReturnType<typeof createStyles>; title: string; detail: string }) {
  return <View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>;
}

function Rule({ styles, title, detail, warning = false }: { styles: ReturnType<typeof createStyles>; title: string; detail: string; warning?: boolean }) {
  return <View style={[styles.rule, warning && styles.ruleWarning]}><Text style={[styles.ruleTitle, warning && styles.warning]}>{title}</Text><Text style={styles.ruleDetail}>{detail}</Text></View>;
}

function Card({ styles, label, value, tone = 'neutral' }: { styles: ReturnType<typeof createStyles>; label: string; value: string; tone?: 'neutral' | 'success' | 'warning' | 'risk' }) {
  return <View style={styles.card}><Text style={styles.cardLabel}>{label}</Text><Text style={[styles.cardValue, tone === 'success' ? styles.success : tone === 'warning' ? styles.warning : tone === 'risk' ? styles.risk : undefined]}>{value}</Text></View>;
}

function RiskBasicsScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Zarar olmadan risk var mı?' : 'Can risk exist before a loss?'} detail={tr ? 'Risk, sonuç gerçekleşmeden önce taşınır.' : 'Risk exists before the outcome is realized.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'ŞİMDİ' : 'NOW'} value={tr ? 'BELİRSİZ' : 'UNCERTAIN'} tone="warning" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'SONRA' : 'LATER'} value={tr ? 'SONUÇ' : 'OUTCOME'} /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Üç kavramı ayır' : 'Separate three concepts'} detail={tr ? 'Risk · Belirsizlik · Gerçekleşmiş kayıp' : 'Risk · Uncertainty · Realized loss'} /><View style={styles.three}><Card styles={styles} label="RISK" value={tr ? 'OLASILIK' : 'POSSIBILITY'} tone="warning" /><Card styles={styles} label={tr ? 'BELİRSİZLİK' : 'UNCERTAINTY'} value="?" /><Card styles={styles} label={tr ? 'KAYIP' : 'LOSS'} value={tr ? 'GERÇEKLEŞTİ' : 'REALIZED'} tone="risk" /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Hangisi risk, hangisi kayıp?' : 'Which is risk, which is loss?'} detail={tr ? 'Olası zarar ile gerçekleşmiş zararı karıştırma.' : 'Do not confuse possible loss with realized loss.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'OLASI' : 'POSSIBLE'} value="−10% ?" tone="warning" /><Card styles={styles} label={tr ? 'GERÇEK' : 'REALIZED'} value="−1.000" tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? '“ZARAR YOK = RİSK YOK” ✕' : '“NO LOSS = NO RISK” ✕'} detail={tr ? 'Henüz gerçekleşmemiş risk yine de vardır.' : 'Unrealized risk still exists before the outcome.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'RİSK YÖNETİMİ ≠ KAYBI YOK ETMEK' : 'RISK MANAGEMENT ≠ ZERO LOSSES'} detail={tr ? 'Amaç, olası etkinin kabul edilebilir sınırda kalmasıdır.' : 'The goal is to keep possible impact within an acceptable limit.'} />;
  return <Rule styles={styles} title={tr ? 'RİSK = OLASI OLUMSUZ ETKİ' : 'RISK = POSSIBLE ADVERSE IMPACT'} detail={tr ? 'Kayıp ise bu olumsuz sonucun gerçekleşmiş halidir.' : 'Loss is the adverse outcome after it has occurred.'} />;
}

function VolatilityScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Hızlı hareket yön mü söyler?' : 'Does fast movement tell direction?'} detail={tr ? 'Volatilite yönü değil, hareket genişliğini anlatır.' : 'Volatility describes movement size, not direction.'} /><View style={styles.row}><Range styles={styles} wide={false} label={tr ? 'DAR' : 'NARROW'} /><Range styles={styles} wide label={tr ? 'GENİŞ' : 'WIDE'} /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Aynı fiyat, farklı dalgalanma' : 'Same price, different fluctuation'} detail={tr ? 'Hareket aralığı genişledikçe pozisyon etkisi büyüyebilir.' : 'As movement range widens, position impact can grow.'} /><View style={styles.row}><Range styles={styles} wide={false} label="LOW VOL" /><Range styles={styles} wide label="HIGH VOL" /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Aynı miktar, aynı risk mi?' : 'Same size, same risk?'} detail={tr ? 'Daha oynak piyasada aynı pozisyon daha fazla dalgalanabilir.' : 'The same position can fluctuate more in a volatile market.'} /><View style={styles.row}><Card styles={styles} label="LOW VOL" value="±2" tone="success" /><Card styles={styles} label="HIGH VOL" value="±8" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'YÜKSEK VOL ≠ YÜKSELİŞ' : 'HIGH VOL ≠ UP'} detail={tr ? 'Geniş hareket iki yönde de oluşabilir.' : 'Wide moves can occur in either direction.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'VOL ARTINCA PARASAL ETKİ DEĞİŞEBİLİR' : 'HIGHER VOL CAN CHANGE CASH IMPACT'} detail={tr ? 'Pozisyon büyüklüğü ve risk mesafesini yeniden değerlendir.' : 'Reassess position size and risk distance.'} />;
  return <Rule styles={styles} title={tr ? 'VOLATİLİTE = HAREKET GENİŞLİĞİ' : 'VOLATILITY = MOVEMENT RANGE'} detail={tr ? 'Yön sinyali değildir.' : 'It is not a direction signal.'} />;
}

function PositionScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Aynı hata neden farklı zarar verir?' : 'Why can the same mistake hurt differently?'} detail={tr ? 'Pozisyon büyüklüğü hesabın maruziyetini değiştirir.' : 'Position size changes account exposure.'} /><View style={styles.row}><Exposure styles={styles} size="small" /><Exposure styles={styles} size="large" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Önce kabul edilen risk' : 'Start with accepted risk'} detail={tr ? 'Risk sınırı → geçersizlik mesafesi → pozisyon miktarı' : 'Risk limit → invalidation distance → position size'} /><View style={styles.flow}><Card styles={styles} label="1" value={tr ? 'RİSK' : 'RISK'} /><Text style={styles.arrow}>→</Text><Card styles={styles} label="2" value={tr ? 'MESAFE' : 'DISTANCE'} /><Text style={styles.arrow}>→</Text><Card styles={styles} label="3" value={tr ? 'MİKTAR' : 'SIZE'} /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Stop mesafesi iki katına çıkarsa?' : 'If stop distance doubles?'} detail={tr ? 'Aynı parasal riski korumak için miktar genellikle küçülür.' : 'To preserve cash risk, size generally decreases.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'DAR STOP' : 'TIGHT STOP'} value="100" /><Card styles={styles} label={tr ? 'GENİŞ STOP' : 'WIDE STOP'} value="50" tone="success" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? '“ÖNCE EN BÜYÜK MİKTAR” ✕' : '“MAX SIZE FIRST” ✕'} detail={tr ? 'Risk sonradan eklenen bir detay değildir.' : 'Risk is not an afterthought.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'HESAPLANAN RİSK AŞILABİLİR' : 'CALCULATED RISK CAN BE EXCEEDED'} detail={tr ? 'Gap, kayma, korelasyon ve kaldıraç gerçek kaybı büyütebilir.' : 'Gaps, slippage, correlation, and leverage can increase actual loss.'} />;
  return <Rule styles={styles} title={tr ? 'POZİSYON BOYUTU = MARUZİYET SINIRI' : 'POSITION SIZE = EXPOSURE LIMIT'} detail={tr ? 'Getiri aracı değil, risk kontrol aracıdır.' : 'It is a risk-control tool, not a return guarantee.'} />;
}

function RewardScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? '1:3 oranı işlemi iyi yapar mı?' : 'Does 1:3 make a trade good?'} detail={tr ? 'Oran, gerçekleşme olasılığını söylemez.' : 'The ratio does not tell the probability of success.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'RİSK' : 'RISK'} value="1" tone="risk" /><Text style={styles.arrow}>:</Text><Card styles={styles} label={tr ? 'HEDEF' : 'TARGET'} value="3" tone="success" /><Text style={styles.question}>?</Text></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Oran yalnız büyüklükleri karşılaştırır' : 'The ratio only compares payoff sizes'} detail={tr ? 'Olasılık, maliyet ve gerçekleşme ayrıca gerekir.' : 'Probability, costs, and execution still matter.'} /><View style={styles.three}><Card styles={styles} label="R:R" value="1:3" /><Card styles={styles} label={tr ? 'OLASILIK' : 'PROB.'} value="?" tone="warning" /><Card styles={styles} label={tr ? 'MALİYET' : 'COST'} value="−" /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Kâğıt üstü oran ve gerçek sonuç' : 'Nominal ratio vs real outcome'} detail={tr ? 'Spread, komisyon ve kayma nominal oranı düşürebilir.' : 'Spread, fees, and slippage can reduce the nominal ratio.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'PLAN' : 'PLAN'} value="1:3" /><Card styles={styles} label={tr ? 'GERÇEK' : 'REAL'} value="1:2.6" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'YÜKSEK R:R ≠ YÜKSEK OLASILIK' : 'HIGH R:R ≠ HIGH PROBABILITY'} detail={tr ? 'Uzak hedef yüksek oran gösterebilir ama düşük ihtimalli olabilir.' : 'A distant target can show a high ratio while remaining unlikely.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'ORAN TEK BAŞINA KARAR DEĞİLDİR' : 'RATIO ALONE IS NOT A DECISION'} detail={tr ? 'Veri kalitesi, olasılık ve gerçekleşme riskini birlikte değerlendir.' : 'Combine data quality, probability, and execution risk.'} />;
  return <Rule styles={styles} title={tr ? 'R:R + OLASILIK + MALİYET' : 'R:R + PROBABILITY + COST'} detail={tr ? 'Anlamlı değerlendirme bu üçü birlikteyken oluşur.' : 'The ratio becomes meaningful when these are considered together.'} />;
}

function StopScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Stop fiyatı maksimum zararı kilitler mi?' : 'Does a stop lock the maximum loss?'} detail={tr ? 'Tetiklenme ile gerçekleşme aynı olay değildir.' : 'Triggering and execution are not the same event.'} /><StopFlow styles={styles} tr={tr} slipped /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Stop tetiklenir, sonra gerçekleşir' : 'A stop triggers, then executes'} detail={tr ? 'Standart stop çoğu durumda piyasa emrine dönüşür.' : 'A standard stop commonly becomes a market order.'} /><StopFlow styles={styles} tr={tr} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Stop ve stop-limit aynı değil' : 'Stop and stop-limit are different'} detail={tr ? 'Biri gerçekleşme belirsizliği, diğeri gerçekleşmeme riski taşır.' : 'One has fill uncertainty; the other can fail to fill.'} /><View style={styles.row}><Card styles={styles} label="STOP" value={tr ? 'FILL ?' : 'FILL ?'} tone="warning" /><Card styles={styles} label="STOP-LIMIT" value={tr ? 'HİÇ FILL OLMAYABİLİR' : 'MAY NOT FILL'} tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'STOP SEVİYESİ ≠ KESİN ÇIKIŞ FİYATI' : 'STOP LEVEL ≠ GUARANTEED EXIT'} detail={tr ? 'Hızlı piyasa, gap ve düşük likidite fiyatı değiştirebilir.' : 'Fast markets, gaps, and low liquidity can change the fill price.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'TRIGGER ≠ FILL' : 'TRIGGER ≠ FILL'} detail={tr ? 'Emrin tetiklenmesi, aynı fiyattan gerçekleşeceği anlamına gelmez.' : 'Triggering does not mean execution at the same price.'} />;
  return <Rule styles={styles} title={tr ? 'STOP RİSKİ SINIRLAMAYA YARDIM EDER' : 'A STOP HELPS LIMIT RISK'} detail={tr ? 'Ama maksimum kaybı garanti etmez.' : 'But it does not guarantee maximum loss.'} />;
}

function DiversificationScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? '10 varlık = çeşitlendirme mi?' : '10 assets = diversification?'} detail={tr ? 'Aynı risk faktörüne bağlılarsa cevap hayır olabilir.' : 'Not necessarily if they share the same risk factor.'} /><Basket styles={styles} linked /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Sayı değil, risk kaynakları' : 'Risk sources, not asset count'} detail={tr ? 'Amaç tek bir risk kaynağına bağımlılığı azaltmaktır.' : 'The goal is to reduce dependence on one source of risk.'} /><View style={styles.row}><Basket styles={styles} linked /><Basket styles={styles} linked={false} /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Farklı isimler, aynı davranış?' : 'Different names, same behavior?'} detail={tr ? 'Korelasyon ve ortak faktör maruziyetini kontrol et.' : 'Check correlation and shared factor exposure.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'VARLIK SAYISI' : 'ASSETS'} value="8" /><Card styles={styles} label={tr ? 'ORTAK FAKTÖR' : 'SHARED FACTOR'} value="1" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'ÇOK VARLIK ≠ GERÇEK ÇEŞİTLENDİRME' : 'MORE ASSETS ≠ TRUE DIVERSIFICATION'} detail={tr ? 'Aynı piyasa veya faktöre bağlı pozisyonlar birlikte düşebilir.' : 'Positions tied to the same market or factor can fall together.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'KRİZDE KORELASYON ARTABİLİR' : 'CORRELATIONS CAN RISE IN STRESS'} detail={tr ? 'Çeşitlendirme kaybı tamamen engellemez.' : 'Diversification does not eliminate losses.'} />;
  return <Rule styles={styles} title={tr ? 'ÇEŞİTLENDİRME = FARKLI RİSK KAYNAKLARI' : 'DIVERSIFICATION = DIFFERENT RISK SOURCES'} detail={tr ? 'Varlık sayısından daha önemli olan, birlikte nasıl davrandıklarıdır.' : 'How assets behave together matters more than the raw count.'} />;
}

function Range({ styles, wide, label }: { styles: ReturnType<typeof createStyles>; wide: boolean; label: string }) {
  return <View style={styles.rangeCard}><Text style={styles.cardLabel}>{label}</Text><View style={styles.rangeTrack}>{[0, 1, 2, 3, 4].map((index) => <View key={index} style={[styles.rangeMark, { height: wide ? 18 + ((index * 13) % 44) : 20 + ((index * 5) % 16) }, wide && styles.rangeWide]} />)}</View></View>;
}

function Exposure({ styles, size }: { styles: ReturnType<typeof createStyles>; size: 'small' | 'large' }) {
  return <View style={styles.card}><Text style={styles.cardLabel}>{size === 'small' ? 'SMALL' : 'LARGE'}</Text><View style={styles.exposureTrack}><View style={[styles.exposureFill, { width: size === 'small' ? '32%' : '84%' }, size === 'large' && styles.exposureRisk]} /></View><Text style={[styles.cardValue, size === 'large' && styles.risk]}>{size === 'small' ? '−2' : '−8'}</Text></View>;
}

function StopFlow({ styles, tr, slipped = false }: { styles: ReturnType<typeof createStyles>; tr: boolean; slipped?: boolean }) {
  return <View style={styles.flow}><Card styles={styles} label="1" value={tr ? 'STOP' : 'STOP'} /><Text style={styles.arrow}>→</Text><Card styles={styles} label="2" value={tr ? 'TETİK' : 'TRIGGER'} tone="warning" /><Text style={styles.arrow}>→</Text><Card styles={styles} label="3" value={slipped ? (tr ? 'FILL ≠ STOP' : 'FILL ≠ STOP') : 'FILL'} tone={slipped ? 'risk' : 'success'} /></View>;
}

function Basket({ styles, linked }: { styles: ReturnType<typeof createStyles>; linked: boolean }) {
  return <View style={styles.basket}><View style={styles.assetRow}>{['A', 'B', 'C', 'D'].map((item, index) => <View key={item} style={[styles.assetDot, linked && index > 0 && styles.assetLinked]}><Text style={styles.assetText}>{item}</Text></View>)}</View><Text style={[styles.cardLabel, linked ? styles.warning : styles.success]}>{linked ? 'SAME FACTOR' : 'MIXED FACTORS'}</Text></View>;
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 14, padding: 14 },
  header: { gap: 4 },
  title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' },
  detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  three: { flexDirection: 'row', gap: 8 },
  flow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  arrow: { color: theme.colors.textMuted, fontSize: 20, fontWeight: '900' },
  question: { color: theme.colors.warning, fontSize: 28, fontWeight: '900', alignSelf: 'center' },
  card: { flex: 1, minHeight: 86, justifyContent: 'center', gap: 7, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  cardLabel: { color: theme.colors.textMuted, fontSize: 9, lineHeight: 12, fontWeight: '900', letterSpacing: 0.45, textAlign: 'center' },
  cardValue: { color: theme.colors.text, fontSize: 13, lineHeight: 18, fontWeight: '900', textAlign: 'center' },
  success: { color: theme.colors.success },
  warning: { color: theme.colors.warning },
  risk: { color: theme.colors.risk },
  rule: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(45,212,191,0.22)', backgroundColor: 'rgba(45,212,191,0.06)' },
  ruleWarning: { borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' },
  ruleTitle: { color: theme.colors.primary, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
  ruleDetail: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  rangeCard: { flex: 1, minHeight: 104, justifyContent: 'center', gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  rangeTrack: { height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 5 },
  rangeMark: { width: 7, borderRadius: 4, backgroundColor: 'rgba(45,212,191,0.32)' },
  rangeWide: { backgroundColor: 'rgba(251,191,36,0.38)' },
  exposureTrack: { height: 9, overflow: 'hidden', borderRadius: 5, backgroundColor: theme.colors.background },
  exposureFill: { height: 9, borderRadius: 5, backgroundColor: theme.colors.success },
  exposureRisk: { backgroundColor: theme.colors.risk },
  basket: { flex: 1, minHeight: 104, justifyContent: 'center', gap: 12, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  assetRow: { flexDirection: 'row', justifyContent: 'center', gap: 7 },
  assetDot: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, borderWidth: 1, borderColor: 'rgba(45,212,191,0.38)', backgroundColor: 'rgba(45,212,191,0.10)' },
  assetLinked: { borderColor: 'rgba(251,191,36,0.42)', backgroundColor: 'rgba(251,191,36,0.08)' },
  assetText: { color: theme.colors.text, fontSize: 10, fontWeight: '900' },
});
