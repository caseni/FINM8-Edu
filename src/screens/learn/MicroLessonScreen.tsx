import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LessonPlayer } from '../../components/learning';
import { BeginnerAppliedChartStoryVisual, isBeginnerAppliedChartStoryAsset } from '../../components/learning/BeginnerAppliedChartStoryVisual';
import { BeginnerChartStoryVisual } from '../../components/learning/BeginnerChartStoryVisual';
import { BeginnerCoreChartStoryVisual, isBeginnerCoreChartStoryAsset } from '../../components/learning/BeginnerCoreChartStoryVisual';
import { BeginnerEconomyStoryVisual } from '../../components/learning/BeginnerEconomyStoryVisual';
import { BeginnerMarketStoryVisual } from '../../components/learning/BeginnerMarketStoryVisual';
import { BeginnerRiskStoryVisual } from '../../components/learning/BeginnerRiskStoryVisual';
import { getMicroLessonById } from '../../domain/learning/catalog';
import { selectLocalizedText, type LearningLanguage } from '../../domain/learning/presentation';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useLearningUiStore } from '../../store/useLearningUiStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MicroLesson'>;

const BEGINNER_ECONOMY_LESSON_IDS = new Set([
  'lesson.economy.inflation.001',
  'lesson.economy.interest-rates.001',
  'lesson.economy.central-banks.001',
  'lesson.economy.monetary-policy.001',
  'lesson.economy.growth.001',
  'lesson.economy.business-cycle.001',
]);

const BEGINNER_MARKET_LESSON_IDS = new Set([
  'lesson.market.price-formation.001',
  'lesson.market.instruments.001',
  'lesson.market.liquidity.001',
  'lesson.market.bid-ask.001',
  'lesson.market.order-types.001',
  'lesson.market.slippage.001',
]);

const BEGINNER_CHART_LESSON_IDS = new Set([
  'lesson.chart.candles.001',
  'lesson.chart.timeframes.001',
  'lesson.chart.trend.001',
  'lesson.chart.support-resistance.001',
  'lesson.technical.momentum.001',
  'lesson.technical.moving-average.001',
]);

const BEGINNER_RISK_LESSON_IDS = new Set([
  'lesson.risk.uncertainty.001',
  'lesson.risk.volatility.001',
  'lesson.risk.position-sizing.001',
  'lesson.risk.reward.001',
  'lesson.risk.stop-orders.001',
  'lesson.portfolio.diversification.001',
]);

export function MicroLessonScreen({ route, navigation }: Props) {
  const lesson = getMicroLessonById(route.params.lessonId);
  const rawLanguage = useLanguageStore((state) => state.language);
  const language: LearningLanguage = rawLanguage === 'en' ? 'en' : 'tr';
  const presentationMode = useLearningUiStore((state) => state.presentationMode);
  const checkpoint = useLearningProgressStore((state) => state.lessonCheckpoints[route.params.lessonId]);
  const saveLessonCheckpoint = useLearningProgressStore((state) => state.saveLessonCheckpoint);
  const completeCurrentQuizReview = useLearningProgressStore(
    (state) => state.completeCurrentQuizReview
  );
  const currentQuizReview = route.params.currentQuizReview;
  const isReadOnlyReview = route.params.review || Boolean(currentQuizReview);
  const navigationState = navigation.getState();
  const previousRoute = navigationState.routes[navigationState.index - 1];
  const openedFromAcademy = route.params.source === 'academy' || previousRoute?.name === 'Academy';

  useEffect(() => {
    if (lesson && !isReadOnlyReview && !checkpoint) {
      saveLessonCheckpoint(lesson.id, 'lesson', 0);
    }
  }, [checkpoint, isReadOnlyReview, lesson, saveLessonCheckpoint]);

  if (!lesson) return <View><Text>Ders bulunamadı.</Text></View>;

  const useBeginnerEconomyVisual = !openedFromAcademy && BEGINNER_ECONOMY_LESSON_IDS.has(lesson.id);
  const useBeginnerMarketVisual = !openedFromAcademy && BEGINNER_MARKET_LESSON_IDS.has(lesson.id);
  const useBeginnerChartVisual = !openedFromAcademy && BEGINNER_CHART_LESSON_IDS.has(lesson.id);
  const useBeginnerRiskVisual = !openedFromAcademy && BEGINNER_RISK_LESSON_IDS.has(lesson.id);

  return (
    <LessonPlayer
      lesson={lesson}
      language={language}
      presentationMode={presentationMode}
      renderVisual={
        useBeginnerEconomyVisual
          ? (block) => (
              <BeginnerEconomyStoryVisual
                assetRef={block.assetRef}
                alt={selectLocalizedText(block.alt, language)}
                language={language}
                role="practice"
              />
            )
          : useBeginnerRiskVisual
            ? (block) => (
                <BeginnerRiskStoryVisual
                  assetRef={block.assetRef}
                  alt={selectLocalizedText(block.alt, language)}
                  language={language}
                  role="practice"
                />
              )
            : useBeginnerChartVisual
              ? (block) => {
                  const alt = selectLocalizedText(block.alt, language);
                  if (isBeginnerCoreChartStoryAsset(block.assetRef)) {
                    return (
                      <BeginnerCoreChartStoryVisual
                        assetRef={block.assetRef}
                        alt={alt}
                        language={language}
                        role="practice"
                      />
                    );
                  }
                  if (isBeginnerAppliedChartStoryAsset(block.assetRef)) {
                    return (
                      <BeginnerAppliedChartStoryVisual
                        assetRef={block.assetRef}
                        alt={alt}
                        language={language}
                        role="practice"
                      />
                    );
                  }
                  return (
                    <BeginnerChartStoryVisual
                      assetRef={block.assetRef}
                      alt={alt}
                      language={language}
                      role="practice"
                    />
                  );
                }
              : useBeginnerMarketVisual
                ? (block) => (
                    <BeginnerMarketStoryVisual
                      assetRef={block.assetRef}
                      alt={selectLocalizedText(block.alt, language)}
                      language={language}
                      role="practice"
                    />
                  )
                : undefined
      }
      initialStepIndex={isReadOnlyReview ? 0 : checkpoint?.stepIndex ?? 0}
      onStepChange={(stepIndex) => {
        if (!isReadOnlyReview) saveLessonCheckpoint(lesson.id, 'lesson', stepIndex);
      }}
      assessmentLabel={
        currentQuizReview
          ? { tr: 'Tekrarı tamamla', en: 'Complete review' }
          : route.params.review
            ? { tr: 'Önizlemeyi kapat', en: 'Close preview' }
            : undefined
      }
      onExit={() => navigation.goBack()}
      onStartAssessment={() => {
        if (currentQuizReview) {
          completeCurrentQuizReview({
            conceptKey: currentQuizReview.conceptKey,
            lessonId: lesson.id,
            reviewedEvidenceThroughAt:
              currentQuizReview.reviewedEvidenceThroughAt,
            completedAt: new Date().toISOString(),
          });
          navigation.goBack();
          return;
        }
        if (route.params.review) {
          navigation.goBack();
          return;
        }
        saveLessonCheckpoint(lesson.id, 'task', checkpoint?.stepIndex ?? 0);
        navigation.replace('PracticalTask', { lessonId: lesson.id });
      }}
    />
  );
}