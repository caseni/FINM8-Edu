import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'rsi' | 'macd' | 'multiTimeframe' | 'patterns' | 'confluence' | 'indicatorLimits';

export interface TechnicalAnalysisExpansionSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('rsi-ne-anlatir-ne-anlatmaz')) return 'rsi';
  if (assetRef.includes('macd-ne-gosterir')) return 'macd';
  if (assetRef.includes('coklu-zaman-dilimi-nasil-kullanilir')) return 'multiTimeframe';
  if (assetRef.includes('formasyonlar-neden-kesin-degildir')) return 'patterns';
  if (assetRef.includes('confluence-nedir')) return 'confluence';
  if (assetRef.includes('indikatorlerin-sinirlari')) return 'indicatorLimits';
  return undefined;
}

export function isTechnicalAnalysisExpansionSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function TechnicalAnalysisExpansionSlideVisual({
  assetRef,
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: TechnicalAnalysisExpansionSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'rsi' ? <RsiScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'macd' ? <MacdScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'multiTimeframe' ? <MultiTimeframeScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'patterns' ? <PatternScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'confluence' ? <ConfluenceScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'indicatorLimits' ? <IndicatorLimitsScene role={role} tr={tr} styles={styles} /> : null}
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

function RsiScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'RSI 74 = kesin dönüş?' : 'RSI 74 = certain reversal?'} detail={tr ? 'Güçlü trendde yüksek kalabilir.' : 'It can remain elevated in a strong trend.'} /><View style={styles.row}><PriceStrip styles={styles} up /><Oscillator styles={styles} value={74} /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? '0–100 hareket gücü özeti' : '0–100 momentum summary'} detail={tr ? 'Son yükseliş ve düşüşlerin göreli gücünü gösterir.' : 'Shows the relative strength of recent gains and losses.'} /><Oscillator styles={styles} value={63} labels /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Eşik + fiyat yapısı' : 'Threshold + price structure'} detail={tr ? 'RSI’ı tek başına değil fiyatla birlikte oku.' : 'Read RSI together with price, not alone.'} /><View style={styles.row}><Card styles={styles} label="RSI" value="74" tone="warning" /><Card styles={styles} label={tr ? 'FİYAT' : 'PRICE'} value={tr ? 'YÜKSELEN YAPI' : 'HH / HL'} tone="success" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? '70 ≠ OTOMATİK SAT' : '70 ≠ AUTOMATIC SELL'} detail={tr ? '30 ≠ otomatik al. Eşikler dönüş emri değildir.' : '30 ≠ automatic buy. Thresholds are not reversal commands.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'RSI FİYATTAN TÜRETİLİR' : 'RSI IS PRICE-DERIVED'} detail={tr ? 'Aynı fiyat riskini bağımsız kanıt gibi iki kez sayma.' : 'Do not double-count the same price evidence as independent evidence.'} />;
  return <Rule styles={styles} title={tr ? 'RSI = HAREKET GÜCÜ ÖZETİ' : 'RSI = MOMENTUM CONTEXT'} detail={tr ? 'Gelecek yön garantisi değil.' : 'Not a guarantee of future direction.'} />;
}

function MacdScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Kesişim = anlık trend değişimi?' : 'Crossover = instant trend change?'} detail={tr ? 'MACD geçmiş fiyattan üretildiği için gecikmelidir.' : 'MACD lags because it is derived from past prices.'} /><MacdPanel styles={styles} crossing /></>;
  if (role === 'concept') return <><Header styles={styles} title="MACD" detail={tr ? 'Hızlı ortalama − yavaş ortalama · sinyal · histogram' : 'Fast average − slow average · signal · histogram'} /><MacdPanel styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Yönlü piyasa mı, yatay alan mı?' : 'Trend or range?'} detail={tr ? 'Aynı kesişim farklı rejimde farklı kalite taşır.' : 'The same crossover carries different quality across regimes.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'YÖNLÜ' : 'TREND'} value={tr ? 'DAHA TEMİZ' : 'CLEANER'} tone="success" /><Card styles={styles} label={tr ? 'YATAY ALAN' : 'RANGE'} value={tr ? 'SIK YANILIR' : 'WHIPSAW'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'HER KESİŞİM ≠ SİNYAL' : 'EVERY CROSSOVER ≠ SIGNAL'} detail={tr ? 'Yatay piyasada sık yanlış teyit oluşabilir.' : 'Ranges can generate frequent false confirmation.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'PARAMETREYE DUYARLI' : 'PARAMETER-SENSITIVE'} detail={tr ? 'Ayar değişirse tepki hızı ve kesişimler değişebilir.' : 'Changing settings can alter response speed and crossovers.'} />;
  return <Rule styles={styles} title={tr ? 'MACD = GECİKMELİ HAREKET ÖZETİ' : 'MACD = LAGGING RELATIONSHIP SUMMARY'} detail={tr ? 'Yapı ve rejimle birlikte anlam kazanır.' : 'It gains meaning with structure and regime.'} />;
}

function MultiTimeframeScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? '1D ↑ · 15m ↓ — çelişki mi?' : '1D ↑ · 15m ↓ — contradiction?'} detail={tr ? 'Aynı anda iki farklı ölçek doğru olabilir.' : 'Two different scales can be valid at the same time.'} /><View style={styles.stack}><ScaleRow styles={styles} label="1D" direction="up" /><ScaleRow styles={styles} label="1h" direction="up" /><ScaleRow styles={styles} label="15m" direction="down" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Bağlam → yapı → ayrıntı' : 'Context → structure → detail'} detail={tr ? 'Geniş zaman diliminden kısa zaman dilimine in.' : 'Move from higher-timeframe context to lower-timeframe detail.'} /><View style={styles.flow}><Card styles={styles} label="1D" value={tr ? 'BAĞLAM' : 'CONTEXT'} /><Text style={styles.arrow}>→</Text><Card styles={styles} label="1h" value={tr ? 'YAPI' : 'STRUCTURE'} /><Text style={styles.arrow}>→</Text><Card styles={styles} label="15m" value={tr ? 'DETAY' : 'DETAIL'} /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Kısa düşüş ne olabilir?' : 'What can a short decline be?'} detail={tr ? 'Ana yükseliş korunuyorsa kısa bir geri çekilme olabilir.' : 'It can be a pullback if broader uptrend structure holds.'} /><View style={styles.row}><Card styles={styles} label="1D" value={tr ? 'YÜKSELİŞ' : 'HH / HL'} tone="success" /><Card styles={styles} label="15m" value="↓" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'HER ZAMAN DİLİMİ AYNI YÖNÜ GÖSTERMEZ' : 'EVERY TF NEED NOT MATCH'} detail={tr ? 'Küçük yapı ile ana yapıyı birbirine karıştırma.' : 'Do not confuse internal structure with broad structure.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'ÇOK FAZLA ZAMAN DİLİMİ = GÜRÜLTÜ' : 'TOO MANY TFs = NOISE'} detail={tr ? 'Her zaman dilimine net bir rol ver.' : 'Give each timeframe a clear role.'} />;
  return <Rule styles={styles} title={tr ? 'ÖLÇEKLERİ AYIR, SONRA BAĞLA' : 'SEPARATE SCALES, THEN CONNECT THEM'} detail={tr ? 'Ana bağlam önce gelir.' : 'Broad context comes first.'} />;
}

function PatternScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Üçgen gördün; yön belli mi?' : 'You see a triangle; is direction known?'} detail={tr ? 'Aynı şekil farklı sonuçlanabilir.' : 'The same shape can resolve differently.'} /><PatternFork styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Formasyon = gözlem etiketi' : 'Pattern = observation label'} detail={tr ? 'Geometriyi düzenler; sonucu garanti etmez.' : 'Organizes geometry; does not guarantee outcome.'} /><PatternFork styles={styles} compact /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Şekilden sonra bağlama bak' : 'After the shape, inspect context'} detail={tr ? 'Önceki yön · işlem hacmi · oynaklık · kırılımın devamı' : 'Prior trend · volume · volatility · breakout behavior'} /><View style={styles.grid}><Tag styles={styles} text={tr ? 'ÖNCEKİ YÖN' : 'PRIOR TREND'} /><Tag styles={styles} text={tr ? 'HACİM' : 'VOLUME'} /><Tag styles={styles} text={tr ? 'OYNAKLIK' : 'VOLATILITY'} /><Tag styles={styles} text={tr ? 'KIRILIM' : 'BREAKOUT'} /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'ŞEKİL ≠ KESİN HEDEF' : 'SHAPE ≠ CERTAIN TARGET'} detail={tr ? 'Formasyon hedefleri yalnızca yönteme dayalı tahminlerdir.' : 'Pattern targets are methodological projections.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'SONRADAN BAKMA YANILGISI' : 'SONRADAN BAKMA YANILGISI'} detail={tr ? 'Geçmiş grafikte kusursuz görünen şekil canlıda belirsiz olabilir.' : 'A perfect historical shape can be ambiguous in real time.'} />;
  return <Rule styles={styles} title={tr ? 'FORMASYON = ŞEKİL + BAĞLAM' : 'PATTERN = GEOMETRY + CONTEXT'} detail={tr ? 'Tahmin makinesi değildir.' : 'It is not a prediction machine.'} />;
}

function ConfluenceScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? '5 gösterge = 5 ayrı kanıt mı?' : '5 indicators = 5 pieces of evidence?'} detail={tr ? 'Aynı fiyat verisinden türeyenler bağımsız değildir.' : 'Indicators derived from the same price data are not independent.'} /><EvidenceTree styles={styles} tr={tr} duplicate /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Kanıtların birleşmesi (confluence)' : 'Confluence = evidence diversity'} detail={tr ? 'Farklı kaynak ve mekanizmaların ortak yorumu desteklemesi.' : 'Different sources and mechanisms support the same interpretation.'} /><EvidenceTree styles={styles} tr={tr} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Hangisi daha bağımsız?' : 'Which is more independent?'} detail={tr ? 'Fiyatın yapısı + işlem hacmi + oynaklık' : 'Price structure + volume + volatility'} /><View style={styles.row}><Card styles={styles} label={tr ? 'ÇEŞİTLİ' : 'DIVERSE'} value="3×" tone="success" /><Card styles={styles} label={tr ? 'AYNI KAYNAK' : 'SAME SOURCE'} value="RSI·MACD·MA" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'GÖSTERGE SAYISI ≠ KANIT SAYISI' : 'INDICATOR COUNT ≠ EVIDENCE COUNT'} detail={tr ? 'Aynı kaynaktan gelen benzer kanıtları iki kez sayma.' : 'Do not double-count correlated evidence.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'KANITLARIN BİRLEŞMESİ ≠ KESİNLİK' : 'CONFLUENCE ≠ CERTAINTY'} detail={tr ? 'Belirsizlik devam eder; risk ayrıca yönetilir.' : 'Uncertainty remains; risk is managed separately.'} />;
  return <Rule styles={styles} title={tr ? 'FARKLI KAYNAK · AYNI YORUM' : 'DIFFERENT SOURCES · SAME INTERPRETATION'} detail={tr ? 'Asıl değer burada.' : 'That is the useful part.'} />;
}

function IndicatorLimitsScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Daha çok gösterge = daha doğru sonuç mu?' : 'More indicators = more accurate?'} detail={tr ? 'Çoğu aynı fiyat/hacim verisini dönüştürür.' : 'Most transform the same price/volume data.'} /><EvidenceTree styles={styles} tr={tr} duplicate /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Dört temel sınır' : 'Four core limits'} detail={tr ? 'Gecikme · ayarlar · piyasa koşulu · geçmişe aşırı uyum' : 'Lag · parameters · regime · overfitting'} /><View style={styles.grid}><Tag styles={styles} text={tr ? 'GECİKME' : 'LAG'} /><Tag styles={styles} text={tr ? 'AYARLAR' : 'PARAMETERS'} /><Tag styles={styles} text={tr ? 'PİYASA KOŞULU' : 'REGIME'} /><Tag styles={styles} text={tr ? 'AŞIRI UYUM' : 'OVERFIT'} /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Geçmişte mükemmel, sonra zayıf' : 'Perfect in-sample, weak later'} detail={tr ? 'Geçmişe aşırı uyum ihtimalini düşün.' : 'Consider overfitting.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'GEÇMİŞ TESTİ' : 'BACKTEST'} value="98%" tone="success" /><Card styles={styles} label={tr ? 'YENİ DÖNEM' : 'NEW PERIOD'} value="52%" tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'İNDİKATÖR ≠ YENİ GERÇEKLİK' : 'INDICATOR ≠ NEW REALITY'} detail={tr ? 'Çoğu mevcut verinin farklı matematiksel görünümüdür.' : 'Most are different mathematical views of existing data.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'GEÇMİŞE GÖRE AYARLAMA RİSKİ' : 'PARAMETER-MINING RISK'} detail={tr ? 'Geçmişe en iyi uyan ayar gelecekte dayanıklı olmayabilir.' : 'The setting that best fits history may not be robust later.'} />;
  return <Rule styles={styles} title={tr ? 'ARAÇTIR · KARARIN KENDİSİ DEĞİL' : 'A TOOL · NOT THE DECISION ITSELF'} detail={tr ? 'Bağlam, kanıt ve risk hâlâ gerekir.' : 'Context, evidence, and risk still matter.'} />;
}

