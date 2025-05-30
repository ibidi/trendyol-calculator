"use server"

export interface ApiConfig {
  name: string
  endpoint: string
  method: "GET" | "POST" | "PUT"
  headers: Record<string, string>
  body?: string
  apiKey: string
  authType: "none" | "apikey" | "bearer" | "basic"
  responseFormat: "json" | "xml" | "csv"
  dataPath: string
  fieldMapping: {
    id: string
    name: string
    commissionRate: string
    subCategories: string
  }
}

export interface TrendyolCategory {
  id: number
  name: string
  commissionRate: number
  subCategories?: TrendyolCategory[]
}

// Özel API'yi test etme fonksiyonu
export async function testCustomApi(config: ApiConfig): Promise<{
  success: boolean
  message: string
  categoriesFound?: number
  sampleData?: any
  error?: string
}> {
  try {
    console.log("🧪 Özel API test ediliyor:", config.name)

    // Request headers'ı hazırla
    const headers: Record<string, string> = { ...config.headers }

    // Authentication ekle
    if (config.authType === "apikey" && config.apiKey) {
      headers["X-API-Key"] = config.apiKey
    } else if (config.authType === "bearer" && config.apiKey) {
      headers["Authorization"] = `Bearer ${config.apiKey}`
    } else if (config.authType === "basic" && config.apiKey) {
      headers["Authorization"] = `Basic ${btoa(config.apiKey)}`
    }

    // Request options'ı hazırla
    const requestOptions: RequestInit = {
      method: config.method,
      headers,
    }

    if ((config.method === "POST" || config.method === "PUT") && config.body) {
      requestOptions.body = config.body
    }

    // API çağrısını yap
    const response = await fetch(config.endpoint, requestOptions)

    console.log(`🧪 Response Status: ${response.status}`)

    if (!response.ok) {
      return {
        success: false,
        message: `API hatası: ${response.status} ${response.statusText}`,
        error: `HTTP ${response.status}`,
      }
    }

    // Response'u parse et
    let data: any
    if (config.responseFormat === "json") {
      data = await response.json()
    } else if (config.responseFormat === "xml") {
      const text = await response.text()
      // Basit XML parsing (gerçek projede xml2js kullanılabilir)
      data = { rawXml: text }
    } else if (config.responseFormat === "csv") {
      const text = await response.text()
      // Basit CSV parsing
      data = { rawCsv: text }
    }

    console.log("🧪 Raw API Response:", data)

    // Data path'i kullanarak veriyi çıkar
    let extractedData = data
    if (config.dataPath) {
      const pathParts = config.dataPath.split(".")
      for (const part of pathParts) {
        if (extractedData && extractedData[part] !== undefined) {
          extractedData = extractedData[part]
        } else {
          return {
            success: false,
            message: `Veri yolu '${config.dataPath}' bulunamadı`,
            sampleData: data,
            error: "Data path not found",
          }
        }
      }
    }

    console.log("🧪 Extracted Data:", extractedData)

    // Kategorileri parse et
    const categories = parseCustomApiResponse(extractedData, config.fieldMapping)

    return {
      success: true,
      message: `API test başarılı! ${categories.length} kategori bulundu`,
      categoriesFound: categories.length,
      sampleData: categories.slice(0, 3), // İlk 3 kategoriyi örnek olarak göster
    }
  } catch (error) {
    console.error("🧪 API Test Error:", error)
    return {
      success: false,
      message: "API test hatası",
      error: error.toString(),
    }
  }
}

