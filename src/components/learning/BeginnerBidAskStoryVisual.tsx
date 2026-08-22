import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import type { LessonSupportingVisualRole } from './LessonSupportingVisual';

export interface BeginnerBidAskStoryVisualProps {
  alt: string;
  language: LearningLanguage;
  role: LessonSupportingVisualRole;
  theme?: LearningTheme;
}

type Styles = ReturnType<typeof createStyles>;

export function BeginnerBidAskStoryVisual({
  alt,
  language,
  role,
  theme = defaultLearningTheme,
}: BeginnerBidAskStoryVisualProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const narrow = width < 420;
  const styles = createStyles(theme, wide, narrow);
  const tr = language === 'tr';

  return (
    <View style={styles.shell} accessibilityRole="image" accessibilityLabel={alt}>
      {role === 'hook' ? <HookScene tr={tr} styles={styles} />
        : role === 'practice' ? <PracticeScene tr={tr} styles={styles} />
          : role === 'misconception' ? <MisconceptionScene tr={tr} styles={styles} />
            : role === 'summary' ? <SummaryScene tr={tr} styles={styles} />
              : <ConceptScene tr={tr} styles={styles} />}
    </View>
  );
}

function Heading({ title, body, styles }: { title: string; body?: string; styles: Styles }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingTitle}>{title}</Text>
      {body ? <Text style={styles.headingBody}>{body}</Text> : null}
    </View>
  );
}

function QuoteCard({
  side,
  label,
  price,
  hint,
  accessibilityLabel,
  styles,
}: {
  side: 'bid' | 'ask';
  label: string;
  price: string;
  hint: string;
  accessibilityLabel: string;
  styles: Styles;
}) {
  return (
    <View style={[styles.quoteCard, side === 'bid' ? styles.bidCard : styles.askCard]} accessibilityLabel={accessibilityLabel}>
      <View style={[styles.person, side === 'bid' ? styles.personBid : styles.personAsk]}>
        <View style={styles.personHead} />
        <View style={styles.personBody} />
      </View>
      <Text style={styles.quoteLabel}>{label}</Text>
      <Text style={[styles.quotePrice, side === 'bid' ? styles.bidText : styles.askText]}>{price}</Text>
      <Text style={styles.quoteHint}>{hint}</Text>
    </View>
  );
}

function Gap({ tr, styles, compact = false }: { tr: boolean; styles: Styles; compact?: boolean }) {
  return (
    <View style={[styles.gap, compact && styles.gapCompact]} accessibilityLabel="bid-ask-spread-gap">
      <Text style={styles.gapValue}>0,20</Text>
      <View style={styles.gapLine} />
      <Text style={styles.gapName}>{tr ? 'FARK' : 'GAP'}</Text>
    </View>
  );
}

function HookScene({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading
        styles={styles}
        title={tr ? 'Aynı varlık için aynı anda iki farklı fiyat görebilirsin.' : 'The same asset can show two different prices at the same time.'}
        body={tr ? 'Biri alıcının teklifi, diğeri satıcının teklifi.' : 'One is the buyer offer; the other is the seller offer.'}
      />
      <View style={styles.quoteRow}>
        <QuoteCard side="bid" label={tr ? 'ALICI' : 'BUYER'} price="99,90" hint={tr ? 'Ödemeye hazır' : 'Willing to pay'} accessibilityLabel="bid-ask-buyer-side" styles={styles} />
        <Gap tr={tr} styles={styles} />
        <QuoteCard side="ask" label={tr ? 'SATICI' : 'SELLER'} price="100,10" hint={tr ? 'Kabul etmeye hazır' : 'Willing to accept'} accessibilityLabel="bid-ask-seller-side" styles={styles} />
      </View>
    </View>
  );
}

