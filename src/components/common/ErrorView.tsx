import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../ui/Button';
import { useLanguage } from '../../hooks/useLanguage';

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  title,
  message,
  onRetry,
}) => {
  const { t } = useLanguage();
  const errorTitle = title || t('common.error');
  const errorMessage = message || t('error.generic');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{errorTitle}</Text>
      <Text style={styles.message}>{errorMessage}</Text>
      {onRetry && (
        <Button
          title={t('common.retry')}
          onPress={onRetry}
          variant="primary"
          style={styles.button}
        />
      )}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 120,
  },
});
