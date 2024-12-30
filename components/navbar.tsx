"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

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
        setSelectedIndex(-1);
      } catch (error) {
        console.error('[NAVBAR] Error fetching suggestions:', error);
        setError('Failed to load suggestions. Please try again.');
        setSuggestions({
          products: [],
          categories: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const totalItems = (suggestions?.categories?.length || 0) + (suggestions?.products?.length || 0);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const categoriesLength = suggestions?.categories?.length || 0;
          if (selectedIndex < categoriesLength) {
            handleSuggestionClick(suggestions.categories[selectedIndex]);
          } else {
            handleSuggestionClick(suggestions.products[selectedIndex - categoriesLength]);
          }
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

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
            <Image 
              src="/site.png"
              alt="Site Logo"
              width={130}
              height={130}
              className="object-contain"
            />
          </Link>

          <div className="flex items-center gap-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

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
              <form onSubmit={handleSearch} role="search">
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
                    onKeyDown={handleKeyDown}
                    aria-expanded={showSuggestions}
                    aria-controls="search-suggestions"
                    aria-label="Search products"
                    aria-describedby={error ? "search-error" : undefined}
                    className="w-full bg-gray-100 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    </div>
                  )}
                </div>
              </form>

              {/* Search Suggestions */}
              {showSuggestions && searchQuery.length >= 2 && (
                <div 
                  id="search-suggestions"
                  role="listbox"
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
                >
                  {error ? (
                    <div id="search-error" className="p-4 text-center text-red-500">
                      {error}
                    </div>
                  ) : (
                    <>
                      {suggestions?.categories?.length > 0 && (
                        <div className="p-2">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2">Categories</h3>
                          {suggestions.categories.map((category, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(category)}
                              onMouseEnter={() => setSelectedIndex(index)}
                              role="option"
                              aria-selected={selectedIndex === index}
                              className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center space-x-2 ${
                                selectedIndex === index ? 'bg-gray-100' : ''
                              }`}
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
                          {suggestions.products.map((product, index) => {
                            const actualIndex = index + (suggestions?.categories?.length || 0);
                            return (
                              <button
                                key={product.id}
                                onClick={() => handleSuggestionClick(product)}
                                onMouseEnter={() => setSelectedIndex(actualIndex)}
                                role="option"
                                aria-selected={selectedIndex === actualIndex}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center space-x-3 ${
                                  selectedIndex === actualIndex ? 'bg-gray-100' : ''
                                }`}
                              >
                                <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                  {product.imageUrl ? (
                                    <img
                                      src={product.imageUrl}
                                      alt=""
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
                            );
                          })}
                        </div>
                      )}

                      {(!suggestions?.products?.length && !suggestions?.categories?.length) && (
                        <div className="p-4 text-center text-gray-500">
                          No results found for "{searchQuery}"
                        </div>
                      )}
                    </>
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="px-4 py-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-6">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Image 
                  src="/site.png"
                  alt="Site Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} role="search" className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  className="w-full bg-gray-100 rounded-full px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <nav className="space-y-6">
              {routes.map((route) => (
                <div key={route.href}>
                  <Link
                    href={route.href}
                    className="block text-lg font-medium py-2 hover:text-gray-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {route.label}
                  </Link>
                  {route.dropdown && (
                    <div className="pl-4 mt-2 space-y-3">
                      {collectionCategories.map((category) => (
                        <div key={category.label} className="mb-4">
                          <h3 className="font-medium text-sm mb-2 text-gray-900">{category.label}</h3>
                          <div className="space-y-2">
                            {category.subcategories.map((subcategory) => (
                              <Link
                                key={subcategory.name}
                                href={subcategory.href || `/collections?category=${category.label.toLowerCase()}&product=${subcategory.query}`}
                                className="block text-sm text-gray-600 py-1.5 pl-2 hover:text-black transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subcategory.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {isSearching && (
        <div className="fixed inset-0 z-50 bg-white px-4 py-6">
          <form onSubmit={handleSearch} role="search">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-gray-100 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                aria-expanded={showSuggestions}
                aria-controls="mobile-search-suggestions"
                aria-label="Search products"
                aria-describedby={error ? "mobile-search-error" : undefined}
                autoFocus
              />
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                </div>
              )}
            </div>
          </form>

          {/* Mobile Search Suggestions */}
          {showSuggestions && searchQuery.length >= 2 && (
            <div 
              id="mobile-search-suggestions"
              role="listbox"
              className="mt-4 bg-white rounded-lg border border-gray-200 max-h-[calc(100vh-120px)] overflow-y-auto"
            >
              {error ? (
                <div id="mobile-search-error" className="p-4 text-center text-red-500">
                  {error}
                </div>
              ) : (
                <>
                  {suggestions?.categories?.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2">Categories</h3>
                      {suggestions.categories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(category)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          role="option"
                          aria-selected={selectedIndex === index}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center space-x-2 ${
                            selectedIndex === index ? 'bg-gray-100' : ''
                          }`}
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
                      {suggestions.products.map((product, index) => {
                        const actualIndex = index + (suggestions?.categories?.length || 0);
                        return (
                          <button
                            key={product.id}
                            onClick={() => handleSuggestionClick(product)}
                            onMouseEnter={() => setSelectedIndex(actualIndex)}
                            role="option"
                            aria-selected={selectedIndex === actualIndex}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center space-x-3 ${
                              selectedIndex === actualIndex ? 'bg-gray-100' : ''
                            }`}
                          >
                            <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt=""
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
                        );
                      })}
                    </div>
                  )}

                  {(!suggestions?.products?.length && !suggestions?.categories?.length) && (
                    <div className="p-4 text-center text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;