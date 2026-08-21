import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic = 'price' | 'instruments' | 'liquidity' | 'quotes' | 'orders' | 'slippage';

type Props = {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
};

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('fiyat-piyasada-nasil-olusur')) return 'price';
  if (assetRef.includes('piyasa-araclari-ayni-degildir')) return 'instruments';
  if (assetRef.includes('likidite-neden-onemlidir')) return 'liquidity';
  if (assetRef.includes('bid-ask-spread-nedir')) return 'quotes';
  if (assetRef.includes('piyasa-limit-stop-emirleri')) return 'orders';
  if (assetRef.includes('gerceklesme-fiyati-kayma')) return 'slippage';
  return undefined;
}

export function isBeginnerMarketStoryAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function BeginnerMarketStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: Props) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme, role === 'practice');
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {topic === 'price' ? <PriceStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'instruments' ? <InstrumentStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'liquidity' ? <LiquidityStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'quotes' ? <QuoteStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'orders' ? <OrderStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'slippage' ? <SlippageStory tr={tr} role={role} styles={styles} /> : null}
    </View>
  );
}

type SceneProps = {
  tr: boolean;
  role: LessonSupportingVisualRole;
  styles: ReturnType<typeof createStyles>;
};

function Heading({ styles, title, body }: { styles: ReturnType<typeof createStyles>; title: string; body?: string }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingTitle}>{title}</Text>
      {body ? <Text style={styles.headingBody}>{body}</Text> : null}
    </View>
  );
}

function Person({ styles, label, value, accent = false }: { styles: ReturnType<typeof createStyles>; label: string; value: string; accent?: boolean }) {
  return (
    <View style={[styles.personCard, accent && styles.personCardAccent]}>
      <View style={styles.personIcon}>
        <View style={styles.personHead} />
        <View style={styles.personBody} />
      </View>
      <Text style={styles.microLabel}>{label}</Text>
      <Text style={styles.personValue}>{value}</Text>
    </View>
  );
}

function PriceStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'İki taraf farklı fiyat düşünüyor' : 'Two sides have different prices in mind'} />
        <View style={styles.dualRow}>
          <Person styles={styles} label={tr ? 'ALICI' : 'BUYER'} value="98" accent />
          <View style={styles.gapMark}><View style={styles.gapLine} /><Text style={styles.gapText}>?</Text><View style={styles.gapLine} /></View>
          <Person styles={styles} label={tr ? 'SATICI' : 'SELLER'} value="102" />
        </View>
        <Text style={styles.bottomHint}>{tr ? 'İşlem olması için ortak bir noktada buluşmaları gerekir.' : 'A trade needs a price both sides can accept.'}</Text>
      </View>
    );
  }

  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'İki taraf 100’de buluştu' : 'Both sides meet at 100'} />
        <View style={styles.matchStage}>
          <View style={styles.sideOffer}><Text style={styles.microLabel}>{tr ? 'ALICI' : 'BUYER'}</Text><Text style={styles.offerValue}>100</Text></View>
          <View style={styles.arrowLine}><View style={styles.arrowStem} /><View style={styles.matchDot} /></View>
          <View style={styles.tradeBadge}><Text style={styles.tradeBadgeLabel}>{tr ? 'İŞLEM' : 'TRADE'}</Text><Text style={styles.tradeBadgeValue}>100</Text></View>
          <View style={styles.arrowLine}><View style={styles.matchDot} /><View style={styles.arrowStem} /></View>
          <View style={styles.sideOffer}><Text style={styles.microLabel}>{tr ? 'SATICI' : 'SELLER'}</Text><Text style={styles.offerValue}>100</Text></View>
        </View>
        <Text style={styles.bottomHint}>{tr ? 'Ekrandaki son fiyat, gerçekleşmiş bu buluşmanın kaydıdır.' : 'The last price records this completed meeting.'}</Text>
      </View>
    );
  }

  if (role === 'practice') {
    const buyers = ['98', '99', '100'];
    const sellers = ['102', '101', '100'];
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Teklifler yaklaşır, eşleşme oluşur' : 'Offers move closer until a match forms'} body={tr ? 'Tek bir fiyat etiketi değil, iki tarafın teklifleri var.' : 'There is no single fixed tag; both sides have offers.'} />
        <View style={styles.offerBook}>
          <View style={styles.offerColumn}>
            <Text style={styles.columnLabel}>{tr ? 'ALICILAR' : 'BUYERS'}</Text>
            {buyers.map((value) => <View key={`b-${value}`} style={[styles.offerPill, value === '100' && styles.offerPillMatch]}><Text style={styles.offerPillText}>{value}</Text></View>)}
          </View>
          <View style={styles.bookCenter}>
            <View style={styles.bookLine} />
            <View style={styles.tradeBadgeLarge}><Text style={styles.tradeBadgeLabel}>{tr ? 'EŞLEŞME' : 'MATCH'}</Text><Text style={styles.tradeBadgeValue}>100</Text></View>
            <View style={styles.bookLine} />
          </View>
          <View style={styles.offerColumn}>
            <Text style={styles.columnLabel}>{tr ? 'SATICILAR' : 'SELLERS'}</Text>
            {sellers.map((value) => <View key={`s-${value}`} style={[styles.offerPill, value === '100' && styles.offerPillMatch]}><Text style={styles.offerPillText}>{value}</Text></View>)}
          </View>
        </View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Fiyatı tek bir taraf seçmez' : 'One side does not choose the price'} />
        <View style={styles.mistakeStage}>
          <View style={styles.fixedTag}>
            <Text style={styles.fixedTagSmall}>{tr ? 'ŞİRKET FİYATI' : 'COMPANY PRICE'}</Text>
            <Text style={styles.fixedTagValue}>100</Text>
            <View style={styles.strike} />
          </View>
          <View style={styles.notEqual}><Text style={styles.notEqualText}>≠</Text></View>
          <View style={styles.marketMini}>
            <Text style={styles.microLabel}>{tr ? 'PİYASA' : 'MARKET'}</Text>
            <View style={styles.miniMeetRow}><View style={styles.miniPerson} /><View style={styles.matchDot} /><View style={styles.miniPerson} /></View>
            <Text style={styles.marketMiniText}>{tr ? 'Alıcı + satıcı' : 'Buyer + seller'}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Fiyat = iki tarafın buluştuğu nokta' : 'Price = where two sides meet'} />
      <View style={styles.summaryMeet}>
        <View style={styles.summarySide}><Text style={styles.microLabel}>{tr ? 'ALICI' : 'BUYER'}</Text></View>
        <View style={styles.summaryArrow} />
        <View style={styles.summaryPrice}><Text style={styles.summaryPriceText}>100</Text></View>
        <View style={styles.summaryArrow} />
        <View style={styles.summarySide}><Text style={styles.microLabel}>{tr ? 'SATICI' : 'SELLER'}</Text></View>
      </View>
    </View>
  );
}