function ConceptScene({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Bid alıcı tarafı, ask satıcı tarafı; aradaki mesafe spread.' : 'Bid is the buyer side, ask is the seller side; the distance is the spread.'} />
      <View style={styles.quoteRow}>
        <QuoteCard side="bid" label="BID" price="99,90" hint={tr ? 'En iyi alış' : 'Best buy'} accessibilityLabel="bid-ask-concept-bid" styles={styles} />
        <Gap tr={tr} styles={styles} compact />
        <QuoteCard side="ask" label="ASK" price="100,10" hint={tr ? 'En iyi satış' : 'Best sell'} accessibilityLabel="bid-ask-concept-ask" styles={styles} />
      </View>
      <View style={styles.rule}><Text style={styles.ruleText}>{tr ? '100,10 − 99,90 = 0,20 spread' : '100.10 − 99.90 = 0.20 spread'}</Text></View>
    </View>
  );
}

function ActionCard({ kind, tr, styles }: { kind: 'buy' | 'sell'; tr: boolean; styles: Styles }) {
  const buy = kind === 'buy';
  return (
    <View style={[styles.actionCard, buy ? styles.askCard : styles.bidCard]} accessibilityLabel={buy ? 'bid-ask-buy-now' : 'bid-ask-sell-now'}>
      <Text style={styles.actionEyebrow}>{buy ? (tr ? 'HEMEN AL' : 'BUY NOW') : (tr ? 'HEMEN SAT' : 'SELL NOW')}</Text>
      <View style={styles.actionArrowRow}>
        <Text style={styles.actionArrow}>{buy ? '→' : '←'}</Text>
        <Text style={[styles.actionPrice, buy ? styles.askText : styles.bidText]}>{buy ? '100,10' : '99,90'}</Text>
      </View>
      <Text style={styles.actionHint}>{buy ? (tr ? 'Ask tarafına gidersin' : 'You reach the ask') : (tr ? 'Bid tarafına gidersin' : 'You reach the bid')}</Text>
    </View>
  );
}

function PracticeScene({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading
        styles={styles}
        title={tr ? '99,90 bid ve 100,10 ask varsa hangi fiyat sana dokunur?' : 'If bid is 99.90 and ask is 100.10, which price do you reach?'}
        body={tr ? 'Piyasa emriyle yönün, karşı taraftaki fiyatı belirler.' : 'With a market order, your direction determines which side you reach.'}
      />
      <View style={styles.actionRow}>
        <ActionCard kind="buy" tr={tr} styles={styles} />
        <ActionCard kind="sell" tr={tr} styles={styles} />
      </View>
    </View>
  );
}

function MisconceptionScene({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Son işlem fiyatı, şu anki bid ve ask ile aynı şey değildir.' : 'The last traded price is not the same thing as the current bid and ask.'} />
      <View style={styles.lastTrade} accessibilityLabel="bid-ask-last-trade">
        <Text style={styles.lastTradeLabel}>{tr ? 'SON İŞLEM' : 'LAST TRADE'}</Text>
        <Text style={styles.lastTradePrice}>100,00</Text>
        <Text style={styles.lastTradeHint}>{tr ? 'Geçmişte gerçekleşti' : 'Already happened'}</Text>
      </View>
      <View style={styles.currentQuotes} accessibilityLabel="bid-ask-current-quotes">
        <View style={styles.currentSide}><Text style={styles.currentLabel}>BID</Text><Text style={[styles.currentPrice, styles.bidText]}>99,90</Text></View>
        <Text style={styles.notEqual}>≠</Text>
        <View style={styles.currentSide}><Text style={styles.currentLabel}>ASK</Text><Text style={[styles.currentPrice, styles.askText]}>100,10</Text></View>
      </View>
    </View>
  );
}

