import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic = 'risk' | 'volatility' | 'size' | 'reward' | 'stop' | 'diversification';
type Props = {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
};
type Styles = ReturnType<typeof createStyles>;
type StoryProps = { tr: boolean; role: LessonSupportingVisualRole; styles: Styles };

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('risk-belirsizlik-kayip')) return 'risk';
  if (assetRef.includes('volatilite-once-risktir')) return 'volatility';
  if (assetRef.includes('pozisyon-buyuklugu-once-gelir')) return 'size';
  if (assetRef.includes('risk-getiri-tek-basina-yetmez')) return 'reward';
  if (assetRef.includes('stop-emri-garanti-midir')) return 'stop';
  if (assetRef.includes('cok-varlik-cesitlendirme-degildir')) return 'diversification';
  return undefined;
}

export function isBeginnerRiskStoryAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function BeginnerRiskStoryVisual({
  assetRef,
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: Props) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;

  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const phone = width < 420;
  const styles = createStyles(theme, wide, phone, role === 'practice');
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {topic === 'risk' ? <RiskStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'volatility' ? <VolatilityStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'size' ? <SizeStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'reward' ? <RewardStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'stop' ? <StopStory tr={tr} role={role} styles={styles} /> : null}
      {topic === 'diversification' ? <DiversificationStory tr={tr} role={role} styles={styles} /> : null}
    </View>
  );
}

function Heading({ styles, children }: { styles: Styles; children: string }) {
  return <Text style={styles.heading}>{children}</Text>;
}

function Label({ styles, children }: { styles: Styles; children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

function Card({
  styles,
  aria,
  accent,
  danger,
  children,
}: {
  styles: Styles;
  aria?: string;
  accent?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[styles.card, accent && styles.accentCard, danger && styles.dangerCard]}
      accessibilityLabel={aria}
    >
      {children}
    </View>
  );
}

function RiskStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles}>{tr ? 'Sonuç belli değilken risk zaten vardır.' : 'Risk exists before the outcome is known.'}</Heading>
        <View style={styles.branchBoard} accessibilityLabel="risk-uncertainty-branches">
          <View style={[styles.node, styles.accentCard]}><Label styles={styles}>{tr ? 'KARAR' : 'DECISION'}</Label></View>
          <View style={styles.branchLine} />
          <View style={styles.threeRow}>
            <View style={[styles.miniOutcome, styles.accentCard]}><Label styles={styles}>{tr ? 'İYİ' : 'GOOD'}</Label></View>
            <View style={styles.miniOutcome}><Label styles={styles}>{tr ? 'NÖTR' : 'NEUTRAL'}</Label></View>
            <View style={[styles.miniOutcome, styles.dangerCard]}><Label styles={styles}>{tr ? 'KÖTÜ' : 'BAD'}</Label></View>
          </View>
        </View>
      </View>
    );
  }

  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles}>{tr ? 'Risk olasılıktır; kayıp gerçekleşmiş sonuçtur.' : 'Risk is a possibility; loss is a realized outcome.'}</Heading>
        <View style={styles.pair}>
          <Card styles={styles} aria="risk-possibility" accent><Label styles={styles}>{tr ? 'KARAR ANINDA' : 'AT DECISION'}</Label><Text style={styles.question}>?</Text><Text style={styles.caption}>{tr ? 'Kötü sonuç olabilir' : 'A bad result is possible'}</Text></Card>
          <Card styles={styles} aria="risk-realized-loss" danger><Label styles={styles}>{tr ? 'SONRA' : 'LATER'}</Label><Text style={styles.loss}>−500</Text><Text style={styles.caption}>{tr ? 'Kayıp gerçekleşti' : 'Loss happened'}</Text></Card>
        </View>
      </View>
    );
  }

  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles}>{tr ? 'Riski sonuçtan önce düşün.' : 'Think about risk before the result.'}</Heading>
        <View style={styles.pair}>
          <Card styles={styles} aria="risk-before" accent><Text style={styles.step}>1</Text><Label styles={styles}>{tr ? 'ÖNCE' : 'BEFORE'}</Label><Text style={styles.body}>{tr ? 'Kötü giderse hesabım ne kadar etkilenir?' : 'How much could a bad outcome affect me?'}</Text></Card>
          <Card styles={styles} aria="risk-after"><Text style={styles.step}>2</Text><Label styles={styles}>{tr ? 'SONRA' : 'AFTER'}</Label><Text style={styles.body}>{tr ? 'Gerçek sonuç ortaya çıkar.' : 'The actual outcome appears.'}</Text></Card>
        </View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles}>{tr ? 'Bugün kayıp yok diye risk sıfır değildir.' : 'No loss today does not mean zero risk.'}</Heading>
        <View style={styles.riskCompare}>
          <View style={styles.riskMain} accessibilityLabel="risk-zero-loss"><Label styles={styles}>{tr ? 'GERÇEKLEŞMİŞ KAYIP' : 'REALIZED LOSS'}</Label><Text style={styles.zero}>0</Text></View>
          <Text style={styles.riskNotEqual}>≠</Text>
          <View style={[styles.riskFuture, styles.accentCard]} accessibilityLabel="risk-future-uncertainty"><Label styles={styles}>{tr ? 'OLASI SONUÇ' : 'POSSIBLE OUTCOME'}</Label><Text style={styles.question}>?</Text></View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles}>{tr ? 'Risk önce gelir; kayıp sonra oluşabilir.' : 'Risk comes first; loss may happen later.'}</Heading>
      <View style={styles.flow}><View style={styles.flowChip}><Label styles={styles}>{tr ? 'KARAR' : 'DECISION'}</Label></View><Text style={styles.arrow}>→</Text><View style={[styles.flowChip, styles.accentCard]}><Label styles={styles}>{tr ? 'RİSK' : 'RISK'}</Label></View><Text style={styles.arrow}>→</Text><View style={styles.flowChip}><Label styles={styles}>{tr ? 'SONUÇ' : 'OUTCOME'}</Label></View></View>
    </View>
  );
}

function VolatilityStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Aynı para, farklı hareket genişliği.' : 'Same money, different movement range.'}</Heading><View style={styles.pair}><Card styles={styles} aria="risk-vol-calm"><Label styles={styles}>{tr ? 'SAKİN' : 'CALM'}</Label><View style={styles.calmPath} /><Text style={styles.caption}>{tr ? 'Dar hareket' : 'Narrow move'}</Text></Card><Card styles={styles} aria="risk-vol-active" accent><Label styles={styles}>{tr ? 'HAREKETLİ' : 'ACTIVE'}</Label><View style={styles.activePath} /><Text style={styles.caption}>{tr ? 'Geniş hareket' : 'Wide move'}</Text></Card></View></View>;
  }
  if (role === 'concept') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Volatilite yönü değil, hareket genişliğini anlatır.' : 'Volatility describes movement width, not direction.'}</Heading><View style={styles.rangeBoard}><View style={styles.rangeItem} accessibilityLabel="risk-vol-narrow"><Label styles={styles}>{tr ? 'DAR ARALIK' : 'NARROW RANGE'}</Label><View style={styles.rangeShort} /></View><View style={styles.rangeItem} accessibilityLabel="risk-vol-wide"><Label styles={styles}>{tr ? 'GENİŞ ARALIK' : 'WIDE RANGE'}</Label><View style={styles.rangeWide} /></View></View></View>;
  }
  if (role === 'practice') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Aynı 1.000 TL, geniş harekette daha çok dalgalanabilir.' : 'The same TRY 1,000 can fluctuate more in a wider move.'}</Heading><View style={styles.pair}><Card styles={styles} aria="risk-vol-same-cash-calm"><Text style={styles.money}>1.000 TL</Text><View style={styles.swingSmall} /><Text style={styles.caption}>{tr ? 'Küçük dalgalanma' : 'Smaller fluctuation'}</Text></Card><Card styles={styles} aria="risk-vol-same-cash-wide" accent><Text style={styles.money}>1.000 TL</Text><View style={styles.swingLarge} /><Text style={styles.caption}>{tr ? 'Büyük dalgalanma' : 'Larger fluctuation'}</Text></Card></View></View>;
  }
  if (role === 'misconception') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Geniş hareket yalnız yukarı gitmez.' : 'Wide movement does not only go upward.'}</Heading><View style={styles.pair}><Card styles={styles} aria="risk-vol-up"><Text style={styles.directionUp}>↗</Text><Text style={styles.caption}>{tr ? 'Geniş hareket yukarı' : 'Wide move up'}</Text></Card><Card styles={styles} aria="risk-vol-down"><Text style={styles.directionDown}>↘</Text><Text style={styles.caption}>{tr ? 'Geniş hareket aşağı' : 'Wide move down'}</Text></Card></View></View>;
  }
  return <View style={styles.story}><Heading styles={styles}>{tr ? 'Volatilite = hareket genişliği; yön garantisi değil.' : 'Volatility = movement width, not direction.'}</Heading><View style={styles.simpleSummary}><View style={styles.rangeWide} /><Label styles={styles}>{tr ? 'GENİŞLİK' : 'WIDTH'}</Label><Text style={styles.notEqual}>≠</Text><Label styles={styles}>{tr ? 'YÖN' : 'DIRECTION'}</Label></View></View>;
}

function SizeStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Aynı yüzde düşüş, farklı TL kaybı yaratır.' : 'The same percentage drop creates different cash losses.'}</Heading><View style={styles.pair}><Card styles={styles} aria="risk-size-small"><Text style={styles.money}>1.000 TL</Text><Label styles={styles}>−5%</Label><Text style={styles.smallLoss}>−50 TL</Text></Card><Card styles={styles} aria="risk-size-large" danger><Text style={styles.money}>10.000 TL</Text><Label styles={styles}>−5%</Label><Text style={styles.bigLoss}>−500 TL</Text></Card></View></View>;
  }
  if (role === 'concept') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Miktar × fiyat hareketi = hesabındaki etki.' : 'Amount × price move = impact on your account.'}</Heading><View style={styles.equation} accessibilityLabel="risk-size-equation"><View style={styles.equationChip}><Label styles={styles}>{tr ? 'MİKTAR' : 'AMOUNT'}</Label><Text style={styles.equationValue}>×</Text></View><View style={styles.equationChip}><Label styles={styles}>{tr ? 'HAREKET' : 'MOVE'}</Label><Text style={styles.equationValue}>%</Text></View><Text style={styles.arrow}>=</Text><View style={[styles.equationChip, styles.accentCard]}><Label styles={styles}>{tr ? 'ETKİ' : 'IMPACT'}</Label><Text style={styles.equationValue}>TL</Text></View></View></View>;
  }
  if (role === 'practice') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Miktarı küçültmek hesabındaki etkiyi küçültebilir.' : 'A smaller position can reduce account impact.'}</Heading><View style={styles.exposure} accessibilityLabel="risk-size-exposure"><View style={styles.exposureSmall} /><Text style={styles.caption}>1.000 TL</Text><View style={styles.divider} /><View style={styles.exposureLarge} /><Text style={styles.caption}>10.000 TL</Text></View></View>;
  }
  if (role === 'misconception') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? '“Alabiliyorum” ile “riskime uygun” aynı şey değildir.' : '“I can afford it” is not the same as “it fits my risk.”'}</Heading><View style={styles.pair}><Card styles={styles} aria="risk-size-can-buy"><Label styles={styles}>{tr ? 'ALABİLECEĞİN' : 'CAN BUY'}</Label><View style={styles.capacityFull} /></Card><Card styles={styles} aria="risk-size-fit" accent><Label styles={styles}>{tr ? 'RİSKE UYGUN' : 'FIT FOR RISK'}</Label><View style={styles.capacitySafe} /></Card></View></View>;
  }
  return <View style={styles.story}><Heading styles={styles}>{tr ? 'Pozisyon büyüdükçe aynı hareketin etkisi büyür.' : 'As position size grows, the same move has a larger impact.'}</Heading><View style={styles.flow}><View style={styles.flowChip}><Label styles={styles}>{tr ? 'MİKTAR' : 'SIZE'}</Label></View><Text style={styles.arrow}>→</Text><View style={[styles.flowChip, styles.dangerCard]}><Label styles={styles}>{tr ? 'ETKİ' : 'IMPACT'}</Label></View></View></View>;
}

function RewardStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Büyük hedef tek başına iyi karar değildir.' : 'A large target alone is not a good decision.'}</Heading><View style={styles.rewardHook}><View style={[styles.rewardBox, styles.dangerCard]} accessibilityLabel="risk-reward-loss"><Label styles={styles}>{tr ? 'OLASI KAYIP' : 'POSSIBLE LOSS'}</Label><Text style={styles.rewardNumber}>1</Text></View><Text style={styles.ratio}>:</Text><View style={[styles.rewardBox, styles.accentCard]} accessibilityLabel="risk-reward-target"><Label styles={styles}>{tr ? 'HEDEF' : 'TARGET'}</Label><Text style={styles.rewardNumber}>5</Text></View><View style={styles.probability}><Label styles={styles}>{tr ? 'OLASILIK?' : 'LIKELIHOOD?'}</Label><Text style={styles.question}>?</Text></View></View></View>;
  }
  if (role === 'concept') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Hedef, olasılık ve maliyet birlikte düşünülür.' : 'Target, likelihood, and cost belong together.'}</Heading><View style={styles.threeRow} accessibilityLabel="risk-reward-factors">{[[tr ? 'HEDEF' : 'TARGET', '5'], [tr ? 'OLASILIK' : 'LIKELIHOOD', '?'], [tr ? 'MALİYET' : 'COST', '−']].map(([label, value], index) => <View key={label} style={[styles.factor, index === 1 && styles.accentCard]}><Text style={styles.factorValue}>{value}</Text><Label styles={styles}>{label}</Label></View>)}</View></View>;
  }
  if (role === 'practice') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Karar kalitesi birkaç parçayı birlikte tartar.' : 'Decision quality weighs several pieces together.'}</Heading><View style={styles.pieceGrid} accessibilityLabel="risk-reward-decision-pieces">{[tr ? 'KAYIP' : 'LOSS', tr ? 'HEDEF' : 'TARGET', tr ? 'OLASILIK' : 'LIKELIHOOD', tr ? 'MALİYET' : 'COST'].map((label, index) => <View key={label} style={[styles.piece, index === 2 && styles.accentCard]}><Text style={styles.step}>{index + 1}</Text><Label styles={styles}>{label}</Label></View>)}</View></View>;
  }
  if (role === 'misconception') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? '“1’e 5” yazmak, 5’in geleceğini garanti etmez.' : 'Writing “1 to 5” does not guarantee the 5.'}</Heading><View style={styles.pair}><Card styles={styles} aria="risk-reward-paper" accent><Label styles={styles}>{tr ? 'KÂĞIT ÜZERİNDE' : 'ON PAPER'}</Label><Text style={styles.plan}>1 : 5</Text></Card><Card styles={styles} aria="risk-reward-reality"><Label styles={styles}>{tr ? 'GERÇEK SONUÇ' : 'REAL RESULT'}</Label><Text style={styles.question}>?</Text></Card></View></View>;
  }
  return <View style={styles.story}><Heading styles={styles}>{tr ? 'Büyük hedef tek başına yetmez.' : 'A large target is not enough by itself.'}</Heading><View style={styles.flow}><View style={styles.flowChip}><Label styles={styles}>{tr ? 'HEDEF' : 'TARGET'}</Label></View><Text style={styles.plus}>+</Text><View style={styles.flowChip}><Label styles={styles}>{tr ? 'OLASILIK' : 'LIKELIHOOD'}</Label></View><Text style={styles.plus}>+</Text><View style={styles.flowChip}><Label styles={styles}>{tr ? 'MALİYET' : 'COST'}</Label></View></View></View>;
}

function StopStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Planlanan çıkış ile gerçek çıkış farklı olabilir.' : 'Planned exit and actual exit can differ.'}</Heading><View style={styles.pair}><Card styles={styles} aria="risk-stop-plan" accent><Label styles={styles}>{tr ? 'PLAN' : 'PLAN'}</Label><Text style={styles.stopValue}>95</Text></Card><Card styles={styles} aria="risk-stop-actual" danger><Label styles={styles}>{tr ? 'GERÇEKLEŞEN' : 'EXECUTED'}</Label><Text style={styles.stopValue}>93</Text></Card></View></View>;
  }
  if (role === 'concept') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Stop seviyesi fiyatı durdurmaz; çıkış emrini tetikler.' : 'A stop level does not stop price; it triggers an exit order.'}</Heading><View style={styles.stopFlow} accessibilityLabel="risk-stop-flow"><View style={styles.stopChip}><Label styles={styles}>{tr ? 'FİYAT' : 'PRICE'}</Label><Text style={styles.stopMini}>100</Text></View><Text style={styles.arrow}>→</Text><View style={[styles.stopChip, styles.accentCard]}><Label styles={styles}>STOP</Label><Text style={styles.stopMini}>95</Text></View><Text style={styles.arrow}>→</Text><View style={styles.stopChip}><Label styles={styles}>{tr ? 'EMİR' : 'ORDER'}</Label></View></View></View>;
  }
  if (role === 'practice') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Fiyat arayı atladığında 95’te işlem olmayabilir.' : 'If price jumps over the level, there may be no trade at 95.'}</Heading><View style={styles.gapBoard} accessibilityLabel="risk-stop-gap"><View style={styles.priceBox}><Text style={styles.stopMini}>100</Text></View><Text style={styles.down}>↓</Text><View style={styles.missed}><Text style={styles.caption}>95 · {tr ? 'tetik' : 'trigger'}</Text></View><Text style={styles.down}>↓</Text><View style={[styles.priceBox, styles.dangerCard]}><Text style={styles.stopMini}>93</Text></View></View></View>;
  }
  if (role === 'misconception') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Stop seviyesi fiyatı tutan bir duvar değildir.' : 'A stop level is not a wall that holds price.'}</Heading><View style={styles.wall} accessibilityLabel="risk-stop-not-wall"><Text style={styles.down}>↓</Text><View style={styles.stopLine}><Text style={styles.caption}>95 · STOP</Text><View style={styles.breakMark} /></View><Text style={styles.down}>↓</Text></View></View>;
  }
  return <View style={styles.story}><Heading styles={styles}>{tr ? 'Stop plan sağlar; gerçekleşme fiyatını garanti etmez.' : 'A stop provides a plan; it does not guarantee execution price.'}</Heading><View style={styles.flow}><View style={styles.flowChip}><Label styles={styles}>{tr ? 'PLAN' : 'PLAN'}</Label><Text style={styles.plan}>95</Text></View><Text style={styles.notEqual}>≠</Text><View style={styles.flowChip}><Label styles={styles}>{tr ? 'GARANTİ' : 'GUARANTEE'}</Label><Text style={styles.question}>?</Text></View></View></View>;
}

function DiversificationStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Çok isim, tek risk kaynağına bağlı olabilir.' : 'Many names can still depend on one risk source.'}</Heading><View style={styles.sourceBoard} accessibilityLabel="risk-div-one-source"><View style={[styles.node, styles.dangerCard]}><Label styles={styles}>{tr ? 'TEK RİSK' : 'ONE RISK'}</Label></View><View style={styles.sourceLine} /><View style={styles.assetRow}>{Array.from({ length: 6 }).map((_, i) => <View key={i} style={styles.assetBox} />)}</View></View></View>;
  }
  if (role === 'concept') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Çeşitlendirme, farklı risk kaynaklarına yayılmaktır.' : 'Diversification spreads across different risk sources.'}</Heading><View style={styles.sourceGrid} accessibilityLabel="risk-div-sources">{[tr ? 'ŞİRKET' : 'COMPANY', tr ? 'FAİZ' : 'RATES', tr ? 'EMTİA' : 'COMMODITY', tr ? 'DÖVİZ' : 'FX'].map((label, i) => <View key={label} style={[styles.sourceCard, i === 2 && styles.accentCard]}><Text style={styles.step}>{i + 1}</Text><Label styles={styles}>{label}</Label></View>)}</View></View>;
  }
  if (role === 'practice') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Aynı olay benzer varlıkları birlikte etkileyebilir.' : 'One event can affect similar assets together.'}</Heading><View style={styles.eventBoard} accessibilityLabel="risk-div-same-event"><View style={[styles.node, styles.dangerCard]}><Label styles={styles}>{tr ? 'AYNI OLAY' : 'SAME EVENT'}</Label></View><View style={styles.sourceLine} /><View style={styles.assetRow}>{Array.from({ length: 4 }).map((_, i) => <View key={i} style={[styles.hitAsset, styles.dangerCard]}><Text style={styles.loss}>−</Text></View>)}</View></View></View>;
  }
  if (role === 'misconception') {
    return <View style={styles.story}><Heading styles={styles}>{tr ? 'Çok kutu görmek, çok farklı risk demek değildir.' : 'Many boxes do not automatically mean many different risks.'}</Heading><View style={styles.pair}><View style={styles.namesGrid} accessibilityLabel="risk-div-many-names">{Array.from({ length: 9 }).map((_, i) => <View key={i} style={styles.nameBox} />)}</View><Card styles={styles} aria="risk-div-different-risk" danger><Label styles={styles}>{tr ? 'FARKLI RİSK?' : 'DIFFERENT RISK?'}</Label><Text style={styles.question}>?</Text></Card></View></View>;
  }
  return <View style={styles.story}><Heading styles={styles}>{tr ? 'Amaç isim sayısını değil, tek riske bağımlılığı azaltmaktır.' : 'The goal is to reduce dependence on one risk, not count names.'}</Heading><View style={styles.threeRow}>{['A', 'B', 'C'].map((x) => <View key={x} style={[styles.roundSource, styles.accentCard]}><Label styles={styles}>{`${tr ? 'RİSK' : 'RISK'} ${x}`}</Label></View>)}</View></View>;
}

