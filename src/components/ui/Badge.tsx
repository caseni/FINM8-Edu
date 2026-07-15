import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { CourseLevel } from '../../types/course';

interface BadgeProps {
  label: string;
  level?: CourseLevel;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, level, style, textStyle }) => {
  const getLevelColor = (level?: CourseLevel) => {
    switch (level) {
      case 'Beginner':
        return '#10B981'; // green
      case 'Intermediate':
        return '#F59E0B'; // amber
      case 'Advanced':
        return '#EF4444'; // red
      default:
        return '#6366F1'; // indigo
    }
  };

  const backgroundColor = level ? getLevelColor(level) : '#6366F1';

  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
