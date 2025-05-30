"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { TrendyolCategory } from "@/app/actions/trendyol-api"

interface CategorySelectorProps {
  categories: TrendyolCategory[]
  onCategorySelect: (category: TrendyolCategory | null) => void
  isLoading: boolean
}

export function CategorySelector({ categories, onCategorySelect, isLoading }: CategorySelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<TrendyolCategory | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<TrendyolCategory | null>(null)
  const [showSubCategories, setShowSubCategories] = useState(false)

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : []

  // Tüm kategorileri düzleştir (ana kategoriler + alt kategoriler)
  const flattenedCategories = safeCategories.flatMap((category) => [category, ...(category.subCategories || [])])

  // handleCategorySelect fonksiyonunu güncelle
  const handleCategorySelect = (categoryId: number) => {
    // Ana kategori mi alt kategori mi kontrol et
    const mainCategory = safeCategories.find((c) => c.id === categoryId)

    if (mainCategory) {
      setSelectedCategory(mainCategory)
      setSelectedSubCategory(null)
      setShowSubCategories(!!mainCategory.subCategories?.length)
      onCategorySelect(mainCategory)
    } else {
      // Alt kategori seçildi
      for (const mainCat of safeCategories) {
        const subCat = mainCat.subCategories?.find((s) => s.id === categoryId)
        if (subCat) {
          setSelectedCategory(mainCat)
          setSelectedSubCategory(subCat)
          onCategorySelect(subCat)
          break
        }
      }
    }

    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {isLoading
            ? "Kategoriler yükleniyor..."
            : selectedSubCategory
              ? `${selectedCategory?.name} > ${selectedSubCategory.name}`
              : selectedCategory
                ? selectedCategory.name
                : "Kategori seçin"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {/* Popover içeriğini güncelle - daha iyi hata handling */}
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Kategori ara..." />
          <CommandList>
            <CommandEmpty>{isLoading ? "Kategoriler yükleniyor..." : "Kategori bulunamadı."}</CommandEmpty>
            <CommandGroup>
              {showSubCategories && selectedCategory?.subCategories?.length ? (
                <>
                  <CommandItem
                    onSelect={() => {
                      setShowSubCategories(false)
                    }}
                    className="text-sm text-muted-foreground italic"
                  >
                    ← Tüm kategorilere dön
                  </CommandItem>
                  <CommandItem
                    key={selectedCategory.id}
                    onSelect={() => handleCategorySelect(selectedCategory.id)}
                    className="font-medium"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span>{selectedCategory.name}</span>
                      <span className="text-xs text-gray-500">%{selectedCategory.commissionRate}</span>
                    </div>
                    {selectedCategory.id === selectedCategory.id && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                  {selectedCategory.subCategories.map((subCategory) => (
                    <CommandItem
                      key={subCategory.id}
                      onSelect={() => handleCategorySelect(subCategory.id)}
                      className="pl-6"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>{subCategory.name}</span>
                        <span className="text-xs text-gray-500">%{subCategory.commissionRate}</span>
                      </div>
                      {selectedSubCategory?.id === subCategory.id && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))}
                </>
              ) : (
                safeCategories.map((category) => (
                  <CommandItem key={category.id} onSelect={() => handleCategorySelect(category.id)}>
                    <div className="flex justify-between items-center w-full">
                      <span>{category.name}</span>
                      <span className="text-xs text-gray-500">%{category.commissionRate}</span>
                    </div>
                    {selectedCategory?.id === category.id && !selectedSubCategory && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
