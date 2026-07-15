import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  const { t } = useLanguage();
  const emptyTitle = title || t('common.empty');
  const emptyMessage = message || t('common.noResults');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{emptyTitle}</Text>
      <Text style={styles.message}>{emptyMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