function InstrumentIcon({ styles, kind }: { styles: ReturnType<typeof createStyles>; kind: 'stock' | 'bond' | 'fx' | 'gold' }) {
  if (kind === 'stock') {
    return <View style={styles.building}><View style={styles.buildingRoof} /><View style={styles.buildingBody}><View style={styles.windowPair}><View style={styles.window} /><View style={styles.window} /></View><View style={styles.windowPair}><View style={styles.window} /><View style={styles.window} /></View></View></View>;
  }
  if (kind === 'bond') {
    return <View style={styles.paper}><View style={styles.paperLine} /><View style={styles.paperLineShort} /><View style={styles.paperSeal} /></View>;
  }
  if (kind === 'fx') {
    return <View style={styles.coinPair}><View style={styles.coin}><Text style={styles.coinText}>₺</Text></View><View style={styles.coin}><Text style={styles.coinText}>$</Text></View></View>;
  }
  return <View style={styles.goldStack}><View style={styles.goldBar} /><View style={[styles.goldBar, styles.goldBarShift]} /></View>;
}

function InstrumentStory({ tr, role, styles }: SceneProps) {
  const items = [
    { kind: 'stock' as const, title: tr ? 'HİSSE' : 'STOCK', sub: tr ? 'Şirkete ortaklık' : 'Company ownership' },
    { kind: 'bond' as const, title: tr ? 'TAHVİL' : 'BOND', sub: tr ? 'Borç verme' : 'Lending' },
    { kind: 'fx' as const, title: tr ? 'DÖVİZ' : 'FX', sub: tr ? 'İki paranın değeri' : 'Two currencies' },
    { kind: 'gold' as const, title: tr ? 'EMTİA' : 'COMMODITY', sub: tr ? 'Altın, petrol…' : 'Gold, oil…' },
  ];

  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? '“Şirkete ortak olmak” hangisi?' : 'Which one means owning part of a company?'} />
        <View style={styles.instrumentGrid}>
          {items.map((item) => (
            <View key={item.kind} style={[styles.instrumentCard, item.kind === 'stock' && styles.instrumentCardActive]}>
              <InstrumentIcon styles={styles} kind={item.kind} />
              <Text style={styles.instrumentTitle}>{item.title}</Text>
              {item.kind === 'stock' ? <Text style={styles.instrumentSub}>{item.sub}</Text> : null}
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Grafik benzer, anlam farklı olabilir' : 'Charts can look alike while meaning differs'} />
        <View style={styles.instrumentCompare}>
          {items.slice(0, 3).map((item, index) => (
            <View key={item.kind} style={styles.chartInstrumentCard}>
              <InstrumentIcon styles={styles} kind={item.kind} />
              <View style={styles.miniChart}>{[8, 16, 12, 23].map((height, i) => <View key={i} style={[styles.chartBar, { height: height + index * 2 }]} />)}</View>
            </View>
          ))}
        </View>
        <Text style={styles.bottomHint}>{tr ? 'Önce ürünün neyi temsil ettiğini sor.' : 'Ask what the instrument represents first.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={role === 'summary' ? (tr ? 'Dört ürün, dört farklı anlam' : 'Four products, four different meanings') : (tr ? 'Hepsi yatırım aracı; aynı şey değiller' : 'All are market instruments; they are not the same thing')} />
      <View style={styles.instrumentGrid}>
        {items.map((item) => (
          <View key={item.kind} style={styles.instrumentCard}>
            <InstrumentIcon styles={styles} kind={item.kind} />
            <Text style={styles.instrumentTitle}>{item.title}</Text>
            <Text style={styles.instrumentSub}>{item.sub}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Crowd({ styles, count, accent = false }: { styles: ReturnType<typeof createStyles>; count: number; accent?: boolean }) {
  return (
    <View style={styles.crowd}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.crowdDot, accent && index % 3 === 0 && styles.crowdDotAccent]} />
      ))}
    </View>
  );
}

function LiquidityStory({ tr, role, styles }: SceneProps) {
  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Aynı satış, iki farklı piyasa' : 'Same sale, two different markets'} />
        <View style={styles.liquidityCompare}>
          <View style={[styles.liquidityCard, styles.liquidityCardActive]}><Crowd styles={styles} count={16} accent /><Text style={styles.instrumentTitle}>{tr ? 'ÇOK ALICI' : 'MANY BUYERS'}</Text><View style={styles.impactBarSmall} /><Text style={styles.impactText}>{tr ? 'Küçük fiyat etkisi' : 'Smaller price impact'}</Text></View>
          <View style={styles.liquidityCard}><Crowd styles={styles} count={4} /><Text style={styles.instrumentTitle}>{tr ? 'AZ ALICI' : 'FEW BUYERS'}</Text><View style={styles.impactBarLarge} /><Text style={styles.impactText}>{tr ? 'Daha büyük fiyat etkisi' : 'Larger price impact'}</Text></View>
        </View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? '“Bugün çok işlem oldu” tek başına yetmez' : '“Many trades today” is not enough by itself'} />
        <View style={styles.volumeVsNow}>
          <View style={styles.volumeBlock}><Text style={styles.microLabel}>{tr ? 'GÜNLÜK İŞLEM' : 'DAILY TRADES'}</Text><View style={styles.volumeBars}>{[26, 42, 58, 38].map((h, i) => <View key={i} style={[styles.volumeBar, { height: h }]} />)}</View></View>
          <View style={styles.nowBlock}><Text style={styles.microLabel}>{tr ? 'ŞU ANDA' : 'RIGHT NOW'}</Text><Crowd styles={styles} count={3} /><Text style={styles.impactText}>{tr ? 'Karşı taraf az olabilir' : 'The other side can still be thin'}</Text></View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={role === 'summary' ? (tr ? 'Likidite = alıp satma kolaylığı' : 'Liquidity = ease of trading') : (tr ? 'Karşı taraf çoksa işlem daha kolaydır' : 'More people on the other side makes trading easier')} />
      <View style={styles.liquidityCompare}>
        <View style={[styles.liquidityCard, styles.liquidityCardActive]}><Crowd styles={styles} count={16} accent /><Text style={styles.resultGood}>{tr ? 'DAHA KOLAY' : 'EASIER'}</Text></View>
        <View style={styles.liquidityCard}><Crowd styles={styles} count={4} /><Text style={styles.resultMuted}>{tr ? 'DAHA ZOR' : 'HARDER'}</Text></View>
      </View>
    </View>
  );
}

