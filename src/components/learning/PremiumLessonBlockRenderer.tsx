import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { selectAudienceCopy, type LearningLanguage } from '../../domain/learning/presentation';
import type { ContentBlock, PresentationMode } from '../../domain/learning/types';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import { LessonBlockRenderer } from './LessonBlockRenderer';
import { LessonSupportingVisual, type LessonSupportingVisualRole } from './LessonSupportingVisual';

type VisualBlock = Extract<ContentBlock, { kind: 'visual' }>;

interface SupportingVisual {
  readonly assetRef: string;
  readonly alt: string;
}

export interface PremiumLessonBlockRendererProps {
  block: ContentBlock;
  language: LearningLanguage;
  presentationMode: PresentationMode;
  theme?: LearningTheme;
  renderVisual?: (block: VisualBlock) => React.ReactNode;
  supportingVisual?: SupportingVisual;
}

const MARKET_EXAMPLES: readonly {
  match: string;
  tr: string;
  en: string;
}[] = [
  {
    match: 'fiyat-piyasada-nasil-olusur',
    tr: 'Bir alıcı 100 TL ödemeye, bir satıcı da 100 TL’ye satmaya razı olduğunda işlem 100 TL’den gerçekleşebilir. Sonraki alıcı 101 TL ödemeye razıysa yeni eşleşme daha yukarıda oluşabilir.',
    en: 'If a buyer is willing to pay 100 and a seller accepts 100, a trade can happen at 100. If the next buyer is willing to pay 101, the next match can form higher.',
  },
  {
    match: 'piyasa-araclari-ayni-degildir',
    tr: 'Bir BIST hissesini almak şirkete ortaklık anlamına gelir; altın almak ise şirkete ortak olmak değil, farklı bir varlık türüne maruz kalmaktır.',
    en: 'Buying a listed company share means owning part of a company; buying gold is exposure to a different asset type, not company ownership.',
  },
  {
    match: 'likidite-neden-onemlidir',
    tr: 'Çok işlem gören bir hissede küçük bir satış emri genellikle fiyatı az etkiler. Alıcının az olduğu bir üründe aynı satış emri fiyatı daha fazla oynatabilir.',
    en: 'In a heavily traded share, a small sell order usually has limited price impact. In a thin market, the same sell order can move price much more.',
  },
  {
    match: 'bid-ask-spread-nedir',
    tr: 'Alış 99,90 TL ve satış 100,10 TL ise aradaki 0,20 TL spread’dir. Hemen almak isteyen kişi satış tarafına, hemen satmak isteyen kişi alış tarafına yaklaşır.',
    en: 'If the bid is 99.90 and the ask is 100.10, the 0.20 difference is the spread. A buyer wanting immediate execution moves toward the ask; an immediate seller moves toward the bid.',
  },
  {
    match: 'piyasa-limit-stop-emirleri',
    tr: 'Bir hisse 100 TL civarındayken 100 TL’nin üstünden almak istemiyorsan limit emir fiyat sınırı koyar. Piyasa emri ise fiyat sınırından çok hızlı gerçekleşmeye öncelik verir.',
    en: 'If a share is around 100 and you do not want to buy above 100, a limit order sets a price ceiling. A market order prioritizes quick execution over a strict price limit.',
  },
  {
    match: 'gerceklesme-fiyati-kayma',
    tr: 'Ekranda 100,00 TL görürken hızlı piyasada emrin 100,15 TL’den gerçekleşebilir. Aradaki 0,15 TL fark kaymadır; ekrandaki fiyat gerçekleşme garantisi değildir.',
    en: 'You may see 100.00 on screen but execute at 100.15 in a fast market. The 0.15 difference is slippage; the displayed price is not an execution guarantee.',
  },
];

function roleForBlock(block: Exclude<ContentBlock, VisualBlock>): LessonSupportingVisualRole {
  if (block.kind === 'prompt') return 'hook';
  if (block.kind === 'misconception') return 'misconception';
  if (block.kind === 'callout') {
    if (block.tone === 'risk') return 'risk';
    if (block.tone === 'evidence') return 'practice';
  }
  return 'concept';
}

function labelForBlock(block: Exclude<ContentBlock, VisualBlock>, language: LearningLanguage): string | undefined {
  const tr = language === 'tr';
  if (block.kind === 'prompt') return tr ? 'BİR DÜŞÜN' : 'THINK FIRST';
  if (block.kind === 'explanation') return tr ? 'KISA MANTIK' : 'CORE IDEA';
  if (block.kind === 'misconception') return tr ? 'YAYGIN HATA' : 'COMMON MISTAKE';
  if (block.kind === 'callout' && block.tone === 'risk') return tr ? 'DİKKAT' : 'WATCH OUT';
  if (block.kind === 'callout' && block.tone === 'evidence') return tr ? 'PRATİK NOT' : 'PRACTICAL NOTE';
  return undefined;
}

function exampleForAsset(assetRef: string, language: LearningLanguage): string | undefined {
  const match = MARKET_EXAMPLES.find((entry) => assetRef.includes(entry.match));
  return match ? match[language] : undefined;
}

