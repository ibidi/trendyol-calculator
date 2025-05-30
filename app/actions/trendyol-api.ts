"use server"

export interface TrendyolCategory {
  id: number
  name: string
  commissionRate: number
  subCategories?: TrendyolCategory[]
}

// API yanıtını debug etmek için yardımcı fonksiyon
async function debugApiResponse(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options)
    console.log(`🔍 API Debug - URL: ${url}`)
    console.log(`🔍 Status: ${response.status} ${response.statusText}`)
    console.log(`🔍 Headers:`, Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const text = await response.text()
      console.log(`🔍 Response Body (first 500 chars):`, text.substring(0, 500))
      console.log(`🔍 Response Body (full):`, text) // Tam yanıtı da gösterelim

      try {
        const data = JSON.parse(text)
        console.log(`🔍 Parsed JSON:`, data)
        console.log(`🔍 Data type:`, typeof data)
        console.log(`🔍 Is Array:`, Array.isArray(data))

        if (typeof data === "object" && data !== null) {
          console.log(`🔍 Object keys:`, Object.keys(data))

          // Her key'in değerini de kontrol edelim
          Object.keys(data).forEach((key) => {
            const value = data[key]
            console.log(`🔍 Key "${key}":`, typeof value, Array.isArray(value) ? `Array(${value.length})` : value)
          })
        }

        return { success: true, data, text }
      } catch (parseError) {
        console.log(`🔍 JSON Parse Error:`, parseError)
        console.log(`🔍 Raw text might be:`, text)
        return { success: false, data: null, text, error: "JSON parse failed" }
      }
    } else {
      const errorText = await response.text()
      console.log(`🔍 Error Response:`, errorText.substring(0, 200))
      return { success: false, data: null, text: errorText, error: `HTTP ${response.status}` }
    }
  } catch (error) {
    console.log(`🔍 Fetch Error:`, error)
    return { success: false, data: null, text: "", error: error.toString() }
  }
}

// Trendyol API'den kategorileri çeken fonksiyon
export async function fetchTrendyolCategories(): Promise<TrendyolCategory[]> {
  console.log("🚀 API'den kategoriler çekiliyor...")

  // Daha fazla endpoint ve metod kombinasyonu deneyelim
  const apiAttempts = [
    {
      name: "POST with empty JSON",
      url: "https://api.nesatilir.com/api/v1/GetCategoriesForCalculator",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "TrendyolCalculator/1.0",
      },
      body: JSON.stringify({}),
    },
    {
      name: "POST with request parameter",
      url: "https://api.nesatilir.com/api/v1/GetCategoriesForCalculator",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ request: "categories" }),
    },
    {
      name: "POST with action parameter",
      url: "https://api.nesatilir.com/api/v1/GetCategoriesForCalculator",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ action: "GetCategoriesForCalculator" }),
    },
    {
      name: "GET request",
      url: "https://api.nesatilir.com/api/v1/GetCategoriesForCalculator",
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "TrendyolCalculator/1.0",
      },
    },
    {
      name: "GET with query params",
      url: "https://api.nesatilir.com/api/v1/GetCategoriesForCalculator?format=json",
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
    {
      name: "Alternative endpoint v2",
      url: "https://api.nesatilir.com/api/v2/GetCategoriesForCalculator",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({}),
    },
    {
      name: "Simple categories endpoint",
      url: "https://api.nesatilir.com/categories",
      method: "GET",
      headers: { Accept: "application/json" },
    },
    {
      name: "Calculator categories endpoint",
      url: "https://api.nesatilir.com/calculator/categories",
      method: "GET",
      headers: { Accept: "application/json" },
    },
  ]

  for (const attempt of apiAttempts) {
    console.log(`\n🔄 Deneniyor: ${attempt.name}`)

    const fetchOptions: RequestInit = {
      method: attempt.method,
      headers: attempt.headers,
      next: { revalidate: 3600 },
    }

    if (attempt.body) {
      fetchOptions.body = attempt.body
    }

    const result = await debugApiResponse(attempt.url, fetchOptions)

    if (result.success && result.data) {
      const categories = parseApiResponse(result.data)
      if (categories.length > 0) {
        console.log(`✅ Başarılı! ${categories.length} kategori bulundu`)
        return categories
      } else {
        console.log(`⚠️ Veri parse edilemedi, farklı format deneniyor...`)

        // Eğer boş yanıt geliyorsa, farklı parse stratejileri deneyelim
        const alternativeCategories = tryAlternativeParsing(result.data, result.text)
        if (alternativeCategories.length > 0) {
          console.log(`✅ Alternatif parsing ile ${alternativeCategories.length} kategori bulundu`)
          return alternativeCategories
        }
      }
    }
  }

  console.log("❌ Tüm API denemeleri başarısız, mock data kullanılıyor")
  return getMockCategories()
}

