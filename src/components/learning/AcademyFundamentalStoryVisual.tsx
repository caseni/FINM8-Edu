import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

type Topic = 'statements' | 'income' | 'balance' | 'cashFlow' | 'profitability' | 'debt';

export interface AcademyFundamentalStoryVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('finansal-tablolar-birlikte-ne-anlatir')) return 'statements';
  if (assetRef.includes('gelir-tablosu-nasil-okunur')) return 'income';
  if (assetRef.includes('bilanco-ne-anlatir')) return 'balance';
  if (assetRef.includes('nakit-akisi-neden-farklidir')) return 'cashFlow';
  if (assetRef.includes('marjlar-ne-anlatir')) return 'profitability';
  if (assetRef.includes('borc-ve-likidite-nasil-okunur')) return 'debt';
  return undefined;
}

export function isAcademyFundamentalStoryAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function AcademyFundamentalStoryVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: AcademyFundamentalStoryVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';
  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {topic === 'statements' ? <Statements role={role} tr={tr} styles={styles} /> : null}
      {topic === 'income' ? <Income role={role} tr={tr} styles={styles} /> : null}
      {topic === 'balance' ? <Balance role={role} tr={tr} styles={styles} /> : null}
      {topic === 'cashFlow' ? <CashFlow role={role} tr={tr} styles={styles} /> : null}
      {topic === 'profitability' ? <Profitability role={role} tr={tr} styles={styles} /> : null}
      {topic === 'debt' ? <Debt role={role} tr={tr} styles={styles} /> : null}
    </View>
  );
}

type SceneProps = { role: LessonSupportingVisualRole; tr: boolean; styles: ReturnType<typeof createStyles> };

function Head({ title, detail, styles }: { title: string; detail: string; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.head}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>;
}

function Box({ title, value, tone = 'plain', styles }: { title: string; value?: string; tone?: 'plain' | 'good' | 'warn'; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={[styles.box, tone === 'good' && styles.boxGood, tone === 'warn' && styles.boxWarn]}>
      <Text style={styles.boxTitle}>{title}</Text>
      {value ? <Text style={[styles.boxValue, tone === 'good' && styles.good, tone === 'warn' && styles.warn]}>{value}</Text> : null}
    </View>
  );
}

function Statements({ role, tr, styles }: SceneProps) {
  const title = role === 'hook'
    ? tr ? 'Kâr var diye kasada aynı para olmak zorunda değil' : 'Reported profit does not mean the same cash is in the bank'
    : role === 'misconception'
      ? tr ? 'Tek sayı bütün şirketi anlatmaz' : 'One number does not explain the whole company'
      : role === 'summary'
        ? tr ? 'Aynı şirket, üç farklı soru' : 'One company, three different questions'
        : tr ? 'Şirkete üç pencereden bak' : 'Look at the company through three windows';
  return (
    <View style={styles.story}>
      <Head title={title} detail={tr ? 'Kazanç, sahip oldukları ve gerçek para hareketi birlikte okunur.' : 'Read earnings, what it owns and owes, and actual cash movement together.'} styles={styles} />
      <View style={styles.threeRow}>
        <Box title={tr ? 'NE KAZANDI?' : 'WHAT DID IT EARN?'} value={tr ? 'Gelir tablosu' : 'Income statement'} styles={styles} />
        <Box title={tr ? 'NEYE SAHİP / BORÇLU?' : 'WHAT DOES IT OWN / OWE?'} value={tr ? 'Bilanço' : 'Balance sheet'} styles={styles} />
        <Box title={tr ? 'PARA NEREYE GİTTİ?' : 'WHERE DID CASH GO?'} value={tr ? 'Nakit akışı' : 'Cash flow'} styles={styles} />
      </View>
    </View>
  );
}

