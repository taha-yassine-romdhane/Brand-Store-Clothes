"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/ui/container";
import ProductGrid from "@/components/product-grid";

interface SearchProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  images: {
    id: number;
    url: string;
    isMain: boolean;
  }[];
  sizes: string[];
  colors: string[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery || "")}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch search results");
        }

        setProducts(data.products);
      } catch (error) {
        console.error("Search error:", error);
        setError("Failed to load search results");
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [searchQuery]);

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {searchQuery ? `Search results for "${searchQuery}"` : "Search"}
            </h1>
            {!loading && products.length === 0 && searchQuery && (
              <p className="mt-4 text-gray-500">
                No products found for "{searchQuery}"
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg bg-gray-100">
                  {product.images && product.images[0] && (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="object-cover object-center w-full h-full"
                    />
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {product.price} TND
                  </p>
                </div>
              </div>
            ))}
          </div>
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
