import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'breakout' | 'falseBreakout' | 'pullback' | 'range' | 'momentum' | 'movingAverage';

export interface TechnicalAnalysisSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('breakout-ne-zaman-anlamli')) return 'breakout';
  if (assetRef.includes('false-breakout-nasil-okunur')) return 'falseBreakout';
  if (assetRef.includes('pullback-trend-donusu-degildir')) return 'pullback';
  if (assetRef.includes('range-konsolidasyon-nasil-okunur')) return 'range';
  if (assetRef.includes('momentum-ne-anlatir')) return 'momentum';
  if (assetRef.includes('hareketli-ortalama-ne-yapar')) return 'movingAverage';
  return undefined;
}

export function isTechnicalAnalysisSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function TechnicalAnalysisSlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: TechnicalAnalysisSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';
  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'breakout' ? <BreakoutScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'falseBreakout' ? <FalseBreakoutScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'pullback' ? <PullbackScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'range' ? <RangeScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'momentum' ? <MomentumScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'movingAverage' ? <MovingAverageScene role={role} tr={tr} styles={styles} /> : null}
      </View>
    </View>
  );
}

type SceneProps = { role: SlideRole; tr: boolean; styles: ReturnType<typeof createStyles> };
function Header({ styles, title, detail }: { styles: ReturnType<typeof createStyles>; title: string; detail: string }) { return <View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>; }
function Rule({ styles, title, detail, warning = false }: { styles: ReturnType<typeof createStyles>; title: string; detail: string; warning?: boolean }) { return <View style={[styles.rule, warning && styles.ruleWarning]}><Text style={[styles.ruleTitle, warning && styles.warning]}>{title}</Text><Text style={styles.ruleDetail}>{detail}</Text></View>; }
function Card({ styles, label, value, tone = 'neutral' }: { styles: ReturnType<typeof createStyles>; label: string; value: string; tone?: 'neutral' | 'success' | 'warning' | 'risk' }) { return <View style={styles.card}><Text style={styles.cardLabel}>{label}</Text><Text style={[styles.cardValue, tone === 'success' ? styles.success : tone === 'warning' ? styles.warning : tone === 'risk' ? styles.risk : undefined]}>{value}</Text></View>; }

function BreakoutScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Seviyeyi geçmek yetiyor mu?' : 'Is crossing the level enough?'} detail={tr ? 'Kapanış ve devam davranışı kanıtı güçlendirebilir.' : 'Close and follow-through can strengthen the evidence.'} /><BreakoutChart styles={styles} accepted={false} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Bölge dışına çıkış + kabul' : 'Move beyond the area + acceptance'} detail={tr ? 'Önemli bölge ve sonrasındaki davranışı birlikte değerlendir.' : 'Assess the important area together with behavior after the break.'} /><BreakoutChart styles={styles} accepted /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Fitil mi, kabul mü?' : 'Wick or acceptance?'} detail={tr ? 'İki davranışı ayır.' : 'Separate the two behaviors.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'TEK FİTİL' : 'ONE WICK'} value="?" tone="warning" /><Card styles={styles} label={tr ? 'KAPANIŞ + DEVAM' : 'CLOSE + FOLLOW'} value="✓" tone="success" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'HER TAŞMA ≠ TEYİTLİ BREAKOUT' : 'EVERY OVERSHOOT ≠ CONFIRMED BREAKOUT'} detail={tr ? 'Seviyenin önemi ve devam davranışı gerekir.' : 'Level importance and follow-through matter.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'BREAKOUT ≠ YÖN GARANTİSİ' : 'BREAKOUT ≠ DIRECTION GUARANTEE'} detail={tr ? 'Volatilite, likidite ve zaman dilimini ayrıca değerlendir.' : 'Assess volatility, liquidity, and timeframe separately.'} />;
  return <Rule styles={styles} title={tr ? 'BREAKOUT = ÖNEMLİ BÖLGE + BAĞLAM + DEVAM' : 'BREAKOUT = IMPORTANT AREA + CONTEXT + FOLLOW-THROUGH'} detail={tr ? 'Tek çizgi geçişinden daha fazlasıdır.' : 'It is more than crossing one line.'} />;
}

function FalseBreakoutScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Kırdı, sonra geri döndü' : 'Broke out, then returned'} detail={tr ? 'Hareket bölge dışında tutunamamış olabilir.' : 'The move may have failed to hold outside the area.'} /><FalseBreakChart styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Dışarı çıkış → reddedilme → geri dönüş' : 'Break → rejection → return'} detail={tr ? 'Acceptance yerine rejection gözlenir.' : 'Rejection appears instead of acceptance.'} /><FalseBreakChart styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Sürdü mü, geri mi döndü?' : 'Did it hold or return?'} detail={tr ? 'Kapanış ve takip hareketine bak.' : 'Check the close and follow-through.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'DIŞARIDA KALDI' : 'HELD OUTSIDE'} value="BREAK" tone="success" /><Card styles={styles} label={tr ? 'İÇERİ DÖNDÜ' : 'RETURNED'} value="FALSE?" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'FALSE BREAKOUT ≠ OTOMATİK TERS İŞLEM' : 'FALSE BREAKOUT ≠ AUTOMATIC REVERSE TRADE'} detail={tr ? 'Yeni yön için devam kanıtı gerekir.' : 'The opposite direction still needs follow-through evidence.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'ETİKETE DEĞİL DAVRANIŞA BAK' : 'FOCUS ON BEHAVIOR, NOT LABELS'} detail={tr ? 'Acceptance/rejection bağlamı metodoloji etiketinden daha önemlidir.' : 'Acceptance/rejection matters more than methodology labels.'} />;
  return <Rule styles={styles} title={tr ? 'FALSE BREAKOUT = SÜRDÜRÜLEMEYEN KIRILIM' : 'FALSE BREAKOUT = UNSUSTAINED BREAK'} detail={tr ? 'Kesin dönüş anlamına gelmez.' : 'It does not prove a reversal.'} />;
}

function PullbackScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Kısa düşüş = trend bitti mi?' : 'Short decline = trend over?'} detail={tr ? 'Ana yapı korunuyorsa bu geri çekilme olabilir.' : 'If broader structure holds, it may be a pullback.'} /><PullbackChart styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Ana yön içinde geçici karşı hareket' : 'Temporary counter-move within the main direction'} detail={tr ? 'Korunan salınım seviyeleri önemlidir.' : 'Protected swing levels matter.'} /><PullbackChart styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Pullback mı, yapı değişimi mi?' : 'Pullback or structural change?'} detail={tr ? 'Ana yapıyı koruyan seviyeyi kontrol et.' : 'Check whether the level protecting the main structure still holds.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'ANA DİP KORUNDU' : 'KEY LOW HOLDS'} value="PULLBACK" tone="success" /><Card styles={styles} label={tr ? 'ANA DİP KAYIP' : 'KEY LOW LOST'} value="REASSESS" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'HER GERİ ÇEKİLME ≠ TREND DÖNÜŞÜ' : 'EVERY RETRACEMENT ≠ REVERSAL'} detail={tr ? 'Zaman dilimi ve ana yapıyı birlikte oku.' : 'Read timeframe and broader structure together.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'DERİNLİK TEK BAŞINA YETERLİ DEĞİL' : 'DEPTH ALONE IS NOT ENOUGH'} detail={tr ? 'Volatilite ve invalidation bağlamını da kontrol et.' : 'Also assess volatility and structural invalidation.'} />;
  return <Rule styles={styles} title={tr ? 'PULLBACK = ANA YAPI İÇİNDE GEÇİCİ GERİ ÇEKİLME' : 'PULLBACK = TEMPORARY RETRACEMENT WITHIN STRUCTURE'} detail={tr ? 'Dönüş için yapı değişimi kanıtı gerekir.' : 'A reversal requires evidence of structural change.'} />;
}

function RangeScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Yön yok mu, denge mi var?' : 'No direction—or balance?'} detail={tr ? 'Fiyat iki tepki bölgesi arasında kalabilir.' : 'Price can rotate between two reaction areas.'} /><RangeChart styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Üst bölge ↔ Alt bölge' : 'Upper area ↔ Lower area'} detail={tr ? 'Orta bölge daha gürültülü olabilir.' : 'The middle can be noisier.'} /><RangeChart styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Sınırları bölge olarak oku' : 'Read boundaries as zones'} detail={tr ? 'Tek fiyat yerine tekrarlayan tepki alanlarına bak.' : 'Look for repeated reaction areas rather than one exact price.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'ÜST BÖLGE' : 'UPPER'} value="REACTION" /><Card styles={styles} label={tr ? 'ALT BÖLGE' : 'LOWER'} value="REACTION" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'RANGE ORTASI ≠ NET TREND' : 'RANGE MIDDLE ≠ CLEAR TREND'} detail={tr ? 'Orta alandaki küçük hareketleri büyütme.' : 'Do not overinterpret small moves in the middle.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'SINIR AŞIMI ≠ YENİ TREND GARANTİSİ' : 'BOUNDARY BREAK ≠ NEW TREND GUARANTEE'} detail={tr ? 'Breakout bağlamı yine gerekir.' : 'Breakout context still matters.'} />;
  return <Rule styles={styles} title={tr ? 'RANGE = SINIRLAR ARASINDA DENGE' : 'RANGE = BALANCE BETWEEN BOUNDARIES'} detail={tr ? 'Sınır ve kırılım davranışını izle.' : 'Watch boundary and breakout behavior.'} />;
}

function MomentumScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Fiyat yükseliyor ama hız azalıyor' : 'Price rises while speed fades'} detail={tr ? 'Yön aynı kalırken momentum değişebilir.' : 'Momentum can change while direction remains the same.'} /><MomentumCompare styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Hız + devam gücü' : 'Speed + persistence'} detail={tr ? 'Momentum hareketin nasıl ilerlediğini özetler.' : 'Momentum summarizes how a move progresses.'} /><MomentumCompare styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Aynı yön, farklı eğim' : 'Same direction, different slope'} detail={tr ? 'Daha düşük eğim zayıflayan momentuma işaret edebilir.' : 'A shallower slope can indicate weaker momentum.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'DİK' : 'STEEP'} value="STRONG" tone="success" /><Card styles={styles} label={tr ? 'YATIK' : 'SHALLOW'} value="WEAKER" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'GÜÇLÜ MOMENTUM ≠ KESİN DEVAM' : 'STRONG MOMENTUM ≠ CERTAIN CONTINUATION'} detail={tr ? 'Momentum geleceği garanti etmez.' : 'Momentum does not guarantee the future.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'DIVERGENCE ≠ OTOMATİK DÖNÜŞ' : 'DIVERGENCE ≠ AUTOMATIC REVERSAL'} detail={tr ? 'Yapı ve devam kanıtıyla birlikte değerlendir.' : 'Assess it with structure and follow-through.'} />;
  return <Rule styles={styles} title={tr ? 'MOMENTUM = HAREKETİN HIZI VE ISRARLILIĞI' : 'MOMENTUM = SPEED AND PERSISTENCE'} detail={tr ? 'Yön garantisi değildir.' : 'It is not a direction guarantee.'} />;
}

function MovingAverageScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Fiyat çizgisi gürültülü, ortalama daha sakin' : 'Price is noisy; the average is smoother'} detail={tr ? 'Hareketli ortalama geçmiş fiyatı yumuşatır.' : 'A moving average smooths past price.'} /><MovingAverageChart styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Geçmiş fiyatların kayan özeti' : 'Rolling summary of past prices'} detail={tr ? 'Uzun pencere daha yavaş, kısa pencere daha hızlı tepki verir.' : 'Longer windows react more slowly; shorter ones react faster.'} /><MovingAverageChart styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? '20 periyot vs 100 periyot' : '20-period vs 100-period'} detail={tr ? 'Pencere büyüdükçe yumuşatma ve gecikme artar.' : 'Longer windows add smoothing and lag.'} /><View style={styles.row}><Card styles={styles} label="MA 20" value={tr ? 'HIZLI' : 'FASTER'} tone="success" /><Card styles={styles} label="MA 100" value={tr ? 'YAVAŞ' : 'SLOWER'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'ORTALAMA GEÇİŞİ ≠ KESİN SİNYAL' : 'MA CROSS ≠ CERTAIN SIGNAL'} detail={tr ? 'Trend ve volatilite bağlamı ayrıca gerekir.' : 'Trend and volatility context still matters.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'HAREKETLİ ORTALAMA GECİKMELİDİR' : 'MOVING AVERAGES LAG'} detail={tr ? 'Geçmiş veriden üretildiğini unutma.' : 'Remember it is built from past data.'} />;
  return <Rule styles={styles} title={tr ? 'MOVING AVERAGE = YUMUŞATILMIŞ GEÇMİŞ FİYAT' : 'MOVING AVERAGE = SMOOTHED PAST PRICE'} detail={tr ? 'Bağlamı özetler, geleceği bilmez.' : 'It summarizes context; it does not know the future.'} />;
}

