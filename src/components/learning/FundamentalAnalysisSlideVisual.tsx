import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'statements' | 'income' | 'balance' | 'cashFlow' | 'profitability' | 'debtLiquidity';

export interface FundamentalAnalysisSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('finansal-tablolar-birlikte-ne-anlatir')) return 'statements';
  if (assetRef.includes('gelir-tablosu-nasil-okunur')) return 'income';
  if (assetRef.includes('bilanco-ne-anlatir')) return 'balance';
  if (assetRef.includes('nakit-akisi-neden-farklidir')) return 'cashFlow';
  if (assetRef.includes('marjlar-ne-anlatir')) return 'profitability';
  if (assetRef.includes('borc-ve-likidite-nasil-okunur')) return 'debtLiquidity';
  return undefined;
}

export function isFundamentalAnalysisSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function FundamentalAnalysisSlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: FundamentalAnalysisSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';
  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'statements' ? <StatementsScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'income' ? <IncomeScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'balance' ? <BalanceScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'cashFlow' ? <CashFlowScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'profitability' ? <ProfitabilityScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'debtLiquidity' ? <DebtScene role={role} tr={tr} styles={styles} /> : null}
      </View>
    </View>
  );
}

type SceneProps = { role: SlideRole; tr: boolean; styles: ReturnType<typeof createStyles> };
const Header = ({ styles, title, detail }: { styles: ReturnType<typeof createStyles>; title: string; detail: string }) => <View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>;
const Rule = ({ styles, title, detail, warning = false }: { styles: ReturnType<typeof createStyles>; title: string; detail: string; warning?: boolean }) => <View style={[styles.rule, warning && styles.ruleWarning]}><Text style={[styles.ruleTitle, warning && styles.warning]}>{title}</Text><Text style={styles.ruleDetail}>{detail}</Text></View>;
const Card = ({ styles, label, value, tone = 'neutral' }: { styles: ReturnType<typeof createStyles>; label: string; value: string; tone?: 'neutral' | 'success' | 'warning' | 'risk' }) => <View style={styles.card}><Text style={styles.cardLabel}>{label}</Text><Text style={[styles.cardValue, tone === 'success' ? styles.success : tone === 'warning' ? styles.warning : tone === 'risk' ? styles.risk : undefined]}>{value}</Text></View>;

function StatementsScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Kâr = nakit mi?' : 'Profit = cash?'} detail={tr ? 'Aynı şirketin üç farklı resmi vardır.' : 'The same company has three different financial views.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'KÂR' : 'PROFIT'} value="+24" tone="success" /><Text style={styles.notEqual}>≠</Text><Card styles={styles} label={tr ? 'NAKİT' : 'CASH'} value="+7" tone="warning" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Üç tablo · üç soru' : 'Three statements · three questions'} detail={tr ? 'Performans · konum · para hareketi' : 'Performance · position · cash movement'} /><View style={styles.three}><Card styles={styles} label={tr ? 'GELİR TABLOSU' : 'INCOME'} value={tr ? 'DÖNEM' : 'PERIOD'} /><Card styles={styles} label={tr ? 'BİLANÇO' : 'BALANCE'} value={tr ? 'AN' : 'POINT'} /><Card styles={styles} label={tr ? 'NAKİT AKIŞI' : 'CASH FLOW'} value={tr ? 'HAREKET' : 'MOVEMENT'} /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Kâr var, nakit yok?' : 'Profit without cash?'} detail={tr ? 'Alacak, stok veya finansman akışını kontrol et.' : 'Check receivables, inventory, or financing flows.'} /><View style={styles.flow}><Card styles={styles} label={tr ? 'NET KÂR' : 'NET INCOME'} value="+" tone="success" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'İŞL. NAKİT' : 'OPERATING CASH'} value="−" tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'TEK TABLO ≠ TAM RESİM' : 'ONE STATEMENT ≠ FULL PICTURE'} detail={tr ? 'Net kâr tek başına finansal sağlığı anlatmaz.' : 'Net income alone does not describe financial health.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'TABLOLARI BAĞLA' : 'CONNECT THE STATEMENTS'} detail={tr ? 'Kâr, varlık, borç ve nakdin birbirine nasıl dönüştüğünü izle.' : 'Track how profit, assets, debt, and cash connect.'} />;
  return <Rule styles={styles} title={tr ? 'PERFORMANS + KONUM + NAKİT' : 'PERFORMANCE + POSITION + CASH'} detail={tr ? 'Temel resim üçü birlikte oluşur.' : 'The fundamental picture comes from all three.'} />;
}

function IncomeScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Satış ↑ ama kâr ↓ olabilir mi?' : 'Sales ↑ while profit ↓?'} detail={tr ? 'Maliyet ve giderler daha hızlı artabilir.' : 'Costs and expenses can rise faster.'} /><Waterfall styles={styles} values={[100, 64, 27, 11]} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Gelirden net kâra' : 'Revenue to net income'} detail={tr ? 'Her aşamada farklı maliyet çıkar.' : 'Different costs are deducted at each stage.'} /><Waterfall styles={styles} values={[100, 58, 24, 9]} labels /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Büyüme mi, baskı mı?' : 'Growth or pressure?'} detail={tr ? 'Gelir +15% · faaliyet kârı −6%' : 'Revenue +15% · operating profit −6%'} /><View style={styles.row}><Card styles={styles} label={tr ? 'GELİR' : 'REVENUE'} value="+15%" tone="success" /><Card styles={styles} label={tr ? 'FAALİYET KÂRI' : 'OPERATING PROFIT'} value="−6%" tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'GELİR BÜYÜMESİ ≠ KÂR BÜYÜMESİ' : 'REVENUE GROWTH ≠ PROFIT GROWTH'} detail={tr ? 'Maliyet ve giderlerin hızını da kontrol et.' : 'Check the pace of costs and expenses too.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'TEK SEFERLİK KALEMLER' : 'ONE-OFF ITEMS'} detail={tr ? 'Raporlanan kârın sürdürülebilir olup olmadığını ayır.' : 'Separate reported profit from sustainable profit.'} />;
  return <Rule styles={styles} title={tr ? 'GELİR → MALİYET → FAALİYET → NET KÂR' : 'REVENUE → COSTS → OPERATING → NET INCOME'} detail={tr ? 'Kârın nerede değiştiğini izle.' : 'Track where profit changes.'} />;
}

function BalanceScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Çok varlık = güçlü bilanço?' : 'Many assets = strong balance sheet?'} detail={tr ? 'Nasıl finanse edildiği de önemlidir.' : 'How they are financed matters too.'} /><BalanceScale styles={styles} assets={100} liabilities={78} /></>;
  if (role === 'concept') return <><Header styles={styles} title="ASSETS = LIABILITIES + EQUITY" detail={tr ? 'Varlıkların finansman kaynağını gösterir.' : 'Shows how assets are financed.'} /><BalanceScale styles={styles} assets={100} liabilities={62} labels /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Yakın vade baskısı' : 'Near-term pressure'} detail={tr ? 'Nakit 20 · kısa vadeli borç 80' : 'Cash 20 · short-term debt 80'} /><View style={styles.row}><Card styles={styles} label={tr ? 'NAKİT' : 'CASH'} value="20" tone="warning" /><Card styles={styles} label={tr ? 'KISA BORÇ' : 'SHORT DEBT'} value="80" tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'VARLIK TOPLAMI ≠ KALİTE' : 'TOTAL ASSETS ≠ QUALITY'} detail={tr ? 'Varlık kalitesi, vade ve borç yapısı da gerekir.' : 'Asset quality, maturity, and debt structure matter too.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'VADEYİ KONTROL ET' : 'CHECK MATURITIES'} detail={tr ? 'Toplam borç kadar ne zaman ödeneceği de önemlidir.' : 'When debt is due matters as much as the total.'} />;
  return <Rule styles={styles} title={tr ? 'NE VAR + NASIL FİNANSE EDİLDİ' : 'WHAT EXISTS + HOW IT IS FINANCED'} detail={tr ? 'Bilanço iki soruyu birlikte cevaplar.' : 'The balance sheet answers both.'} />;
}

function CashFlowScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Kârlı ama nakitsiz?' : 'Profitable but cash-poor?'} detail={tr ? 'Tahakkuk ile gerçek para hareketi farklı olabilir.' : 'Accrual profit and actual cash movement can differ.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'KÂR' : 'PROFIT'} value="+18" tone="success" /><Card styles={styles} label={tr ? 'İŞL. NAKİT' : 'OPERATING CASH'} value="−4" tone="risk" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Üç nakit kanalı' : 'Three cash channels'} detail={tr ? 'İşletme · yatırım · finansman' : 'Operating · investing · financing'} /><CashChannels styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Nakit nereye gitti?' : 'Where did cash go?'} detail={tr ? 'Stok ve alacak artışı işletme nakdini azaltabilir.' : 'Inventory and receivables can consume operating cash.'} /><View style={styles.flow}><Card styles={styles} label={tr ? 'ALACAK' : 'RECEIVABLES'} value="↑" tone="warning" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'NAKİT' : 'CASH'} value="↓" tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'NET KÂR ≠ NAKİT' : 'NET INCOME ≠ CASH'} detail={tr ? 'Muhasebe sonucu ile para hareketini ayır.' : 'Separate accounting result from cash movement.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'NAKİT DÖNÜŞÜMÜNÜ İZLE' : 'WATCH CASH CONVERSION'} detail={tr ? 'Kârın ne kadarının nakde dönüştüğünü sorgula.' : 'Ask how much reported profit converts into cash.'} />;
  return <Rule styles={styles} title={tr ? 'İŞLETME + YATIRIM + FİNANSMAN' : 'OPERATING + INVESTING + FINANCING'} detail={tr ? 'Nakit akışının üç ana bölümü.' : 'The three main sections of cash flow.'} />;
}

function ProfitabilityScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Aynı kâr, aynı kalite?' : 'Same profit, same quality?'} detail={tr ? 'Gelir büyüklüğü ve marj yapısı farklı olabilir.' : 'Revenue scale and margin structure can differ.'} /><View style={styles.row}><Card styles={styles} label="A" value="10 / 100" /><Card styles={styles} label="B" value="10 / 250" tone="warning" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? '100 gelirden ne kalıyor?' : 'What remains from 100 revenue?'} detail={tr ? 'Brüt · faaliyet · net marj' : 'Gross · operating · net margin'} /><MarginFunnel styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Marj baskısı' : 'Margin pressure'} detail={tr ? 'Gelir artıyor ama faaliyet marjı düşüyor.' : 'Revenue rises while operating margin falls.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'GELİR' : 'REVENUE'} value="↑" tone="success" /><Card styles={styles} label={tr ? 'MARJ' : 'MARGIN'} value="↓" tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'SEKTÖRLERİ HAM MARJLA KIYASLAMA' : 'DO NOT COMPARE INDUSTRIES BY RAW MARGIN'} detail={tr ? 'İş modelleri ve maliyet yapıları farklıdır.' : 'Business models and cost structures differ.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'SÜRDÜRÜLEBİLİRLİĞİ SOR' : 'ASK ABOUT SUSTAINABILITY'} detail={tr ? 'Tek çeyreklik yüksek marj kalıcı olmayabilir.' : 'One quarter of high margins may not persist.'} />;
  return <Rule styles={styles} title={tr ? 'MARJ = KÂR / GELİR' : 'MARGIN = PROFIT / REVENUE'} detail={tr ? 'Seviye kadar trend ve sektör de önemlidir.' : 'Trend and industry matter as much as level.'} />;
}

function DebtScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Yüksek borç = otomatik kötü?' : 'High debt = automatically bad?'} detail={tr ? 'Taşıma kapasitesi belirleyicidir.' : 'Debt-carrying capacity matters.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'BORÇ' : 'DEBT'} value="100" tone="warning" /><Card styles={styles} label={tr ? 'NAKİT ÜRETİMİ' : 'CASH GENERATION'} value="?" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Borç kapasitesi paneli' : 'Debt-capacity panel'} detail={tr ? 'Miktar · vade · faiz · nakit' : 'Amount · maturity · interest · cash'} /><View style={styles.grid}><Mini styles={styles} text={tr ? 'MİKTAR' : 'AMOUNT'} /><Mini styles={styles} text={tr ? 'VADE' : 'MATURITY'} /><Mini styles={styles} text={tr ? 'FAİZ' : 'INTEREST'} /><Mini styles={styles} text={tr ? 'NAKİT' : 'CASH'} /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Aynı borç · farklı risk' : 'Same debt · different risk'} detail={tr ? 'Nakit üretimi ve vade fark yaratır.' : 'Cash generation and maturity change the risk.'} /><View style={styles.row}><Card styles={styles} label="A" value={tr ? 'GÜÇLÜ NAKİT' : 'STRONG CASH'} tone="success" /><Card styles={styles} label="B" value={tr ? 'ZAYIF NAKİT' : 'WEAK CASH'} tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'BORÇ VAR = KÖTÜ DEĞİL' : 'DEBT EXISTS ≠ BAD'} detail={tr ? 'Aynı şekilde nakit var = güvenli de değildir.' : 'Likewise, cash exists ≠ automatically safe.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'REFINANSMAN RİSKİ' : 'REFINANCING RISK'} detail={tr ? 'Yakın vadeli borç ve yüksek faiz ortamını birlikte düşün.' : 'Consider near-term maturities with the interest-rate environment.'} />;
  return <Rule styles={styles} title={tr ? 'BORÇ + VADE + FAİZ + NAKİT' : 'DEBT + MATURITY + INTEREST + CASH'} detail={tr ? 'Borç riskinin temel çerçevesi.' : 'A basic debt-risk framework.'} />;
}

