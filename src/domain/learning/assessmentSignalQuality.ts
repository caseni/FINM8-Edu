import { microLessonSchema } from './schemas';
import type { LocalizedText, MicroLesson } from './types';

const BINARY_LABELS_TR = new Set([
  'evet',
  'hayır',
  'her zaman',
  'asla',
  'imkânsızdır',
  'genellikle evet',
  'genellikle hayır',
]);

const BINARY_LABELS_EN = new Set([
  'yes',
  'no',
  'always',
  'never',
  'impossible',
  'generally yes',
  'generally no',
]);

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR').replace(/[.!?;:,]/g, '');
}

function withTerminalPunctuation(value: string): string {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function contextualCorrectLabel(
  original: LocalizedText,
  explanation: LocalizedText,
): LocalizedText {
  const trPrefix = normalize(original.tr).startsWith('hayır') ? 'Hayır' : 'Evet';
  const enOriginal = original.en?.trim().toLowerCase() ?? '';
  const enPrefix = enOriginal.startsWith('no') || trPrefix === 'Hayır' ? 'No' : 'Yes';

  return {
    tr: `${trPrefix}; ${withTerminalPunctuation(explanation.tr)}`,
    en: explanation.en
      ? `${enPrefix}; ${withTerminalPunctuation(explanation.en)}`
      : original.en,
  };
}

function contextualWrongBinaryLabel(original: LocalizedText): LocalizedText {
  const tr = normalize(original.tr);
  const en = original.en ? original.en.trim().toLowerCase() : undefined;

  if (tr === 'hayır' || tr === 'genellikle hayır') {
    return {
      tr: 'Hayır; bu unsurun sonuç veya yorum üzerinde anlamlı etkisi olmadığını varsaymak',
      en: en ? 'No; assume this factor has no meaningful effect on the outcome or interpretation' : original.en,
    };
  }
  if (tr === 'evet' || tr === 'genellikle evet') {
    return {
      tr: 'Evet; bu ilişkiyi bağlamdan bağımsız ve kesin bir kural kabul etmek',
      en: en ? 'Yes; treat the relationship as a certain rule regardless of context' : original.en,
    };
  }
  if (tr === 'her zaman') {
    return {
      tr: 'Her zaman; koşullar ve istisnalar değişse bile sonucun aynı olacağını varsaymak',
      en: en ? 'Always; assume the same outcome regardless of conditions or exceptions' : original.en,
    };
  }
  if (tr === 'asla' || tr === 'imkânsızdır') {
    return {
      tr: 'Asla; koşullar değişse bile bunun gerçekleşemeyeceğini varsaymak',
      en: en ? 'Never; assume it cannot occur even when conditions change' : original.en,
    };
  }

  return original;
}

function replaceTrivialDistractor(label: LocalizedText): LocalizedText {
  if (/grafik rengi|mumun yeşil/i.test(label.tr)) {
    return {
      tr: 'Yüzeysel görsel biçimi kavramın ana nedeni veya yeterli kanıtı saymak',
      en: label.en
        ? 'Treat superficial visual appearance as the main cause or sufficient evidence'
        : label.en,
    };
  }

  if (/logo/i.test(label.tr)) {
    return {
      tr: 'Ürünün marka görünümünü ekonomik veya teknik mekanizmadan daha belirleyici saymak',
      en: label.en
        ? 'Treat branding appearance as more important than the economic or technical mechanism'
        : label.en,
    };
  }

  return label;
}

function improveOption(
  option: { readonly id: string; readonly label: LocalizedText },
  correctOptionId: string,
  explanation: LocalizedText,
): LocalizedText {
  const cleaned = replaceTrivialDistractor(option.label);
  const normalizedTr = normalize(cleaned.tr);
  const normalizedEn = cleaned.en?.trim().toLowerCase();
  const isBinary = BINARY_LABELS_TR.has(normalizedTr) || Boolean(normalizedEn && BINARY_LABELS_EN.has(normalizedEn));

  if (!isBinary) return cleaned;
  return option.id === correctOptionId
    ? contextualCorrectLabel(cleaned, explanation)
    : contextualWrongBinaryLabel(cleaned);
}

export function normalizeAssessmentSignalQuality(lesson: MicroLesson): MicroLesson {
  const questions = lesson.quiz.questions.map((question) => ({
    ...question,
    options: question.options.map((option) => ({
      ...option,
      label: improveOption(option, question.correctOptionId, question.explanation),
    })),
  }));

  const practicalTask = lesson.practicalTask.choices
    ? {
        ...lesson.practicalTask,
        choices: lesson.practicalTask.choices.map((choice) => ({
          ...choice,
          label: replaceTrivialDistractor(choice.label),
        })),
      }
    : lesson.practicalTask;

  return microLessonSchema.parse({
    ...lesson,
    practicalTask,
    quiz: {
      ...lesson.quiz,
      questions,
    },
  });
}
