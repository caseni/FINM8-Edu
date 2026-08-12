import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

type SceneProps = {
  tr: boolean;
  role: LessonSupportingVisualRole;
  styles: ReturnType<typeof createStyles>;
};

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

export function BeginnerRiskStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: Props) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme, role === 'practice');
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

function Heading({ styles, title, body }: { styles: ReturnType<typeof createStyles>; title: string; body?: string }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingTitle}>{title}</Text>
      {body ? <Text style={styles.headingBody}>{body}</Text> : null}
    </View>
  );
}

function Outcome({ styles, label, tone }: { styles: ReturnType<typeof createStyles>; label: string; tone: 'good' | 'neutral' | 'bad' }) {
  return (
    <View style={[styles.outcome, tone === 'good' && styles.outcomeGood, tone === 'bad' && styles.outcomeBad]}>
      <View style={[styles.outcomeDot, tone === 'good' && styles.outcomeDotGood, tone === 'bad' && styles.outcomeDotBad]} />
      <Text style={styles.outcomeText}>{label}</Text>
    </View>
  );
}

function RiskStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Sonuç belli değilken risk zaten vardır' : 'Risk exists before the outcome is known'} />
        <View style={styles.branchStage}>
          <View style={styles.decisionNode}><Text style={styles.nodeLabel}>{tr ? 'KARAR' : 'DECISION'}</Text></View>
          <View style={styles.branchLines}><View style={styles.branchLineLeft} /><View style={styles.branchLineMid} /><View style={styles.branchLineRight} /></View>
          <View style={styles.outcomeRow}><Outcome styles={styles} label={tr ? 'İYİ' : 'GOOD'} tone="good" /><Outcome styles={styles} label={tr ? 'NÖTR' : 'NEUTRAL'} tone="neutral" /><Outcome styles={styles} label={tr ? 'KÖTÜ' : 'BAD'} tone="bad" /></View>
        </View>
      </View>
    );
  }

  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Risk olasılıktır; kayıp gerçekleşmiş sonuçtur' : 'Risk is a possibility; loss is a realized outcome'} />
        <View style={styles.riskVsLoss}>
          <View style={styles.possibilityCard}><Text style={styles.microLabel}>{tr ? 'KARAR ANINDA' : 'AT DECISION'}</Text><Text style={styles.possibilityMark}>?</Text><Text style={styles.cardCaption}>{tr ? 'Kötü sonuç olabilir' : 'A bad result is possible'}</Text></View>
          <Text style={styles.flowArrow}>›</Text>
          <View style={styles.lossCard}><Text style={styles.microLabel}>{tr ? 'SONRA' : 'LATER'}</Text><Text style={styles.lossValue}>−500</Text><Text style={styles.cardCaption}>{tr ? 'Kayıp gerçekleşti' : 'Loss happened'}</Text></View>
        </View>
      </View>
    );
  }

  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Risk, sonucu beklemeden önce düşünülür' : 'Risk is considered before waiting for the outcome'} />
        <View style={styles.beforeAfterStage}>
          <View style={styles.beforeCard}><Text style={styles.stepNumber}>1</Text><Text style={styles.stepTitle}>{tr ? 'ÖNCE' : 'BEFORE'}</Text><Text style={styles.stepBody}>{tr ? '“Kötü giderse ne kadar etkilenirim?”' : '“How much could a bad outcome affect me?”'}</Text></View>
          <View style={styles.beforeLink} />
          <View style={styles.afterCard}><Text style={styles.stepNumber}>2</Text><Text style={styles.stepTitle}>{tr ? 'SONRA' : 'AFTER'}</Text><Text style={styles.stepBody}>{tr ? 'Gerçek sonuç ortaya çıkar' : 'The actual outcome appears'}</Text></View>
        </View>
      </View>
    );
  }

  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Bugün kayıp yok diye risk sıfır değildir' : 'No loss today does not mean zero risk'} />
        <View style={styles.zeroRiskStage}><View style={styles.todayCard}><Text style={styles.microLabel}>{tr ? 'BUGÜN' : 'TODAY'}</Text><Text style={styles.zeroValue}>0</Text><Text style={styles.cardCaption}>{tr ? 'Gerçekleşmiş kayıp' : 'Realized loss'}</Text></View><Text style={styles.notEqual}>≠</Text><View style={styles.futureRiskCard}><Text style={styles.microLabel}>{tr ? 'OLASI SONUÇ' : 'POSSIBLE OUTCOME'}</Text><Text style={styles.possibilityMarkSmall}>?</Text><Text style={styles.cardCaption}>{tr ? 'Risk hâlâ var' : 'Risk still exists'}</Text></View></View>
      </View>
    );
  }

  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Risk önce gelir, kayıp sonra oluşabilir' : 'Risk comes first; loss may happen later'} />
      <View style={styles.simpleFlow}><View style={styles.flowChip}><Text style={styles.microLabel}>{tr ? 'KARAR' : 'DECISION'}</Text></View><View style={styles.flowLine} /><View style={styles.flowChipAccent}><Text style={styles.microLabel}>{tr ? 'RİSK' : 'RISK'}</Text></View><View style={styles.flowLine} /><View style={styles.flowChip}><Text style={styles.microLabel}>{tr ? 'SONUÇ' : 'OUTCOME'}</Text></View></View>
    </View>
  );
}

