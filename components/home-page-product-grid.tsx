"use client"

import { Product, ProductImage } from "@prisma/client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/context/cart-context"

type ProductWithImages = Product & { images: ProductImage[] }

// Color mapping for actual CSS colors
const colorMap: { [key: string]: string } = {
  "Black": "#000000",
  "White": "#FFFFFF",
  "Blue": "#0000FF",
  "Red": "#FF0000",
  "Green": "#008000",
  "Yellow": "#FFFF00",
  "Purple": "#800080",
  "Pink": "#FFC0CB",
  "Orange": "#FFA500",
  "Brown": "#A52A2A",
  "Gray": "#808080",
  "Beige": "#F5F5DC",
  "Navy": "#000080",
  "Maroon": "#800000",
  "Olive": "#808000",
  "Teal": "#008080",
  "Coral": "#FF7F50",
  "Turquoise": "#40E0D0",
  "Lavender": "#E6E6FA",
  "Burgundy": "#800020",
  "greysh": "#D3D3D3", // Light grey color
  "skybleu": "#87CEEB", // Sky blue color
  "Sky Blue": "#87CEEB",
  "Greyish": "#D3D3D3",
  // Add more colors as needed
}

export function HomePageProductGrid({ initialProducts = [] }: { initialProducts?: ProductWithImages[] }) {
  const [products] = useState<ProductWithImages[]>(initialProducts)
  const { addItem } = useCart()
  
  // State for selected sizes and colors
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({})
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({})

  // Format price without conversion
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const handleAddToCart = (product: ProductWithImages) => {
    const selectedSize = selectedSizes[product.id]
    const selectedColor = selectedColors[product.id]
    
    if (!selectedSize || !selectedColor) {
      alert("Please select both size and color")
      return
    }
    
    addItem(product, selectedSize, selectedColor)
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative"
        >
          {/* Main Product Image */}
          <Link href={`/product/${product.id}`}>
            <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={product.images[0]?.url ? product.images[0].url : '/images/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                priority
                quality={90}
              />
              
              {/* Sale Badge */}
              {product.salePrice && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded">
                  Sale
                </div>
              )}
            </div>
          </Link>

          {/* Product Info */}
          <div>
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
            
            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-lg font-bold text-red-500">
                    {formatPrice(product.salePrice)} TND
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.price)} TND
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold">
                  {formatPrice(product.price)} TND
                </span>
              )}
            </div>

            {/* Size Selection */}
            <div className="mt-4">
              <label className="text-sm text-gray-600 mb-2 block">Size:</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                    className={cn(
                      "px-3 py-1 border rounded-md text-sm transition-colors",
                      selectedSizes[product.id] === size
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mt-4">
              <label className="text-sm text-gray-600 mb-2 block">Color:</label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: color }))}
                    className={cn(
                      "w-8 h-8 rounded-full relative transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
                      selectedColors[product.id] === color ? "ring-2 ring-black ring-offset-2" : ""
                    )}
                    style={{
                      backgroundColor: colorMap[color] || color,
                      border: color.toLowerCase() === 'white' ? '1px solid #e5e5e5' : 'none'
                    }}
                    title={color}
                  >
                    {selectedColors[product.id] === color && (
                      <Check 
                        className={cn(
                          "w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                          color.toLowerCase() === 'white' ? "text-black" : "text-white"
                        )}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={() => handleAddToCart(product)}
              className="w-full mt-4"
              variant="outline"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
