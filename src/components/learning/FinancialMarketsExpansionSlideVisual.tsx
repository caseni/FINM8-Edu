import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';

type SlideRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
type Topic = 'crypto' | 'sessions' | 'volume' | 'liquidityProviders' | 'primarySecondary' | 'derivatives';

export interface FinancialMarketsExpansionSlideVisualProps {
  assetRef: string;
  alt: string;
  language: LearningLanguage;
  role: SlideRole;
  theme?: LearningTheme;
}

function topicForAsset(assetRef: string): Topic | undefined {
  if (assetRef.includes('kripto-piyasasi-nasil-farklidir')) return 'crypto';
  if (assetRef.includes('piyasa-seanslari-neden-onemlidir')) return 'sessions';
  if (assetRef.includes('islem-hacmi-ne-anlatir')) return 'volume';
  if (assetRef.includes('market-maker-ne-yapar')) return 'liquidityProviders';
  if (assetRef.includes('birincil-ve-ikincil-piyasa')) return 'primarySecondary';
  if (assetRef.includes('turev-urun-nedir')) return 'derivatives';
  return undefined;
}

export function isFinancialMarketsExpansionSlideAsset(assetRef: string): boolean {
  return Boolean(topicForAsset(assetRef));
}

export function FinancialMarketsExpansionSlideVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: FinancialMarketsExpansionSlideVisualProps) {
  const topic = topicForAsset(assetRef);
  if (!topic) return null;
  const styles = createStyles(theme);
  const tr = language === 'tr';
  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      <View style={styles.canvas}>
        {topic === 'crypto' ? <CryptoScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'sessions' ? <SessionsScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'volume' ? <VolumeScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'liquidityProviders' ? <LiquidityProviderScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'primarySecondary' ? <PrimarySecondaryScene role={role} tr={tr} styles={styles} /> : null}
        {topic === 'derivatives' ? <DerivativesScene role={role} tr={tr} styles={styles} /> : null}
      </View>
    </View>
  );
}

type SceneProps = { role: SlideRole; tr: boolean; styles: ReturnType<typeof createStyles> };
function Header({ styles, title, detail }: { styles: ReturnType<typeof createStyles>; title: string; detail: string }) { return <View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>; }
function Card({ styles, label, value, tone = 'neutral' }: { styles: ReturnType<typeof createStyles>; label: string; value: string; tone?: 'neutral' | 'success' | 'warning' | 'risk' }) { return <View style={styles.card}><Text style={styles.cardLabel}>{label}</Text><Text style={[styles.cardValue, tone === 'success' ? styles.success : tone === 'warning' ? styles.warning : tone === 'risk' ? styles.risk : undefined]}>{value}</Text></View>; }
function Rule({ styles, title, detail, warning = false }: { styles: ReturnType<typeof createStyles>; title: string; detail: string; warning?: boolean }) { return <View style={[styles.rule, warning && styles.ruleWarning]}><Text style={[styles.ruleTitle, warning && styles.warning]}>{title}</Text><Text style={styles.ruleDetail}>{detail}</Text></View>; }

function CryptoScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? '7/24 açık = her yerde aynı piyasa?' : '24/7 open = one identical market?'} detail={tr ? 'Kripto likiditesi farklı işlem yerlerine dağılabilir.' : 'Crypto liquidity can be fragmented across venues.'} /><VenueCluster styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Bir varlık, birçok işlem yeri' : 'One asset, many venues'} detail={tr ? 'Fiyat, derinlik ve ürün yapısı platforma göre değişebilir.' : 'Price, depth, and product structure can vary by venue.'} /><VenueCluster styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Spot mu, perpetual mı?' : 'Spot or perpetual?'} detail={tr ? 'Finansman ve tasfiye mekaniği aynı değildir.' : 'Financing and liquidation mechanics differ.'} /><View style={styles.row}><Card styles={styles} label="SPOT" value={tr ? 'VARLIK' : 'ASSET'} /><Card styles={styles} label="PERP" value={tr ? 'SÖZLEŞME' : 'CONTRACT'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? '7/24 ≠ 7/24 AYNI LİKİDİTE' : '24/7 ≠ IDENTICAL LIQUIDITY 24/7'} detail={tr ? 'Katılım ve derinlik saate ve platforma göre değişebilir.' : 'Participation and depth can vary by hour and venue.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'SAKLAMA + PLATFORM + ÜRÜN RİSKİ' : 'CUSTODY + VENUE + PRODUCT RISK'} detail={tr ? 'Kripto maruziyetinde işlem yerini ve ürün tipini ayrı kontrol et.' : 'Check venue and product type separately.'} />;
  return <VenueCluster styles={styles} />;
}

function SessionsScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Aynı varlık, farklı saat' : 'Same asset, different hour'} detail={tr ? 'Katılım değiştikçe spread ve derinlik değişebilir.' : 'Spreads and depth can change with participation.'} /><SessionTimeline styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Seans = piyasa koşulunun parçası' : 'Session = part of market conditions'} detail={tr ? 'Saat, aktivite ve gerçekleşme kalitesini etkileyebilir.' : 'Time of day can affect activity and execution quality.'} /><SessionTimeline styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Düşük katılımda ne olabilir?' : 'What can happen with lower participation?'} detail={tr ? 'Daha geniş spread, daha az derinlik.' : 'Wider spreads, lower depth.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'ANA SEANS' : 'MAIN'} value={tr ? 'DERİN' : 'DEEP'} tone="success" /><Card styles={styles} label={tr ? 'SEANS DIŞI' : 'OFF-HOURS'} value={tr ? 'DAHA SIĞ' : 'SHALLOWER'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'AÇIK PİYASA ≠ SABİT KOŞULLAR' : 'OPEN MARKET ≠ CONSTANT CONDITIONS'} detail={tr ? 'Likidite ve spread gün içinde değişebilir.' : 'Liquidity and spreads can vary through the day.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'SEANS DIŞI GERÇEKLEŞMEYE DİKKAT' : 'WATCH OFF-HOURS EXECUTION'} detail={tr ? 'Ana seans derinliğini varsayma.' : 'Do not assume regular-session depth.'} />;
  return <SessionTimeline styles={styles} />;
}

function VolumeScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Hacim ↑ = fiyat ↑ mı?' : 'Volume ↑ = price ↑?'} detail={tr ? 'Hacim aktiviteyi ölçer, yönü değil.' : 'Volume measures activity, not direction.'} /><VolumeBars styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Daha çok el değiştirme' : 'More quantity changing hands'} detail={tr ? 'Hacim, belirli dönemin işlem aktivitesini gösterir.' : 'Volume shows trading activity over a period.'} /><VolumeBars styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Aynı hacim, farklı likidite' : 'Same volume, different liquidity'} detail={tr ? 'Spread ve derinlik ayrıca ölçülür.' : 'Spread and depth are separate.'} /><View style={styles.row}><Card styles={styles} label="VOL 1M" value={tr ? 'DAR SPREAD' : 'TIGHT'} tone="success" /><Card styles={styles} label="VOL 1M" value={tr ? 'GENİŞ SPREAD' : 'WIDE'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'YÜKSEK HACİM ≠ YÜKSELİŞ SİNYALİ' : 'HIGH VOLUME ≠ BULLISH SIGNAL'} detail={tr ? 'Fiyat bağlamı olmadan yön çıkarma.' : 'Do not infer direction without price context.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'HACİM ≠ LİKİDİTE' : 'VOLUME ≠ LIQUIDITY'} detail={tr ? 'Derinlik, spread ve emir büyüklüğünü ayrıca değerlendir.' : 'Assess depth, spread, and order size separately.'} />;
  return <VolumeBars styles={styles} />;
}

function LiquidityProviderScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Bid ve ask’i kim sağlayabilir?' : 'Who can supply bid and ask quotes?'} detail={tr ? 'Likidite sağlayıcı iki taraflı quote sunabilir.' : 'A liquidity provider can post two-sided quotes.'} /><TwoSidedQuote styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'İki taraflı fiyat' : 'Two-sided quoting'} detail={tr ? 'Alış ve satış karşılığı, gerçekleşebilirliği destekler.' : 'Buy and sell quotes support executability.'} /><TwoSidedQuote styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Stres artarsa quote değişebilir' : 'Quotes can change under stress'} detail={tr ? 'Envanter ve adverse selection riski spreadi genişletebilir.' : 'Inventory and adverse-selection risk can widen spreads.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'NORMAL' : 'NORMAL'} value="99 / 101" tone="success" /><Card styles={styles} label={tr ? 'STRES' : 'STRESS'} value="97 / 103" tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'MARKET MAKER ≠ PİYASA PATRONU' : 'MARKET MAKER ≠ MARKET CONTROLLER'} detail={tr ? 'Tek başına fiyat yönünü belirlemez.' : 'It does not single-handedly set market direction.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'LİKİDİTE STRESTE GERİ ÇEKİLEBİLİR' : 'LIQUIDITY CAN RETREAT UNDER STRESS'} detail={tr ? 'Quote genişliği ve derinlik sabit değildir.' : 'Quote width and depth are not fixed.'} />;
  return <TwoSidedQuote styles={styles} />;
}

function PrimarySecondaryScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'IPO parası nereye gider?' : 'Where does IPO money go?'} detail={tr ? 'Birincil piyasa ile sonraki borsa işlemini ayır.' : 'Separate issuance from later exchange trading.'} /><IssuanceFlow styles={styles} tr={tr} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Birincil → ihraç · İkincil → el değiştirme' : 'Primary → issuance · Secondary → trading'} detail={tr ? 'Sermaye yaratımı ve yatırımcılar arası işlem farklı süreçlerdir.' : 'Capital raising and investor-to-investor trading differ.'} /><IssuanceFlow styles={styles} tr={tr} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Borsada mevcut hisse aldın' : 'You bought an existing share'} detail={tr ? 'Bu genellikle ikincil piyasa işlemidir.' : 'That is generally a secondary-market trade.'} /><View style={styles.row}><Card styles={styles} label={tr ? 'YATIRIMCI A' : 'INVESTOR A'} value="SELL" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'YATIRIMCI B' : 'INVESTOR B'} value="BUY" tone="success" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'HER HİSSE ALIMI → ŞİRKETE PARA ✕' : 'EVERY STOCK TRADE → COMPANY CASH ✕'} detail={tr ? 'İkincil piyasada para çoğunlukla yatırımcılar arasında el değiştirir.' : 'In secondary markets, money generally changes hands between investors.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'İHRAÇ VE İŞLEM MEKANİĞİNİ AYIR' : 'SEPARATE ISSUANCE FROM TRADING'} detail={tr ? 'Underwriting/allocation ile order matching aynı süreç değildir.' : 'Underwriting/allocation and order matching are different processes.'} />;
  return <IssuanceFlow styles={styles} tr={tr} />;
}

function DerivativesScene({ role, tr, styles }: SceneProps) {
  if (role === 'hook') return <><Header styles={styles} title={tr ? 'Dayanak mı, sözleşme mi?' : 'Underlying or contract?'} detail={tr ? 'Futures ve opsiyon dayanak varlığın kendisi değildir.' : 'Futures and options are not the underlying itself.'} /><DerivativeTree styles={styles} /></>;
  if (role === 'concept') return <><Header styles={styles} title={tr ? 'Değeri dayanak referanstan türeyen sözleşme' : 'A contract linked to an underlying reference'} detail={tr ? 'Futures ve opsiyon farklı hak/yükümlülük yapıları taşır.' : 'Futures and options create different rights and obligations.'} /><DerivativeTree styles={styles} /></>;
  if (role === 'practice') return <><Header styles={styles} title={tr ? 'Futures ≠ Spot' : 'Futures ≠ Spot'} detail={tr ? 'Vade, teminat ve sözleşme kuralları ayrıdır.' : 'Maturity, margin, and contract rules differ.'} /><View style={styles.row}><Card styles={styles} label="SPOT" value={tr ? 'DAYANAK' : 'UNDERLYING'} /><Card styles={styles} label="FUTURES" value={tr ? 'SÖZLEŞME' : 'CONTRACT'} tone="warning" /></View></>;
  if (role === 'misconception') return <Rule styles={styles} title={tr ? 'TÜREV ≠ DAYANAK VARLIĞIN AYNISI' : 'DERIVATIVE ≠ UNDERLYING'} detail={tr ? 'Nakit akışı, kaldıraç ve vade profili farklı olabilir.' : 'Cash flow, leverage, and maturity can differ.'} warning />;
  if (role === 'risk') return <Rule styles={styles} title={tr ? 'KALDIRAÇ + TEMİNAT + VADE' : 'LEVERAGE + MARGIN + MATURITY'} detail={tr ? 'Türev riskini ürün yapısıyla birlikte değerlendir.' : 'Assess derivative risk through the contract structure.'} />;
  return <DerivativeTree styles={styles} />;
}

