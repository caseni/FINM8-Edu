import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type ChartSlideRole =
  | 'hook'
  | 'concept'
  | 'practice'
  | 'misconception'
  | 'risk'
  | 'summary';

type ChartTopic =
  | 'candles'
  | 'timeframes'
  | 'trend'
  | 'supportResistance'
  | 'bos'
  | 'choch';

export interface ChartLessonSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: ChartSlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): ChartTopic | undefined {
  if (assetRef.includes('bir-mum') || assetRef.includes('candle-ohlc')) return 'candles';
  if (assetRef.includes('zaman-dilimi') || assetRef.includes('timeframes')) return 'timeframes';
  if (assetRef.includes('trend-yon') || assetRef.includes('trend-structure')) return 'trend';
  if (assetRef.includes('destek-direnc') || assetRef.includes('support-resistance')) return 'supportResistance';
  if (assetRef.includes('bos-starter') || assetRef.includes('yapi-kirilimi-bos')) return 'bos';
  if (assetRef.includes('choch')) return 'choch';
  return undefined;
}

export function isChartLessonSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function ChartLessonSlideVisual({
  assetRef,
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: ChartLessonSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;

  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'candles' ? <CandleScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'timeframes' ? <TimeframeScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'trend' ? <TrendScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'supportResistance' ? <ZoneScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'bos' ? <BosScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'choch' ? <ChochScene role={role} tr={tr} styles={styles} /> : null}
      </View>
    </View>
  );
}

type SceneProps = {
  role: ChartSlideRole;
  tr: boolean;
  styles: ReturnType<typeof createStyles>;
};

function Header({ title, detail, styles }: { title: string; detail: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

function MiniCandle({ styles, bullish = true, tall = false }: { styles: ReturnType<typeof createStyles>; bullish?: boolean; tall?: boolean }) {
  return (
    <View style={styles.candleWrap}>
      <View style={[styles.wick, tall && styles.wickTall]} />
      <View style={[styles.candleBody, bullish ? styles.bullBody : styles.bearBody, tall && styles.bodyTall]} />
      <View style={[styles.wick, tall && styles.wickTall]} />
    </View>
  );
}

function CandleScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <>
        <Header title={tr ? 'Tek mum ne anlatır?' : 'What can one candle tell us?'} detail={tr ? 'Dört fiyatı taşır; geleceği değil.' : 'It carries four prices, not the future.'} styles={styles} />
        <View style={styles.centerRow}><MiniCandle styles={styles} tall /><Text style={styles.bigQuestion}>?</Text></View>
      </>
    );
  }
  if (role === 'concept') {
    return (
      <>
        <Header title="OHLC" detail={tr ? 'Açılış · En yüksek · En düşük · Kapanış' : 'Open · High · Low · Close'} styles={styles} />
        <View style={styles.centerRow}>
          <Text style={styles.edgeText}>{tr ? 'EN YÜKSEK' : 'HIGH'}</Text>
          <MiniCandle styles={styles} tall />
          <View style={styles.labelStack}><Text style={styles.primaryText}>{tr ? 'AÇILIŞ' : 'OPEN'}</Text><Text style={styles.primaryText}>{tr ? 'KAPANIŞ' : 'CLOSE'}</Text></View>
          <Text style={styles.edgeText}>{tr ? 'EN DÜŞÜK' : 'LOW'}</Text>
        </View>
      </>
    );
  }
  if (role === 'practice') {
    return (
      <>
        <Header title={tr ? 'Gövde mi, fitil mi?' : 'Body or wick?'} detail={tr ? 'Gövde başlangıç-bitişi; fitiller uçları gösterir.' : 'The body shows start-finish; wicks show extremes.'} styles={styles} />
        <View style={styles.twoCards}>
          <View style={styles.miniCard}><View style={[styles.candleBody, styles.bullBody, styles.practiceBody]} /><Text style={styles.cardLabel}>{tr ? 'GÖVDE' : 'BODY'}</Text></View>
          <View style={styles.miniCard}><View style={styles.practiceWick} /><Text style={styles.cardLabel}>{tr ? 'FİTİL' : 'WICK'}</Text></View>
        </View>
      </>
    );
  }
  if (role === 'misconception') {
    return (
      <>
        <Header title={tr ? 'Uzun yeşil = sonraki de yeşil?' : 'Long green = next one green too?'} detail={tr ? 'Hayır. Bir mum yalnız kendi dönemini kaydeder.' : 'No. One candle only records its own period.'} styles={styles} />
        <View style={styles.centerRow}><MiniCandle styles={styles} tall /><Text style={styles.arrow}>→</Text><View style={styles.unknownCandle}><Text style={styles.bigQuestion}>?</Text></View><Text style={styles.cross}>×</Text></View>
      </>
    );
  }
  if (role === 'risk') {
    return <RuleScene styles={styles} title={tr ? '1 MUM ≠ SİNYAL' : '1 CANDLE ≠ SIGNAL'} detail={tr ? 'Bağlam ve zaman dilimi olmadan yön çıkarma.' : 'Do not infer direction without context and timeframe.'} />;
  }
  return <RuleScene styles={styles} title="OHLC" detail={tr ? 'Mum = seçilen dönemin kaydı, tahmin değil.' : 'Candle = a record of the selected period, not a forecast.'} />;
}

function TimeframeScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <>
        <Header title={tr ? 'Aynı anda iki yön mümkün mü?' : 'Can two directions exist at once?'} detail={tr ? 'Kısa geri çekilme, geniş yükseliş yapısının içinde olabilir.' : 'A short pullback can sit inside a broader uptrend.'} styles={styles} />
        <View style={styles.timeRows}><TimeRow styles={styles} label="15m" direction="down" /><TimeRow styles={styles} label="1D" direction="up" /></View>
      </>
    );
  }
  if (role === 'concept') {
    return (
      <>
        <Header title={tr ? 'Ölçek değişir' : 'The scale changes'} detail={tr ? 'Her mumun kapsadığı süre değiştikçe görünen yapı da değişir.' : 'As candle duration changes, visible structure changes too.'} styles={styles} />
        <View style={styles.timeRows}><TimeRow styles={styles} label="15m" direction="mixed" /><TimeRow styles={styles} label="1h" direction="mixed" /><TimeRow styles={styles} label="1D" direction="up" /></View>
      </>
    );
  }
  if (role === 'practice') {
    return (
      <>
        <Header title={tr ? 'İki ifade birlikte doğru olabilir' : 'Two statements can both be true'} detail={tr ? '15m geri çekiliyor · 1D yapı korunuyor' : '15m is pulling back · 1D structure still holds'} styles={styles} />
        <View style={styles.twoCards}><StatusCard styles={styles} label="15m" value={tr ? 'GERİ ÇEKİLME' : 'PULLBACK'} tone="warning" /><StatusCard styles={styles} label="1D" value="HH / HL" tone="success" /></View>
      </>
    );
  }
  if (role === 'misconception') {
    return <RuleScene styles={styles} title={tr ? '15m ↓  ≠  HER YER ↓' : '15m ↓  ≠  ALL ↓'} detail={tr ? 'Bir zaman diliminin etiketini diğerlerine kopyalama.' : 'Do not copy one timeframe label to every other timeframe.'} danger />;
  }
  if (role === 'risk') {
    return <RuleScene styles={styles} title={tr ? '“TREND” TEK BAŞINA EKSİK' : '“TREND” ALONE IS INCOMPLETE'} detail={tr ? 'Yorumun hangi zaman dilimine ait olduğunu belirt.' : 'Always state which timeframe the view belongs to.'} />;
  }
  return <RuleScene styles={styles} title={tr ? 'YAPI + ZAMAN DİLİMİ' : 'STRUCTURE + TIMEFRAME'} detail={tr ? 'Ölçek değişince görünen yapı da değişebilir.' : 'When scale changes, visible structure can change.'} />;
}

function TrendScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <>
        <Header title={tr ? 'Bugün yükseldi = trend yükseliş mi?' : 'Price rose today = uptrend?'} detail={tr ? 'Tek hareket trend tanımlamaz.' : 'One move does not define a trend.'} styles={styles} />
        <View style={styles.centerRow}><MiniCandle styles={styles} tall /><Text style={styles.notEqual}>≠</Text><SwingStrip styles={styles} mode="up" /></View>
      </>
    );
  }
  if (role === 'concept') {
    return (
      <>
        <Header title={tr ? 'Trend bir salınım dizisidir' : 'Trend is a swing sequence'} detail={tr ? 'Yükseliş · Düşüş · Yatay' : 'Up · Down · Sideways'} styles={styles} />
        <View style={styles.threeCards}><SwingCard styles={styles} label={tr ? 'YÜKSELİŞ' : 'UP'} mode="up" /><SwingCard styles={styles} label={tr ? 'DÜŞÜŞ' : 'DOWN'} mode="down" /><SwingCard styles={styles} label={tr ? 'YATAY' : 'SIDE'} mode="side" /></View>
      </>
    );
  }
  if (role === 'practice') {
    return (
      <>
        <Header title={tr ? 'Ana yapı ve kısa hareketi ayır' : 'Separate main structure and short move'} detail={tr ? 'Geniş yapı ↑ · kısa geri çekilme ↓' : 'Broader structure ↑ · short pullback ↓'} styles={styles} />
        <View style={styles.twoCards}><SwingCard styles={styles} label={tr ? 'GENİŞ' : 'BROAD'} mode="up" /><SwingCard styles={styles} label={tr ? 'KISA' : 'SHORT'} mode="down" /></View>
      </>
    );
  }
  if (role === 'misconception') {
    return <RuleScene styles={styles} title={tr ? '“ÇOK YÜKSELDİ” ≠ DÖNÜŞ' : '“ROSE A LOT” ≠ REVERSAL'} detail={tr ? 'Fiyat seviyesi tek başına yapısal dönüş kanıtı değildir.' : 'Price level alone is not structural reversal evidence.'} danger />;
  }
  if (role === 'risk') {
    return <RuleScene styles={styles} title={tr ? 'ANA YAPIYA KARŞI = EK KANIT' : 'COUNTERTREND = EXTRA EVIDENCE'} detail={tr ? 'Karşı yön yorumu daha sıkı bağlam ve risk kontrolü ister.' : 'A countertrend view needs tighter context and risk control.'} />;
  }
  return <RuleScene styles={styles} title="HH + HL  /  LH + LL" detail={tr ? 'Trend tek mum değil, zaman içindeki fiyat yapısıdır.' : 'Trend is price structure through time, not one candle.'} />;
}

function ZoneScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <>
        <Header title={tr ? 'Tepkiler tek fiyata mı gelir?' : 'Do reactions hit one exact price?'} detail={tr ? 'Çoğu zaman yakın bir alan içinde kümelenir.' : 'They often cluster within a nearby area.'} styles={styles} />
        <ZoneDiagram styles={styles} points={[18, 27, 23, 31]} />
      </>
    );
  }
  if (role === 'concept') {
    return (
      <>
        <Header title={tr ? 'Çizgi değil, tepki alanı' : 'Not a line, a reaction area'} detail={tr ? 'Yakın fiyatlardaki tepkileri bölge olarak oku.' : 'Read nearby reactions as a zone.'} styles={styles} />
        <ZoneDiagram styles={styles} points={[22, 26, 20, 29, 24]} showLine />
      </>
    );
  }
  if (role === 'practice') {
    return (
      <>
        <Header title={tr ? 'Bölgeyi bağlamla daralt' : 'Refine the zone with context'} detail={tr ? 'Kısa zaman dilimi alanı netleştirebilir.' : 'A shorter timeframe can refine the area.'} styles={styles} />
        <View style={styles.twoCards}><StatusCard styles={styles} label="1D" value={tr ? 'GENİŞ ALAN' : 'BROAD ZONE'} tone="neutral" /><StatusCard styles={styles} label="1h" value={tr ? 'DAHA NET' : 'REFINED'} tone="success" /></View>
      </>
    );
  }
  if (role === 'misconception') {
    return <RuleScene styles={styles} title={tr ? 'ÇOK TEST = DAHA GÜÇLÜ?' : 'MORE TESTS = STRONGER?'} detail={tr ? 'Tek başına test sayısı gücü garanti etmez.' : 'Test count alone does not guarantee strength.'} danger />;
  }
  if (role === 'risk') {
    return <RuleScene styles={styles} title={tr ? 'BÖLGE GARANTİ DEĞİLDİR' : 'A ZONE IS NOT A GUARANTEE'} detail={tr ? 'Destek ve direnç kırılabilir; bağlam değişebilir.' : 'Support and resistance can break as context changes.'} />;
  }
  return <RuleScene styles={styles} title={tr ? 'ALAN + TEPKİ + BAĞLAM' : 'ZONE + REACTION + CONTEXT'} detail={tr ? 'Tek fiyat yerine tekrar eden tepki alanını oku.' : 'Read recurring reaction areas instead of one exact price.'} />;
}

function BosScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <>
        <Header title={tr ? 'Her seviye aşımı BOS mudur?' : 'Is every level break a BOS?'} detail={tr ? 'Fitil taşması ile teyit kapanışını ayır.' : 'Separate a wick overshoot from a confirming close.'} styles={styles} />
        <View style={styles.twoCards}><BreakCard styles={styles} label={tr ? 'FİTİL' : 'WICK'} confirmed={false} /><BreakCard styles={styles} label={tr ? 'KAPANIŞ' : 'CLOSE'} confirmed /></View>
      </>
    );
  }
  if (role === 'concept') {
    return (
      <>
        <Header title="BOS" detail={tr ? 'Anlamlı seviye + gerçek kırılım + bağlam' : 'Meaningful level + real break + context'} styles={styles} />
        <BreakCard styles={styles} label={tr ? 'ANLAMLI TEPE' : 'MEANINGFUL HIGH'} confirmed wide />
      </>
    );
  }
  if (role === 'practice') {
    return (
      <>
        <Header title={tr ? 'İç yapı mı, ana yapı mı?' : 'Internal or major structure?'} detail={tr ? 'Küçük kırılımı ana yapı kırılımı sanma.' : 'Do not mistake a minor break for a major structural break.'} styles={styles} />
        <View style={styles.twoCards}><StatusCard styles={styles} label={tr ? 'KÜÇÜK' : 'MINOR'} value={tr ? 'İÇ YAPI' : 'INTERNAL'} tone="warning" /><StatusCard styles={styles} label={tr ? 'ANLAMLI' : 'MAJOR'} value="BOS?" tone="success" /></View>
      </>
    );
  }
  if (role === 'misconception') {
    return <RuleScene styles={styles} title={tr ? 'HER KIRILIM ≠ BOS' : 'EVERY BREAK ≠ BOS'} detail={tr ? 'Kırılan seviyenin yapısal önemini kontrol et.' : 'Check the structural importance of the broken level.'} danger />;
  }
  if (role === 'risk') {
    return <RuleScene styles={styles} title={tr ? 'BOS ≠ İŞLEM TALİMATI' : 'BOS ≠ TRADE INSTRUCTION'} detail={tr ? 'Bir gözlemdir; risk ve diğer kanıtlar ayrıca değerlendirilir.' : 'It is an observation; risk and other evidence are assessed separately.'} />;
  }
  return <RuleScene styles={styles} title={tr ? 'SEVİYE + KAPANIŞ + BAĞLAM' : 'LEVEL + CLOSE + CONTEXT'} detail={tr ? 'BOS için üçü birlikte anlam taşır.' : 'All three matter when reading a BOS.'} />;
}

function ChochScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <>
        <Header title={tr ? 'Korunan dip kaybolursa?' : 'What if the protected low is lost?'} detail={tr ? 'Yapı değişmeye başlıyor olabilir.' : 'Structure may be starting to change.'} styles={styles} />
        <ProtectedLow styles={styles} broken />
      </>
    );
  }
  if (role === 'concept') {
    return (
      <>
        <Header title="CHoCH" detail={tr ? 'Mevcut karakterde olası değişimin erken işareti' : 'An early sign of possible structural change'} styles={styles} />
        <ProtectedLow styles={styles} broken />
      </>
    );
  }
  if (role === 'practice') {
    return (
      <>
        <Header title={tr ? 'İlk değişimden sonra ne?' : 'What after the first change?'} detail={tr ? 'Yeni yönde devam kanıtını bekle.' : 'Look for continuation evidence in the new direction.'} styles={styles} />
        <View style={styles.flowRow}><StatusCard styles={styles} label="1" value="CHoCH" tone="warning" /><Text style={styles.arrow}>→</Text><StatusCard styles={styles} label="2" value={tr ? 'TEYİT?' : 'CONFIRM?'} tone="success" /></View>
      </>
    );
  }
  if (role === 'misconception') {
    return <RuleScene styles={styles} title={tr ? 'CHoCH ≠ KESİN DÖNÜŞ' : 'CHoCH ≠ CERTAIN REVERSAL'} detail={tr ? 'Erken işaret, sonuç garantisi değildir.' : 'It is an early clue, not a guaranteed outcome.'} danger />;
  }
  if (role === 'risk') {
    return <RuleScene styles={styles} title={tr ? 'KÜÇÜK YAPI DEĞİŞEBİLİR' : 'SMALL STRUCTURE CAN CHANGE'} detail={tr ? 'Daha geniş yapı aynı anda korunuyor olabilir.' : 'The broader structure may still remain intact.'} />;
  }
  return <RuleScene styles={styles} title={tr ? 'ERKEN İŞARET · KESİNLİK DEĞİL' : 'EARLY CLUE · NOT CERTAINTY'} detail={tr ? 'CHoCH değişim ihtimalini görünür kılar.' : 'CHoCH makes a possible change visible.'} />;
}

function RuleScene({ styles, title, detail, danger = false }: { styles: ReturnType<typeof createStyles>; title: string; detail: string; danger?: boolean }) {
  return (
    <View style={[styles.ruleCard, danger && styles.ruleDanger]}>
      <Text style={[styles.ruleTitle, danger && styles.warningText]}>{title}</Text>
      <Text style={styles.ruleDetail}>{detail}</Text>
    </View>
  );
}

function TimeRow({ styles, label, direction }: { styles: ReturnType<typeof createStyles>; label: string; direction: 'up' | 'down' | 'mixed' }) {
  const bars = direction === 'up' ? [28, 38, 52, 64] : direction === 'down' ? [64, 52, 39, 28] : [38, 55, 45, 60];
  return (
    <View style={styles.timeRow}><Text style={styles.timeLabel}>{label}</Text><View style={styles.barLane}>{bars.map((height, index) => <View key={index} style={[styles.miniBar, { height }, direction === 'down' && styles.bearBar]} />)}</View></View>
  );
}

function StatusCard({ styles, label, value, tone }: { styles: ReturnType<typeof createStyles>; label: string; value: string; tone: 'warning' | 'success' | 'neutral' }) {
  return (
    <View style={styles.statusCard}><Text style={styles.statusLabel}>{label}</Text><Text style={[styles.statusValue, tone === 'warning' ? styles.warningText : tone === 'success' ? styles.successText : undefined]}>{value}</Text></View>
  );
}