function Income({ role, tr, styles }: SceneProps) {
  const title = role === 'hook'
    ? tr ? 'Satış artabilir, kâr yine düşebilir' : 'Sales can rise while profit falls'
    : role === 'misconception'
      ? tr ? 'Daha çok satış ≠ otomatik daha çok kâr' : 'More sales ≠ automatically more profit'
      : role === 'summary'
        ? tr ? 'Satıştan sonra ne kadar kalıyor?' : 'How much remains after sales?'
        : tr ? 'Satış → maliyetler → kalan kâr' : 'Sales → costs → profit left';
  return (
    <View style={styles.story}>
      <Head title={title} detail={tr ? 'Maliyetler satıştan hızlı artarsa elde kalan azalabilir.' : 'If costs grow faster than sales, less can remain.'} styles={styles} />
      <View style={styles.flowRow}>
        <Box title={tr ? 'SATIŞ' : 'SALES'} value="100" tone="good" styles={styles} />
        <Text style={styles.arrow}>→</Text>
        <Box title={tr ? 'MALİYETLER' : 'COSTS'} value="70" tone="warn" styles={styles} />
        <Text style={styles.arrow}>→</Text>
        <Box title={tr ? 'KALAN' : 'LEFT'} value="30" styles={styles} />
      </View>
    </View>
  );
}

function Balance({ role, tr, styles }: SceneProps) {
  const title = role === 'hook'
    ? tr ? 'Çok şeye sahip olmak tek başına güçlü olmak değildir' : 'Owning many things does not automatically mean strength'
    : role === 'misconception'
      ? tr ? 'Varlık çok diye borcu unutma' : 'Do not ignore debt just because assets are large'
      : role === 'summary'
        ? tr ? 'İki tarafı birlikte gör' : 'See both sides together'
        : tr ? 'Ne var? Ne kadar borç var?' : 'What does it own? What does it owe?';
  return (
    <View style={styles.story}>
      <Head title={title} detail={tr ? 'Şirketin sahip oldukları ile yükümlülüklerini yan yana oku.' : 'Read what the company owns together with what it owes.'} styles={styles} />
      <View style={styles.dual}>
        <View style={styles.sidePanel}>
          <Text style={styles.sideTitle}>{tr ? 'SAHİP OLDUKLARI' : 'WHAT IT OWNS'}</Text>
          <Mini label={tr ? 'Nakit' : 'Cash'} styles={styles} />
          <Mini label={tr ? 'Stok' : 'Inventory'} styles={styles} />
          <Mini label={tr ? 'Ekipman' : 'Equipment'} styles={styles} />
        </View>
        <View style={styles.sidePanel}>
          <Text style={styles.sideTitle}>{tr ? 'ÖDEMESİ GEREKENLER' : 'WHAT IT OWES'}</Text>
          <Mini label={tr ? 'Banka borcu' : 'Bank debt'} styles={styles} warn />
          <Mini label={tr ? 'Tedarikçi' : 'Suppliers'} styles={styles} warn />
          <Mini label={tr ? 'Diğer borçlar' : 'Other obligations'} styles={styles} warn />
        </View>
      </View>
    </View>
  );
}

function Mini({ label, styles, warn = false }: { label: string; styles: ReturnType<typeof createStyles>; warn?: boolean }) {
  return <View style={[styles.mini, warn && styles.miniWarn]}><Text style={styles.miniText}>{label}</Text></View>;
}

