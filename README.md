# 🧮 Trendyol Karlılık Hesaplama Aracı

Açık kaynak, esnek ve özelleştirilebilir e-ticaret karlılık hesaplama aracı. Herkes kendi API'sini entegre edebilir!

![Trendyol Karlılık Hesaplama Aracı](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Özellikler

### 🎯 Temel Özellikler
- **💰 Karlılık Hesaplama**: Alış fiyatı, satış fiyatı, komisyon, kargo ve diğer maliyetleri hesaba katarak net kar hesaplama
- **📊 Grafik Raporları**: Maliyet dağılımı ve kar-zarar analizi için görsel grafikler
- **🏷️ Kategori Yönetimi**: Ürün kategorilerine göre otomatik komisyon oranı belirleme
- **📱 Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz
- **🌙 Modern UI**: Shadcn/ui ile oluşturulmuş modern ve kullanıcı dostu arayüz

### 🔧 API Entegrasyonu
- **🔌 Esnek API Sistemi**: Herhangi bir API'yi entegre edebilme
- **🔐 Çoklu Kimlik Doğrulama**: API Key, Bearer Token, Basic Auth desteği
- **🗂️ Alan Eşleştirme**: API'nizin veri yapısını uygulamayla eşleştirme
- **🧪 Test Sistemi**: API'nizi test etme ve debug etme araçları
- **💾 Konfigürasyon Yönetimi**: API ayarlarını kaydetme, dışa/içe aktarma
- **📋 Hazır Şablonlar**: Popüler API'ler için önceden yapılandırılmış şablonlar

### 📊 Gelişmiş Özellikler
- **🎭 Mock Data**: API olmadan da çalışabilme
- **⚡ Önbellek Sistemi**: API yanıtlarını önbelleğe alma
- **📄 Çoklu Format Desteği**: JSON, XML, CSV formatları
- **🌳 Nested Data**: Karmaşık veri yapılarını parse etme
- **📈 Detaylı Raporlama**: ROI, kar marjı ve maliyet analizi

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+ 
- npm, yarn veya pnpm

### Kurulum

1. **Projeyi klonlayın:**
\`\`\`bash
git clone https://github.com/ibidi/trendyol-calculator.git
cd trendyol-calculator
\`\`\`

2. **Bağımlılıkları yükleyin:**
\`\`\`bash
npm install
# veya
yarn install
# veya
pnpm install
\`\`\`

3. **Geliştirme sunucusunu başlatın:**
\`\`\`bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
\`\`\`

4. **Tarayıcınızda açın:**
\`\`\`
http://localhost:3000
\`\`\`

## 📖 Kullanım Kılavuzu

### Temel Kullanım

1. **Ürün Bilgileri Girişi**
   - Ürün adını girin
   - Alış fiyatını belirtin
   - Satış fiyatını girin

2. **Kategori Seçimi**
   - Ürün kategorisini seçin
   - Komisyon oranı otomatik güncellenir

3. **Maliyet Hesaplama**
   - Kargo maliyetini ekleyin
   - Diğer maliyetleri (ambalaj, işçilik vb.) girin
   - KDV oranını ayarlayın

4. **Sonuçları Görüntüleme**
   - "Karlılık Hesapla" butonuna tıklayın
   - Net kar, kar marjı ve ROI değerlerini inceleyin
   - Grafik raporlarını görüntüleyin

### Gelişmiş Kullanım

#### API Entegrasyonu

1. **API Ayarları sekmesine gidin**
2. **Hazır konfigürasyon seçin veya özel API yapılandırın**
3. **Kimlik doğrulama bilgilerini girin**
4. **Alan eşleştirmesini yapın**
5. **API'nizi test edin**
6. **Konfigürasyonu kaydedin**

## 🔧 API Entegrasyonu Detayları

### Desteklenen API Formatları

#### JSON Response Örneği
\`\`\`json
{
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Elektronik",
        "commissionRate": 12.5,
        "subCategories": [
          {
            "id": 101,
            "name": "Telefon",
            "commissionRate": 13.5
          }
        ]
      }
    ]
  }
}
\`\`\`

#### API Konfigürasyon Örneği
\`\`\`javascript
{
  "name": "Benim API'm",
  "endpoint": "https://api.mystore.com/categories",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "X-API-Key": "your-api-key"
  },
  "body": "{\"store_id\": 123}",
  "dataPath": "result.categories",
  "fieldMapping": {
    "id": "cat_id",
    "name": "cat_name", 
    "commissionRate": "commission_percent",
    "subCategories": "sub_cats"
  }
}
\`\`\`

### Kimlik Doğrulama Türleri

#### API Key
\`\`\`bash
X-API-Key: your-api-key-here
\`\`\`

#### Bearer Token
\`\`\`bash
Authorization: Bearer your-bearer-token
\`\`\`

#### Basic Auth
\`\`\`bash
Authorization: Basic base64(username:password)
\`\`\`

### Alan Eşleştirme

API'nizin field'ları farklıysa eşleştirme yapabilirsiniz:

| Uygulama Field'ı | API Field'ınız | Açıklama |
|------------------|----------------|----------|
| `id` | `categoryId`, `cat_id` | Kategori ID'si |
| `name` | `categoryName`, `title` | Kategori adı |
| `commissionRate` | `rate`, `commission` | Komisyon oranı (%) |
| `subCategories` | `children`, `subcats` | Alt kategoriler |

## 🛠️ Geliştirme

### Proje Yapısı
\`\`\`
├── app/
│   ├── actions/              # Server Actions
│   │   ├── api-config.ts     # API konfigürasyon yönetimi
│   │   └── trendyol-api.ts   # Eski API fonksiyonları
│   ├── globals.css           # Global stiller
│   ├── layout.tsx            # Ana layout
│   └── page.tsx              # Ana sayfa
├── components/
│   ├── ui/                   # Shadcn/ui bileşenleri
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── api-config.tsx        # API konfigürasyon bileşeni
│   ├── profit-calculator.tsx # Ana hesaplama bileşeni
│   ├── profit-results.tsx    # Sonuçlar bileşeni
│   ├── profit-charts.tsx     # Grafikler bileşeni
│   └── category-selector.tsx # Kategori seçici
├── lib/
│   └── utils.ts              # Yardımcı fonksiyonlar
├── public/                   # Statik dosyalar
├── package.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
\`\`\`

### Teknoloji Stack'i

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Charts**: Custom SVG Charts
- **State Management**: React useState/useEffect

### Yeni Özellik Ekleme

1. **Yeni API Desteği**
\`\`\`typescript
// app/actions/api-config.ts
export async function parseCustomApiResponse(
  data: any, 
  fieldMapping: ApiConfig["fieldMapping"]
): Promise<TrendyolCategory[]> {
  // Yeni API formatı için parsing logic'i
}
\`\`\`

2. **Yeni Grafik Türü**
\`\`\`typescript
// components/profit-charts.tsx
const NewChartComponent = ({ data }: { data: any[] }) => {
  // Yeni grafik implementasyonu
}
\`\`\`

3. **Yeni Hesaplama Metodu**
\`\`\`typescript
// components/profit-calculator.tsx
const calculateAdvancedMetrics = () => {
  // Gelişmiş hesaplama logic'i
}
\`\`\`

## 🤝 Katkıda Bulunma

### Katkı Süreci

1. **Fork edin**
\`\`\`bash
git clone https://github.com/ibidi/trendyol-calculator.git
\`\`\`

2. **Feature branch oluşturun**
\`\`\`bash
git checkout -b feature/amazing-feature
\`\`\`

3. **Değişikliklerinizi commit edin**
\`\`\`bash
git commit -m 'feat: Add amazing feature'
\`\`\`

4. **Branch'inizi push edin**
\`\`\`bash
git push origin feature/amazing-feature
\`\`\`

5. **Pull Request oluşturun**

### Commit Mesaj Formatı

\`\`\`
type(scope): description

[optional body]

[optional footer]
\`\`\`

**Türler:**
- `feat`: Yeni özellik
- `fix`: Bug düzeltmesi
- `docs`: Dokümantasyon
- `style`: Kod formatı
- `refactor`: Kod refactoring
- `test`: Test ekleme
- `chore`: Bakım işleri

### Kod Standartları

- **ESLint** ve **Prettier** kullanın
- **TypeScript** strict mode
- **Responsive design** prensipleri
- **Accessibility** standartları
- **Performance** optimizasyonu

## 📊 Örnekler

### Basit Karlılık Hesaplama
\`\`\`
Alış Fiyatı: 100 TL
Satış Fiyatı: 150 TL
Komisyon: %12 (18 TL)
Kargo: 10 TL
Net Kar: 150 - 100 - 18 - 10 = 22 TL
Kar Marjı: %14.67
ROI: %22
\`\`\`

### API Entegrasyon Örneği
\`\`\`javascript
// Trendyol API Konfigürasyonu
{
  "name": "Trendyol API",
  "endpoint": "https://api.trendyol.com/categories",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer YOUR_TOKEN"
  },
  "dataPath": "data.categories",
  "fieldMapping": {
    "id": "id",
    "name": "name",
    "commissionRate": "commissionRate",
    "subCategories": "subCategories"
  }
}
\`\`\`

## 🔒 Güvenlik

### API Key Güvenliği
- API key'lerinizi asla public repository'lerde paylaşmayın
- Environment variable'lar kullanın
- HTTPS endpoint'leri tercih edin
- Rate limiting uygulayın

### Veri Güvenliği
- Kullanıcı verileri localStorage'da saklanır
- Hassas bilgiler şifrelenmez (local kullanım için)
- Production'da uygun güvenlik önlemleri alın

## 📈 Performans

### Optimizasyon İpuçları
- API yanıtlarını cache'leyin
- Lazy loading kullanın
- Bundle size'ı optimize edin
- Image optimization yapın

### Monitoring
- API response time'ları izleyin
- Error rate'leri takip edin
- User experience metrics'leri ölçün

## 🌍 Deployment

### Vercel (Önerilen)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Netlify
\`\`\`bash
npm run build
# dist klasörünü Netlify'a upload edin
\`\`\`

### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 🎯 Roadmap

### v2.0 (Q2 2024)
- [ ] 🔄 Çoklu ürün karşılaştırması
- [ ] 📊 Excel/PDF dışa aktarma
- [ ] 📈 Gelişmiş grafik türleri
- [ ] 🌐 Çoklu dil desteği (EN, TR, DE)
- [ ] 🎨 Tema sistemi (Dark/Light mode)

### v2.1 (Q3 2024)
- [ ] 📱 PWA desteği
- [ ] 🔔 Webhook entegrasyonu
- [ ] 📊 Dashboard sistemi
- [ ] 🤖 AI destekli fiyat önerileri
- [ ] 📈 Trend analizi

### v3.0 (Q4 2024)
- [ ] 📱 Mobil uygulama (React Native)
- [ ] ☁️ Cloud sync
- [ ] 👥 Çoklu kullanıcı desteği
- [ ] 🏢 Enterprise özellikler
- [ ] 🔌 Plugin sistemi

## 📞 Destek ve İletişim

### Topluluk
- 💬 **Discord**: [Sunucumuza katılın](https://discord.gg/)
- 🐦 **Twitter**: [@ibidi](https://twitter.com/ibidi_codes)
- 📧 **Email**: info@ibidi.tr

### Sorun Bildirimi
- 🐛 **Bug Report**: [GitHub Issues](https://github.com/ibidi/trendyol-calculator/issues)
- 💡 **Feature Request**: [GitHub Discussions](https://github.com/ibidi/trendyol-calculator/discussions)
- 📖 **Dokümantasyon**: [Wiki](https://github.com/ibidi/trendyol-calculator/wiki)

### Destek Kanalları
- 📚 **Dokümantasyon**: Kapsamlı kullanım kılavuzu
- 🎥 **Video Tutorials**: YouTube kanalımız
- 📝 **Blog**: En iyi pratikler ve ipuçları
- 🤝 **Community**: Kullanıcı forumu

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

\`\`\`
MIT License

Copyright (c) 2025 Trendyol Karlılık Hesaplama Aracı

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

## 🙏 Teşekkürler

### Katkıda Bulunanlar
- [@ibidi](https://github.com/ibidi) - Proje kurucusu
- [@ibidi](https://github.com/ibidi) - API entegrasyonu
- [@ibidi](https://github.com/ibidi) - UI/UX iyileştirmeleri

### Kullanılan Teknolojiler
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide](https://lucide.dev/) - Icons
- [TypeScript](https://www.typescriptlang.org/) - Type safety

### İlham Kaynakları
- Trendyol satıcı deneyimi
- E-ticaret karlılık hesaplama ihtiyacı
- Açık kaynak topluluk ruhu

## ⭐ Yıldız Verin!

Bu proje size yardımcı olduysa, lütfen ⭐ vererek destekleyin!

[![GitHub stars](https://img.shields.io/github/stars/ibidi/trendyol-calculator?style=social)](https://github.com/ibidi/trendyol-calculator/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ibidi/trendyol-calculator?style=social)](https://github.com/ibidi/trendyol-calculator/network/members)

---

<div align="center">
  <p>❤️ Açık kaynak topluluğu ile geliştirilmiştir</p>
  <p>🚀 <a href="https://trendyol-calculator.vercel.app">Demo'yu deneyin</a> | 📖 <a href="https://github.com/ibidi/trendyol-calculator/wiki">Dokümantasyon</a> | 🤝 <a href="CONTRIBUTING.md">Katkıda bulunun</a></p>
</div>
\`\`\`

Şimdi de diğer önemli dosyaları oluşturalım:
