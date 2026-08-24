import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic = 'risk' | 'volatility' | 'size' | 'reward' | 'stop' | 'diversification';
type Props = { assetRef: string; alt: string; language: LearningLanguage; role: LessonSupportingVisualRole; theme?: LearningTheme };
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

export function isBeginnerRiskStoryAsset(assetRef: string): boolean { return Boolean(topicForAsset(assetRef)); }

export function BeginnerRiskStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: Props) {
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

function Heading({ styles, title, body }: { styles: Styles; title: string; body?: string }) {
  return <View style={styles.heading}><Text style={styles.headingTitle}>{title}</Text>{body ? <Text style={styles.headingBody}>{body}</Text> : null}</View>;
}

function Label({ styles, children }: { styles: Styles; children: string }) { return <Text style={styles.microLabel}>{children}</Text>; }

function Bars({ styles, values, active = false }: { styles: Styles; values: readonly number[]; active?: boolean }) {
  return <View style={styles.bars}>{values.map((height, index) => <View key={`${height}-${index}`} style={styles.barSlot}><View style={[styles.bar, { height }, active && styles.barActive]} /></View>)}</View>;
}

function RiskStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Sonuç belli değilken risk zaten vardır.' : 'Risk exists before the outcome is known.'} />
      <View style={styles.branchStage} accessibilityLabel="risk-uncertainty-branches">
        <View style={styles.decisionNode}><Label styles={styles}>{tr ? 'KARAR' : 'DECISION'}</Label></View>
        <View style={styles.branchStem} />
        <View style={styles.outcomeRow}>
          <View style={[styles.outcome, styles.goodCard]}><Label styles={styles}>{tr ? 'İYİ' : 'GOOD'}</Label></View>
          <View style={styles.outcome}><Label styles={styles}>{tr ? 'NÖTR' : 'NEUTRAL'}</Label></View>
          <View style={[styles.outcome, styles.badCard]}><Label styles={styles}>{tr ? 'KÖTÜ' : 'BAD'}</Label></View>
        </View>
      </View>
    </View>
  );
  if (role === 'concept') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Risk olasılıktır; kayıp gerçekleşmiş sonuçtur.' : 'Risk is a possibility; loss is a realized outcome.'} />
      <View style={styles.twoPanel}>
        <View style={[styles.teachingCard, styles.accentCard]} accessibilityLabel="risk-possibility"><Label styles={styles}>{tr ? 'KARAR ANINDA' : 'AT DECISION'}</Label><Text style={styles.bigQuestion}>?</Text><Text style={styles.caption}>{tr ? 'Kötü sonuç olabilir' : 'A bad result is possible'}</Text></View>
        <View style={[styles.teachingCard, styles.badCard]} accessibilityLabel="risk-realized-loss"><Label styles={styles}>{tr ? 'SONRA' : 'LATER'}</Label><Text style={styles.lossValue}>−500</Text><Text style={styles.caption}>{tr ? 'Kayıp gerçekleşti' : 'Loss happened'}</Text></View>
      </View>
    </View>
  );
  if (role === 'practice') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Riski sonuçtan önce düşün.' : 'Think about risk before the result.'} />
      <View style={styles.twoPanel}>
        <View style={[styles.stepCard, styles.accentCard]} accessibilityLabel="risk-before"><Text style={styles.stepNumber}>1</Text><Label styles={styles}>{tr ? 'ÖNCE' : 'BEFORE'}</Label><Text style={styles.stepBody}>{tr ? 'Kötü giderse ne kadar etkilenirim?' : 'How much could a bad outcome affect me?'}</Text></View>
        <View style={styles.stepCard} accessibilityLabel="risk-after"><Text style={styles.stepNumber}>2</Text><Label styles={styles}>{tr ? 'SONRA' : 'AFTER'}</Label><Text style={styles.stepBody}>{tr ? 'Gerçek sonuç ortaya çıkar.' : 'The actual outcome appears.'}</Text></View>
      </View>
    </View>
  );
  if (role === 'misconception') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Bugün kayıp yok diye risk sıfır değildir.' : 'No loss today does not mean zero risk.'} />
      <View style={styles.compareWithSymbol}>
        <View style={styles.compareMain} accessibilityLabel="risk-zero-loss"><Label styles={styles}>{tr ? 'GERÇEKLEŞMİŞ KAYIP' : 'REALIZED LOSS'}</Label><Text style={styles.zeroValue}>0</Text></View>
        <Text style={styles.compareSymbol}>≠</Text>
        <View style={[styles.compareSide, styles.accentCard]} accessibilityLabel="risk-future-uncertainty"><Label styles={styles}>{tr ? 'OLASI SONUÇ' : 'POSSIBLE OUTCOME'}</Label><Text style={styles.bigQuestion}>?</Text></View>
      </View>
    </View>
  );
  return <View style={styles.story}><Heading styles={styles} title={tr ? 'Risk önce gelir; kayıp sonra oluşabilir.' : 'Risk comes first; loss may happen later.'} /><View style={styles.flowSummary}><View style={styles.flowChip}><Label styles={styles}>{tr ? 'KARAR' : 'DECISION'}</Label></View><Text style={styles.flowArrow}>→</Text><View style={[styles.flowChip, styles.accentCard]}><Label styles={styles}>{tr ? 'RİSK' : 'RISK'}</Label></View><Text style={styles.flowArrow}>→</Text><View style={styles.flowChip}><Label styles={styles}>{tr ? 'SONUÇ' : 'OUTCOME'}</Label></View></View></View>;
}

function VolatilityStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Aynı para, farklı hareket genişliği.' : 'Same money, different movement range.'} />
      <View style={styles.twoPanel}>
        <View style={styles.pathCard} accessibilityLabel="risk-vol-calm"><Label styles={styles}>{tr ? 'SAKİN' : 'CALM'}</Label><Bars styles={styles} values={[35, 42, 38, 45, 41, 47]} /><Text style={styles.caption}>{tr ? 'Dar hareket' : 'Narrow move'}</Text></View>
        <View style={[styles.pathCard, styles.accentCard]} accessibilityLabel="risk-vol-active"><Label styles={styles}>{tr ? 'ÇOK HAREKETLİ' : 'VERY ACTIVE'}</Label><Bars styles={styles} values={[22, 67, 30, 78, 34, 70]} active /><Text style={styles.caption}>{tr ? 'Geniş hareket' : 'Wide move'}</Text></View>
      </View>
    </View>
  );
  if (role === 'concept') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Volatilite yönü değil, hareketin genişliğini anlatır.' : 'Volatility describes movement width, not direction.'} />
      <View style={styles.rangeBoard}>
        <View accessibilityLabel="risk-vol-narrow"><Label styles={styles}>{tr ? 'DAR ARALIK' : 'NARROW RANGE'}</Label><View style={styles.rangeShort} /></View>
        <View accessibilityLabel="risk-vol-wide"><Label styles={styles}>{tr ? 'GENİŞ ARALIK' : 'WIDE RANGE'}</Label><View style={styles.rangeWide} /></View>
      </View>
    </View>
  );
  if (role === 'practice') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Aynı 1.000 TL, geniş harekette daha çok dalgalanabilir.' : 'The same TRY 1,000 can fluctuate more in a wider move.'} />
      <View style={styles.twoPanel}>
        <View style={styles.moneyCard} accessibilityLabel="risk-vol-same-cash-calm"><Text style={styles.money}>1.000 TL</Text><View style={styles.swingSmall} /><Text style={styles.caption}>{tr ? 'Küçük dalgalanma' : 'Smaller fluctuation'}</Text></View>
        <View style={[styles.moneyCard, styles.accentCard]} accessibilityLabel="risk-vol-same-cash-wide"><Text style={styles.money}>1.000 TL</Text><View style={styles.swingLarge} /><Text style={styles.caption}>{tr ? 'Büyük dalgalanma' : 'Larger fluctuation'}</Text></View>
      </View>
    </View>
  );
  if (role === 'misconception') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Geniş hareket yalnız yukarı gitmez.' : 'Wide movement does not only go upward.'} />
      <View style={styles.twoPanel}>
        <View style={styles.directionCard} accessibilityLabel="risk-vol-up"><Text style={styles.arrowUp}>↗</Text><Text style={styles.caption}>{tr ? 'Geniş hareket yukarı' : 'Wide move up'}</Text></View>
        <View style={styles.directionCard} accessibilityLabel="risk-vol-down"><Text style={styles.arrowDown}>↘</Text><Text style={styles.caption}>{tr ? 'Geniş hareket aşağı' : 'Wide move down'}</Text></View>
      </View>
    </View>
  );
  return <View style={styles.story}><Heading styles={styles} title={tr ? 'Volatilite = hareket genişliği; yön garantisi değil.' : 'Volatility = movement width, not direction.'} /><View style={styles.volSummary}><View style={styles.rangeWide} /><Label styles={styles}>{tr ? 'GENİŞLİK' : 'WIDTH'}</Label><Text style={styles.compareSymbol}>≠</Text><Label styles={styles}>{tr ? 'YÖN' : 'DIRECTION'}</Label></View></View>;
}

function SizeStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Aynı yüzde düşüş, farklı TL kaybı yaratır.' : 'The same percentage drop creates different cash losses.'} />
      <View style={styles.twoPanel}>
        <View style={styles.sizeCard} accessibilityLabel="risk-size-small"><Text style={styles.money}>1.000 TL</Text><Label styles={styles}>−5%</Label><Text style={styles.smallLoss}>−50 TL</Text></View>
        <View style={[styles.sizeCard, styles.badCard]} accessibilityLabel="risk-size-large"><Text style={styles.money}>10.000 TL</Text><Label styles={styles}>−5%</Label><Text style={styles.largeLoss}>−500 TL</Text></View>
      </View>
    </View>
  );
  if (role === 'concept') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Miktar × fiyat hareketi = hesabındaki etki.' : 'Amount × price move = impact on your account.'} />
      <View style={styles.equationRow} accessibilityLabel="risk-size-equation"><View style={styles.equationChip}><Label styles={styles}>{tr ? 'MİKTAR' : 'AMOUNT'}</Label><Text style={styles.equationBig}>×</Text></View><View style={styles.equationChip}><Label styles={styles}>{tr ? 'HAREKET' : 'MOVE'}</Label><Text style={styles.equationBig}>%</Text></View><Text style={styles.equationEquals}>=</Text><View style={[styles.equationChip, styles.accentCard]}><Label styles={styles}>{tr ? 'ETKİ' : 'IMPACT'}</Label><Text style={styles.equationBig}>TL</Text></View></View>
    </View>
  );
  if (role === 'practice') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Miktarı küçültmek aynı hareketin hesabındaki etkisini küçültebilir.' : 'A smaller position can reduce the account impact of the same move.'} />
      <View style={styles.exposureBoard} accessibilityLabel="risk-size-exposure"><View style={styles.exposureSmall} /><Text style={styles.exposureLabel}>1.000 TL</Text><View style={styles.divider} /><View style={styles.exposureLarge} /><Text style={styles.exposureLabel}>10.000 TL</Text></View>
    </View>
  );
  if (role === 'misconception') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? '“Alabiliyorum” ile “riskime uygun” aynı şey değildir.' : '“I can afford it” is not the same as “it fits my risk.”'} />
      <View style={styles.twoPanel}>
        <View style={styles.capacityCard} accessibilityLabel="risk-size-can-buy"><Label styles={styles}>{tr ? 'ALABİLECEĞİN' : 'CAN BUY'}</Label><View style={styles.capacityFull} /></View>
        <View style={[styles.capacityCard, styles.accentCard]} accessibilityLabel="risk-size-fit"><Label styles={styles}>{tr ? 'RİSKE UYGUN' : 'FIT FOR RISK'}</Label><View style={styles.capacitySafe} /></View>
      </View>
    </View>
  );
  return <View style={styles.story}><Heading styles={styles} title={tr ? 'Pozisyon büyüdükçe aynı hareketin etkisi büyür.' : 'As position size grows, the same move has a larger impact.'} /><View style={styles.impactSummary}><View style={styles.smallImpact}><Label styles={styles}>{tr ? 'KÜÇÜK MİKTAR' : 'SMALL SIZE'}</Label></View><Text style={styles.flowArrow}>→</Text><View style={styles.smallImpact}><Label styles={styles}>{tr ? 'KÜÇÜK ETKİ' : 'SMALL IMPACT'}</Label></View><View style={styles.summaryBreak} /><View style={styles.largeImpact}><Label styles={styles}>{tr ? 'BÜYÜK MİKTAR' : 'LARGE SIZE'}</Label></View><Text style={styles.flowArrow}>→</Text><View style={styles.largeImpact}><Label styles={styles}>{tr ? 'BÜYÜK ETKİ' : 'LARGE IMPACT'}</Label></View></View></View>;
}

function RewardStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Büyük hedef tek başına iyi karar değildir.' : 'A large target alone is not a good decision.'} />
      <View style={styles.rewardHook}>
        <View style={[styles.rewardBox, styles.badCard]} accessibilityLabel="risk-reward-loss"><Label styles={styles}>{tr ? 'OLASI KAYIP' : 'POSSIBLE LOSS'}</Label><Text style={styles.rewardNumber}>1</Text></View><Text style={styles.ratio}>:</Text><View style={[styles.rewardBox, styles.accentCard]} accessibilityLabel="risk-reward-target"><Label styles={styles}>{tr ? 'HEDEF' : 'TARGET'}</Label><Text style={styles.rewardNumber}>5</Text></View><View style={styles.probabilityBox}><Label styles={styles}>{tr ? 'OLASILIK?' : 'LIKELIHOOD?'}</Label><Text style={styles.bigQuestion}>?</Text></View>
      </View>
    </View>
  );
  if (role === 'concept') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Hedef, olasılık ve maliyet birlikte düşünülür.' : 'Target, likelihood, and cost belong together.'} />
      <View style={styles.threePanel} accessibilityLabel="risk-reward-factors">{[[tr ? 'HEDEF' : 'TARGET', '5'], [tr ? 'OLASILIK' : 'LIKELIHOOD', '?'], [tr ? 'MALİYET' : 'COST', '−']].map(([label, value], index) => <View key={label} style={[styles.factorCard, index === 1 && styles.accentCard]}><Text style={styles.factorBig}>{value}</Text><Label styles={styles}>{label}</Label></View>)}</View>
    </View>
  );
  if (role === 'practice') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Karar kalitesi birkaç parçayı birlikte tartar.' : 'Decision quality weighs several pieces together.'} />
      <View style={styles.pieceGrid} accessibilityLabel="risk-reward-decision-pieces">{[tr ? 'KAYIP' : 'LOSS', tr ? 'HEDEF' : 'TARGET', tr ? 'OLASILIK' : 'LIKELIHOOD', tr ? 'MALİYET' : 'COST'].map((label, index) => <View key={label} style={[styles.piece, index === 2 && styles.accentCard]}><Text style={styles.pieceNumber}>{index + 1}</Text><Label styles={styles}>{label}</Label></View>)}</View>
    </View>
  );
  if (role === 'misconception') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? '“1’e 5” yazmak, 5’in geleceğini garanti etmez.' : 'Writing “1 to 5” does not guarantee the 5.'} />
      <View style={styles.twoPanel}>
        <View style={[styles.teachingCard, styles.accentCard]} accessibilityLabel="risk-reward-paper"><Label styles={styles}>{tr ? 'KÂĞIT ÜZERİNDE' : 'ON PAPER'}</Label><Text style={styles.planText}>1 : 5</Text></View>
        <View style={styles.teachingCard} accessibilityLabel="risk-reward-reality"><Label styles={styles}>{tr ? 'GERÇEK SONUÇ' : 'REAL RESULT'}</Label><Text style={styles.bigQuestion}>?</Text></View>
      </View>
    </View>
  );
  return <View style={styles.story}><Heading styles={styles} title={tr ? 'Büyük hedef tek başına yetmez.' : 'A large target is not enough by itself.'} /><View style={styles.rewardSummary}><View style={styles.summaryChip}><Label styles={styles}>{tr ? 'HEDEF' : 'TARGET'}</Label></View><Text style={styles.plus}>+</Text><View style={styles.summaryChip}><Label styles={styles}>{tr ? 'OLASILIK' : 'LIKELIHOOD'}</Label></View><Text style={styles.plus}>+</Text><View style={styles.summaryChip}><Label styles={styles}>{tr ? 'MALİYET' : 'COST'}</Label></View></View></View>;
}

function StopStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Planlanan çıkış ile gerçek çıkış farklı olabilir.' : 'Planned exit and actual exit can differ.'} />
      <View style={styles.twoPanel}>
        <View style={[styles.stopCard, styles.accentCard]} accessibilityLabel="risk-stop-plan"><Label styles={styles}>{tr ? 'PLAN' : 'PLAN'}</Label><Text style={styles.stopValue}>95</Text></View>
        <View style={[styles.stopCard, styles.badCard]} accessibilityLabel="risk-stop-actual"><Label styles={styles}>{tr ? 'GERÇEKLEŞEN' : 'EXECUTED'}</Label><Text style={styles.stopValue}>93</Text></View>
      </View>
    </View>
  );
  if (role === 'concept') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Stop seviyesi fiyatı durdurmaz; çıkış emrini tetikler.' : 'A stop level does not stop price; it triggers an exit order.'} />
      <View style={styles.stopFlow} accessibilityLabel="risk-stop-flow"><View style={styles.stopFlowChip}><Label styles={styles}>{tr ? 'FİYAT' : 'PRICE'}</Label><Text style={styles.stopFlowValue}>100</Text></View><Text style={styles.flowArrow}>→</Text><View style={[styles.stopFlowChip, styles.accentCard]}><Label styles={styles}>STOP</Label><Text style={styles.stopFlowValue}>95</Text></View><Text style={styles.flowArrow}>→</Text><View style={styles.stopFlowChip}><Label styles={styles}>{tr ? 'EMİR' : 'ORDER'}</Label></View></View>
    </View>
  );
  if (role === 'practice') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Fiyat arayı atladığında 95’te işlem olmayabilir.' : 'If price jumps over the level, there may be no trade at 95.'} />
      <View style={styles.gapStage} accessibilityLabel="risk-stop-gap"><View style={styles.priceStep}><Text style={styles.priceNumber}>100</Text></View><Text style={styles.downFlow}>↓</Text><View style={styles.missedLevel}><Text style={styles.missedText}>95 · {tr ? 'tetik' : 'trigger'}</Text></View><Text style={styles.downFlow}>↓</Text><View style={[styles.priceStep, styles.badCard]}><Text style={styles.priceNumber}>93</Text></View></View>
    </View>
  );
  if (role === 'misconception') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Stop seviyesi fiyatı tutan bir duvar değildir.' : 'A stop level is not a wall that holds price.'} />
      <View style={styles.wallStage} accessibilityLabel="risk-stop-not-wall"><Text style={styles.arrowDown}>↓</Text><View style={styles.stopLine}><Text style={styles.stopLineText}>95 · STOP</Text><View style={styles.breakMark} /></View><Text style={styles.arrowDown}>↓</Text></View>
    </View>
  );
  return <View style={styles.story}><Heading styles={styles} title={tr ? 'Stop plan sağlar; gerçekleşme fiyatını garanti etmez.' : 'A stop provides a plan; it does not guarantee the execution price.'} /><View style={styles.stopSummary}><View style={styles.summaryChip}><Label styles={styles}>{tr ? 'PLAN' : 'PLAN'}</Label><Text style={styles.summaryValue}>95</Text></View><Text style={styles.compareSymbol}>≠</Text><View style={styles.summaryChip}><Label styles={styles}>{tr ? 'GARANTİ' : 'GUARANTEE'}</Label><Text style={styles.bigQuestion}>?</Text></View></View></View>;
}