function PricePath({ styles, heights, accent = false }: { styles: ReturnType<typeof createStyles>; heights: readonly number[]; accent?: boolean }) {
  return <View style={styles.pricePath}>{heights.map((height, i) => <View key={i} style={[styles.pathBar, { height }, accent && styles.pathBarAccent]} />)}</View>;
}

function VolatilityStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Aynı para, farklı hareket genişliği' : 'Same money, different movement range'} />
        <View style={styles.volCompare}><View style={styles.volCard}><Text style={styles.microLabel}>{tr ? 'SAKİN' : 'CALM'}</Text><PricePath styles={styles} heights={[38, 43, 40, 46, 42, 48]} /><Text style={styles.resultMuted}>{tr ? 'Dar hareket' : 'Narrow move'}</Text></View><View style={[styles.volCard, styles.volCardActive]}><Text style={styles.microLabel}>{tr ? 'ÇOK HAREKETLİ' : 'VERY ACTIVE'}</Text><PricePath styles={styles} heights={[24, 65, 31, 76, 36, 72]} accent /><Text style={styles.resultGood}>{tr ? 'Geniş hareket' : 'Wide move'}</Text></View></View>
      </View>
    );
  }
  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Volatilite, hareketin genişliğini anlatır' : 'Volatility describes movement width'} />
        <View style={styles.rangeStage}><View style={styles.rangeLow}><Text style={styles.microLabel}>{tr ? 'DAR ARALIK' : 'NARROW RANGE'}</Text><View style={styles.rangeLineShort} /></View><View style={styles.rangeHigh}><Text style={styles.microLabel}>{tr ? 'GENİŞ ARALIK' : 'WIDE RANGE'}</Text><View style={styles.rangeLineWide} /></View></View>
      </View>
    );
  }
  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Aynı 1.000 TL, daha geniş hareketten daha çok etkilenebilir' : 'The same TRY 1,000 can be affected more by wider movement'} />
        <View style={styles.cashSwing}><View style={styles.cashCard}><Text style={styles.cashAmount}>1.000 TL</Text><View style={styles.swingSmall} /><Text style={styles.cashCaption}>{tr ? 'Küçük dalgalanma' : 'Smaller fluctuation'}</Text></View><View style={[styles.cashCard, styles.cashCardActive]}><Text style={styles.cashAmount}>1.000 TL</Text><View style={styles.swingLarge} /><Text style={styles.cashCaption}>{tr ? 'Büyük dalgalanma' : 'Larger fluctuation'}</Text></View></View>
      </View>
    );
  }
  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Geniş hareket yalnız yukarı gitmez' : 'Wide movement does not only go upward'} />
        <View style={styles.directionPair}><View style={styles.directionCard}><Text style={styles.directionArrow}>↗</Text><Text style={styles.cardCaption}>{tr ? 'Yukarı geniş hareket' : 'Wide move up'}</Text></View><View style={styles.directionCard}><Text style={[styles.directionArrow, styles.directionArrowDown]}>↘</Text><Text style={styles.cardCaption}>{tr ? 'Aşağı geniş hareket' : 'Wide move down'}</Text></View></View>
      </View>
    );
  }
  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Volatilite = hareket genişliği, yön garantisi değil' : 'Volatility = movement width, not direction'} />
      <View style={styles.volSummary}><View style={styles.volSummaryRange} /><Text style={styles.volSummaryText}>{tr ? 'GENİŞLİK' : 'WIDTH'}</Text><Text style={styles.volSummaryQuestion}>?</Text><Text style={styles.volSummaryText}>{tr ? 'YÖN' : 'DIRECTION'}</Text></View>
    </View>
  );
}

function SizeStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Aynı yüzde düşüş, farklı TL kaybı' : 'Same percentage drop, different cash loss'} />
        <View style={styles.sizeCompare}><View style={styles.sizeCard}><Text style={styles.sizeAmount}>1.000</Text><Text style={styles.microLabel}>−5%</Text><Text style={styles.lossSmall}>−50 TL</Text></View><View style={[styles.sizeCard, styles.sizeCardLarge]}><Text style={styles.sizeAmount}>10.000</Text><Text style={styles.microLabel}>−5%</Text><Text style={styles.lossLarge}>−500 TL</Text></View></View>
      </View>
    );
  }
  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Taşıdığın miktar büyüdükçe aynı hareketin etkisi büyür' : 'As position size grows, the same move has a larger impact'} />
        <View style={styles.sizeEquation}><View style={styles.equationChip}><Text style={styles.microLabel}>{tr ? 'MİKTAR' : 'AMOUNT'}</Text><Text style={styles.equationValue}>×</Text></View><View style={styles.equationChip}><Text style={styles.microLabel}>{tr ? 'FİYAT HAREKETİ' : 'PRICE MOVE'}</Text><Text style={styles.equationValue}>%</Text></View><Text style={styles.equationEquals}>=</Text><View style={[styles.equationChip, styles.equationChipAccent]}><Text style={styles.microLabel}>{tr ? 'HESAP ETKİSİ' : 'ACCOUNT IMPACT'}</Text><Text style={styles.equationValue}>TL</Text></View></View>
      </View>
    );
  }
  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Miktarı küçültmek aynı hareketin etkisini küçültebilir' : 'A smaller amount can reduce the impact of the same move'} />
        <View style={styles.exposureStage}><View style={styles.exposureBarSmall} /><Text style={styles.exposureText}>1.000 TL</Text><View style={styles.exposureDivider} /><View style={styles.exposureBarLarge} /><Text style={styles.exposureText}>10.000 TL</Text></View>
      </View>
    );
  }
  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? '“Alabiliyorum” ile “taşımalıyım” aynı şey değildir' : '“I can afford it” is not the same as “I should hold it”'} />
        <View style={styles.capacityStage}><View style={styles.capacityCard}><Text style={styles.microLabel}>{tr ? 'ALABİLECEĞİN' : 'CAN BUY'}</Text><View style={styles.capacityFull} /></View><Text style={styles.notEqual}>≠</Text><View style={styles.capacityCard}><Text style={styles.microLabel}>{tr ? 'RİSKE UYGUN' : 'FIT FOR RISK'}</Text><View style={styles.capacitySafe} /></View></View>
      </View>
    );
  }
  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Ne kadar taşıdığın, tek kararın etkisini belirler' : 'How much you hold shapes the impact of one decision'} />
      <View style={styles.sizeSummary}><View style={styles.summarySmall}><Text style={styles.microLabel}>{tr ? 'KÜÇÜK MİKTAR' : 'SMALL SIZE'}</Text></View><View style={styles.summaryArrow} /><View style={styles.summaryImpactSmall}><Text style={styles.microLabel}>{tr ? 'KÜÇÜK ETKİ' : 'SMALL IMPACT'}</Text></View><View style={styles.summarySpacer} /><View style={styles.summaryLarge}><Text style={styles.microLabel}>{tr ? 'BÜYÜK MİKTAR' : 'LARGE SIZE'}</Text></View><View style={styles.summaryArrow} /><View style={styles.summaryImpactLarge}><Text style={styles.microLabel}>{tr ? 'BÜYÜK ETKİ' : 'LARGE IMPACT'}</Text></View></View>
    </View>
  );
}

function RewardStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Büyük hedef tek başına iyi karar değildir' : 'A large target alone is not a good decision'} />
        <View style={styles.targetStage}><View style={styles.lossTarget}><Text style={styles.microLabel}>{tr ? 'OLASI KAYIP' : 'POSSIBLE LOSS'}</Text><Text style={styles.targetNumber}>1</Text></View><Text style={styles.targetVs}>:</Text><View style={styles.gainTarget}><Text style={styles.microLabel}>{tr ? 'HEDEF' : 'TARGET'}</Text><Text style={styles.targetNumber}>5</Text></View><View style={styles.targetQuestion}><Text style={styles.questionMark}>?</Text><Text style={styles.cardCaption}>{tr ? 'Olur mu?' : 'Will it happen?'}</Text></View></View>
      </View>
    );
  }
  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Hedef büyüklüğü ve gerçekleşme ihtimali farklı şeylerdir' : 'Target size and likelihood are different things'} />
        <View style={styles.rewardFactors}><View style={styles.factorCard}><Text style={styles.factorBig}>5</Text><Text style={styles.microLabel}>{tr ? 'HEDEF BÜYÜKLÜĞÜ' : 'TARGET SIZE'}</Text></View><View style={styles.factorCard}><Text style={styles.factorBig}>?</Text><Text style={styles.microLabel}>{tr ? 'OLASILIK' : 'LIKELIHOOD'}</Text></View><View style={styles.factorCard}><Text style={styles.factorBig}>−</Text><Text style={styles.microLabel}>{tr ? 'MALİYET' : 'COST'}</Text></View></View>
      </View>
    );
  }
  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Karar kalitesi birkaç parçayı birlikte düşünür' : 'Decision quality considers several pieces together'} />
        <View style={styles.decisionPieces}>{[tr ? 'KAYIP' : 'LOSS', tr ? 'HEDEF' : 'TARGET', tr ? 'OLASILIK' : 'LIKELIHOOD', tr ? 'MALİYET' : 'COST'].map((label, i) => <View key={label} style={[styles.piece, i === 2 && styles.pieceAccent]}><Text style={styles.pieceNumber}>{i + 1}</Text><Text style={styles.pieceText}>{label}</Text></View>)}</View>
      </View>
    );
  }
  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? '“1’e 5” yazmak, 5’in geleceğini garanti etmez' : 'Writing “1 to 5” does not guarantee the 5'} />
        <View style={styles.paperVsReality}><View style={styles.paperPlan}><Text style={styles.microLabel}>{tr ? 'KÂĞIT ÜZERİNDE' : 'ON PAPER'}</Text><Text style={styles.planText}>1 : 5</Text></View><Text style={styles.flowArrow}>›</Text><View style={styles.realityCard}><Text style={styles.microLabel}>{tr ? 'GERÇEK SONUÇ' : 'REAL RESULT'}</Text><Text style={styles.questionMark}>?</Text></View></View>
      </View>
    );
  }
  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Büyük hedef + olasılık + maliyet birlikte değerlendirilir' : 'Large target + likelihood + costs belong together'} />
      <View style={styles.rewardSummary}><View style={styles.rewardSummaryChip}><Text style={styles.microLabel}>{tr ? 'HEDEF' : 'TARGET'}</Text></View><Text style={styles.plus}>+</Text><View style={styles.rewardSummaryChip}><Text style={styles.microLabel}>{tr ? 'OLASILIK' : 'LIKELIHOOD'}</Text></View><Text style={styles.plus}>+</Text><View style={styles.rewardSummaryChip}><Text style={styles.microLabel}>{tr ? 'MALİYET' : 'COST'}</Text></View></View>
    </View>
  );
}

function StopStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Planlanan çıkış ile gerçek çıkış farklı olabilir' : 'Planned exit and actual exit can differ'} />
        <View style={styles.stopCompare}><View style={styles.stopPlan}><Text style={styles.microLabel}>{tr ? 'PLAN' : 'PLAN'}</Text><Text style={styles.stopValue}>95</Text></View><Text style={styles.flowArrow}>›</Text><View style={styles.stopActual}><Text style={styles.microLabel}>{tr ? 'GERÇEKLEŞEN' : 'EXECUTED'}</Text><Text style={styles.stopValue}>93</Text></View></View>
      </View>
    );
  }
  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Stop seviyesine gelince çıkış emri tetiklenir' : 'Reaching the stop level triggers an exit order'} />
        <View style={styles.stopFlow}><View style={styles.stopFlowChip}><Text style={styles.microLabel}>{tr ? 'FİYAT' : 'PRICE'}</Text><Text style={styles.stopFlowValue}>100</Text></View><View style={styles.stopFlowLine} /><View style={styles.stopTrigger}><Text style={styles.microLabel}>STOP</Text><Text style={styles.stopFlowValue}>95</Text></View><View style={styles.stopFlowLine} /><View style={styles.stopFlowChip}><Text style={styles.microLabel}>{tr ? 'EMİR DEVREDE' : 'ORDER ACTIVE'}</Text></View></View>
      </View>
    );
  }
  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Fiyat arayı atladığında 95’te işlem olmayabilir' : 'If price jumps over the level, there may be no trade at 95'} />
        <View style={styles.gapStage}><View style={styles.priceStep}><Text style={styles.priceStepText}>100</Text></View><View style={styles.gapDrop} /><View style={styles.missedLevel}><Text style={styles.missedLevelText}>95</Text></View><View style={styles.gapDropLarge} /><View style={[styles.priceStep, styles.priceStepBad]}><Text style={styles.priceStepText}>93</Text></View></View>
      </View>
    );
  }
  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Stop seviyesi fiyatı durduran bir duvar değildir' : 'A stop level is not a wall that stops price'} />
        <View style={styles.wallStage}><View style={styles.priceArrowDown}><Text style={styles.priceArrowDownText}>↓</Text></View><View style={styles.stopWall}><Text style={styles.stopWallText}>95</Text><View style={styles.wallBreak} /></View><View style={styles.priceArrowDown}><Text style={styles.priceArrowDownText}>↓</Text></View></View>
      </View>
    );
  }
  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Stop plan sağlar; gerçekleşme fiyatını garanti etmez' : 'A stop provides a plan; it does not guarantee the execution price'} />
      <View style={styles.stopSummary}><View style={styles.stopSummaryChip}><Text style={styles.microLabel}>{tr ? 'PLAN' : 'PLAN'}</Text><Text style={styles.stopSummaryValue}>95</Text></View><Text style={styles.notEqual}>≠</Text><View style={styles.stopSummaryChip}><Text style={styles.microLabel}>{tr ? 'GARANTİ' : 'GUARANTEE'}</Text><Text style={styles.questionMarkSmall}>?</Text></View></View>
    </View>
  );
}

