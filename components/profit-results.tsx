"use client"

import { ArrowDown, ArrowUp, DollarSign, Percent, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ProfitData } from "./profit-calculator"

interface ProfitResultsProps {
  productData: ProfitData
  results: {
    revenue: number
    vatAmount: number
    commissionAmount: number
    totalCost: number
    profit: number
    profitMargin: number
    roi: number
  }
}

export function ProfitResults({ productData, results }: ProfitResultsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value)
  }

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  }

  const isProfitable = results.profit > 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <span className="mr-2">Karlılık Sonuçları</span>
            {isProfitable ? (
              <ArrowUp className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowDown className="h-5 w-5 text-red-500" />
            )}
          </CardTitle>
          <CardDescription>
            {productData.productName
              ? `"${productData.productName}" ürünü için karlılık analizi`
              : "Ürün karlılık analizi"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Satış Fiyatı</span>
                  <span className="font-medium">{formatCurrency(results.revenue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Alış Maliyeti</span>
                  <span className="font-medium">{formatCurrency(productData.purchasePrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Komisyon ({productData.commissionRate}%)</span>
                  <span className="font-medium">{formatCurrency(results.commissionAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kargo Maliyeti</span>
                  <span className="font-medium">{formatCurrency(productData.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Diğer Maliyetler</span>
                  <span className="font-medium">{formatCurrency(productData.otherCosts)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">KDV ({productData.vatRate}%)</span>
                  <span className="font-medium">{formatCurrency(results.vatAmount)}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Toplam Maliyet</span>
                    <span>{formatCurrency(results.totalCost)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Net Kar</span>
                  <span className={isProfitable ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(results.profit)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Kar Marjı</span>
                    <span className={`text-sm font-medium ${isProfitable ? "text-green-600" : "text-red-600"}`}>
                      {formatPercent(results.profitMargin)}
                    </span>
                  </div>
                  <Progress
                    value={Math.max(0, Math.min(100, results.profitMargin))}
                    className={`h-2 ${isProfitable ? "bg-green-100" : "bg-red-100"}`}
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Yatırım Getirisi (ROI)</span>
                    <span className={`text-sm font-medium ${isProfitable ? "text-green-600" : "text-red-600"}`}>
                      {formatPercent(results.roi)}
                    </span>
                  </div>
                  <Progress
                    value={Math.max(0, Math.min(100, results.roi))}
                    className={`h-2 ${isProfitable ? "bg-green-100" : "bg-red-100"}`}
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Karlılık Analizi
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Percent className="h-4 w-4 mr-1 mt-0.5 text-gray-500" />
                    <span>
                      Satış fiyatının <strong>{formatPercent(productData.commissionRate)}</strong> kadarı Trendyol
                      komisyonu olarak kesilmektedir.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <DollarSign className="h-4 w-4 mr-1 mt-0.5 text-gray-500" />
                    <span>
                      Her satışta <strong>{formatCurrency(results.profit)}</strong> net kar elde ediyorsunuz.
                    </span>
                  </li>
                  {isProfitable ? (
                    <li className="flex items-start text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1 mt-0.5" />
                      <span>
                        Bu ürün karlı görünüyor! Yatırımınızın <strong>{formatPercent(results.roi)}</strong> kadarını
                        geri kazanıyorsunuz.
                      </span>
                    </li>
                  ) : (
                    <li className="flex items-start text-red-600">
                      <ArrowDown className="h-4 w-4 mr-1 mt-0.5" />
                      <span>
                        Bu ürün zarar ediyor. Fiyatlandırma stratejinizi veya maliyetlerinizi gözden geçirmeniz
                        önerilir.
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