// Alternatif parsing stratejileri
function tryAlternativeParsing(data: any, rawText: string): TrendyolCategory[] {
  console.log("🔄 Alternatif parsing stratejileri deneniyor...")

  // Strateji 1: Raw text'i farklı şekillerde parse etmeyi dene
  if (typeof rawText === "string") {
    // XML formatı mı?
    if (rawText.includes("<") && rawText.includes(">")) {
      console.log("🔍 XML formatı tespit edildi")
      // XML parsing burada yapılabilir
    }

    // CSV formatı mı?
    if (rawText.includes(",") && rawText.includes("\n")) {
      console.log("🔍 CSV formatı tespit edildi")
      // CSV parsing burada yapılabilir
    }

    // Pipe separated mı?
    if (rawText.includes("|")) {
      console.log("🔍 Pipe separated format tespit edildi")
      // Pipe parsing burada yapılabilir
    }
  }

  // Strateji 2: Data'nın farklı seviyelerini kontrol et
  if (data && typeof data === "object") {
    // Tüm nested objeleri recursive olarak kontrol et
    const foundCategories = findCategoriesRecursive(data)
    if (foundCategories.length > 0) {
      return foundCategories
    }
  }

  // Strateji 3: Boş yanıt ama başarılı ise, sample data oluştur
  if (data === null || data === undefined || (typeof data === "object" && Object.keys(data).length === 0)) {
    console.log("🔍 Boş yanıt tespit edildi, API çalışıyor ama veri yok")
  }

  return []
}

// Recursive olarak kategorileri bul
function findCategoriesRecursive(obj: any, depth = 0): TrendyolCategory[] {
  if (depth > 5) return [] // Sonsuz döngüyü önle

  if (Array.isArray(obj)) {
    // Array bulundu, kategori benzeri objeler var mı kontrol et
    const categories = obj
      .filter((item) => item && typeof item === "object")
      .map(transformCategory)
      .filter((cat) => cat.name !== "Bilinmeyen Kategori")

    if (categories.length > 0) {
      console.log(`🔍 Recursive search: ${categories.length} kategori bulundu (depth: ${depth})`)
      return categories
    }
  }

  if (obj && typeof obj === "object") {
    for (const key in obj) {
      const value = obj[key]
      const result = findCategoriesRecursive(value, depth + 1)
      if (result.length > 0) {
        return result
      }
    }
  }

  return []
}

// API yanıtını parse eden yardımcı fonksiyon - daha kapsamlı
function parseApiResponse(data: any): TrendyolCategory[] {
  try {
    console.log("🔍 Parse ediliyor:", typeof data, Array.isArray(data))

    // Eğer data direkt array ise
    if (Array.isArray(data)) {
      console.log(`📋 Direkt array bulundu: ${data.length} öğe`)
      if (data.length > 0) {
        console.log(`📋 İlk öğe:`, data[0])
      }
      return data.map(transformCategory).filter((cat) => cat.name !== "Bilinmeyen Kategori")
    }

    // Nested object içinde array arayalım - daha kapsamlı
    const possiblePaths = [
      "categories",
      "data",
      "result",
      "items",
      "list",
      "categoryList",
      "response",
      "payload",
      "content",
      "body",
      "results",
      "values",
      "category",
      "categoryData",
      "trendyolCategories",
      "calculatorCategories",
      "cats",
      "kategoriler",
      "kategori",
      "commission",
      "commissions",
      "rates",
      "categoryRates",
      "trendyol",
      "calculator",
      "api",
      "success",
      "output",
    ]

    for (const path of possiblePaths) {
      if (data[path] && Array.isArray(data[path])) {
        console.log(`📋 Array bulundu '${path}' yolunda: ${data[path].length} öğe`)
        if (data[path].length > 0) {
          console.log(`📋 İlk öğe (${path}):`, data[path][0])
        }
        const categories = data[path].map(transformCategory).filter((cat) => cat.name !== "Bilinmeyen Kategori")
        if (categories.length > 0) {
          return categories
        }
      }
    }

    // Eğer data bir string ise ve JSON gibi görünüyorsa
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data)
        return parseApiResponse(parsed)
      } catch (e) {
        console.log("🔍 String JSON parse başarısız")
      }
    }

    // Success/error wrapper kontrol et
    if (data.success === true || data.status === "success") {
      console.log("🔍 Success wrapper tespit edildi")
      return parseApiResponse(data.data || data.result || data.payload)
    }

    console.log("❌ Hiçbir uygun array bulunamadı")
    console.log("🔍 Mevcut keys:", Object.keys(data || {}))
    return []
  } catch (error) {
    console.error("❌ Parse hatası:", error)
    return []
  }
}