function QuoteBox({ styles, label, value, active = false }: { styles: ReturnType<typeof createStyles>; label: string; value: string; active?: boolean }) {
  return <View style={[styles.quoteBox, active && styles.quoteBoxActive]}><Text style={styles.microLabel}>{label}</Text><Text style={styles.quoteValue}>{value}</Text></View>;
}

function QuoteStory({ tr, role, styles }: SceneProps) {
  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Alırken ve satarken farklı tarafa gidersin' : 'Buying and selling use different sides'} />
        <View style={styles.quoteActionGrid}>
          <View style={styles.quoteAction}><Text style={styles.actionTitle}>{tr ? 'ALMAK İSTİYORSUN' : 'YOU WANT TO BUY'}</Text><View style={styles.actionArrowDown} /><QuoteBox styles={styles} label={tr ? 'SATICI TEKLİFİ' : 'SELLER OFFER'} value="101" active /></View>
          <View style={styles.quoteAction}><Text style={styles.actionTitle}>{tr ? 'SATMAK İSTİYORSUN' : 'YOU WANT TO SELL'}</Text><View style={styles.actionArrowDown} /><QuoteBox styles={styles} label={tr ? 'ALICI TEKLİFİ' : 'BUYER OFFER'} value="99" /></View>
        </View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Son fiyat, iki teklifin yerine geçmez' : 'Last price does not replace the two offers'} />
        <View style={styles.lastVsQuotes}><QuoteBox styles={styles} label={tr ? 'ALICI' : 'BUYER'} value="99" /><View style={styles.lastPrice}><Text style={styles.microLabel}>{tr ? 'SON İŞLEM' : 'LAST TRADE'}</Text><Text style={styles.lastPriceValue}>100</Text></View><QuoteBox styles={styles} label={tr ? 'SATICI' : 'SELLER'} value="101" /></View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={role === 'summary' ? (tr ? 'Aradaki farkın adı: spread' : 'The gap is called the spread') : (tr ? 'Aynı varlık için iki teklif olabilir' : 'The same asset can have two offers')} />
      <View style={styles.quoteRow}>
        <QuoteBox styles={styles} label={tr ? 'ALICI TEKLİFİ' : 'BUYER OFFER'} value="99" />
        <View style={styles.spreadCenter}><View style={styles.spreadLine} /><Text style={styles.spreadNumber}>2</Text><Text style={styles.microLabel}>SPREAD</Text><View style={styles.spreadLine} /></View>
        <QuoteBox styles={styles} label={tr ? 'SATICI TEKLİFİ' : 'SELLER OFFER'} value="101" active />
      </View>
    </View>
  );
}

