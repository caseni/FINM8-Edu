import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'inflation' | 'rates' | 'centralBank' | 'monetaryPolicy' | 'growth' | 'cycle';

export interface EconomySlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('enflasyon-satin-alma-gucu')) return 'inflation';
  if (assetRef.includes('faiz-orani-ne-anlatir')) return 'rates';
  if (assetRef.includes('merkez-bankasi-ne-yapar')) return 'centralBank';
  if (assetRef.includes('faiz-karari-ekonomiye-nasil-yansir')) return 'monetaryPolicy';
  if (assetRef.includes('gsyh-buyume-ne-anlatir')) return 'growth';
  if (assetRef.includes('ekonomik-dongu-resesyon')) return 'cycle';
  return undefined;
}

export function isEconomySlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function EconomySlideVisual({
  assetRef,
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: EconomySlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;

  const tr = language === 'tr';
  const styles = createStyles(theme);

  return (
    <View accessibilityRole="image" accessibilityLabel={alt} style={styles.shell}>
      <LinearGradient colors={['#071522', '#0B1E2C', '#071522']} style={styles.stage}>
        {topic === 'inflation' ? <InflationVisual role={role} tr={tr} styles={styles} /> : null}
        {topic === 'rates' ? <RatesVisual role={role} tr={tr} styles={styles} /> : null}
        {topic === 'centralBank' ? <CentralBankVisual role={role} tr={tr} styles={styles} /> : null}
        {topic === 'monetaryPolicy' ? <PolicyVisual role={role} tr={tr} styles={styles} /> : null}
        {topic === 'growth' ? <GrowthVisual role={role} tr={tr} styles={styles} /> : null}
        {topic === 'cycle' ? <CycleVisual role={role} tr={tr} styles={styles} /> : null}
      </LinearGradient>
    </View>
  );
}

type SceneProps = {
  role: SlideRole;
  tr: boolean;
  styles: ReturnType<typeof createStyles>;
};

function Copy({ title, body, styles }: { title: string; body?: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.copy}>
      <Text style={styles.sceneTitle}>{title}</Text>
      {body ? <Text style={styles.sceneBody}>{body}</Text> : null}
    </View>
  );
}

function InflationVisual({ role, tr, styles }: SceneProps) {
  if (role === 'misconception') {
    return (
      <>
        <Copy
          title={tr ? 'Tek ürün, bütün fiyatlar değildir.' : 'One product is not the whole price picture.'}
          body={tr ? 'Domates pahalanabilir; genel artış için daha geniş sepete bakılır.' : 'Tomatoes can rise alone; broad inflation needs a wider basket.'}
          styles={styles}
        />
        <View style={styles.compareRow}>
          <View style={styles.singleProduct}><View style={styles.tomato}><View style={styles.tomatoStem} /></View></View>
          <Text style={styles.notEqual}>≠</Text>
          <Basket full styles={styles} />
        </View>
      </>
    );
  }

  return (
    <>
      <Copy
        title={tr ? 'Aynı bütçe, daha az ürün.' : 'Same budget, fewer goods.'}
        body={tr ? 'Fiyatlar yükselirse satın alma gücü düşebilir.' : 'When prices rise, purchasing power can fall.'}
        styles={styles}
      />
      <View style={styles.compareRow}>
        <View style={styles.basketColumn}>
          <Text style={styles.smallLabel}>{tr ? 'ÖNCE' : 'BEFORE'}</Text>
          <Basket full styles={styles} />
          <Text style={styles.resultStrong}>{tr ? 'Daha çok ürün' : 'More goods'}</Text>
        </View>
        <View style={styles.arrowLine}><View style={styles.arrowHead} /></View>
        <View style={styles.basketColumn}>
          <Text style={styles.smallLabel}>{tr ? 'SONRA' : 'AFTER'}</Text>
          <Basket full={false} styles={styles} />
          <Text style={styles.resultMuted}>{tr ? 'Daha az ürün' : 'Fewer goods'}</Text>
        </View>
      </View>
    </>
  );
}

function Basket({ full, styles }: { full: boolean; styles: ReturnType<typeof createStyles> }) {
  const items = full ? [0, 1, 2, 3, 4] : [0, 1, 2];
  return (
    <View style={styles.basketWrap}>
      <View style={styles.basketHandle} />
      <View style={styles.products}>
        {items.map((item) => (
          <View key={item} style={[styles.product, item % 3 === 0 ? styles.productWarm : item % 3 === 1 ? styles.productCool : styles.productGreen]} />
        ))}
      </View>
      <View style={styles.basketBody}>
        <View style={styles.basketLine} /><View style={styles.basketLine} /><View style={styles.basketLine} />
      </View>
    </View>
  );
}

