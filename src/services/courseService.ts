import { Course } from '../types/course';
import { mockCourses } from './mockData/courses';

/**
 * Simüle edilmiş API delay (ms)
 */
const API_DELAY = 800;

/**
 * Tüm kursları getirir (simüle edilmiş API çağrısı)
 */
export const getCourses = async (): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Disabled olan kursları filtrele
      const activeCourses = mockCourses.filter((course) => !course.disabled);
      resolve(activeCourses);
    }, API_DELAY);
  });
};

/**
 * ID'ye göre kurs getirir
 */
export const getCourseById = async (id: number): Promise<Course | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = mockCourses.find((c) => c.id === id && !c.disabled);
      if (course) {
        resolve(course);
      } else {
        reject(new Error(`Course with id ${id} not found`));
      }
    }, API_DELAY);
  });
};

/**
 * Kurs arama fonksiyonu
 */
export const searchCourses = async (query: string): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const filtered = mockCourses.filter(
        (course) =>
          !course.disabled &&
          (course.title.tr.toLowerCase().includes(lowerQuery) ||
            course.title.en.toLowerCase().includes(lowerQuery) ||
            course.description.tr.toLowerCase().includes(lowerQuery) ||
            course.description.en.toLowerCase().includes(lowerQuery) ||
            course.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
            course.category.toLowerCase().includes(lowerQuery))
      );
      resolve(filtered);
    }, API_DELAY);
  });
};

/**
 * Kategoriye göre kursları filtreler
 */
export const getCoursesByCategory = async (category: string): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = mockCourses.filter(
        (course) => !course.disabled && course.category === category
      );
      resolve(filtered);
    }, API_DELAY);
  });
};

/**
 * Seviyeye göre kursları filtreler
 */
export const getCoursesByLevel = async (level: Course['level']): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = mockCourses.filter(
        (course) => !course.disabled && course.level === level
      );
      resolve(filtered);
    }, API_DELAY);
  });
};
