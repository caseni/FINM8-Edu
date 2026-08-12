import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic = 'chart' | 'timeframes' | 'trend' | 'zones' | 'momentum' | 'average';

type Props = {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
};

type SceneProps = {
  tr: boolean;
  role: LessonSupportingVisualRole;
  styles: ReturnType<typeof createStyles>;
};

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('bir-mum-bize-ne-soyler')) return 'chart';
  if (assetRef.includes('zaman-dilimi-neyi-degistirir')) return 'timeframes';
  if (assetRef.includes('trend-yon-mu-yapi-mi')) return 'trend';
  if (assetRef.includes('destek-direnc-bolgedir')) return 'zones';
  if (assetRef.includes('momentum-ne-anlatir')) return 'momentum';
  if (assetRef.includes('hareketli-ortalama-ne-yapar')) return 'average';
  return undefined;
}

export function isBeginnerChartStoryAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function BeginnerChartStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: Props) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme, role === 'practice');
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {topic === 'chart' ? <ChartStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'timeframes' ? <TimeframeStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'trend' ? <TrendStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'zones' ? <ZoneStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'momentum' ? <MomentumStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'average' ? <AverageStory tr={tr} role={role} styles={styles} /> : null}
    </View>
  );
}

function Heading({ styles, title, body }: { styles: ReturnType<typeof createStyles>; title: string; body?: string }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingTitle}>{title}</Text>
      {body ? <Text style={styles.headingBody}>{body}</Text> : null}
    </View>
  );
}

function PriceBars({ styles, values, muted = false, highlightLast = false }: { styles: ReturnType<typeof createStyles>; values: readonly number[]; muted?: boolean; highlightLast?: boolean }) {
  return (
    <View style={styles.priceBars}>
      {values.map((value, index) => (
        <View key={`${value}-${index}`} style={styles.priceBarSlot}>
          <View style={[styles.priceBar, { height: value }, muted && styles.priceBarMuted, highlightLast && index === values.length - 1 && styles.priceBarHighlight]} />
        </View>
      ))}
    </View>
  );
}

function Candle({ styles, up = true, tall = false }: { styles: ReturnType<typeof createStyles>; up?: boolean; tall?: boolean }) {
  return (
    <View style={[styles.candleWrap, tall && styles.candleWrapTall]}>
      <View style={styles.candleWick} />
      <View style={[styles.candleBody, up ? styles.candleUp : styles.candleDown, tall && styles.candleBodyTall]} />
      <View style={styles.candleWick} />
    </View>
  );
}

function ChartStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Grafik, fiyatın zaman içindeki kaydıdır' : 'A chart records price over time'} />
        <View style={styles.timelineCard}>
          <View style={styles.axisY}><Text style={styles.axisLabel}>{tr ? 'FİYAT' : 'PRICE'}</Text></View>
          <View style={styles.timelinePlot}><PriceBars styles={styles} values={[26, 39, 32, 48, 44, 62, 55, 72]} /><View style={styles.timeAxis}><Text style={styles.timeText}>{tr ? 'ÖNCE' : 'EARLIER'}</Text><View style={styles.timeLine} /><Text style={styles.timeText}>{tr ? 'ŞİMDİ' : 'NOW'}</Text></View></View>
        </View>
      </View>
    );
  }

  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Bir mum, tek bir zaman parçasını özetler' : 'One candle summarizes one slice of time'} />
        <View style={styles.candleStudy}>
          <View style={styles.candleLabelsLeft}><Text style={styles.partLabel}>{tr ? 'EN YÜKSEK' : 'HIGH'}</Text><Text style={styles.partLabel}>{tr ? 'BİTİŞ' : 'FINISH'}</Text></View>
          <View style={styles.bigCandle}><View style={styles.bigWick} /><View style={styles.bigBody} /><View style={styles.bigWick} /></View>
          <View style={styles.candleLabelsRight}><Text style={styles.partLabel}>{tr ? 'BAŞLANGIÇ' : 'START'}</Text><Text style={styles.partLabel}>{tr ? 'EN DÜŞÜK' : 'LOW'}</Text></View>
        </View>
      </View>
    );
  }

  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Bir saatlik hareket, tek mumda özetlenebilir' : 'One hour of movement can be summarized in one candle'} body={tr ? 'Mumun rengi değil, içerdiği dört fiyat önemlidir.' : 'The four prices matter more than the candle color.'} />
        <View style={styles.candlePractice}>
          <View style={styles.smallCandleSequence}>{[true, true, false, true, false, true].map((up, i) => <Candle key={i} styles={styles} up={up} />)}</View>
          <View style={styles.practiceArrow}><Text style={styles.practiceArrowText}>›</Text></View>
          <View style={styles.summaryCandleCard}><Candle styles={styles} tall /><Text style={styles.summaryCandleText}>{tr ? '1 ZAMAN PARÇASI' : '1 TIME SLICE'}</Text></View>
        </View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Yeşil mum = gelecek de yeşil demek değildir' : 'A green candle does not mean the future is green'} />
        <View style={styles.futureStage}><View style={styles.pastCard}><Text style={styles.microLabel}>{tr ? 'OLUŞTU' : 'HAPPENED'}</Text><Candle styles={styles} tall /></View><View style={styles.futureArrow}><Text style={styles.futureArrowText}>›</Text></View><View style={styles.futureCard}><Text style={styles.microLabel}>{tr ? 'SONRA?' : 'NEXT?'}</Text><Text style={styles.questionMark}>?</Text></View></View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Grafik = zaman içinde oluşmuş fiyat kaydı' : 'Chart = a price record across time'} />
      <View style={styles.recordSummary}><View style={styles.recordBlock}><Text style={styles.recordIcon}>1</Text><Text style={styles.recordText}>{tr ? 'ZAMAN' : 'TIME'}</Text></View><View style={styles.summaryLink} /><View style={styles.recordBlock}><Text style={styles.recordIcon}>2</Text><Text style={styles.recordText}>{tr ? 'FİYAT' : 'PRICE'}</Text></View><View style={styles.summaryLink} /><View style={[styles.recordBlock, styles.recordBlockAccent]}><Text style={styles.recordIcon}>3</Text><Text style={styles.recordText}>{tr ? 'KAYIT' : 'RECORD'}</Text></View></View>
    </View>
  );
}

function TimeframeStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Yakından başka, uzaktan başka görünebilir' : 'Close-up and broad views can look different'} />
        <View style={styles.zoomCompare}><View style={styles.zoomCard}><Text style={styles.microLabel}>{tr ? 'YAKIN' : 'CLOSE'}</Text><PriceBars styles={styles} values={[54, 42, 35, 46, 32, 29]} /></View><View style={styles.zoomCard}><Text style={styles.microLabel}>{tr ? 'UZAK' : 'BROAD'}</Text><PriceBars styles={styles} values={[28, 34, 39, 46, 53, 60]} /></View></View>
      </View>
    );
  }

  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Dört küçük zaman parçası, bir büyük parçaya dönüşür' : 'Four small time slices can become one larger slice'} />
        <View style={styles.aggregateStage}><View style={styles.aggregateCandles}>{[true, false, true, true].map((up, i) => <Candle key={i} styles={styles} up={up} />)}</View><View style={styles.aggregateArrow}><Text style={styles.aggregateArrowText}>›</Text></View><View style={styles.aggregateBig}><Candle styles={styles} tall /><Text style={styles.aggregateText}>4 × 15 dk = 1 saat</Text></View></View>
      </View>
    );
  }

  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Aynı anda iki gözlem de doğru olabilir' : 'Two observations can be true at the same time'} />
        <View style={styles.zoomCompare}><View style={[styles.zoomCard, styles.zoomCardWarning]}><Text style={styles.zoomTitle}>{tr ? '15 DAKİKA' : '15 MIN'}</Text><PriceBars styles={styles} values={[62, 55, 46, 39, 34]} /><Text style={styles.zoomResult}>{tr ? 'Kısa düşüş' : 'Short decline'}</Text></View><View style={[styles.zoomCard, styles.zoomCardAccent]}><Text style={styles.zoomTitle}>{tr ? 'GÜNLÜK' : 'DAILY'}</Text><PriceBars styles={styles} values={[28, 36, 43, 49, 58]} /><Text style={styles.zoomResultGood}>{tr ? 'Geniş yükseliş' : 'Broad rise'}</Text></View></View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Kısa düşüş, büyük resmi otomatik silmez' : 'A short decline does not automatically erase the broad picture'} />
        <View style={styles.overlayScale}><View style={styles.broadPath}><PriceBars styles={styles} values={[22, 31, 39, 46, 55, 62, 70]} /></View><View style={styles.closeWindow}><Text style={styles.microLabel}>{tr ? 'YAKINLAŞTIRILAN BÖLÜM' : 'ZOOMED SECTION'}</Text><PriceBars styles={styles} values={[58, 49, 43, 38]} muted /></View></View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Ölçek değişince görünüm değişir' : 'Change the scale, change the view'} />
      <View style={styles.scaleSummary}><View style={styles.scaleChip}><Text style={styles.scaleChipBig}>15</Text><Text style={styles.microLabel}>{tr ? 'DAKİKA' : 'MIN'}</Text></View><View style={styles.scaleConnector} /><View style={styles.scaleChip}><Text style={styles.scaleChipBig}>1</Text><Text style={styles.microLabel}>{tr ? 'SAAT' : 'HOUR'}</Text></View><View style={styles.scaleConnector} /><View style={[styles.scaleChip, styles.scaleChipAccent]}><Text style={styles.scaleChipBig}>1</Text><Text style={styles.microLabel}>{tr ? 'GÜN' : 'DAY'}</Text></View></View>
    </View>
  );
}