function CashFlow({ role, tr, styles }: SceneProps) {
  const title = role === 'hook'
    ? tr ? 'Kârlı şirketin kasası yine azalabilir' : 'A profitable company can still lose cash'
    : role === 'misconception'
      ? tr ? 'Kâr ≠ kasadaki para' : 'Profit ≠ cash in the bank'
      : role === 'summary'
        ? tr ? 'Paranın gerçekten nereye gittiğini izle' : 'Track where the money actually went'
        : tr ? 'Para girer, para çıkar' : 'Cash comes in and cash goes out';
  return (
    <View style={styles.story}>
      <Head title={title} detail={tr ? 'Müşteri henüz ödememiş, stok alınmış veya yatırım yapılmış olabilir.' : 'Customers may not have paid yet, inventory may have been bought, or the company may have invested.'} styles={styles} />
      <View style={styles.cashScene}>
        <Box title={tr ? 'KÂR' : 'PROFIT'} value="+18" tone="good" styles={styles} />
        <Text style={styles.notEqual}>≠</Text>
        <Box title={tr ? 'KASADAKİ DEĞİŞİM' : 'CASH CHANGE'} value="−4" tone="warn" styles={styles} />
      </View>
      {role === 'practice' ? <Text style={styles.caption}>{tr ? 'Alacak ↑  ·  Stok ↑  ·  Yatırım ↑  →  Nakit azalabilir' : 'Receivables ↑ · Inventory ↑ · Investment ↑ → Cash can fall'}</Text> : null}
    </View>
  );
}

function Profitability({ role, tr, styles }: SceneProps) {
  const title = role === 'hook'
    ? tr ? 'Aynı kâr, farklı verimlilik' : 'Same profit, different efficiency'
    : role === 'misconception'
      ? tr ? 'Yüksek marj tek başına “iyi şirket” demek değildir' : 'A high margin alone does not mean “good company”'
      : role === 'summary'
        ? tr ? '100 lira satıştan ne kadar kalıyor?' : 'How much remains from 100 of sales?'
        : tr ? 'Kârı satışla birlikte düşün' : 'Think about profit together with sales';
  return (
    <View style={styles.story}>
      <Head title={title} detail={tr ? 'Satışın ne kadarının kâr olarak kaldığını gör.' : 'See how much of sales remains as profit.'} styles={styles} />
      <View style={styles.dual}>
        <View style={styles.marginPanel}><Text style={styles.marginTitle}>A</Text><Text style={styles.marginSales}>100 {tr ? 'satış' : 'sales'}</Text><View style={[styles.marginFill, { width: '70%' }]} /><Text style={styles.marginProfit}>10 {tr ? 'kâr' : 'profit'}</Text></View>
        <View style={styles.marginPanel}><Text style={styles.marginTitle}>B</Text><Text style={styles.marginSales}>250 {tr ? 'satış' : 'sales'}</Text><View style={[styles.marginFill, styles.marginFillMuted, { width: '28%' }]} /><Text style={styles.marginProfit}>10 {tr ? 'kâr' : 'profit'}</Text></View>
      </View>
    </View>
  );
}

