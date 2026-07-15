import type {
  AudienceCopy,
  LocalizedText,
  PresentationMode,
} from './types';

export type LearningLanguage = 'tr' | 'en';

export function selectLocalizedText(
  value: LocalizedText,
  language: LearningLanguage
): string {
  return value[language] ?? value.tr;
}

export function selectAudienceCopy(
  value: AudienceCopy,
  presentationMode: PresentationMode,
  language: LearningLanguage
): string {
  const selected = presentationMode === 'pro' ? value.pro ?? value.normal : value.normal;
  return selectLocalizedText(selected, language);
}

