import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'labor' | 'fiscal' | 'fx' | 'productivity' | 'indicators' | 'realNominal';

export interface EconomyExpansionSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('issizlik-verisi-ne-anlatir')) return 'labor';
  if (assetRef.includes('maliye-politikasi-nedir')) return 'fiscal';
  if (assetRef.includes('doviz-kuru-neden-degisir')) return 'fx';
  if (assetRef.includes('verimlilik-neden-onemlidir')) return 'productivity';
  if (assetRef.includes('ekonomik-veri-nasil-okunur')) return 'indicators';
  if (assetRef.includes('reel-ve-nominal-farki')) return 'realNominal';
  return undefined;
}

export function isEconomyExpansionSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function EconomyExpansionSlideVisual({
  assetRef,
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: EconomyExpansionSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'labor' ? <LaborScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'fiscal' ? <FiscalScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'fx' ? <FxScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'productivity' ? <ProductivityScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'indicators' ? <IndicatorsScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'realNominal' ? <RealNominalScene role={role} tr={tr} styles={styles} /> : null}
      </View>
    </View>
  );
}

type SceneProps = { role: SlideRole; tr: boolean; styles: ReturnType<typeof createStyles> };

function Header({ styles, title, detail }: { styles: ReturnType<typeof createStyles>; title: string; detail: string }) {
  return <View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>;
}

function Card({ styles, label, value, tone = 'neutral' }: { styles: ReturnType<typeof createStyles>; label: string; value: string; tone?: 'neutral' | 'success' | 'warning' | 'risk' }) {
  return <View style={styles.card}><Text style={styles.cardLabel}>{label}</Text><Text style={[styles.cardValue, tone === 'success' ? styles.success : tone === 'warning' ? styles.warning : tone === 'risk' ? styles.risk : undefined]}>{value}</Text></View>;
}

function Rule({ styles, title, detail, warning = false }: { styles: ReturnType<typeof createStyles>; title: string; detail: string; warning?: boolean }) {
  return <View style={[styles.rule, warning && styles.ruleWarning]}><Text style={[styles.ruleTitle, warning && styles.warning]}>{title}</Text><Text style={styles.ruleDetail}>{detail}</Text></View>;
}

function LaborScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'İşsizlik düştü = herkes iş buldu?' : 'Unemployment fell = everyone found work?'} detail={tr ? 'Katılım değişirse oran farklı bir hikâye anlatabilir.' : 'A change in participation can tell a different story.'} /><LaborGroups styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Üç grubu ayır' : 'Separate three groups'} detail={tr ? 'İstihdam · İşsiz · İşgücü dışında' : 'Employed · Unemployed · Outside labor force'} /><LaborGroups styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'İşsizlik ↓, istihdam ↓ ise?' : 'Unemployment ↓, employment ↓?'} detail={tr ? 'Katılım oranını kontrol et.' : 'Check participation.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'İŞSİZLİK' : 'UNEMP.'} value="↓" tone="success" /><Card styles={styles} label={tr ? 'İSTİHDAM' : 'EMPLOY.'} value="↓" tone="warning" /><Card styles={styles} label={tr ? 'KATILIM' : 'PARTICIP.'} value="?" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'İŞSİZLİK ↓ ≠ OTOMATİK İSTİHDAM ↑' : 'UNEMPLOYMENT ↓ ≠ AUTOMATIC EMPLOYMENT ↑'} detail={tr ? 'İşgücünden çıkış oranı da düşürebilir.' : 'Leaving the labor force can also lower the rate.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'TEK İŞGÜCÜ GÖSTERGESİNE BAĞLANMA' : 'DO NOT RELY ON ONE LABOR INDICATOR'} detail={tr ? 'İstihdam, katılım, ücret ve çalışma saatleri ek bağlam sağlar.' : 'Employment, participation, wages, and hours add context.'} />;
  return <LaborGroups styles={styles} />;
}

function FiscalScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Ekonomiyi yalnız faiz mi etkiler?' : 'Do only interest rates affect the economy?'} detail={tr ? 'Vergiler ve kamu harcamaları da talebi etkileyebilir.' : 'Taxes and public spending can also influence demand.'} /><FiscalFlow styles={styles} tr={tr} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Maliye politikasının iki ana kolu' : 'Two main fiscal-policy levers'} detail={tr ? 'Kamu harcaması · Vergiler' : 'Government spending · Taxes'} /><View style={styles.row}><Card styles={styles} label={tr ? 'HARCAMA' : 'SPENDING'} value="↕" /><Card styles={styles} label={tr ? 'VERGİ' : 'TAX'} value="↕" /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Aynı bütçe adımı, farklı ortam' : 'Same fiscal step, different environment'} detail={tr ? 'Ekonomik boşluk ve finansman etkisini değiştirebilir.' : 'Economic slack and financing can change the effect.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'ZAYIF TALEP' : 'WEAK DEMAND'} value={tr ? 'ETKİ A' : 'EFFECT A'} tone="success" /><Card styles={styles} label={tr ? 'KAPASİTE DOLU' : 'FULL CAPACITY'} value={tr ? 'ETKİ B' : 'EFFECT B'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'HER HARCAMA = AYNI ETKİ ✕' : 'EVERY SPENDING ITEM = SAME EFFECT ✕'} detail={tr ? 'Harcamanın türü ve ekonomik koşul önemlidir.' : 'Spending composition and economic conditions matter.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'MALİYE ≠ PARA POLİTİKASI' : 'FISCAL ≠ MONETARY POLICY'} detail={tr ? 'Kurumları, araçları ve aktarım kanalları farklıdır.' : 'Institutions, tools, and transmission channels differ.'} />;
  return <FiscalFlow styles={styles} tr={tr} />;
}

function FxScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Para “güçlü” ama neye göre?' : 'A currency is “strong” relative to what?'} detail={tr ? 'Kur her zaman iki para arasındaki göreli fiyattır.' : 'An exchange rate is always a relative price.'} /><FxBalance styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Kur = Para A / Para B' : 'FX = Currency A / Currency B'} detail={tr ? 'Birinin değerlenmesi diğerine göredir.' : 'Appreciation is always relative to the other currency.'} /><FxBalance styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title="EUR/USD ↑" detail={tr ? 'Euro dolar karşısında göreli olarak güçlenir.' : 'The euro strengthens relative to the dollar.'} /><View style={styles.row}><Card styles={styles} label="EUR" value="↑" tone="success" /><Card styles={styles} label="USD" value={tr ? 'GÖRELİ' : 'RELATIVE'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'KUR = TEK FAKTÖR ✕' : 'FX = ONE FACTOR ✕'} detail={tr ? 'Faiz, enflasyon, risk ve sermaye akımları birlikte rol oynayabilir.' : 'Rates, inflation, risk, and capital flows can all matter.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'GÜÇLÜ PARA HERKES İÇİN AYNI SONUÇ DEĞİL' : 'STRONGER CURRENCY ≠ SAME EFFECT FOR EVERYONE'} detail={tr ? 'İthalatçı, ihracatçı ve borçlunun etkisi farklı olabilir.' : 'Importers, exporters, and borrowers can be affected differently.'} />;
  return <FxBalance styles={styles} />;
}

function ProductivityScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Aynı kaynakla daha fazla çıktı' : 'More output from the same inputs'} detail={tr ? 'Verimlilik artışının temel fikri budur.' : 'That is the core idea of productivity growth.'} /><ProductivityCompare styles={styles} tr={tr} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Çıktı / Girdi' : 'Output / Input'} detail={tr ? 'Aynı emek ve sermayeyle daha fazla değer üretmek.' : 'Producing more value with the same labor and capital.'} /><ProductivityCompare styles={styles} tr={tr} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Daha uzun çalışmak mı, daha verimli çalışmak mı?' : 'Work longer or work more productively?'} detail={tr ? 'Girdi artışı ile girdi başına çıktı artışını ayır.' : 'Separate more input from more output per input.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'SAAT' : 'HOURS'} value="2×" tone="warning" /><Card styles={styles} label={tr ? 'ÇIKTI/SAAT' : 'OUTPUT/HOUR'} value="↑" tone="success" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'DAHA ÇOK GİRDİ ≠ DAHA YÜKSEK VERİMLİLİK' : 'MORE INPUT ≠ HIGHER PRODUCTIVITY'} detail={tr ? 'Önemli olan girdi başına üretimdir.' : 'What matters is output per unit of input.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'KISA DÖNEM ÖLÇÜMÜ DÖNGÜDEN ETKİLENEBİLİR' : 'SHORT-RUN MEASURES CAN BE CYCLICAL'} detail={tr ? 'Kapasite kullanımı ve sektör yapısı ölçümü oynatabilir.' : 'Capacity use and sector mix can move the measure.'} />;
  return <ProductivityCompare styles={styles} tr={tr} />;
}

function IndicatorsScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? '“İyi veri” neden piyasayı düşürebilir?' : 'Why can “good data” move markets down?'} detail={tr ? 'Piyasa sayıyı beklentiyle karşılaştırır.' : 'Markets compare the number with expectations.'} /><ReleaseCard styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Dört değeri birlikte oku' : 'Read four values together'} detail={tr ? 'Gerçekleşen · Beklenti · Önceki · Revize' : 'Actual · Expected · Previous · Revised'} /><ReleaseCard styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Başlık değil sürpriz önemli olabilir' : 'The surprise can matter more than the headline'} detail={tr ? 'Gerçekleşen − beklenti farkını ve revizyonu kontrol et.' : 'Check actual vs expected and any revision.'} /><View style={styles.row}><Card styles={styles} label="ACTUAL" value="3.2" /><Card styles={styles} label="EXPECTED" value="2.8" tone="warning" /><Card styles={styles} label="REVISED" value="2.5→2.7" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'TEK SAYI = “İYİ/KÖTÜ” ✕' : 'ONE NUMBER = “GOOD/BAD” ✕'} detail={tr ? 'Dönem, baz, beklenti ve revizyon bağlamı gerekir.' : 'Period, base, expectations, and revisions matter.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'VERİ AÇIKLAMASI ≠ OTOMATİK İŞLEM SİNYALİ' : 'DATA RELEASE ≠ AUTOMATIC TRADE SIGNAL'} detail={tr ? 'Konumlanma ve eşzamanlı veriler piyasa tepkisini değiştirebilir.' : 'Positioning and simultaneous releases can change the reaction.'} />;
  return <ReleaseCard styles={styles} />;
}

function RealNominalScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Maaş +%10, fiyatlar +%15' : 'Salary +10%, prices +15%'} detail={tr ? 'Nominal artış reel satın alma gücü artışı olmayabilir.' : 'A nominal gain may not be a real purchasing-power gain.'} /><RealNominalCompare styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Nominal ≠ Reel' : 'Nominal ≠ Real'} detail={tr ? 'Reel ölçüm fiyat düzeyindeki değişimi ayırmaya çalışır.' : 'Real measures seek to adjust for changes in the price level.'} /><RealNominalCompare styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Pozitif nominal, negatif reel mümkün' : 'Positive nominal, negative real is possible'} detail={tr ? 'Enflasyon nominal artıştan yüksek olabilir.' : 'Inflation can exceed the nominal gain.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'NOMİNAL' : 'NOMINAL'} value="+8%" tone="success" /><Card styles={styles} label={tr ? 'ENFLASYON' : 'INFLATION'} value="+10%" tone="warning" /><Card styles={styles} label={tr ? 'REEL' : 'REAL'} value="<0" tone="risk" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'PARA MİKTARI ↑ ≠ SATIN ALMA GÜCÜ ↑' : 'MONEY AMOUNT ↑ ≠ PURCHASING POWER ↑'} detail={tr ? 'Fiyat düzeyindeki değişimi hesaba kat.' : 'Account for changes in the price level.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'REEL HESAP ÖLÇÜME BAĞLIDIR' : 'REAL MEASURES DEPEND ON THE DEFLATOR'} detail={tr ? 'Kullanılan enflasyon/deflatör seçimi sonucu etkileyebilir.' : 'The inflation measure or deflator can affect the result.'} />;
  return <RealNominalCompare styles={styles} />;
}

function LaborGroups({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.row}><Card styles={styles} label="EMPLOYED" value="●●●●" tone="success" /><Card styles={styles} label="UNEMPLOYED" value="●" tone="warning" /><Card styles={styles} label="OUTSIDE" value="○○" /></View>;
}

function FiscalFlow({ styles, tr }: { styles: ReturnType<typeof createStyles>; tr: boolean }) {
  return <View style={styles.flow}><Card styles={styles} label={tr ? 'VERGİ' : 'TAX'} value="↕" /><Text style={styles.arrow}>+</Text><Card styles={styles} label={tr ? 'HARCAMA' : 'SPEND'} value="↕" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'TALEP' : 'DEMAND'} value="↕" /></View>;
}

