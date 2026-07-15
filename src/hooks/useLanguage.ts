import { useCallback } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { translate } from '../utils/translations';
import type { TranslationKey } from '../utils/translations';

/**
 * Dil ve çeviri hook'u
 */
export const useLanguage = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  
  /**
   * Çeviri fonksiyonu
   * @param key - Çeviri anahtarı
   * @returns Çevrilmiş metin
   */
  const t = useCallback(
    (key: TranslationKey): string => translate(key, language),
    [language]
  );
  
  return {
    language,
    setLanguage,
    t,
  };
};