function RatesVisual({ role, tr, styles }: SceneProps) {
  const warning = role === 'misconception' || role === 'risk';
  return (
    <>
      <Copy
        title={warning ? (tr ? 'Her kredi aynı faizle verilmez.' : 'Not every loan has the same rate.') : (tr ? 'Faiz yükselirse borç pahalılaşabilir.' : 'Higher rates can make borrowing costlier.')}
        body={warning ? (tr ? 'Kredi türü, süre ve risk gerçek oranı değiştirebilir.' : 'Product, term, and risk can change the actual rate.') : (tr ? 'Aynı borç için geri ödeme yükü artabilir.' : 'The repayment burden on the same debt can rise.')}
        styles={styles}
      />
      <View style={styles.rateCompare}>
        <RateCard high={false} label={tr ? 'Daha düşük faiz' : 'Lower rate'} styles={styles} />
        <RateCard high label={tr ? 'Daha yüksek faiz' : 'Higher rate'} styles={styles} />
      </View>
    </>
  );
}

function RateCard({ high, label, styles }: { high: boolean; label: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={[styles.rateCard, high && styles.rateCardHigh]}>
      <View style={styles.coinStack}>
        <View style={styles.coin} /><View style={styles.coin} />{high ? <><View style={styles.coin} /><View style={styles.coin} /></> : null}
      </View>
      <Text style={styles.rateLabel}>{label}</Text>
      <Text style={[styles.rateOutcome, high && styles.rateOutcomeHigh]}>{high ? '↑' : '↓'}</Text>
    </View>
  );
}

function CentralBankVisual({ role, tr, styles }: SceneProps) {
  const caution = role === 'misconception' || role === 'risk';
  return (
    <>
      <Copy
        title={caution ? (tr ? 'Her fiyatı tek tek belirlemez.' : 'It does not set every price.') : (tr ? 'Merkez bankası koşulları etkiler.' : 'A central bank influences conditions.')}
        body={caution ? (tr ? 'Piyasa fiyatları birçok etkenle birlikte oluşur.' : 'Market prices form through many factors together.') : (tr ? 'Faiz ve para koşulları ekonomiye yayılan etkiler yaratabilir.' : 'Rates and monetary conditions can create effects across the economy.')}
        styles={styles}
      />
      <View style={styles.bankScene}>
        <View style={styles.bankRoof} />
        <View style={styles.bankBody}>
          <View style={styles.bankColumn} /><View style={styles.bankColumn} /><View style={styles.bankColumn} /><View style={styles.bankColumn} />
        </View>
        <View style={styles.bankBase} />
        <View style={styles.bankLinks}>
          <View style={styles.linkPill}><Text style={styles.linkText}>{tr ? 'Faiz' : 'Rates'}</Text></View>
          <View style={styles.linkPill}><Text style={styles.linkText}>{tr ? 'Kredi' : 'Credit'}</Text></View>
        </View>
      </View>
    </>
  );
}

function PolicyVisual({ role, tr, styles }: SceneProps) {
  const caution = role === 'misconception' || role === 'risk';
  return (
    <>
      <Copy
        title={caution ? (tr ? 'Etki bir gecede oluşmaz.' : 'The effect does not happen overnight.') : (tr ? 'Faiz kararı ekonomiye adım adım yayılır.' : 'A rate decision spreads step by step.')}
        body={caution ? (tr ? 'İnsanların ve şirketlerin karar değiştirmesi zaman alır.' : 'People and businesses take time to change decisions.') : (tr ? 'Önce kredi koşulları, sonra harcama ve yatırım etkilenebilir.' : 'Borrowing conditions can move first, then spending and investment.')}
        styles={styles}
      />
      <View style={styles.flowRow}>
        <FlowNode label={tr ? 'Faiz' : 'Rate'} styles={styles} />
        <FlowArrow styles={styles} />
        <FlowNode label={tr ? 'Kredi' : 'Credit'} styles={styles} />
        <FlowArrow styles={styles} />
        <FlowNode label={tr ? 'Harcama' : 'Spending'} styles={styles} />
      </View>
    </>
  );
}

function FlowNode({ label, styles }: { label: string; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.flowNode}><View style={styles.flowDot} /><Text style={styles.flowLabel}>{label}</Text></View>;
}

function FlowArrow({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.flowArrow}><View style={styles.flowArrowHead} /></View>;
}

