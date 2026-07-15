import { Language } from '../types/course';

export const LANGUAGES: Language[] = ['tr', 'en', 'es', 'fr', 'ru', 'de', 'pt'];

export const LANGUAGE_NAMES: { [key in Language]: string } = {
  tr: 'Türkçe',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  ru: 'Русский',
  de: 'Deutsch',
  pt: 'Português',
};

export const DEFAULT_LANGUAGE: Language = 'tr';