function TrendCard({ styles, label, values, accent = false }: { styles: ReturnType<typeof createStyles>; label: string; values: readonly number[]; accent?: boolean }) {
  return <View style={[styles.trendCard, accent && styles.trendCardAccent]}><PriceBars styles={styles} values={values} /><Text style={styles.trendLabel}>{label}</Text></View>;
}

function TrendStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Bir günlük yükseliş, genel yönü tek başına anlatmaz' : 'One up day does not define the broader direction'} />
        <View style={styles.oneVsMany}><View style={styles.oneMove}><Text style={styles.microLabel}>{tr ? 'BUGÜN' : 'TODAY'}</Text><Candle styles={styles} tall /></View><View style={styles.notEqual}><Text style={styles.notEqualText}>≠</Text></View><View style={styles.manyMoves}><Text style={styles.microLabel}>{tr ? 'GENEL YOL' : 'BROADER PATH'}</Text><PriceBars styles={styles} values={[62, 55, 49, 43, 36, 31]} /></View></View>
      </View>
    );
  }

  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Üç temel görünüm' : 'Three basic views'} />
        <View style={styles.trendRow}><TrendCard styles={styles} label={tr ? 'YUKARI' : 'UP'} values={[20, 28, 36, 45, 55]} accent /><TrendCard styles={styles} label={tr ? 'AŞAĞI' : 'DOWN'} values={[58, 50, 42, 33, 25]} /><TrendCard styles={styles} label={tr ? 'YATAY' : 'SIDEWAYS'} values={[38, 44, 36, 43, 39]} /></View>
      </View>
    );
  }

  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Tepeler ve dipler birlikte yukarı taşınıyor' : 'Highs and lows are both moving higher'} />
        <View style={styles.swingStage}><PriceBars styles={styles} values={[20, 42, 30, 55, 41, 68, 53, 78]} /><View style={styles.swingLabels}><Text style={styles.swingText}>{tr ? 'daha yüksek dip' : 'higher low'}</Text><Text style={styles.swingText}>{tr ? 'daha yüksek tepe' : 'higher high'}</Text></View></View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Son mum kırmızı olsa da genel yol yukarı olabilir' : 'The broader path can still be up even if the last candle is red'} />
        <View style={styles.lastCandleStage}><PriceBars styles={styles} values={[22, 32, 40, 51, 61, 70]} /><View style={styles.lastRed}><Candle styles={styles} up={false} tall /></View></View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Trend = zaman içindeki genel ilerleyiş' : 'Trend = broader progression over time'} />
      <View style={styles.trendSummary}><Text style={styles.trendSummaryArrow}>↗</Text><Text style={styles.trendSummaryLabel}>{tr ? 'YUKARI' : 'UP'}</Text><Text style={styles.trendSummaryArrow}>↘</Text><Text style={styles.trendSummaryLabel}>{tr ? 'AŞAĞI' : 'DOWN'}</Text><Text style={styles.trendSummaryArrow}>→</Text><Text style={styles.trendSummaryLabel}>{tr ? 'YATAY' : 'SIDEWAYS'}</Text></View>
    </View>
  );
}

function ZoneStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Fiyat bazı alanlara gelince tekrar tepki verebilir' : 'Price can react again around familiar areas'} />
        <View style={styles.zoneChart}><View style={styles.upperZone} /><View style={styles.lowerZone} /><PriceBars styles={styles} values={[34, 60, 43, 67, 40, 63, 37]} /></View>
      </View>
    );
  }

  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Tek çizgi değil, yaklaşık tepki alanı' : 'An approximate reaction area, not one perfect line'} />
        <View style={styles.zoneExplain}><View style={styles.zoneBand}><Text style={styles.zoneBandText}>{tr ? 'ÜST TEPKİ ALANI' : 'UPPER REACTION AREA'}</Text></View><PriceBars styles={styles} values={[35, 59, 44, 62, 39, 57]} /><View style={[styles.zoneBand, styles.zoneBandLower]}><Text style={styles.zoneBandText}>{tr ? 'ALT TEPKİ ALANI' : 'LOWER REACTION AREA'}</Text></View></View>
      </View>
    );
  }

  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Aynı bölgede birkaç tepki birikir' : 'Several reactions cluster around the same area'} />
        <View style={styles.reactionStage}><View style={styles.reactionZone} /><PriceBars styles={styles} values={[28, 48, 31, 55, 33, 52, 30, 58]} /><View style={styles.reactionDots}>{[0, 1, 2].map((i) => <View key={i} style={styles.reactionDot} />)}</View></View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Bölge bir duvar değildir' : 'A zone is not a wall'} />
        <View style={styles.wallCompare}><View style={styles.wallCard}><Text style={styles.microLabel}>{tr ? 'YANLIŞ FİKİR' : 'WRONG IDEA'}</Text><View style={styles.hardWall} /><Text style={styles.wallCaption}>{tr ? '“Buradan geçemez”' : '“Cannot pass”'}</Text></View><View style={[styles.wallCard, styles.wallCardAccent]}><Text style={styles.microLabel}>{tr ? 'DAHA DOĞRU' : 'BETTER'}</Text><View style={styles.softZone} /><Text style={styles.wallCaption}>{tr ? '“Burada tepki olabilir”' : '“Reaction may happen here”'}</Text></View></View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Destek ve direnç = geçmiş tepki bölgeleri' : 'Support and resistance = past reaction areas'} />
      <View style={styles.zoneSummary}><View style={styles.summaryZoneTop}><Text style={styles.zoneSummaryText}>{tr ? 'DİRENÇ' : 'RESISTANCE'}</Text></View><View style={styles.summaryZoneSpace} /><View style={styles.summaryZoneBottom}><Text style={styles.zoneSummaryText}>{tr ? 'DESTEK' : 'SUPPORT'}</Text></View></View>
    </View>
  );
}

function MomentumStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Yön aynı kalırken hız değişebilir' : 'Speed can change while direction stays the same'} />
        <View style={styles.speedCompare}><TrendCard styles={styles} label={tr ? 'HIZLI' : 'FAST'} values={[18, 33, 50, 68, 84]} accent /><TrendCard styles={styles} label={tr ? 'YAVAŞ' : 'SLOW'} values={[20, 26, 32, 38, 44]} /></View>
      </View>
    );
  }

  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Momentum, hareketin hızını ve ısrarını anlatır' : 'Momentum describes speed and persistence'} />
        <View style={styles.momentumMeter}><View style={styles.meterTrack}><View style={styles.meterFill} /></View><View style={styles.meterLabels}><Text style={styles.meterText}>{tr ? 'YAVAŞ' : 'SLOW'}</Text><Text style={styles.meterText}>{tr ? 'HIZLI' : 'FAST'}</Text></View></View>
      </View>
    );
  }

  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Fiyat hâlâ yükseliyor, ama adımlar küçülüyor' : 'Price still rises, but each step is getting smaller'} />
        <View style={styles.fadingSteps}>{[22, 42, 58, 69, 76, 80].map((height, i) => <View key={i} style={[styles.fadingBar, { height }]} />)}</View><Text style={styles.bottomNote}>{tr ? 'Yükseliş momentumu zayıflıyor olabilir.' : 'Upward momentum may be weakening.'}</Text>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Hızlı hareket, sonsuza kadar devam garantisi değildir' : 'A fast move does not guarantee endless continuation'} />
        <View style={styles.speedFuture}><View style={styles.speedNow}><PriceBars styles={styles} values={[20, 40, 65, 82]} /></View><View style={styles.futureArrow}><Text style={styles.futureArrowText}>›</Text></View><View style={styles.futureCard}><Text style={styles.questionMark}>?</Text></View></View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Momentum = hareketin hızı, yön garantisi değil' : 'Momentum = speed of movement, not a direction guarantee'} />
      <View style={styles.momentumSummary}><Text style={styles.momentumSummarySpeed}>FAST</Text><View style={styles.momentumSummaryLine} /><Text style={styles.momentumSummaryQuestion}>?</Text></View>
    </View>
  );
}

function AverageStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Yumuşak çizgi, geçmiş fiyatlardan oluşur' : 'The smooth line is built from past prices'} />
        <View style={styles.averageChart}><PriceBars styles={styles} values={[25, 50, 34, 61, 45, 70, 55, 76]} /><View style={styles.smoothLine}><View style={[styles.avgSegment, { width: '28%' }]} /><View style={[styles.avgSegment, styles.avgSegment2, { width: '30%' }]} /><View style={[styles.avgSegment, styles.avgSegment3, { width: '28%' }]} /></View></View>
      </View>
    );
  }

  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Geçmiş fiyatlar toplanır, daha sakin bir çizgi oluşur' : 'Past prices are combined into a smoother line'} />
        <View style={styles.averageFormula}><View style={styles.pastNumbers}>{['98', '101', '100', '103'].map((v) => <View key={v} style={styles.numberChip}><Text style={styles.numberText}>{v}</Text></View>)}</View><Text style={styles.averageEquals}>→</Text><View style={styles.averageResult}><Text style={styles.microLabel}>{tr ? 'ORTALAMA' : 'AVERAGE'}</Text><Text style={styles.averageResultValue}>100,5</Text></View></View>
      </View>
    );
  }

  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Daha uzun ortalama daha yumuşak tepki verir' : 'A longer average reacts more smoothly'} />
        <View style={styles.averageCompare}><View style={styles.avgCard}><Text style={styles.microLabel}>{tr ? 'KISA' : 'SHORT'}</Text><View style={styles.avgLineFast}><View style={styles.avgFastA} /><View style={styles.avgFastB} /><View style={styles.avgFastC} /></View><Text style={styles.avgCaption}>{tr ? 'Fiyata daha yakın' : 'Closer to price'}</Text></View><View style={[styles.avgCard, styles.avgCardAccent]}><Text style={styles.microLabel}>{tr ? 'UZUN' : 'LONG'}</Text><View style={styles.avgLineSlow} /><Text style={styles.avgCaption}>{tr ? 'Daha yumuşak' : 'Smoother'}</Text></View></View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Fiyat çizgiyi geçti diye gelecek kesinleşmez' : 'Crossing the line does not make the future certain'} />
        <View style={styles.crossStage}><View style={styles.crossChart}><View style={styles.crossAverage} /><View style={styles.crossPriceA} /><View style={styles.crossPriceB} /><View style={styles.crossDot} /></View><View style={styles.futureArrow}><Text style={styles.futureArrowText}>›</Text></View><View style={styles.futureCard}><Text style={styles.questionMark}>?</Text></View></View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Hareketli ortalama geçmişi sadeleştirir; geleceği bilmez' : 'A moving average simplifies the past; it does not know the future'} />
      <View style={styles.averageSummary}><View style={styles.summaryPast}><Text style={styles.microLabel}>{tr ? 'GEÇMİŞ FİYAT' : 'PAST PRICE'}</Text><PriceBars styles={styles} values={[20, 42, 31, 52, 44]} /></View><Text style={styles.summaryArrowText}>→</Text><View style={styles.summarySmooth}><Text style={styles.microLabel}>{tr ? 'YUMUŞAK ÖZET' : 'SMOOTH SUMMARY'}</Text><View style={styles.avgLineSlow} /></View></View>
    </View>
  );
}