function OrderChoice({ styles, title, sub, marker, active = false }: { styles: ReturnType<typeof createStyles>; title: string; sub: string; marker: string; active?: boolean }) {
  return <View style={[styles.orderChoice, active && styles.orderChoiceActive]}><View style={styles.orderMarker}><Text style={styles.orderMarkerText}>{marker}</Text></View><Text style={styles.orderChoiceTitle}>{title}</Text><Text style={styles.orderChoiceSub}>{sub}</Text></View>;
}

function OrderStory({ tr, role, styles }: SceneProps) {
  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? '100’ün üstünden almak istemiyorsun' : 'You do not want to buy above 100'} />
        <View style={styles.priceBoundaryStage}><View style={styles.priceScale}><Text style={styles.scaleText}>98</Text><View style={styles.scaleLine} /><View style={styles.boundary}><Text style={styles.boundaryText}>100</Text></View><View style={styles.scaleLine} /><Text style={styles.scaleText}>102</Text></View><Text style={styles.boundaryCaption}>{tr ? 'Fiyat sınırı koyan seçenek: LIMIT' : 'The option that sets a price boundary: LIMIT'}</Text></View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Her seçeneğin bir karşılığı vardır' : 'Every choice has a trade-off'} />
        <View style={styles.orderRiskGrid}><View style={styles.orderRisk}><Text style={styles.orderRiskTitle}>MARKET</Text><Text style={styles.orderRiskQuestion}>{tr ? 'Fiyat?' : 'Price?'}</Text></View><View style={styles.orderRisk}><Text style={styles.orderRiskTitle}>LIMIT</Text><Text style={styles.orderRiskQuestion}>{tr ? 'Gerçekleşir mi?' : 'Will it fill?'}</Text></View><View style={styles.orderRisk}><Text style={styles.orderRiskTitle}>STOP</Text><Text style={styles.orderRiskQuestion}>{tr ? 'Hangi fiyattan?' : 'At what price?'}</Text></View></View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={role === 'summary' ? (tr ? 'Emir türü = neyi önemsediğin' : 'Order type = what you prioritize') : (tr ? 'Üç farklı davranış seçersin' : 'You choose between three different behaviors')} />
      <View style={styles.orderGrid}>
        <OrderChoice styles={styles} title={tr ? 'ŞİMDİ' : 'NOW'} sub={tr ? 'Hız öncelikli' : 'Speed first'} marker="→" />
        <OrderChoice styles={styles} title="LIMIT" sub={tr ? 'Fiyat sınırı' : 'Price boundary'} marker="|" active />
        <OrderChoice styles={styles} title="STOP" sub={tr ? 'Tetik bekler' : 'Waits for trigger'} marker="○" />
      </View>
    </View>
  );
}

