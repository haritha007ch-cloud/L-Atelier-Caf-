import React, { useState } from 'react';
import { CafeCategory, MenuItem } from '../types/cafe';
import { ProductCard } from './ProductCard';
import {
  Coffee,
  Cookie,
  Cake,
  IceCream,
  GlassWater,
  Search,
  Sparkles,
  SlidersHorizontal,
  X,
} from 'lucide-react';

interface MenuCatalogProps {
  items: MenuItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onCustomizeItem: (item: MenuItem) => void;
  onQuickAddItem: (item: MenuItem) => void;
  onOpenCustomizerForNew: () => void;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  items,
  searchQuery,
  onSearchChange,
  onCustomizeItem,
  onQuickAddItem,
  onOpenCustomizerForNew,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [selectedFlavorTag, setSelectedFlavorTag] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Items', icon: Sparkles, count: items.length },
    {
      id: 'coffees',
      label: 'Coffees',
      icon: Coffee,
      count: items.filter((i) => i.category === 'coffees').length,
      desc: 'Specialty Espresso, Single-Origin Pour-Overs, Nitro & Kyoto Cold Brews',
    },
    {
      id: 'cookies',
      label: 'Cookies',
      icon: Cookie,
      count: items.filter((i) => i.category === 'cookies').length,
      desc: 'Thick gourmet cookies with molten fillings, Isigny butter & flake sea salt',
    },
    {
      id: 'cakes',
      label: 'Cakes',
      icon: Cake,
      count: items.filter((i) => i.category === 'cakes').length,
      desc: 'Basque burnt cheesecakes, Valrhona dark chocolate tortes & fruit tarts',
    },
    {
      id: 'ice_cream',
      label: 'Ice Cream',
      icon: IceCream,
      count: items.filter((i) => i.category === 'ice_cream').length,
      desc: 'Artisanal Italian gelato, freshly baked waffle cones & affogato pairings',
    },
    {
      id: 'milkshakes',
      label: 'Milkshakes',
      icon: GlassWater,
      count: items.filter((i) => i.category === 'milkshakes').length,
      desc: 'Hand-spun craft thick shakes with artisan gelato & chantilly cloud tops',
    },
  ];

  const dietaryOptions = [
    { id: 'all', label: 'All Diets' },
    { id: 'dairy-free-opt', label: 'Dairy-Free Friendly' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'decaf-opt', label: 'Decaf Available' },
    { id: 'vegan', label: '100% Plant Vegan' },
    { id: 'organic', label: 'Organic' },
  ];

  const popularFlavors = [
    'Pistachio',
    'Chocolate',
    'Vanilla',
    'Caramel',
    'Cardamom',
    'Berry',
    'Espresso',
  ];

  // Filtering logic
  const filteredItems = items.filter((item) => {
    // Category match
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // Dietary match
    if (dietaryFilter !== 'all') {
      if (!item.dietary.includes(dietaryFilter as any)) {
        return false;
      }
    }

    // Flavor tag match
    if (selectedFlavorTag !== 'all') {
      const matchFlavor = item.flavorNotes.some((n) =>
        n.toLowerCase().includes(selectedFlavorTag.toLowerCase())
      ) || item.name.toLowerCase().includes(selectedFlavorTag.toLowerCase());
      if (!matchFlavor) {
        return false;
      }
    }

    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchNotes = item.flavorNotes.some((n) => n.toLowerCase().includes(q));
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchNotes && !matchTags && !matchCat) {
        return false;
      }
    }

    return true;
  });

  const activeCategoryMeta = categories.find((c) => c.id === selectedCategory);

  return (
    <section id="menu" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grand Artisanal Menu</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Explore Our 5 Signature Categories
          </h2>
          <p className="text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
            From freshly pulled espresso to warm gooey cookies, velvety cakes, slow-churned gelato,
            and hand-spun thick shakes. Customize any order with in-house steeped flavors, drizzles, and crunches.
          </p>
        </div>

        {/* Create From Scratch CTA */}
        <button
          onClick={onOpenCustomizerForNew}
          className="self-start md:self-end px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Formulate Custom Creation</span>
        </button>
      </div>

      {/* 5 Primary Category Navigation Tabs with Icons & Counts */}
      <div className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between text-left cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-stone-900/10'
                    : 'bg-[#FAF8F5] border-stone-200/90 text-stone-700 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-xl ${
                      isActive ? 'bg-stone-800 text-amber-300' : 'bg-stone-200/80 text-amber-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-stone-800 text-stone-300' : 'bg-stone-200/70 text-stone-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold tracking-tight">{cat.label}</div>
                  <div
                    className={`text-[10px] mt-0.5 ${
                      isActive ? 'text-stone-300' : 'text-stone-400'
                    }`}
                  >
                    {cat.id === 'all' ? 'Full Collection' : 'Browse Items'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Subtitle Callout Banner (when specific category selected) */}
      {selectedCategory !== 'all' && activeCategoryMeta?.desc && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-900/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-900/10 text-amber-900">
              {React.createElement(activeCategoryMeta.icon, { className: 'w-4 h-4' })}
            </span>
            <div>
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                {activeCategoryMeta.label} Selection
              </span>
              <p className="text-xs text-amber-900/80 mt-0.5">{activeCategoryMeta.desc}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-semibold text-amber-900 hover:text-amber-950 underline cursor-pointer shrink-0"
          >
            Show All Items
          </button>
        </div>
      )}

      {/* Filter Bars & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200">
        {/* Search Bar Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search Coffees, Cookies, Cakes, Gelato, Shakes, or Flavors..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-stone-200/90 rounded-xl pl-10 pr-9 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-stone-900 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-xs text-stone-400 font-medium mr-1 hidden sm:inline">Dietary:</span>
          {dietaryOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setDietaryFilter(opt.id)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                dietaryFilter === opt.id
                  ? 'bg-stone-900 text-white font-medium shadow-xs'
                  : 'bg-stone-200/60 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flavor Profile Quick Filters */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
          Flavor Notes:
        </span>
        <button
          onClick={() => setSelectedFlavorTag('all')}
          className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer shrink-0 ${
            selectedFlavorTag === 'all'
              ? 'bg-amber-900 text-white font-medium'
              : 'text-stone-600 hover:text-stone-900 bg-stone-100'
          }`}
        >
          All
        </button>
        {popularFlavors.map((flavor) => (
          <button
            key={flavor}
            onClick={() => setSelectedFlavorTag(selectedFlavorTag === flavor ? 'all' : flavor)}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer shrink-0 ${
              selectedFlavorTag === flavor
                ? 'bg-amber-900 text-white font-medium'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70'
            }`}
          >
            {flavor}
          </button>
        ))}
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-stone-500 font-mono">
          Showing <span className="font-bold text-stone-900">{filteredItems.length}</span> artisanal creations
        </p>

        {(selectedCategory !== 'all' || dietaryFilter !== 'all' || selectedFlavorTag !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setDietaryFilter('all');
              setSelectedFlavorTag('all');
              onSearchChange('');
            }}
            className="text-xs font-medium text-amber-900 hover:text-amber-950 underline cursor-pointer"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Product Cards Grid (Responsive 1/2/3 cols) */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onCustomize={onCustomizeItem}
              onQuickAdd={onQuickAddItem}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-[#FAF8F5] rounded-3xl border border-stone-200/80 p-8">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-stone-900 mb-1">
            No Cafe Creations Found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            We couldn't find any creations matching your current category and dietary filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setDietaryFilter('all');
              setSelectedFlavorTag('all');
              onSearchChange('');
            }}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Reset Filters & View All
          </button>
        </div>
      )}
    </section>
  );
};
