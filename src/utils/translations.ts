import { Language } from '../types/course';

export type TranslationKey =
  | 'platform.title'
  | 'platform.subtitle'
  | 'course.hours'
  | 'course.lessons'
  | 'course.rating'
  | 'course.enrolled'
  | 'course.level.beginner'
  | 'course.level.intermediate'
  | 'course.level.advanced'
  | 'course.detail.about'
  | 'course.detail.curriculum'
  | 'course.detail.outcomes'
  | 'course.detail.prerequisites'
  | 'course.detail.skills'
  | 'course.detail.start'
  | 'course.detail.continue'
  | 'common.loading'
  | 'common.error'
  | 'common.retry'
  | 'common.back'
  | 'common.search'
  | 'common.empty'
  | 'common.noResults'
  | 'language.select'
  | 'error.network'
  | 'error.notFound'
  | 'error.generic';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  tr: {
    'platform.title': 'Finans Eğitim Akademi',
    'platform.subtitle': 'Finansal okuryazarlık ve profesyonel seviyeye geçiş için kapsamlı eğitim platformu',
    'course.hours': 'saat',
    'course.lessons': 'ders',
    'course.rating': 'puan',
    'course.enrolled': 'kayıtlı',
    'course.level.beginner': 'Başlangıç',
    'course.level.intermediate': 'Orta',
    'course.level.advanced': 'İleri',
    'course.detail.about': 'Kurs Hakkında',
    'course.detail.curriculum': 'Müfredat',
    'course.detail.outcomes': 'Kazanımlar',
    'course.detail.prerequisites': 'Önkoşullar',
    'course.detail.skills': 'Edinilecek Beceriler',
    'course.detail.start': 'Kursa Başla',
    'course.detail.continue': 'Devam Et',
    'common.loading': 'Yükleniyor...',
    'common.error': 'Hata',
    'common.retry': 'Tekrar Dene',
    'common.back': 'Geri',
    'common.search': 'Ara',
    'common.empty': 'Henüz kurs yok',
    'common.noResults': 'Arama sonucu bulunamadı',
    'language.select': 'Dil Seç',
    'error.network': 'Ağ hatası oluştu. Lütfen internet bağlantınızı kontrol edin.',
    'error.notFound': 'Kurs bulunamadı',
    'error.generic': 'Bir hata oluştu. Lütfen tekrar deneyin.',
  },
  en: {
    'platform.title': 'Finance Education Academy',
    'platform.subtitle': 'Comprehensive education platform for financial literacy and professional advancement',
    'course.hours': 'hours',
    'course.lessons': 'lessons',
    'course.rating': 'rating',
    'course.enrolled': 'enrolled',
    'course.level.beginner': 'Beginner',
    'course.level.intermediate': 'Intermediate',
    'course.level.advanced': 'Advanced',
    'course.detail.about': 'About',
    'course.detail.curriculum': 'Curriculum',
    'course.detail.outcomes': 'Outcomes',
    'course.detail.prerequisites': 'Prerequisites',
    'course.detail.skills': 'Skills Gained',
    'course.detail.start': 'Start Course',
    'course.detail.continue': 'Continue',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.back': 'Back',
    'common.search': 'Search',
    'common.empty': 'No courses yet',
    'common.noResults': 'No search results found',
    'language.select': 'Select Language',
    'error.network': 'Network error occurred. Please check your internet connection.',
    'error.notFound': 'Course not found',
    'error.generic': 'An error occurred. Please try again.',
  },
  es: {
    'platform.title': 'Academia de Educación Financiera',
    'platform.subtitle': 'Plataforma educativa integral para la alfabetización financiera y el avance profesional',
    'course.hours': 'horas',
    'course.lessons': 'lecciones',
    'course.rating': 'calificación',
    'course.enrolled': 'inscritos',
    'course.level.beginner': 'Principiante',
    'course.level.intermediate': 'Intermedio',
    'course.level.advanced': 'Avanzado',
    'course.detail.about': 'Acerca de',
    'course.detail.curriculum': 'Plan de Estudios',
    'course.detail.outcomes': 'Resultados',
    'course.detail.prerequisites': 'Prerrequisitos',
    'course.detail.skills': 'Habilidades Adquiridas',
    'course.detail.start': 'Comenzar Curso',
    'course.detail.continue': 'Continuar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.retry': 'Reintentar',
    'common.back': 'Atrás',
    'common.search': 'Buscar',
    'common.empty': 'Aún no hay cursos',
    'common.noResults': 'No se encontraron resultados de búsqueda',
    'language.select': 'Seleccionar Idioma',
    'error.network': 'Error de red. Por favor verifique su conexión a internet.',
    'error.notFound': 'Curso no encontrado',
    'error.generic': 'Ocurrió un error. Por favor intente nuevamente.',
  },
  fr: {
    'platform.title': 'Académie d\'Éducation Financière',
    'platform.subtitle': 'Plateforme éducative complète pour l\'alphabétisation financière et l\'avancement professionnel',
    'course.hours': 'heures',
    'course.lessons': 'leçons',
    'course.rating': 'note',
    'course.enrolled': 'inscrits',
    'course.level.beginner': 'Débutant',
    'course.level.intermediate': 'Intermédiaire',
    'course.level.advanced': 'Avancé',
    'course.detail.about': 'À propos',
    'course.detail.curriculum': 'Programme',
    'course.detail.outcomes': 'Résultats',
    'course.detail.prerequisites': 'Prérequis',
    'course.detail.skills': 'Compétences Acquises',
    'course.detail.start': 'Commencer le Cours',
    'course.detail.continue': 'Continuer',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.retry': 'Réessayer',
    'common.back': 'Retour',
    'common.search': 'Rechercher',
    'common.empty': 'Aucun cours pour le moment',
    'common.noResults': 'Aucun résultat de recherche trouvé',
    'language.select': 'Sélectionner la Langue',
    'error.network': 'Erreur réseau. Veuillez vérifier votre connexion internet.',
    'error.notFound': 'Cours introuvable',
    'error.generic': 'Une erreur s\'est produite. Veuillez réessayer.',
  },
  ru: {
    'platform.title': 'Академия Финансового Образования',
    'platform.subtitle': 'Комплексная образовательная платформа для финансовой грамотности и профессионального развития',
    'course.hours': 'часов',
    'course.lessons': 'уроков',
    'course.rating': 'рейтинг',
    'course.enrolled': 'записано',
    'course.level.beginner': 'Начинающий',
    'course.level.intermediate': 'Средний',
    'course.level.advanced': 'Продвинутый',
    'course.detail.about': 'О курсе',
    'course.detail.curriculum': 'Программа',
    'course.detail.outcomes': 'Результаты',
    'course.detail.prerequisites': 'Предварительные требования',
    'course.detail.skills': 'Приобретенные Навыки',
    'course.detail.start': 'Начать Курс',
    'course.detail.continue': 'Продолжить',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.retry': 'Повторить',
    'common.back': 'Назад',
    'common.search': 'Поиск',
    'common.empty': 'Пока нет курсов',
    'common.noResults': 'Результаты поиска не найдены',
    'language.select': 'Выбрать Язык',
    'error.network': 'Ошибка сети. Пожалуйста, проверьте подключение к интернету.',
    'error.notFound': 'Курс не найден',
    'error.generic': 'Произошла ошибка. Пожалуйста, попробуйте снова.',
  },
  de: {
    'platform.title': 'Finanzbildungsakademie',
    'platform.subtitle': 'Umfassende Bildungsplattform für Finanzkompetenz und beruflichen Aufstieg',
    'course.hours': 'Stunden',
    'course.lessons': 'Lektionen',
    'course.rating': 'Bewertung',
    'course.enrolled': 'eingeschrieben',
    'course.level.beginner': 'Anfänger',
    'course.level.intermediate': 'Mittelstufe',
    'course.level.advanced': 'Fortgeschritten',
    'course.detail.about': 'Über',
    'course.detail.curriculum': 'Lehrplan',
    'course.detail.outcomes': 'Ergebnisse',
    'course.detail.prerequisites': 'Voraussetzungen',
    'course.detail.skills': 'Erworbene Fähigkeiten',
    'course.detail.start': 'Kurs Starten',
    'course.detail.continue': 'Fortsetzen',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.retry': 'Wiederholen',
    'common.back': 'Zurück',
    'common.search': 'Suchen',
    'common.empty': 'Noch keine Kurse',
    'common.noResults': 'Keine Suchergebnisse gefunden',
    'language.select': 'Sprache Auswählen',
    'error.network': 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
    'error.notFound': 'Kurs nicht gefunden',
    'error.generic': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
  },
  pt: {
    'platform.title': 'Academia de Educação Financeira',
    'platform.subtitle': 'Plataforma educacional abrangente para alfabetização financeira e avanço profissional',
    'course.hours': 'horas',
    'course.lessons': 'lições',
    'course.rating': 'avaliação',
    'course.enrolled': 'inscritos',
    'course.level.beginner': 'Iniciante',
    'course.level.intermediate': 'Intermediário',
    'course.level.advanced': 'Avançado',
    'course.detail.about': 'Sobre',
    'course.detail.curriculum': 'Currículo',
    'course.detail.outcomes': 'Resultados',
    'course.detail.prerequisites': 'Pré-requisitos',
    'course.detail.skills': 'Habilidades Adquiridas',
    'course.detail.start': 'Iniciar Curso',
    'course.detail.continue': 'Continuar',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.retry': 'Tentar Novamente',
    'common.back': 'Voltar',
    'common.search': 'Pesquisar',
    'common.empty': 'Ainda não há cursos',
    'common.noResults': 'Nenhum resultado de pesquisa encontrado',
    'language.select': 'Selecionar Idioma',
    'error.network': 'Erro de rede. Por favor verifique sua conexão com a internet.',
    'error.notFound': 'Curso não encontrado',
    'error.generic': 'Ocorreu um erro. Por favor tente novamente.',
  },
};

/**
 * Çeviri fonksiyonu
 * @param key - Çeviri anahtarı
 * @param language - Aktif dil
 * @returns Çevrilmiş metin veya fallback
 */
export const translate = (key: TranslationKey, language: Language): string => {
  const langTranslations = translations[language];
  if (langTranslations && langTranslations[key]) {
    return langTranslations[key];
  }
  
  // Fallback to Turkish
  const trTranslations = translations.tr;
  if (trTranslations && trTranslations[key]) {
    return trTranslations[key];
  }
  
  // Fallback to key itself
  console.warn(`Translation missing for key: ${key}`);
  return key;
};
