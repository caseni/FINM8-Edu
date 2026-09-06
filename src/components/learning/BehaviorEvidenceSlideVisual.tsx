import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'fomo' | 'overtrading' | 'confirmationBias' | 'dataQuality' | 'freshness' | 'journal';

export interface BehaviorEvidenceSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('fomo-karari')) return 'fomo';
  if (assetRef.includes('asiri-islem')) return 'overtrading';
  if (assetRef.includes('sadece-hakli-cikaran-kanit') || assetRef.includes('confirmation-bias')) return 'confirmationBias';
  if (assetRef.includes('her-veri-ayni-kalitede')) return 'dataQuality';
  if (assetRef.includes('dogru-veri-ne-zaman-eskir') || assetRef.includes('veri-ne-zaman-eskir')) return 'freshness';
  if (assetRef.includes('sonucu-degil-karari-kaydet') || assetRef.includes('karari-kaydet')) return 'journal';
  return undefined;
}

export function isBehaviorEvidenceSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function BehaviorEvidenceSlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: BehaviorEvidenceSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'fomo' ? <FomoScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'overtrading' ? <OvertradingScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'confirmationBias' ? <ConfirmationScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'dataQuality' ? <DataQualityScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'freshness' ? <FreshnessScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'journal' ? <JournalScene role={role} tr={tr} styles={styles} /> : null}
      </View>
    </View>
  );
}

type SceneProps = { role: SlideRole; tr: boolean; styles: ReturnType<typeof createStyles> };

function Header({ styles, title, detail }: { styles: ReturnType<typeof createStyles>; title: string; detail: string }) {
  return <View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>;
}

function Rule({ styles, title, detail, warning = false }: { styles: ReturnType<typeof createStyles>; title: string; detail: string; warning?: boolean }) {
  return <View style={[styles.rule, warning && styles.ruleWarning]}><Text style={[styles.ruleTitle, warning && styles.warning]}>{title}</Text><Text style={styles.ruleDetail}>{detail}</Text></View>;
}

function Card({ styles, label, value, tone = 'neutral' }: { styles: ReturnType<typeof createStyles>; label: string; value: string; tone?: 'neutral' | 'success' | 'warning' | 'risk' }) {
  return <View style={styles.card}><Text style={styles.cardLabel}>{label}</Text><Text style={[styles.cardValue, tone === 'success' ? styles.success : tone === 'warning' ? styles.warning : tone === 'risk' ? styles.risk : undefined]}>{value}</Text></View>;
}

function FomoScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? '“Şimdi girmezsem kaçırırım”' : '“If I do not enter now, I will miss it”'} detail={tr ? 'Bu piyasa kanıtı mı, iç baskı mı?' : 'Is that market evidence or internal pressure?'} /><View style={styles.row}><Card styles={styles} label={tr ? 'FİYAT' : 'PRICE'} value="↑ ↑ ↑" tone="warning" /><Card styles={styles} label={tr ? 'HİS' : 'FEELING'} value={tr ? 'HEMEN!' : 'NOW!'} tone="risk" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title="FOMO" detail={tr ? 'Aciliyet, plan ve risk kontrolünün önüne geçer.' : 'Urgency pushes plan and risk control aside.'} /><View style={styles.flow}><Card styles={styles} label={tr ? 'SOSYAL' : 'SOCIAL'} value="+" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'ACELE' : 'URGENCY'} value="!" tone="warning" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'PLANSIZ' : 'UNPLANNED'} value={tr ? 'KARAR' : 'DECISION'} tone="risk" /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Dürtü ile karar arasına sürtünme koy' : 'Put friction between impulse and action'} detail={tr ? 'Bekleme süresi + giriş kriteri + risk sınırı' : 'Waiting period + entry criteria + risk limit'} /><View style={styles.three}><Card styles={styles} label="1" value={tr ? 'DUR' : 'PAUSE'} tone="success" /><Card styles={styles} label="2" value={tr ? 'KONTROL' : 'CHECK'} /><Card styles={styles} label="3" value={tr ? 'KARAR' : 'DECIDE'} /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'ACİL HİSSETMEK ≠ ACİL KARAR' : 'FEELING URGENCY ≠ URGENT DECISION'} detail={tr ? 'Duygu, dış piyasa kanıtı değildir.' : 'Emotion is not external market evidence.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'FOMO RİSK SINIRINI ESNETEBİLİR' : 'FOMO CAN STRETCH RISK LIMITS'} detail={tr ? 'Plan dışına çıktığını fark ettiğinde süreci durdur.' : 'Pause when you notice the process leaving the plan.'} />;
  return <Rule styles={styles} title={tr ? 'DUR → KANITI KONTROL ET → KARAR VER' : 'PAUSE → CHECK EVIDENCE → DECIDE'} detail={tr ? 'Acil hissetmek piyasanın acil olduğunu kanıtlamaz.' : 'Feeling urgency does not prove the market is urgent.'} />;
}

function OvertradingScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Daha çok işlem = daha iyi sonuç?' : 'More trades = better results?'} detail={tr ? 'İşlem sayısı tek başına kalite ölçütü değildir.' : 'Trade count alone is not a quality metric.'} /><TradeBars styles={styles} many /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Aşırı işlem = süreçten kopuş' : 'Overtrading = process breakdown'} detail={tr ? 'Plan, kanıt ve risk sınırı zayıflar.' : 'Plan, evidence, and risk limits weaken.'} /><View style={styles.three}><Card styles={styles} label={tr ? 'PLAN' : 'PLAN'} value="↓" tone="risk" /><Card styles={styles} label={tr ? 'KANIT' : 'EVIDENCE'} value="↓" tone="warning" /><Card styles={styles} label={tr ? 'İŞLEM' : 'TRADES'} value="↑" /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Kayıptan sonra tekrar giriş?' : 'Re-enter after a loss?'} detail={tr ? 'Cooldown, dürtüsel geri kazanma döngüsünü kesebilir.' : 'A cooldown can break the revenge-trading loop.'} /><View style={styles.flow}><Card styles={styles} label={tr ? 'KAYIP' : 'LOSS'} value="−" tone="risk" /><Text style={styles.arrow}>→</Text><Card styles={styles} label="COOLDOWN" value={tr ? 'BEKLE' : 'WAIT'} tone="success" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'YENİ KANIT' : 'NEW EVIDENCE'} value="?" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'ÇOK TIKLAMAK ≠ DİSİPLİN' : 'MORE CLICKS ≠ DISCIPLINE'} detail={tr ? 'Ekranda uzun kalmak kaliteli karar anlamına gelmez.' : 'More screen time does not mean better decisions.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'HER EK İŞLEM = YENİ MALİYET + HATA FIRSATI' : 'EACH EXTRA TRADE = MORE COST + ERROR EXPOSURE'} detail={tr ? 'Sıklığı değil, süreç kalitesini izle.' : 'Track process quality, not raw frequency.'} />;
  return <Rule styles={styles} title={tr ? 'AZ / ÇOK DEĞİL · PLANLI / PLANSIZ' : 'NOT FEW / MANY · PLANNED / UNPLANNED'} detail={tr ? 'Aşırı işlemi belirleyen bağlam ve süreç ihlalidir.' : 'Context and process violations define overtrading.'} />;
}

function ConfirmationScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Sadece haklı çıkaranı mı görüyorsun?' : 'Do you only see what supports you?'} detail={tr ? 'Aynı görüşü tekrar eden kaynaklar bağımsız kanıt olmayabilir.' : 'Sources repeating one view may not be independent evidence.'} /><View style={styles.row}><EvidenceStack styles={styles} same /><Text style={styles.question}>?</Text><EvidenceStack styles={styles} same={false} /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Tezi zorlayan kanıtı da ara' : 'Seek evidence that challenges the thesis'} detail={tr ? '“Beni ne yanlış çıkarır?” sorusu sürecin parçasıdır.' : '“What would prove me wrong?” belongs in the process.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'DESTEK' : 'SUPPORT'} value="✓" tone="success" /><Card styles={styles} label={tr ? 'KARŞI KANIT' : 'DISCONFIRM'} value="?" tone="warning" /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Geçersizlik koşulunu önceden yaz' : 'Write invalidation before the outcome'} detail={tr ? 'Sonradan gerekçeyi değiştirmeyi zorlaştırır.' : 'It makes hindsight rewriting harder.'} /><View style={styles.flow}><Card styles={styles} label={tr ? 'TEZ' : 'THESIS'} value="A" /><Text style={styles.arrow}>+</Text><Card styles={styles} label={tr ? 'İPTAL KOŞULU' : 'INVALIDATION'} value="B" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? '10 AYNI KAYNAK ≠ 10 BAĞIMSIZ KANIT' : '10 REPEATS ≠ 10 INDEPENDENT SOURCES'} detail={tr ? 'Kaynak sayısı ile bağımsız kaynak sayısı aynı değildir.' : 'Source count and independent-source count are different.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'TEZİ KORUMAK İÇİN VERİYİ SEÇME' : 'DO NOT SELECT DATA TO PROTECT A THESIS'} detail={tr ? 'Karşı kanıtı süreç içinde görünür tut.' : 'Keep disconfirming evidence visible in the process.'} />;
  return <Rule styles={styles} title={tr ? 'DESTEKLEYEN + ÇÜRÜTEBİLEN KANIT' : 'SUPPORTING + DISCONFIRMING EVIDENCE'} detail={tr ? 'Güçlü tez, karşı kanıttan kaçmaz.' : 'A strong thesis does not avoid contrary evidence.'} />;
}

function DataQualityScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Ekranda sayı görmek yeterli mi?' : 'Is seeing a number enough?'} detail={tr ? 'Kesin görünen sayı yanlış veya bağlamsız olabilir.' : 'A precise-looking number can still be wrong or out of context.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'SAYI' : 'NUMBER'} value="42.7182" /><Card styles={styles} label={tr ? 'KAYNAK' : 'SOURCE'} value="?" tone="warning" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Güçlü veri dört soruyu cevaplar' : 'Strong data answers four questions'} detail={tr ? 'Kaynak · Zaman · Kapsam · Bağlam' : 'Source · Time · Scope · Context'} /><View style={styles.four}><Chip styles={styles} text={tr ? 'KAYNAK' : 'SOURCE'} /><Chip styles={styles} text={tr ? 'ZAMAN' : 'TIME'} /><Chip styles={styles} text={tr ? 'KAPSAM' : 'SCOPE'} /><Chip styles={styles} text={tr ? 'BAĞLAM' : 'CONTEXT'} /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'İki veriden hangisi daha güçlü?' : 'Which data point is stronger?'} detail={tr ? 'İzlenebilir ve kapsamı belli olanı tercih et.' : 'Prefer traceable data with clear scope.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'KIRPILMIŞ EKRAN' : 'CROPPED SCREEN'} value="?" tone="warning" /><Card styles={styles} label={tr ? 'KAYNAK + ZAMAN' : 'SOURCE + TIME'} value="✓" tone="success" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'ÇOK ONDALIK ≠ DOĞRULUK' : 'MORE DECIMALS ≠ ACCURACY'} detail={tr ? 'Yanlış ölçüm de çok hassas yazılabilir.' : 'A wrong measurement can still look highly precise.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'EKSİK VERİ = BİLİNMEYEN' : 'MISSING DATA = UNKNOWN'} detail={tr ? '“Olumsuz kanıt yok” diye yorumlama.' : 'Do not reinterpret missing data as absence of negative evidence.'} />;
  return <Rule styles={styles} title={tr ? 'İZLENEBİLİR + BAĞLAMI BELLİ VERİ' : 'TRACEABLE + CONTEXTUAL DATA'} detail={tr ? 'Kesin görünmekten daha değerlidir.' : 'That matters more than merely looking precise.'} />;
}

function FreshnessScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Dün doğru olan bugün geçerli mi?' : 'Is yesterday’s correct data still valid today?'} detail={tr ? 'Doğru veri zamanla eskiyebilir.' : 'Correct data can become stale.'} /><Timeline styles={styles} changed /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Güncellik yalnız yaş değildir' : 'Freshness is not just age'} detail={tr ? 'Temsil ettiği koşul hâlâ geçerli mi?' : 'Does the condition it represents still hold?'} /><Timeline styles={styles} changed /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Yeni olay geldiyse yeniden kontrol et' : 'Re-check after a new event'} detail={tr ? 'Kaynak aynı olsa bile piyasa koşulu değişebilir.' : 'The source can remain reliable while the market condition changes.'} /><View style={styles.flow}><Card styles={styles} label={tr ? 'ESKİ VERİ' : 'OLD DATA'} value="✓" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'YENİ OLAY' : 'NEW EVENT'} value="!" tone="warning" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'TEKRAR KONTROL' : 'RECHECK'} value="↻" tone="success" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'GÜVENİLİR KAYNAK ≠ HER ZAMAN GÜNCEL' : 'RELIABLE SOURCE ≠ ALWAYS FRESH'} detail={tr ? 'Kaynak güvenilirliği ile gözlem güncelliği farklıdır.' : 'Source reliability and observation freshness are different.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'STALE VERİYİ YENİ GERÇEK GİBİ SUNMA' : 'DO NOT PRESENT STALE DATA AS CURRENT'} detail={tr ? 'Gözlem zamanını ve kapsamını birlikte taşı.' : 'Keep observation time and scope attached.'} />;
  return <Rule styles={styles} title={tr ? 'DOĞRU + GÜNCEL + UYGUN BAĞLAM' : 'CORRECT + FRESH + RELEVANT'} detail={tr ? 'Kanıtın karar anında hâlâ geçerli olması gerekir.' : 'Evidence must still be valid at decision time.'} />;
}

function JournalScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Kâr = iyi karar mı?' : 'Profit = good decision?'} detail={tr ? 'İyi karar kötü sonuç; kötü karar iyi sonuç üretebilir.' : 'Good decisions can lose; bad decisions can win.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'KARAR' : 'DECISION'} value="✓" tone="success" /><Card styles={styles} label={tr ? 'SONUÇ' : 'OUTCOME'} value="−" tone="risk" /></View></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Karar günlüğünde parçaları ayır' : 'Separate the parts of a decision journal'} detail={tr ? 'Gözlem · Yorum · Karşı kanıt · Risk · Sonuç' : 'Observation · Interpretation · Counter-evidence · Risk · Outcome'} /><View style={styles.five}><Chip styles={styles} text={tr ? 'GÖZLEM' : 'OBSERVE'} /><Chip styles={styles} text={tr ? 'YORUM' : 'INTERPRET'} /><Chip styles={styles} text={tr ? 'KARŞI' : 'COUNTER'} /><Chip styles={styles} text="RISK" /><Chip styles={styles} text={tr ? 'SONUÇ' : 'RESULT'} /></View></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Önce karar anını dondur' : 'Freeze the decision-time snapshot first'} detail={tr ? 'Sonuç sonradan eklenir; ilk gerekçe geriye dönük değiştirilmez.' : 'Outcome is added later; the original rationale is not rewritten.'} /><View style={styles.flow}><Card styles={styles} label="T0" value={tr ? 'KARAR KAYDI' : 'DECISION'} /><Text style={styles.arrow}>→</Text><Card styles={styles} label="T1" value={tr ? 'SONUÇ' : 'OUTCOME'} tone="success" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'KÂR ≠ HER ZAMAN İYİ KARAR' : 'PROFIT ≠ ALWAYS A GOOD DECISION'} detail={tr ? 'Sonuç yanlılığı süreç hatalarını gizleyebilir.' : 'Outcome bias can hide process errors.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'SONUCA GÖRE GEÇMİŞ GEREKÇEYİ YENİDEN YAZMA' : 'DO NOT REWRITE THE ORIGINAL RATIONALE'} detail={tr ? 'Karar anındaki kanıtı ayrı ve değişmez tut.' : 'Keep decision-time evidence separate and stable.'} />;
  return <Rule styles={styles} title={tr ? 'SONUCU DEĞİL · KARAR KALİTESİNİ ÖLÇ' : 'MEASURE DECISION QUALITY · NOT JUST OUTCOME'} detail={tr ? 'İyi süreç uzun vadede daha anlamlı öğrenme sağlar.' : 'A good process creates more meaningful learning over time.'} />;
}