function GrowthVisual({ role, tr, styles }: SceneProps) {
  const caution = role === 'misconception' || role === 'risk';
  return (
    <>
      <Copy
        title={caution ? (tr ? 'Büyüme, herkesin aynı ölçüde zenginleşmesi değildir.' : 'Growth does not mean everyone gains equally.') : (tr ? 'Daha fazla üretim, ekonomik büyüme demektir.' : 'More production means economic growth.')}
        body={caution ? (tr ? 'Toplam üretim artabilir; etkisi insanlar arasında farklı olabilir.' : 'Total output can rise while the effect differs across people.') : (tr ? 'Mağazalar, üretim ve hizmetler toplam faaliyeti oluşturur.' : 'Shops, production, and services make up total activity.')}
        styles={styles}
      />
      <View style={styles.activityRow}>
        <ActivityBuilding kind="shop" styles={styles} />
        <ActivityBuilding kind="factory" styles={styles} />
        <ActivityBuilding kind="service" styles={styles} />
      </View>
      <View style={styles.growthLine}><View style={styles.growthLineUp} /></View>
    </>
  );
}

function ActivityBuilding({ kind, styles }: { kind: 'shop' | 'factory' | 'service'; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.activityCard}>
      {kind === 'shop' ? <><View style={styles.awning} /><View style={styles.shopDoor} /></> : null}
      {kind === 'factory' ? <><View style={styles.chimney} /><View style={styles.factoryRoof} /></> : null}
      {kind === 'service' ? <><View style={styles.serviceHead} /><View style={styles.serviceBody} /></> : null}
    </View>
  );
}

function CycleVisual({ role, tr, styles }: SceneProps) {
  const caution = role === 'misconception' || role === 'risk';
  return (
    <>
      <Copy
        title={caution ? (tr ? 'Tek kötü veri, tek başına resesyon değildir.' : 'One weak data point is not a recession.') : (tr ? 'Harcama azalırsa ekonomi yavaşlayabilir.' : 'Lower spending can slow the economy.')}
        body={caution ? (tr ? 'Yavaşlamanın ne kadar geniş ve uzun olduğuna bakılır.' : 'Breadth and duration of weakness matter.') : (tr ? 'Satışlar, üretim ve işe alımlar birlikte zayıflayabilir.' : 'Sales, production, and hiring can weaken together.')}
        styles={styles}
      />
      <View style={styles.slowdownList}>
        <SlowRow label={tr ? 'Harcama' : 'Spending'} width="72%" styles={styles} />
        <SlowRow label={tr ? 'Üretim' : 'Production'} width="52%" styles={styles} />
        <SlowRow label={tr ? 'İşe alım' : 'Hiring'} width="35%" styles={styles} />
      </View>
    </>
  );
}

