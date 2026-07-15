import type { LearningConceptKey } from '../../concepts';
import { microLessonSchema } from '../../schemas';
import type { ContentSource, LearningStage, MicroLesson, PracticalTask } from '../../types';

interface ChoiceSpec {
  id: string;
  label: string;
}

interface QuestionSpec {
  prompt: string;
  choices: readonly ChoiceSpec[];
  correctId: string;
  explanation: string;
}

export interface FoundationLessonSpec {
  id: string;
  slug: string;
  conceptKey: LearningConceptKey;
  skillId: string;
  competencyId: string;
  title: string;
  objective: string;
  minutes: number;
  learningStage?: LearningStage;
  hook: string;
  explanation: string;
  proExplanation?: string;
  misconception: string;
  takeaway: string;
  prerequisiteConceptKeys: readonly LearningConceptKey[];
  relatedConceptKeys: readonly LearningConceptKey[];
  visualAlt?: string;
  taskPrompt: string;
  taskKind?: PracticalTask['kind'];
  taskAssetRef?: string;
  taskChoices: readonly ChoiceSpec[];
  taskCorrectIds: readonly string[];
  questions: readonly [QuestionSpec, QuestionSpec, QuestionSpec];
  sources: readonly ContentSource[];
}

export function createFoundationLesson(spec: FoundationLessonSpec): MicroLesson {
  const contentBlocks: MicroLesson['contentBlocks'] = [
    {
      id: `${spec.id}.prompt`,
      order: 0,
      audience: 'all',
      kind: 'prompt',
      copy: { normal: { tr: spec.hook } },
    },
    {
      id: `${spec.id}.explanation`,
      order: 1,
      audience: 'all',
      kind: 'explanation',
      copy: {
        normal: { tr: spec.explanation },
        ...(spec.proExplanation ? { pro: { tr: spec.proExplanation } } : {}),
      },
    },
    ...(spec.visualAlt
      ? [
          {
            id: `${spec.id}.visual`,
            order: 2,
            audience: 'all' as const,
            kind: 'visual' as const,
            assetRef: `edu://wave1/${spec.slug}`,
            alt: { tr: spec.visualAlt },
          },
        ]
      : []),
    {
      id: `${spec.id}.misconception`,
      order: 3,
      audience: 'all',
      kind: 'misconception',
      copy: { normal: { tr: spec.misconception } },
    },
    {
      id: `${spec.id}.safety`,
      order: 4,
      audience: 'all',
      kind: 'callout',
      tone: 'risk',
      copy: {
        normal: {
          tr: 'Bu bilgi bir işlemi önermez; karar öncesi ürün, piyasa ve gerçekleşme riskleri ayrıca değerlendirilmelidir.',
        },
      },
    },
  ];

  return microLessonSchema.parse({
    id: spec.id,
    slug: spec.slug,
    seriesId: `series.${spec.conceptKey}`,
    conceptKey: spec.conceptKey,
    skillId: spec.skillId,
    competencyIds: [spec.competencyId],
    title: { tr: spec.title },
    learningObjective: { tr: spec.objective },
    estimatedMinutes: spec.minutes,
    learningStage: spec.learningStage ?? 'foundation',
    accessTier: 'free',
    marketScopes: ['general'],
    prerequisiteConceptKeys: spec.prerequisiteConceptKeys,
    relatedConceptKeys: spec.relatedConceptKeys,
    contentBlocks,
    practicalTask: {
      id: `task.${spec.slug}.001`,
      kind: spec.taskKind ?? 'scenario_choice',
      conceptKey: spec.conceptKey,
      prompt: { normal: { tr: spec.taskPrompt } },
      ...(spec.taskAssetRef ? { assetRef: spec.taskAssetRef } : {}),
      choices: spec.taskChoices.map((choice) => ({
        id: choice.id,
        label: { tr: choice.label },
      })),
      evaluationRule: 'exact',
      expectedEvidence: spec.taskCorrectIds,
    },
    quiz: {
      id: `quiz.${spec.slug}.001`,
      passingScore: 67,
      questions: spec.questions.map((question, index) => ({
        id: `question.${spec.slug}.${index + 1}`,
        kind: 'single_choice',
        conceptKey: spec.conceptKey,
        prompt: { tr: question.prompt },
        options: question.choices.map((choice) => ({
          id: choice.id,
          label: { tr: choice.label },
        })),
        correctOptionId: question.correctId,
        explanation: { tr: question.explanation },
      })),
    },
    takeaway: { tr: spec.takeaway },
    sources: spec.sources,
    contentVersion: {
      version: '0.1.0',
      status: 'draft',
      canonicalLanguage: 'tr',
      authoredAt: '2026-07-15T18:00:00+03:00',
      riskDisclaimer: {
        tr: 'Bu içerik eğitim amaçlıdır ve yatırım tavsiyesi değildir.',
      },
    },
  });
}
