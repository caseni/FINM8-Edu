import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic = 'correlation' | 'drawdown' | 'leverage' | 'concentration' | 'riskBudget' | 'construction';

export interface AcademyRiskPortfolioStoryVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('korelasyon-ne-anlatir')) return 'correlation';
  if (assetRef.includes('drawdown-nedir')) return 'drawdown';
  if (assetRef.includes('kaldirac-riski-nasil-buyutur')) return 'leverage';
  if (assetRef.includes('yogunlasma-riski-nedir')) return 'concentration';
  if (assetRef.includes('risk-butcesi-nedir')) return 'riskBudget';
  if (assetRef.includes('portfoy-nasil-kurulur')) return 'construction';
  return undefined;
}

export function isAcademyRiskPortfolioStoryAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function AcademyRiskPortfolioStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: AcademyRiskPortfolioStoryVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';
  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {topic === 'correlation' ? <Correlation role={role} tr={tr} styles={styles} /> : null}
      {topic === 'drawdown' ? <Drawdown role={role} tr={tr} styles={styles} /> : null}
      {topic === 'leverage' ? <Leverage role={role} tr={tr} styles={styles} /> : null}
      {topic === 'concentration' ? <Concentration role={role} tr={tr} styles={styles} /> : null}
      {topic === 'riskBudget' ? <RiskBudget role={role} tr={tr} styles={styles} /> : null}
      {topic === 'construction' ? <Construction role={role} tr={tr} styles={styles} /> : null}
    </View>
  );
}

type SceneProps = { role: LessonSupportingVisualRole; tr: boolean; styles: ReturnType<typeof createStyles> };

function Head({ title, detail, styles }: { title: string; detail: string; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.head}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>;
}

function Correlation({ role, tr, styles }: SceneProps) {
  const together = role !== 'misconception' && role !== 'risk';
  const title = role === 'hook'
    ? tr ? 'Farklı isim, aynı hareket?' : 'Different names, same movement?'
    : role === 'summary'
      ? tr ? 'Birlikte hareket = ortak risk ihtimali' : 'Moving together = possible shared risk'
      : role === 'misconception'
        ? tr ? 'İsimlerin farklı olması yetmez' : 'Different names are not enough'
        : tr ? 'Bazı yatırımlar birlikte hareket eder' : 'Some investments move together';
  return (
    <View style={styles.story}>
      <Head title={title} detail={tr ? 'Çeşitlendirme için kötü günde nasıl davrandıklarına da bak.' : 'For diversification, also watch how they behave on bad days.'} styles={styles} />
      <View style={styles.pathPair}>
        <View style={styles.pathCard}><Text style={styles.pathLabel}>A</Text><Text style={styles.pathText}>↗  ↘  ↗  ↗</Text></View>
        <View style={styles.pathCard}><Text style={styles.pathLabel}>B</Text><Text style={[styles.pathText, together ? styles.samePath : styles.diffPath]}>{together ? '↗  ↘  ↗  ↗' : '↘  ↗  ↘  ↗'}</Text></View>
      </View>
      <Text style={styles.caption}>{together ? (tr ? 'çoğu zaman birlikte' : 'often together') : (tr ? 'ilişki zamanla değişebilir' : 'the relationship can change')}</Text>
    </View>
  );
}