export function PremiumLessonBlockRenderer({
  block,
  language,
  presentationMode,
  theme = defaultLearningTheme,
  renderVisual,
  supportingVisual,
}: PremiumLessonBlockRendererProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const styles = createStyles(theme, wide);

  if (block.kind === 'visual') {
    const example = exampleForAsset(block.assetRef, language);
    return (
      <View style={styles.visualStep}>
        <LessonBlockRenderer
          block={block}
          language={language}
          presentationMode={presentationMode}
          theme={theme}
          renderVisual={renderVisual}
          supportingVisual={supportingVisual}
        />
        {example ? (
          <View style={styles.exampleCard}>
            <Text style={styles.exampleEyebrow}>{language === 'tr' ? 'MİNİ ÖRNEK' : 'MINI EXAMPLE'}</Text>
            <Text style={styles.exampleText}>{example}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  if (block.kind === 'bullet_list') {
    return (
      <View style={styles.block}>
        {block.title ? <Text style={styles.sectionTitle}>{selectAudienceCopy(block.title, presentationMode, language)}</Text> : null}
        <View style={styles.bulletList}>
          {block.items.map((item, index) => (
            <View key={`${block.id}.${index}`} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.body}>{selectAudienceCopy(item, presentationMode, language)}</Text>
            </View>
          ))}
        </View>
        {supportingVisual ? (
          <LessonSupportingVisual assetRef={supportingVisual.assetRef} alt={supportingVisual.alt} language={language} role={roleForBlock(block)} theme={theme} />
        ) : null}
      </View>
    );
  }

  const copy = selectAudienceCopy(block.copy, presentationMode, language);
  const label = labelForBlock(block, language);
  const role = roleForBlock(block);
  const toneStyle = block.kind === 'misconception'
    ? styles.warningCard
    : block.kind === 'callout' && block.tone === 'risk'
      ? styles.riskCard
      : block.kind === 'callout' && block.tone === 'evidence'
        ? styles.evidenceCard
        : undefined;

  return (
    <View style={[styles.block, toneStyle]}>
      {label ? (
        <Text style={[
          styles.eyebrow,
          role === 'misconception' && styles.eyebrowWarning,
          role === 'risk' && styles.eyebrowRisk,
          role === 'practice' && styles.eyebrowPractice,
        ]}>{label}</Text>
      ) : null}
      <Text style={block.kind === 'prompt' ? styles.prompt : styles.body}>{copy}</Text>
      {supportingVisual ? (
        <View style={styles.visualFrame}>
          <LessonSupportingVisual
            assetRef={supportingVisual.assetRef}
            alt={supportingVisual.alt}
            language={language}
            role={role}
            theme={theme}
          />
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (theme: LearningTheme, wide: boolean) => StyleSheet.create({
  block: { gap: wide ? 18 : 14 },
  visualStep: { gap: 14 },
  eyebrow: { color: theme.colors.primary, fontSize: 11, lineHeight: 15, fontWeight: '900', letterSpacing: 0.9 },
  eyebrowWarning: { color: theme.colors.warning },
  eyebrowRisk: { color: theme.colors.risk },
  eyebrowPractice: { color: theme.colors.success },
  prompt: {
    color: theme.colors.text,
    fontSize: wide ? 30 : 24,
    lineHeight: wide ? 39 : 32,
    fontWeight: '900',
  },
  body: {
    color: theme.colors.text,
    fontSize: wide ? 20 : 17,
    lineHeight: wide ? 31 : 26,
    fontWeight: '500',
  },
  sectionTitle: { color: theme.colors.text, fontSize: wide ? 22 : 19, lineHeight: wide ? 30 : 26, fontWeight: '800' },
  bulletList: { gap: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletDot: { width: 7, height: 7, marginTop: wide ? 12 : 10, borderRadius: 4, backgroundColor: theme.colors.primary },
  visualFrame: { marginTop: 2 },
  warningCard: {
    padding: wide ? 20 : 16,
    borderRadius: theme.radius.medium,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.warning,
    backgroundColor: theme.colors.surfaceMuted,
  },
  riskCard: {
    padding: wide ? 20 : 16,
    borderRadius: theme.radius.medium,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.risk,
    backgroundColor: theme.colors.surfaceMuted,
  },
  evidenceCard: {
    padding: wide ? 20 : 16,
    borderRadius: theme.radius.medium,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.success,
    backgroundColor: theme.colors.surfaceMuted,
  },
  exampleCard: {
    gap: 7,
    paddingHorizontal: wide ? 18 : 15,
    paddingVertical: wide ? 15 : 13,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
  },
  exampleEyebrow: { color: theme.colors.primary, fontSize: 10, lineHeight: 14, fontWeight: '900', letterSpacing: 0.8 },
  exampleText: { color: theme.colors.text, fontSize: wide ? 17 : 15, lineHeight: wide ? 25 : 22, fontWeight: '600' },
});