function DiversificationStory({ tr, role, styles }: StoryProps) {
  if (role === 'hook') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Çok isim, tek risk kaynağına bağlı olabilir.' : 'Many names can still depend on one risk source.'} />
      <View style={styles.sourceStage} accessibilityLabel="risk-div-one-source"><View style={[styles.sourceNode, styles.badCard]}><Label styles={styles}>{tr ? 'TEK RİSK' : 'ONE RISK'}</Label></View><View style={styles.sourceLine} /><View style={styles.assetRow}>{Array.from({ length: 6 }).map((_, index) => <View key={index} style={styles.assetBox} />)}</View></View>
    </View>
  );
  if (role === 'concept') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Çeşitlendirme, farklı risk kaynaklarına yayılmaktır.' : 'Diversification spreads across different risk sources.'} />
      <View style={styles.sourceGrid} accessibilityLabel="risk-div-sources">{[tr ? 'ŞİRKET' : 'COMPANY', tr ? 'FAİZ' : 'RATES', tr ? 'EMTİA' : 'COMMODITY', tr ? 'DÖVİZ' : 'FX'].map((label, index) => <View key={label} style={[styles.sourceCard, index === 2 && styles.accentCard]}><Text style={styles.sourceIndex}>{index + 1}</Text><Label styles={styles}>{label}</Label></View>)}</View>
    </View>
  );
  if (role === 'practice') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Aynı olay benzer varlıkları birlikte etkileyebilir.' : 'One event can affect similar assets together.'} />
      <View style={styles.eventStage} accessibilityLabel="risk-div-same-event"><View style={[styles.eventNode, styles.badCard]}><Label styles={styles}>{tr ? 'AYNI OLAY' : 'SAME EVENT'}</Label></View><View style={styles.eventLines} /> <View style={styles.hitRow}>{Array.from({ length: 4 }).map((_, index) => <View key={index} style={[styles.hitAsset, styles.badCard]}><Text style={styles.hitText}>−</Text></View>)}</View></View>
    </View>
  );
  if (role === 'misconception') return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Çok kutu görmek, çok farklı risk demek değildir.' : 'Many boxes do not automatically mean many different risks.'} />
      <View style={styles.twoPanel}>
        <View style={styles.namesGrid} accessibilityLabel="risk-div-many-names">{Array.from({ length: 9 }).map((_, index) => <View key={index} style={styles.nameBox} />)}</View>
        <View style={[styles.teachingCard, styles.badCard]} accessibilityLabel="risk-div-different-risk"><Label styles={styles}>{tr ? 'FARKLI RİSK?' : 'DIFFERENT RISK?'}</Label><Text style={styles.bigQuestion}>?</Text></View>
      </View>
    </View>
  );
  return <View style={styles.story}><Heading styles={styles} title={tr ? 'Amaç isim sayısını değil, tek riske bağımlılığı azaltmaktır.' : 'The goal is to reduce dependence on one risk, not count names.'} /><View style={styles.divSummary}>{['A', 'B', 'C'].map((label) => <View key={label} style={[styles.divSource, styles.accentCard]}><Label styles={styles}>{`${tr ? 'RİSK' : 'RISK'} ${label}`}</Label></View>)}</View></View>;
}