function Drawdown({ role, tr, styles }: SceneProps) {
  const deep = role === 'misconception' || role === 'risk';
  const title = role === 'hook'
    ? tr ? 'Sonuç aynı, yol aynı mı?' : 'Same ending, same journey?'
    : role === 'summary'
      ? tr ? 'Zirveden ne kadar geriledin?' : 'How far did you fall from the peak?'
      : tr ? '100 → 70 → toparlanma' : '100 → 70 → recovery';
  return (
    <View style={styles.story}>
      <Head title={title} detail={tr ? 'Aradaki büyük düşüş, son sonuç toparlansa bile önemlidir.' : 'A large decline matters even if the ending result recovers.'} styles={styles} />
      <View style={styles.drawScene}>
        <Point label={tr ? 'ZİRVE' : 'PEAK'} value="100" styles={styles} />
        <Text style={styles.downArrow}>↘</Text>
        <Point label={tr ? 'DİP' : 'LOW'} value={deep ? '60' : '70'} styles={styles} warn />
        <Text style={styles.upArrow}>↗</Text>
        <Point label={tr ? 'SONRA' : 'LATER'} value="100" styles={styles} />
      </View>
      <Text style={styles.caption}>{deep ? (tr ? 'Büyük düşüşü son fiyat gizleyebilir.' : 'The ending price can hide a large decline.') : (tr ? 'Zirve → dip mesafesi = drawdown' : 'Peak → low distance = drawdown')}</Text>
    </View>
  );
}

function Point({ label, value, styles, warn = false }: { label: string; value: string; styles: ReturnType<typeof createStyles>; warn?: boolean }) {
  return <View style={[styles.point, warn && styles.pointWarn]}><Text style={styles.pointLabel}>{label}</Text><Text style={[styles.pointValue, warn && styles.warn]}>{value}</Text></View>;
}

function Leverage({ role, tr, styles }: SceneProps) {
  const loss = role === 'misconception' || role === 'risk';
  const title = role === 'hook'
    ? tr ? 'Aynı hareket, farklı hesap etkisi' : 'Same move, different account impact'
    : role === 'summary'
      ? tr ? 'Kaldıraç hareketi büyütür' : 'Leverage amplifies the move'
      : tr ? '1× ve 3× aynı değildir' : '1× and 3× are not the same';
  return (
    <View style={styles.story}>
      <Head title={title} detail={tr ? 'Kaldıraç yönü seçmez; olumlu veya olumsuz etkiyi büyütebilir.' : 'Leverage does not choose direction; it can amplify positive or negative impact.'} styles={styles} />
      <View style={styles.dual}>
        <View style={styles.metricCard}><Text style={styles.metricTitle}>1×</Text><Text style={styles.metricSub}>{tr ? 'FİYAT' : 'PRICE'} {loss ? '−5%' : '+5%'}</Text><Text style={styles.metricValue}>{tr ? 'HESAP' : 'ACCOUNT'} {loss ? '−5%' : '+5%'}</Text></View>
        <View style={[styles.metricCard, styles.metricCardAccent]}><Text style={styles.metricTitle}>3×</Text><Text style={styles.metricSub}>{tr ? 'FİYAT' : 'PRICE'} {loss ? '−5%' : '+5%'}</Text><Text style={[styles.metricValue, loss && styles.warn]}>{tr ? 'HESAP' : 'ACCOUNT'} {loss ? '−15%' : '+15%'}</Text></View>
      </View>
    </View>
  );
}

function Concentration({ role, tr, styles }: SceneProps) {
  const hidden = role === 'misconception' || role === 'risk';
  const title = role === 'hook'
    ? tr ? '6 yatırım var; risk kaç farklı yerde?' : 'Six investments; how many different risks?'
    : role === 'summary'
      ? tr ? 'İsim sayısı ≠ risk çeşitliliği' : 'Name count ≠ risk diversity'
      : tr ? 'Aynı kaynağa bağlı olabilirler' : 'They may depend on the same source';
  return (
    <View style={styles.story}>
      <Head title={title} detail={tr ? 'Farklı görünen yatırımlar aynı ekonomik olaydan etkilenebilir.' : 'Investments that look different can be exposed to the same economic event.'} styles={styles} />
      <View style={styles.holdings}>{['A','B','C','D','E','F'].map((x) => <View key={x} style={styles.holding}><Text style={styles.holdingText}>{x}</Text></View>)}</View>
      <Text style={styles.centerArrow}>↓</Text>
      {hidden ? (
        <View style={styles.oneFactor}><Text style={styles.factorText}>{tr ? 'TEK ORTAK RİSK' : 'ONE SHARED RISK'}</Text></View>
      ) : (
        <View style={styles.factorRow}><View style={styles.factor}><Text style={styles.factorText}>1</Text></View><View style={styles.factor}><Text style={styles.factorText}>2</Text></View><View style={styles.factor}><Text style={styles.factorText}>3</Text></View></View>
      )}
    </View>
  );
}

