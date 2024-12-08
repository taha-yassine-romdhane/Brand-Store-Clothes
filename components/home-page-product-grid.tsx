"use client"

import { Product } from "@prisma/client"
import { useEffect, useState } from "react"
import { ProductImage } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface HomePageProductGridProps {
  products: (Product & { images: ProductImage[] })[]
}

const colorMap: { [key: string]: string } = {
  "White": "bg-white border border-gray-200",
  "Black": "bg-gray-900",
  "Chocolate": "bg-[#7B3F00]",
  "Caramel": "bg-[#C68E17]",
  "Mint Green": "bg-[#98FF98]",
  "Burgundy": "bg-[#800020]",
  "Green": "bg-green-600",
  "Off White": "bg-[#FAF9F6] border border-gray-200",
  "Greyish": "bg-gray-400",
  "Sky Blue": "bg-sky-400",
  "Pink": "bg-pink-400",
  "Blue": "bg-blue-600",
}

export function HomePageProductGrid({ products }: HomePageProductGridProps) {
  const [selectedImage, setSelectedImage] = useState<{ [key: string]: string }>({})
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({})
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})

  const convertToTND = (price: number) => {
    return (price * 3.17).toFixed(2)
  }

  const handleAddToCart = (product: Product & { images: ProductImage[] }) => {
    // Implement cart functionality
    console.log("Adding to cart:", product)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative"
          onMouseEnter={() => setHoveredProduct(product.id.toString())}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          {/* Main Product Image */}
          <Link href={`/product/${product.id}`}>
            <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={selectedImage[product.id] || product.images[0].url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                priority={product.images[0].isMain}
                quality={90}
              />
              
              {/* Sale Badge */}
              {product.salePrice && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm rounded">
                  Sale
                </div>
              )}

              {/* Thumbnail Images */}
              {hoveredProduct === product.id.toString() && product.images.length > 1 && (
                <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2 bg-white/80 p-2 rounded-lg transition-opacity duration-200">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      className={`relative w-10 h-10 rounded-md overflow-hidden border-2 transition-all
                        ${selectedImage[product.id] === image.url 
                          ? 'border-black' 
                          : 'border-transparent hover:border-gray-300'}`}
                      onMouseEnter={() => setSelectedImage({ 
                        ...selectedImage, 
                        [product.id]: image.url 
                      })}
                    >
                      <Image
                        src={image.url}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="40px"
                        quality={80}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Link>

          {/* Product Info */}
          <div className="space-y-2">
            <Link href={`/product/${product.id}`}>
              <h3 className="font-medium text-base text-gray-900 hover:underline">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center space-x-2">
              {product.salePrice ? (
                <>
                  <p className="text-base font-medium text-gray-900">
                    {convertToTND(product.salePrice)} DT
                  </p>
                  <p className="text-sm text-gray-500 line-through">
                    {convertToTND(product.price)} DT
                  </p>
                </>
              ) : (
                <p className="text-base font-medium text-gray-900">
                  {convertToTND(product.price)} DT
                </p>
              )}
            </div>

            {/* Color Options */}
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColors({ 
                    ...selectedColors, 
                    [product.id]: color 
                  })}
                  className={cn(
                    "w-6 h-6 rounded-full transition-all",
                    colorMap[color] || "bg-gray-200",
                    selectedColors[product.id] === color && "ring-2 ring-offset-2 ring-black",
                  )}
                  title={color}
                />
              ))}
            </div>

            {/* Size Options */}
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSizes({ 
                    ...selectedSizes, 
                    [product.id]: size 
                  })}
                  className={cn(
                    "px-2 py-1 text-sm border rounded transition-all",
                    selectedSizes[product.id] === size
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={() => handleAddToCart(product)}
              className="w-full mt-3 bg-black hover:bg-gray-800"
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