// Özel API yanıtını parse etme fonksiyonu
function parseCustomApiResponse(data: any, fieldMapping: ApiConfig["fieldMapping"]): TrendyolCategory[] {
  try {
    if (!data) {
      console.log("❌ Data is null or undefined")
      return []
    }

    if (!Array.isArray(data)) {
      console.log("❌ Data is not an array:", typeof data)
      return []
    }

    const result = data
      .map((item: any) => {
        if (!item || typeof item !== "object") return null

        // Field mapping'i kullanarak değerleri çıkar
        const id = getNestedValue(item, fieldMapping.id) || Math.floor(Math.random() * 10000)
        const name = getNestedValue(item, fieldMapping.name) || "Bilinmeyen Kategori"
        const commissionRate = getNestedValue(item, fieldMapping.commissionRate) || 12
        const subCategoriesData = getNestedValue(item, fieldMapping.subCategories) || []

        // Alt kategorileri recursive olarak parse et
        const subCategories = Array.isArray(subCategoriesData)
          ? parseCustomApiResponse(subCategoriesData, fieldMapping)
          : []

        return {
          id: Number(id),
          name: String(name),
          commissionRate: Number(commissionRate),
          subCategories,
        }
      })
      .filter((item): item is TrendyolCategory => item !== null && item.name !== "Bilinmeyen Kategori")

    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error("❌ Parse error:", error)
    return []
  }
}

// Nested object'ten değer çıkarma yardımcı fonksiyonu
function getNestedValue(obj: any, path: string): any {
  if (!path) return undefined

  const keys = path.split(".")
  let current = obj

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }

  return current
}

// Özel API ile kategorileri çekme fonksiyonu
export async function fetchCategoriesWithCustomApi(config: ApiConfig): Promise<TrendyolCategory[]> {
  try {
    const testResult = await testCustomApi(config)
    if (testResult.success && testResult.sampleData) {
      // Tam veriyi çekmek için tekrar API çağrısı yap
      const headers: Record<string, string> = { ...config.headers }

      if (config.authType === "apikey" && config.apiKey) {
        headers["X-API-Key"] = config.apiKey
      } else if (config.authType === "bearer" && config.apiKey) {
        headers["Authorization"] = `Bearer ${config.apiKey}`
      } else if (config.authType === "basic" && config.apiKey) {
        headers["Authorization"] = `Basic ${btoa(config.apiKey)}`
      }

      const requestOptions: RequestInit = {
        method: config.method,
        headers,
      }

      if ((config.method === "POST" || config.method === "PUT") && config.body) {
        requestOptions.body = config.body
      }

      const response = await fetch(config.endpoint, requestOptions)
      if (response.ok) {
        let data: any
        if (config.responseFormat === "json") {
          data = await response.json()
        } else {
          throw new Error("Sadece JSON formatı destekleniyor")
        }

        // Data path'i kullanarak veriyi çıkar
        let extractedData = data
        if (config.dataPath) {
          const pathParts = config.dataPath.split(".")
          for (const part of pathParts) {
            if (extractedData && extractedData[part] !== undefined) {
              extractedData = extractedData[part]
            } else {
              throw new Error(`Veri yolu '${config.dataPath}' bulunamadı`)
            }
          }
        }

        const result = parseCustomApiResponse(extractedData, config.fieldMapping)
        return Array.isArray(result) ? result : []
      }
    }

    throw new Error("API'den veri alınamadı")
  } catch (error) {
    console.error("Özel API'den kategoriler çekilemedi:", error)
    return []
  }
}

// API konfigürasyonunu kaydetme (localStorage kullanarak)
export async function saveApiConfig(config: ApiConfig): Promise<void> {
  try {
    // Server-side'da localStorage yok, bu yüzden bu fonksiyon client-side'da çalışacak
    if (typeof window !== "undefined") {
      const savedConfigs = JSON.parse(localStorage.getItem("apiConfigs") || "[]")
      const existingIndex = savedConfigs.findIndex((c: ApiConfig) => c.name === config.name)

      if (existingIndex >= 0) {
        savedConfigs[existingIndex] = config
      } else {
        savedConfigs.push(config)
      }

      localStorage.setItem("apiConfigs", JSON.stringify(savedConfigs))
    }
  } catch (error) {
    throw new Error("Konfigürasyon kaydedilemedi: " + error)
  }
}

// API konfigürasyonunu yükleme
export async function loadApiConfig(): Promise<ApiConfig[]> {
  try {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("apiConfigs") || "[]")
    }
    return []
  } catch (error) {
    console.error("Konfigürasyonlar yüklenemedi:", error)
    return []
  }
}