function BreakoutChart({ styles, accepted }: { styles: ReturnType<typeof createStyles>; accepted: boolean }) { return <View style={styles.chart}><View style={styles.level}/><View style={[styles.path, accepted ? styles.pathAccepted : styles.pathWick]}/><Text style={styles.levelText}>RESISTANCE</Text></View>; }
function FalseBreakChart({ styles }: { styles: ReturnType<typeof createStyles> }) { return <View style={styles.chart}><View style={styles.level}/><View style={styles.falsePath}/><Text style={styles.levelText}>BREAK → RETURN</Text></View>; }
function PullbackChart({ styles }: { styles: ReturnType<typeof createStyles> }) { return <View style={styles.chart}><View style={styles.pull1}/><View style={styles.pull2}/><View style={styles.pull3}/><View style={styles.protected}><Text style={styles.protectedText}>HL</Text></View></View>; }
function RangeChart({ styles }: { styles: ReturnType<typeof createStyles> }) { return <View style={styles.chart}><View style={[styles.zone,styles.zoneTop]}/><View style={[styles.zone,styles.zoneBottom]}/><View style={styles.rangePath}/></View>; }
function MomentumCompare({ styles }: { styles: ReturnType<typeof createStyles> }) { return <View style={styles.row}><View style={styles.momentumCard}><View style={styles.steep}/><Text style={styles.cardLabel}>STRONGER</Text></View><View style={styles.momentumCard}><View style={styles.shallow}/><Text style={styles.cardLabel}>WEAKER</Text></View></View>; }
function MovingAverageChart({ styles }: { styles: ReturnType<typeof createStyles> }) { return <View style={styles.chart}><View style={styles.priceNoise}/><View style={styles.averageLine}/><Text style={styles.maLabel}>MA</Text></View>; }

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 14, padding: 14 },
  header: { gap: 4 }, title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' }, detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'stretch', gap: 9 },
  card: { flex: 1, minHeight: 82, justifyContent: 'center', gap: 7, padding: 9, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }, cardLabel: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '900', textAlign: 'center' }, cardValue: { color: theme.colors.text, fontSize: 12, fontWeight: '900', textAlign: 'center' }, success: { color: theme.colors.success }, warning: { color: theme.colors.warning }, risk: { color: theme.colors.risk },
  rule: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(45,212,191,0.22)', backgroundColor: 'rgba(45,212,191,0.06)' }, ruleWarning: { borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' }, ruleTitle: { color: theme.colors.primary, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' }, ruleDetail: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  chart: { minHeight: 118, position: 'relative', overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }, level: { position: 'absolute', left: 12, right: 12, top: 48, height: 2, backgroundColor: 'rgba(251,191,36,0.42)' }, levelText: { position: 'absolute', right: 12, top: 30, color: theme.colors.warning, fontSize: 8, fontWeight: '900' }, path: { position: 'absolute', left: 34, width: 100, borderTopWidth: 3, borderColor: theme.colors.primary, transform: [{ rotate: '-18deg' }] }, pathAccepted: { top: 54, height: 48 }, pathWick: { top: 63, height: 22 }, falsePath: { position: 'absolute', left: 40, top: 58, width: 130, height: 48, borderTopWidth: 3, borderRightWidth: 3, borderBottomWidth: 3, borderColor: theme.colors.warning, transform: [{ rotate: '-8deg' }] },
  pull1: { position: 'absolute', left: 20, top: 76, width: 70, borderTopWidth: 3, borderColor: theme.colors.primary, transform: [{ rotate: '-24deg' }] }, pull2: { position: 'absolute', left: 78, top: 64, width: 58, borderTopWidth: 3, borderColor: theme.colors.warning, transform: [{ rotate: '18deg' }] }, pull3: { position: 'absolute', left: 126, top: 54, width: 72, borderTopWidth: 3, borderColor: theme.colors.primary, transform: [{ rotate: '-20deg' }] }, protected: { position: 'absolute', left: 110, bottom: 20, width: 30, height: 22, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: 'rgba(45,212,191,0.10)' }, protectedText: { color: theme.colors.primary, fontSize: 8, fontWeight: '900' },
  zone: { position: 'absolute', left: 10, right: 10, height: 18, borderRadius: 6, backgroundColor: 'rgba(251,191,36,0.08)' }, zoneTop: { top: 17 }, zoneBottom: { bottom: 17 }, rangePath: { position: 'absolute', left: 22, right: 22, top: 52, height: 24, borderTopWidth: 3, borderBottomWidth: 3, borderColor: theme.colors.primary },
  momentumCard: { flex: 1, minHeight: 104, position: 'relative', justifyContent: 'flex-end', padding: 10, borderRadius: 12, backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border }, steep: { position: 'absolute', left: 26, bottom: 34, width: 86, borderTopWidth: 4, borderColor: theme.colors.success, transform: [{ rotate: '-34deg' }] }, shallow: { position: 'absolute', left: 24, bottom: 52, width: 90, borderTopWidth: 4, borderColor: theme.colors.warning, transform: [{ rotate: '-12deg' }] },
  priceNoise: { position: 'absolute', left: 18, top: 58, width: 170, borderTopWidth: 3, borderStyle: 'dashed', borderColor: theme.colors.textMuted, transform: [{ rotate: '-8deg' }] }, averageLine: { position: 'absolute', left: 24, top: 66, width: 160, borderTopWidth: 4, borderColor: theme.colors.primary, transform: [{ rotate: '-5deg' }] }, maLabel: { position: 'absolute', right: 16, top: 48, color: theme.colors.primary, fontSize: 9, fontWeight: '900' },
});
