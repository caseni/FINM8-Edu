import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'large',
}) => {
  const { t } = useLanguage();
  const loadingMessage = message || t('common.loading');

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#6366F1" />
      {loadingMessage && <Text style={styles.text}>{loadingMessage}</Text>}
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
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
});
