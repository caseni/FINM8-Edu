import React, { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  selectAudienceCopy,
  selectLocalizedText,
  type LearningLanguage,
} from '../../domain/learning/presentation';
import type { LocalizedText, PracticalTask, PresentationMode } from '../../domain/learning/types';
import { defaultLearningTheme, type LearningTheme } from '../../theme/learningTheme';
import { BreakOfStructureVisual } from './BreakOfStructureVisual';
import { CandleAnatomyVisual } from './CandleAnatomyVisual';
import { ChangeOfCharacterVisual } from './ChangeOfCharacterVisual';
import { DiversificationVisual } from './DiversificationVisual';
import { FomoDecisionVisual } from './FomoDecisionVisual';
import { LearningVisual } from './LearningVisual';
import { OvertradingDecisionVisual } from './OvertradingDecisionVisual';
import { PositionSizingVisual } from './PositionSizingVisual';
import { RiskRewardVisual } from './RiskRewardVisual';
import { StopOrderVisual } from './StopOrderVisual';
import { SupportResistanceZoneVisual } from './SupportResistanceZoneVisual';
import { TrendStructureVisual } from './TrendStructureVisual';
import { VolatilityRangeVisual } from './VolatilityRangeVisual';

export interface PracticalTaskPlayerProps {
  task: PracticalTask;
  language: LearningLanguage;
  presentationMode: PresentationMode;
  theme?: LearningTheme;
  onComplete: (passed: boolean, selectedEvidence: readonly string[]) => void;
  completionLabel?: LocalizedText;
  eyebrow?: LocalizedText;
}

