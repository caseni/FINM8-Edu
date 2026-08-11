import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LearningLanguage } from '../../domain/learning/presentation';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import { AlgoQuantSlideVisual, isAlgoQuantSlideAsset } from './AlgoQuantSlideVisual';
import { BehaviorEvidenceSlideVisual, isBehaviorEvidenceSlideAsset } from './BehaviorEvidenceSlideVisual';
import { ChartLessonSlideVisual, isChartLessonSlideAsset } from './ChartLessonSlideVisual';
import { EconomyExpansionSlideVisual, isEconomyExpansionSlideAsset } from './EconomyExpansionSlideVisual';
import { EconomySlideVisual, isEconomySlideAsset } from './EconomySlideVisual';
import { FinancialMarketsExpansionSlideVisual, isFinancialMarketsExpansionSlideAsset } from './FinancialMarketsExpansionSlideVisual';
import { FinancialMarketsSlideVisual, isFinancialMarketsSlideAsset } from './FinancialMarketsSlideVisual';
import { FundamentalAnalysisExpansionSlideVisual, isFundamentalAnalysisExpansionSlideAsset } from './FundamentalAnalysisExpansionSlideVisual';
import { FundamentalAnalysisSlideVisual, isFundamentalAnalysisSlideAsset } from './FundamentalAnalysisSlideVisual';
import { LearningVisual } from './LearningVisual';
import { isMarketFoundationSlideAsset, MarketFoundationSlideVisual } from './MarketFoundationSlideVisual';
import { isMarketPsychologySlideAsset, MarketPsychologySlideVisual } from './MarketPsychologySlideVisual';
import { isRiskLessonSlideAsset, RiskLessonSlideVisual } from './RiskLessonSlideVisual';
import { isRiskPortfolioExpansionSlideAsset, RiskPortfolioExpansionSlideVisual } from './RiskPortfolioExpansionSlideVisual';
import { isRiskPortfolioSlideAsset, RiskPortfolioSlideVisual } from './RiskPortfolioSlideVisual';
import { isStrategySlideAsset, StrategySlideVisual } from './StrategySlideVisual';
import { isTechnicalAnalysisExpansionSlideAsset, TechnicalAnalysisExpansionSlideVisual } from './TechnicalAnalysisExpansionSlideVisual';
import { isTechnicalAnalysisSlideAsset, TechnicalAnalysisSlideVisual } from './TechnicalAnalysisSlideVisual';

export type LessonSupportingVisualRole = 'hook' | 'concept' | 'practice' | 'misconception' | 'risk' | 'summary';
export interface LessonSupportingVisualProps { assetRef: string; alt: string; language: LearningLanguage; role: LessonSupportingVisualRole; theme?: LearningTheme; }

const ROLE_LABELS: Readonly<Record<LessonSupportingVisualRole, { tr: string; en: string }>> = {
  hook: { tr: 'GÖRSEL İPUCU', en: 'VISUAL CUE' }, concept: { tr: 'KAVRAM GÖRSELİ', en: 'CONCEPT VISUAL' },
  practice: { tr: 'PRATİK BAĞLAM', en: 'PRACTICAL CONTEXT' }, misconception: { tr: 'YAYGIN HATA', en: 'COMMON MISTAKE' },
  risk: { tr: 'RİSK BAĞLAMI', en: 'RISK CONTEXT' }, summary: { tr: 'DERS ÖZETİ', en: 'LESSON SUMMARY' },
};

export function LessonSupportingVisual({ assetRef, alt, language, role, theme = defaultLearningTheme }: LessonSupportingVisualProps) {
  const styles = createStyles(theme);
  const label = ROLE_LABELS[role][language];
  const labelStyle = role === 'misconception' ? styles.warningLabel : role === 'risk' ? styles.riskLabel : role === 'practice' ? styles.successLabel : role === 'hook' || role === 'summary' ? styles.primaryLabel : undefined;
  const visual = isMarketFoundationSlideAsset(assetRef) ? <MarketFoundationSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isChartLessonSlideAsset(assetRef) ? <ChartLessonSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isRiskLessonSlideAsset(assetRef) ? <RiskLessonSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isBehaviorEvidenceSlideAsset(assetRef) ? <BehaviorEvidenceSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isEconomySlideAsset(assetRef) ? <EconomySlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isEconomyExpansionSlideAsset(assetRef) ? <EconomyExpansionSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isFinancialMarketsSlideAsset(assetRef) ? <FinancialMarketsSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isFinancialMarketsExpansionSlideAsset(assetRef) ? <FinancialMarketsExpansionSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isTechnicalAnalysisSlideAsset(assetRef) ? <TechnicalAnalysisSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isTechnicalAnalysisExpansionSlideAsset(assetRef) ? <TechnicalAnalysisExpansionSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isFundamentalAnalysisSlideAsset(assetRef) ? <FundamentalAnalysisSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isFundamentalAnalysisExpansionSlideAsset(assetRef) ? <FundamentalAnalysisExpansionSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isRiskPortfolioSlideAsset(assetRef) ? <RiskPortfolioSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isRiskPortfolioExpansionSlideAsset(assetRef) ? <RiskPortfolioExpansionSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isMarketPsychologySlideAsset(assetRef) ? <MarketPsychologySlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isStrategySlideAsset(assetRef) ? <StrategySlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : isAlgoQuantSlideAsset(assetRef) ? <AlgoQuantSlideVisual assetRef={assetRef} alt={alt} language={language} role={role} theme={theme} />
    : <LearningVisual assetRef={`${assetRef}#${role}`} alt={alt} language={language} theme={theme} />;
  return <View style={styles.wrapper}><Text style={[styles.eyebrow, labelStyle]}>{label}</Text>{visual}</View>;
}

const createStyles = (theme: LearningTheme) => StyleSheet.create({
  wrapper: { gap: theme.spacing.sm, marginTop: theme.spacing.xs }, eyebrow: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  primaryLabel: { color: theme.colors.primary }, successLabel: { color: theme.colors.success }, warningLabel: { color: theme.colors.warning }, riskLabel: { color: theme.colors.risk },
});
