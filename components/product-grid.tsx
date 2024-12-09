"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Product } from "@/lib/types"
import { useCart } from "@/lib/context/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

const colorMap: { [key: string]: string } = {
  White: "bg-white border border-gray-200",
  Black: "bg-black",
  Chocolate: "bg-[#4a3728]",
  Caramel: "bg-[#c68e17]",
  "Mint Green": "bg-[#98ff98]",
  Burgundy: "bg-[#800020]",
  Green: "bg-[#355e3b]",
  "Off White": "bg-[#faf9f6] border border-gray-200",
  Greyish: "bg-[#808080]",
  "Sky Blue": "bg-[#87ceeb]",
  Pink: "bg-[#ffc0cb]",
  Blue: "bg-[#0000ff]",
  Floral: "bg-gradient-to-r from-pink-300 to-purple-300"
};

interface ProductWithImages extends Product {
  images: {
    id: number;
    url: string;
    isMain: boolean;
  }[];
}

interface ProductGridProps {
  filters: {
    category: string;
    collaborator: string;
    sort: string;
    product: string;
  };
}

const ProductGrid = ({ filters }: ProductGridProps) => {
  const router = useRouter()
  const [products, setProducts] = useState<ProductWithImages[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({})
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<{ [key: string]: string }>({})
  const { addItem } = useCart()

  // Convert USD to TND (Tunisian Dinar)
  const convertToTND = (usdPrice: number) => {
    const exchangeRate = 3.13; // 1 USD = 3.13 TND (approximate)
    return (usdPrice * exchangeRate).toFixed(2);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams();
        if (filters.category !== 'all') params.append('category', filters.category);
        if (filters.collaborator !== 'all') params.append('collaborateur', filters.collaborator);
        if (filters.sort !== 'featured') params.append('sort', filters.sort);
        if (filters.product) params.append('product', filters.product);

        const response = await fetch('/api/products?' + params.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);

        const initialSelectedImages: { [key: string]: string } = {};
        data.forEach((product: ProductWithImages) => {
          const mainImage = product.images.find(img => img.isMain)?.url || product.images[0].url;
          initialSelectedImages[product.id] = mainImage;
        });
        setSelectedImage(initialSelectedImages);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [filters]);

  const handleAddToCart = (product: Product & { images: { id: number; url: string; isMain: boolean; }[] }) => {
    if (!selectedColors[product.id] || !selectedSizes[product.id]) {
      alert('Please select both size and color');
      return;
    }
    
    addItem(
      product,
      selectedSizes[product.id],
      selectedColors[product.id]
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-[2/3] rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative"
          onMouseEnter={() => setHoveredProduct(product.id.toString())}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          {/* Main Product Image */}
          <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={selectedImage[product.id] || product.images[0].url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={product.images[0].isMain}
              loading={product.images[0].isMain ? "eager" : "lazy"}
              quality={80}
            />
            
            {/* Sale Badge */}
            {product.salePrice && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                Sale
              </div>
            )}

            {/* Thumbnail Images */}
            {hoveredProduct === product.id.toString() && product.images.length > 1 && (
              <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1.5 bg-white/80 p-1.5 rounded-lg transition-opacity duration-200">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    className={`relative w-8 h-8 rounded-md overflow-hidden border-2 transition-all
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
                      sizes="32px"
                      loading="lazy"
                      quality={60}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <div className="mt-2 flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {product.name}
                </h3>
                {product.collaborateur && (
                  <p className="mt-1 text-sm text-gray-500">
                    By {product.collaborateur}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {product.category}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {product.salePrice ? (
                  <>
                    <span className="line-through text-gray-500 mr-2">
                      {convertToTND(product.price)} DT
                    </span>
                    <span className="text-red-600">
                      {convertToTND(product.salePrice)} DT
                    </span>
                  </>
                ) : (
                  `${convertToTND(product.price)} DT`
                )}
              </p>
            </div>

            {/* Color Options */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColors({ 
                    ...selectedColors, 
                    [product.id]: color 
                  })}
                  className={cn(
                    "w-5 h-5 rounded-full transition-all",
                    colorMap[color] || "bg-gray-200",
                    selectedColors[product.id] === color && "ring-1 ring-offset-1 ring-black",
                  )}
                  title={color}
                />
              ))}
            </div>

            {/* Size Options */}
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSizes({ 
                    ...selectedSizes, 
                    [product.id]: size 
                  })}
                  className={cn(
                    "px-2 py-1 text-xs border rounded transition-all",
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
              className="w-full mt-3 bg-black hover:bg-gray-800 h-9 text-sm"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;