export function PracticalTaskPlayer({
  task,
  language,
  presentationMode,
  theme = defaultLearningTheme,
  onComplete,
  completionLabel,
  eyebrow,
}: PracticalTaskPlayerProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const completionLocked = useRef(false);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const choices = task.choices ?? [];
  const expected = [...task.expectedEvidence].sort();
  const actual = [...selected].sort();
  const passed =
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index]);
  const isCandleAnatomyVisual =
    task.assetRef?.includes('candle-ohlc') || task.assetRef?.includes('bir-mum');
  const isTrendStructureVisual =
    task.assetRef?.includes('trend-structure') || task.assetRef?.includes('trend-yon-mu-yapi-mi');
  const isSupportResistanceZoneVisual =
    task.assetRef?.includes('support-resistance-zone') || task.assetRef?.includes('destek-direnc-bolgedir');
  const isBreakOfStructureVisual = task.assetRef?.includes('bos-starter') ?? false;
  const isChangeOfCharacterVisual = task.assetRef?.includes('choch') ?? false;
  const isVolatilityRangeVisual = task.assetRef?.includes('volatility-range') ?? false;
  const isPositionSizingVisual = task.conceptKey === 'risk.position_sizing';
  const isRiskRewardVisual = task.conceptKey === 'risk.risk_reward';
  const isStopOrderVisual = task.conceptKey === 'risk.stop_orders';
  const isDiversificationVisual = task.conceptKey === 'portfolio.diversification';
  const isFomoDecisionVisual = task.conceptKey === 'behavior.fomo';
  const isOvertradingDecisionVisual = task.conceptKey === 'behavior.overtrading';

  const toggle = (choiceId: string) => {
    if (checked) return;
    setSelected((current) =>
      current.includes(choiceId)
        ? current.filter((item) => item !== choiceId)
        : [...current, choiceId]
    );
  };

  const action = () => {
    if (completionLocked.current) return;
    if (!checked) {
      setChecked(true);
      return;
    }
    if (passed) {
      completionLocked.current = true;
      onComplete(true, selected);
      return;
    }
    setSelected([]);
    setChecked(false);
  };

  const actionLabel = !checked
    ? language === 'tr' ? 'Kontrol et' : 'Check'
    : passed
      ? completionLabel
        ? selectLocalizedText(completionLabel, language)
        : language === 'tr' ? 'Quiz’e geç' : 'Continue to quiz'
      : language === 'tr' ? 'Tekrar dene' : 'Try again';

  return (
    <View style={styles.shell}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
      <Text style={styles.eyebrow}>
        {eyebrow
          ? selectLocalizedText(eyebrow, language)
          : task.kind === 'chart_identification'
            ? language === 'tr' ? 'GRAFİK GÖREVİ' : 'CHART TASK'
            : language === 'tr' ? 'SENARYO GÖREVİ' : 'SCENARIO TASK'}
      </Text>
      <Text style={styles.prompt}>
        {selectAudienceCopy(task.prompt, presentationMode, language)}
      </Text>
      {isPositionSizingVisual ? (
        <PositionSizingVisual
          alt={language === 'tr'
            ? 'Aynı risk bütçesinde dar ve geniş risk mesafesine göre pozisyon büyüklüğünün değişmesini gösteren eğitim görseli'
            : 'Training visual showing position size changing with tighter and wider risk distance under the same risk budget'}
          language={language}
          theme={theme}
        />
      ) : isRiskRewardVisual ? (
        <RiskRewardVisual
          alt={language === 'tr'
            ? 'Yüksek risk getiri oranının olasılık ve maliyet bilgisi olmadan tek başına yeterli olmadığını gösteren eğitim görseli'
            : 'Training visual showing that a high risk reward ratio is insufficient without probability and cost information'}
          language={language}
          theme={theme}
        />
      ) : isStopOrderVisual ? (
        <StopOrderVisual
          alt={language === 'tr'
            ? 'Stop seviyesinin yalnız tetikleyici olduğunu ve hızlı piyasada gerçekleşme fiyatının farklılaşabileceğini gösteren eğitim görseli'
            : 'Training visual showing that the stop level is only a trigger and the execution price can differ in a fast market'}
          language={language}
          theme={theme}
        />
      ) : isDiversificationVisual ? (
        <DiversificationVisual
          alt={language === 'tr'
            ? 'Çok sayıda benzer varlığın aynı risk kaynağına bağlı kalabildiğini ve farklı risk kaynaklarına yayılmanın yoğunlaşmayı azaltabildiğini gösteren eğitim görseli'
            : 'Training visual showing that many similar assets can share one risk source while spreading across different risk sources can reduce concentration'}
          language={language}
          theme={theme}
        />
      ) : isFomoDecisionVisual ? (
        <FomoDecisionVisual
          alt={language === 'tr'
            ? 'Yükselen fiyat ve sosyal baskı karşısında dürtüsel karar ile dur planı kontrol et ve karşı kanıt ara akışını karşılaştıran FOMO eğitim görseli'
            : 'FOMO training visual comparing an impulsive decision under rising price and social pressure with pause, plan check, and counter-evidence steps'}
          language={language}
          theme={theme}
        />
      ) : isOvertradingDecisionVisual ? (
        <OvertradingDecisionVisual
          alt={language === 'tr'
            ? 'Kayıp sonrası acele tekrar giriş ve kriter değiştirme döngüsünü dur plan kanıt ve risk kontrolleriyle karşılaştıran aşırı işlem eğitim görseli'
            : 'Overtrading training visual comparing rushed re-entry and changing criteria after a loss with pause, plan, evidence, and risk checks'}
          language={language}
          theme={theme}
        />
      ) : task.kind === 'chart_identification' ? (
        task.assetRef ? (
          isCandleAnatomyVisual ? (
            <CandleAnatomyVisual
              alt={language === 'tr'
                ? 'Açılış, kapanış, en yüksek ve en düşük seviyeleri gösteren eğitim mumu'
                : 'Training candle showing open, close, high, and low levels'}
              language={language}
              theme={theme}
            />
          ) : isTrendStructureVisual ? (
            <TrendStructureVisual
              alt={language === 'tr'
                ? 'Yükseliş, düşüş ve yatay salınım dizilerini karşılaştıran eğitim grafiği'
                : 'Training chart comparing upward, downward, and sideways swing sequences'}
              language={language}
              theme={theme}
            />
          ) : isSupportResistanceZoneVisual ? (
            <SupportResistanceZoneVisual
              alt={language === 'tr'
                ? 'Birden fazla tepkinin aynı destek ve direnç alanlarında toplandığını gösteren eğitim görseli'
                : 'Training visual showing multiple reactions clustering in support and resistance areas'}
              language={language}
              theme={theme}
            />
          ) : isBreakOfStructureVisual ? (
            <BreakOfStructureVisual
              alt={language === 'tr'
                ? 'Fitil taşması ile anlamlı tepe üzerindeki teyit kapanışını karşılaştıran BOS eğitim görseli'
                : 'BOS training visual comparing a wick overshoot with a confirming close above a meaningful high'}
              language={language}
              theme={theme}
            />
          ) : isChangeOfCharacterVisual ? (
            <ChangeOfCharacterVisual
              alt={language === 'tr'
                ? 'Yükseliş yapısında korunan anlamlı dibin karşı yönlü kapanışla kaybedilmesini gösteren CHoCH eğitim görseli'
                : 'CHoCH training visual showing a meaningful protected low lost by an opposing structural close'}
              language={language}
              theme={theme}
            />
          ) : isVolatilityRangeVisual ? (
            <VolatilityRangeVisual
              alt={language === 'tr'
                ? 'Aynı başlangıç ve pozisyon büyüklüğünde dar ve geniş fiyat hareketlerini karşılaştıran volatilite eğitim görseli'
                : 'Volatility training visual comparing narrow and wide price movement with the same starting point and position size'}
              language={language}
              theme={theme}
            />
          ) : (
            <LearningVisual
              assetRef={task.assetRef}
              alt={language === 'tr' ? 'Eğitim amaçlı şematik görev grafiği' : 'Schematic training task chart'}
              language={language}
              theme={theme}
            />
          )
        ) : (
          <View style={styles.chart}><Text style={styles.chartLabel}>{language === 'tr' ? 'Eğitim amaçlı şematik grafik' : 'Schematic training chart'}</Text></View>
        )
      ) : (
        <View style={styles.scenarioPanel}>
          <Text style={styles.scenarioMark}>?</Text>
          <Text style={styles.scenarioText}>
            {language === 'tr' ? 'Senaryoyu değerlendir ve en güçlü seçeneği işaretle.' : 'Evaluate the scenario and choose the strongest answer.'}
          </Text>
        </View>
      )}
      <Text style={styles.helper}>
        {language === 'tr'
          ? `${task.expectedEvidence.length} doğru kanıtı seç.`
          : `Select ${task.expectedEvidence.length} correct ${task.expectedEvidence.length === 1 ? 'answer' : 'pieces of evidence'}.`}
      </Text>
      <View style={styles.choices}>
        {choices.map((choice) => {
          const isSelected = selected.includes(choice.id);
          const isExpected = checked && task.expectedEvidence.includes(choice.id);
          const isWrong = checked && isSelected && !isExpected;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: checked, selected: isSelected }}
              key={choice.id}
              onPress={() => toggle(choice.id)}
              style={[
                styles.choice,
                isSelected && styles.choiceSelected,
                isExpected && styles.choiceCorrect,
                isWrong && styles.choiceWrong,
              ]}
            >
              <View style={styles.choiceContent}>
                <Text style={[styles.choiceMark, isExpected && styles.choiceMarkCorrect, isWrong && styles.choiceMarkWrong]}>
                  {isExpected ? '✓' : isWrong ? '×' : isSelected ? '●' : '○'}
                </Text>
                <Text style={styles.choiceText}>{selectLocalizedText(choice.label, language)}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      {checked ? (
        <Text style={[styles.feedback, passed ? styles.feedbackPassed : styles.feedbackRetry]}>
          {passed
            ? language === 'tr' ? 'Doğru. Seçimin senaryodaki kanıtlarla uyumlu.' : 'Correct. Your selection matches the evidence in the scenario.'
            : language === 'tr' ? 'Henüz değil. Senaryodaki ipuçlarını birlikte değerlendir.' : 'Not yet. Evaluate the clues in the scenario together.'}
        </Text>
      ) : null}
        </View>
      </ScrollView>
      <View style={styles.footer}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        accessibilityState={{ disabled: selected.length === 0 }}
        disabled={selected.length === 0}
        onPress={action}
        style={[styles.button, selected.length === 0 && styles.disabled]}
      >
        <Text style={styles.buttonText}>{actionLabel}</Text>
      </Pressable>
      </View>
    </View>
  );
}