function DiversificationStory({ tr, role, styles }: SceneProps) {
  if (role === 'hook') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'On isim, tek risk kaynağı olabilir' : 'Ten names can still share one risk source'} />
        <View style={styles.sameSourceStage}><View style={styles.sourceNode}><Text style={styles.microLabel}>{tr ? 'TEK RİSK' : 'ONE RISK'}</Text></View><View style={styles.sourceBranches}>{Array.from({ length: 6 }).map((_, i) => <View key={i} style={styles.sourceBranch}><View style={styles.assetDot} /></View>)}</View></View>
      </View>
    );
  }
  if (role === 'concept') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Çeşitlendirme, farklı risk kaynaklarına yayılmaktır' : 'Diversification spreads across different risk sources'} />
        <View style={styles.sourceGrid}>{[tr ? 'ŞİRKET' : 'COMPANY', tr ? 'FAİZ' : 'RATES', tr ? 'EMTİA' : 'COMMODITY', tr ? 'DÖVİZ' : 'FX'].map((label, i) => <View key={label} style={[styles.sourceCard, i === 2 && styles.sourceCardAccent]}><View style={styles.sourceIcon}><Text style={styles.sourceIconText}>{i + 1}</Text></View><Text style={styles.sourceText}>{label}</Text></View>)}</View>
      </View>
    );
  }
  if (role === 'practice') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Aynı olay benzer varlıkların hepsini birlikte etkileyebilir' : 'One event can affect many similar assets together'} />
        <View style={styles.eventStage}><View style={styles.eventNode}><Text style={styles.microLabel}>{tr ? 'AYNI OLAY' : 'SAME EVENT'}</Text></View><View style={styles.eventArrows}>{Array.from({ length: 4 }).map((_, i) => <View key={i} style={styles.eventArrow} />)}</View><View style={styles.hitRow}>{Array.from({ length: 4 }).map((_, i) => <View key={i} style={styles.hitAsset}><Text style={styles.hitText}>−</Text></View>)}</View></View>
      </View>
    );
  }
  if (role === 'misconception') {
    return (
      <View style={styles.story}>
        <Heading styles={styles} title={tr ? 'Çok kutu görmek, otomatik olarak çok farklı risk demek değildir' : 'Many boxes do not automatically mean many different risks'} />
        <View style={styles.countVsRisk}><View style={styles.manyNames}>{Array.from({ length: 9 }).map((_, i) => <View key={i} style={styles.nameBox} />)}</View><Text style={styles.notEqual}>≠</Text><View style={styles.oneSource}><Text style={styles.microLabel}>{tr ? 'FARKLI RİSK' : 'DIFFERENT RISK'}</Text><Text style={styles.questionMarkSmall}>?</Text></View></View>
      </View>
    );
  }
  return (
    <View style={styles.story}>
      <Heading styles={styles} title={tr ? 'Amaç isim sayısını değil, tek riske bağımlılığı azaltmaktır' : 'The goal is to reduce dependence on one risk, not count names'} />
      <View style={styles.divSummary}><View style={styles.divSource}><Text style={styles.microLabel}>{tr ? 'RİSK A' : 'RISK A'}</Text></View><View style={styles.divSource}><Text style={styles.microLabel}>{tr ? 'RİSK B' : 'RISK B'}</Text></View><View style={styles.divSource}><Text style={styles.microLabel}>{tr ? 'RİSK C' : 'RISK C'}</Text></View></View>
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
  cardCaption: { color: '#90A4B3', fontSize: 9, lineHeight: 13, textAlign: 'center' },
  branchStage: { minHeight: 165, alignItems: 'center', justifyContent: 'center' },
  decisionNode: { width: 84, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E3035', borderWidth: 1, borderColor: '#2D776F' },
  nodeLabel: { color: '#62E1D1', fontSize: 9, fontWeight: '900' },
  branchLines: { width: '70%', height: 35, position: 'relative' },
  branchLineLeft: { position: 'absolute', left: '17%', top: 4, width: '34%', height: 2, backgroundColor: '#365466', transform: [{ rotate: '-22deg' }] },
  branchLineMid: { position: 'absolute', left: '49%', top: 0, width: 2, height: 30, backgroundColor: '#365466' },
  branchLineRight: { position: 'absolute', right: '17%', top: 4, width: '34%', height: 2, backgroundColor: '#365466', transform: [{ rotate: '22deg' }] },
  outcomeRow: { width: '100%', flexDirection: 'row', gap: 7 },
  outcome: { flex: 1, minHeight: 62, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 14, backgroundColor: '#101F2D', borderWidth: 1, borderColor: '#384A59' },
  outcomeGood: { backgroundColor: '#0D2D2F', borderColor: '#2D6E68' },
  outcomeBad: { backgroundColor: '#271E25', borderColor: '#6C4D57' },
  outcomeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7E91A0' },
  outcomeDotGood: { backgroundColor: '#4BD3C1' }, outcomeDotBad: { backgroundColor: '#B57A75' },
  outcomeText: { color: '#CDD8DE', fontSize: 8, fontWeight: '900' },
  riskVsLoss: { minHeight: 150, flexDirection: 'row', alignItems: 'center', gap: 10 },
  possibilityCard: { flex: 1, minHeight: 128, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 15, backgroundColor: '#0D2932', borderWidth: 1, borderColor: '#2D6466' },
  lossCard: { flex: 1, minHeight: 128, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 15, backgroundColor: '#281E25', borderWidth: 1, borderColor: '#704E59' },
  possibilityMark: { color: '#5FDDCD', fontSize: 34, fontWeight: '900' }, possibilityMarkSmall: { color: '#5FDDCD', fontSize: 27, fontWeight: '900' },
  lossValue: { color: '#D69B93', fontSize: 22, fontWeight: '900' }, flowArrow: { color: '#6E8495', fontSize: 25, fontWeight: '900' },
  beforeAfterStage: { minHeight: 205, flexDirection: 'row', alignItems: 'center' },
  beforeCard: { flex: 1, minHeight: 155, padding: 14, justifyContent: 'center', gap: 8, borderRadius: 15, backgroundColor: '#0D2D32', borderWidth: 1, borderColor: '#2E756E' },
  afterCard: { flex: 1, minHeight: 155, padding: 14, justifyContent: 'center', gap: 8, borderRadius: 15, backgroundColor: '#101F2D', borderWidth: 1, borderColor: '#394C5D' },
  beforeLink: { width: 24, height: 2, backgroundColor: '#34756F' }, stepNumber: { color: '#5DE0CF', fontSize: 23, fontWeight: '900' }, stepTitle: { color: '#D9E5E9', fontSize: 9, fontWeight: '900' }, stepBody: { color: '#9DB0BD', fontSize: 10, lineHeight: 15 },
  zeroRiskStage: { minHeight: 150, flexDirection: 'row', alignItems: 'center', gap: 9 }, todayCard: { flex: 1, minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 15, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, futureRiskCard: { flex: 1, minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 15, backgroundColor: '#0D2D32', borderWidth: 1, borderColor: '#2E746E' }, zeroValue: { color: '#D8E2E7', fontSize: 28, fontWeight: '900' }, notEqual: { color: '#BECBD4', fontSize: 22, fontWeight: '900' },
  simpleFlow: { minHeight: 125, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, flowChip: { width: 70, height: 64, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, flowChipAccent: { width: 70, height: 64, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D3033', borderWidth: 1, borderColor: '#2F7C74' }, flowLine: { width: 30, height: 2, backgroundColor: '#34736E' },
  pricePath: { height: 95, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 5 }, pathBar: { flex: 1, minHeight: 7, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: '#718797' }, pathBarAccent: { backgroundColor: '#47CCBD' },
  volCompare: { flexDirection: 'row', gap: 9 }, volCard: { flex: 1, minHeight: 160, justifyContent: 'center', gap: 8, padding: 11, borderRadius: 15, backgroundColor: '#101F2D', borderWidth: 1, borderColor: '#354B5D' }, volCardActive: { backgroundColor: '#0D2D32', borderColor: '#2C766F' }, resultMuted: { color: '#9EAFBA', fontSize: 9, textAlign: 'center', fontWeight: '800' }, resultGood: { color: '#5DE0CF', fontSize: 9, textAlign: 'center', fontWeight: '800' },
  rangeStage: { minHeight: 145, gap: 16, justifyContent: 'center' }, rangeLow: { gap: 8 }, rangeHigh: { gap: 8 }, rangeLineShort: { width: '38%', height: 12, borderRadius: 6, alignSelf: 'center', backgroundColor: '#607788' }, rangeLineWide: { width: '88%', height: 12, borderRadius: 6, alignSelf: 'center', backgroundColor: '#43CBBB' },
  cashSwing: { flexDirection: 'row', gap: 9 }, cashCard: { flex: 1, minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: 13, borderRadius: 15, backgroundColor: '#101F2D', borderWidth: 1, borderColor: '#354B5D' }, cashCardActive: { backgroundColor: '#0D2D32', borderColor: '#2D766F' }, cashAmount: { color: '#EEF4F6', fontSize: 17, fontWeight: '900' }, swingSmall: { width: '35%', height: 5, borderRadius: 3, backgroundColor: '#758B9A' }, swingLarge: { width: '78%', height: 5, borderRadius: 3, backgroundColor: '#49D1C1' }, cashCaption: { color: '#8FA2B1', fontSize: 9 },
  directionPair: { flexDirection: 'row', gap: 9 }, directionCard: { flex: 1, minHeight: 150, alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: 15, backgroundColor: '#101F2D', borderWidth: 1, borderColor: '#3A4D5B' }, directionArrow: { color: '#4BD2C1', fontSize: 42, fontWeight: '900' }, directionArrowDown: { color: '#C4877C' },
  volSummary: { minHeight: 125, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }, volSummaryRange: { width: 85, height: 12, borderRadius: 6, backgroundColor: '#44CCBC' }, volSummaryText: { color: '#9BB0BD', fontSize: 8, fontWeight: '900' }, volSummaryQuestion: { color: '#D4DEE4', fontSize: 28, fontWeight: '900', marginLeft: 20 },
  sizeCompare: { flexDirection: 'row', gap: 9 }, sizeCard: { flex: 1, minHeight: 160, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 15, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, sizeCardLarge: { backgroundColor: '#281E25', borderColor: '#704E59' }, sizeAmount: { color: '#EDF3F6', fontSize: 20, fontWeight: '900' }, lossSmall: { color: '#A6B8C3', fontSize: 14, fontWeight: '900' }, lossLarge: { color: '#D79A92', fontSize: 18, fontWeight: '900' },
  sizeEquation: { minHeight: 150, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, equationChip: { width: 76, minHeight: 85, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 15, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, equationChipAccent: { backgroundColor: '#0D3033', borderColor: '#2F7B74' }, equationValue: { color: '#E8EFF3', fontSize: 20, fontWeight: '900' }, equationEquals: { color: '#56D8C8', fontSize: 17, fontWeight: '900' },
  exposureStage: { minHeight: 190, justifyContent: 'center', gap: 8 }, exposureBarSmall: { width: '24%', height: 28, borderRadius: 8, backgroundColor: '#5E788A' }, exposureBarLarge: { width: '85%', height: 28, borderRadius: 8, backgroundColor: '#3FCABB' }, exposureText: { color: '#9EB0BC', fontSize: 10, fontWeight: '800' }, exposureDivider: { width: '100%', height: 1, backgroundColor: '#294456', marginVertical: 7 },
  capacityStage: { minHeight: 150, flexDirection: 'row', alignItems: 'center', gap: 9 }, capacityCard: { flex: 1, minHeight: 130, alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 15, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, capacityFull: { width: '82%', height: 42, borderRadius: 10, backgroundColor: '#B17C74' }, capacitySafe: { width: '35%', height: 42, borderRadius: 10, backgroundColor: '#46CDBD' },
  sizeSummary: { minHeight: 135, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 5 }, summarySmall: { width: 76, height: 45, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, summaryLarge: { width: 100, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#281E25', borderWidth: 1, borderColor: '#704E59' }, summaryImpactSmall: { width: 70, height: 45, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#102432' }, summaryImpactLarge: { width: 100, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#281E25' }, summaryArrow: { width: 22, height: 2, backgroundColor: '#3B756F' }, summarySpacer: { width: '100%', height: 3 },
  targetStage: { minHeight: 145, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }, lossTarget: { width: 72, height: 92, borderRadius: 18, alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: '#281E25', borderWidth: 1, borderColor: '#704E59' }, gainTarget: { width: 88, height: 112, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: '#0D3033', borderWidth: 1, borderColor: '#2F7B74' }, targetNumber: { color: '#F0F4F6', fontSize: 29, fontWeight: '900' }, targetVs: { color: '#8196A5', fontSize: 18, fontWeight: '900' }, targetQuestion: { width: 66, alignItems: 'center', gap: 2 }, questionMark: { color: '#D8E2E7', fontSize: 31, fontWeight: '900' }, questionMarkSmall: { color: '#D8E2E7', fontSize: 24, fontWeight: '900' },
  rewardFactors: { flexDirection: 'row', gap: 7 }, factorCard: { flex: 1, minHeight: 135, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, factorBig: { color: '#55D7C7', fontSize: 27, fontWeight: '900' },
  decisionPieces: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, piece: { width: '48.5%', minHeight: 85, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 11, borderRadius: 14, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, pieceAccent: { backgroundColor: '#0D3033', borderColor: '#2F7B74' }, pieceNumber: { color: '#5EDECE', fontSize: 17, fontWeight: '900' }, pieceText: { flex: 1, color: '#A8BAC5', fontSize: 8, fontWeight: '900' },
  paperVsReality: { minHeight: 145, flexDirection: 'row', alignItems: 'center', gap: 10 }, paperPlan: { flex: 1, minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 15, backgroundColor: '#0D3033', borderWidth: 1, borderColor: '#2F7B74' }, planText: { color: '#F0F5F7', fontSize: 25, fontWeight: '900' }, realityCard: { flex: 1, minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 15, backgroundColor: '#171F2D', borderWidth: 1, borderColor: '#4C4E58' },
  rewardSummary: { minHeight: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, rewardSummaryChip: { width: 77, height: 68, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, plus: { color: '#50D3C4', fontSize: 18, fontWeight: '900' },
  stopCompare: { minHeight: 145, flexDirection: 'row', alignItems: 'center', gap: 10 }, stopPlan: { flex: 1, minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 15, backgroundColor: '#0D3033', borderWidth: 1, borderColor: '#2E776F' }, stopActual: { flex: 1, minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 15, backgroundColor: '#281E25', borderWidth: 1, borderColor: '#704E59' }, stopValue: { color: '#EFF4F6', fontSize: 29, fontWeight: '900' },
  stopFlow: { minHeight: 135, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, stopFlowChip: { width: 75, height: 75, borderRadius: 18, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, stopTrigger: { width: 82, height: 82, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#0D3033', borderWidth: 1, borderColor: '#2F7B74' }, stopFlowLine: { width: 25, height: 2, backgroundColor: '#34746E' }, stopFlowValue: { color: '#ECF3F5', fontSize: 19, fontWeight: '900' },
  gapStage: { minHeight: 190, alignItems: 'center', justifyContent: 'center' }, priceStep: { width: 85, height: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, priceStepBad: { backgroundColor: '#281E25', borderColor: '#704E59' }, priceStepText: { color: '#EDF3F6', fontSize: 19, fontWeight: '900' }, gapDrop: { width: 2, height: 22, backgroundColor: '#3C6A6B' }, gapDropLarge: { width: 2, height: 38, backgroundColor: '#7B555D' }, missedLevel: { width: 120, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: '#C59580' }, missedLevelText: { color: '#D8B4A4', fontSize: 13, fontWeight: '900' },
  wallStage: { minHeight: 155, alignItems: 'center', justifyContent: 'center' }, priceArrowDown: { height: 45, justifyContent: 'center' }, priceArrowDownText: { color: '#C9857B', fontSize: 32, fontWeight: '900' }, stopWall: { width: '78%', height: 32, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#4A3B44', borderWidth: 1, borderColor: '#7A5660', overflow: 'hidden' }, stopWallText: { color: '#E2C9C6', fontSize: 13, fontWeight: '900' }, wallBreak: { position: 'absolute', width: 4, height: 45, backgroundColor: '#081726', transform: [{ rotate: '12deg' }] },
  stopSummary: { minHeight: 125, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 13 }, stopSummaryChip: { width: 90, height: 82, borderRadius: 18, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, stopSummaryValue: { color: '#EEF4F6', fontSize: 21, fontWeight: '900' },
  sameSourceStage: { minHeight: 150, alignItems: 'center', justifyContent: 'center' }, sourceNode: { width: 92, height: 55, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: '#281E25', borderWidth: 1, borderColor: '#704E59' }, sourceBranches: { width: '90%', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 28 }, sourceBranch: { width: 2, height: 35, backgroundColor: '#704E59', alignItems: 'center', justifyContent: 'flex-end' }, assetDot: { width: 23, height: 23, borderRadius: 7, backgroundColor: '#596F80', marginBottom: -18 },
  sourceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, sourceCard: { width: '48.5%', minHeight: 110, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 14, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, sourceCardAccent: { backgroundColor: '#0D3033', borderColor: '#2F7B74' }, sourceIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#183A46' }, sourceIconText: { color: '#62DFD0', fontSize: 14, fontWeight: '900' }, sourceText: { color: '#9EB0BC', fontSize: 8, fontWeight: '900' },
  eventStage: { minHeight: 195, alignItems: 'center', justifyContent: 'center' }, eventNode: { width: 110, height: 55, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#281E25', borderWidth: 1, borderColor: '#704E59' }, eventArrows: { width: '82%', height: 42, flexDirection: 'row', justifyContent: 'space-around' }, eventArrow: { width: 2, height: 42, backgroundColor: '#7B555F' }, hitRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-around' }, hitAsset: { width: 48, height: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#33222A', borderWidth: 1, borderColor: '#704E59' }, hitText: { color: '#D18F87', fontSize: 21, fontWeight: '900' },
  countVsRisk: { minHeight: 150, flexDirection: 'row', alignItems: 'center', gap: 9 }, manyNames: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 5, padding: 11, borderRadius: 14, backgroundColor: '#102432', borderWidth: 1, borderColor: '#354F61' }, nameBox: { width: '28%', height: 24, borderRadius: 6, backgroundColor: '#5D7282' }, oneSource: { flex: 1, minHeight: 115, alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, backgroundColor: '#281E25', borderWidth: 1, borderColor: '#704E59' },
  divSummary: { minHeight: 125, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }, divSource: { width: 76, height: 76, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D3033', borderWidth: 1, borderColor: '#2F7B74' },
});
