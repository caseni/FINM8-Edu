import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../constants/languages';
import type { Language } from '../types/course';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  initialize: () => Promise<void>;
}

const LANGUAGE_STORAGE_KEY = '@app_language';

export const useLanguageStore = create<LanguageState>((set) => ({
  language: DEFAULT_LANGUAGE,
  
  initialize: async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && LANGUAGES.includes(savedLanguage as Language)) {
        set({ language: savedLanguage as Language });
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  },
  
  setLanguage: async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      set({ language: lang });
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  },
}));
