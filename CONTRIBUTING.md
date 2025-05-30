# 🤝 Katkıda Bulunma Kılavuzu

Trendyol Karlılık Hesaplama Aracı'na katkıda bulunduğunuz için teşekkür ederiz! Bu kılavuz, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 📋 İçindekiler

- [Davranış Kuralları](#davranış-kuralları)
- [Nasıl Katkıda Bulunurum?](#nasıl-katkıda-bulunurum)
- [Geliştirme Ortamı](#geliştirme-ortamı)
- [Kod Standartları](#kod-standartları)
- [Commit Mesajları](#commit-mesajları)
- [Pull Request Süreci](#pull-request-süreci)
- [Issue Raporlama](#issue-raporlama)

## 📜 Davranış Kuralları

### Bizim Taahhüdümüz

Açık ve misafirperver bir ortam yaratmak için, katkıda bulunanlar ve sürdürücüler olarak, yaş, vücut ölçüsü, engellilik, etnik köken, cinsiyet kimliği ve ifadesi, deneyim seviyesi, milliyet, kişisel görünüm, ırk, din veya cinsel kimlik ve yönelim fark etmeksizin herkesi projemize ve topluluğumuza katılımda tacizden uzak bir deneyim yaşatmayı taahhüt ediyoruz.

### Standartlarımız

Olumlu bir ortam yaratmaya katkıda bulunan davranış örnekleri:

- Empati ve nezaket göstermek
- Farklı görüş ve deneyimlere saygı duymak
- Yapıcı eleştiri verme ve kabul etme
- Topluluk için en iyisine odaklanma
- Diğer topluluk üyelerine karşı empati gösterme

## 🚀 Nasıl Katkıda Bulunurum?

### 1. Issue'ları İnceleyin

- [Mevcut issue'ları](https://github.com/yourusername/trendyol-profit-calculator/issues) kontrol edin
- `good first issue` etiketli issue'lar yeni başlayanlar için uygundur
- `help wanted` etiketli issue'larda yardıma ihtiyaç vardır

### 2. Yeni Özellik Önerisi

Yeni bir özellik önermek istiyorsanız:

1. Önce [Discussions](https://github.com/yourusername/trendyol-profit-calculator/discussions) bölümünde tartışın
2. Özelliğin gerekçesini açıklayın
3. Topluluktan geri bildirim alın
4. Onay aldıktan sonra issue oluşturun

### 3. Bug Raporu

Bug bulduysanız:

1. Önce mevcut issue'larda aynı bug'ın rapor edilip edilmediğini kontrol edin
2. Bug'ı yeniden üretmeye çalışın
3. Detaylı bir bug raporu oluşturun

## 🛠️ Geliştirme Ortamı

### Gereksinimler

- Node.js 18+
- npm, yarn veya pnpm
- Git

### Kurulum

1. **Repository'yi fork edin**

2. **Klonlayın**
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/trendyol-profit-calculator.git
cd trendyol-profit-calculator
\`\`\`

3. **Bağımlılıkları yükleyin**
\`\`\`bash
npm install
\`\`\`

4. **Geliştirme sunucusunu başlatın**
\`\`\`bash
npm run dev
\`\`\`

5. **Branch oluşturun**
\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

### Proje Yapısı

\`\`\`
├── app/                    # Next.js App Router
│   ├── actions/           # Server Actions
│   ├── globals.css        # Global stiller
│   ├── layout.tsx         # Ana layout
│   └── page.tsx           # Ana sayfa
├── components/            # React bileşenleri
│   ├── ui/               # Shadcn/ui bileşenleri
│   └── ...               # Özel bileşenler
├── lib/                  # Yardımcı fonksiyonlar
├── public/               # Statik dosyalar
└── ...
\`\`\`

## 📝 Kod Standartları

### TypeScript

- Strict mode kullanın
- Type'ları explicit olarak tanımlayın
- `any` kullanımından kaçının

\`\`\`typescript
// ✅ İyi
interface User {
  id: number
  name: string
  email: string
}

// ❌ Kötü
const user: any = { ... }
\`\`\`

### React

- Functional component'ler kullanın
- Custom hook'lar oluşturun
- Props'ları destructure edin

\`\`\`typescript
// ✅ İyi
interface Props {
  title: string
  onSubmit: () => void
}

export function MyComponent({ title, onSubmit }: Props) {
  return <div>{title}</div>
}

// ❌ Kötü
export function MyComponent(props) {
  return <div>{props.title}</div>
}
\`\`\`

### CSS/Tailwind

- Tailwind CSS sınıflarını kullanın
- Responsive design prensiplerini uygulayın
- Accessibility'yi göz önünde bulundurun

\`\`\`tsx
// ✅ İyi
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
  Gönder
</button>

// ❌ Kötü
<button style={{padding: '8px 16px', backgroundColor: 'blue'}}>
  Gönder
</button>
\`\`\`

### Dosya Adlandırma

- kebab-case kullanın
- Bileşenler için PascalCase
- Utility'ler için camelCase

\`\`\`
✅ İyi:
- components/profit-calculator.tsx
- lib/formatCurrency.ts
- hooks/useApiConfig.ts

❌ Kötü:
- components/ProfitCalculator.tsx
- lib/format_currency.ts
- hooks/UseApiConfig.ts
\`\`\`

## 📝 Commit Mesajları

### Format

\`\`\`
type(scope): description

[optional body]

[optional footer]
\`\`\`

### Türler

- `feat`: Yeni özellik
- `fix`: Bug düzeltmesi
- `docs`: Dokümantasyon değişikliği
- `style`: Kod formatı (logic değişikliği yok)
- `refactor`: Kod refactoring
- `test`: Test ekleme veya düzeltme
- `chore`: Build process veya auxiliary tool değişiklikleri

### Örnekler

\`\`\`bash
feat(api): add custom API configuration support

- Add API config component
- Implement field mapping
- Add authentication methods

Closes #123
\`\`\`

\`\`\`bash
fix(calculator): resolve division by zero error

When purchase price is 0, ROI calculation fails.
Added validation to prevent this case.

Fixes #456
\`\`\`

\`\`\`bash
docs(readme): update installation instructions

- Add pnpm support
- Update Node.js version requirement
- Fix broken links
\`\`\`

## 🔄 Pull Request Süreci

### 1. Hazırlık

- [ ] Branch'iniz güncel mi? (`git pull origin main`)
- [ ] Testler geçiyor mu? (`npm test`)
- [ ] Lint hatası var mı? (`npm run lint`)
- [ ] Build başarılı mı? (`npm run build`)

### 2. PR Oluşturma

1. **Açıklayıcı başlık yazın**
\`\`\`
feat: Add multi-language support for Turkish and English
\`\`\`

2. **Detaylı açıklama ekleyin**
\`\`\`markdown
## Değişiklikler
- i18n sistemi eklendi
- Türkçe ve İngilizce dil desteği
- Dil değiştirme bileşeni

## Test Edildi
- [x] Dil değiştirme çalışıyor
- [x] Tüm metinler çevriliyor
- [x] URL'ler doğru yönlendiriyor

## Screenshots
![Language Switcher](screenshot.png)

Closes #123
\`\`\`

3. **Reviewers atayın**

### 3. Review Süreci

- En az 1 reviewer onayı gerekli
- CI/CD testleri geçmeli
- Conflict'ler çözülmeli

### 4. Merge

- Squash and merge kullanın
- Commit mesajını düzenleyin
- Branch'i silin

## 🐛 Issue Raporlama

### Bug Report Template

\`\`\`markdown
**Bug Açıklaması**
Kısa ve net bug açıklaması.

**Yeniden Üretme Adımları**
1. '...' sayfasına git
2. '....' butonuna tıkla
3. '....' alanını doldur
4. Hatayı gör

**Beklenen Davranış**
Ne olmasını bekliyordunuz?

**Ekran Görüntüleri**
Varsa ekran görüntüsü ekleyin.

**Ortam:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Ek Bilgi**
Başka bir şey eklemek istiyorsanız.
\`\`\`

### Feature Request Template

\`\`\`markdown
**Özellik İsteği**
İstediğiniz özelliği kısaca açıklayın.

**Problem**
Hangi problemi çözüyor? [e.g. I'm always frustrated when...]

**Çözüm**
İstediğiniz çözümü açıklayın.

**Alternatifler**
Düşündüğünüz alternatif çözümler.

**Ek Bilgi**
Başka bir şey eklemek istiyorsanız.
\`\`\`

## 🏷️ Etiketler

### Priority
- `priority: high` - Acil
- `priority: medium` - Orta
- `priority: low` - Düşük

### Type
- `type: bug` - Bug
- `type: feature` - Yeni özellik
- `type: enhancement` - İyileştirme
- `type: documentation` - Dokümantasyon

### Status
- `status: needs-review` - Review bekliyor
- `status: in-progress` - Devam ediyor
- `status: blocked` - Engellenmiş

### Difficulty
- `good first issue` - Yeni başlayanlar için
- `help wanted` - Yardım isteniyor
- `difficulty: easy` - Kolay
- `difficulty: medium` - Orta
- `difficulty: hard` - Zor

## 🎉 Teşekkürler

Katkılarınız için teşekkür ederiz! Her katkı, projeyi daha iyi hale getirir.

### Katkıda Bulunanlar

Tüm katkıda bulunanlar [Contributors](https://github.com/yourusername/trendyol-profit-calculator/graphs/contributors) sayfasında listelenir.

### Tanınma

- README'de mention
- Release notes'ta teşekkür
- Discord'da özel rol

## 📞 İletişim

Sorularınız için:

- 💬 [Discord](https://discord.gg/your-server)
- 📧 [Email](mailto:support@trendyol-calculator.com)
- 🐦 [Twitter](https://twitter.com/trendyol_calc)

---

Mutlu kodlamalar! 🚀
\`\`\`

```text file="LICENSE"
MIT License

Copyright (c) 2024 Trendyol Karlılık Hesaplama Aracı

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
