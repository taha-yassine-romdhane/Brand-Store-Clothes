"use client"

import { useEffect, useState } from "react"
import { Product } from "@/lib/types"
import { useCart } from "@/lib/context/cart-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ProductPage({ params }: { params: { productId: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/products/${params.productId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Failed to load product. Please try again later.')
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
        <div className="text-lg">Loading...</div>
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-lg">Product not found</div>
      </div>
    )
  }

  // Function to get the background color for color circles
  const getColorBackground = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'White': 'bg-white',
      'Black': 'bg-black',
      'Gray': 'bg-gray-400',
      'Navy': 'bg-navy-600',
      'Blue': 'bg-blue-600',
      'Red': 'bg-red-600',
      'Green': 'bg-green-600',
      'Yellow': 'bg-yellow-400',
      'Purple': 'bg-purple-600',
      'Pink': 'bg-pink-400',
      'Brown': 'bg-amber-800',
      'Orange': 'bg-orange-500',
      'Khaki': 'bg-[#C3B091]',
      'Olive': 'bg-olive-700',
    }
    return colorMap[color] || 'bg-gray-200'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">
              ${product.salePrice || product.price}
            </span>
            {product.salePrice && (
              <span className="text-lg text-gray-500 line-through">
                ${product.price}
              </span>
            )}
          </div>

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
                      "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
                      getColorBackground(color),
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-black"
                        : "hover:scale-110"
                    )}
                    title={color}
                  >
                    {selectedColor === color && (
                      <span className={cn(
                        "text-xs",
                        ['White', 'Yellow', 'Khaki'].includes(color) ? 'text-black' : 'text-white'
                      )}>
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500 block mt-2">
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