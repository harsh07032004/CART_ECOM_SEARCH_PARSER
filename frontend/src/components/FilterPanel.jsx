import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function FilterPanel({ onFilterChange, isVisible, onToggle }) {
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 200000],
    rating: 0,
    inStock: false,
  });

  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    rating: true,
    availability: true,
  });

  const categories = [
    "shoes",
    "phone",
    "earphone",
    "shirts",
    "watches",
    "laptop",
  ];

  const updateFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleCategoryChange = (category, checked) => {
    const updatedCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    updateFilters({ categories: updatedCategories });
  };

  const clearFilters = () => {
    const cleared = {
      categories: [],
      priceRange: [0, 200000],
      rating: 0,
      inStock: false,
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isVisible) return null;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm"
            >
              Clear all
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Categories */}
        <Collapsible open={openSections.categories} onOpenChange={() => toggleSection('categories')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
            Categories
            {openSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                />
                <Label htmlFor={category} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range */}
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
            Price Range
            {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value })}
              max={200000}
              min={0}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{filters.priceRange[0]}</span>
              <span>₹{filters.priceRange[1]}</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Rating */}
        <Collapsible open={openSections.rating} onOpenChange={() => toggleSection('rating')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
            Minimum Rating
            {openSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => updateFilters({ rating: checked ? rating : 0 })}
                />
                <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer">
                  {rating}+ stars
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Availability */}
        <Collapsible open={openSections.availability} onOpenChange={() => toggleSection('availability')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
            Availability
            {openSections.availability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) => updateFilters({ inStock: checked })}
              />
              <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                In Stock Only
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
} 