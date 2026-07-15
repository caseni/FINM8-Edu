export type Language = 'tr' | 'en' | 'es' | 'fr' | 'ru' | 'de' | 'pt';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CourseModule {
  title: { [lang in Language]: string };
  lessons: string[];
  duration: string; // Örneğin "45" veya "1.5" (saat veya ders süresi)
}

export interface Course {
  id: number;
  category: string;
  level: CourseLevel;
  duration: string; // Toplam süre (saat cinsinden string)
  lessons: number; // Toplam ders sayısı
  rating: number; // 0-5 arası ortalama puan
  enrolled: number; // Kayıtlı öğrenci sayısı
  progress: number; // Önerilen ilerleme / tipik tamamlama yüzdesi
  hasQuiz: boolean; // Kursta quiz olup olmadığı
  contentTypes: string[]; // İçerik türleri (ör. "video", "quiz", "slides")
  lastUpdated: string; // Son güncelleme tarihi, string
  tags: string[]; // Arama/filtreleme için etiketler
  disabled?: boolean; // Kart listesinde gösterilmemesi için opsiyonel bayrak
  title: { [lang in Language]: string }; // Çok dilli kurs başlığı
  description: { [lang in Language]: string }; // Çok dilli açıklama
  outcomes: { [lang in Language]: string[] }; // Kazanımlar listesi
  modules: CourseModule[]; // Kursun tüm modül/müfredat yapısı
  prerequisites: { [lang in Language]: string[] }; // Ön koşullar
  skillsGained: { [lang in Language]: string[] }; // Edinilecek beceriler
}
