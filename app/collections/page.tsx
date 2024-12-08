"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
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
  { value: "all", label: "All Categories" },
  { value: "suits", label: "Suits" },
  { value: "dresses", label: "Dresses" },
  { value: "outerwear", label: "Outerwear" },
  { value: "accessories", label: "Accessories" }
];

const SIZES = [
  { value: "all", label: "All Sizes" },
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "One Size", label: "One Size" }
];

const COLORS = [
  { value: "all", label: "All Colors" },
  { value: "White", label: "White" },
  { value: "Black", label: "Black" },
  { value: "Chocolate", label: "Chocolate" },
  { value: "Caramel", label: "Caramel" },
  { value: "Mint Green", label: "Mint Green" },
  { value: "Burgundy", label: "Burgundy" },
  { value: "Green", label: "Green" },
  { value: "Off White", label: "Off White" },
  { value: "Greyish", label: "Greyish" },
  { value: "Sky Blue", label: "Sky Blue" },
  { value: "Pink", label: "Pink" },
  { value: "Blue", label: "Blue" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function CollectionsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    size: searchParams.get("size") || "all",
    color: searchParams.get("color") || "all",
    sort: searchParams.get("sort") || "featured",
    product: searchParams.get("product") || ""
  });

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "all",
      size: searchParams.get("size") || "all",
      color: searchParams.get("color") || "all",
      sort: searchParams.get("sort") || "featured",
      product: searchParams.get("product") || ""
    });
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, product: "" }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: "all",
      size: "all",
      color: "all",
      sort: "featured",
      product: ""
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {filters.product 
                ? filters.product.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
                : filters.category !== "all" 
                  ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
                  : "All Collections"
              }
            </h1>
            <p className="text-gray-600 mt-2">
              Discover our latest collection of elegant and timeless pieces
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8 items-center">
            {/* Categories */}
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sizes */}
            <Select
              value={filters.size}
              onValueChange={(value) => handleFilterChange("size", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Colors */}
            <Select
              value={filters.color}
              onValueChange={(value) => handleFilterChange("color", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                {COLORS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    {color.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
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

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="ml-auto"
            >
              Clear Filters
            </Button>
          </div>

          <ProductGrid filters={filters} />
        </div>
      </div>
    </div>
  );
}