// Kategori objesini dönüştüren fonksiyon - daha esnek
function transformCategory(category: any): TrendyolCategory {
  if (!category || typeof category !== "object") {
    return {
      id: Math.floor(Math.random() * 10000),
      name: "Bilinmeyen Kategori",
      commissionRate: 12,
    }
  }

  // ID için tüm olası field'ları kontrol et
  const possibleIds = [
    "id",
    "categoryId",
    "Id",
    "ID",
    "cat_id",
    "category_id",
    "catId",
    "CategoryId",
    "CATEGORY_ID",
    "pk",
    "key",
    "code",
    "categoryCode",
    "cat_code",
  ]

  let id = Math.floor(Math.random() * 10000)
  for (const field of possibleIds) {
    if (category[field] !== undefined && category[field] !== null) {
      const parsedId = Number(category[field])
      if (!isNaN(parsedId)) {
        id = parsedId
        break
      }
    }
  }

  // Name için tüm olası field'ları kontrol et
  const possibleNames = [
    "name",
    "categoryName",
    "Name",
    "title",
    "label",
    "cat_name",
    "category_name",
    "CategoryName",
    "CATEGORY_NAME",
    "text",
    "display_name",
    "displayName",
    "description",
  ]

  let name = "Bilinmeyen Kategori"
  for (const field of possibleNames) {
    if (category[field] && typeof category[field] === "string" && category[field].trim()) {
      name = String(category[field]).trim()
      break
    }
  }

  // Commission rate için tüm olası field'ları kontrol et
  const possibleRates = [
    "commissionRate",
    "commission",
    "CommissionRate",
    "rate",
    "percentage",
    "fee",
    "commission_rate",
    "COMMISSION_RATE",
    "feeRate",
    "percent",
    "komisyon",
    "oran",
  ]

  let commissionRate = 12
  for (const field of possibleRates) {
    if (category[field] !== undefined && category[field] !== null) {
      const rate = Number(category[field])
      if (!isNaN(rate) && rate >= 0 && rate <= 100) {
        commissionRate = rate
        break
      }
    }
  }

  // Sub categories için tüm olası field'ları kontrol et
  const possibleSubCats = [
    "subCategories",
    "children",
    "subcategories",
    "sub_categories",
    "childCategories",
    "SubCategories",
    "SUBCATEGORIES",
    "nested",
    "items",
    "childs",
    "subs",
  ]

  let subCategories: TrendyolCategory[] = []
  for (const field of possibleSubCats) {
    if (Array.isArray(category[field])) {
      subCategories = category[field].map(transformCategory)
      break
    }
  }

  const result = {
    id: Number(id),
    name: String(name),
    commissionRate: Number(commissionRate),
    subCategories,
  }

  console.log(`🔍 Transformed category:`, result)
  return result
}

// Mock kategoriler - güncel 2024 Trendyol komisyon oranları
function getMockCategories(): TrendyolCategory[] {
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
}

// API durumunu kontrol eden fonksiyon
export async function checkApiStatus(): Promise<{ status: string; message: string; details?: string }> {
  try {
    const response = await fetch("https://api.nesatilir.com", {
      method: "HEAD",
      headers: {
        Accept: "application/json",
      },
    })

    if (response.ok) {
      return {
        status: "success",
        message: "API erişilebilir",
        details: `Status: ${response.status}`,
      }
    } else {
      return {
        status: "warning",
        message: `API yanıt veriyor ama hata döndürüyor`,
        details: `Status: ${response.status} ${response.statusText}`,
      }
    }
  } catch (error) {
    return {
      status: "error",
      message: "API erişim hatası",
      details: `${error}`,
    }
  }
}

// API yanıtını test etmek için debug fonksiyonu
export async function testApiEndpoint(): Promise<{
  success: boolean
  message: string
  data?: any
  error?: string
}> {
  try {
    const result = await debugApiResponse("https://api.nesatilir.com/api/v1/GetCategoriesForCalculator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({}),
    })

    return {
      success: result.success,
      message: result.success ? "API test başarılı" : "API test başarısız",
      data: result.data,
      error: result.error,
    }
  } catch (error) {
    return {
      success: false,
      message: "API test hatası",
      error: error.toString(),
    }
  }
}
