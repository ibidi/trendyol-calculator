import { ProfitCalculator } from "@/components/profit-calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
            Trendyol Ürün Karlılık Hesaplama Aracı
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trendyol'da satacağınız ürünlerin maliyetlerini, komisyonlarını ve karlılığını hesaplayın.
          </p>
        </header>

        <ProfitCalculator />

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            Bu araç sadece bilgilendirme amaçlıdır. Gerçek karlılık hesaplamaları için Trendyol'un güncel komisyon
            oranlarını kontrol ediniz.
          </p>
        </footer>
      </div>
    </main>
  )
}
