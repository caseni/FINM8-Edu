import type { LocalizedText } from './types';

export const CURRICULUM_DOMAIN_IDS = [
  'financial_literacy',
  'economics',
  'market_foundations',
  'investing',
  'chart_literacy',
  'technical_analysis',
  'risk_management',
  'portfolio_management',
  'fundamental_analysis',
  'crypto_onchain',
  'news_macro',
  'behavior_psychology',
  'probability_data',
  'algorithmic_trading',
  'ai_evidence',
  'finm8_literacy',
] as const;

export type CurriculumDomainId = (typeof CURRICULUM_DOMAIN_IDS)[number];

export interface CurriculumDomainDefinition {
  readonly id: CurriculumDomainId;
  readonly title: LocalizedText;
  readonly firstReleasePriority: 'core' | 'later' | 'advanced';
}

export const CURRICULUM_DOMAINS: Readonly<
  Record<CurriculumDomainId, CurriculumDomainDefinition>
> = {
  financial_literacy: {
    id: 'financial_literacy',
    title: { tr: 'Finansal okuryazarlık', en: 'Financial literacy' },
    firstReleasePriority: 'later',
  },
  economics: {
    id: 'economics',
    title: { tr: 'Ekonomi', en: 'Economics' },
    firstReleasePriority: 'later',
  },
  market_foundations: {
    id: 'market_foundations',
    title: { tr: 'Piyasa temelleri', en: 'Market foundations' },
    firstReleasePriority: 'core',
  },
  investing: {
    id: 'investing',
    title: { tr: 'Yatırım temelleri', en: 'Investing foundations' },
    firstReleasePriority: 'later',
  },
  chart_literacy: {
    id: 'chart_literacy',
    title: { tr: 'Grafik okuryazarlığı', en: 'Chart literacy' },
    firstReleasePriority: 'core',
  },
  technical_analysis: {
    id: 'technical_analysis',
    title: { tr: 'Teknik analiz', en: 'Technical analysis' },
    firstReleasePriority: 'core',
  },
  risk_management: {
    id: 'risk_management',
    title: { tr: 'Risk yönetimi', en: 'Risk management' },
    firstReleasePriority: 'core',
  },
  portfolio_management: {
    id: 'portfolio_management',
    title: { tr: 'Portföy yönetimi', en: 'Portfolio management' },
    firstReleasePriority: 'later',
  },
  fundamental_analysis: {
    id: 'fundamental_analysis',
    title: { tr: 'Temel analiz', en: 'Fundamental analysis' },
    firstReleasePriority: 'later',
  },
  crypto_onchain: {
    id: 'crypto_onchain',
    title: { tr: 'Kripto ve on-chain', en: 'Crypto and on-chain' },
    firstReleasePriority: 'later',
  },
  news_macro: {
    id: 'news_macro',
    title: { tr: 'Haber ve makro olaylar', en: 'News and macro events' },
    firstReleasePriority: 'later',
  },
  behavior_psychology: {
    id: 'behavior_psychology',
    title: { tr: 'Davranış ve psikoloji', en: 'Behavior and psychology' },
    firstReleasePriority: 'core',
  },
  probability_data: {
    id: 'probability_data',
    title: { tr: 'Olasılık ve veri', en: 'Probability and data' },
    firstReleasePriority: 'advanced',
  },
  algorithmic_trading: {
    id: 'algorithmic_trading',
    title: { tr: 'Algoritmik işlem', en: 'Algorithmic trading' },
    firstReleasePriority: 'advanced',
  },
  ai_evidence: {
    id: 'ai_evidence',
    title: { tr: 'AI ve kanıt değerlendirme', en: 'AI and evidence evaluation' },
    firstReleasePriority: 'later',
  },
  finm8_literacy: {
    id: 'finm8_literacy',
    title: { tr: 'FINM8 okuryazarlığı', en: 'FINM8 literacy' },
    firstReleasePriority: 'core',
  },
};

