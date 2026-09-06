import type { LearningProfile, LearningStage, LocalizedText } from './types';

export type LearningGoal = LearningProfile['goals'][number];

export const LEARNING_STAGE_LABELS: Readonly<Record<LearningStage, LocalizedText>> = {
  foundation: { tr: 'Başlangıç seviyesi', en: 'Beginner level' },
  intermediate: { tr: 'Orta seviye', en: 'Intermediate level' },
  advanced: { tr: 'İleri seviye', en: 'Advanced level' },
};

export const LEARNING_GOAL_LABELS: Readonly<Record<LearningGoal, LocalizedText>> = {
  financial_literacy: { tr: 'Finansal okuryazarlık', en: 'Financial literacy' },
  investing: { tr: 'Yatırım', en: 'Investing' },
  trading: { tr: 'Trading', en: 'Trading' },
  risk_management: { tr: 'Risk yönetimi', en: 'Risk management' },
  portfolio_management: { tr: 'Portföy', en: 'Portfolio' },
  data_literacy: { tr: 'Veri okuryazarlığı', en: 'Data literacy' },
};

const STAGE_GUIDANCE: Readonly<Record<LearningStage, LocalizedText>> = {
  foundation: {
    tr: 'Önce ana fikri kendi cümlenle söyle; sonra örneğe geç.',
    en: 'State the main idea in your own words before moving to the example.',
  },
  intermediate: {
    tr: 'Teyit ile karşı kanıtı birlikte ara; tek işarete dayanma.',
    en: 'Look for confirmation and counter-evidence together; do not rely on one signal.',
  },
  advanced: {
    tr: 'Kanıtın kapsamını, geçersizlik koşulunu ve eksik veriyi ayrı değerlendir.',
    en: 'Evaluate evidence scope, invalidation conditions, and missing data separately.',
  },
};

const GOAL_REASONS: Readonly<Record<LearningGoal, LocalizedText>> = {
  financial_literacy: {
    tr: 'Finansal bilgiyi ezberlemeden doğru yorumlamana yardım eder.',
    en: 'It helps you interpret financial information correctly instead of memorizing it.',
  },
  investing: {
    tr: 'Yatırım kararlarında kanıt, belirsizlik ve risk ayrımını güçlendirir.',
    en: 'It strengthens the separation of evidence, uncertainty, and risk in investing decisions.',
  },
  trading: {
    tr: 'Planlı karar ile dürtüsel tepkiyi birbirinden ayırmana yardım eder.',
    en: 'It helps separate a planned decision from an impulsive reaction.',
  },
  risk_management: {
    tr: 'Sonuçtan önce risk sınırını ve karar sürecini düşünmeni sağlar.',
    en: 'It keeps risk limits and decision process ahead of outcomes.',
  },
  portfolio_management: {
    tr: 'Tek varlık yerine toplam portföy etkisini düşünme alışkanlığı kazandırır.',
    en: 'It builds the habit of considering total portfolio impact, not one asset alone.',
  },
  data_literacy: {
    tr: 'Kaynak, kapsam, güncellik ve veri kalitesini sorgulama becerini geliştirir.',
    en: 'It improves how you question source, scope, freshness, and data quality.',
  },
};

const GOAL_SKILLS: Readonly<Record<LearningGoal, readonly string[]>> = {
  financial_literacy: ['skill.market-foundations'],
  investing: ['skill.market-foundations', 'skill.risk-management', 'skill.behavior-evidence'],
  trading: ['skill.chart-literacy', 'skill.market-structure', 'skill.risk-management', 'skill.behavior-evidence'],
  risk_management: ['skill.risk-management', 'skill.behavior-evidence'],
  portfolio_management: ['skill.risk-management'],
  data_literacy: ['skill.chart-literacy', 'skill.market-structure', 'skill.behavior-evidence'],
};

export function getProfileGuidance(stage: LearningStage): LocalizedText {
  return STAGE_GUIDANCE[stage];
}

export function selectGoalForSkill(goals: readonly LearningGoal[], skillId: string): LearningGoal {
  return goals.find((goal) => GOAL_SKILLS[goal].includes(skillId)) ?? goals[0] ?? 'financial_literacy';
}

export function getGoalReason(goal: LearningGoal): LocalizedText {
  return GOAL_REASONS[goal];
}