function SummaryScene({ tr, styles }: { tr: boolean; styles: Styles }) {
  return (
    <View style={styles.scene}>
      <Heading styles={styles} title={tr ? 'Tek bakışta: bid | spread | ask' : 'At a glance: bid | spread | ask'} />
      <View style={styles.summaryStrip}>
        <View style={[styles.summaryCell, styles.bidCard]}><Text style={styles.summaryLabel}>BID</Text><Text style={[styles.summaryPrice, styles.bidText]}>99,90</Text><Text style={styles.summaryHint}>{tr ? 'Alıcı' : 'Buyer'}</Text></View>
        <View style={styles.summaryGap}><Text style={styles.summaryGapValue}>0,20</Text><Text style={styles.summaryGapLabel}>SPREAD</Text></View>
        <View style={[styles.summaryCell, styles.askCard]}><Text style={styles.summaryLabel}>ASK</Text><Text style={[styles.summaryPrice, styles.askText]}>100,10</Text><Text style={styles.summaryHint}>{tr ? 'Satıcı' : 'Seller'}</Text></View>
      </View>
      <View style={styles.rule}><Text style={styles.ruleText}>{tr ? 'Hemen alım ask’e, hemen satım bid’e yaklaşır.' : 'Immediate buying reaches toward ask; immediate selling reaches toward bid.'}</Text></View>
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean, narrow: boolean) => StyleSheet.create({
  shell: { width: '100%', minHeight: wide ? 300 : narrow ? 236 : 256, justifyContent: 'center', padding: wide ? 20 : narrow ? 6 : 14, overflow: 'hidden', borderRadius: wide ? 18 : 16, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: '#081726' },
  scene: { width: '100%', gap: wide ? 17 : narrow ? 9 : 12 },
  heading: { gap: 5 },
  headingTitle: { color: theme.colors.text, fontSize: wide ? 20 : narrow ? 15 : 17, lineHeight: wide ? 28 : narrow ? 21 : 24, fontWeight: '900' },
  headingBody: { color: theme.colors.textMuted, fontSize: wide ? 12 : narrow ? 9 : 10, lineHeight: wide ? 18 : narrow ? 13 : 15 },
  quoteRow: { flexDirection: 'row', alignItems: 'stretch', gap: narrow ? 2 : 8 },
  quoteCard: { flex: 1, minWidth: 0, minHeight: wide ? 154 : narrow ? 110 : 132, alignItems: 'center', justifyContent: 'center', gap: narrow ? 4 : 7, padding: narrow ? 6 : 9, borderRadius: 14, borderWidth: 1 },
  bidCard: { borderColor: '#2E716B', backgroundColor: '#0C2B31' },
  askCard: { borderColor: '#725851', backgroundColor: '#2A2025' },
  person: { width: narrow ? 30 : 40, height: narrow ? 30 : 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  personBid: { backgroundColor: '#143F42' },
  personAsk: { backgroundColor: '#422D31' },
  personHead: { width: narrow ? 8 : 11, height: narrow ? 8 : 11, borderRadius: 6, backgroundColor: '#C6D3D9' },
  personBody: { width: narrow ? 16 : 21, height: narrow ? 9 : 12, marginTop: 2, borderTopLeftRadius: 9, borderTopRightRadius: 9, backgroundColor: '#8195A1' },
  quoteLabel: { color: theme.colors.textMuted, fontSize: narrow ? 8 : 9, lineHeight: 12, fontWeight: '900', letterSpacing: 0.5 },
  quotePrice: { fontSize: wide ? 22 : narrow ? 15 : 18, lineHeight: wide ? 28 : narrow ? 20 : 23, fontWeight: '900' },
  quoteHint: { color: theme.colors.textMuted, fontSize: narrow ? 7 : 9, lineHeight: narrow ? 10 : 13, textAlign: 'center' },
  bidText: { color: '#68C4B8' },
  askText: { color: '#D29A86' },
  gap: { width: wide ? 76 : narrow ? 45 : 54, alignItems: 'center', justifyContent: 'center', gap: narrow ? 2 : 4 },
  gapCompact: { width: wide ? 68 : narrow ? 45 : 48 },
  gapValue: { color: theme.colors.text, fontSize: wide ? 16 : narrow ? 9 : 12, fontWeight: '900' },
  gapLine: { width: '86%', height: 2, borderRadius: 2, backgroundColor: '#667E8D' },
  gapName: { color: theme.colors.primary, fontSize: narrow ? 6 : 8, fontWeight: '900', letterSpacing: 0.35 },
  rule: { paddingHorizontal: wide ? 16 : 11, paddingVertical: wide ? 11 : narrow ? 8 : 9, borderRadius: 11, borderWidth: 1, borderColor: '#315A61', backgroundColor: '#0D2933' },
  ruleText: { color: '#D7E4E8', fontSize: wide ? 12 : narrow ? 9 : 11, lineHeight: wide ? 18 : narrow ? 13 : 16, textAlign: 'center', fontWeight: '700' },
  actionRow: { flexDirection: 'row', alignItems: 'stretch', gap: narrow ? 7 : 9 },
  actionCard: { flex: 1, minWidth: 0, minHeight: wide ? 156 : narrow ? 112 : 132, alignItems: 'center', justifyContent: 'center', gap: narrow ? 6 : 9, padding: narrow ? 7 : 10, borderRadius: 14, borderWidth: 1 },
  actionEyebrow: { color: theme.colors.text, fontSize: narrow ? 9 : 10, fontWeight: '900', letterSpacing: 0.5 },
  actionArrowRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionArrow: { color: '#8398A5', fontSize: wide ? 20 : narrow ? 15 : 17, fontWeight: '900' },
  actionPrice: { fontSize: wide ? 22 : narrow ? 16 : 18, fontWeight: '900' },
  actionHint: { color: theme.colors.textMuted, fontSize: narrow ? 8 : 9, lineHeight: narrow ? 11 : 13, textAlign: 'center' },
  lastTrade: { alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: narrow ? 8 : 11, borderRadius: 12, borderWidth: 1, borderColor: '#344C5D', backgroundColor: '#102231' },
  lastTradeLabel: { color: theme.colors.textMuted, fontSize: narrow ? 8 : 9, fontWeight: '900', letterSpacing: 0.5 },
  lastTradePrice: { color: theme.colors.text, fontSize: wide ? 21 : narrow ? 15 : 18, fontWeight: '900' },
  lastTradeHint: { color: theme.colors.textMuted, fontSize: narrow ? 8 : 9 },
  currentQuotes: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: narrow ? 10 : 16, paddingVertical: narrow ? 7 : 10 },
  currentSide: { alignItems: 'center', gap: 2 },
  currentLabel: { color: theme.colors.textMuted, fontSize: narrow ? 8 : 9, fontWeight: '900' },
  currentPrice: { fontSize: wide ? 19 : narrow ? 14 : 16, fontWeight: '900' },
  notEqual: { color: theme.colors.primary, fontSize: wide ? 22 : 18, fontWeight: '900' },
  summaryStrip: { flexDirection: 'row', alignItems: 'stretch', gap: narrow ? 5 : 8 },
  summaryCell: { flex: 1, minWidth: 0, minHeight: wide ? 126 : narrow ? 90 : 108, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 13, borderWidth: 1 },
  summaryLabel: { color: theme.colors.text, fontSize: narrow ? 9 : 10, fontWeight: '900' },
  summaryPrice: { fontSize: wide ? 20 : narrow ? 14 : 17, fontWeight: '900' },
  summaryHint: { color: theme.colors.textMuted, fontSize: narrow ? 8 : 9 },
  summaryGap: { width: wide ? 88 : narrow ? 46 : 68, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 12, borderWidth: 1, borderColor: '#455765', backgroundColor: '#142331' },
  summaryGapValue: { color: theme.colors.text, fontSize: wide ? 16 : narrow ? 10 : 13, fontWeight: '900' },
  summaryGapLabel: { color: theme.colors.primary, fontSize: narrow ? 6 : 8, fontWeight: '900', letterSpacing: 0.4 },
});