function Debt({ role, tr, styles }: SceneProps) {
  const title = role === 'hook'
    ? tr ? 'Aynı borç, farklı baskı' : 'Same debt, different pressure'
    : role === 'misconception'
      ? tr ? 'Yalnız toplam borca bakma' : 'Do not look only at total debt'
      : role === 'summary'
        ? tr ? 'Ne kadar? Ne zaman? Karşılayacak para var mı?' : 'How much? When due? Is there cash to cover it?'
        : tr ? 'Borçta zamanlama da önemlidir' : 'Timing matters with debt';
  return (
    <View style={styles.story}>
      <Head title={title} detail={tr ? 'Yakında ödeme gerekirken kasada az para varsa baskı büyür.' : 'Pressure rises when a large payment is due soon and cash is low.'} styles={styles} />
      <View style={styles.dual}>
        <View style={styles.debtPanel}><Text style={styles.debtTitle}>{tr ? 'ŞİRKET A' : 'COMPANY A'}</Text><Text style={styles.debtLine}>{tr ? 'Nakit 80' : 'Cash 80'}</Text><Text style={styles.debtLine}>{tr ? 'Yakın ödeme 30' : 'Due soon 30'}</Text><Text style={styles.debtOkay}>{tr ? 'daha rahat' : 'more room'}</Text></View>
        <View style={[styles.debtPanel, styles.debtPanelWarn]}><Text style={styles.debtTitle}>{tr ? 'ŞİRKET B' : 'COMPANY B'}</Text><Text style={styles.debtLine}>{tr ? 'Nakit 20' : 'Cash 20'}</Text><Text style={styles.debtLine}>{tr ? 'Yakın ödeme 80' : 'Due soon 80'}</Text><Text style={styles.debtWarn}>{tr ? 'daha fazla baskı' : 'more pressure'}</Text></View>
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { width: '100%', minHeight: 240, justifyContent: 'center', borderRadius: 20, borderWidth: 1, borderColor: '#24465C', backgroundColor: '#081725', padding: 16 },
  story: { gap: 18 },
  head: { gap: 5 },
  title: { color: theme.colors.text, fontSize: 18, lineHeight: 23, fontWeight: '900' },
  detail: { color: '#94A8B6', fontSize: 12, lineHeight: 17 },
  threeRow: { flexDirection: 'row', gap: 7 },
  flowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  box: { flex: 1, minHeight: 78, borderRadius: 14, borderWidth: 1, borderColor: '#29495E', backgroundColor: '#102235', padding: 9, alignItems: 'center', justifyContent: 'center', gap: 5 },
  boxGood: { borderColor: '#2E756C', backgroundColor: '#0F3335' },
  boxWarn: { borderColor: '#745A3E', backgroundColor: '#2B241C' },
  boxTitle: { color: '#B6C5CF', fontSize: 8, lineHeight: 11, fontWeight: '900', textAlign: 'center' },
  boxValue: { color: '#F4F8FA', fontSize: 12, lineHeight: 15, fontWeight: '900', textAlign: 'center' },
  good: { color: '#5EEAD4' },
  warn: { color: '#EAB77B' },
  arrow: { color: '#56D8C7', fontSize: 20, fontWeight: '900' },
  notEqual: { color: '#7D93A5', fontSize: 22, fontWeight: '900' },
  dual: { flexDirection: 'row', gap: 10 },
  sidePanel: { flex: 1, gap: 7, minHeight: 136, padding: 10, borderRadius: 15, borderWidth: 1, borderColor: '#29495E', backgroundColor: '#0F2131' },
  sideTitle: { color: '#98B0BE', fontSize: 9, lineHeight: 12, fontWeight: '900', textAlign: 'center' },
  mini: { minHeight: 30, borderRadius: 9, backgroundColor: '#173248', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  miniWarn: { backgroundColor: '#30271D' },
  miniText: { color: '#CFDAE1', fontSize: 9, fontWeight: '800', textAlign: 'center' },
  cashScene: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  caption: { color: '#8FA6B4', fontSize: 10, lineHeight: 15, textAlign: 'center', fontWeight: '700' },
  marginPanel: { flex: 1, minHeight: 118, borderRadius: 15, borderWidth: 1, borderColor: '#29495E', backgroundColor: '#0F2131', padding: 11, gap: 8 },
  marginTitle: { color: '#5EEAD4', fontSize: 11, fontWeight: '900' },
  marginSales: { color: '#A8BBC7', fontSize: 10, fontWeight: '800' },
  marginFill: { height: 9, borderRadius: 6, backgroundColor: '#3ACAB8' },
  marginFillMuted: { backgroundColor: '#7890A1' },
  marginProfit: { color: '#E7EEF2', fontSize: 11, fontWeight: '900' },
  debtPanel: { flex: 1, minHeight: 128, borderRadius: 15, borderWidth: 1, borderColor: '#2D6E68', backgroundColor: '#0F3032', padding: 12, gap: 7 },
  debtPanelWarn: { borderColor: '#755A3E', backgroundColor: '#29231C' },
  debtTitle: { color: '#E6EEF2', fontSize: 10, fontWeight: '900' },
  debtLine: { color: '#A8BBC7', fontSize: 10, fontWeight: '700' },
  debtOkay: { marginTop: 'auto', color: '#5EEAD4', fontSize: 10, fontWeight: '900' },
  debtWarn: { marginTop: 'auto', color: '#EAB77B', fontSize: 10, fontWeight: '900' },
});
