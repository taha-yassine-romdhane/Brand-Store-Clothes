"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/product-grid";
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
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "outerwear", label: "Outerwear" },
  { value: "footwear", label: "Footwear" },
  { value: "accessories", label: "Accessories" },
];

const SIZES = [
  { value: "all", label: "All Sizes" },
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
];

const COLORS = [
  { value: "all", label: "All Colors" },
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "gray", label: "Gray" },
  { value: "blue", label: "Blue" },
  { value: "red", label: "Red" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function CollectionsPage() {
  const [filters, setFilters] = useState({
    category: "all",
    size: "all",
    color: "all",
    sort: "featured",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      size: "all",
      color: "all",
      sort: "featured",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Collections</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        {/* Categories */}
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-[160px]">
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
          <SelectTrigger className="w-[160px]">
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
          <SelectTrigger className="w-[160px]">
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
          <SelectTrigger className="w-[160px]">
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
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(filters).map(([key, value]) => {
          if (value === "all" || key === "sort") return null;
          const label = [
            ...CATEGORIES,
            ...SIZES,
            ...COLORS,
          ].find((option) => option.value === value)?.label;
          
          return (
            <Button
              key={key}
              variant="secondary"
              size="sm"
              onClick={() => handleFilterChange(key, "all")}
              className="text-sm"
            >
              {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${label}`} ×
            </Button>
          );
        })}
      </div>

      {/* Products Grid */}
      <ProductGrid filters={filters} />
    </div>
  );
}