function SwingStrip({ styles, mode }: { styles: ReturnType<typeof createStyles>; mode: 'up' | 'down' | 'side' }) {
  const values = mode === 'up' ? [10, 28, 20, 44, 34, 58] : mode === 'down' ? [58, 38, 46, 26, 34, 12] : [28, 42, 31, 40, 29, 38];
  return <View style={styles.swingStrip}>{values.map((bottom, index) => <View key={index} style={[styles.swingDot, { bottom }]} />)}</View>;
}

function SwingCard({ styles, label, mode }: { styles: ReturnType<typeof createStyles>; label: string; mode: 'up' | 'down' | 'side' }) {
  return <View style={styles.swingCard}><SwingStrip styles={styles} mode={mode} /><Text style={styles.cardLabel}>{label}</Text></View>;
}

function ZoneDiagram({ styles, points, showLine = false }: { styles: ReturnType<typeof createStyles>; points: number[]; showLine?: boolean }) {
  return (
    <View style={styles.zoneDiagram}><View style={styles.zoneBand} />{showLine ? <View style={styles.exactLine} /> : null}{points.map((left, index) => <View key={index} style={[styles.reactionDot, { left: `${left + index * 11}%`, top: index % 2 === 0 ? 63 : 78 }]} />)}</View>
  );
}

function BreakCard({ styles, label, confirmed, wide = false }: { styles: ReturnType<typeof createStyles>; label: string; confirmed: boolean; wide?: boolean }) {
  return (
    <View style={[styles.breakCard, wide && styles.breakWide]}><Text style={styles.statusLabel}>{label}</Text><View style={styles.levelLine} /><View style={[styles.breakMarker, confirmed ? styles.breakConfirmed : styles.breakWick]} /><Text style={[styles.breakResult, confirmed ? styles.successText : styles.warningText]}>{confirmed ? '✓ CLOSE' : 'WICK ?'}</Text></View>
  );
}