function FxBalance({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.fxBalance}><View style={styles.currency}><Text style={styles.currencyText}>EUR</Text></View><View style={styles.balanceLine}><Text style={styles.balanceText}>1.10</Text></View><View style={styles.currency}><Text style={styles.currencyText}>USD</Text></View></View>;
}

function ProductivityCompare({ styles, tr }: { styles: ReturnType<typeof createStyles>; tr: boolean }) {
  return <View style={styles.row}><View style={styles.productionCard}><Text style={styles.cardLabel}>{tr ? 'AYNI GİRDİ' : 'SAME INPUT'}</Text><Text style={styles.inputs}>● ● ●</Text><Text style={styles.outputs}>■■</Text></View><Text style={styles.arrow}>→</Text><View style={styles.productionCard}><Text style={styles.cardLabel}>{tr ? 'AYNI GİRDİ' : 'SAME INPUT'}</Text><Text style={styles.inputs}>● ● ●</Text><Text style={[styles.outputs, styles.success]}>■■■■</Text></View></View>;
}

function ReleaseCard({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.release}><View style={styles.releaseRow}><Text style={styles.releaseLabel}>ACTUAL</Text><Text style={styles.releaseValue}>3.2</Text></View><View style={styles.releaseRow}><Text style={styles.releaseLabel}>EXPECTED</Text><Text style={[styles.releaseValue, styles.warning]}>2.8</Text></View><View style={styles.releaseRow}><Text style={styles.releaseLabel}>PREVIOUS</Text><Text style={styles.releaseValue}>2.5</Text></View><View style={styles.releaseRow}><Text style={styles.releaseLabel}>REVISED</Text><Text style={styles.releaseValue}>2.7</Text></View></View>;
}

function RealNominalCompare({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.row}><Card styles={styles} label="NOMINAL" value="+10%" tone="success" /><Text style={styles.minus}>−</Text><Card styles={styles} label="INFLATION" value="+15%" tone="warning" /><Text style={styles.arrow}>→</Text><Card styles={styles} label="REAL" value="<0" tone="risk" /></View>;
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 14, padding: 14 },
  header: { gap: 4 },
  title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' },
  detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'stretch', gap: 8 },
  flow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  arrow: { color: theme.colors.textMuted, fontSize: 18, fontWeight: '900', alignSelf: 'center' },
  minus: { color: theme.colors.warning, fontSize: 18, fontWeight: '900', alignSelf: 'center' },
  card: { flex: 1, minWidth: 68, minHeight: 82, justifyContent: 'center', gap: 7, padding: 9, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  cardLabel: { color: theme.colors.textMuted, fontSize: 8, lineHeight: 11, fontWeight: '900', letterSpacing: 0.35, textAlign: 'center' },
  cardValue: { color: theme.colors.text, fontSize: 12, lineHeight: 17, fontWeight: '900', textAlign: 'center' },
  success: { color: theme.colors.success },
  warning: { color: theme.colors.warning },
  risk: { color: theme.colors.risk },
  rule: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(45,212,191,0.22)', backgroundColor: 'rgba(45,212,191,0.06)' },
  ruleWarning: { borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' },
  ruleTitle: { color: theme.colors.primary, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
  ruleDetail: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  fxBalance: { minHeight: 112, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  currency: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 29, borderWidth: 1, borderColor: 'rgba(45,212,191,0.36)', backgroundColor: 'rgba(45,212,191,0.08)' },
  currencyText: { color: theme.colors.primary, fontSize: 13, fontWeight: '900' },
  balanceLine: { minWidth: 72, height: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.border },
  balanceText: { color: theme.colors.text, fontSize: 12, fontWeight: '900', backgroundColor: theme.colors.background, paddingHorizontal: 7 },
  productionCard: { flex: 1, minHeight: 102, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  inputs: { color: theme.colors.textMuted, fontSize: 11, letterSpacing: 3 },
  outputs: { color: theme.colors.text, fontSize: 18, letterSpacing: 2 },
  release: { gap: 6, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  releaseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 3 },
  releaseLabel: { color: theme.colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.45 },
  releaseValue: { color: theme.colors.text, fontSize: 12, fontWeight: '900' },
});
