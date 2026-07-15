import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Course } from '../../types/course';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useLanguage } from '../../hooks/useLanguage';
import { LinearGradient } from 'expo-linear-gradient';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const { language, t } = useLanguage();
  const title = course.title[language] || course.title.tr;
  const description = course.description[language] || course.description.tr;

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
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        {/* Gradient placeholder for course image */}
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={styles.imagePlaceholder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.imageText}>{course.category}</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.header}>
            <Badge label={getLevelLabel(course.level)} level={course.level} />
            <Text style={styles.category}>{course.category}</Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>

          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricIcon}>⏱</Text>
              <Text style={styles.metricText}>
                {course.duration} {t('course.hours')}
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricIcon}>📚</Text>
              <Text style={styles.metricText}>
                {course.lessons} {t('course.lessons')}
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricIcon}>⭐</Text>
              <Text style={styles.metricText}>
                {course.rating.toFixed(1)} {t('course.rating')}
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricIcon}>👥</Text>
              <Text style={styles.metricText}>
                {course.enrolled} {t('course.enrolled')}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricIcon: {
    fontSize: 14,
  },
  metricText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