function RiskBudget({ role, tr, styles }: SceneProps) {
  const question = role === 'hook' || role === 'misconception';
  const title = role === 'hook'
    ? tr ? '50/50 para = 50/50 risk mi?' : '50/50 money = 50/50 risk?'
    : role === 'summary'
      ? tr ? 'Paranın değil, riskin nerede olduğunu gör' : 'See where the risk is, not just the money'
      : tr ? 'Eşit para, eşit risk olmayabilir' : 'Equal money may not mean equal risk';
  return (
    <View style={styles.story}>
      <Head title={title} detail={tr ? 'Daha hareketli yatırım toplam riske daha fazla katkı yapabilir.' : 'The more volatile investment can contribute more of the total risk.'} styles={styles} />
      <View style={styles.budgetRows}>
        <View style={styles.budgetRow}><Text style={styles.budgetLabel}>{tr ? 'PARA' : 'MONEY'}</Text><Bar value="50%" width="50%" styles={styles} /><Bar value="50%" width="50%" styles={styles} muted /></View>
        <View style={styles.budgetRow}><Text style={styles.budgetLabel}>{tr ? 'RİSK' : 'RISK'}</Text><Bar value={question ? '50%?' : '75%'} width={question ? '50%' : '75%'} styles={styles} warn /><Bar value={question ? '50%?' : '25%'} width={question ? '50%' : '25%'} styles={styles} muted /></View>
      </View>
    </View>
  );
}

function Bar({ value, width, styles, muted = false, warn = false }: { value: string; width: `${number}%`; styles: ReturnType<typeof createStyles>; muted?: boolean; warn?: boolean }) {
  return <View style={[styles.bar, { width }, muted && styles.barMuted, warn && styles.barWarn]}><Text style={styles.barText}>{value}</Text></View>;
}