function VenueCluster({ styles }: { styles: ReturnType<typeof createStyles> }) { return <View style={styles.cluster}>{[['CEX A','100.0'],['CEX B','100.3'],['DEX','99.8']].map(([name, price]) => <View key={name} style={styles.clusterCard}><Text style={styles.cardLabel}>{name}</Text><Text style={styles.cardValue}>{price}</Text></View>)}</View>; }
function SessionTimeline({ styles }: { styles: ReturnType<typeof createStyles> }) { return <View style={styles.timeline}>{[['ASIA',32],['EU',68],['US',86],['LATE',40]].map(([name, strength]) => <View key={String(name)} style={styles.session}><Text style={styles.cardLabel}>{String(name)}</Text><View style={styles.sessionTrack}><View style={[styles.sessionFill,{ width: `${Number(strength)}%` }]} /></View></View>)}</View>; }
function VolumeBars({ styles }: { styles: ReturnType<typeof createStyles> }) { return <View style={styles.bars}>{[24,48,36,78,54,88,42].map((height,index)=><View key={index} style={[styles.bar,{ height }]} />)}</View>; }
function TwoSidedQuote({ styles }: { styles: ReturnType<typeof createStyles> }) { return <View style={styles.row}><Card styles={styles} label="BID" value="99" tone="success" /><View style={styles.provider}><Text style={styles.providerText}>LP</Text></View><Card styles={styles} label="ASK" value="101" tone="warning" /></View>; }
function IssuanceFlow({ styles, tr }: { styles: ReturnType<typeof createStyles>; tr: boolean }) { return <View style={styles.flow}><Card styles={styles} label={tr ? 'ŞİRKET' : 'ISSUER'} value={tr ? 'YENİ PAY' : 'NEW'} /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'BİRİNCİL' : 'PRIMARY'} value={tr ? 'SERMAYE' : 'CAPITAL'} tone="success" /><Text style={styles.arrow}>→</Text><Card styles={styles} label={tr ? 'İKİNCİL' : 'SECONDARY'} value={tr ? 'AL/SAT' : 'TRADE'} /></View>; }
function DerivativeTree({ styles }: { styles: ReturnType<typeof createStyles> }) { return <View style={styles.tree}><View style={styles.root}><Text style={styles.rootText}>UNDERLYING</Text></View><View style={styles.branch}/><View style={styles.row}><Card styles={styles} label="FUTURES" value="OBLIGATION" /><Card styles={styles} label="OPTION" value="RIGHT" tone="success" /></View></View>; }

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  shell: { minHeight: 220, overflow: 'hidden', borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
  canvas: { flex: 1, justifyContent: 'center', gap: 14, padding: 14 },
  header: { gap: 4 },
  title: { color: theme.colors.text, fontSize: 16, lineHeight: 21, fontWeight: '900' },
  detail: { color: theme.colors.textMuted, fontSize: 11, lineHeight: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'stretch', gap: 9 },
  flow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  arrow: { color: theme.colors.textMuted, fontSize: 18, fontWeight: '900', alignSelf: 'center' },
  card: { flex: 1, minWidth: 68, minHeight: 82, justifyContent: 'center', gap: 7, padding: 9, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  cardLabel: { color: theme.colors.textMuted, fontSize: 8, lineHeight: 11, fontWeight: '900', letterSpacing: 0.35, textAlign: 'center' },
  cardValue: { color: theme.colors.text, fontSize: 12, lineHeight: 17, fontWeight: '900', textAlign: 'center' },
  success: { color: theme.colors.success }, warning: { color: theme.colors.warning }, risk: { color: theme.colors.risk },
  rule: { minHeight: 126, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(45,212,191,0.22)', backgroundColor: 'rgba(45,212,191,0.06)' },
  ruleWarning: { borderColor: 'rgba(251,191,36,0.24)', backgroundColor: 'rgba(251,191,36,0.05)' },
  ruleTitle: { color: theme.colors.primary, fontSize: 16, lineHeight: 22, fontWeight: '900', textAlign: 'center' },
  ruleDetail: { color: theme.colors.text, fontSize: 11, lineHeight: 16, fontWeight: '700', textAlign: 'center' },
  cluster: { flexDirection: 'row', gap: 8 }, clusterCard: { flex: 1, minHeight: 92, alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
  timeline: { gap: 8 }, session: { gap: 4 }, sessionTrack: { height: 10, overflow: 'hidden', borderRadius: 5, backgroundColor: theme.colors.surfaceMuted }, sessionFill: { height: 10, borderRadius: 5, backgroundColor: theme.colors.primary },
  bars: { minHeight: 108, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8, padding: 10, borderRadius: 12, backgroundColor: theme.colors.surfaceMuted }, bar: { width: 18, borderRadius: 5, backgroundColor: 'rgba(45,212,191,0.30)' },
  provider: { width: 62, height: 62, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 31, borderWidth: 1, borderColor: 'rgba(45,212,191,0.40)', backgroundColor: 'rgba(45,212,191,0.08)' }, providerText: { color: theme.colors.primary, fontSize: 13, fontWeight: '900' },
  tree: { alignItems: 'center', gap: 0 }, root: { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(45,212,191,0.38)', backgroundColor: 'rgba(45,212,191,0.08)' }, rootText: { color: theme.colors.primary, fontSize: 10, fontWeight: '900' }, branch: { width: 1, height: 24, backgroundColor: theme.colors.border },
});
