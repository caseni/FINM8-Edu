import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLanguageStore } from '../../store/useLanguageStore';
import type { RootStackParamList } from '../../types/navigation';
import { LearnHomeScreen } from './LearnHomeScreen';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function LearnLandingScreen() {
  const navigation = useNavigation<Navigation>();
  const rawLanguage = useLanguageStore((state) => state.language);
  const language = rawLanguage === 'en' ? 'en' : 'tr';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.switcherWrap}>
        <View style={styles.switcher} accessibilityRole="tablist">
          <View accessibilityRole="tab" accessibilityState={{ selected: true }} style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>Core</Text>
          </View>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
            accessibilityLabel={language === 'tr' ? 'FINM8 Academy eğitim okullarını aç' : 'Open FINM8 Academy learning schools'}
            onPress={() => navigation.navigate('Academy')}
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
          >
            <Text style={styles.tabText}>Academy</Text>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>{language === 'tr' ? 'YENİ' : 'NEW'}</Text>
            </View>
          </Pressable>
        </View>
        <Text style={styles.switcherHint}>
          {language === 'tr'
            ? 'Core temel yolun · Academy konu bazlı derinleşme alanın'
            : 'Core is your foundation · Academy is your subject-based deep dive'}
        </Text>
      </View>
      <View style={styles.body}>
        <LearnHomeScreen />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#07111F' },
  switcherWrap: { width: '100%', maxWidth: 900, alignSelf: 'center', gap: 5, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6 },
  switcher: { flexDirection: 'row', gap: 6, alignSelf: 'flex-start', padding: 4, borderRadius: 14, backgroundColor: '#0C1928', borderWidth: 1, borderColor: '#1F3449' },
  tab: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 14, borderRadius: 10 },
  tabActive: { backgroundColor: '#123B42', borderWidth: 1, borderColor: '#2F766F' },
  tabPressed: { backgroundColor: '#102033' },
  tabText: { color: '#8094A8', fontSize: 12, fontWeight: '900' },
  tabTextActive: { color: '#5EEAD4' },
  newBadge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 999, backgroundColor: '#2DD4BF' },
  newBadgeText: { color: '#042F2E', fontSize: 7, lineHeight: 9, fontWeight: '900', letterSpacing: 0.4 },
  switcherHint: { color: '#6F8499', fontSize: 10, lineHeight: 14, fontWeight: '700' },
  body: { flex: 1 },
});
