"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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

export function ProductFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {["Tops", "Bottoms", "Outerwear", "Dresses", "Accessories"].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                      }
                    }}
                  />
                  <Label htmlFor={category}>{category}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox 
                    id={size}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSizes([...selectedSizes, size]);
                      } else {
                        setSelectedSizes(selectedSizes.filter(s => s !== size));
                      }
                    }}
                  />
                  <Label htmlFor={size}>{size}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(colorMap).map(([color, bgClass]) => (
                <div key={color} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => {
                      if (selectedColors.includes(color)) {
                        setSelectedColors(selectedColors.filter(c => c !== color));
                      } else {
                        setSelectedColors([...selectedColors, color]);
                      }
                    }}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      bgClass,
                      selectedColors.includes(color) ? "border-primary ring-2 ring-primary ring-offset-2" : "border-gray-200",
                      color === "White" ? "border-gray-300" : ""
                    )}
                    title={color}
                  />
                  <span className="text-xs text-gray-600">{color}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {["Under $50", "$50 - $100", "$100 - $200", "Over $200"].map((range) => (
                <div key={range} className="flex items-center space-x-2">
                  <Checkbox 
                    id={range}
                    checked={selectedPriceRanges.includes(range)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPriceRanges([...selectedPriceRanges, range]);
                      } else {
                        setSelectedPriceRanges(selectedPriceRanges.filter(r => r !== range));
                      }
                    }}
                  />
                  <Label htmlFor={range}>{range}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}