function Construction({ role, tr, styles }: SceneProps) {
  const title = role === 'hook'
    ? tr ? 'İlk soru “ne alayım?” değil' : 'The first question is not “what should I buy?”'
    : role === 'summary'
      ? tr ? 'Amaçtan başla, sonra dağıt' : 'Start with the goal, then allocate'
      : tr ? 'Portföy bir planın sonucudur' : 'A portfolio is the result of a plan';
  const nodes = tr ? ['AMAÇ', 'SINIR', 'DAĞILIM', 'KONTROL'] : ['GOAL', 'LIMITS', 'ALLOCATE', 'REVIEW'];
  return (
    <View style={styles.story}>
      <Head title={title} detail={tr ? 'Zaman, nakit ihtiyacı ve kabul edilebilir kayıp seçimden önce gelir.' : 'Time horizon, liquidity needs, and acceptable loss come before product selection.'} styles={styles} />
      <View style={styles.planRow}>
        {nodes.map((node, index) => <React.Fragment key={node}><View style={[styles.planNode, index === 0 && styles.planNodeAccent]}><Text style={styles.planText}>{node}</Text></View>{index < nodes.length - 1 ? <Text style={styles.planArrow}>→</Text> : null}</React.Fragment>)}
      </View>
      {role === 'misconception' ? <Text style={styles.caption}>{tr ? 'Popüler ürün → sonra gerekçe kurmak ters sıradır.' : 'Popular product → inventing a reason later is the wrong order.'}</Text> : null}
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { width: '100%', minHeight: 238, justifyContent: 'center', borderRadius: 20, borderWidth: 1, borderColor: '#24465C', backgroundColor: '#081725', padding: 16 },
  story: { gap: 18 },
  head: { gap: 5 },
  title: { color: theme.colors.text, fontSize: 18, lineHeight: 23, fontWeight: '900' },
  detail: { color: '#94A8B6', fontSize: 12, lineHeight: 17 },
  caption: { color: '#92A7B5', fontSize: 10, lineHeight: 15, textAlign: 'center', fontWeight: '700' },
  pathPair: { gap: 9, padding: 10, borderRadius: 15, borderWidth: 1, borderColor: '#29495E', backgroundColor: '#0E2030' },
  pathCard: { flexDirection: 'row', alignItems: 'center', gap: 15, minHeight: 45, paddingHorizontal: 12, borderRadius: 11, backgroundColor: '#142B3D' },
  pathLabel: { width: 20, color: '#E8EFF3', fontSize: 12, fontWeight: '900' },
  pathText: { color: '#5EEAD4', fontSize: 17, fontWeight: '900', letterSpacing: 3 },
  samePath: { color: '#5EEAD4' }, diffPath: { color: '#EAB77B' },
  drawScene: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  point: { minWidth: 67, minHeight: 70, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 14, borderWidth: 1, borderColor: '#2C5C63', backgroundColor: '#102D36' },
  pointWarn: { borderColor: '#745A3E', backgroundColor: '#29231C' },
  pointLabel: { color: '#9EB1BD', fontSize: 8, fontWeight: '900' },
  pointValue: { color: '#5EEAD4', fontSize: 20, fontWeight: '900' },
  warn: { color: '#EAB77B' },
  downArrow: { color: '#EAB77B', fontSize: 25, fontWeight: '900' }, upArrow: { color: '#5EEAD4', fontSize: 25, fontWeight: '900' },
  dual: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, minHeight: 105, padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#29495E', backgroundColor: '#0F2131', gap: 7 },
  metricCardAccent: { borderColor: '#327A71', backgroundColor: '#0E3033' },
  metricTitle: { color: '#F0F5F7', fontSize: 17, fontWeight: '900' },
  metricSub: { color: '#9CB0BC', fontSize: 10, fontWeight: '800' }, metricValue: { color: '#5EEAD4', fontSize: 11, fontWeight: '900' },
  holdings: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  holding: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2B4D61', backgroundColor: '#112637' },
  holdingText: { color: '#DDE7EC', fontSize: 10, fontWeight: '900' },
  centerArrow: { color: '#5EEAD4', fontSize: 20, textAlign: 'center', fontWeight: '900' },
  oneFactor: { alignSelf: 'center', minWidth: 158, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 13, borderWidth: 1, borderColor: '#765B3E', backgroundColor: '#29231C' },
  factorRow: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  factor: { width: 48, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2E746C', backgroundColor: '#0E3033' },
  factorText: { color: '#DDE7EC', fontSize: 9, fontWeight: '900', textAlign: 'center' },
  budgetRows: { gap: 13 }, budgetRow: { flexDirection: 'row', alignItems: 'center', gap: 5 }, budgetLabel: { width: 38, color: '#8FA5B4', fontSize: 8, fontWeight: '900' },
  bar: { minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#1A5B59', borderWidth: 1, borderColor: '#2F8076' }, barMuted: { backgroundColor: '#24384A', borderColor: '#36526A' }, barWarn: { backgroundColor: '#493525', borderColor: '#775C3F' }, barText: { color: '#F0F5F7', fontSize: 10, fontWeight: '900' },
  planRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 6 },
  planNode: { minWidth: 57, minHeight: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#29495E', backgroundColor: '#102235', paddingHorizontal: 7 },
  planNodeAccent: { borderColor: '#2F8076', backgroundColor: '#0F3335' }, planText: { color: '#DCE7EC', fontSize: 8, fontWeight: '900' }, planArrow: { color: '#5EEAD4', fontSize: 16, fontWeight: '900' },
});
