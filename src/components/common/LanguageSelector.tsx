import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useLanguage } from '../../hooks/useLanguage';
import { LANGUAGES, LANGUAGE_NAMES } from '../../constants/languages';
import type { Language } from '../../types/course';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageSelect = async (lang: Language) => {
    await setLanguage(lang);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectorText}>{language.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('language.select')}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = item === language;
                return (
                  <TouchableOpacity
                    style={[
                      styles.languageItem,
                      isSelected && styles.languageItemSelected,
                    ]}
                    onPress={() => handleLanguageSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.languageText,
                        isSelected && styles.languageTextSelected,
                      ]}
                    >
                      {LANGUAGE_NAMES[item]}
                    </Text>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#E0E7FF',
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6B7280',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  languageItemSelected: {
    backgroundColor: '#EEF2FF',
  },
  languageText: {
    fontSize: 16,
    color: '#374151',
  },
  languageTextSelected: {
    color: '#6366F1',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#6366F1',
    fontWeight: 'bold',
  },
});
