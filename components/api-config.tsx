"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Settings, Save, TestTube, Eye, EyeOff, Download, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { testCustomApi, saveApiConfig, loadApiConfig, type ApiConfig } from "@/app/actions/api-config"

interface ApiConfigProps {
  onConfigChange: (config: ApiConfig) => void
}

export function ApiConfigComponent({ onConfigChange }: ApiConfigProps) {
  const [config, setConfig] = useState<ApiConfig>({
    name: "Varsayılan",
    endpoint: "",
    method: "GET",
    headers: {},
    body: "",
    apiKey: "",
    authType: "none",
    responseFormat: "json",
    dataPath: "",
    fieldMapping: {
      id: "id",
      name: "name",
      commissionRate: "commissionRate",
      subCategories: "subCategories",
    },
  })

  const [showApiKey, setShowApiKey] = useState(false)
  const [isTestingApi, setIsTestingApi] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [savedConfigs, setSavedConfigs] = useState<ApiConfig[]>([])

  useEffect(() => {
    loadSavedConfigs()
  }, [])

  const loadSavedConfigs = async () => {
    try {
      const configs = await loadApiConfig()
      setSavedConfigs(configs)
      if (configs.length > 0) {
        setConfig(configs[0])
        onConfigChange(configs[0])
      }
    } catch (error) {
      console.error("Kaydedilmiş konfigürasyonlar yüklenemedi:", error)
    }
  }

  const handleConfigChange = (field: keyof ApiConfig, value: any) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const handleHeaderChange = (key: string, value: string) => {
    const newHeaders = { ...config.headers }
    if (value.trim()) {
      newHeaders[key] = value
    } else {
      delete newHeaders[key]
    }
    handleConfigChange("headers", newHeaders)
  }

  const handleFieldMappingChange = (field: keyof typeof config.fieldMapping, value: string) => {
    const newMapping = { ...config.fieldMapping, [field]: value }
    handleConfigChange("fieldMapping", newMapping)
  }

  const saveConfig = async () => {
    try {
      await saveApiConfig(config)
      await loadSavedConfigs()
      alert("Konfigürasyon kaydedildi!")
    } catch (error) {
      alert("Konfigürasyon kaydedilemedi: " + error)
    }
  }

  const testApi = async () => {
    setIsTestingApi(true)
    setTestResult(null)
    try {
      const result = await testCustomApi(config)
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: "Test hatası",
        error: error.toString(),
      })
    } finally {
      setIsTestingApi(false)
    }
  }

  const loadPresetConfig = (configName: string) => {
    const presets: Record<string, Partial<ApiConfig>> = {
      trendyol: {
        name: "Trendyol API",
        endpoint: "https://api.trendyol.com/categories",
        method: "GET",
        headers: { Accept: "application/json" },
        authType: "apikey",
        responseFormat: "json",
        dataPath: "data.categories",
        fieldMapping: {
          id: "id",
          name: "name",
          commissionRate: "commissionRate",
          subCategories: "subCategories",
        },
      },
      nesatilir: {
        name: "Nesatilir API",
        endpoint: "https://api.nesatilir.com/api/v1/GetCategoriesForCalculator",
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: "{}",
        authType: "none",
        responseFormat: "json",
        dataPath: "data",
        fieldMapping: {
          id: "id",
          name: "name",
          commissionRate: "commissionRate",
          subCategories: "subCategories",
        },
      },
      custom: {
        name: "Özel API",
        endpoint: "",
        method: "GET",
        headers: {},
        authType: "none",
        responseFormat: "json",
        dataPath: "",
        fieldMapping: {
          id: "id",
          name: "name",
          commissionRate: "commissionRate",
          subCategories: "subCategories",
        },
      },
    }

    const preset = presets[configName]
    if (preset) {
      const newConfig = { ...config, ...preset }
      setConfig(newConfig)
      onConfigChange(newConfig)
    }
  }

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `api-config-${config.name.toLowerCase().replace(/\s+/g, "-")}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string)
          setConfig(importedConfig)
          onConfigChange(importedConfig)
          alert("Konfigürasyon başarıyla içe aktarıldı!")
        } catch (error) {
          alert("Geçersiz konfigürasyon dosyası!")
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          API Konfigürasyonu
        </CardTitle>
        <CardDescription>
          Kendi API'nizi kullanarak kategorileri çekin. Bu proje açık kaynak olduğu için herkes kendi API'sini entegre
          edebilir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Temel</TabsTrigger>
            <TabsTrigger value="auth">Kimlik Doğrulama</TabsTrigger>
            <TabsTrigger value="mapping">Alan Eşleştirme</TabsTrigger>
            <TabsTrigger value="test">Test & Kaydet</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset">Hazır Konfigürasyon</Label>
              <Select onValueChange={loadPresetConfig}>
                <SelectTrigger>
                  <SelectValue placeholder="Hazır konfigürasyon seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trendyol">Trendyol API</SelectItem>
                  <SelectItem value="nesatilir">Nesatilir API</SelectItem>
                  <SelectItem value="custom">Özel API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Konfigürasyon Adı</Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => handleConfigChange("name", e.target.value)}
                placeholder="Örn: Benim API'im"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint URL</Label>
              <Input
                id="endpoint"
                value={config.endpoint}
                onChange={(e) => handleConfigChange("endpoint", e.target.value)}
                placeholder="https://api.example.com/categories"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="method">HTTP Metodu</Label>
                <Select value={config.method} onValueChange={(value) => handleConfigChange("method", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responseFormat">Yanıt Formatı</Label>
                <Select
                  value={config.responseFormat}
                  onValueChange={(value) => handleConfigChange("responseFormat", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataPath">Veri Yolu (JSON Path)</Label>
              <Input
                id="dataPath"
                value={config.dataPath}
                onChange={(e) => handleConfigChange("dataPath", e.target.value)}
                placeholder="data.categories veya categories veya boş bırakın"
              />
              <p className="text-xs text-gray-500">
                API yanıtında kategorilerin bulunduğu yol. Örn: "data.categories" veya "result.items"
              </p>
            </div>

            {(config.method === "POST" || config.method === "PUT") && (
              <div className="space-y-2">
                <Label htmlFor="body">Request Body (JSON)</Label>
                <Textarea
                  id="body"
                  value={config.body}
                  onChange={(e) => handleConfigChange("body", e.target.value)}
                  placeholder='{"action": "getCategories"}'
                  rows={3}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="authType">Kimlik Doğrulama Türü</Label>
              <Select value={config.authType} onValueChange={(value) => handleConfigChange("authType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Yok</SelectItem>
                  <SelectItem value="apikey">API Key</SelectItem>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.authType !== "none" && (
              <div className="space-y-2">
                <Label htmlFor="apiKey">
                  {config.authType === "apikey"
                    ? "API Key"
                    : config.authType === "bearer"
                      ? "Bearer Token"
                      : "Username:Password"}
                </Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={config.apiKey}
                    onChange={(e) => handleConfigChange("apiKey", e.target.value)}
                    placeholder={
                      config.authType === "apikey"
                        ? "your-api-key-here"
                        : config.authType === "bearer"
                          ? "your-bearer-token"
                          : "username:password"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Özel Header'lar</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Header adı" id="header-key" />
                  <div className="flex gap-2">
                    <Input placeholder="Header değeri" id="header-value" />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        const key = (document.getElementById("header-key") as HTMLInputElement)?.value
                        const value = (document.getElementById("header-value") as HTMLInputElement)?.value
                        if (key && value) {
                          handleHeaderChange(key, value)
                          ;(document.getElementById("header-key") as HTMLInputElement).value = ""
                          ;(document.getElementById("header-value") as HTMLInputElement).value = ""
                        }
                      }}
                    >
                      Ekle
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                {Object.entries(config.headers).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">
                      <strong>{key}:</strong> {value}
                    </span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleHeaderChange(key, "")}>
                      Sil
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <Alert>
              <AlertDescription>
                API'nizin döndürdüğü veri alanlarını uygulamamızın beklediği alanlarla eşleştirin.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id-mapping">ID Alanı</Label>
                <Input
                  id="id-mapping"
                  value={config.fieldMapping.id}
                  onChange={(e) => handleFieldMappingChange("id", e.target.value)}
                  placeholder="id, categoryId, cat_id"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name-mapping">İsim Alanı</Label>
                <Input
                  id="name-mapping"
                  value={config.fieldMapping.name}
                  onChange={(e) => handleFieldMappingChange("name", e.target.value)}
                  placeholder="name, categoryName, title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission-mapping">Komisyon Oranı Alanı</Label>
                <Input
                  id="commission-mapping"
                  value={config.fieldMapping.commissionRate}
                  onChange={(e) => handleFieldMappingChange("commissionRate", e.target.value)}
                  placeholder="commissionRate, commission, rate"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategories-mapping">Alt Kategoriler Alanı</Label>
                <Input
                  id="subcategories-mapping"
                  value={config.fieldMapping.subCategories}
                  onChange={(e) => handleFieldMappingChange("subCategories", e.target.value)}
                  placeholder="subCategories, children, subcats"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Örnek API Yanıtı</Label>
              <Textarea
                readOnly
                value={`{
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
}`}
                rows={10}
                className="text-xs"
              />
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={testApi} disabled={isTestingApi} className="flex-1">
                <TestTube className={`mr-2 h-4 w-4 ${isTestingApi ? "animate-pulse" : ""}`} />
                {isTestingApi ? "Test Ediliyor..." : "API'yi Test Et"}
              </Button>
              <Button onClick={saveConfig} variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Kaydet
              </Button>
            </div>

            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>
                      <strong>Sonuç:</strong> {testResult.message}
                    </p>
                    {testResult.categoriesFound && (
                      <p>
                        <strong>Bulunan Kategoriler:</strong> {testResult.categoriesFound}
                      </p>
                    )}
                    {testResult.error && (
                      <p>
                        <strong>Hata:</strong> {testResult.error}
                      </p>
                    )}
                    {testResult.sampleData && (
                      <details>
                        <summary className="cursor-pointer">Örnek Veri</summary>
                        <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto">
                          {JSON.stringify(testResult.sampleData, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>Kaydedilmiş Konfigürasyonlar</Label>
              <div className="space-y-2">
                {savedConfigs.map((savedConfig, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{savedConfig.name}</span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setConfig(savedConfig)
                          onConfigChange(savedConfig)
                        }}
                      >
                        Yükle
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={exportConfig} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Dışa Aktar
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importConfig}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  İçe Aktar
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