const createStyles = (theme: LearningTheme) =>
  StyleSheet.create({
    shell: { flex: 1, width: '100%' },
    scrollContent: { flexGrow: 1, width: '100%', padding: theme.spacing.md },
    container: { width: '100%', maxWidth: 760, alignSelf: 'center', gap: theme.spacing.md, padding: theme.spacing.lg, backgroundColor: theme.colors.surface, borderRadius: theme.radius.large, borderWidth: 1, borderColor: theme.colors.border },
    eyebrow: { color: theme.colors.primary, fontSize: 12, fontWeight: '900' },
    prompt: { color: theme.colors.text, fontSize: 23, lineHeight: 31, fontWeight: '800' },
    chart: { height: 190, overflow: 'hidden', backgroundColor: theme.colors.background, borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border },
    chartLabel: { position: 'absolute', left: 12, bottom: 8, color: theme.colors.textMuted, fontSize: 10 },
    scenarioPanel: { minHeight: 120, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, padding: theme.spacing.lg, backgroundColor: theme.colors.background, borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border },
    scenarioMark: { color: theme.colors.primary, fontSize: 38, fontWeight: '900' },
    scenarioText: { flex: 1, color: theme.colors.textMuted, fontSize: 15, lineHeight: 22 },
    helper: { color: theme.colors.textMuted, fontSize: 13 },
    choices: { gap: theme.spacing.sm },
    choice: { minHeight: 52, padding: theme.spacing.md, borderRadius: theme.radius.medium, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceMuted },
    choiceSelected: { borderColor: theme.colors.primary, borderWidth: 2 },
    choiceCorrect: { borderColor: theme.colors.success, borderWidth: 2 },
    choiceWrong: { borderColor: theme.colors.risk, borderWidth: 2 },
    choiceContent: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
    choiceMark: { width: 20, color: theme.colors.textMuted, fontSize: 15, lineHeight: 21, fontWeight: '900' },
    choiceMarkCorrect: { color: theme.colors.success },
    choiceMarkWrong: { color: theme.colors.risk },
    choiceText: { flex: 1, color: theme.colors.text, fontSize: 15, lineHeight: 21, fontWeight: '700' },
    feedback: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
    feedbackPassed: { color: theme.colors.success },
    feedbackRetry: { color: theme.colors.warning },
    footer: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderTopColor: theme.colors.border, borderTopWidth: 1, backgroundColor: theme.colors.background },
    button: { minHeight: 52, width: '100%', maxWidth: 760, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.md, borderRadius: theme.radius.medium, backgroundColor: theme.colors.primary },
    buttonText: { color: theme.colors.primaryText, fontSize: 16, fontWeight: '900' },
    disabled: { opacity: 0.35 },
  });
