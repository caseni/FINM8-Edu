# Education Platform - React Native

Finansal okuryazarlık ve profesyonel seviyeye geçiş için kapsamlı bir eğitim platformu. React Native ve Expo ile geliştirilmiştir.

## Özellikler

- 📚 9 farklı finans eğitim modülü
- 🌍 Çoklu dil desteği (TR, EN, ES, FR, RU, DE, PT)
- 📱 Modern ve responsive mobil arayüz
- 🔍 Kurs arama ve filtreleme
- 📊 Detaylı kurs bilgileri ve müfredat
- 🎨 Gradient arka planlar ve animasyonlar
- ⚡ Mock data ile hızlı geliştirme
- 🔌 Backend entegrasyonu için hazır API client yapısı

## Teknoloji Yığını

- **React Native** - Mobil uygulama framework'ü
- **Expo** - Geliştirme ve build platformu
- **TypeScript** - Tip güvenliği
- **React Navigation** - Navigation yönetimi
- **Zustand** - State management
- **AsyncStorage** - Yerel veri saklama
- **Expo Linear Gradient** - Gradient arka planlar

## Kurulum

### Gereksinimler

- Node.js (v16 veya üzeri)
- npm veya yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS için: Xcode (macOS gerekli)
- Android için: Android Studio

### Adımlar

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd education-platform
```

2. Bağımlılıkları kurun:
```bash
npm install
```

3. Uygulamayı başlatın:
```bash
# iOS için
npm run ios

# Android için
npm run android

# Web için
npm run web

# Expo Go ile
npm start
```

## Proje Yapısı

```
education-platform/
├── src/
│   ├── components/          # UI bileşenleri
│   │   ├── ui/             # Temel UI bileşenleri
│   │   ├── course/         # Kurs bileşenleri
│   │   └── common/         # Ortak bileşenler
│   ├── screens/            # Ekran bileşenleri
│   │   ├── home/           # Ana sayfa
│   │   └── course/         # Kurs detay
│   ├── navigation/         # Navigation yapılandırması
│   ├── services/           # API ve servisler
│   │   ├── api/            # API client
│   │   └── mockData/       # Mock veriler
│   ├── store/              # Zustand stores
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Yardımcı fonksiyonlar
│   ├── types/              # TypeScript type tanımları
│   └── constants/          # Sabitler
├── App.tsx                 # Ana uygulama bileşeni
└── package.json
```

## Kullanım

### Mock Data

Uygulama şu anda mock data ile çalışmaktadır. Mock veriler `src/services/mockData/courses.ts` dosyasında tanımlanmıştır.

### Dil Sistemi

Dil değiştirmek için sağ üstteki dil seçici butonunu kullanın. Dil tercihi AsyncStorage'da saklanır ve uygulama yeniden açıldığında korunur.

### Kurs Listesi

Ana sayfada tüm kurslar kartlar halinde görüntülenir. Arama çubuğunu kullanarak kursları filtreleyebilirsiniz.

### Kurs Detayı

Bir kursa tıkladığınızda detay sayfasına yönlendirilirsiniz. Burada:
- Kurs hakkında bilgiler
- Müfredat ve modüller
- Kazanımlar
- Önkoşullar
- Edinilecek beceriler

gibi bilgileri görebilirsiniz.

## Backend Entegrasyonu

Backend entegrasyonu için hazırlanmış API client yapısı `src/services/api/client.ts` dosyasında bulunmaktadır. Detaylı bilgi için `src/services/api/README.md` dosyasına bakın.

### Mock Data'dan Gerçek API'ye Geçiş

1. `src/services/courseService.ts` dosyasındaki fonksiyonları gerçek API çağrılarıyla değiştirin
2. Environment variable'ları ayarlayın (`EXPO_PUBLIC_API_URL`)
3. Error handling'i güncelleyin

## Geliştirme

### Yeni Kurs Ekleme

Mock data'ya yeni kurs eklemek için `src/services/mockData/courses.ts` dosyasını düzenleyin.

### Yeni Dil Desteği

1. `src/types/course.ts` dosyasındaki `Language` type'ına yeni dili ekleyin
2. `src/constants/languages.ts` dosyasına dil adını ekleyin
3. `src/utils/translations.ts` dosyasına çevirileri ekleyin
4. Mock data'daki tüm kurslara yeni dil için çevirileri ekleyin

### Stil Değişiklikleri

Stil değişiklikleri için `StyleSheet` API'sini kullanın. Tema renkleri:
- Primary: `#6366F1` (Indigo)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)

## Test

```bash
# iOS'ta test
npm run ios

# Android'de test
npm run android

# Web'de test
npm run web
```

## Lisans

Bu proje özel bir projedir.

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## İletişim

Sorularınız için issue açabilirsiniz.
