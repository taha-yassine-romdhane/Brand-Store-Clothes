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
  // Basic Colors
  White: "#FFFFFF",
  Black: "#000000",
  Red: "#FF0000",
  Blue: "#0000FF",
  Green: "#008000",
  Yellow: "#FFFF00",
  Purple: "#800080",
  Orange: "#FFA500",
  Pink: "#FFC0CB",
  Brown: "#A52A2A",
  Gray: "#808080",
  Greyish: "#9E9E9E",

  // Shades and Variations
  "Light Blue": "#ADD8E6",
  "Dark Blue": "#00008B",
  "Sky Blue": "#87CEEB",
  "Navy Blue": "#000080",
  "Royal Blue": "#4169E1",
  
  "Light Green": "#90EE90",
  "Dark Green": "#006400",
  "Mint Green": "#98FF98",
  "Olive Green": "#556B2F",
  "Forest Green": "#228B22",
  
  "Light Gray": "#D3D3D3",
  "Dark Gray": "#A9A9A9",
  "Charcoal": "#36454F",
  "Silver": "#C0C0C0",
  
  // Special Colors
  "Off White": "#FAF9F6",
  "Ivory": "#FFFFF0",
  "Beige": "#F5F5DC",
  "Cream": "#FFFDD0",
  "Khaki": "#C3B091",
  
  // Wood Tones
  "Chocolate": "#4A3728",
  "Caramel": "#C68E17",
  "Walnut": "#773F1A",
  "Oak": "#806517",
  "Mahogany": "#C04000",
  
  // Wine Colors
  "Burgundy": "#800020",
  "Wine": "#722F37",
  "Maroon": "#800000",
  
  // Metallic Colors
  "Gold": "#FFD700",
  "Bronze": "#CD7F32",
  "Copper": "#B87333",
  
  // Pattern Indicators
  "Floral": "url('#floral-pattern')",
  "Striped": "url('#striped-pattern')",
  "Checkered": "url('#checkered-pattern')",
  "Polka Dot": "url('#polka-dot-pattern')",
  
  // Denim Colors
  "Light Denim": "#6F8FAF",
  "Medium Denim": "#4A6F8F",
  "Dark Denim": "#25466F"
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
          <div 
            className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
            onClick={() => router.push(`/product/${product.id}`)}
          >
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
              <div 
                className="absolute bottom-2 left-2 right-2 flex justify-center gap-1.5 bg-white/80 p-1.5 rounded-lg transition-opacity duration-200"
                onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking thumbnails
              >
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
            <div 
              className="cursor-pointer"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              <h3 className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              
              <div className="mt-2 flex items-center gap-2">
                {product.salePrice ? (
                  <>
                    <span className="text-sm font-medium text-red-600">
                      {convertToTND(product.salePrice)} TND
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {convertToTND(product.price)} TND
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-gray-900">
                    {convertToTND(product.price)} TND
                  </span>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <label className="text-xs text-gray-600">Size:</label>
              <div className="flex flex-wrap gap-1">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSizes({ ...selectedSizes, [product.id]: size });
                    }}
                    className={cn(
                      "px-2 py-1 text-xs border rounded transition-colors",
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
            <div className="space-y-2">
              <label className="text-xs text-gray-600">Color:</label>
              <div className="flex flex-wrap gap-1.5">
                {product.colors.map((color) => {
                  const colorValue = colorMap[color] || color;
                  const isPattern = colorValue.startsWith('url');
                  const isLight = ['White', 'Off White', 'Ivory', 'Cream', 'Beige'].includes(color);
                  
                  return (
                    <button
                      key={color}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColors({ ...selectedColors, [product.id]: color });
                      }}
                      className={cn(
                        "w-6 h-6 rounded-full relative transition-transform hover:scale-110",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2",
                        selectedColors[product.id] === color ? "ring-2 ring-black ring-offset-2" : "",
                        isLight ? "border border-gray-200" : ""
                      )}
                      style={{
                        backgroundColor: !isPattern ? colorValue : undefined,
                        backgroundImage: isPattern ? colorValue : undefined,
                        backgroundSize: isPattern ? 'cover' : undefined
                      }}
                      title={color}
                    >
                      {selectedColors[product.id] === color && (
                        <span className={cn(
                          "absolute inset-0 flex items-center justify-center text-xs",
                          isLight ? "text-black" : "text-white"
                        )}>
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
              className="w-full mt-2"
              variant="outline"
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
