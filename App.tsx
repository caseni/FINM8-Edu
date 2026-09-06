import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useLanguageStore } from './src/store/useLanguageStore';
import { useLearningProgressStore } from './src/store/useLearningProgressStore';
import {
  retryLatestProgressSave,
  useProgressPersistenceStatusStore,
} from './src/store/progressPersistence';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const language = useLanguageStore((state) => state.language);
  const languageInitialized = useLanguageStore((state) => state.initialized);
  const initializeLanguage = useLanguageStore((state) => state.initialize);
  const progressHydrated = useLearningProgressStore((state) => state.hasHydrated);
  const progressError = useLearningProgressStore((state) => state.hydrationError);
  const setProgressHydrationState = useLearningProgressStore(
    (state) => state.setHydrationState
  );
  const saveStatus = useProgressPersistenceStatusStore((state) => state.status);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    initializeLanguage();
  }, [initializeLanguage]);

  const retry = async () => {
    setRetrying(true);
    setProgressHydrationState(false);
    await Promise.all([
      initializeLanguage(),
      useLearningProgressStore.persist.rehydrate(),
    ]);
    setRetrying(false);
  };

  const bootReady = languageInitialized && progressHydrated && !progressError;

  return (
    <GestureHandlerRootView style={styles.container}>
      {bootReady ? (
        <AppNavigator />
      ) : (
        <View
          accessibilityLiveRegion="polite"
          style={styles.bootScreen}
        >
          <Text style={styles.brand}>FINM8</Text>
          <Text style={styles.bootTitle}>M8 Learn</Text>
          {progressError ? (
            <>
              <Text style={styles.bootMessage}>
                {language === 'en'
                  ? 'Your saved learning progress could not be loaded. Nothing was reset.'
                  : 'Kayıtlı öğrenme ilerlemen yüklenemedi. Hiçbir veri sıfırlanmadı.'}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: retrying }}
                disabled={retrying}
                onPress={retry}
                style={({ pressed }) => [
                  styles.retryButton,
                  (pressed || retrying) && styles.buttonPressed,
                ]}
              >
                <Text style={styles.retryText}>
                  {retrying
                    ? language === 'en' ? 'Trying again…' : 'Yeniden deneniyor…'
                    : language === 'en' ? 'Try again' : 'Yeniden dene'}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <ActivityIndicator color="#2DD4BF" size="large" />
              <Text style={styles.bootMessage}>
                {language === 'en'
                  ? 'Preparing your learning path…'
                  : 'Öğrenme yolun hazırlanıyor…'}
              </Text>
            </>
          )}
        </View>
      )}

      {bootReady && saveStatus === 'error' ? (
        <View
          accessibilityLiveRegion="assertive"
          style={styles.saveErrorLayer}
        >
          <View style={styles.saveNoticeError}>
            <Text style={styles.saveNoticeText}>
              {language === 'en'
                ? 'Could not save on this device. Try again before closing the app.'
                : 'Bu cihaza kaydedilemedi. Uygulamayı kapatmadan yeniden dene.'}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={retryLatestProgressSave}
              style={({ pressed }) => [
                styles.saveRetryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.saveRetryText}>
                {language === 'en' ? 'Try again' : 'Yeniden dene'}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : bootReady && saveStatus === 'saving' ? (
        <View
          accessibilityLiveRegion="polite"
          pointerEvents="none"
          style={styles.saveStatusLayer}
        >
          <View style={styles.saveNoticeCompact}>
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={styles.saveStatusDot}
            />
            <Text style={styles.saveNoticeCompactText}>
              {language === 'en' ? 'Saving…' : 'Kaydediliyor…'}
            </Text>
          </View>
        </View>
      ) : null}

      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111F',
  },
  bootScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 28,
    backgroundColor: '#07111F',
  },
  brand: {
    color: '#2DD4BF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 3,
  },
  bootTitle: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '900',
  },
  bootMessage: {
    maxWidth: 380,
    color: '#9FB0C3',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  retryButton: {
    minWidth: 180,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#2DD4BF',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  retryText: {
    color: '#042F2E',
    fontSize: 16,
    fontWeight: '900',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  saveStatusLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 76,
    zIndex: 20,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  saveNoticeCompact: {
    minHeight: 30,
    maxWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#245750',
    backgroundColor: '#0A2827',
  },
  saveStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#2DD4BF',
  },
  saveNoticeCompactText: {
    flexShrink: 1,
    color: '#C5EDE8',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  saveErrorLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    zIndex: 30,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  saveNoticeError: {
    width: '100%',
    maxWidth: 680,
    minHeight: 52,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F59E0B',
    backgroundColor: '#3A2710',
  },
  saveNoticeText: {
    flexShrink: 1,
    color: '#FDE7BC',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  saveRetryButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FBBF24',
  },
  saveRetryText: {
    color: '#422006',
    fontSize: 13,
    fontWeight: '900',
  },
});
