"use client"

import { useEffect, useState } from "react"
import { Product, ProductImage } from "@prisma/client"
import { useCart } from "@/lib/context/cart-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Loader2 } from "lucide-react"

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
  "greysh": "#D3D3D3",
  "skybleu": "#87CEEB",
  "Sky Blue": "#87CEEB",
  "Greyish": "#D3D3D3",
}

export default function ProductPage({ params }: { params: { productId: string } }) {
  const [product, setProduct] = useState<ProductWithImages | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const { addItem } = useCart()

  const convertToTND = (price: number) => {
    return (price).toFixed(2)
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching product with ID:', params.productId)
        const response = await fetch(`/api/products/${params.productId}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('Received product data:', data)
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
        setError(error instanceof Error ? error.message : 'Failed to load product. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.productId])

  const handleAddToCart = () => {
    if (!product) return
    
    if (product.sizes?.length > 0 && !selectedSize) {
      alert('Please select a size')
      return
    }
    
    if (product.colors?.length > 0 && !selectedColor) {
      alert('Please select a color')
      return
    }
    
    addItem(product, selectedSize, selectedColor)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!product || !product.images) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-lg">Product not found</div>
      </div>
    )
  }

  const mainImage = product.images[selectedImageIndex] || product.images[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={mainImage?.url || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
              quality={90}
            />
          </div>
          
          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md bg-gray-100",
                    selectedImageIndex === index && "ring-2 ring-black"
                  )}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">
              {product.salePrice ? (
                <>
                  <span className="text-red-500">{convertToTND(product.salePrice)} TND</span>
                  <span className="text-lg text-gray-500 line-through ml-2">
                    {convertToTND(product.price)} TND
                  </span>
                </>
              ) : (
                <span>{convertToTND(product.price)} TND</span>
              )}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600">{product.description}</p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium block">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "px-3 py-1 text-sm border rounded-md transition-colors",
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium block">Color</label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-8 h-8 rounded-full relative transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
                      selectedColor === color ? "ring-2 ring-black ring-offset-2" : ""
                    )}
                    style={{
                      backgroundColor: colorMap[color] || color,
                      border: color.toLowerCase() === 'white' ? '1px solid #e5e5e5' : 'none'
                    }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <span className={cn(
                        "absolute inset-0 flex items-center justify-center",
                        color.toLowerCase() === 'white' ? 'text-black' : 'text-white'
                      )}>
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500 block">
                Selected: {selectedColor || 'None'}
              </span>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full"
            size="lg"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}