const createStyles = (theme: LearningTheme, wide: boolean, phone: boolean, practice: boolean) => StyleSheet.create({
  shell: { width: '100%', maxWidth: wide ? 680 : undefined, alignSelf: 'center', minHeight: wide ? 300 : practice ? (phone ? 300 : 330) : phone ? 238 : 260, justifyContent: 'center', padding: wide ? 20 : phone ? 10 : 14, borderRadius: wide ? 18 : 16, borderWidth: 1, borderColor: '#27465C', backgroundColor: '#081726', overflow: 'hidden' },
  story: { width: '100%', gap: wide ? 17 : phone ? 10 : 13, justifyContent: 'center' },
  heading: { gap: 4 },
  headingTitle: { color: theme.colors.text, fontSize: wide ? 20 : phone ? 15 : 17, lineHeight: wide ? 28 : phone ? 21 : 24, fontWeight: '900' },
  headingBody: { color: theme.colors.textMuted, fontSize: wide ? 12 : phone ? 9 : 10, lineHeight: wide ? 18 : phone ? 13 : 15 },
  microLabel: { color: '#9EB0BC', fontSize: wide ? 9 : phone ? 7 : 8, lineHeight: wide ? 13 : phone ? 10 : 11, fontWeight: '900', letterSpacing: 0.4, textAlign: 'center' },
  caption: { color: '#91A5B2', fontSize: wide ? 10 : phone ? 8 : 9, lineHeight: wide ? 15 : phone ? 11 : 13, textAlign: 'center' },
  twoPanel: { flexDirection: 'row', gap: phone ? 6 : 9, alignItems: 'stretch' },
  threePanel: { flexDirection: 'row', gap: phone ? 5 : 8 },
  accentCard: { backgroundColor: '#0D2D32', borderColor: '#2D766F' },
  badCard: { backgroundColor: '#281E25', borderColor: '#704E59' },

  branchStage: { minHeight: wide ? 185 : phone ? 142 : 160, alignItems: 'center', justifyContent: 'center' },
  decisionNode: { width: phone ? 72 : 84, height: phone ? 48 : 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E3035', borderWidth: 1, borderColor: '#2D776F' },
  branchStem: { width: phone ? '62%' : '70%', height: phone ? 22 : 30, borderBottomWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: '#365466' },
  outcomeRow: { width: '100%', flexDirection: 'row', gap: phone ? 5 : 7 },
  outcome: { flex: 1, minWidth: 0, minHeight: wide ? 72 : phone ? 54 : 62, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#101F2D', borderWidth: 1, borderColor: '#384A59' },
  goodCard: { backgroundColor: '#0D2D2F', borderColor: '#2D6E68' },
  teachingCard: { flex: 1, minWidth: 0, minHeight: wide ? 150 : phone ? 116 : 130, alignItems: 'center', justifyContent: 'center', gap: phone ? 5 : 7, padding: phone ? 8 : 10, borderRadius: 13, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  bigQuestion: { color: '#63D8CA', fontSize: wide ? 42 : phone ? 30 : 35, fontWeight: '900' },
  lossValue: { color: '#D69B93', fontSize: wide ? 27 : phone ? 20 : 23, fontWeight: '900' },
  stepCard: { flex: 1, minWidth: 0, minHeight: wide ? 170 : phone ? 135 : 150, padding: phone ? 9 : 12, justifyContent: 'center', gap: phone ? 6 : 8, borderRadius: 13, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  stepNumber: { color: '#5DE0CF', fontSize: wide ? 26 : phone ? 20 : 23, fontWeight: '900' },
  stepBody: { color: '#A2B4BF', fontSize: wide ? 11 : phone ? 9 : 10, lineHeight: wide ? 16 : phone ? 13 : 15 },
  compareWithSymbol: { flexDirection: 'row', alignItems: 'center', gap: phone ? 6 : 9, position: 'relative' },
  compareMain: { flex: 1, minWidth: 0, minHeight: wide ? 145 : phone ? 112 : 128, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 13, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  compareSide: { width: wide ? 180 : phone ? 86 : 112, minHeight: wide ? 145 : phone ? 112 : 128, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 13, borderWidth: 1 },
  zeroValue: { color: '#D8E2E7', fontSize: wide ? 34 : phone ? 27 : 30, fontWeight: '900' },
  compareSymbol: { color: '#BECBD4', fontSize: wide ? 26 : phone ? 19 : 22, fontWeight: '900' },
  flowSummary: { minHeight: wide ? 135 : phone ? 102 : 118, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 4 : 7 },
  flowChip: { width: wide ? 115 : phone ? 66 : 80, height: wide ? 76 : phone ? 58 : 66, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  flowArrow: { color: '#59CFC1', fontSize: wide ? 24 : phone ? 16 : 20, fontWeight: '900' },

  pathCard: { flex: 1, minWidth: 0, minHeight: wide ? 180 : phone ? 136 : 156, justifyContent: 'center', gap: phone ? 6 : 8, padding: phone ? 8 : 10, borderRadius: 13, backgroundColor: '#101F2D', borderWidth: 1, borderColor: '#354B5D' },
  bars: { flex: 1, minHeight: wide ? 105 : phone ? 78 : 90, flexDirection: 'row', alignItems: 'flex-end', gap: phone ? 3 : 5 },
  barSlot: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '70%', minWidth: 5, maxWidth: 22, borderRadius: 3, backgroundColor: '#718797' },
  barActive: { backgroundColor: '#47CCBD' },
  rangeBoard: { minHeight: wide ? 165 : phone ? 126 : 145, justifyContent: 'center', gap: phone ? 15 : 19, padding: phone ? 9 : 12, borderRadius: 13, borderWidth: 1, borderColor: '#354B5D', backgroundColor: '#101F2D' },
  rangeShort: { width: '38%', height: phone ? 10 : 12, borderRadius: 6, alignSelf: 'center', backgroundColor: '#607788' },
  rangeWide: { width: '88%', height: phone ? 10 : 12, borderRadius: 6, alignSelf: 'center', backgroundColor: '#43CBBB' },
  moneyCard: { flex: 1, minWidth: 0, minHeight: wide ? 180 : phone ? 140 : 160, alignItems: 'center', justifyContent: 'center', gap: phone ? 9 : 12, borderRadius: 13, backgroundColor: '#101F2D', borderWidth: 1, borderColor: '#354B5D' },
  money: { color: '#EEF4F6', fontSize: wide ? 20 : phone ? 15 : 17, fontWeight: '900' },
  swingSmall: { width: '34%', height: 5, borderRadius: 3, backgroundColor: '#758B9A' },
  swingLarge: { width: '78%', height: 5, borderRadius: 3, backgroundColor: '#49D1C1' },
  directionCard: { flex: 1, minWidth: 0, minHeight: wide ? 160 : phone ? 122 : 140, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 13, backgroundColor: '#101F2D', borderWidth: 1, borderColor: '#3A4D5B' },
  arrowUp: { color: '#4BD2C1', fontSize: wide ? 48 : phone ? 35 : 42, fontWeight: '900' },
  arrowDown: { color: '#C4877C', fontSize: wide ? 48 : phone ? 35 : 42, fontWeight: '900' },
  volSummary: { minHeight: wide ? 125 : phone ? 98 : 112, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 7 : 10 },

  sizeCard: { flex: 1, minWidth: 0, minHeight: wide ? 170 : phone ? 128 : 150, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 13, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  smallLoss: { color: '#A6B8C3', fontSize: wide ? 17 : phone ? 12 : 14, fontWeight: '900' },
  largeLoss: { color: '#D79A92', fontSize: wide ? 22 : phone ? 16 : 18, fontWeight: '900' },
  equationRow: { minHeight: wide ? 160 : phone ? 122 : 142, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 4 : 6 },
  equationChip: { width: wide ? 125 : phone ? 62 : 76, minHeight: wide ? 100 : phone ? 74 : 86, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 13, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  equationBig: { color: '#E8EFF3', fontSize: wide ? 24 : phone ? 17 : 20, fontWeight: '900' },
  equationEquals: { color: '#56D8C8', fontSize: wide ? 21 : phone ? 14 : 17, fontWeight: '900' },
  exposureBoard: { minHeight: wide ? 185 : phone ? 142 : 165, justifyContent: 'center', gap: phone ? 6 : 8, padding: phone ? 9 : 12, borderRadius: 13, borderWidth: 1, borderColor: '#354F61', backgroundColor: '#102432' },
  exposureSmall: { width: '24%', height: phone ? 22 : 28, borderRadius: 7, backgroundColor: '#5E788A' },
  exposureLarge: { width: '85%', height: phone ? 22 : 28, borderRadius: 7, backgroundColor: '#3FCABB' },
  exposureLabel: { color: '#9EB0BC', fontSize: phone ? 8 : 10, fontWeight: '800' },
  divider: { width: '100%', height: 1, backgroundColor: '#294456', marginVertical: phone ? 4 : 7 },
  capacityCard: { flex: 1, minWidth: 0, minHeight: wide ? 145 : phone ? 112 : 130, alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: 13, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  capacityFull: { width: '82%', height: phone ? 32 : 42, borderRadius: 9, backgroundColor: '#B17C74' },
  capacitySafe: { width: '35%', height: phone ? 32 : 42, borderRadius: 9, backgroundColor: '#46CDBD' },
  impactSummary: { minHeight: wide ? 145 : phone ? 112 : 130, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: phone ? 4 : 6 },
  smallImpact: { width: wide ? 118 : phone ? 67 : 78, height: wide ? 55 : phone ? 43 : 48, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#102432' },
  largeImpact: { width: wide ? 140 : phone ? 79 : 94, height: wide ? 62 : phone ? 47 : 54, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#281E25' },
  summaryBreak: { width: '100%', height: 2 },

  rewardHook: { minHeight: wide ? 175 : phone ? 132 : 152, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 5 : 7 },
  rewardBox: { width: wide ? 130 : phone ? 64 : 76, height: wide ? 120 : phone ? 90 : 104, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1 },
  rewardNumber: { color: '#F0F4F6', fontSize: wide ? 34 : phone ? 25 : 29, fontWeight: '900' },
  ratio: { color: '#8196A5', fontSize: wide ? 22 : phone ? 16 : 18, fontWeight: '900' },
  probabilityBox: { width: wide ? 130 : phone ? 66 : 78, alignItems: 'center', gap: 3 },
  factorCard: { flex: 1, minWidth: 0, minHeight: wide ? 150 : phone ? 112 : 132, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 13, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  factorBig: { color: '#55D7C7', fontSize: wide ? 31 : phone ? 22 : 27, fontWeight: '900' },
  pieceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: phone ? 6 : 8 },
  piece: { width: phone ? '48%' : '48.5%', minHeight: wide ? 100 : phone ? 75 : 88, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, padding: phone ? 8 : 10, borderRadius: 12, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  pieceNumber: { color: '#5EDECE', fontSize: wide ? 20 : phone ? 15 : 17, fontWeight: '900' },
  planText: { color: '#F0F5F7', fontSize: wide ? 29 : phone ? 21 : 25, fontWeight: '900' },
  rewardSummary: { minHeight: wide ? 125 : phone ? 98 : 112, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 4 : 6 },
  summaryChip: { width: wide ? 120 : phone ? 65 : 77, height: wide ? 78 : phone ? 58 : 68, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  plus: { color: '#50D3C4', fontSize: wide ? 21 : phone ? 14 : 18, fontWeight: '900' },

  stopCard: { flex: 1, minWidth: 0, minHeight: wide ? 150 : phone ? 116 : 130, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 13, borderWidth: 1 },
  stopValue: { color: '#EFF4F6', fontSize: wide ? 34 : phone ? 25 : 29, fontWeight: '900' },
  stopFlow: { minHeight: wide ? 145 : phone ? 112 : 130, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 4 : 6 },
  stopFlowChip: { width: wide ? 115 : phone ? 63 : 75, height: wide ? 90 : phone ? 68 : 78, borderRadius: 15, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  stopFlowValue: { color: '#ECF3F5', fontSize: wide ? 23 : phone ? 16 : 19, fontWeight: '900' },
  gapStage: { minHeight: wide ? 190 : phone ? 145 : 170, alignItems: 'center', justifyContent: 'center' },
  priceStep: { width: wide ? 120 : phone ? 72 : 85, height: wide ? 58 : phone ? 42 : 48, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  priceNumber: { color: '#EDF3F6', fontSize: wide ? 22 : phone ? 16 : 19, fontWeight: '900' },
  downFlow: { color: '#8AA0AC', fontSize: phone ? 19 : 24, lineHeight: phone ? 22 : 28 },
  missedLevel: { width: wide ? 170 : phone ? 105 : 120, height: phone ? 26 : 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: '#C59580' },
  missedText: { color: '#D8B4A4', fontSize: phone ? 9 : 11, fontWeight: '900' },
  wallStage: { minHeight: wide ? 165 : phone ? 125 : 145, alignItems: 'center', justifyContent: 'center' },
  stopLine: { width: '78%', height: phone ? 28 : 32, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#4A3B44', borderWidth: 1, borderColor: '#7A5660', overflow: 'hidden' },
  stopLineText: { color: '#E2C9C6', fontSize: phone ? 10 : 13, fontWeight: '900' },
  breakMark: { position: 'absolute', width: 4, height: 45, backgroundColor: '#081726', transform: [{ rotate: '12deg' }] },
  stopSummary: { minHeight: wide ? 130 : phone ? 100 : 118, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: phone ? 8 : 12 },
  summaryValue: { color: '#EEF4F6', fontSize: wide ? 24 : phone ? 18 : 21, fontWeight: '900' },

  sourceStage: { minHeight: wide ? 165 : phone ? 126 : 145, alignItems: 'center', justifyContent: 'center' },
  sourceNode: { width: wide ? 130 : phone ? 78 : 92, height: wide ? 64 : phone ? 48 : 55, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  sourceLine: { width: '80%', height: phone ? 25 : 32, borderBottomWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: '#704E59' },
  assetRow: { width: '92%', flexDirection: 'row', justifyContent: 'space-between' },
  assetBox: { width: phone ? 24 : 30, height: phone ? 24 : 30, borderRadius: 7, backgroundColor: '#596F80' },
  sourceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: phone ? 6 : 8 },
  sourceCard: { width: phone ? '48%' : '48.5%', minHeight: wide ? 120 : phone ? 86 : 105, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  sourceIndex: { color: '#62DFD0', fontSize: wide ? 18 : phone ? 13 : 15, fontWeight: '900' },
  eventStage: { minHeight: wide ? 190 : phone ? 145 : 170, alignItems: 'center', justifyContent: 'center' },
  eventNode: { width: wide ? 145 : phone ? 88 : 110, height: wide ? 64 : phone ? 48 : 55, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  eventLines: { width: '76%', height: phone ? 30 : 38, borderBottomWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: '#7B555F' },
  hitRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-around' },
  hitAsset: { width: wide ? 58 : phone ? 38 : 48, height: wide ? 58 : phone ? 38 : 48, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  hitText: { color: '#D18F87', fontSize: wide ? 25 : phone ? 17 : 21, fontWeight: '900' },
  namesGrid: { flex: 1, minWidth: 0, minHeight: wide ? 145 : phone ? 112 : 130, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: phone ? 4 : 5, padding: phone ? 8 : 10, borderRadius: 13, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' },
  nameBox: { width: '27%', height: phone ? 18 : 24, borderRadius: 5, backgroundColor: '#5D7282' },
  divSummary: { minHeight: wide ? 130 : phone ? 100 : 118, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  divSource: { width: wide ? 105 : phone ? 65 : 76, height: wide ? 105 : phone ? 65 : 76, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});