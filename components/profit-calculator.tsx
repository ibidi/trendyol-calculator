"use client"

import { useState, useEffect } from "react"
import { Calculator, DollarSign, ShoppingCart, TrendingUp, BarChart3, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { ProfitResults } from "./profit-results"
import { ProfitCharts } from "./profit-charts"
import { CategorySelector } from "./category-selector"
import { ApiConfigComponent } from "./api-config"
import {
  fetchCategoriesWithCustomApi,
  getMockCategories,
  type ApiConfig,
  type TrendyolCategory,
} from "@/app/actions/api-config"

export interface ProfitData {
  productName: string
  purchasePrice: number
  sellingPrice: number
  commissionRate: number
  shippingCost: number
  otherCosts: number
  vatRate: number
  category?: TrendyolCategory | null
}

export function ProfitCalculator() {
  const [productData, setProductData] = useState<ProfitData>({
    productName: "",
    purchasePrice: 0,
    sellingPrice: 0,
    commissionRate: 12,
    shippingCost: 0,
    otherCosts: 0,
    vatRate: 20,
    category: null,
  })

  const [calculatedResults, setCalculatedResults] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState("calculator")
  const [categories, setCategories] = useState<TrendyolCategory[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [currentApiConfig, setCurrentApiConfig] = useState<ApiConfig | null>(null)
  const [showApiConfig, setShowApiConfig] = useState(false)

  useEffect(() => {
    // Başlangıçta mock kategorileri yükle
    try {
      const mockCategories = getMockCategories()
      setCategories(Array.isArray(mockCategories) ? mockCategories : [])
    } catch (error) {
      console.error("Mock kategoriler yüklenemedi:", error)
      setCategories([])
    }
  }, [])

  const handleApiConfigChange = (config: ApiConfig) => {
    setCurrentApiConfig(config)
    if (config.endpoint) {
      loadCategoriesWithConfig(config)
    }
  }

  const loadCategoriesWithConfig = async (config: ApiConfig) => {
    setIsLoadingCategories(true)
    try {
      const fetchedCategories = await fetchCategoriesWithCustomApi(config)
      if (Array.isArray(fetchedCategories) && fetchedCategories.length > 0) {
        setCategories(fetchedCategories)
      } else {
        // API'den veri gelmezse mock data kullan
        const mockCategories = getMockCategories()
        setCategories(Array.isArray(mockCategories) ? mockCategories : [])
      }
    } catch (error) {
      console.error("API'den kategoriler yüklenemedi:", error)
      const mockCategories = getMockCategories()
      setCategories(Array.isArray(mockCategories) ? mockCategories : [])
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleInputChange = (field: keyof ProfitData, value: string | number) => {
    let parsedValue = typeof value === "string" ? Number.parseFloat(value) || 0 : value

    if (field === "commissionRate" || field === "vatRate") {
      parsedValue = Math.min(100, Math.max(0, parsedValue))
    }

    setProductData({
      ...productData,
      [field]: parsedValue,
    })
  }

  const handleCategorySelect = (category: TrendyolCategory | null) => {
    if (category) {
      setProductData({
        ...productData,
        category,
        commissionRate: category.commissionRate,
      })
    }
  }

  const calculateProfit = () => {
    const { purchasePrice, sellingPrice, commissionRate, shippingCost, otherCosts, vatRate } = productData

    const vatAmount = (sellingPrice * vatRate) / 100
    const commissionAmount = (sellingPrice * commissionRate) / 100
    const totalCost = purchasePrice + shippingCost + otherCosts + commissionAmount
    const profit = sellingPrice - totalCost
    const profitMargin = (profit / sellingPrice) * 100

    const results = {
      revenue: sellingPrice,
      vatAmount,
      commissionAmount,
      totalCost,
      profit,
      profitMargin,
      roi: (profit / purchasePrice) * 100,
    }

    setCalculatedResults(results)
    setShowResults(true)
    setActiveTab("results")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">
            <Calculator className="mr-2 h-4 w-4" />
            Hesaplama
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!showResults}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Sonuçlar
          </TabsTrigger>
          <TabsTrigger value="charts" disabled={!showResults}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Grafikler
          </TabsTrigger>
          <TabsTrigger value="api-config">
            <Settings className="mr-2 h-4 w-4" />
            API Ayarları
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Ürün Bilgileri</CardTitle>
              <CardDescription>
                Karlılık hesaplaması için ürün detaylarını girin.
                {currentApiConfig?.name && (
                  <span className="block mt-1 text-green-600">🔗 {currentApiConfig.name} API'si kullanılıyor</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productName">Ürün Adı</Label>
                <Input
                  id="productName"
                  placeholder="Ürün adını girin"
                  value={productData.productName}
                  onChange={(e) => handleInputChange("productName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="category">Ürün Kategorisi</Label>
                  <Button variant="outline" size="sm" onClick={() => setShowApiConfig(!showApiConfig)}>
                    <Settings className="h-4 w-4 mr-1" />
                    API Ayarları
                  </Button>
                </div>

                {showApiConfig && (
                  <div className="mb-4">
                    <ApiConfigComponent onConfigChange={handleApiConfigChange} />
                  </div>
                )}

                <CategorySelector
                  categories={categories}
                  onCategorySelect={handleCategorySelect}
                  isLoading={isLoadingCategories}
                />

                {productData.category && (
                  <div className="text-xs text-gray-500 mt-1 p-2 bg-green-50 rounded border">
                    <strong>Seçilen kategori:</strong> {productData.category.name}
                    <br />
                    <strong>Komisyon oranı:</strong> %{productData.category.commissionRate}
                    {!currentApiConfig?.endpoint && (
                      <div className="text-orange-600 mt-1">
                        ⚠️ Varsayılan kategoriler kullanılıyor. Güncel veriler için API ayarlarını yapılandırın.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Alış Fiyatı (₺)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="purchasePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8"
                      value={productData.purchasePrice || ""}
                      onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Satış Fiyatı (₺)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="sellingPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8"
                      value={productData.sellingPrice || ""}
                      onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="commissionRate">Komisyon Oranı (%{productData.commissionRate})</Label>
                  <span className="text-sm text-gray-500">{productData.commissionRate}%</span>
                </div>
                <Slider
                  id="commissionRate"
                  min={0}
                  max={35}
                  step={0.5}
                  value={[productData.commissionRate]}
                  onValueChange={(value) => handleInputChange("commissionRate", value[0])}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Not: Kategori seçtiğinizde komisyon oranı otomatik olarak güncellenir.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Kargo Maliyeti (₺)</Label>
                  <div className="relative">
                    <ShoppingCart className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="shippingCost"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8"
                      value={productData.shippingCost || ""}
                      onChange={(e) => handleInputChange("shippingCost", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherCosts">Diğer Maliyetler (₺)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="otherCosts"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8"
                      value={productData.otherCosts || ""}
                      onChange={(e) => handleInputChange("otherCosts", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="vatRate">KDV Oranı (%{productData.vatRate})</Label>
                  <span className="text-sm text-gray-500">{productData.vatRate}%</span>
                </div>
                <Slider
                  id="vatRate"
                  min={0}
                  max={20}
                  step={1}
                  value={[productData.vatRate]}
                  onValueChange={(value) => handleInputChange("vatRate", value[0])}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={calculateProfit}
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={!productData.sellingPrice || !productData.purchasePrice}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Karlılık Hesapla
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {calculatedResults && <ProfitResults productData={productData} results={calculatedResults} />}
        </TabsContent>

        <TabsContent value="charts">
          {calculatedResults && <ProfitCharts productData={productData} results={calculatedResults} />}
        </TabsContent>

        <TabsContent value="api-config">
          <ApiConfigComponent onConfigChange={handleApiConfigChange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