function TradeBars({ styles, many }: { styles: ReturnType<typeof createStyles>; many: boolean }) {
  const count = many ? 9 : 4;
  return <View style={styles.tradeBars}>{Array.from({ length: count }).map((_, index) => <View key={index} style={[styles.tradeBar, index > 4 && styles.tradeRisk]} />)}</View>;
}

function EvidenceStack({ styles, same }: { styles: ReturnType<typeof createStyles>; same: boolean }) {
  return <View style={styles.stack}>{['A', 'B', 'C'].map((item, index) => <View key={item} style={[styles.source, same && index > 0 && styles.sourceSame]}><Text style={styles.sourceText}>{same ? '↻' : item}</Text></View>)}<Text style={[styles.cardLabel, same ? styles.warning : styles.success]}>{same ? 'REPEAT' : 'INDEPENDENT'}</Text></View>;
}

function Chip({ styles, text }: { styles: ReturnType<typeof createStyles>; text: string }) {
  return <View style={styles.chip}><Text style={styles.chipText}>{text}</Text></View>;
}

function Timeline({ styles, changed }: { styles: ReturnType<typeof createStyles>; changed: boolean }) {
  return <View style={styles.timeline}><View style={styles.timelinePoint}><Text style={styles.timelineLabel}>T0</Text><Text style={styles.success}>✓</Text></View><View style={styles.timelineLine} /><View style={styles.timelinePoint}><Text style={styles.timelineLabel}>T1</Text><Text style={styles.warning}>{changed ? '!' : '✓'}</Text></View><View style={styles.timelineLine} /><View style={styles.timelinePoint}><Text style={styles.timelineLabel}>NOW</Text><Text style={styles.primary}>↻</Text></View></View>;
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 14, padding: 14 },
  header: { gap: 4 },
  title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' },
  detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  three: { flexDirection: 'row', gap: 8 },
  four: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  five: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  flow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  arrow: { color: theme.colors.textMuted, fontSize: 19, fontWeight: '900' },
  question: { color: theme.colors.warning, fontSize: 28, fontWeight: '900', alignSelf: 'center' },
  primary: { color: theme.colors.primary },
  success: { color: theme.colors.success },
  warning: { color: theme.colors.warning },
  risk: { color: theme.colors.risk },
  card: { flex: 1, minHeight: 86, justifyContent: 'center', gap: 7, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  cardLabel: { color: theme.colors.textMuted, fontSize: 9, lineHeight: 12, fontWeight: '900', letterSpacing: 0.45, textAlign: 'center' },
  cardValue: { color: theme.colors.text, fontSize: 13, lineHeight: 18, fontWeight: '900', textAlign: 'center' },
  rule: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(45,212,191,0.22)', backgroundColor: 'rgba(45,212,191,0.06)' },
  ruleWarning: { borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' },
  ruleTitle: { color: theme.colors.primary, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
  ruleDetail: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  tradeBars: { minHeight: 110, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 7, padding: 12, borderRadius: 12, backgroundColor: theme.colors.surfaceMuted },
  tradeBar: { width: 16, height: 56, borderRadius: 5, backgroundColor: 'rgba(45,212,191,0.28)' },
  tradeRisk: { height: 82, backgroundColor: 'rgba(251,113,133,0.26)' },
  stack: { flex: 1, minHeight: 108, alignItems: 'center', justifyContent: 'center', gap: 5, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  source: { width: 48, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 7, borderWidth: 1, borderColor: 'rgba(45,212,191,0.38)', backgroundColor: 'rgba(45,212,191,0.08)' },
  sourceSame: { borderColor: 'rgba(251,191,36,0.36)', backgroundColor: 'rgba(251,191,36,0.06)' },
  sourceText: { color: theme.colors.text, fontSize: 10, fontWeight: '900' },
  chip: { minWidth: 72, flexGrow: 1, paddingHorizontal: 9, paddingVertical: 11, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  chipText: { color: theme.colors.text, fontSize: 9, lineHeight: 12, fontWeight: '900', textAlign: 'center', letterSpacing: 0.35 },
  timeline: { minHeight: 112, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  timelinePoint: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 27, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  timelineLabel: { color: theme.colors.textMuted, fontSize: 8, fontWeight: '900' },
  timelineLine: { width: 44, height: 1, backgroundColor: theme.colors.border },
});