const createStyles = (theme: LearningTheme, practice: boolean) => StyleSheet.create({
  shell: { width: '100%', minHeight: practice ? 390 : 240, justifyContent: 'center', borderRadius: 18, borderWidth: 1, borderColor: '#27465C', backgroundColor: '#081726', padding: practice ? 18 : 15, overflow: 'hidden' },
  story: { width: '100%', gap: 16, justifyContent: 'center' },
  heading: { gap: 5 },
  headingTitle: { color: theme.colors.text, fontSize: practice ? 20 : 17, lineHeight: practice ? 27 : 23, fontWeight: '900' },
  headingBody: { color: '#879CAE', fontSize: 11, lineHeight: 16 },
  microLabel: { color: '#8EA3B4', fontSize: 8, lineHeight: 11, fontWeight: '900', letterSpacing: 0.55, textAlign: 'center' },
  bottomNote: { color: '#90A5B4', fontSize: 11, lineHeight: 16, textAlign: 'center' },
  priceBars: { height: 92, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4 },
  priceBarSlot: { flex: 1, height: 90, justifyContent: 'flex-end' },
  priceBar: { width: '100%', minHeight: 6, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: '#43CDBD' },
  priceBarMuted: { backgroundColor: '#718697' },
  priceBarHighlight: { backgroundColor: '#74E7D7' },
  timelineCard: { minHeight: 145, flexDirection: 'row', gap: 10, padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#29495D', backgroundColor: '#0D2030' },
  axisY: { width: 28, alignItems: 'center', justifyContent: 'center' },
  axisLabel: { color: '#8197A8', fontSize: 8, fontWeight: '900', transform: [{ rotate: '-90deg' }] },
  timelinePlot: { flex: 1, gap: 8 },
  timeAxis: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeText: { color: '#73899B', fontSize: 7, fontWeight: '900' },
  timeLine: { flex: 1, height: 1, backgroundColor: '#2A475B' },
  candleStudy: { minHeight: 155, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 },
  candleLabelsLeft: { height: 132, justifyContent: 'space-between', alignItems: 'flex-end' },
  candleLabelsRight: { height: 132, justifyContent: 'space-around' },
  partLabel: { color: '#8EA4B4', fontSize: 8, fontWeight: '900' },
  bigCandle: { width: 62, height: 145, alignItems: 'center', justifyContent: 'center' },
  bigWick: { width: 3, height: 33, backgroundColor: '#78DCCF' },
  bigBody: { width: 48, height: 58, borderRadius: 7, backgroundColor: '#25AFA2', borderWidth: 1, borderColor: '#63E2D1' },
  candleWrap: { width: 22, height: 54, alignItems: 'center', justifyContent: 'center' },
  candleWrapTall: { width: 48, height: 120 },
  candleWick: { width: 2, flex: 1, minHeight: 7, backgroundColor: '#7D94A5' },
  candleBody: { width: 15, height: 23, borderRadius: 3 },
  candleBodyTall: { width: 34, height: 54, borderRadius: 6 },
  candleUp: { backgroundColor: '#35CBBB', borderWidth: 1, borderColor: '#75E6D8' },
  candleDown: { backgroundColor: '#9B6C6A', borderWidth: 1, borderColor: '#C08D87' },
  candlePractice: { minHeight: 190, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  smallCandleSequence: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', padding: 10, borderRadius: 14, backgroundColor: '#0D2030', borderWidth: 1, borderColor: '#29485B' },
  practiceArrow: { width: 30, alignItems: 'center' },
  practiceArrowText: { color: '#54D9C8', fontSize: 28, fontWeight: '900' },
  summaryCandleCard: { width: 94, minHeight: 155, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 15, borderWidth: 1, borderColor: '#2C736D', backgroundColor: '#0C2E33' },
  summaryCandleText: { color: '#9CC5C1', fontSize: 7, fontWeight: '900', textAlign: 'center' },
  futureStage: { minHeight: 150, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  pastCard: { width: 105, minHeight: 125, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 15, borderWidth: 1, borderColor: '#2C746E', backgroundColor: '#0D2D33' },
  futureCard: { width: 105, minHeight: 125, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 15, borderWidth: 1, borderColor: '#4D4A56', backgroundColor: '#171F2D' },
  futureArrow: { width: 35, alignItems: 'center' },
  futureArrowText: { color: '#728798', fontSize: 25, fontWeight: '900' },
  questionMark: { color: '#D8E2E8', fontSize: 36, fontWeight: '900' },
  recordSummary: { minHeight: 130, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  recordBlock: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 3, borderWidth: 1, borderColor: '#304C60', backgroundColor: '#0F2232' },
  recordBlockAccent: { borderColor: '#2F7E76', backgroundColor: '#0D3034' },
  recordIcon: { color: '#62E0D0', fontSize: 18, fontWeight: '900' },
  recordText: { color: '#A6B8C4', fontSize: 8, fontWeight: '900' },
  summaryLink: { width: 28, height: 2, backgroundColor: '#326E6C' },
  zoomCompare: { flexDirection: 'row', gap: 9 },
  zoomCard: { flex: 1, minHeight: 155, justifyContent: 'center', gap: 9, padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#2E495D', backgroundColor: '#0D2030' },
  zoomCardWarning: { borderColor: '#655257', backgroundColor: '#211E2A' },
  zoomCardAccent: { borderColor: '#2C766F', backgroundColor: '#0D2C32' },
  zoomTitle: { color: '#A3B5C1', fontSize: 9, fontWeight: '900', textAlign: 'center' },
  zoomResult: { color: '#C9A08B', fontSize: 10, fontWeight: '800', textAlign: 'center' },
  zoomResultGood: { color: '#62DCCC', fontSize: 10, fontWeight: '800', textAlign: 'center' },
  aggregateStage: { minHeight: 155, flexDirection: 'row', alignItems: 'center', gap: 10 },
  aggregateCandles: { flex: 1, minHeight: 115, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderRadius: 14, borderWidth: 1, borderColor: '#2B495C', backgroundColor: '#0E2030' },
  aggregateArrow: { width: 30, alignItems: 'center' },
  aggregateArrowText: { color: '#53DAC9', fontSize: 28, fontWeight: '900' },
  aggregateBig: { width: 90, minHeight: 135, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 14, borderWidth: 1, borderColor: '#2B746E', backgroundColor: '#0C2E33' },
  aggregateText: { color: '#88B4B0', fontSize: 8, fontWeight: '800', textAlign: 'center' },
  overlayScale: { minHeight: 165, position: 'relative', justifyContent: 'center' },
  broadPath: { padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#2B4B5F', backgroundColor: '#0D2030' },
  closeWindow: { position: 'absolute', right: 8, bottom: 5, width: 130, padding: 10, borderRadius: 13, borderWidth: 1, borderColor: '#6B5359', backgroundColor: '#211E2B' },
  scaleSummary: { minHeight: 125, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  scaleChip: { width: 70, height: 70, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 2, borderWidth: 1, borderColor: '#304C60', backgroundColor: '#0F2232' },
  scaleChipAccent: { borderColor: '#2F7A73', backgroundColor: '#0D3034' },
  scaleChipBig: { color: '#F1F6F9', fontSize: 20, fontWeight: '900' },
  scaleConnector: { width: 25, height: 2, backgroundColor: '#326E6C' },
  trendRow: { flexDirection: 'row', gap: 7 },
  trendCard: { flex: 1, minHeight: 145, justifyContent: 'space-between', gap: 8, padding: 8, borderRadius: 14, borderWidth: 1, borderColor: '#2E485B', backgroundColor: '#0E2030' },
  trendCardAccent: { borderColor: '#2D766F', backgroundColor: '#0D2C32' },
  trendLabel: { color: '#A8B8C3', fontSize: 8, fontWeight: '900', textAlign: 'center' },
  oneVsMany: { minHeight: 150, flexDirection: 'row', alignItems: 'center', gap: 9 },
  oneMove: { width: 85, minHeight: 130, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 14, borderWidth: 1, borderColor: '#2C746E', backgroundColor: '#0D2D33' },
  notEqual: { width: 30, alignItems: 'center' },
  notEqualText: { color: '#C5D2DC', fontSize: 22, fontWeight: '900' },
  manyMoves: { flex: 1, minHeight: 130, justifyContent: 'center', gap: 6, padding: 10, borderRadius: 14, borderWidth: 1, borderColor: '#564A54', backgroundColor: '#1C1E2B' },
  swingStage: { minHeight: 205, justifyContent: 'center', gap: 8, padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#2C746E', backgroundColor: '#0D2B31' },
  swingLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  swingText: { color: '#85B7B1', fontSize: 9, fontWeight: '800' },
  lastCandleStage: { minHeight: 155, position: 'relative', justifyContent: 'center', paddingRight: 55, paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: '#2B4B5F', backgroundColor: '#0D2030' },
  lastRed: { position: 'absolute', right: 13, top: 20 },
  trendSummary: { minHeight: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  trendSummaryArrow: { color: '#5BDFCE', fontSize: 26, fontWeight: '900' },
  trendSummaryLabel: { color: '#A8BAC5', fontSize: 8, fontWeight: '900' },
  zoneChart: { minHeight: 170, position: 'relative', justifyContent: 'center', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#2B4B5F', backgroundColor: '#0D2030', overflow: 'hidden' },
  upperZone: { position: 'absolute', top: 22, left: 0, right: 0, height: 30, backgroundColor: '#503D4A', opacity: 0.62 },
  lowerZone: { position: 'absolute', bottom: 22, left: 0, right: 0, height: 30, backgroundColor: '#164743', opacity: 0.72 },
  zoneExplain: { minHeight: 175, justifyContent: 'center', gap: 8 },
  zoneBand: { height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#4B3C49', borderWidth: 1, borderColor: '#735766' },
  zoneBandLower: { backgroundColor: '#103C3B', borderColor: '#2A716B' },
  zoneBandText: { color: '#CAD6DD', fontSize: 8, fontWeight: '900' },
  reactionStage: { minHeight: 205, position: 'relative', justifyContent: 'center', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#2C746E', backgroundColor: '#0D2A31', overflow: 'hidden' },
  reactionZone: { position: 'absolute', bottom: 40, left: 0, right: 0, height: 43, backgroundColor: '#164A45', opacity: 0.7 },
  reactionDots: { position: 'absolute', bottom: 57, left: 45, right: 45, flexDirection: 'row', justifyContent: 'space-between' },
  reactionDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#72E1D2', borderWidth: 2, borderColor: '#17423F' },
  wallCompare: { flexDirection: 'row', gap: 9 },
  wallCard: { flex: 1, minHeight: 155, alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 15, borderWidth: 1, borderColor: '#5F4C55', backgroundColor: '#211E2A' },
  wallCardAccent: { borderColor: '#2D736D', backgroundColor: '#0D2C31' },
  hardWall: { width: '76%', height: 6, backgroundColor: '#B87A72' },
  softZone: { width: '76%', height: 35, borderRadius: 8, backgroundColor: '#24776D', opacity: 0.8 },
  wallCaption: { color: '#9EB0BD', fontSize: 9, lineHeight: 13, textAlign: 'center' },
  zoneSummary: { minHeight: 150, justifyContent: 'center', gap: 22 },
  summaryZoneTop: { height: 43, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#493946', borderWidth: 1, borderColor: '#705664' },
  summaryZoneBottom: { height: 43, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#103C39', borderWidth: 1, borderColor: '#2C746D' },
  summaryZoneSpace: { height: 14 },
  zoneSummaryText: { color: '#D8E2E7', fontSize: 9, fontWeight: '900' },
  speedCompare: { flexDirection: 'row', gap: 9 },
  momentumMeter: { minHeight: 150, justifyContent: 'center', gap: 10 },
  meterTrack: { height: 20, borderRadius: 10, backgroundColor: '#173047', overflow: 'hidden' },
  meterFill: { width: '72%', height: '100%', borderRadius: 10, backgroundColor: '#39CDBB' },
  meterLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  meterText: { color: '#8298A9', fontSize: 8, fontWeight: '900' },
  fadingSteps: { minHeight: 205, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', padding: 16, borderRadius: 15, borderWidth: 1, borderColor: '#2C746E', backgroundColor: '#0D2B31' },
  fadingBar: { width: 28, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: '#44CBBB' },
  speedFuture: { minHeight: 150, flexDirection: 'row', alignItems: 'center', gap: 12 },
  speedNow: { flex: 1, padding: 10, borderRadius: 15, borderWidth: 1, borderColor: '#2D736D', backgroundColor: '#0D2C31' },
  momentumSummary: { minHeight: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  momentumSummarySpeed: { color: '#5DE0CF', fontSize: 20, fontWeight: '900' },
  momentumSummaryLine: { width: 55, height: 3, backgroundColor: '#3B7B77' },
  momentumSummaryQuestion: { color: '#D0DBE1', fontSize: 26, fontWeight: '900' },
  averageChart: { minHeight: 165, position: 'relative', justifyContent: 'center', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#2C4B5F', backgroundColor: '#0D2030' },
  smoothLine: { position: 'absolute', left: 22, right: 22, top: 73, flexDirection: 'row', alignItems: 'center' },
  avgSegment: { height: 4, borderRadius: 2, backgroundColor: '#E0B976', transform: [{ rotate: '8deg' }] },
  avgSegment2: { transform: [{ rotate: '-5deg' }], marginLeft: -2 },
  avgSegment3: { transform: [{ rotate: '6deg' }], marginLeft: -2 },
  averageFormula: { minHeight: 150, flexDirection: 'row', alignItems: 'center', gap: 8 },
  pastNumbers: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  numberChip: { width: '46%', height: 45, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: '#102638', borderWidth: 1, borderColor: '#304C61' },
  numberText: { color: '#E7EFF3', fontSize: 14, fontWeight: '900' },
  averageEquals: { color: '#54D7C7', fontSize: 24, fontWeight: '900' },
  averageResult: { width: 88, height: 88, borderRadius: 22, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#2C2B2A', borderWidth: 1, borderColor: '#7B6848' },
  averageResultValue: { color: '#F0D9A7', fontSize: 18, fontWeight: '900' },
  averageCompare: { flexDirection: 'row', gap: 9 },
  avgCard: { flex: 1, minHeight: 165, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 10, borderRadius: 15, borderWidth: 1, borderColor: '#304B5F', backgroundColor: '#0D2030' },
  avgCardAccent: { borderColor: '#766344', backgroundColor: '#272622' },
  avgLineFast: { width: '82%', height: 55, position: 'relative' },
  avgFastA: { position: 'absolute', left: 0, top: 30, width: '35%', height: 4, backgroundColor: '#E0B976', transform: [{ rotate: '-18deg' }] },
  avgFastB: { position: 'absolute', left: '30%', top: 24, width: '38%', height: 4, backgroundColor: '#E0B976', transform: [{ rotate: '15deg' }] },
  avgFastC: { position: 'absolute', right: 0, top: 18, width: '38%', height: 4, backgroundColor: '#E0B976', transform: [{ rotate: '-10deg' }] },
  avgLineSlow: { width: '82%', height: 5, borderRadius: 3, backgroundColor: '#D8AF69', transform: [{ rotate: '-5deg' }] },
  avgCaption: { color: '#97A9B6', fontSize: 9, textAlign: 'center' },
  crossStage: { minHeight: 150, flexDirection: 'row', alignItems: 'center', gap: 9 },
  crossChart: { flex: 1, height: 130, position: 'relative', borderRadius: 15, borderWidth: 1, borderColor: '#655843', backgroundColor: '#242420' },
  crossAverage: { position: 'absolute', left: 15, right: 15, top: 65, height: 4, backgroundColor: '#D9B36E' },
  crossPriceA: { position: 'absolute', left: 28, top: 78, width: 70, height: 4, backgroundColor: '#45CCBB', transform: [{ rotate: '-15deg' }] },
  crossPriceB: { position: 'absolute', right: 28, top: 50, width: 70, height: 4, backgroundColor: '#45CCBB', transform: [{ rotate: '10deg' }] },
  crossDot: { position: 'absolute', left: '48%', top: 59, width: 12, height: 12, borderRadius: 6, backgroundColor: '#F0D192' },
  averageSummary: { minHeight: 140, flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryPast: { flex: 1, minHeight: 120, justifyContent: 'center', gap: 7, padding: 10, borderRadius: 14, borderWidth: 1, borderColor: '#2C495D', backgroundColor: '#0D2030' },
  summarySmooth: { flex: 1, minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 10, borderRadius: 14, borderWidth: 1, borderColor: '#736042', backgroundColor: '#272520' },
  summaryArrowText: { color: '#54D7C7', fontSize: 22, fontWeight: '900' },
});
