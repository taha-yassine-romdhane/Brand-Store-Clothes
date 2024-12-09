"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface Subcategory {
  name: string;
  query?: string;
  href?: string;
}

interface Category {
  label: string;
  subcategories: Subcategory[];
}

const collectionCategories: Category[] = [
  {
    label: "Dresses",
    subcategories: [
      { name: "Straight-cut Long Dress", query: "straight-cut-long-dress" }
    ]
  },
  {
    label: "Suits",
    subcategories: [
      { name: "Casual Skirt Suit", query: "casual-skirt-suit" }
    ]
  },
  {
    label: "New Arrivals",
    subcategories: [
      { name: "Ramadhane Collections", href: "/ramadhane-collections" }
    ]
  },
  {
    label: "Outerwear",
    subcategories: [
      { name: "Luxury Coat", query: "luxury-coat" }
    ]
  },
  {
    label: "Accessories",
    subcategories: [
      { name: "Neck Cover", query: "neck-cover" }
    ]
  }
];

const Navbar = () => {
  const { items } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    products: Array<{
      id: number;
      name: string;
      category: string;
      imageUrl: string | null;
      type: 'product';
    }>;
    categories: Array<{
      name: string;
      type: 'category';
    }>;
  }>({
    products: [],
    categories: []
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions({
          products: [],
          categories: []
        });
        return;
      }

      try {
        console.log("[NAVBAR] Fetching suggestions for:", searchQuery);
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch suggestions');
        }
        
        console.log("[NAVBAR] Received suggestions:", data);
        setSuggestions({
          products: data.products || [],
          categories: data.categories || []
        });
      } catch (error) {
        console.error('[NAVBAR] Error fetching suggestions:', error);
        setSuggestions({
          products: [],
          categories: []
        });
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(false);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSuggestionClick = (suggestion: { type: string; name: string; id?: number }) => {
    if (suggestion.type === 'category') {
      router.push(`/collections?category=${encodeURIComponent(suggestion.name)}`);
    } else {
      router.push(`/product/${suggestion.id}`);
    }
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const routes = [
    {
      href: "/collections",
      label: "Collections",
      dropdown: true
    },
    {
      href: "/collaborations",
      label: "Collaborations"
    },
   
    {
      href: "/about",
      label: "About"
    }
  ];

  const handleProductClick = (category: string, productQuery: string) => {
    router.push(`/collections?category=${category.toLowerCase()}&product=${productQuery}`);
  };

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">LAMASETTE</p>
          </Link>

          <div className="flex items-center gap-x-4">
            <div className="hidden lg:flex items-center gap-x-4">
              {routes.map((route) => (
                <div key={route.href} className="relative group">
                  <Link
                    href={route.href}
                    className={`text-sm font-medium transition-colors hover:text-black py-2 relative ${
                      route.dropdown ? 'group-hover:after:content-[""] group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:left-0 group-hover:after:w-full group-hover:after:h-0.5 group-hover:after:bg-black' : ''
                    }`}
                  >
                    {route.label}
                  </Link>
                  
                  {route.dropdown && (
                    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[800px] bg-white shadow-lg rounded-lg py-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-4 before:h-4 before:bg-white before:transform before:rotate-45 before:-translate-y-2">
                      <div className="flex justify-around relative bg-white rounded-lg">
                        {collectionCategories.map((category) => (
                          <div key={category.label} className="px-6">
                            <h3 className="font-medium text-sm mb-4 text-black">{category.label}</h3>
                            <div className="space-y-2">
                              {category.subcategories.map((subcategory) => (
                                <Link
                                  key={subcategory.name}
                                  href={subcategory.href || `/collections?category=${category.label.toLowerCase()}&product=${subcategory.query}`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {subcategory.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-x-4">
            <div ref={searchContainerRef} className="hidden lg:block lg:flex-1 relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full bg-gray-100 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </form>

              {/* Search Suggestions */}
              {showSuggestions && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                  {suggestions?.categories?.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2">Categories</h3>
                      {suggestions.categories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(category)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center space-x-2"
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Search className="h-4 w-4 text-gray-500" />
                          </div>
                          <span>{category.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {suggestions?.products?.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2">Products</h3>
                      {suggestions.products.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick(product)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center space-x-3"
                        >
                          <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Search className="h-4 w-4 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.category}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {(!suggestions?.products?.length && !suggestions?.categories?.length) && (
                    <div className="p-4 text-center text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSearching(true)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link href="/cart">
              <Button variant="ghost" className="relative">
                <ShoppingCart size={20} />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
      {isSearching && (
        <div className="fixed inset-0 z-50 bg-white px-4 py-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                autoFocus
              />
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </form>
          <button
            onClick={() => setIsSearching(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
          >
            <span className="sr-only">Close search</span>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;