const createStyles = (theme: LearningTheme, wide: boolean, phone: boolean, practice: boolean) => StyleSheet.create({
  shell: {
    width: '100%',
    maxWidth: wide ? 680 : undefined,
    alignSelf: 'center',
    minHeight: wide ? 300 : practice ? (phone ? 300 : 330) : phone ? 250 : 270,
    justifyContent: 'center',
    padding: wide ? 20 : phone ? 9 : 14,
    borderRadius: wide ? 18 : 16,
    borderWidth: 1,
    borderColor: '#27465C',
    backgroundColor: '#081726',
    overflow: 'hidden',
  },
  story: { width: '100%', gap: wide ? 17 : phone ? 10 : 13, justifyContent: 'center' },
  heading: { color: theme.colors.text, fontSize: wide ? 20 : phone ? 15 : 17, lineHeight: wide ? 28 : phone ? 21 : 24, fontWeight: '900' },
  label: { color: '#A4B5C0', fontSize: wide ? 9 : phone ? 7 : 8, lineHeight: wide ? 13 : phone ? 10 : 11, fontWeight: '900', letterSpacing: 0.35, textAlign: 'center' },
  caption: { color: '#91A5B2', fontSize: wide ? 10 : phone ? 8 : 9, lineHeight: wide ? 15 : phone ? 11 : 13, textAlign: 'center' },
  body: { color: '#A2B4BF', fontSize: wide ? 11 : phone ? 9 : 10, lineHeight: wide ? 16 : phone ? 13 : 15, textAlign: 'center' },
  accentCard: { backgroundColor: '#0D2D32', borderColor: '#2D766F' },
  dangerCard: { backgroundColor: '#281E25', borderColor: '#704E59' },
  pair: { width: '100%', flexDirection: 'row', gap: phone ? 6 : 9, alignItems: 'stretch' },
  threeRow: { width: '100%', flexDirection: 'row', gap: phone ? 5 : 8, alignItems: 'stretch' },
  card: { flex: 1, minWidth: 0, minHeight: wide ? 155 : phone ? 120 : 136, padding: phone ? 8 : 11, alignItems: 'center', justifyContent: 'center', gap: phone ? 6 : 8, borderRadius: 13, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  question: { color: '#63D8CA', fontSize: wide ? 42 : phone ? 30 : 35, fontWeight: '900' },
  loss: { color: '#D69B93', fontSize: wide ? 27 : phone ? 20 : 23, fontWeight: '900' },
  step: { color: '#5DE0CF', fontSize: wide ? 25 : phone ? 19 : 22, fontWeight: '900' },
  zero: { color: '#E7EEF2', fontSize: wide ? 38 : phone ? 30 : 34, fontWeight: '900' },
  arrow: { color: '#57D6C6', fontSize: wide ? 23 : phone ? 16 : 19, fontWeight: '900' },
  notEqual: { color: '#BBC9D1', fontSize: wide ? 26 : phone ? 19 : 22, fontWeight: '900' },
  plus: { color: '#57D6C6', fontSize: wide ? 20 : phone ? 14 : 17, fontWeight: '900' },

  branchBoard: { width: '100%', minHeight: wide ? 190 : phone ? 145 : 165, alignItems: 'center', justifyContent: 'center' },
  node: { width: wide ? 130 : phone ? 82 : 96, minHeight: wide ? 62 : phone ? 48 : 54, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  branchLine: { width: '70%', height: phone ? 25 : 32, borderBottomWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: '#3A5668' },
  miniOutcome: { flex: 1, minWidth: 0, minHeight: wide ? 70 : phone ? 52 : 60, borderRadius: 12, borderWidth: 1, borderColor: '#3A4F5F', backgroundColor: '#102432', alignItems: 'center', justifyContent: 'center' },
  riskCompare: { width: '100%', minHeight: wide ? 150 : phone ? 118 : 132, flexDirection: 'row', alignItems: 'center', gap: phone ? 5 : 8, position: 'relative' },
  riskMain: { flex: 1, minWidth: wide ? 310 : phone ? 156 : 0, minHeight: wide ? 145 : phone ? 112 : 128, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 13, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  riskFuture: { width: wide ? 160 : phone ? 80 : 108, minHeight: wide ? 145 : phone ? 112 : 128, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 13, borderWidth: 1 },
  riskNotEqual: { position: 'absolute', right: wide ? 164 : phone ? 80 : 109, zIndex: 2, width: wide ? 26 : 20, textAlign: 'center', color: '#BBC9D1', fontSize: wide ? 24 : phone ? 17 : 20, fontWeight: '900', transform: [{ translateX: wide ? 13 : 10 }] },
  flow: { width: '100%', minHeight: wide ? 130 : phone ? 102 : 116, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 4 : 7 },
  flowChip: { width: wide ? 118 : phone ? 72 : 84, minHeight: wide ? 78 : phone ? 58 : 68, borderRadius: 14, borderWidth: 1, borderColor: '#354F61', backgroundColor: '#102432', alignItems: 'center', justifyContent: 'center', gap: 4 },

  calmPath: { width: '55%', height: 7, borderRadius: 4, backgroundColor: '#748997' },
  activePath: { width: '88%', height: 7, borderRadius: 4, backgroundColor: '#48CDBE' },
  rangeBoard: { width: '100%', minHeight: wide ? 165 : phone ? 128 : 145, padding: phone ? 9 : 12, borderRadius: 13, borderWidth: 1, borderColor: '#354B5D', backgroundColor: '#101F2D', justifyContent: 'center', gap: phone ? 15 : 19 },
  rangeItem: { width: '100%', gap: 6 },
  rangeShort: { width: '38%', height: phone ? 10 : 12, borderRadius: 6, alignSelf: 'center', backgroundColor: '#607788' },
  rangeWide: { width: '88%', height: phone ? 10 : 12, borderRadius: 6, alignSelf: 'center', backgroundColor: '#43CBBB' },
  money: { color: '#EEF4F6', fontSize: wide ? 20 : phone ? 15 : 17, fontWeight: '900' },
  swingSmall: { width: '34%', height: 6, borderRadius: 3, backgroundColor: '#758B9A' },
  swingLarge: { width: '78%', height: 6, borderRadius: 3, backgroundColor: '#49D1C1' },
  directionUp: { color: '#4BD2C1', fontSize: wide ? 48 : phone ? 35 : 42, fontWeight: '900' },
  directionDown: { color: '#C4877C', fontSize: wide ? 48 : phone ? 35 : 42, fontWeight: '900' },
  simpleSummary: { width: '100%', minHeight: wide ? 125 : phone ? 100 : 112, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 8 : 11 },

  smallLoss: { color: '#A6B8C3', fontSize: wide ? 17 : phone ? 12 : 14, fontWeight: '900' },
  bigLoss: { color: '#D79A92', fontSize: wide ? 22 : phone ? 16 : 18, fontWeight: '900' },
  equation: { width: '100%', minHeight: wide ? 160 : phone ? 124 : 142, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 4 : 6 },
  equationChip: { width: wide ? 128 : phone ? 64 : 77, minHeight: wide ? 100 : phone ? 76 : 88, borderRadius: 13, borderWidth: 1, borderColor: '#354F61', backgroundColor: '#102432', alignItems: 'center', justifyContent: 'center', gap: 5 },
  equationValue: { color: '#E8EFF3', fontSize: wide ? 24 : phone ? 17 : 20, fontWeight: '900' },
  exposure: { width: '100%', minHeight: wide ? 185 : phone ? 144 : 165, padding: phone ? 9 : 12, borderRadius: 13, borderWidth: 1, borderColor: '#354F61', backgroundColor: '#102432', justifyContent: 'center', gap: phone ? 7 : 9 },
  exposureSmall: { width: '24%', height: phone ? 22 : 28, borderRadius: 7, backgroundColor: '#5E788A' },
  exposureLarge: { width: '85%', height: phone ? 22 : 28, borderRadius: 7, backgroundColor: '#3FCABB' },
  divider: { width: '100%', height: 1, backgroundColor: '#294456', marginVertical: phone ? 3 : 5 },
  capacityFull: { width: '82%', height: phone ? 32 : 42, borderRadius: 9, backgroundColor: '#B17C74' },
  capacitySafe: { width: '35%', height: phone ? 32 : 42, borderRadius: 9, backgroundColor: '#46CDBD' },

  rewardHook: { width: '100%', minHeight: wide ? 175 : phone ? 134 : 152, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 4 : 7 },
  rewardBox: { width: wide ? 130 : phone ? 72 : 82, minHeight: wide ? 120 : phone ? 92 : 104, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: phone ? 3 : 6 },
  rewardNumber: { color: '#F0F4F6', fontSize: wide ? 34 : phone ? 25 : 29, fontWeight: '900' },
  ratio: { color: '#8196A5', fontSize: wide ? 22 : phone ? 16 : 18, fontWeight: '900' },
  probability: { width: wide ? 130 : phone ? 68 : 80, alignItems: 'center', justifyContent: 'center', gap: 3 },
  factor: { flex: 1, minWidth: 0, minHeight: wide ? 150 : phone ? 114 : 132, borderRadius: 13, borderWidth: 1, borderColor: '#354F61', backgroundColor: '#102432', alignItems: 'center', justifyContent: 'center', gap: 7 },
  factorValue: { color: '#55D7C7', fontSize: wide ? 31 : phone ? 22 : 27, fontWeight: '900' },
  pieceGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: phone ? 6 : 8 },
  piece: { width: phone ? '48%' : '48.5%', minHeight: wide ? 100 : phone ? 76 : 88, borderRadius: 12, borderWidth: 1, borderColor: '#354F61', backgroundColor: '#102432', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  plan: { color: '#F0F5F7', fontSize: wide ? 29 : phone ? 21 : 25, fontWeight: '900' },

  stopValue: { color: '#EFF4F6', fontSize: wide ? 34 : phone ? 25 : 29, fontWeight: '900' },
  stopFlow: { width: '100%', minHeight: wide ? 145 : phone ? 114 : 130, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 4 : 6 },
  stopChip: { width: wide ? 116 : phone ? 64 : 76, minHeight: wide ? 90 : phone ? 70 : 78, borderRadius: 15, borderWidth: 1, borderColor: '#354F61', backgroundColor: '#102432', alignItems: 'center', justifyContent: 'center', gap: 4 },
  stopMini: { color: '#ECF3F5', fontSize: wide ? 23 : phone ? 16 : 19, fontWeight: '900' },
  gapBoard: { width: '100%', minHeight: wide ? 190 : phone ? 146 : 170, alignItems: 'center', justifyContent: 'center' },
  priceBox: { width: wide ? 120 : phone ? 74 : 86, minHeight: wide ? 58 : phone ? 43 : 49, borderRadius: 11, borderWidth: 1, borderColor: '#354F61', backgroundColor: '#102432', alignItems: 'center', justifyContent: 'center' },
  down: { color: '#8AA0AC', fontSize: wide ? 26 : phone ? 20 : 23, lineHeight: wide ? 29 : phone ? 22 : 26 },
  missed: { width: wide ? 170 : phone ? 108 : 122, minHeight: phone ? 27 : 31, borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: '#C59580', alignItems: 'center', justifyContent: 'center' },
  wall: { width: '100%', minHeight: wide ? 165 : phone ? 128 : 145, alignItems: 'center', justifyContent: 'center' },
  stopLine: { width: '78%', height: phone ? 29 : 33, borderRadius: 7, borderWidth: 1, borderColor: '#7A5660', backgroundColor: '#4A3B44', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  breakMark: { position: 'absolute', width: 4, height: 45, backgroundColor: '#081726', transform: [{ rotate: '12deg' }] },

  sourceBoard: { width: '100%', minHeight: wide ? 165 : phone ? 128 : 145, alignItems: 'center', justifyContent: 'center' },
  sourceLine: { width: '80%', height: phone ? 26 : 32, borderBottomWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: '#704E59' },
  assetRow: { width: '92%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  assetBox: { width: wide ? 30 : phone ? 24 : 28, height: wide ? 30 : phone ? 24 : 28, borderRadius: 7, backgroundColor: '#596F80' },
  sourceGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: phone ? 6 : 8 },
  sourceCard: { width: phone ? '48%' : '48.5%', minHeight: wide ? 120 : phone ? 88 : 105, borderRadius: 12, borderWidth: 1, borderColor: '#354F61', backgroundColor: '#102432', alignItems: 'center', justifyContent: 'center', gap: 6 },
  eventBoard: { width: '100%', minHeight: wide ? 190 : phone ? 146 : 170, alignItems: 'center', justifyContent: 'center' },
  hitAsset: { width: wide ? 58 : phone ? 39 : 48, height: wide ? 58 : phone ? 39 : 48, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  namesGrid: { flex: 1, minWidth: 0, minHeight: wide ? 155 : phone ? 120 : 136, padding: phone ? 8 : 10, borderRadius: 13, borderWidth: 1, borderColor: '#354F61', backgroundColor: '#102432', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: phone ? 4 : 5 },
  nameBox: { width: '27%', height: phone ? 18 : 24, borderRadius: 5, backgroundColor: '#5D7282' },
  roundSource: { flex: 1, minWidth: 0, maxWidth: wide ? 130 : 90, minHeight: wide ? 105 : phone ? 70 : 80, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