// Varsayılan mock kategoriler
export function getMockCategories(): TrendyolCategory[] {
  try {
    return [
      {
        id: 1,
        name: "Elektronik",
        commissionRate: 12.5,
        subCategories: [
          { id: 101, name: "Cep Telefonu", commissionRate: 13.5 },
          { id: 102, name: "Bilgisayar & Tablet", commissionRate: 11.8 },
          { id: 103, name: "TV & Ses Sistemleri", commissionRate: 12.2 },
          { id: 104, name: "Kulaklık", commissionRate: 14.0 },
          { id: 105, name: "Akıllı Saat", commissionRate: 15.0 },
          { id: 106, name: "Oyun & Konsol", commissionRate: 10.5 },
          { id: 107, name: "Fotoğraf & Kamera", commissionRate: 13.0 },
          { id: 108, name: "Elektrikli Ev Aletleri", commissionRate: 11.0 },
        ],
      },
      {
        id: 2,
        name: "Moda",
        commissionRate: 15.0,
        subCategories: [
          { id: 201, name: "Kadın Giyim", commissionRate: 15.5 },
          { id: 202, name: "Erkek Giyim", commissionRate: 14.8 },
          { id: 203, name: "Çocuk Giyim", commissionRate: 14.0 },
          { id: 204, name: "Ayakkabı", commissionRate: 16.0 },
          { id: 205, name: "Çanta", commissionRate: 17.0 },
          { id: 206, name: "Aksesuar & Takı", commissionRate: 18.0 },
          { id: 207, name: "İç Giyim", commissionRate: 15.5 },
          { id: 208, name: "Büyük Beden", commissionRate: 15.0 },
        ],
      },
      {
        id: 3,
        name: "Ev & Yaşam",
        commissionRate: 10.5,
        subCategories: [
          { id: 301, name: "Mobilya", commissionRate: 11.0 },
          { id: 302, name: "Mutfak & Sofra", commissionRate: 9.5 },
          { id: 303, name: "Dekorasyon", commissionRate: 10.0 },
          { id: 304, name: "Bahçe & Yapı Market", commissionRate: 9.0 },
          { id: 305, name: "Temizlik", commissionRate: 8.5 },
          { id: 306, name: "Ev Tekstili", commissionRate: 12.0 },
          { id: 307, name: "Aydınlatma", commissionRate: 11.5 },
          { id: 308, name: "Banyo", commissionRate: 10.5 },
        ],
      },
      {
        id: 4,
        name: "Kozmetik & Kişisel Bakım",
        commissionRate: 16.0,
        subCategories: [
          { id: 401, name: "Makyaj", commissionRate: 16.5 },
          { id: 402, name: "Cilt Bakımı", commissionRate: 15.8 },
          { id: 403, name: "Parfüm", commissionRate: 17.0 },
          { id: 404, name: "Saç Bakımı", commissionRate: 15.0 },
          { id: 405, name: "Kişisel Bakım", commissionRate: 14.5 },
          { id: 406, name: "Ağız & Diş Bakımı", commissionRate: 13.5 },
          { id: 407, name: "Erkek Bakım & Tıraş", commissionRate: 14.0 },
        ],
      },
      {
        id: 5,
        name: "Spor & Outdoor",
        commissionRate: 13.0,
        subCategories: [
          { id: 501, name: "Spor Giyim", commissionRate: 13.5 },
          { id: 502, name: "Spor Ayakkabısı", commissionRate: 14.0 },
          { id: 503, name: "Fitness & Kondisyon", commissionRate: 12.8 },
          { id: 504, name: "Outdoor", commissionRate: 11.5 },
          { id: 505, name: "Bisiklet", commissionRate: 12.0 },
          { id: 506, name: "Su Sporları", commissionRate: 13.5 },
          { id: 507, name: "Kış Sporları", commissionRate: 14.5 },
        ],
      },
      {
        id: 6,
        name: "Kitap, Müzik & Film",
        commissionRate: 8.0,
        subCategories: [
          { id: 601, name: "Kitap", commissionRate: 8.5 },
          { id: 602, name: "Dergi", commissionRate: 7.0 },
          { id: 603, name: "Müzik", commissionRate: 7.5 },
          { id: 604, name: "Film", commissionRate: 8.0 },
          { id: 605, name: "Oyun", commissionRate: 12.0 },
          { id: 606, name: "Hobi", commissionRate: 10.0 },
        ],
      },
      {
        id: 7,
        name: "Anne & Bebek",
        commissionRate: 11.0,
        subCategories: [
          { id: 701, name: "Bebek Giyim", commissionRate: 11.5 },
          { id: 702, name: "Bebek Bakım", commissionRate: 10.5 },
          { id: 703, name: "Bebek Oyuncak", commissionRate: 12.0 },
          { id: 704, name: "Bebek Arabası & Oto Koltuğu", commissionRate: 10.0 },
          { id: 705, name: "Emzirme & Beslenme", commissionRate: 11.0 },
          { id: 706, name: "Bebek Odası", commissionRate: 10.5 },
          { id: 707, name: "Anne", commissionRate: 12.0 },
        ],
      },
      {
        id: 8,
        name: "Otomotiv & Motosiklet",
        commissionRate: 9.0,
        subCategories: [
          { id: 801, name: "Oto Aksesuar", commissionRate: 9.5 },
          { id: 802, name: "Oto Yedek Parça", commissionRate: 8.5 },
          { id: 803, name: "Oto Bakım", commissionRate: 9.0 },
          { id: 804, name: "Motosiklet", commissionRate: 10.0 },
          { id: 805, name: "Motorsiklet Aksesuar", commissionRate: 10.5 },
        ],
      },
      {
        id: 9,
        name: "Süpermarket",
        commissionRate: 7.0,
        subCategories: [
          { id: 901, name: "Gıda", commissionRate: 7.5 },
          { id: 902, name: "İçecek", commissionRate: 7.0 },
          { id: 903, name: "Temizlik & Kağıt", commissionRate: 6.5 },
          { id: 904, name: "Kişisel Bakım", commissionRate: 8.0 },
          { id: 905, name: "Bebek", commissionRate: 7.5 },
          { id: 906, name: "Pet Shop", commissionRate: 8.5 },
        ],
      },
      {
        id: 10,
        name: "Oyuncak",
        commissionRate: 12.0,
        subCategories: [
          { id: 1001, name: "Eğitici Oyuncak", commissionRate: 12.5 },
          { id: 1002, name: "Bebek & Oyuncak Bebek", commissionRate: 12.0 },
          { id: 1003, name: "Oyuncak Araba", commissionRate: 11.5 },
          { id: 1004, name: "Puzzle", commissionRate: 11.0 },
          { id: 1005, name: "Sanat & Zanaat", commissionRate: 10.0 },
          { id: 1006, name: "Açık Hava Oyuncakları", commissionRate: 12.5 },
        ],
      },
      {
        id: 11,
        name: "Saat & Aksesuar",
        commissionRate: 18.0,
        subCategories: [
          { id: 1101, name: "Erkek Saat", commissionRate: 18.5 },
          { id: 1102, name: "Kadın Saat", commissionRate: 18.5 },
          { id: 1103, name: "Çocuk Saat", commissionRate: 17.0 },
          { id: 1104, name: "Akıllı Saat", commissionRate: 15.0 },
          { id: 1105, name: "Saat Aksesuar", commissionRate: 19.0 },
        ],
      },
      {
        id: 12,
        name: "Yapı Market",
        commissionRate: 8.0,
        subCategories: [
          { id: 1201, name: "El Aletleri", commissionRate: 8.5 },
          { id: 1202, name: "Elektrikli Aletler", commissionRate: 9.0 },
          { id: 1203, name: "Bahçe Aletleri", commissionRate: 8.0 },
          { id: 1204, name: "Hırdavat", commissionRate: 7.5 },
          { id: 1205, name: "Elektrik & Tesisat", commissionRate: 8.5 },
        ],
      },
    ]
  } catch (error) {
    console.error("Mock kategoriler oluşturulamadı:", error)
    return []
  }
}