function ProtectedLow({ styles, broken }: { styles: ReturnType<typeof createStyles>; broken: boolean }) {
  return (
    <View style={styles.protectedCard}><View style={styles.protectedPath}><View style={[styles.pathDot, { bottom: 20, left: '8%' }]} /><View style={[styles.pathDot, { bottom: 48, left: '28%' }]} /><View style={[styles.pathDot, styles.protectedDot, { bottom: 31, left: '48%' }]} /><View style={[styles.pathDot, { bottom: 64, left: '68%' }]} /><View style={[styles.pathDot, broken && styles.brokenDot, { bottom: 18, left: '88%' }]} /></View><Text style={styles.cardLabel}>{broken ? 'PROTECTED LOW ↓' : 'PROTECTED LOW'}</Text></View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: {
      minHeight: 220,
      overflow: 'hidden',
      borderRadius: theme.radius.medium,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    canvas: { flex: 1, justifyContent: 'center', gap: 14, padding: 14 },
    header: { gap: 4 },
    title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' },
    detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
    centerRow: { minHeight: 106, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 },
    candleWrap: { alignItems: 'center' },
    wick: { width: 2, height: 17, borderRadius: 1, backgroundColor: 'rgba(159,176,195,0.78)' },
    wickTall: { height: 26 },
    candleBody: { width: 32, height: 42, borderRadius: 5, borderWidth: 1 },
    bodyTall: { width: 44, height: 58 },
    bullBody: { backgroundColor: 'rgba(45,212,191,0.14)', borderColor: 'rgba(45,212,191,0.48)' },
    bearBody: { backgroundColor: 'rgba(251,113,133,0.12)', borderColor: 'rgba(251,113,133,0.46)' },
    bigQuestion: { color: theme.colors.warning, fontSize: 31, fontWeight: '900' },
    edgeText: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
    labelStack: { gap: 10 },
    primaryText: { color: theme.colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.45 },
    twoCards: { flexDirection: 'row', gap: 10 },
    threeCards: { flexDirection: 'row', gap: 8 },
    miniCard: { flex: 1, minHeight: 86, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    practiceBody: { width: 28, height: 42 },
    practiceWick: { width: 2, height: 54, backgroundColor: 'rgba(159,176,195,0.82)' },
    cardLabel: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.55, textAlign: 'center' },
    arrow: { color: theme.colors.textMuted, fontSize: 21, fontWeight: '900' },
    unknownCandle: { width: 46, height: 78, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.border },
    cross: { color: theme.colors.risk, fontSize: 28, fontWeight: '900' },
    notEqual: { color: theme.colors.warning, fontSize: 25, fontWeight: '900' },
    ruleCard: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(45,212,191,0.22)', backgroundColor: 'rgba(45,212,191,0.06)' },
    ruleDanger: { borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' },
    ruleTitle: { color: theme.colors.primary, fontSize: 17, lineHeight: 22, fontWeight: '900', textAlign: 'center', letterSpacing: 0.3 },
    ruleDetail: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
    warningText: { color: theme.colors.warning },
    successText: { color: theme.colors.success },
    timeRows: { gap: 8 },
    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: theme.colors.surfaceMuted },
    timeLabel: { width: 30, color: theme.colors.text, fontSize: 10, fontWeight: '900' },
    barLane: { flex: 1, height: 67, flexDirection: 'row', alignItems: 'flex-end', gap: 7 },
    miniBar: { flex: 1, maxWidth: 24, borderRadius: 4, backgroundColor: 'rgba(45,212,191,0.34)' },
    bearBar: { backgroundColor: 'rgba(251,113,133,0.28)' },
    statusCard: { flex: 1, minHeight: 84, justifyContent: 'center', gap: 7, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    statusLabel: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
    statusValue: { color: theme.colors.text, fontSize: 13, fontWeight: '900' },
    swingStrip: { width: 92, height: 72, position: 'relative' },
    swingDot: { position: 'absolute', width: 8, height: 8, marginLeft: -4, borderRadius: 4, backgroundColor: theme.colors.primary },
    swingCard: { flex: 1, minHeight: 106, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    zoneDiagram: { height: 115, position: 'relative', overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    zoneBand: { position: 'absolute', left: '5%', right: '5%', top: 57, height: 34, borderRadius: 10, backgroundColor: 'rgba(45,212,191,0.10)', borderWidth: 1, borderColor: 'rgba(45,212,191,0.28)' },
    exactLine: { position: 'absolute', left: '5%', right: '5%', top: 73, height: 1, backgroundColor: 'rgba(251,191,36,0.72)' },
    reactionDot: { position: 'absolute', width: 11, height: 11, borderRadius: 6, backgroundColor: theme.colors.primary, borderWidth: 2, borderColor: theme.colors.background },
    breakCard: { flex: 1, minHeight: 112, position: 'relative', justifyContent: 'space-between', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    breakWide: { flex: 0, width: '100%' },
    levelLine: { height: 1, backgroundColor: 'rgba(159,176,195,0.56)' },
    breakMarker: { position: 'absolute', width: 14, height: 46, right: 28, top: 30, borderRadius: 4, borderWidth: 1 },
    breakConfirmed: { bottom: 0, backgroundColor: 'rgba(45,212,191,0.18)', borderColor: 'rgba(45,212,191,0.52)' },
    breakWick: { backgroundColor: 'rgba(251,191,36,0.10)', borderColor: 'rgba(251,191,36,0.50)' },
    breakResult: { fontSize: 10, fontWeight: '900', letterSpacing: 0.4 },
    flowRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    protectedCard: { minHeight: 116, gap: 4, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    protectedPath: { flex: 1, minHeight: 80, position: 'relative' },
    pathDot: { position: 'absolute', width: 10, height: 10, marginLeft: -5, borderRadius: 5, backgroundColor: theme.colors.primary },
    protectedDot: { borderWidth: 2, borderColor: theme.colors.warning, backgroundColor: theme.colors.background },
    brokenDot: { backgroundColor: theme.colors.risk },
  });