function Waterfall({ styles, values, labels = false }: { styles: ReturnType<typeof createStyles>; values: number[]; labels?: boolean }) {
  const names = ['REV', 'GROSS', 'OP', 'NET'];
  return <View style={styles.barRow}>{values.map((value, i) => <View key={i} style={styles.barWrap}><View style={[styles.bar, { height: Math.max(18, value) }]} />{labels ? <Text style={styles.barLabel}>{names[i]}</Text> : null}</View>)}</View>;
}
function BalanceScale({ styles, assets, liabilities, labels = false }: { styles: ReturnType<typeof createStyles>; assets: number; liabilities: number; labels?: boolean }) {
  return <View style={styles.row}><Card styles={styles} label={labels ? 'ASSETS' : 'A'} value={`${assets}`} tone="success" /><Text style={styles.equal}>=</Text><View style={styles.stack}><Card styles={styles} label={labels ? 'LIABILITIES' : 'L'} value={`${liabilities}`} tone="warning" /><Card styles={styles} label={labels ? 'EQUITY' : 'E'} value={`${assets - liabilities}`} /></View></View>;
}
function CashChannels({ styles }: { styles: ReturnType<typeof createStyles> }) { return <View style={styles.three}><Card styles={styles} label="OPERATING" value="↕" /><Card styles={styles} label="INVESTING" value="↕" /><Card styles={styles} label="FINANCING" value="↕" /></View>; }
function MarginFunnel({ styles }: { styles: ReturnType<typeof createStyles> }) { return <View style={styles.funnel}><View style={[styles.funnelBar, { width: '100%' }]}><Text style={styles.funnelText}>REVENUE 100</Text></View><View style={[styles.funnelBar, { width: '72%' }]}><Text style={styles.funnelText}>GROSS 72</Text></View><View style={[styles.funnelBar, { width: '38%' }]}><Text style={styles.funnelText}>OPERATING 38</Text></View><View style={[styles.funnelBar, { width: '22%' }]}><Text style={styles.funnelText}>NET 22</Text></View></View>; }
function Mini({ styles, text }: { styles: ReturnType<typeof createStyles>; text: string }) { return <View style={styles.mini}><Text style={styles.miniText}>{text}</Text></View>; }

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 14, padding: 14 },
  header: { gap: 4 }, title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' }, detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 }, three: { flexDirection: 'row', gap: 8 }, flow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, stack: { flex: 1, gap: 6 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: { flex: 1, minHeight: 78, justifyContent: 'center', gap: 6, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  cardLabel: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '900', letterSpacing: 0.4 }, cardValue: { color: theme.colors.text, fontSize: 13, fontWeight: '900' },
  rule: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(45,212,191,0.22)', backgroundColor: 'rgba(45,212,191,0.06)' },
  ruleWarning: { borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' }, ruleTitle: { color: theme.colors.primary, fontSize: 17, lineHeight: 22, fontWeight: '900', textAlign: 'center' }, ruleDetail: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  success: { color: theme.colors.success }, warning: { color: theme.colors.warning }, risk: { color: theme.colors.risk }, arrow: { color: theme.colors.textMuted, fontSize: 20, fontWeight: '900' }, notEqual: { color: theme.colors.warning, fontSize: 23, fontWeight: '900' }, equal: { color: theme.colors.textMuted, fontSize: 20, fontWeight: '900' },
  barRow: { minHeight: 112, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', gap: 9, padding: 10, borderRadius: 12, backgroundColor: theme.colors.surfaceMuted }, barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 }, bar: { width: '68%', maxWidth: 42, borderRadius: 6, backgroundColor: 'rgba(45,212,191,0.28)', borderWidth: 1, borderColor: 'rgba(45,212,191,0.45)' }, barLabel: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '900' },
  funnel: { alignItems: 'center', gap: 6 }, funnelBar: { minHeight: 26, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: 'rgba(45,212,191,0.16)', borderWidth: 1, borderColor: 'rgba(45,212,191,0.35)' }, funnelText: { color: theme.colors.text, fontSize: 9, fontWeight: '900' },
  mini: { width: '47%', minHeight: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted }, miniText: { color: theme.colors.text, fontSize: 9, fontWeight: '900' },
});
