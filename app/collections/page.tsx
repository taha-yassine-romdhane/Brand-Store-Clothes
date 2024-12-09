"use client";

import { useEffect, useState } from "react";
import ProductGrid from "@/components/product-grid";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define filter options
const CATEGORIES = [
  { value: "all", label: "View All" },
  { value: "dresses", label: "Dresses" },
  { value: "suits", label: "Suits" },
  { value: "outerwear", label: "Outerwear" },
  { value: "accessories", label: "Accessories" }
];

const COLLABORATORS = [
  { value: "all", label: "All Collections" },
  { value: "aya", label: "Aya" },
  { value: "emna", label: "Emna" }
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "New Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" }
];

export default function CollectionsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    collaborator: searchParams.get("collaborator") || "all",
    sort: searchParams.get("sort") || "featured",
    product: searchParams.get("product") || ""
  });

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "all",
      collaborator: searchParams.get("collaborator") || "all",
      sort: searchParams.get("sort") || "featured",
      product: searchParams.get("product") || ""
    });
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: "all",
      collaborator: "all",
      sort: "featured",
      product: ""
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {filters.product 
              ? filters.product.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
              : filters.category !== "all" 
                ? CATEGORIES.find(c => c.value === filters.category)?.label
                : "All Collections"
            }
            {filters.collaborator !== "all" && (
              <span className="text-gray-500">
                {" "}modeled by {COLLABORATORS.find(c => c.value === filters.collaborator)?.label}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-2">
            Discover our latest collection of elegant and timeless pieces
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Category and Collaborator Filters */}
          <div className="flex flex-wrap items-start gap-8 pb-4 border-b">
            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Category</span>
              <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleFilterChange("category", category.value)}
                    className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
                      filters.category === category.value
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Collaborator Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Model</span>
              <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                {COLLABORATORS.map((collaborator) => (
                  <button
                    key={collaborator.value}
                    onClick={() => handleFilterChange("collaborator", collaborator.value)}
                    className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
                      filters.collaborator === collaborator.value
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {collaborator.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort and Clear Filters */}
            <div className="flex flex-col gap-2 ml-auto">
              <span className="text-sm font-medium text-gray-700">Sort By</span>
              <div className="flex items-center gap-2">
                <Select
                  value={filters.sort}
                  onValueChange={(value) => handleFilterChange("sort", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(filters.category !== "all" || filters.collaborator !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-gray-600 hover:text-gray-900 whitespace-nowrap"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid filters={filters} />
      </div>
    </div>
  );
}