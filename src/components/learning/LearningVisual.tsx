import React, { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

interface LearningVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  theme?: LearningTheme;
}

export function LearningVisual({ assetRef, alt, language, theme = defaultLearningTheme }: LearningVisualProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const progress = useMemo(() => new Animated.Value(1), []);
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => setReduceMotion(false));
  }, []);

  const play = () => {
    if (reduceMotion) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 900, useNativeDriver: true }).start();
  };

  useEffect(play, [assetRef, reduceMotion]);

  const animatedStyle = {
    opacity: progress,
    transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
  };

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <Animated.View style={[styles.canvas, animatedStyle]}>
        <VisualScene assetRef={assetRef} styles={styles} progress={progress} language={language} />
      </Animated.View>
      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.alt}>{alt}</Text>
        {!reduceMotion ? (
          <Pressable accessibilityRole="button" onPress={play} style={styles.replay}>
            <Text style={styles.replayText}>{language === 'tr' ? '↻ Tekrar' : '↻ Replay'}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function VisualScene({ assetRef, styles, progress, language }: { assetRef: string; styles: ReturnType<typeof createStyles>; progress: Animated.Value; language: LearningLanguage }) {
  if (assetRef.includes('fiyat-piyasada-nasil-olusur')) return <OrderMatchScene styles={styles} language={language} />;
  if (assetRef.includes('piyasa-araclari-ayni-degildir')) return <InstrumentScene styles={styles} language={language} />;
  if (assetRef.includes('likidite-neden-onemlidir')) return <LiquidityScene styles={styles} language={language} />;
  if (assetRef.includes('bid-ask-spread-nedir')) return <SpreadScene styles={styles} language={language} />;
  if (assetRef.includes('piyasa-limit-stop-emirleri')) return <OrderTypeScene styles={styles} language={language} />;
  if (assetRef.includes('gerceklesme-fiyati-kayma')) return <FillScene styles={styles} language={language} />;
  if (assetRef.includes('bir-mum') || assetRef.includes('candle-ohlc')) return <CandleScene styles={styles} language={language} />;
  if (assetRef.includes('zaman-dilimi') || assetRef.includes('timeframes')) return <TimeframeScene styles={styles} language={language} />;
  if (assetRef.includes('trend-yon') || assetRef.includes('trend-structure')) return <TrendScene styles={styles} language={language} />;
  if (assetRef.includes('destek-direnc') || assetRef.includes('support-resistance')) return <ZoneScene styles={styles} language={language} />;
  if (assetRef.includes('bos-')) return <StructureScene styles={styles} progress={progress} mode="bos" language={language} />;
  if (assetRef.includes('choch')) return <StructureScene styles={styles} progress={progress} mode="choch" language={language} />;
  if (assetRef.includes('volatilite')) return <VolatilityScene styles={styles} language={language} />;
  if (assetRef.includes('risk-belirsizlik-kayip')) return <RiskRangeScene styles={styles} language={language} />;
  if (assetRef.includes('pozisyon-buyuklugu')) return <PositionSizeScene styles={styles} language={language} />;
  if (assetRef.includes('risk-getiri')) return <RiskRewardScene styles={styles} language={language} />;
  if (assetRef.includes('stop-emri')) return <StopOrderScene styles={styles} language={language} />;
  if (assetRef.includes('cok-varlik')) return <DiversificationScene styles={styles} language={language} />;
  if (assetRef.includes('fomo')) return <PauseScene styles={styles} language={language} />;
  if (assetRef.includes('asiri-islem')) return <OvertradingScene styles={styles} language={language} />;
  if (assetRef.includes('confirmation-bias')) return <EvidenceScene styles={styles} language={language} />;
  if (assetRef.includes('veri-ayni-kalitede')) return <DataQualityScene styles={styles} language={language} />;
  if (assetRef.includes('veri-ne-zaman-eskir')) return <FreshnessScene styles={styles} language={language} />;
  if (assetRef.includes('karari-kaydet')) return <JournalScene styles={styles} language={language} />;
  return <GenericScene styles={styles} language={language} />;
}

function SceneHeader({ styles, title, detail }: { styles: ReturnType<typeof createStyles>; title: string; detail?: string }) {
  return <View style={styles.sceneHeader}><Text style={styles.sceneTitle}>{title}</Text>{detail ? <Text style={styles.sceneLabel}>{detail}</Text> : null}</View>;
}

function OrderMatchScene({ styles, language }: SceneProps) {
  const buy = language === 'tr' ? 'ALIŞ' : 'BUY'; const sell = language === 'tr' ? 'SATIŞ' : 'SELL';
  return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={language === 'tr' ? 'Teklifler eşleşince fiyat oluşur' : 'Price forms when offers match'} /><View style={styles.orderMatch}><View style={styles.bookColumn}><Text style={styles.buyText}>{buy}</Text><Text style={styles.bookPrice}>99.80</Text><Text style={styles.bookPrice}>99.60</Text></View><View style={styles.matchDot}><Text style={styles.matchText}>100</Text></View><View style={styles.bookColumn}><Text style={styles.sellText}>{sell}</Text><Text style={styles.bookPrice}>100.20</Text><Text style={styles.bookPrice}>100.40</Text></View></View><Text style={styles.sceneLabel}>{language === 'tr' ? 'Son fiyat • eşleşen emir' : 'Last price • matched order'}</Text></View>;
}

function InstrumentScene({ styles, language }: SceneProps) {
  const cards = language === 'tr' ? [['HİSSE', 'Şirket payı'], ['TAHVİL', 'Borç ilişkisi'], ['DÖVİZ', 'Kur'], ['EMTİA', 'Fiziksel değer']] : [['STOCK', 'Company share'], ['BOND', 'Debt claim'], ['FX', 'Exchange rate'], ['COMMODITY', 'Physical value']];
  return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={language === 'tr' ? 'Araçlar aynı şeyi temsil etmez' : 'Instruments represent different things'} /><View style={styles.instrumentGrid}>{cards.map(([name, note]) => <View key={name} style={styles.instrumentCard}><Text style={styles.instrumentName}>{name}</Text><Text style={styles.instrumentNote}>{note}</Text></View>)}</View></View>;
}

function LiquidityScene({ styles, language }: SceneProps) {
  return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={language === 'tr' ? 'Aynı emir, farklı etki' : 'Same order, different impact'} /><View style={styles.comparison}><DepthStack styles={styles} label={language === 'tr' ? 'DERİN' : 'DEEP'} bars={[90, 75, 62, 48]} good /><DepthStack styles={styles} label={language === 'tr' ? 'SIĞ' : 'SHALLOW'} bars={[34, 26, 16, 10]} /></View><Text style={styles.sceneLabel}>{language === 'tr' ? 'Daha sığ defter • daha yüksek fiyat etkisi' : 'Shallower book • greater price impact'}</Text></View>;
}

function DepthStack({ styles, label, bars, good = false }: { styles: ReturnType<typeof createStyles>; label: string; bars: number[]; good?: boolean }) { return <View style={styles.depthColumn}><Text style={[styles.depthLabel, good ? styles.positive : styles.warning]}>{label}</Text>{bars.map((width, index) => <View key={index} style={[styles.depthBar, { width: `${width}%` }, good ? styles.depthGood : styles.depthRisk]} />)}</View>; }

function SpreadScene({ styles, language }: SceneProps) { return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={language === 'tr' ? 'Spread işlem maliyetinin bir parçasıdır' : 'Spread is part of trading cost'} /><View style={styles.spreadRow}><PricePill styles={styles} tone="buy" label="BID" price="99" /><View style={styles.spreadGap}><Text style={styles.spreadValue}>2</Text><Text style={styles.sceneLabel}>SPREAD</Text></View><PricePill styles={styles} tone="sell" label="ASK" price="101" /></View><Text style={styles.sceneLabel}>{language === 'tr' ? 'Alış ve satış teklifi arasındaki fark' : 'Difference between buy and sell offers'}</Text></View>; }
function PricePill({ styles, tone, label, price }: { styles: ReturnType<typeof createStyles>; tone: 'buy' | 'sell'; label: string; price: string }) { return <View style={[styles.pricePill, tone === 'buy' ? styles.priceBuy : styles.priceSell]}><Text style={styles.priceLabel}>{label}</Text><Text style={styles.priceNumber}>{price}</Text></View>; }

function OrderTypeScene({ styles, language }: SceneProps) { const text = language === 'tr' ? [['PİYASA', 'Hız • fiyat belirsiz'], ['LİMİT', 'Fiyat sınırı'], ['STOP', 'Tetik koşulu']] : [['MARKET', 'Speed • price uncertain'], ['LIMIT', 'Price boundary'], ['STOP', 'Trigger condition']]; return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={language === 'tr' ? 'Emir türleri farklı kontrol verir' : 'Order types offer different control'} /><View style={styles.orderTypeList}>{text.map(([name, note], index) => <View key={name} style={[styles.orderType, index === 1 && styles.orderTypeActive]}><Text style={styles.orderTypeName}>{name}</Text><Text style={styles.orderTypeNote}>{note}</Text></View>)}</View></View>; }

function FillScene({ styles, language }: SceneProps) { return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={language === 'tr' ? 'Gerçekleşme tek fiyata sığmayabilir' : 'A fill may not happen at one price'} /><View style={styles.fillLine}><View style={[styles.fillStep, { width: '23%' }]}><Text style={styles.fillText}>100.0</Text></View><View style={[styles.fillStep, styles.fillStep2, { width: '34%' }]}><Text style={styles.fillText}>100.2</Text></View><View style={[styles.fillStep, styles.fillStep3, { width: '43%' }]}><Text style={styles.fillText}>100.5</Text></View></View><Text style={styles.warning}>{language === 'tr' ? 'Hacim arttıkça ortalama fiyat değişebilir' : 'Average price can change as size increases'}</Text></View>; }

function CandleScene({ styles, language }: SceneProps) {
  return <View style={styles.center}><View style={styles.wick} /><View style={styles.candleBody} /><Label style={styles.highLabel} text={language === 'tr' ? 'En yüksek' : 'High'} /><Label style={styles.lowLabel} text={language === 'tr' ? 'En düşük' : 'Low'} /><Label style={styles.openLabel} text={language === 'tr' ? 'Açılış' : 'Open'} /><Label style={styles.closeLabel} text={language === 'tr' ? 'Kapanış' : 'Close'} /></View>;
}

type TimeframeCandle = { bottom: number; height: number; bullish: boolean };

const TIMEFRAME_15M: readonly TimeframeCandle[] = [
  { bottom: 14, height: 13, bullish: true },
  { bottom: 24, height: 14, bullish: true },
  { bottom: 30, height: 12, bullish: true },
  { bottom: 26, height: 12, bullish: false },
  { bottom: 19, height: 13, bullish: false },
  { bottom: 12, height: 12, bullish: false },
  { bottom: 9, height: 10, bullish: false },
  { bottom: 13, height: 13, bullish: true },
];

const TIMEFRAME_1H: readonly TimeframeCandle[] = [
  { bottom: 11, height: 15, bullish: true },
  { bottom: 24, height: 16, bullish: true },
  { bottom: 17, height: 17, bullish: false },
  { bottom: 14, height: 14, bullish: true },
];

const TIMEFRAME_1D: readonly TimeframeCandle[] = [
  { bottom: 8, height: 16, bullish: true },
  { bottom: 20, height: 17, bullish: true },
  { bottom: 31, height: 15, bullish: true },
];

function TimeframeScene({ styles, language }: SceneProps) {
  const tr = language === 'tr';
  return (
    <View style={styles.sceneColumn}>
      <SceneHeader
        styles={styles}
        title={tr ? 'Aynı piyasa, farklı ölçek' : 'Same market, different scale'}
        detail={tr ? 'Kısa geri çekilme · geniş yapı korunabilir' : 'Short pullback · broader structure can remain intact'}
      />
      <View style={styles.timeframeStack}>
        <TimeframeRow styles={styles} label="15m" note={tr ? 'geri çekilme' : 'pullback'} candles={TIMEFRAME_15M} />
        <TimeframeRow styles={styles} label="1h" note={tr ? 'geçiş' : 'transition'} candles={TIMEFRAME_1H} />
        <TimeframeRow styles={styles} label="1D" note={tr ? 'geniş yapı' : 'broad structure'} candles={TIMEFRAME_1D} structureTag="HH / HL" />
      </View>
      <Text style={styles.sceneLabel}>{tr ? 'Zaman dilimleri çelişebilir; biri otomatik olarak üstün değildir.' : 'Timeframes can conflict; one is not automatically superior.'}</Text>
    </View>
  );
}

function TimeframeRow({ styles, label, note, candles, structureTag }: { styles: ReturnType<typeof createStyles>; label: string; note: string; candles: readonly TimeframeCandle[]; structureTag?: string }) {
  return (
    <View style={styles.timeframeRow}>
      <View style={styles.timeframeCopy}>
        <Text style={styles.timeframeLabel}>{label}</Text>
        <Text style={styles.timeframeNote}>{note}</Text>
      </View>
      <View style={styles.timeframeChart}>
        <View style={styles.timeframeGridLine} />
        {candles.map((candle, index) => (
          <View key={`${label}.${index}`} style={styles.timeframeCandleSlot}>
            <View style={[styles.timeframeWick, { height: candle.height + 8, bottom: candle.bottom - 4 }]} />
            <View style={[styles.timeframeCandle, candle.bullish ? styles.timeframeCandleUp : styles.timeframeCandleDown, { height: candle.height, bottom: candle.bottom }]} />
          </View>
        ))}
      </View>
      {structureTag ? <Text style={styles.timeframeStructureTag}>{structureTag}</Text> : <View style={styles.timeframeTagSpacer} />}
    </View>
  );
}

function TrendScene({ styles, language }: SceneProps) {
  const candles = [
    { bottom: 18, height: 22, bullish: false },
    { bottom: 42, height: 24, bullish: true },
    { bottom: 31, height: 19, bullish: false, label: 'HL' },
    { bottom: 67, height: 24, bullish: true, label: 'HH' },
    { bottom: 52, height: 20, bullish: false, label: 'HL' },
    { bottom: 80, height: 21, bullish: true, label: 'HH' },
  ];

  return (
    <View style={styles.sceneColumn}>
      <SceneHeader styles={styles} title={language === 'tr' ? 'Yön, mumdan çok yapıdır' : 'Direction is structure, not one candle'} detail={language === 'tr' ? 'Daha yüksek dipler ve tepeler' : 'Higher lows and higher highs'} />
      <View style={styles.trendChart}>
        <View style={styles.trendGridLine} />
        {candles.map((candle, index) => (
          <View key={index} style={styles.trendCandleSlot}>
            <View style={[styles.trendWick, { height: candle.height + 16, bottom: candle.bottom - 8 }]} />
            <View style={[styles.trendCandle, candle.bullish ? styles.trendCandleUp : styles.trendCandleDown, { height: candle.height, bottom: candle.bottom }]} />
            {candle.label ? <Text style={[styles.trendTag, { bottom: candle.bottom + candle.height + 3 }]}>{candle.label}</Text> : null}
          </View>
        ))}
      </View>
      <View style={styles.trendReadout}><Text style={styles.positive}>HH + HL</Text><Text style={styles.sceneLabel}>{language === 'tr' ? 'Yükseliş yapısı · teyit ara' : 'Uptrend structure · seek confirmation'}</Text></View>
    </View>
  );
}

function ZoneScene({ styles, language }: SceneProps) {
  const candles = [
    { bottom: 68, height: 20, bullish: false }, { bottom: 48, height: 27, bullish: false }, { bottom: 17, height: 28, bullish: true, touch: true }, { bottom: 35, height: 24, bullish: true }, { bottom: 55, height: 22, bullish: false }, { bottom: 17, height: 30, bullish: true, touch: true }, { bottom: 42, height: 26, bullish: true }, { bottom: 30, height: 21, bullish: false }, { bottom: 17, height: 27, bullish: true, touch: true }, { bottom: 45, height: 25, bullish: true },
  ];
  return <View style={styles.sceneColumn}><View style={[styles.zone, styles.resistanceZone]}><Text style={styles.zoneText}>{language === 'tr' ? 'DİRENÇ BÖLGESİ' : 'RESISTANCE ZONE'}</Text></View><View style={styles.zoneCandles}><View style={styles.zoneGridLine} />{candles.map((candle, index) => <View key={index} style={styles.zoneCandleSlot}><View style={[styles.zoneWick, { height: candle.height + 16, bottom: candle.bottom - 8 }]} /><View style={[styles.zoneCandle, candle.bullish ? styles.zoneCandleUp : styles.zoneCandleDown, { height: candle.height, bottom: candle.bottom }]} />{candle.touch ? <View style={styles.supportTouch} /> : null}</View>)}</View><View style={[styles.zone, styles.supportZone]}><Text style={styles.zoneText}>{language === 'tr' ? 'DESTEK BÖLGESİ · 3 TEMAS' : 'SUPPORT ZONE · 3 TOUCHES'}</Text></View><Text style={styles.sceneLabel}>{language === 'tr' ? 'Bölge tepkiyi garanti etmez; bağlamı kontrol et.' : 'A zone does not guarantee a reaction; check the context.'}</Text></View>;
}

function StructureScene({ styles, mode, language }: { styles: ReturnType<typeof createStyles>; progress: Animated.Value; mode: 'bos' | 'choch'; language: LearningLanguage }) {
  const isBos = mode === 'bos';
  const level = isBos ? 61 : 39;
  const candles = isBos ? [{ bottom: 22, height: 18, bullish: true }, { bottom: 38, height: 17, bullish: true }, { bottom: 31, height: 19, bullish: false }, { bottom: 49, height: 18, bullish: true }, { bottom: 44, height: 17, bullish: false }, { bottom: 57, height: 27, bullish: true, breaks: true }] : [{ bottom: 52, height: 18, bullish: true }, { bottom: 63, height: 17, bullish: true }, { bottom: 48, height: 18, bullish: false }, { bottom: 59, height: 18, bullish: true }, { bottom: 42, height: 18, bullish: false }, { bottom: 19, height: 29, bullish: false, breaks: true }];
  return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={isBos ? language === 'tr' ? 'Seviye üzerindeki kapanışı izle' : 'Watch for a close beyond the level' : language === 'tr' ? 'Korunan seviye kırılırsa yapı değişebilir' : 'Structure can change when a protected level breaks'} detail={isBos ? language === 'tr' ? 'BOS · devam ihtimali, garanti değil' : 'BOS · continuation possibility, not a guarantee' : language === 'tr' ? 'CHoCH · karakter değişimi sinyali' : 'CHoCH · character-change signal'} /><View style={styles.structureChart}><View style={[styles.structureLevelLine, { bottom: level }]} /><Text style={[styles.structureLevelText, { bottom: level + 5 }]}>{isBos ? language === 'tr' ? 'YAPI SEVİYESİ' : 'STRUCTURE LEVEL' : language === 'tr' ? 'KORUNAN DİP' : 'PROTECTED LOW'}</Text>{candles.map((candle, index) => <View key={index} style={styles.structureCandleSlot}><View style={[styles.structureWick, { height: candle.height + 16, bottom: candle.bottom - 8 }]} /><View style={[styles.structureCandle, candle.bullish ? styles.structureCandleUp : styles.structureCandleDown, { height: candle.height, bottom: candle.bottom }]} />{candle.breaks ? <Text style={[styles.structureBreakTag, isBos ? styles.structureBosTag : styles.structureChochTag, { bottom: candle.bottom + candle.height + 4 }]}>{isBos ? 'BOS' : 'CHoCH'}</Text> : null}</View>)}</View><Text style={styles.sceneLabel}>{language === 'tr' ? 'Tek kırılım tek başına teyit değildir; kapanış ve bağlamı birlikte değerlendir.' : 'One break is not confirmation by itself; assess the close and context together.'}</Text></View>;
}

function VolatilityScene({ styles, language }: SceneProps) { return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={language === 'tr' ? 'Aynı süre, farklı hareket aralığı' : 'Same time, different movement range'} detail={language === 'tr' ? 'Volatilite sonucu değil, belirsizlik aralığını anlatır' : 'Volatility describes uncertainty range, not outcome'} /><VolatilityBand styles={styles} label={language === 'tr' ? 'DAR HAREKET' : 'NARROW RANGE'} values={[28, 34, 30, 38, 32, 36]} /><VolatilityBand styles={styles} label={language === 'tr' ? 'GENİŞ HAREKET' : 'WIDE RANGE'} values={[24, 72, 34, 88, 30, 76]} risk /><Text style={styles.sceneLabel}>{language === 'tr' ? 'Geniş aralık · risk boyutu ve planı yeniden kontrol et' : 'Wider range · re-check risk size and plan'}</Text></View>; }
function VolatilityBand({ styles, label, values, risk = false }: { styles: ReturnType<typeof createStyles>; label: string; values: readonly number[]; risk?: boolean }) { return <View style={styles.volatilityBand}><View style={styles.volatilityBandHeader}><Text style={[styles.volatilityLabel, risk ? styles.riskText : styles.positive]}>{label}</Text><Text style={styles.sceneLabel}>{risk ? '↕' : '↔'}</Text></View><View style={styles.volRow}>{values.map((height, index) => <View key={index} style={[styles.volBar, risk && styles.volBarRisk, { height }]} />)}</View></View>; }

function DiversificationScene({ styles, language }: SceneProps) {
  const tr = language === 'tr';
  const concentrated = tr ? ['Tek sektör', 'Aynı piyasa', 'Benzer tepki'] : ['One sector', 'Same market', 'Similar reaction'];
  const distributed = tr ? ['Farklı alan', 'Farklı risk', 'Farklı tepki'] : ['Different area', 'Different risk', 'Different reaction'];
  return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={tr ? 'Sayı değil, ortak risk önemlidir' : 'Shared risk matters more than count'} detail={tr ? 'Dört varlık da aynı anda benzer davranabilir' : 'Four assets can still move alike'} /><View style={styles.diversificationRow}><ExposureCard styles={styles} title={tr ? 'YOĞUNLAŞMA' : 'CONCENTRATION'} items={concentrated} tone="risk" /><ExposureCard styles={styles} title={tr ? 'DAĞILIM' : 'SPREAD'} items={distributed} tone="balanced" /></View><Text style={styles.sceneLabel}>{tr ? 'Dağılım kaybı ortadan kaldırmaz; tek etkene bağımlılığı azaltmayı hedefler.' : 'Diversification does not remove loss; it aims to reduce reliance on one factor.'}</Text></View>;
}
function ExposureCard({ styles, title, items, tone }: { styles: ReturnType<typeof createStyles>; title: string; items: readonly string[]; tone: 'risk' | 'balanced' }) { const risk = tone === 'risk'; return <View style={[styles.exposureCard, risk ? styles.exposureCardRisk : styles.exposureCardBalanced]}><Text style={[styles.exposureTitle, risk ? styles.riskText : styles.positive]}>{title}</Text><View style={styles.exposureLinks}>{items.map((item, index) => <View key={item} style={styles.exposureItem}><View style={[styles.exposureDot, risk ? styles.exposureDotRisk : index === 1 ? styles.exposureDotWarn : styles.exposureDotGood]} /><Text style={styles.exposureText}>{item}</Text></View>)}</View></View>; }

function RiskRangeScene({ styles, language }: SceneProps) { return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={language === 'tr' ? 'Sonuç tek bir sayı değildir' : 'An outcome is not one number'} /><View style={styles.rangeTrack}><View style={styles.rangeLeft} /><View style={styles.rangeCenter}><Text style={styles.rangeText}>{language === 'tr' ? 'OLASI SONUÇLAR' : 'POSSIBLE OUTCOMES'}</Text></View><View style={styles.rangeRight} /></View><View style={styles.legendRow}><Text style={styles.riskText}>{language === 'tr' ? 'Kayıp' : 'Loss'}</Text><Text style={styles.sceneLabel}>{language === 'tr' ? 'Belirsizlik' : 'Uncertainty'}</Text><Text style={styles.positive}>{language === 'tr' ? 'Kazanç' : 'Gain'}</Text></View></View>; }
function PositionSizeScene({ styles, language }: SceneProps) { const tr = language === 'tr'; return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={tr ? 'Önce risk sınırı, sonra pozisyon boyutu' : 'Set risk limit before position size'} detail={tr ? 'Aynı para riski · farklı stop mesafesi' : 'Same cash risk · different stop distance'} /><View style={styles.riskBudget}><Text style={styles.riskBudgetLabel}>{tr ? 'ÖRNEK RİSK SINIRI' : 'EXAMPLE RISK LIMIT'}</Text><Text style={styles.riskBudgetValue}>1R</Text><Text style={styles.riskBudgetNote}>{tr ? 'sabit kalır' : 'stays fixed'}</Text></View><View style={styles.sizingPlans}><SizingPlan styles={styles} shortDistance language={language} /><SizingPlan styles={styles} language={language} /></View><Text style={styles.sceneLabel}>{tr ? 'Mesafe genişledikçe, aynı riski taşımak için boyut küçülür.' : 'As the distance widens, size decreases to keep the same risk.'}</Text></View>; }
function SizingPlan({ styles, shortDistance = false, language }: SceneProps & { shortDistance?: boolean }) { const tr = language === 'tr'; const distance = shortDistance ? tr ? 'DAR MESAFE' : 'TIGHT DISTANCE' : tr ? 'GENİŞ MESAFE' : 'WIDE DISTANCE'; const size = shortDistance ? tr ? 'DAHA BÜYÜK BOYUT' : 'LARGER SIZE' : tr ? 'DAHA KÜÇÜK BOYUT' : 'SMALLER SIZE'; return <View style={styles.sizingPlan}><View style={styles.sizingPlanHead}><Text style={styles.sizingPlanLabel}>{distance}</Text><Text style={[styles.sizingPlanValue, shortDistance ? styles.positive : styles.warning]}>{shortDistance ? '2' : '5'}%</Text></View><View style={styles.distanceTrack}><View style={styles.entryMarker}><Text style={styles.entryMarkerText}>{tr ? 'GİRİŞ' : 'ENTRY'}</Text></View><View style={[styles.stopMarker, shortDistance ? styles.stopMarkerTight : styles.stopMarkerWide]}><Text style={styles.stopMarkerText}>STOP</Text></View></View><View style={styles.sizeMeter}><View style={[styles.sizeMeterFill, shortDistance ? styles.sizeMeterLarge : styles.sizeMeterSmall]} /></View><Text style={styles.sizePlanResult}>{size}</Text></View>; }

function RiskRewardScene({ styles, language }: SceneProps) { const tr = language === 'tr'; return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={tr ? 'Oran, olasılığın yerine geçmez' : 'A ratio does not replace probability'} detail={tr ? 'Planlanan büyüklük ≠ beklenen sonuç' : 'Planned size ≠ expected outcome'} /><View style={styles.rewardPlan}><View style={styles.targetZone}><Text style={styles.targetZoneText}>{tr ? 'HEDEF  +2R' : 'TARGET  +2R'}</Text></View><View style={styles.entryLine}><Text style={styles.entryLineText}>{tr ? 'GİRİŞ' : 'ENTRY'}</Text></View><View style={styles.lossZone}><Text style={styles.lossZoneText}>{tr ? 'RİSK  −1R' : 'RISK  −1R'}</Text></View></View><View style={styles.rewardChecks}><View style={styles.rewardCheck}><Text style={styles.rewardCheckMark}>?</Text><Text style={styles.rewardCheckText}>{tr ? 'OLASILIK' : 'PROBABILITY'}</Text></View><View style={styles.rewardCheck}><Text style={styles.rewardCheckMark}>?</Text><Text style={styles.rewardCheckText}>{tr ? 'MALİYETLER' : 'COSTS'}</Text></View></View><Text style={styles.sceneLabel}>{tr ? 'Oranı; kanıt, gerçekleşme olasılığı ve maliyetlerle birlikte değerlendir.' : 'Assess the ratio together with evidence, fill probability, and costs.'}</Text></View>; }
function StopOrderScene({ styles, language }: SceneProps) { const tr = language === 'tr'; return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={tr ? 'Stop tetiklenir; fiyat garanti edilmez' : 'A stop triggers; price is not guaranteed'} detail={tr ? 'Hızlı hareket · kayma riski' : 'Fast move · slippage risk'} /><View style={styles.stopSequence}><View style={styles.stopPriceRow}><Text style={styles.stopPriceLabel}>{tr ? 'GİRİŞ' : 'ENTRY'}</Text><Text style={styles.stopPriceValue}>100.0</Text></View><View style={styles.stopArrow}>↓</View><View style={styles.stopPriceRow}><Text style={styles.stopPriceLabel}>STOP</Text><Text style={styles.stopPriceValue}>98.0</Text><Text style={styles.stopTrigger}>{tr ? 'TETİKLENİR' : 'TRIGGERS'}</Text></View><View style={styles.stopArrowRisk}>↓</View><View style={[styles.stopPriceRow, styles.fillRow]}><Text style={styles.fillLabel}>{tr ? 'GERÇEKLEŞME' : 'FILL'}</Text><Text style={styles.fillValue}>97.4</Text><Text style={styles.fillNote}>{tr ? 'daha kötü fiyat' : 'worse price'}</Text></View></View><Text style={styles.warning}>{tr ? 'Stop bir risk aracıdır; hızlı piyasada maksimum kaybı kesinleştirmez.' : 'A stop manages risk; fast markets can still exceed the planned loss.'}</Text></View>; }

function PauseScene({ styles, language }: SceneProps) { const tr = language === 'tr'; return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={tr ? 'Duygudan önce bir kontrol döngüsü kur' : 'Use a check loop before acting on emotion'} /><View style={styles.decisionLoop}><DecisionStep styles={styles} marker="1" label={tr ? 'DUR' : 'PAUSE'} detail={tr ? 'Dürtüyü fark et' : 'Notice the impulse'} /><Text style={styles.loopArrow}>→</Text><DecisionStep styles={styles} marker="2" label={tr ? 'KONTROL' : 'CHECK'} detail={tr ? 'Plan ve risk' : 'Plan and risk'} active /><Text style={styles.loopArrow}>→</Text><DecisionStep styles={styles} marker="3" label={tr ? 'KANIT' : 'EVIDENCE'} detail={tr ? 'Tersi ne der?' : 'What challenges it?'} /></View><Text style={styles.sceneLabel}>{tr ? 'Duygu bilgi olabilir; tek başına karar kuralı değildir.' : 'Emotion can be information; it is not a decision rule on its own.'}</Text></View>; }
function DecisionStep({ styles, marker, label, detail, active = false }: { styles: ReturnType<typeof createStyles>; marker: string; label: string; detail: string; active?: boolean }) { return <View style={[styles.decisionStep, active && styles.decisionStepActive]}><Text style={[styles.decisionMarker, active && styles.decisionMarkerActive]}>{marker}</Text><Text style={styles.decisionLabel}>{label}</Text><Text style={styles.decisionDetail}>{detail}</Text></View>; }
function OvertradingScene({ styles, language }: SceneProps) { const tr = language === 'tr'; return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={tr ? 'İşlem sayısı karar kalitesi değildir' : 'More trades do not mean better decisions'} /><View style={styles.paceComparison}><View style={styles.paceCard}><Text style={styles.sceneLabel}>{tr ? 'DÜRTÜSEL DÖNGÜ' : 'IMPULSE LOOP'}</Text><Text style={styles.paceMarks}>● ● ● ● ●</Text><Text style={styles.riskText}>{tr ? 'Kontrol azalır' : 'Less checking'}</Text></View><View style={styles.paceDivider} /><View style={styles.paceCard}><Text style={styles.sceneLabel}>{tr ? 'PLANLI DÖNGÜ' : 'PLANNED LOOP'}</Text><Text style={styles.paceMarksQuiet}>●   ●   ●</Text><Text style={styles.positive}>{tr ? 'Her adımda kontrol' : 'Check each step'}</Text></View></View><Text style={styles.sceneLabel}>{tr ? 'Sıklığı değil, her kararın gerekçesini ve maliyetini gözden geçir.' : 'Review the reason and cost of each decision, not just frequency.'}</Text></View>; }
function EvidenceScene({ styles, language }: SceneProps) { const tr = language === 'tr'; return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={tr ? 'Kanıtı iki taraftan ara' : 'Look for evidence on both sides'} /><View style={styles.evidenceBalance}><View style={styles.evidenceColumn}><Text style={styles.positive}>✓ {tr ? 'DESTEKLEYEN' : 'SUPPORTS'}</Text><Text style={styles.evidencePrompt}>{tr ? 'Neyi doğruluyor?' : 'What confirms it?'}</Text></View><View style={styles.evidenceCenter}><View style={styles.evidenceBeam} /><Text style={styles.sceneLabel}>{tr ? 'KARAR' : 'DECISION'}</Text></View><View style={styles.evidenceColumn}><Text style={styles.riskText}>? {tr ? 'ÇÜRÜTEN' : 'CHALLENGES'}</Text><Text style={styles.evidencePrompt}>{tr ? 'Neyi yanlışlayabilir?' : 'What could disprove it?'}</Text></View></View><Text style={styles.sceneLabel}>{tr ? 'Tek taraflı veri, kararın tamamı değildir.' : 'One-sided evidence is not the whole decision.'}</Text></View>; }
function DataQualityScene({ styles, language }: SceneProps) {
  const tr = language === 'tr';
  const stronger = tr
    ? ['Kaynak · biliniyor', 'Zaman · güncel', 'Kapsam · tam', 'Bağlam · açık']
    : ['Source · known', 'Time · current', 'Coverage · complete', 'Context · clear'];
  const weaker = tr
    ? ['Kaynak · belirsiz', 'Zaman · eski', 'Kapsam · eksik', 'Bağlam · kopuk']
    : ['Source · unclear', 'Time · stale', 'Coverage · incomplete', 'Context · missing'];

  return (
    <View style={styles.sceneColumn}>
      <SceneHeader
        styles={styles}
        title={tr ? 'Veri kalitesi dört kontrolle okunur' : 'Read data quality through four checks'}
        detail={tr ? 'Kaynak · zaman · kapsam · bağlam' : 'Source · time · coverage · context'}
      />
      <View style={styles.diversificationRow}>
        <ExposureCard styles={styles} title={tr ? 'DAHA GÜÇLÜ' : 'STRONGER'} items={stronger} tone="balanced" />
        <ExposureCard styles={styles} title={tr ? 'DAHA ZAYIF' : 'WEAKER'} items={weaker} tone="risk" />
      </View>
      <Text style={styles.sceneLabel}>
        {tr
          ? 'Daha güçlü veri kesinlik değildir; karşı kanıt ve güncellik yine kontrol edilir.'
          : 'Stronger data is not certainty; recency and counter-evidence still need checking.'}
      </Text>
    </View>
  );
}
function QualityRow({ styles, label, value, good = false, risk = false }: { styles: ReturnType<typeof createStyles>; label: string; value: number; good?: boolean; risk?: boolean }) { return <View style={styles.qualityRow}><Text style={styles.qualityLabel}>{label}</Text><View style={styles.qualityTrack}><View style={[styles.qualityFill, { width: `${value}%` as `${number}%` }, good ? styles.qualityGood : risk ? styles.qualityRisk : styles.qualityWarn]} /></View></View>; }
function FreshnessScene({ styles, language }: SceneProps) { return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={language === 'tr' ? 'Verinin zamanı bağlamın parçasıdır' : 'Data time is part of the context'} /><View style={styles.timeline}><View style={styles.timelineStep}><Text style={styles.timelineTime}>09:00</Text><View style={styles.timelineDot} /></View><View style={styles.timelineStep}><Text style={styles.timelineTime}>12:00</Text><View style={styles.timelineDot} /></View><View style={styles.timelineStep}><Text style={styles.timelineTime}>{language === 'tr' ? 'ŞİMDİ' : 'NOW'}</Text><View style={styles.timelineDotNow} /></View></View><Text style={styles.warning}>{language === 'tr' ? 'Eski veri • yeniden doğrula' : 'Older data • verify again'}</Text></View>; }
function JournalScene({ styles, language }: SceneProps) { return <View style={styles.sceneColumn}><SceneHeader styles={styles} title={language === 'tr' ? 'Sonucu değil, kararı kaydet' : 'Record the decision, not only the outcome'} /><View style={styles.journalCard}><Text style={styles.journalTitle}>{language === 'tr' ? 'KARAR NOTU' : 'DECISION NOTE'}</Text>{[language === 'tr' ? 'Neye dayanıyorum?' : 'What is my evidence?', language === 'tr' ? 'Riskim ne?' : 'What is my risk?', language === 'tr' ? 'Ne değiştirir?' : 'What would change my view?'].map((item) => <View key={item} style={styles.journalLine}><Text style={styles.sceneLabel}>□</Text><Text style={styles.journalText}>{item}</Text></View>)}</View></View>; }

function GenericScene({ styles, language }: SceneProps) { return <View style={styles.center}><Text style={styles.genericIcon}>◎</Text><Text style={styles.sceneTitle}>{language === 'tr' ? 'Şematik eğitim görseli' : 'Schematic learning visual'}</Text></View>; }
function Label({ style, text }: { style: object; text: string }) { return <Text style={[style]}>{text}</Text>; }
type SceneProps = { styles: ReturnType<typeof createStyles>; language: LearningLanguage };

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 250, overflow: 'hidden', borderRadius: theme.radius.large, backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border },
  canvas: { minHeight: 205, padding: theme.spacing.md, justifyContent: 'center' },
  footer: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border },
  alt: { flex: 1, color: theme.colors.textMuted, fontSize: 11, lineHeight: 15 },
  replay: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 9, backgroundColor: theme.colors.surfaceMuted },
  replayText: { color: theme.colors.primary, fontSize: 11, fontWeight: '800' },
  center: { height: 170, alignItems: 'center', justifyContent: 'center' },
  sceneColumn: { minHeight: 170, justifyContent: 'center', gap: 7 },
  sceneHeader: { alignItems: 'center', gap: 3 },
  sceneTitle: { color: theme.colors.text, fontSize: 13, fontWeight: '800', textAlign: 'center' },
  sceneLabel: { color: theme.colors.textMuted, fontSize: 10, textAlign: 'center' },
  wick: { position: 'absolute', width: 3, height: 145, backgroundColor: theme.colors.textMuted },
  candleBody: { width: 55, height: 78, borderRadius: 5, backgroundColor: theme.colors.primary, borderWidth: 2, borderColor: '#5EEAD4' },
  highLabel: { position: 'absolute', top: 4, color: theme.colors.warning, fontSize: 11, fontWeight: '700' },
  lowLabel: { position: 'absolute', bottom: 2, color: theme.colors.warning, fontSize: 11, fontWeight: '700' },
  openLabel: { position: 'absolute', left: '23%', top: 94, color: theme.colors.textMuted, fontSize: 11 },
  closeLabel: { position: 'absolute', right: '21%', top: 49, color: theme.colors.text, fontSize: 11 },
  timeframeStack: { gap: 5 },
  timeframeRow: { minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 8, borderRadius: 8, backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border },
  timeframeCopy: { width: 72, gap: 1 },
  timeframeLabel: { color: theme.colors.primary, fontSize: 10, fontWeight: '900' },
  timeframeNote: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '700' },
  timeframeChart: { flex: 1, height: 34, position: 'relative', flexDirection: 'row', overflow: 'hidden' },
  timeframeGridLine: { position: 'absolute', left: 0, right: 0, bottom: 17, borderTopWidth: 1, borderColor: 'rgba(159,176,195,0.13)' },
  timeframeCandleSlot: { flex: 1, position: 'relative', alignItems: 'center' },
  timeframeWick: { position: 'absolute', width: 1, backgroundColor: 'rgba(159,176,195,0.62)' },
  timeframeCandle: { position: 'absolute', width: 6, borderRadius: 1 },
  timeframeCandleUp: { backgroundColor: 'rgba(52,211,153,0.76)' },
  timeframeCandleDown: { backgroundColor: 'rgba(251,113,133,0.64)' },
  timeframeStructureTag: { width: 39, color: theme.colors.success, fontSize: 8, fontWeight: '900', textAlign: 'right' },
  timeframeTagSpacer: { width: 39 },
  trendChart: { height: 108, position: 'relative', flexDirection: 'row', overflow: 'hidden', borderRadius: 10, backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border },
  trendGridLine: { position: 'absolute', left: 0, right: 0, top: 54, borderTopWidth: 1, borderColor: 'rgba(159,176,195,0.14)' },
  trendCandleSlot: { flex: 1, position: 'relative', alignItems: 'center' },
  trendWick: { position: 'absolute', width: 2, borderRadius: 1, backgroundColor: 'rgba(159,176,195,0.56)' },
  trendCandle: { position: 'absolute', width: 11, borderRadius: 2 },
  trendCandleUp: { backgroundColor: 'rgba(52,211,153,0.72)' },
  trendCandleDown: { backgroundColor: 'rgba(251,113,133,0.60)' },
  trendTag: { position: 'absolute', color: theme.colors.primary, fontSize: 9, fontWeight: '900' },
  trendReadout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-around' },
  positive: { color: theme.colors.success, fontSize: 11, fontWeight: '800' },
  warning: { color: theme.colors.warning, fontSize: 11, fontWeight: '800', textAlign: 'center' },
  zone: { height: 28, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  resistanceZone: { backgroundColor: 'rgba(251,113,133,0.14)', borderWidth: 1, borderColor: 'rgba(251,113,133,0.56)' },
  supportZone: { backgroundColor: 'rgba(45,212,191,0.12)', borderWidth: 1, borderColor: 'rgba(45,212,191,0.58)' },
  zoneText: { color: theme.colors.text, fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  zoneCandles: { height: 102, position: 'relative', flexDirection: 'row', alignItems: 'stretch', overflow: 'hidden' },
  zoneGridLine: { position: 'absolute', left: 0, right: 0, top: 51, borderTopWidth: 1, borderColor: 'rgba(159,176,195,0.16)' },
  zoneCandleSlot: { flex: 1, position: 'relative', alignItems: 'center' },
  zoneWick: { position: 'absolute', width: 2, borderRadius: 1, backgroundColor: 'rgba(159,176,195,0.62)' },
  zoneCandle: { position: 'absolute', width: 10, borderRadius: 2 },
  zoneCandleUp: { backgroundColor: 'rgba(52,211,153,0.78)' },
  zoneCandleDown: { backgroundColor: 'rgba(251,113,133,0.66)' },
  supportTouch: { position: 'absolute', bottom: 7, width: 5, height: 5, borderRadius: 3, backgroundColor: theme.colors.primary },
  structureChart: { height: 110, position: 'relative', flexDirection: 'row', overflow: 'hidden', borderRadius: 10, backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border },
  structureLevelLine: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: theme.colors.warning },
  structureLevelText: { position: 'absolute', left: 8, color: theme.colors.warning, fontSize: 8, fontWeight: '900', letterSpacing: 0.45 },
  structureCandleSlot: { flex: 1, position: 'relative', alignItems: 'center' },
  structureWick: { position: 'absolute', width: 2, borderRadius: 1, backgroundColor: 'rgba(159,176,195,0.58)' },
  structureCandle: { position: 'absolute', width: 11, borderRadius: 2 },
  structureCandleUp: { backgroundColor: 'rgba(52,211,153,0.72)' },
  structureCandleDown: { backgroundColor: 'rgba(251,113,133,0.64)' },
  structureBreakTag: { position: 'absolute', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, color: theme.colors.primaryText, fontSize: 8, fontWeight: '900', overflow: 'hidden' },
  structureBosTag: { backgroundColor: theme.colors.primary },
  structureChochTag: { backgroundColor: theme.colors.warning },
  structureLevel: { position: 'absolute', left: 30, right: 30, top: 58, height: 2, backgroundColor: theme.colors.warning },
  structureLabel: { position: 'absolute', top: 35, color: theme.colors.warning, fontSize: 10, fontWeight: '700' },
  structurePath: { position: 'absolute', left: 35, right: 35, bottom: 30, height: 110, flexDirection: 'row', justifyContent: 'space-around' },
  structurePoint: { position: 'relative', width: 11, height: 11, borderRadius: 6, backgroundColor: theme.colors.textMuted },
  breakMarker: { position: 'absolute', top: 48, width: 18, height: 18, borderRadius: 9 },
  breakLabel: { position: 'absolute', bottom: 3, color: theme.colors.text, fontSize: 11, fontWeight: '800' },
  volatilityBand: { gap: 2, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9, backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border },
  volatilityBandHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  volatilityLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.65 },
  volRow: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  volBar: { width: 13, borderRadius: 4, backgroundColor: 'rgba(45,212,191,0.68)' },
  volBarRisk: { backgroundColor: 'rgba(251,113,133,0.66)' },
  diversificationRow: { flexDirection: 'row', gap: 10 },
  exposureCard: { flex: 1, gap: 8, padding: 9, borderRadius: 11, borderWidth: 1, backgroundColor: theme.colors.surfaceMuted },
  exposureCardRisk: { borderColor: 'rgba(251,113,133,0.38)' },
  exposureCardBalanced: { borderColor: 'rgba(45,212,191,0.34)' },
  exposureTitle: { fontSize: 9, fontWeight: '900', letterSpacing: 0.7, textAlign: 'center' },
  exposureLinks: { gap: 6 },
  exposureItem: { minHeight: 20, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 5, borderRadius: 5, backgroundColor: 'rgba(159,176,195,0.07)' },
  exposureDot: { width: 7, height: 7, borderRadius: 4 },
  exposureDotRisk: { backgroundColor: theme.colors.risk },
  exposureDotGood: { backgroundColor: theme.colors.success },
  exposureDotWarn: { backgroundColor: theme.colors.warning },
  exposureText: { flex: 1, color: theme.colors.textMuted, fontSize: 9, fontWeight: '700' },
  genericIcon: { color: theme.colors.primary, fontSize: 54, fontWeight: '300' },
  orderMatch: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  bookColumn: { width: 86, gap: 5 },
  buyText: { color: theme.colors.success, fontSize: 10, fontWeight: '900', textAlign: 'center' },
  sellText: { color: theme.colors.risk, fontSize: 10, fontWeight: '900', textAlign: 'center' },
  bookPrice: { padding: 6, borderRadius: 6, color: theme.colors.text, fontSize: 12, textAlign: 'center', backgroundColor: theme.colors.surfaceMuted },
  matchDot: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary },
  matchText: { color: theme.colors.primaryText, fontSize: 15, fontWeight: '900' },
  instrumentGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  instrumentCard: { width: '45%', minHeight: 47, padding: 8, borderRadius: 10, backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border },
  instrumentName: { color: theme.colors.primary, fontSize: 10, fontWeight: '900' },
  instrumentNote: { color: theme.colors.textMuted, fontSize: 10, marginTop: 3 },
  comparison: { flexDirection: 'row', gap: 18, paddingHorizontal: 12 },
  depthColumn: { flex: 1, gap: 4, alignItems: 'flex-start' },
  depthLabel: { fontSize: 10, fontWeight: '900' },
  depthBar: { height: 10, borderRadius: 5 },
  depthGood: { backgroundColor: theme.colors.primary },
  depthRisk: { backgroundColor: theme.colors.risk },
  spreadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  pricePill: { width: 84, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  priceBuy: { backgroundColor: 'rgba(52,211,153,0.18)', borderWidth: 1, borderColor: theme.colors.success },
  priceSell: { backgroundColor: 'rgba(251,113,133,0.18)', borderWidth: 1, borderColor: theme.colors.risk },
  priceLabel: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '800' },
  priceNumber: { color: theme.colors.text, fontSize: 20, fontWeight: '900' },
  spreadGap: { alignItems: 'center' },
  spreadValue: { color: theme.colors.warning, fontSize: 25, fontWeight: '900' },
  orderTypeList: { gap: 7 },
  orderType: { minHeight: 34, borderRadius: 9, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.colors.surfaceMuted },
  orderTypeActive: { borderWidth: 1, borderColor: theme.colors.primary },
  orderTypeName: { color: theme.colors.primary, fontSize: 10, fontWeight: '900' },
  orderTypeNote: { color: theme.colors.textMuted, fontSize: 10 },
  fillLine: { height: 38, flexDirection: 'row', overflow: 'hidden', borderRadius: 9 },
  fillStep: { alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary },
  fillStep2: { backgroundColor: theme.colors.warning },
  fillStep3: { backgroundColor: theme.colors.risk },
  fillText: { color: theme.colors.primaryText, fontSize: 11, fontWeight: '900' },
  rangeTrack: { height: 38, flexDirection: 'row', overflow: 'hidden', borderRadius: 19 },
  rangeLeft: { flex: 1, backgroundColor: theme.colors.risk },
  rangeCenter: { flex: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.warning },
  rangeRight: { flex: 1, backgroundColor: theme.colors.success },
  rangeText: { color: theme.colors.primaryText, fontSize: 9, fontWeight: '900' },
  riskText: { color: theme.colors.risk, fontSize: 11, fontWeight: '800' },
  riskBudget: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 6, borderRadius: 9, backgroundColor: 'rgba(45,212,191,0.08)', borderWidth: 1, borderColor: 'rgba(45,212,191,0.32)' },
  riskBudgetLabel: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.55 },
  riskBudgetValue: { color: theme.colors.primary, fontSize: 16, fontWeight: '900' },
  riskBudgetNote: { color: theme.colors.textMuted, fontSize: 10 },
  sizingPlans: { flexDirection: 'row', gap: 9 },
  sizingPlan: { flex: 1, gap: 6, padding: 8, borderRadius: 10, backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border },
  sizingPlanHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sizingPlanLabel: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.45 },
  sizingPlanValue: { fontSize: 12, fontWeight: '900' },
  distanceTrack: { height: 22, position: 'relative', borderBottomWidth: 1, borderColor: 'rgba(159,176,195,0.28)' },
  entryMarker: { position: 'absolute', left: 1, bottom: 0, height: 13, paddingHorizontal: 3, borderRadius: 3, backgroundColor: 'rgba(45,212,191,0.24)' },
  entryMarkerText: { color: theme.colors.primary, fontSize: 7, fontWeight: '900' },
  stopMarker: { position: 'absolute', bottom: 0, height: 13, paddingHorizontal: 3, borderRadius: 3, backgroundColor: 'rgba(251,113,133,0.24)' },
  stopMarkerTight: { left: '39%' },
  stopMarkerWide: { right: 0 },
  stopMarkerText: { color: theme.colors.risk, fontSize: 7, fontWeight: '900' },
  sizeMeter: { height: 7, overflow: 'hidden', borderRadius: 4, backgroundColor: 'rgba(159,176,195,0.16)' },
  sizeMeterFill: { height: '100%', borderRadius: 4, backgroundColor: theme.colors.primary },
  sizeMeterLarge: { width: '78%' },
  sizeMeterSmall: { width: '35%', backgroundColor: theme.colors.warning },
  sizePlanResult: { color: theme.colors.text, fontSize: 9, fontWeight: '800', textAlign: 'center' },
  rewardPlan: { height: 84, overflow: 'hidden', borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  targetZone: { height: '48%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52,211,153,0.18)' },
  targetZoneText: { color: theme.colors.success, fontSize: 12, fontWeight: '900', letterSpacing: 0.35 },
  entryLine: { height: '10%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(159,176,195,0.18)' },
  entryLineText: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '900', letterSpacing: 0.55 },
  lossZone: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(251,113,133,0.16)' },
  lossZoneText: { color: theme.colors.risk, fontSize: 12, fontWeight: '900', letterSpacing: 0.35 },
  rewardChecks: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  rewardCheck: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: theme.colors.surfaceMuted },
  rewardCheckMark: { color: theme.colors.warning, fontSize: 12, fontWeight: '900' },
  rewardCheckText: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '900', letterSpacing: 0.45 },
  stopSequence: { gap: 2, padding: 8, borderRadius: 10, backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border },
  stopPriceRow: { minHeight: 23, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 7, borderRadius: 6, backgroundColor: 'rgba(159,176,195,0.08)' },
  stopPriceLabel: { width: 42, color: theme.colors.textMuted, fontSize: 8, fontWeight: '900', letterSpacing: 0.4 },
  stopPriceValue: { color: theme.colors.text, fontSize: 11, fontWeight: '900' },
  stopArrow: { alignSelf: 'center', color: theme.colors.textMuted, fontSize: 12, lineHeight: 12 },
  stopTrigger: { marginLeft: 'auto', color: theme.colors.warning, fontSize: 8, fontWeight: '900' },
  stopArrowRisk: { alignSelf: 'center', color: theme.colors.risk, fontSize: 12, lineHeight: 12 },
  fillRow: { backgroundColor: 'rgba(251,113,133,0.13)', borderWidth: 1, borderColor: 'rgba(251,113,133,0.36)' },
  fillLabel: { width: 42, color: theme.colors.risk, fontSize: 8, fontWeight: '900', letterSpacing: 0.4 },
  fillValue: { color: theme.colors.text, fontSize: 11, fontWeight: '900' },
  fillNote: { marginLeft: 'auto', color: theme.colors.risk, fontSize: 8, fontWeight: '800' },
  decisionLoop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  decisionStep: { width: 77, minHeight: 74, alignItems: 'center', justifyContent: 'center', gap: 3, padding: 6, borderRadius: 10, backgroundColor: theme.colors.surfaceMuted, borderWidth: 1, borderColor: theme.colors.border },
  decisionStepActive: { borderColor: 'rgba(45,212,191,0.68)', backgroundColor: 'rgba(45,212,191,0.08)' },
  decisionMarker: { width: 17, height: 17, borderRadius: 9, overflow: 'hidden', color: theme.colors.textMuted, fontSize: 9, lineHeight: 17, textAlign: 'center', fontWeight: '900', backgroundColor: 'rgba(159,176,195,0.14)' },
  decisionMarkerActive: { color: theme.colors.primaryText, backgroundColor: theme.colors.primary },
  decisionLabel: { color: theme.colors.text, fontSize: 9, fontWeight: '900', letterSpacing: 0.45 },
  decisionDetail: { color: theme.colors.textMuted, fontSize: 8, textAlign: 'center' },
  loopArrow: { color: theme.colors.textMuted, fontSize: 13, fontWeight: '700' },
  paceComparison: { flexDirection: 'row', gap: 8, alignItems: 'stretch' },
  paceCard: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, padding: 8, borderRadius: 10, backgroundColor: theme.colors.surfaceMuted },
  paceMarks: { color: theme.colors.risk, fontSize: 13, letterSpacing: 1 },
  paceMarksQuiet: { color: theme.colors.primary, fontSize: 13, letterSpacing: 1 },
  paceDivider: { borderLeftWidth: 1, borderColor: theme.colors.border },
  evidenceBalance: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  evidenceColumn: { flex: 1, minHeight: 61, justifyContent: 'center', gap: 7, padding: 7, borderRadius: 10, backgroundColor: theme.colors.surfaceMuted },
  evidencePrompt: { color: theme.colors.textMuted, fontSize: 9, textAlign: 'center' },
  evidenceCenter: { width: 43, alignItems: 'center', gap: 5 },
  evidenceBeam: { width: 36, borderTopWidth: 2, borderColor: theme.colors.warning },
  qualityStack: { gap: 10 },
  qualityRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  qualityLabel: { width: 65, color: theme.colors.textMuted, fontSize: 9, fontWeight: '800' },
  qualityTrack: { flex: 1, height: 11, overflow: 'hidden', borderRadius: 6, backgroundColor: theme.colors.surfaceMuted },
  qualityFill: { height: '100%', borderRadius: 6 },
  qualityGood: { backgroundColor: theme.colors.success },
  qualityWarn: { backgroundColor: theme.colors.warning },
  qualityRisk: { backgroundColor: theme.colors.risk },
  timeline: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, borderBottomWidth: 2, borderColor: theme.colors.border },
  timelineStep: { alignItems: 'center', gap: 5 },
  timelineTime: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '800' },
  timelineDot: { width: 12, height: 12, marginBottom: -7, borderRadius: 6, backgroundColor: theme.colors.textMuted },
  timelineDotNow: { width: 14, height: 14, marginBottom: -8, borderRadius: 7, backgroundColor: theme.colors.primary },
  journalCard: { gap: 8, padding: 11, borderRadius: 12, backgroundColor: theme.colors.surfaceMuted },
  journalTitle: { color: theme.colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  journalLine: { flexDirection: 'row', gap: 7 },
  journalText: { color: theme.colors.textMuted, fontSize: 11 },
});