function SlowRow({ label, width, styles }: { label: string; width: `${number}%`; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.slowRow}>
      <Text style={styles.slowLabel}>{label}</Text>
      <View style={styles.slowTrack}><View style={[styles.slowFill, { width }]} /></View>
      <Text style={styles.slowArrow}>↓</Text>
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: {
    overflow: 'hidden',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#29465E',
    backgroundColor: '#071522',
  },
  stage: { minHeight: 255, padding: 18, gap: 18, justifyContent: 'center' },
  copy: { gap: 5 },
  sceneTitle: { color: '#F8FAFC', fontSize: 19, lineHeight: 25, fontWeight: '900' },
  sceneBody: { color: '#A9BACB', fontSize: 13, lineHeight: 19, fontWeight: '600' },
  compareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  basketColumn: { flex: 1, alignItems: 'center', gap: 7 },
  smallLabel: { color: '#6FE7D7', fontSize: 9, fontWeight: '900', letterSpacing: 0.9 },
  resultStrong: { color: '#E8FFF9', fontSize: 12, fontWeight: '800' },
  resultMuted: { color: '#A9BACB', fontSize: 12, fontWeight: '800' },
  basketWrap: { width: 118, height: 100, justifyContent: 'flex-end', alignItems: 'center' },
  basketHandle: { position: 'absolute', top: 13, width: 74, height: 45, borderWidth: 5, borderColor: '#506C7B', borderBottomWidth: 0, borderTopLeftRadius: 35, borderTopRightRadius: 35 },
  products: { position: 'absolute', top: 25, width: 94, height: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 4 },
  product: { width: 15, height: 28, borderRadius: 8 },
  productWarm: { backgroundColor: '#D89B54' },
  productCool: { backgroundColor: '#DCE6E6' },
  productGreen: { backgroundColor: '#6D9D72' },
  basketBody: { width: 108, height: 48, borderRadius: 9, borderWidth: 3, borderColor: '#6D8796', backgroundColor: '#102A3B', justifyContent: 'space-evenly', paddingHorizontal: 10 },
  basketLine: { height: 3, borderRadius: 2, backgroundColor: '#426070' },
  arrowLine: { width: 28, height: 2, backgroundColor: '#4A6D7F', alignItems: 'flex-end', justifyContent: 'center' },
  arrowHead: { width: 9, height: 9, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#4A6D7F', transform: [{ rotate: '45deg' }] },
  singleProduct: { flex: 1, alignItems: 'center' },
  tomato: { width: 66, height: 58, borderRadius: 32, backgroundColor: '#C55244', borderWidth: 1, borderColor: '#F07B68' },
  tomatoStem: { position: 'absolute', top: -7, left: 27, width: 12, height: 18, borderRadius: 6, backgroundColor: '#6F9B69' },
  notEqual: { color: '#7D92A5', fontSize: 26, fontWeight: '800' },
  rateCompare: { flexDirection: 'row', gap: 12 },
  rateCard: { flex: 1, minHeight: 135, borderRadius: 17, borderWidth: 1, borderColor: '#2A5267', backgroundColor: '#0D2636', alignItems: 'center', justifyContent: 'center', gap: 9, padding: 14 },
  rateCardHigh: { borderColor: '#76534A', backgroundColor: '#281C1B' },
  coinStack: { height: 42, justifyContent: 'flex-end', alignItems: 'center', gap: 2 },
  coin: { width: 42, height: 9, borderRadius: 6, backgroundColor: '#C79C52', borderWidth: 1, borderColor: '#E6C778' },
  rateLabel: { color: '#DCE7EF', fontSize: 11, fontWeight: '800', textAlign: 'center' },
  rateOutcome: { color: '#5EEAD4', fontSize: 22, fontWeight: '900' },
  rateOutcomeHigh: { color: '#F28A79' },
  bankScene: { alignItems: 'center', gap: 0, paddingTop: 4 },
  bankRoof: { width: 166, height: 0, borderLeftWidth: 83, borderRightWidth: 83, borderBottomWidth: 42, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#31536A' },
  bankBody: { width: 150, height: 72, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'stretch', backgroundColor: '#102B3A', paddingHorizontal: 12, paddingTop: 10 },
  bankColumn: { width: 13, borderRadius: 4, backgroundColor: '#8AA2B0' },
  bankBase: { width: 182, height: 13, borderRadius: 4, backgroundColor: '#31536A' },
  bankLinks: { flexDirection: 'row', gap: 10, marginTop: 14 },
  linkPill: { minWidth: 86, minHeight: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 17, borderWidth: 1, borderColor: '#2F766F', backgroundColor: '#103538', paddingHorizontal: 14 },
  linkText: { color: '#7CF3E2', fontSize: 11, fontWeight: '900' },
  flowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  flowNode: { width: 76, minHeight: 76, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 18, borderWidth: 1, borderColor: '#2C5267', backgroundColor: '#0D2636' },
  flowDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 5, borderColor: '#34D6C4', backgroundColor: '#123B42' },
  flowLabel: { color: '#E6EEF4', fontSize: 11, fontWeight: '900' },
  flowArrow: { width: 20, height: 2, backgroundColor: '#4A6D7F', alignItems: 'flex-end', justifyContent: 'center' },
  flowArrowHead: { width: 8, height: 8, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#4A6D7F', transform: [{ rotate: '45deg' }] },
  activityRow: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  activityCard: { width: 82, height: 94, borderRadius: 16, borderWidth: 1, borderColor: '#2C5267', backgroundColor: '#0D2636', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 12 },
  awning: { width: 52, height: 14, borderRadius: 4, backgroundColor: '#38CFC0', marginBottom: 8 },
  shopDoor: { width: 32, height: 42, borderRadius: 4, backgroundColor: '#6E8796' },
  chimney: { width: 14, height: 38, backgroundColor: '#647E8E', marginLeft: 38 },
  factoryRoof: { width: 52, height: 38, backgroundColor: '#405F72', transform: [{ skewX: '-18deg' }] },
  serviceHead: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#8CA7B5', marginBottom: 5 },
  serviceBody: { width: 48, height: 38, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: '#405F72' },
  growthLine: { height: 14, marginHorizontal: 26, borderBottomWidth: 3, borderColor: '#2F766F', transform: [{ rotate: '-5deg' }] },
  growthLineUp: { position: 'absolute', right: -2, bottom: -5, width: 12, height: 12, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#5EEAD4' },
  slowdownList: { gap: 12 },
  slowRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  slowLabel: { width: 64, color: '#DCE7EF', fontSize: 11, fontWeight: '800' },
  slowTrack: { flex: 1, height: 12, borderRadius: 6, backgroundColor: '#162E3E', overflow: 'hidden' },
  slowFill: { height: 12, borderRadius: 6, backgroundColor: '#3BAF9F' },
  slowArrow: { width: 20, color: '#F28A79', fontSize: 18, fontWeight: '900' },
});
