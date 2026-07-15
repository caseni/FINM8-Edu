import { useLanguageStore } from '../store/useLanguageStore';
import { translate, TranslationKey } from '../utils/translations';

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
  const t = (key: TranslationKey): string => {
    return translate(key, language);
  };
  
  return {
    language,
    setLanguage,
    t,
  };
};
