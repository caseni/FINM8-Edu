import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { Course } from '../../types/course';
import { getCourseById } from '../../services/courseService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorView } from '../../components/common/ErrorView';
import { useLanguage } from '../../hooks/useLanguage';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../components/ui/Card';

type CourseDetailScreenRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;
type CourseDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CourseDetail'>;

export const CourseDetailScreen: React.FC = () => {
  const route = useRoute<CourseDetailScreenRouteProp>();
  const navigation = useNavigation<CourseDetailScreenNavigationProp>();
  const { courseId } = route.params;
  const { language, t } = useLanguage();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'curriculum' | 'outcomes' | 'prerequisites' | 'skills'>('about');

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCourseById(courseId);
      setCourse(data);
    } catch (err) {
      // Handle invalid course ID
      if (err instanceof Error && err.message.includes('not found')) {
        setError(t('error.notFound'));
      } else {
        setError(err instanceof Error ? err.message : t('error.generic'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error || !course) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView message={error || t('error.notFound')} onRetry={loadCourse} />
      </SafeAreaView>
    );
  }

  const title = course.title[language] || course.title.tr;
  const description = course.description[language] || course.description.tr;
  const outcomes = course.outcomes[language] || course.outcomes.tr;
  const prerequisites = course.prerequisites[language] || course.prerequisites.tr;
  const skillsGained = course.skillsGained[language] || course.skillsGained.tr;

  const getLevelLabel = (level: Course['level']) => {
    switch (level) {
      case 'Beginner':
        return t('course.level.beginner');
      case 'Intermediate':
        return t('course.level.intermediate');
      case 'Advanced':
        return t('course.level.advanced');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <Badge label={getLevelLabel(course.level)} level={course.level} />
            <Text style={styles.heroCategory}>{course.category}</Text>
            <Text style={styles.heroTitle}>{title}</Text>
          </View>
        </LinearGradient>

        {/* Metrics */}
        <View style={styles.metrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{course.duration}</Text>
            <Text style={styles.metricLabel}>{t('course.hours')}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{course.lessons}</Text>
            <Text style={styles.metricLabel}>{t('course.lessons')}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{course.rating.toFixed(1)}</Text>
            <Text style={styles.metricLabel}>{t('course.rating')}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{course.enrolled}</Text>
            <Text style={styles.metricLabel}>{t('course.enrolled')}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.tabActive]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
              {t('course.detail.about')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'curriculum' && styles.tabActive]}
            onPress={() => setActiveTab('curriculum')}
          >
            <Text style={[styles.tabText, activeTab === 'curriculum' && styles.tabTextActive]}>
              {t('course.detail.curriculum')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'outcomes' && styles.tabActive]}
            onPress={() => setActiveTab('outcomes')}
          >
            <Text style={[styles.tabText, activeTab === 'outcomes' && styles.tabTextActive]}>
              {t('course.detail.outcomes')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'about' && (
            <Card style={styles.contentCard}>
              <Text style={styles.contentTitle}>{t('course.detail.about')}</Text>
              <Text style={styles.contentText}>{description}</Text>
            </Card>
          )}

          {activeTab === 'curriculum' && (
            <Card style={styles.contentCard}>
              <Text style={styles.contentTitle}>{t('course.detail.curriculum')}</Text>
              {course.modules.map((module, index) => {
                const moduleTitle = module.title[language] || module.title.tr;
                return (
                  <View key={index} style={styles.module}>
                    <View style={styles.moduleHeader}>
                      <Text style={styles.moduleTitle}>{moduleTitle}</Text>
                      <Text style={styles.moduleDuration}>
                        {module.duration} {t('course.hours')}
                      </Text>
                    </View>
                    {module.lessons.map((lesson, lessonIndex) => (
                      <Text key={lessonIndex} style={styles.lesson}>
                        • {lesson}
                      </Text>
                    ))}
                  </View>
                );
              })}
            </Card>
          )}

          {activeTab === 'outcomes' && (
            <Card style={styles.contentCard}>
              <Text style={styles.contentTitle}>{t('course.detail.outcomes')}</Text>
              {outcomes.map((outcome, index) => (
                <Text key={index} style={styles.listItem}>
                  • {outcome}
                </Text>
              ))}
            </Card>
          )}

          {/* Prerequisites */}
          {prerequisites.length > 0 && (
            <Card style={styles.contentCard}>
              <Text style={styles.contentTitle}>{t('course.detail.prerequisites')}</Text>
              {prerequisites.map((prereq, index) => (
                <Text key={index} style={styles.listItem}>
                  • {prereq}
                </Text>
              ))}
            </Card>
          )}

          {/* Skills Gained */}
          {skillsGained.length > 0 && (
            <Card style={styles.contentCard}>
              <Text style={styles.contentTitle}>{t('course.detail.skills')}</Text>
              {skillsGained.map((skill, index) => (
                <Text key={index} style={styles.listItem}>
                  • {skill}
                </Text>
              ))}
            </Card>
          )}
        </View>

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <Button
            title={t('course.detail.start')}
            onPress={() => {
              // Navigate to course start or show message
              console.log('Start course:', course.id);
            }}
            variant="primary"
            style={styles.ctaButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  heroContent: {
    gap: 8,
  },
  heroCategory: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '500',
    marginTop: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  contentCard: {
    marginBottom: 16,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  module: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  moduleDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  lesson: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    marginTop: 4,
    lineHeight: 22,
  },
  listItem: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 24,
  },
  ctaContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
  },
  ctaButton: {
    width: '100%',
  },
});