function SlippageStory({ tr, role, styles }: SceneProps) {
  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Emrin giderken piyasa hareket edebilir' : 'The market can move while your order travels'} />
        <View style={styles.timeline}><View style={styles.timelinePoint}><Text style={styles.microLabel}>{tr ? 'GÖRDÜN' : 'SAW'}</Text><Text style={styles.timelineValue}>100</Text></View><View style={styles.timelineTrack}><View style={styles.timelineDot} /><View style={styles.timelineLine} /><View style={styles.timelineDotActive} /></View><View style={[styles.timelinePoint, styles.timelinePointActive]}><Text style={styles.microLabel}>{tr ? 'GERÇEKLEŞTİ' : 'EXECUTED'}</Text><Text style={styles.timelineValue}>100,3</Text></View></View>
      </View>
    );
  }

  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Hızlı ve sığ piyasada fark büyüyebilir' : 'The gap can grow in a fast, thin market'} />
        <View style={styles.slippageCompare}><View style={[styles.slippageCase, styles.slippageCaseCalm]}><Text style={styles.caseTitle}>{tr ? 'SAKİN + ÇOK ALICI' : 'CALM + MANY BUYERS'}</Text><View style={styles.pricePair}><Text style={styles.pricePairText}>100</Text><Text style={styles.priceArrow}>→</Text><Text style={styles.pricePairText}>100,0</Text></View><View style={styles.gapBarTiny} /></View><View style={styles.slippageCase}><Text style={styles.caseTitle}>{tr ? 'HIZLI + AZ ALICI' : 'FAST + FEW BUYERS'}</Text><View style={styles.pricePair}><Text style={styles.pricePairText}>100</Text><Text style={styles.priceArrow}>→</Text><Text style={styles.pricePairText}>100,7</Text></View><View style={styles.gapBarWide} /></View></View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Düğmeye basmak fiyatı kilitlemez' : 'Pressing the button does not lock the price'} />
        <View style={styles.lockStage}><View style={styles.screenPrice}><Text style={styles.microLabel}>{tr ? 'EKRANDA' : 'ON SCREEN'}</Text><Text style={styles.screenPriceValue}>100</Text></View><View style={styles.lockShape}><View style={styles.lockLoop} /><View style={styles.lockBody}><View style={styles.lockSlash} /></View></View><View style={[styles.screenPrice, styles.screenPriceActive]}><Text style={styles.microLabel}>{tr ? 'İŞLEM' : 'TRADE'}</Text><Text style={styles.screenPriceValue}>100,3</Text></View></View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={role === 'summary' ? (tr ? 'Görülen fiyat bir referanstır' : 'The displayed price is a reference') : (tr ? 'Gördüğün ve aldığın fiyat farklı olabilir' : 'The price you see and receive can differ')} />
      <View style={styles.slippageSimple}><View style={styles.screenPrice}><Text style={styles.microLabel}>{tr ? 'EKRANDA' : 'ON SCREEN'}</Text><Text style={styles.screenPriceValue}>100</Text></View><View style={styles.travelArrow}><View style={styles.travelLine} /><Text style={styles.travelArrowText}>›</Text></View><View style={[styles.screenPrice, styles.screenPriceActive]}><Text style={styles.microLabel}>{tr ? 'GERÇEKLEŞEN' : 'EXECUTED'}</Text><Text style={styles.screenPriceValue}>100,3</Text></View></View>
    </View>
  );
}

