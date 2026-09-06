import { microLessonSchema } from './schemas';
import type { MicroLesson } from './types';

interface EnglishQuestionOverride {
  readonly prompt: string;
  readonly explanation: string;
  readonly options: Readonly<Record<string, string>>;
}

interface EnglishLessonOverride {
  readonly title: string;
  readonly objective: string;
  readonly hook: string;
  readonly explanation: string;
  readonly proExplanation?: string;
  readonly misconception: string;
  readonly takeaway: string;
  readonly visualAlt?: string;
  readonly taskPrompt: string;
  readonly taskChoices: Readonly<Record<string, string>>;
  readonly questions: readonly EnglishQuestionOverride[];
}

const BEHAVIOR_EVIDENCE_ENGLISH_OVERRIDES: Readonly<Record<string, EnglishLessonOverride>> = {
  'lesson.behavior.fomo.001': {
    title: 'How does FOMO distort a decision?',
    objective: 'Recognize signs that fear of missing out is affecting the decision process.',
    hook: 'Is the thought “If I do not enter now, I will never get another chance” evidence—or pressure?',
    explanation: 'FOMO is the pressure to rush a decision because other people appear to be profiting or because a rapidly rising price feels impossible to miss. The plan, risk limit, and counter-evidence can move into the background. The emotion itself is not the problem; the problem is when it replaces the decision process.',
    proExplanation: 'FOMO can combine with recency, social proof, and regret aversion. A predefined waiting period, entry criteria, and maximum risk create measurable friction between an impulse and an action.',
    misconception: 'Common mistake: treating a strong feeling of urgency as strong market evidence.',
    takeaway: 'Feeling urgency does not prove that an urgent decision is required.',
    visualAlt: 'Diagram comparing rapidly rising price and social pressure with a paused decision checklist.',
    taskPrompt: 'Which signs suggest that FOMO is influencing the decision?',
    taskChoices: {
      urgency: 'An unplanned “right now” pressure to act',
      others: 'Seeing other people profit and abandoning risk controls',
      checklist: 'Calmly checking predefined decision criteria',
      pause: 'Using a waiting period before making the decision',
    },
    questions: [
      {
        prompt: 'What is the main way FOMO can affect a decision?',
        explanation: 'FOMO can replace decision criteria with urgency and impulse.',
        options: {
          a: 'Create urgency that pushes the plan into the background',
          b: 'Automatically improve the quality of the data',
          c: 'Remove risk from the decision',
        },
      },
      {
        prompt: 'What can help manage FOMO?',
        explanation: 'Process rules create a checkpoint between emotion and action.',
        options: {
          a: 'Predefined criteria and a waiting period',
          b: 'Chasing every rising price',
          c: 'Removing the risk limit',
        },
      },
      {
        prompt: 'What does a strong feeling of urgency prove?',
        explanation: 'An emotion is an internal state, not external market evidence.',
        options: {
          a: 'By itself, it does not prove market direction',
          b: 'A certain price increase',
          c: 'A certain opportunity',
        },
      },
    ],
  },
  'lesson.behavior.overtrading.001': {
    title: 'How can you recognize overtrading?',
    objective: 'Recognize unplanned trading frequency and signs of impulsive decision-making.',
    hook: 'Does making more trades automatically mean learning more or getting better results?',
    explanation: 'Overtrading is not simply a high number of trades; it is when decisions become detached from the plan, evidence, and risk limits. Trying to win money back immediately after a loss, repeatedly changing criteria, and re-entering with weak evidence are important warning signs. More trades can increase both costs and exposure to mistakes.',
    proExplanation: 'Overtrading can be monitored through turnover, the rate of unplanned entries, cooldown violations, and evidence quality per decision. Gamification should reward patience and high-quality decision behavior rather than trading frequency.',
    misconception: 'Common mistake: confusing more screen time and more clicks with discipline.',
    takeaway: 'Trade count is not a success metric; decision quality and adherence to the plan matter more.',
    visualAlt: 'Diagram comparing a small number of planned decisions with a rapidly rising number of unplanned trades.',
    taskPrompt: 'Which are strong warning signs of overtrading risk?',
    taskChoices: {
      revenge: 'An unplanned attempt to win money back immediately after a loss',
      weak: 'Repeated entries before the criteria are actually met',
      planned: 'Following one predefined plan',
      pause: 'Respecting the cooldown period',
    },
    questions: [
      {
        prompt: 'What best describes overtrading?',
        explanation: 'Loss of process and context is more meaningful than the raw number of trades.',
        options: {
          a: 'Trades becoming detached from the plan and evidence',
          b: 'Making any two trades',
          c: 'Only making long-term investments',
        },
      },
      {
        prompt: 'What can more trading increase?',
        explanation: 'Each additional decision creates another opportunity for cost and error.',
        options: {
          a: 'Costs and exposure to mistakes',
          b: 'Guaranteed profit',
          c: 'Data accuracy',
        },
      },
      {
        prompt: 'What should FINM8 EDU avoid rewarding?',
        explanation: 'The reward system should not encourage users to take more financial risk.',
        options: {
          a: 'Trading frequency or profit',
          b: 'Quiz mastery',
          c: 'Evidence quality',
        },
      },
    ],
  },
  'lesson.behavior.confirmation-bias.001': {
    title: 'Are you only noticing evidence that proves you right?',
    objective: 'Explain confirmation bias and why a decision process should actively search for counter-evidence.',
    hook: 'After forming a view, could you be selecting only the news that supports it?',
    explanation: 'Confirmation bias is the tendency to seek information that supports an existing view and discount evidence that challenges it. A strong decision process asks not only “Why am I right?” but also “What evidence would show that I am wrong?” Recording observations separately from interpretations makes this error easier to see.',
    proExplanation: 'A pre-mortem, a disconfirming-evidence field, and predefined invalidation criteria can reduce the emotional cost of changing a thesis. Counter-evidence should not be rewritten after the outcome is known.',
    misconception: 'Common mistake: treating many same-direction sources as independent confirmation.',
    takeaway: 'A strong thesis does not avoid counter-evidence.',
    visualAlt: 'Diagram showing evidence that supports a view and evidence that challenges it being searched for together.',
    taskPrompt: 'Select two healthy checks for a bullish thesis.',
    taskChoices: {
      against: 'Deliberately search for data that challenges the thesis',
      invalidate: 'Write down the condition that would invalidate the thesis',
      'only-support': 'Follow only accounts that support the thesis',
      hide: 'Remove negative data from the record',
    },
    questions: [
      {
        prompt: 'What is confirmation bias?',
        explanation: 'The bias can affect what we search for, how we interpret it, and what we remember.',
        options: {
          a: 'Favoring information that supports the existing view',
          b: 'Verifying every source equally',
          c: 'Actively searching for counter-evidence',
        },
      },
      {
        prompt: 'Which question can reduce confirmation bias?',
        explanation: 'An invalidation condition brings counter-evidence into the process.',
        options: {
          a: 'What evidence would prove me wrong?',
          b: 'Who agrees with me?',
          c: 'How can I hide negative evidence?',
        },
      },
      {
        prompt: 'Are many accounts repeating the same information independent confirmation?',
        explanation: 'The number of accounts is not the same as the number of independent sources.',
        options: {
          a: 'No; repeated copies can still come from one underlying source',
          b: 'Yes; repetition automatically makes the evidence independent',
          c: 'Yes whenever the accounts have large follower counts',
        },
      },
    ],
  },
  'lesson.evidence.data-quality.001': {
    title: 'Not all data has the same quality',
    objective: 'Distinguish incomplete, inconsistent, and unverified data from reliable evidence.',
    hook: 'Does a number become reliable automatically just because it appears on a screen?',
    explanation: 'Data quality depends on the identity of the source, the measurement method, coverage, consistency, missing fields, and verifiability. A cropped screenshot or a number from an unknown source may lack the context needed for a decision. Missing data does not mean “there is no negative evidence”; it should be marked as unknown.',
    proExplanation: 'FINM8 carries evidence with provenance, provider, observedAt, market/timeframe scope, and quality flags. Before sources are combined, semantic compatibility and contradiction checks are required.',
    misconception: 'Common mistake: confusing numerical precision with data accuracy.',
    takeaway: 'Strong evidence is not the number that looks most precise; it is data whose source and context can be traced.',
    visualAlt: 'Diagram comparing stronger and weaker data using source, context, and missing-data checks.',
    taskPrompt: 'Which characteristics provide stronger evidence of data quality?',
    taskChoices: {
      source: 'The source and measurement method are known',
      scope: 'The market, timeframe, and observation time are stated',
      screenshot: 'A cropped screenshot with no identifiable source',
      precision: 'A highly precise number that cannot be verified',
    },
    questions: [
      {
        prompt: 'What is one of the most important characteristics of high-quality data?',
        explanation: 'Provenance and scope are necessary for verification.',
        options: {
          a: 'The source and scope can be traced',
          b: 'It is displayed with many colors',
          c: 'It contains many decimal places',
        },
      },
      {
        prompt: 'How should missing data be represented?',
        explanation: 'Missing information is a separate state and should not be filled with an assumption.',
        options: {
          a: 'As unknown or missing',
          b: 'Automatically as positive evidence',
          c: 'Always as an exact zero',
        },
      },
      {
        prompt: 'Does numerical precision guarantee accuracy?',
        explanation: 'A wrong measurement can still be written with many decimal places.',
        options: {
          a: 'No; precision and accuracy are different properties',
          b: 'Yes; more decimal places guarantee accuracy',
          c: 'Only when the number has eight decimal places',
        },
      },
    ],
  },
  'lesson.evidence.freshness.001': {
    title: 'When does correct data become stale?',
    objective: 'Evaluate evidence freshness in the context of the market and timeframe.',
    hook: 'Can data that was correct yesterday still be used for the same decision today?',
    explanation: 'Data can be correct when it is produced and still become stale quickly depending on the market, timeframe, and type of decision. Freshness is not just calendar age; it asks whether the conditions represented by the data are still valid. Every piece of evidence should be read together with its observation time and scope.',
    proExplanation: 'A freshness threshold can vary by source, timeframe, and market context. Stale data should be retained with observedAt and a stale flag rather than deleted or presented as if it were new.',
    misconception: 'Common mistake: assuming data remains valid indefinitely because the source is trustworthy.',
    takeaway: 'A reliable source can still provide stale data; the observation time is part of the evidence context.',
    visualAlt: 'Timeline showing the gap between observation time and now, and why stale data may need to be verified again.',
    taskPrompt: 'Which two pieces of information are needed when judging whether data is still fresh?',
    taskChoices: {
      observed: 'The observation time',
      scope: 'The relevant market and timeframe scope',
      logo: 'The color of the source branding',
      followers: 'The follower count of the person sharing it',
    },
    questions: [
      {
        prompt: 'What does evidence freshness depend on?',
        explanation: 'Different types of data lose relevance at different speeds.',
        options: {
          a: 'Time, source, market, and intended-use context',
          b: 'Only the file name',
          c: 'Nothing; trustworthy data stays fresh indefinitely',
        },
      },
      {
        prompt: 'How should stale data be presented?',
        explanation: 'Time information is essential for correct interpretation.',
        options: {
          a: 'With the observation time and stale status clearly visible',
          b: 'As if it were newly observed data',
          c: 'With the observation time removed',
        },
      },
      {
        prompt: 'Does a trustworthy source guarantee that its data is current?',
        explanation: 'Source reliability and observation freshness are different dimensions.',
        options: {
          a: 'No; reliable data can still become stale',
          b: 'Yes; source reliability makes time irrelevant',
          c: 'Only when the evidence is displayed on a chart',
        },
      },
    ],
  },
  'lesson.behavior.decision-journal.001': {
    title: 'Record decision quality, not just the outcome',
    objective: 'Record observation, interpretation, and outcome separately in a decision journal.',
    hook: 'Does a profitable result always mean a good decision, and a loss always mean a bad one?',
    explanation: 'A good decision can produce a bad outcome, and a bad decision can produce a good one. A decision journal separately records what was observed at the time, the interpretation drawn from it, counter-evidence, the risk boundary, and the outcome that occurred later. This makes it possible to review process quality instead of falling into outcome bias.',
    proExplanation: 'A decision record should contain an immutable decision-time snapshot, thesis, invalidation condition, evidence references, and evaluation horizon. Outcome data is added later; the original rationale should not be rewritten after the fact.',
    misconception: 'Common mistake: recording only the profit/loss amount and losing the evidence that existed when the decision was made.',
    takeaway: 'The outcome is learning data; decision quality is measured by the process that existed when the decision was made.',
    visualAlt: 'Diagram showing a concise decision-journal checklist for evidence, risk, and invalidation.',
    taskPrompt: 'Select two items that should be recorded at decision time in a decision journal.',
    taskChoices: {
      evidence: 'Observations and evidence references',
      invalidation: 'The condition that invalidates the thesis and the risk boundary',
      rewrite: 'Rewrite the original rationale after seeing the outcome',
      'profit-only': 'Record only the final profit or loss',
    },
    questions: [
      {
        prompt: 'What does a profitable outcome not guarantee?',
        explanation: 'Luck can temporarily reward a poor process.',
        options: {
          a: 'That the decision process was high quality',
          b: 'That an outcome occurred',
          c: 'That the decision can be recorded',
        },
      },
      {
        prompt: 'Why should observation and interpretation be recorded separately?',
        explanation: 'The separation makes interpretation errors and bias easier to identify.',
        options: {
          a: 'To avoid mixing raw evidence with the inference drawn from it',
          b: 'Only to make the journal longer',
          c: 'To guarantee the eventual outcome',
        },
      },
      {
        prompt: 'What should happen to the original decision rationale after the outcome is known?',
        explanation: 'An unchanged decision-time record provides a truthful basis for learning.',
        options: {
          a: 'Keep it unchanged and add the outcome separately',
          b: 'Rewrite it to match the result',
          c: 'Delete it completely',
        },
      },
    ],
  },
};

function localizeEnglish<T extends { readonly tr: string; readonly en?: string }>(value: T, en: string) {
  return { ...value, en };
}

export function normalizeBehaviorEvidenceEnglishEditorial(lesson: MicroLesson): MicroLesson {
  const override = BEHAVIOR_EVIDENCE_ENGLISH_OVERRIDES[lesson.id];
  if (!override) return lesson;

  const contentBlocks = lesson.contentBlocks.map((block) => {
    if (block.kind === 'prompt') {
      return {
        ...block,
        copy: {
          ...block.copy,
          normal: localizeEnglish(block.copy.normal, override.hook),
        },
      };
    }

    if (block.kind === 'explanation') {
      return {
        ...block,
        copy: {
          ...block.copy,
          normal: localizeEnglish(block.copy.normal, override.explanation),
          ...(block.copy.pro && override.proExplanation
            ? { pro: localizeEnglish(block.copy.pro, override.proExplanation) }
            : block.copy.pro
              ? { pro: block.copy.pro }
              : {}),
        },
      };
    }

    if (block.kind === 'misconception') {
      return {
        ...block,
        copy: {
          ...block.copy,
          normal: localizeEnglish(block.copy.normal, override.misconception),
        },
      };
    }

    if (block.kind === 'visual' && override.visualAlt) {
      return { ...block, alt: localizeEnglish(block.alt, override.visualAlt) };
    }

    return block;
  });

  const practicalTask = {
    ...lesson.practicalTask,
    prompt: {
      ...lesson.practicalTask.prompt,
      normal: localizeEnglish(lesson.practicalTask.prompt.normal, override.taskPrompt),
    },
    choices: lesson.practicalTask.choices?.map((choice) => ({
      ...choice,
      label: override.taskChoices[choice.id]
        ? localizeEnglish(choice.label, override.taskChoices[choice.id])
        : choice.label,
    })),
  };

  const questions = lesson.quiz.questions.map((question, index) => {
    const questionOverride = override.questions[index];
    if (!questionOverride) return question;

    return {
      ...question,
      prompt: localizeEnglish(question.prompt, questionOverride.prompt),
      explanation: localizeEnglish(question.explanation, questionOverride.explanation),
      options: question.options.map((option) => ({
        ...option,
        label: questionOverride.options[option.id]
          ? localizeEnglish(option.label, questionOverride.options[option.id])
          : option.label,
      })),
    };
  });

  return microLessonSchema.parse({
    ...lesson,
    title: localizeEnglish(lesson.title, override.title),
    learningObjective: localizeEnglish(lesson.learningObjective, override.objective),
    takeaway: localizeEnglish(lesson.takeaway, override.takeaway),
    contentBlocks,
    practicalTask,
    quiz: {
      ...lesson.quiz,
      questions,
    },
  });
}
