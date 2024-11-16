"use client";

import { useEffect, useState } from "react"
import { Product } from "@/lib/types"
import { Card, Badge, Button } from "@/components/ui"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/context/cart-context"
import { useRouter } from "next/navigation"

const colorMap: { [key: string]: string } = {
  White: "bg-white",
  Black: "bg-black",
  Gray: "bg-gray-400",
  Navy: "bg-navy-800",
  Brown: "bg-amber-800",
  Beige: "bg-amber-100",
  Blue: "bg-blue-600",
  Red: "bg-red-600",
  Camel: "bg-amber-200",
  Cream: "bg-amber-50",
  Tan: "bg-amber-300",
  Stripe: "bg-gradient-to-r from-blue-500 to-blue-600",
  Blush: "bg-pink-200",
  Green: "bg-green-600",
  Floral: "bg-gradient-to-r from-pink-300 to-purple-300"
};

export function ProductGrid() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({})
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const selectedSize = selectedSizes[product.id];
    const selectedColor = selectedColors[product.id];
    
    if (!selectedSize || !selectedColor) {
      alert("Please select both size and color");
      return;
    }
    
    addItem(product, selectedSize, selectedColor);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden group">
          <div 
            className="cursor-pointer"
            onClick={() => router.push(`/product/${product.id}`)}
          >
            <div className="relative aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              {(product.salePrice ?? product.price) < product.price && (
                <Badge className="absolute top-2 right-2 bg-red-500">
                  SALE
                </Badge>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold mb-2 hover:text-primary">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <span className={cn(
                  "text-lg font-medium",
                  (product.salePrice ?? product.price) < product.price && "line-through text-gray-400"
                )}>
                  ${product.price}
                </span>
                {(product.salePrice ?? 0) < product.price && (
                  <span className="text-lg font-medium text-red-500">
                    ${product.salePrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 pt-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.sizes.map((size) => (
                <Badge 
                  key={size} 
                  variant={selectedSizes[product.id] === size ? "default" : "outline"} 
                  className={cn(
                    "text-xs cursor-pointer",
                    selectedSizes[product.id] === size && "bg-primary"
                  )}
                  onClick={() => setSelectedSizes({
                    ...selectedSizes,
                    [product.id]: size
                  })}
                >
                  {size}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className={cn(
                    "w-6 h-6 rounded-full border border-gray-200 cursor-pointer",
                    colorMap[color],
                    color === "White" ? "border-gray-300" : "",
                    selectedColors[product.id] === color && "ring-2 ring-primary ring-offset-2"
                  )}
                  title={color}
                  onClick={() => setSelectedColors({
                    ...selectedColors,
                    [product.id]: color
                  })}
                />
              ))}
            </div>
            <Button 
              className="w-full gap-2"
              onClick={(e) => {
                e.stopPropagation()
                handleAddToCart(product)
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}