const createStyles = (theme: LearningTheme, practice: boolean) => StyleSheet.create({
  shell: {
    width: '100%',
    minHeight: practice ? 390 : 240,
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#27465C',
    backgroundColor: '#081726',
    padding: practice ? 18 : 15,
    overflow: 'hidden',
  },
  story: { width: '100%', gap: 16, justifyContent: 'center' },
  heading: { gap: 5 },
  headingTitle: { color: theme.colors.text, fontSize: practice ? 20 : 17, lineHeight: practice ? 27 : 23, fontWeight: '900' },
  headingBody: { color: '#879CAE', fontSize: 11, lineHeight: 16 },
  bottomHint: { color: '#8EA3B4', fontSize: 11, lineHeight: 16, textAlign: 'center' },
  microLabel: { color: '#8EA3B4', fontSize: 8, lineHeight: 11, fontWeight: '900', letterSpacing: 0.55, textAlign: 'center' },
  dualRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  personCard: { flex: 1, minHeight: 116, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 15, borderWidth: 1, borderColor: '#304C60', backgroundColor: '#0E2232' },
  personCardAccent: { borderColor: '#2C746F', backgroundColor: '#0D3034' },
  personIcon: { height: 39, alignItems: 'center' },
  personHead: { width: 15, height: 15, borderRadius: 8, backgroundColor: '#CCD9E2' },
  personBody: { width: 30, height: 20, marginTop: 3, borderTopLeftRadius: 13, borderTopRightRadius: 13, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, backgroundColor: '#6F8DA3' },
  personValue: { color: '#F3F8FB', fontSize: 23, fontWeight: '900' },
  gapMark: { width: 35, alignItems: 'center', gap: 3 },
  gapLine: { width: 28, height: 1, backgroundColor: '#35566A' },
  gapText: { color: '#50DFCD', fontSize: 16, fontWeight: '900' },
  matchStage: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  sideOffer: { width: 58, alignItems: 'center', gap: 3 },
  offerValue: { color: '#F8FAFC', fontSize: 22, fontWeight: '900' },
  arrowLine: { width: 32, flexDirection: 'row', alignItems: 'center' },
  arrowStem: { flex: 1, height: 2, backgroundColor: '#2E6E72' },
  matchDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#43DBC8', borderWidth: 2, borderColor: '#123C42' },
  tradeBadge: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', gap: 1, borderWidth: 1, borderColor: '#2F847B', backgroundColor: '#10383C' },
  tradeBadgeLarge: { minWidth: 82, paddingHorizontal: 12, height: 82, borderRadius: 41, alignItems: 'center', justifyContent: 'center', gap: 1, borderWidth: 1, borderColor: '#2F847B', backgroundColor: '#10383C' },
  tradeBadgeLabel: { color: '#72E8D7', fontSize: 8, fontWeight: '900', letterSpacing: 0.4 },
  tradeBadgeValue: { color: '#F8FAFC', fontSize: 22, fontWeight: '900' },
  offerBook: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  offerColumn: { width: 78, gap: 7 },
  columnLabel: { color: '#8095A8', fontSize: 8, fontWeight: '900', textAlign: 'center' },
  offerPill: { height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#304C60', backgroundColor: '#0F2232' },
  offerPillMatch: { borderColor: '#32A394', backgroundColor: '#103A3A' },
  offerPillText: { color: '#F1F6F9', fontSize: 16, fontWeight: '900' },
  bookCenter: { flex: 1, alignItems: 'center', gap: 6 },
  bookLine: { width: '100%', height: 1, backgroundColor: '#244658' },
  mistakeStage: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fixedTag: { flex: 1, minHeight: 118, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 15, borderWidth: 1, borderColor: '#5A4650', backgroundColor: '#211D29', overflow: 'hidden' },
  fixedTagSmall: { color: '#AFA1A7', fontSize: 8, fontWeight: '900' },
  fixedTagValue: { color: '#E8DFE3', fontSize: 25, fontWeight: '900' },
  strike: { position: 'absolute', width: 90, height: 3, backgroundColor: '#C47E72', transform: [{ rotate: '-28deg' }] },
  notEqual: { width: 24, alignItems: 'center' },
  notEqualText: { color: '#C5D2DC', fontSize: 21, fontWeight: '900' },
  marketMini: { flex: 1, minHeight: 118, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 15, borderWidth: 1, borderColor: '#2B706C', backgroundColor: '#0D2D33' },
  miniMeetRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniPerson: { width: 24, height: 30, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, backgroundColor: '#708B9E' },
  marketMiniText: { color: '#DCE8ED', fontSize: 10, fontWeight: '800' },
  summaryMeet: { minHeight: 135, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  summarySide: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#112A39', borderWidth: 1, borderColor: '#31536A' },
  summaryArrow: { width: 38, height: 2, backgroundColor: '#337B77' },
  summaryPrice: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: '#103A3C', borderWidth: 1, borderColor: '#31A091' },
  summaryPriceText: { color: '#F7FAFC', fontSize: 24, fontWeight: '900' },
  instrumentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  instrumentCard: { width: '48.5%', minHeight: 116, alignItems: 'center', justifyContent: 'center', gap: 6, padding: 8, borderRadius: 14, borderWidth: 1, borderColor: '#2D485D', backgroundColor: '#0E2131' },
  instrumentCardActive: { borderColor: '#2C887B', backgroundColor: '#0D3336' },
  instrumentTitle: { color: '#EAF1F5', fontSize: 10, fontWeight: '900', textAlign: 'center' },
  instrumentSub: { color: '#8197A8', fontSize: 9, lineHeight: 13, textAlign: 'center' },
  building: { width: 48, alignItems: 'center' },
  buildingRoof: { width: 0, height: 0, borderLeftWidth: 23, borderRightWidth: 23, borderBottomWidth: 13, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#7391A4' },
  buildingBody: { width: 40, height: 31, padding: 6, gap: 4, backgroundColor: '#3C586B' },
  windowPair: { flexDirection: 'row', justifyContent: 'space-between' },
  window: { width: 8, height: 6, borderRadius: 2, backgroundColor: '#ABC4CC' },
  paper: { width: 40, height: 48, padding: 9, gap: 7, borderRadius: 5, backgroundColor: '#CFD9E0' },
  paperLine: { height: 3, borderRadius: 2, backgroundColor: '#607B8E' },
  paperLineShort: { width: '65%', height: 3, borderRadius: 2, backgroundColor: '#8095A5' },
  paperSeal: { width: 10, height: 10, borderRadius: 5, alignSelf: 'flex-end', marginTop: 2, backgroundColor: '#4E827F' },
  coinPair: { flexDirection: 'row', gap: 5 },
  coin: { width: 31, height: 31, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#4C747D', backgroundColor: '#183943' },
  coinText: { color: '#E4EDF1', fontSize: 14, fontWeight: '900' },
  goldStack: { width: 52, height: 45, justifyContent: 'center' },
  goldBar: { width: 47, height: 17, borderRadius: 5, backgroundColor: '#9D7738', transform: [{ skewX: '-12deg' }] },
  goldBarShift: { marginTop: -3, marginLeft: 5, backgroundColor: '#B58A42' },
  instrumentCompare: { flexDirection: 'row', gap: 8 },
  chartInstrumentCard: { flex: 1, minHeight: 135, alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 14, borderWidth: 1, borderColor: '#2A4659', backgroundColor: '#0D2030' },
  miniChart: { height: 30, flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  chartBar: { width: 5, borderRadius: 2, backgroundColor: '#4AB7AA' },
  crowd: { minHeight: 75, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 6 },
  crowdDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#718596' },
  crowdDotAccent: { backgroundColor: '#42D7C4' },
  liquidityCompare: { flexDirection: 'row', gap: 9 },
  liquidityCard: { flex: 1, minHeight: 170, alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#2E475B', backgroundColor: '#0D1F2F' },
  liquidityCardActive: { borderColor: '#2D756F', backgroundColor: '#0D2C32' },
  resultGood: { color: '#63E1D1', fontSize: 13, fontWeight: '900' },
  resultMuted: { color: '#BCC9D2', fontSize: 13, fontWeight: '900' },
  impactBarSmall: { width: '38%', height: 5, borderRadius: 3, backgroundColor: '#3BCDBA' },
  impactBarLarge: { width: '82%', height: 5, borderRadius: 3, backgroundColor: '#B9875B' },
  impactText: { color: '#899EAF', fontSize: 9, lineHeight: 13, textAlign: 'center' },
  volumeVsNow: { flexDirection: 'row', gap: 9 },
  volumeBlock: { flex: 1, minHeight: 150, alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: 15, borderWidth: 1, borderColor: '#354B5D', backgroundColor: '#0E2030' },
  volumeBars: { height: 62, flexDirection: 'row', alignItems: 'flex-end', gap: 5 },
  volumeBar: { width: 10, borderRadius: 3, backgroundColor: '#4BB9AE' },
  nowBlock: { flex: 1, minHeight: 150, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 15, borderWidth: 1, borderColor: '#5B4E54', backgroundColor: '#211E2B' },
  quoteRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  quoteBox: { flex: 1, minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 15, borderWidth: 1, borderColor: '#304B60', backgroundColor: '#0E2131' },
  quoteBoxActive: { borderColor: '#2E766F', backgroundColor: '#0E2E33' },
  quoteValue: { color: '#F4F8FA', fontSize: 28, fontWeight: '900' },
  spreadCenter: { width: 52, alignItems: 'center', gap: 3 },
  spreadLine: { width: 32, height: 1, backgroundColor: '#337A75' },
  spreadNumber: { color: '#56DCCA', fontSize: 20, fontWeight: '900' },
  quoteActionGrid: { flexDirection: 'row', gap: 9 },
  quoteAction: { flex: 1, alignItems: 'center', gap: 8 },
  actionTitle: { minHeight: 31, color: '#A9BAC6', fontSize: 9, lineHeight: 13, fontWeight: '900', textAlign: 'center' },
  actionArrowDown: { width: 2, height: 20, backgroundColor: '#387E78' },
  lastVsQuotes: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  lastPrice: { width: 65, height: 82, borderRadius: 15, alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: '#5D5360', backgroundColor: '#211F2B' },
  lastPriceValue: { color: '#CFD8DF', fontSize: 19, fontWeight: '900' },
  orderGrid: { flexDirection: 'row', gap: 7 },
  orderChoice: { flex: 1, minHeight: 142, alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 5, borderRadius: 14, borderWidth: 1, borderColor: '#30495D', backgroundColor: '#0E2030' },
  orderChoiceActive: { borderColor: '#2D786F', backgroundColor: '#0D2E33' },
  orderMarker: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: '#173848' },
  orderMarkerText: { color: '#60E0D0', fontSize: 20, fontWeight: '900' },
  orderChoiceTitle: { color: '#EBF2F6', fontSize: 9, fontWeight: '900', textAlign: 'center' },
  orderChoiceSub: { color: '#8196A8', fontSize: 8, lineHeight: 12, textAlign: 'center' },
  priceBoundaryStage: { minHeight: 200, justifyContent: 'center', gap: 25 },
  priceScale: { flexDirection: 'row', alignItems: 'center' },
  scaleText: { color: '#8398AA', fontSize: 11, fontWeight: '800' },
  scaleLine: { flex: 1, height: 2, backgroundColor: '#365466' },
  boundary: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#42D5C3', backgroundColor: '#0E3739' },
  boundaryText: { color: '#F6FAFC', fontSize: 22, fontWeight: '900' },
  boundaryCaption: { color: '#5EDCCA', fontSize: 11, lineHeight: 16, fontWeight: '800', textAlign: 'center' },
  orderRiskGrid: { flexDirection: 'row', gap: 7 },
  orderRisk: { flex: 1, minHeight: 132, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 6, borderRadius: 14, borderWidth: 1, borderColor: '#4A4652', backgroundColor: '#171F2C' },
  orderRiskTitle: { color: '#C9D5DD', fontSize: 9, fontWeight: '900' },
  orderRiskQuestion: { color: '#D7A982', fontSize: 11, lineHeight: 15, fontWeight: '800', textAlign: 'center' },
  timeline: { minHeight: 150, flexDirection: 'row', alignItems: 'center' },
  timelinePoint: { width: 85, minHeight: 104, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 15, borderWidth: 1, borderColor: '#354E61', backgroundColor: '#0E2131' },
  timelinePointActive: { borderColor: '#2F766F', backgroundColor: '#0D3034' },
  timelineValue: { color: '#F4F8FA', fontSize: 22, fontWeight: '900' },
  timelineTrack: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  timelineDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#718596' },
  timelineLine: { flex: 1, height: 2, backgroundColor: '#33766F' },
  timelineDotActive: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#48D7C4' },
  slippageCompare: { flexDirection: 'row', gap: 9 },
  slippageCase: { flex: 1, minHeight: 165, alignItems: 'center', justifyContent: 'center', gap: 13, padding: 10, borderRadius: 15, borderWidth: 1, borderColor: '#594C53', backgroundColor: '#211E2A' },
  slippageCaseCalm: { borderColor: '#2B726D', backgroundColor: '#0D2A31' },
  caseTitle: { color: '#9CB0BE', fontSize: 8, lineHeight: 12, fontWeight: '900', textAlign: 'center' },
  pricePair: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  pricePairText: { color: '#EEF4F7', fontSize: 15, fontWeight: '900' },
  priceArrow: { color: '#7A909F', fontSize: 15 },
  gapBarTiny: { width: '16%', height: 5, borderRadius: 3, backgroundColor: '#43D3C0' },
  gapBarWide: { width: '70%', height: 5, borderRadius: 3, backgroundColor: '#BE815E' },
  lockStage: { minHeight: 150, flexDirection: 'row', alignItems: 'center', gap: 9 },
  screenPrice: { flex: 1, minHeight: 115, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 15, borderWidth: 1, borderColor: '#334F62', backgroundColor: '#0E2131' },
  screenPriceActive: { borderColor: '#2B716C', backgroundColor: '#0D2D32' },
  screenPriceValue: { color: '#F4F8FA', fontSize: 24, fontWeight: '900' },
  lockShape: { width: 54, height: 70, alignItems: 'center', justifyContent: 'flex-end' },
  lockLoop: { position: 'absolute', top: 3, width: 32, height: 34, borderTopLeftRadius: 17, borderTopRightRadius: 17, borderWidth: 4, borderBottomWidth: 0, borderColor: '#8B797D' },
  lockBody: { width: 45, height: 38, borderRadius: 9, backgroundColor: '#4A414B', overflow: 'hidden' },
  lockSlash: { position: 'absolute', width: 58, height: 4, top: 17, left: -7, backgroundColor: '#C28070', transform: [{ rotate: '-32deg' }] },
  slippageSimple: { minHeight: 150, flexDirection: 'row', alignItems: 'center', gap: 8 },
  travelArrow: { width: 55, flexDirection: 'row', alignItems: 'center' },
  travelLine: { flex: 1, height: 2, backgroundColor: '#33746F' },
  travelArrowText: { color: '#55D8C8', fontSize: 22, fontWeight: '900', marginTop: -3 },
});
