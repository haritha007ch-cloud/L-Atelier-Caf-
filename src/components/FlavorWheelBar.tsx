import React, { useState } from 'react';
import { FLAVOR_OPTIONS, FLAVOR_PAIRING_RECIPES } from '../data/cafeData';
import { FlavorOption } from '../types/cafe';
import { Wand2, Plus, Sparkles, Check } from 'lucide-react';

interface FlavorWheelBarProps {
  onCustomizeFlavor: (flavorId: string) => void;
  onApplyRecipe: (recipe: typeof FLAVOR_PAIRING_RECIPES[0]) => void;
}

export const FlavorWheelBar: React.FC<FlavorWheelBarProps> = ({
  onCustomizeFlavor,
  onApplyRecipe,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedFlavorPreview, setSelectedFlavorPreview] = useState<FlavorOption | null>(FLAVOR_OPTIONS[1]); // Default to Pistachio

  const categories = [
    { id: 'all', label: 'All Flavors' },
    { id: 'nutty', label: 'Nutty & Savory' },
    { id: 'sweet', label: 'Sweet & Vanilla' },
    { id: 'spiced', label: 'Warm Spices' },
    { id: 'botanical', label: 'Botanical & Floral' },
    { id: 'cacao', label: 'Dark Cacao' },
    { id: 'fruity', label: 'Citrus & Fruit' },
  ];

  const filteredFlavors = activeCategory === 'all'
    ? FLAVOR_OPTIONS
    : FLAVOR_OPTIONS.filter((f) => f.category === activeCategory);

  return (
    <section id="flavor-studio" className="py-16 bg-[#F4EFEA] border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>In-House Steeped Alchemy</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              The Artisan Flavor Bar
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-xl">
              Every syrup and puree is prepared fresh in our laboratory using unrefined cane, whole spices, 
              nuts, and natural extracts. Mix multiple flavors to craft your signature combination.
            </p>
          </div>

          {/* Category Filter Segments (functional buttons) */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl overflow-x-auto scrollbar-none shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Flavor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-14">
          {filteredFlavors.map((flavor) => {
            const isSelected = selectedFlavorPreview?.id === flavor.id;
            return (
              <div
                key={flavor.id}
                onClick={() => setSelectedFlavorPreview(flavor)}
                className={`relative p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-amber-800/60 shadow-md ring-1 ring-amber-800/30'
                    : 'bg-[#FAF8F5] border-stone-200 hover:border-stone-300 hover:bg-white'
                }`}
              >
                <div>
                  {/* Color Accent Indicator */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-xs"
                        style={{ backgroundColor: flavor.colorHex }}
                      />
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
                        {flavor.category}
                      </span>
                    </div>
                    {flavor.isSugarFree && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                        Zero Sugar
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                    {flavor.name}
                  </h3>
                  {flavor.frenchName && (
                    <p className="text-[11px] text-stone-400 italic mt-0.5 mb-2">
                      {flavor.frenchName}
                    </p>
                  )}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {flavor.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-mono tabular-nums">
                    +${flavor.pricePerPump.toFixed(2)} / pump
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCustomizeFlavor(flavor.id);
                    }}
                    className="p-1.5 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors"
                    title={`Create drink with ${flavor.name}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Flavor Deep-Dive Banner */}
        {selectedFlavorPreview && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                style={{ backgroundColor: selectedFlavorPreview.colorHex }}
              >
                <Sparkles className="w-6 h-6 text-stone-800/80 mix-blend-multiply" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                  <span>Selected Flavor Profile</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-amber-800 capitalize">
                    {selectedFlavorPreview.category} Notes
                  </span>
                </div>
                <h4 className="text-lg font-bold text-stone-900 font-display">
                  {selectedFlavorPreview.name}
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-xl">
                  {selectedFlavorPreview.description} <strong className="font-medium text-stone-800">Tasting notes:</strong> {selectedFlavorPreview.notes}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => onCustomizeFlavor(selectedFlavorPreview.id)}
                className="w-full md:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Craft Beverage with this Flavor</span>
              </button>
            </div>
          </div>
        )}

        {/* Curated Flavor Pairings Section */}
        <div id="pairings" className="pt-4">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Tried & Tested Combinations
            </span>
            <h3 className="font-display text-2xl font-bold text-stone-900">
              Barista Master Pairings
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Hand-formulated ratios designed by our sensory roasting team. Click to load the full recipe into your cup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FLAVOR_PAIRING_RECIPES.map((recipe, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-5 rounded-xl border border-stone-200/90 flex flex-col justify-between hover:border-amber-700/50 hover:bg-white transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-amber-900 text-[11px] uppercase tracking-wider">
                      {recipe.badge}
                    </span>
                    <span className="text-stone-400 capitalize">{recipe.temp}</span>
                  </div>
                  <h4 className="font-semibold text-stone-900 text-sm mb-2">
                    {recipe.name}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {recipe.description}
                  </p>
                </div>

                <button
                  onClick={() => onApplyRecipe(recipe)}
                  className="w-full py-2 px-3 text-xs font-medium text-stone-800 bg-stone-200/70 hover:bg-amber-100 hover:text-amber-950 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-amber-700" />
                  <span>Customize This Recipe</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
