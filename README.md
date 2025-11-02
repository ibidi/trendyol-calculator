# 🧮 Trendyol Kârlılık Hesaplayıcı

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Trendyol'da satış yapanlar için komisyon, KDV, kargo ve diğer giderleri dikkate alarak net kâr ve kârlılık oranı hesaplamayı kolaylaştıran modern bir web tabanlı hesaplama aracı.**

[Demo](https://trendyol-calculator.vercel.app) • [Dokümantasyon](#-kullanım) • [Katkıda Bulun](#-katkıda-bulunma)

</div>

---

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Hesaplama Mantığı](#-hesaplama-mantığı)
- [Teknoloji Stack](#-teknoloji-stack)
- [Yol Haritası](#-yol-haritası)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

---

## ✨ Özellikler

### 💰 Hesaplama Özellikleri
- ✅ **Anlık Kârlılık Hesaplama** - Net kâr ve kârlılık oranı
- ✅ **Esnek Komisyon Oranları** - Kategori bazlı özelleştirme
- ✅ **KDV Hesaplaması** - Otomatik KDV dahil/hariç hesaplama
- ✅ **Kargo Maliyeti** - Sabit veya değişken kargo ücreti
- ✅ **Ek Giderler** - Paketleme, etiket, reklam vb.
- ✅ **Detaylı Kesinti Raporu** - Tüm giderlerin kalem kalem gösterimi

### 🎨 Kullanıcı Deneyimi
- ✅ **Modern Arayüz** - Tailwind CSS ile şık tasarım
- ✅ **Dark/Light Mode** - Göz dostu tema seçenekleri
- ✅ **Responsive Tasarım** - Mobil, tablet ve masaüstü uyumlu
- ✅ **Gerçek Zamanlı Güncelleme** - Anlık hesaplama
- ✅ **Paylaşılabilir Sonuçlar** - URL ile sonuç paylaşımı

### 📊 Raporlama
- ✅ **Görsel Grafikler** - Kâr dağılımı pasta grafikleri
- ✅ **Karşılaştırma Tablosu** - Çoklu ürün analizi
- ✅ **PDF/PNG Export** - Sonuçları kaydetme
- ✅ **Excel Export** - Toplu analiz için

---

## 📸 Ekran Görüntüleri

<div align="center">
  <img src="screenshots/calculator-main.png" alt="Ana Hesaplama Ekranı" width="100%">
  <p><em>Ana hesaplama ekranı - Tüm parametreler tek sayfada</em></p>
  
  <img src="screenshots/calculator-results.png" alt="Detaylı Sonuçlar" width="100%">
  <p><em>Detaylı kesinti raporu ve kârlılık analizi</em></p>
</div>

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js** 18.0 veya üzeri
- **pnpm** 8.0 veya üzeri (önerilen)

### Adım 1: Projeyi Klonlayın

```bash
git clone https://github.com/ibidi/trendyol-calculator.git
cd trendyol-calculator
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
# pnpm ile (önerilen)
pnpm install

# veya npm ile
npm install

# veya yarn ile
yarn install
```

### Adım 3: Geliştirme Sunucusunu Başlatın

```bash
pnpm dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

### Adım 4: Production Build

```bash
pnpm build
pnpm start
```

---

## 📖 Kullanım

### Temel Kullanım

1. **Satış Fiyatı Girin**
   - Trendyol'da satacağınız fiyatı girin (KDV dahil)

2. **Maliyet Bilgilerini Girin**
   - Ürün maliyeti
   - Kargo ücreti
   - Ek giderler (paketleme, etiket vb.)

3. **Komisyon ve KDV Oranlarını Ayarlayın**
   - Trendyol komisyon oranı (kategori bazlı)
   - KDV oranı (varsayılan %20)

4. **Sonuçları Görüntüleyin**
   - Net kâr
   - Kârlılık oranı (%)
   - Detaylı kesinti raporu

### Gelişmiş Özellikler

#### Kategori Bazlı Komisyon

```typescript
const commissionRates = {
  'Elektronik': 15,
  'Moda': 12,
  'Ev & Yaşam': 10,
  'Kozmetik': 18,
  // ...
};
```

#### Çoklu Ürün Karşılaştırma

```typescript
const products = [
  { name: 'Ürün A', price: 100, cost: 60 },
  { name: 'Ürün B', price: 150, cost: 90 },
];
```

#### Hedef Kâr Hesaplama

```typescript
// %30 kâr için gerekli satış fiyatı
const targetPrice = calculatePriceForProfit(cost, 30);
```

---

## 🧮 Hesaplama Mantığı

### Formüller

#### 1. Gelir Hesaplama

```
Gelir (KDV Dahil) = Satış Fiyatı
Gelir (KDV Hariç) = Satış Fiyatı / (1 + KDV Oranı)
```

#### 2. Komisyon Hesaplama

```
Komisyon = Satış Fiyatı × (Komisyon Oranı / 100)
```

#### 3. KDV Hesaplama

```
KDV Tutarı = (Satış Fiyatı - Komisyon) × (KDV Oranı / (100 + KDV Oranı))
```

#### 4. Net Kâr Hesaplama

```
Net Kâr = Satış Fiyatı 
        - Komisyon 
        - Kargo 
        - Ek Giderler 
        - Maliyet 
        - KDV
```

#### 5. Kârlılık Oranı

```
Kârlılık Oranı (%) = (Net Kâr / Maliyet) × 100
```

### Örnek Hesaplama

```
Satış Fiyatı: 1.000 TL
Maliyet: 500 TL
Komisyon: %15
Kargo: 30 TL
KDV: %20

Hesaplama:
-----------
Gelir (KDV Dahil): 1.000 TL
Komisyon: 150 TL (1.000 × 0.15)
Kargo: 30 TL
KDV: 141.67 TL
Maliyet: 500 TL

Net Kâr: 1.000 - 150 - 30 - 141.67 - 500 = 178.33 TL
Kârlılık: (178.33 / 500) × 100 = 35.67%
```

---

## 🛠️ Teknoloji Stack

### Frontend

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** Custom components
- **Icons:** Heroicons / Lucide

### State Management

- **React Hooks:** useState, useEffect, useMemo
- **Custom Hooks:** useCalculator, useFormState

### Build & Deploy

- **Package Manager:** pnpm
- **Deployment:** Vercel / Netlify
- **CI/CD:** GitHub Actions

### Development Tools

- **Linting:** ESLint
- **Formatting:** Prettier
- **Type Checking:** TypeScript
- **Testing:** Jest + React Testing Library (planned)

---

## 📁 Proje Yapısı

```
trendyol-calculator/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Ana sayfa
│   └── globals.css             # Global stiller
├── components/
│   ├── Calculator.tsx          # Ana hesaplama bileşeni
│   ├── ResultsPanel.tsx        # Sonuç gösterimi
│   ├── InputForm.tsx           # Form bileşeni
│   └── ComparisonTable.tsx     # Karşılaştırma tablosu
├── lib/
│   ├── calculations.ts         # Hesaplama fonksiyonları
│   ├── types.ts                # TypeScript tipleri
│   └── utils.ts                # Yardımcı fonksiyonlar
├── hooks/
│   ├── useCalculator.ts        # Hesaplama hook'u
│   └── useFormState.ts         # Form state hook'u
├── public/
│   └── screenshots/            # Ekran görüntüleri
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🗺️ Yol Haritası

### v1.0 (Mevcut)
- [x] Temel hesaplama özellikleri
- [x] Modern arayüz tasarımı
- [x] Responsive tasarım
- [x] Dark/Light mode

### v1.1 (Planlanan)
- [ ] Kategori bazlı otomatik komisyon önerileri
- [ ] Çoklu ürün karşılaştırma tablosu
- [ ] Hedef kâr oranına göre fiyat hesaplama
- [ ] Geçmiş hesaplamalar (localStorage)

### v1.2 (Gelecek)
- [ ] PDF/PNG/Excel export
- [ ] Grafik ve görselleştirmeler
- [ ] Kullanıcı hesapları (opsiyonel)
- [ ] Kampanya ve indirim hesaplamaları

### v2.0 (Uzun Vadeli)
- [ ] PWA ve offline destek
- [ ] Mobil uygulama (React Native)
- [ ] API entegrasyonu (Trendyol API)
- [ ] Otomatik fiyat önerileri (AI)
- [ ] Rakip analizi
- [ ] Stok ve envanter takibi

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Projeye katkıda bulunmak için:

### Adımlar

1. **Fork** edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. **Pull Request** açın

### Commit Mesajları

Conventional Commits standardını kullanıyoruz:

```
feat: Yeni özellik
fix: Hata düzeltme
docs: Dokümantasyon
style: Kod formatı
refactor: Kod iyileştirme
test: Test ekleme
chore: Genel işler
```

### Kod Standartları

- TypeScript kullanın
- ESLint kurallarına uyun
- Prettier ile formatlayın
- Anlamlı değişken isimleri kullanın
- Yorum satırları ekleyin

---

## 🐛 Hata Bildirimi

Hata bulduysanız veya öneriniz varsa [GitHub Issues](https://github.com/ibidi/trendyol-calculator/issues) üzerinden bildirebilirsiniz.

### Hata Bildirirken

- Hatanın detaylı açıklaması
- Adım adım tekrar etme yöntemi
- Beklenen ve gerçekleşen davranış
- Ekran görüntüleri (varsa)
- Tarayıcı ve işletim sistemi bilgisi

---

## 📄 Lisans

Bu proje [MIT License](LICENSE) ile lisanslanmıştır.

```
MIT License

Copyright (c) 2025 İhsan Baki Doğan

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
```

---

## 👨‍💻 Geliştirici

**İhsan Baki Doğan**

- GitHub: [@ibidi](https://github.com/ibidi)
- X: [@ibidi](https://x.com/ihsanbakidogan)
- LinkedIn: [İhsan Baki Doğan](https://linkedin.com/in/ibidi)
- Website: [ihsanbakidogan.com](https://ihsanbakidogan.com)

---

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Hosting
- [Trendyol](https://www.trendyol.com/) - İlham kaynağı

---

## 📞 İletişim

Sorularınız veya önerileriniz için:

- **Email:** info@ihsanbakidogan.com
- **GitHub Issues:** [Yeni Issue Aç](https://github.com/ibidi/trendyol-calculator/issues/new)
- **X:** [@ibidi](https://x.com/ihsanbakidogan.com)

---

## ⭐ Destek

Projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐

<div align="center">

**[⬆ Başa Dön](#-trendyol-kârlılık-hesaplayıcı)**

Made with ❤️ by [İhsan Baki Doğan](https://github.com/ibidi)

</div>
