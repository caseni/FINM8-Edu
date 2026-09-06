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

const CORE_ENGLISH_OVERRIDES: Readonly<Record<string, EnglishLessonOverride>> = {
  'lesson.risk.position-sizing.001': {
    title: 'Why does position size come before the outcome?',
    objective: 'Explain how position size determines the impact of a loss on an account.',
    hook: 'Why can the same wrong decision barely affect one person but push another out of the game?',
    explanation: 'Position size determines how strongly a price move affects the account. Start with an acceptable amount of cash risk, then define the invalidation point and choose a size that fits that distance. A large position can turn even a small price move into a large loss.',
    proExplanation: 'In a simple framework, position quantity is related to accepted cash risk divided by the unit risk between entry and the risk boundary. Gaps, slippage, correlation, and leverage can make the realized loss larger than this estimate.',
    misconception: 'Common mistake: choosing the largest position available first and thinking about risk afterward.',
    takeaway: 'Position size is not a return tool; it is a limit on how much of the account is exposed to one decision.',
    visualAlt: 'Diagram showing how position size changes for tight and wide stop distances under the same risk limit.',
    taskPrompt: 'If the stop distance doubles while the cash-risk limit stays the same, which approach is more consistent?',
    taskChoices: {
      smaller: 'Reduce the position quantity',
      larger: 'Double the position quantity',
      ignore: 'Ignore the distance completely',
    },
    questions: [
      {
        prompt: 'What does position size affect most directly?',
        explanation: 'The same percentage price move produces different cash outcomes at different position sizes.',
        options: {
          a: 'The cash impact of a price move on the account',
          b: 'The direction of the market',
          c: 'The publication time of a news release',
        },
      },
      {
        prompt: 'Which sequence is more disciplined?',
        explanation: 'Position size should be derived from risk capacity that was defined in advance.',
        options: {
          a: 'Risk limit, invalidation distance, then appropriate position size',
          b: 'Maximum position size first, then think about risk',
          c: 'Consider only the expected return',
        },
      },
      {
        prompt: 'Why can realized risk still exceed the calculated amount?',
        explanation: 'Execution conditions can differ from the theoretical price level.',
        options: {
          a: 'Because of gaps, slippage, and liquidity conditions',
          b: 'Because the calculation always stops the market price',
          c: 'Because the risk boundary guarantees the fill price',
        },
      },
    ],
  },
  'lesson.risk.reward.001': {
    title: 'Is the risk/reward ratio enough by itself?',
    objective: 'Interpret the risk/reward ratio together with probability and execution uncertainty.',
    hook: 'Does risking one unit to target three units automatically make a trade good?',
    explanation: 'The risk/reward ratio compares the planned size of adverse and favorable outcomes; it does not tell you their probability. A distant target can show an attractive ratio on paper while having a low chance of being reached. The ratio should be interpreted together with evidence quality, probability, costs, and execution risk.',
    proExplanation: 'Positive expectancy requires both payoff size and outcome probability. Commissions, spread, slippage, and the distribution of tail losses can materially change the nominal R multiple.',
    misconception: 'Common mistake: treating a large stated target ratio as sufficient evidence of a high-quality decision.',
    takeaway: 'Risk/reward compares outcome sizes; by itself it does not measure probability or decision quality.',
    visualAlt: 'Diagram showing one unit of potential loss and two units of target while noting that probability must be assessed separately.',
    taskPrompt: 'A plan shows a 1:5 ratio on paper. Which two additional pieces of information are needed to evaluate it?',
    taskChoices: {
      probability: 'Evidence about the probability of the target and risk scenarios',
      costs: 'The effect of spread, commissions, and slippage',
      color: 'The chart background color',
      guarantee: 'An assumption that the ratio guarantees a profit',
    },
    questions: [
      {
        prompt: 'What does a risk/reward ratio compare?',
        explanation: 'The ratio compares the size of planned payoff outcomes.',
        options: {
          a: 'The planned loss size and gain size',
          b: 'The certain probability of success',
          c: 'Only the duration of the trade',
        },
      },
      {
        prompt: 'Why is a high ratio not sufficient by itself?',
        explanation: 'Probability and the realized execution outcome still need to be considered.',
        options: {
          a: 'Because it does not include outcome probability and implementation costs',
          b: 'Because a high ratio always produces a small gain',
          c: 'Because the ratio stops the market price',
        },
      },
      {
        prompt: 'What can make the realized ratio worse than the nominal ratio?',
        explanation: 'Costs can increase realized losses and reduce realized gains.',
        options: {
          a: 'Commissions, spread, and slippage',
          b: 'The lesson title',
          c: 'The badge color',
        },
      },
    ],
  },
  'lesson.risk.stop-orders.001': {
    title: 'Is a stop order a guarantee?',
    objective: 'Explain the trigger and execution limitations of stop orders.',
    hook: 'When you enter a stop price, is your maximum loss locked in with certainty?',
    explanation: 'A standard stop order is triggered when its stop level is reached and generally becomes a market order. During a fast move, gap, or low-liquidity period, the fill can be worse than the stop level. A stop-limit adds price control, but introduces the risk that the order may not fill at all.',
    proExplanation: 'A stop trigger and a fill are not the same event. Venue rules, trigger reference, latency, queue position, and order-book depth can affect execution, so a stop level is not a guaranteed maximum loss.',
    misconception: 'Common mistake: treating the stop price as a guaranteed exit price and a certain maximum loss.',
    takeaway: 'A stop is a risk-management tool, not a price guarantee; separate the trigger from the actual fill.',
    visualAlt: 'Diagram showing how the actual fill can differ when a fast price move crosses a stop level.',
    taskPrompt: 'If price gaps through the stop level during a fast decline, what is the most realistic expectation for a standard stop order?',
    taskChoices: {
      'worse-fill': 'It may fill at a worse price available in the market',
      guaranteed: 'It will definitely fill at the exact stop price entered',
      profit: 'It automatically turns the position into a profit',
    },
    questions: [
      {
        prompt: 'What does a standard stop order generally become after it is triggered?',
        explanation: 'The stop level is a trigger; a market order does not guarantee the execution price.',
        options: {
          a: 'A market order',
          b: 'A guaranteed-price order',
          c: 'A dividend order',
        },
      },
      {
        prompt: 'What is the main additional risk of a stop-limit order?',
        explanation: 'If price moves rapidly outside the limit, the order can remain unfilled.',
        options: {
          a: 'The limit condition can prevent the order from filling',
          b: 'It fills at every available price',
          c: 'It always creates a larger profit',
        },
      },
      {
        prompt: 'Does the stop level guarantee the maximum loss?',
        explanation: 'Gaps, slippage, and liquidity can change the actual execution price.',
        options: {
          a: 'No; execution can occur beyond the stop level',
          b: 'Yes; the stop level guarantees the maximum loss in every market',
          c: 'Only when the latest candle is bullish',
        },
      },
    ],
  },
  'lesson.portfolio.diversification.001': {
    title: 'More assets do not always mean more diversification',
    objective: 'Explain the difference between the number of holdings and genuine diversification of risk.',
    hook: 'If ten different crypto assets depend on the same risk factor, are you truly diversified?',
    explanation: 'Diversification aims to reduce dependence on any single source of loss by spreading capital across different investments. The number of holdings alone is not enough; concentration can remain when assets respond together to the same market, sector, or risk factor. Diversification does not eliminate losses.',
    proExplanation: 'Real diversification can be evaluated through marginal risk contribution, changing correlation across regimes, liquidity, and common-factor exposure. Correlations can rise during crises, so diversification may provide less protection than expected exactly when markets are stressed.',
    misconception: 'Common mistake: assuming that owning many similar assets automatically creates diversification.',
    takeaway: 'Diversification is not about counting assets; it is about spreading exposure across different sources of loss.',
    visualAlt: 'Comparison of a basket tied to one common factor with a basket spread across different risk factors.',
    taskPrompt: 'Which basket demonstrates stronger diversification logic?',
    taskChoices: {
      different: 'A basket spread across different instruments and risk sources',
      'same-sector': 'Ten very similar assets from the same sector',
      'one-asset': 'Full concentration in one asset',
    },
    questions: [
      {
        prompt: 'What is the core purpose of diversification?',
        explanation: 'Spreading investments aims to reduce the effect of concentration in one source of loss.',
        options: {
          a: 'Reduce dependence on a single source of loss',
          b: 'Guarantee that no loss can ever occur',
          c: 'Increase the number of holdings at random',
        },
      },
      {
        prompt: 'Why might ten similar assets still be poorly diversified?',
        explanation: 'Shared factor exposure can preserve concentration even when the number of holdings increases.',
        options: {
          a: 'They may react together to the same risk factor',
          b: 'Because ten is always too small a number',
          c: 'Because similar assets do not have charts',
        },
      },
      {
        prompt: 'What does diversification not guarantee?',
        explanation: 'A diversified portfolio can still lose during broad market or common-factor shocks.',
        options: {
          a: 'That losses will never occur',
          b: 'That risk sources can be spread',
          c: 'That a portfolio can contain more than one asset',
        },
      },
    ],
  },
};

function localizeEnglish<T extends { readonly tr: string; readonly en?: string }>(value: T, en: string) {
  return { ...value, en };
}

export function normalizeCoreEnglishEditorial(lesson: MicroLesson): MicroLesson {
  const override = CORE_ENGLISH_OVERRIDES[lesson.id];
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