function PriceStrip({ styles, up = false }: { styles: ReturnType<typeof createStyles>; up?: boolean }) {
  const values = up ? [22, 30, 27, 41, 36, 50] : [38, 34, 41, 33, 39, 35];
  return <View style={styles.priceStrip}>{values.map((bottom, index) => <View key={index} style={[styles.priceDot, { left: `${10 + index * 16}%`, bottom }]} />)}</View>;
}
function Oscillator({ styles, value, labels = false }: { styles: ReturnType<typeof createStyles>; value: number; labels?: boolean }) {
  return <View style={styles.oscillator}>{labels ? <><Text style={[styles.thresholdLabel, { top: 9 }]}>70</Text><Text style={[styles.thresholdLabel, { bottom: 9 }]}>30</Text></> : null}<View style={[styles.threshold, { top: '30%' }]} /><View style={[styles.threshold, { top: '70%' }]} /><View style={[styles.oscDot, { top: `${100 - value}%` }]} /><Text style={styles.oscValue}>RSI {value}</Text></View>;
}
function MacdPanel({ styles, crossing = false }: { styles: ReturnType<typeof createStyles>; crossing?: boolean }) {
  return <View style={styles.macdPanel}><View style={styles.zeroLine} /><View style={[styles.macdLine, crossing && styles.macdCross]} /><View style={[styles.signalLine, crossing && styles.signalCross]} /><View style={styles.histogram}>{[18, 26, 34, 20, 10, 6].map((height, i) => <View key={i} style={[styles.histBar, { height }]} />)}</View></View>;
}
function ScaleRow({ styles, label, direction }: { styles: ReturnType<typeof createStyles>; label: string; direction: 'up' | 'down' }) {
  return <View style={styles.scaleRow}><Text style={styles.scaleLabel}>{label}</Text><PriceStrip styles={styles} up={direction === 'up'} /><Text style={[styles.scaleDirection, direction === 'up' ? styles.success : styles.warning]}>{direction === 'up' ? '↑' : '↓'}</Text></View>;
}
function PatternFork({ styles, compact = false }: { styles: ReturnType<typeof createStyles>; compact?: boolean }) {
  return <View style={styles.patternFork}><View style={styles.triangle}><View style={styles.triangleTop} /><View style={styles.triangleBottom} /></View><Text style={styles.arrow}>→</Text><View style={styles.patternOutcomes}><Text style={styles.success}>↑</Text><Text style={styles.warning}>↩</Text><Text style={styles.risk}>↓</Text></View>{compact ? null : <Text style={styles.question}>?</Text>}</View>;
}
function EvidenceTree({ styles, tr, duplicate = false }: { styles: ReturnType<typeof createStyles>; tr: boolean; duplicate?: boolean }) {
  return <View style={styles.evidenceTree}><View style={styles.sourceNode}><Text style={styles.sourceText}>{duplicate ? (tr ? 'AYNI FİYAT' : 'PRICE') : (tr ? 'FARKLI KANITLAR' : 'EVIDENCE')}</Text></View><View style={styles.branchRow}>{duplicate ? <><Tag styles={styles} text="RSI" /><Tag styles={styles} text="MACD" /><Tag styles={styles} text="MA" /></> : <><Tag styles={styles} text={tr ? 'FİYAT YAPISI' : 'STRUCTURE'} /><Tag styles={styles} text={tr ? 'HACİM' : 'VOLUME'} /><Tag styles={styles} text={tr ? 'OYNAKLIK' : 'VOLATILITY'} /></>}</View></View>;
}
function Tag({ styles, text }: { styles: ReturnType<typeof createStyles>; text: string }) { return <View style={styles.tag}><Text style={styles.tagText}>{text}</Text></View>; }

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 14, padding: 14 },
  header: { gap: 4 },
  title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' },
  detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 10, alignItems: 'stretch' },
  flow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  stack: { gap: 7 },
  card: { flex: 1, minHeight: 82, justifyContent: 'center', gap: 6, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  cardLabel: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  cardValue: { color: theme.colors.text, fontSize: 13, fontWeight: '900' },
  rule: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(45,212,191,0.22)', backgroundColor: 'rgba(45,212,191,0.06)' },
  ruleWarning: { borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' },
  ruleTitle: { color: theme.colors.primary, fontSize: 17, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
  ruleDetail: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  success: { color: theme.colors.success }, warning: { color: theme.colors.warning }, risk: { color: theme.colors.risk },
  arrow: { color: theme.colors.textMuted, fontSize: 20, fontWeight: '900' }, question: { color: theme.colors.warning, fontSize: 25, fontWeight: '900' },
  priceStrip: { flex: 1, minHeight: 90, position: 'relative', borderRadius: 12, backgroundColor: theme.colors.surfaceMuted },
  priceDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary },
  oscillator: { flex: 1, minHeight: 90, position: 'relative', borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  threshold: { position: 'absolute', left: 10, right: 10, height: 1, backgroundColor: 'rgba(159,176,195,0.35)' },
  thresholdLabel: { position: 'absolute', left: 8, color: theme.colors.textMuted, fontSize: 8, fontWeight: '800' },
  oscDot: { position: 'absolute', right: 16, width: 12, height: 12, marginTop: -6, borderRadius: 6, backgroundColor: theme.colors.warning },
  oscValue: { position: 'absolute', right: 8, bottom: 7, color: theme.colors.text, fontSize: 10, fontWeight: '900' },
  macdPanel: { minHeight: 112, position: 'relative', overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  zeroLine: { position: 'absolute', left: 10, right: 10, top: 57, height: 1, backgroundColor: 'rgba(159,176,195,0.35)' },
  macdLine: { position: 'absolute', left: 18, right: 18, top: 33, height: 3, borderRadius: 3, backgroundColor: theme.colors.primary, transform: [{ rotate: '-7deg' }] },
  signalLine: { position: 'absolute', left: 18, right: 18, top: 45, height: 2, borderRadius: 2, backgroundColor: theme.colors.warning, transform: [{ rotate: '5deg' }] },
  macdCross: { top: 41, transform: [{ rotate: '8deg' }] }, signalCross: { top: 41, transform: [{ rotate: '-6deg' }] },
  histogram: { position: 'absolute', left: 16, right: 16, bottom: 8, height: 34, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' },
  histBar: { width: 12, borderRadius: 3, backgroundColor: 'rgba(45,212,191,0.28)' },
  scaleRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 7, borderRadius: 10, backgroundColor: theme.colors.surfaceMuted },
  scaleLabel: { width: 28, color: theme.colors.text, fontSize: 10, fontWeight: '900' }, scaleDirection: { fontSize: 18, fontWeight: '900' },
  patternFork: { minHeight: 105, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15 },
  triangle: { width: 90, height: 70, position: 'relative' },
  triangleTop: { position: 'absolute', left: 4, right: 4, top: 16, height: 2, backgroundColor: theme.colors.primary, transform: [{ rotate: '-12deg' }] },
  triangleBottom: { position: 'absolute', left: 4, right: 4, bottom: 17, height: 2, backgroundColor: theme.colors.primary, transform: [{ rotate: '12deg' }] },
  patternOutcomes: { gap: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { minWidth: 78, flexGrow: 1, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 9, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  tagText: { color: theme.colors.text, fontSize: 9, fontWeight: '900', letterSpacing: 0.4 },
  evidenceTree: { minHeight: 112, alignItems: 'center', justifyContent: 'center', gap: 12 },
  sourceNode: { paddingVertical: 9, paddingHorizontal: 20, borderRadius: 999, borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: 'rgba(45,212,191,0.08)' },
  sourceText: { color: theme.colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
  branchRow: { width: '100%', flexDirection: 'row', gap: 7 },
});
