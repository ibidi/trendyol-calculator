"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ProfitData } from "./profit-calculator"

interface ProfitChartsProps {
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

export function ProfitCharts({ productData, results }: ProfitChartsProps) {
  const [activeChart, setActiveChart] = useState("breakdown")

  // Maliyet dağılımı verileri
  const costBreakdownData = [
    { name: "Alış Maliyeti", value: productData.purchasePrice, color: "#0088FE" },
    { name: "Komisyon", value: results.commissionAmount, color: "#FF8042" },
    { name: "Kargo", value: productData.shippingCost, color: "#FFBB28" },
    { name: "Diğer", value: productData.otherCosts, color: "#00C49F" },
    { name: "KDV", value: results.vatAmount, color: "#FF6384" },
  ].filter((item) => item.value > 0)

  // Kar-zarar analizi verileri
  const profitAnalysisData = [
    { name: "Satış Fiyatı", value: results.revenue, color: "#4CAF50" },
    { name: "Toplam Maliyet", value: results.totalCost, color: "#F44336" },
    { name: "Net Kar", value: results.profit, color: results.profit > 0 ? "#2196F3" : "#FF5722" },
  ]

  // Para birimi formatı
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value)
  }

  // Basit pasta grafik bileşeni
  const SimplePieChart = ({ data }: { data: any[] }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercentage = 0

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-64 h-64">
          <svg width="256" height="256" className="transform -rotate-90">
            <circle cx="128" cy="128" r="100" fill="none" stroke="#e5e7eb" strokeWidth="20" />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const strokeDasharray = `${percentage * 6.28} 628`
              const strokeDashoffset = -cumulativePercentage * 6.28
              cumulativePercentage += percentage

              return (
                <circle
                  key={index}
                  cx="128"
                  cy="128"
                  r="100"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold">Toplam</div>
              <div className="text-sm text-gray-600">{formatCurrency(total)}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{formatCurrency(item.value)}</span>
                <span className="text-gray-500 ml-1">({((item.value / total) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Basit çubuk grafik bileşeni
  const SimpleBarChart = ({ data }: { data: any[] }) => {
    const maxValue = Math.max(...data.map((item) => Math.abs(item.value)))

    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm font-bold">{formatCurrency(item.value)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                style={{
                  width: `${Math.abs(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color,
                }}
              >
                {item.value < 0 ? "Zarar" : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Raporları</CardTitle>
        <CardDescription>Ürün karlılık analizinin görsel gösterimi</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="breakdown">Maliyet Dağılımı</TabsTrigger>
            <TabsTrigger value="analysis">Kar-Zarar Analizi</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown" className="pt-6">
            <div className="flex justify-center">
              <SimplePieChart data={costBreakdownData} />
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="pt-6">
            <div className="max-w-md mx-auto">
              <SimpleBarChart data={profitAnalysisData} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
