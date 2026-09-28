import React from 'react';
import { MenuItem } from '../types/cafe';
import { SlidersHorizontal, Plus, Sparkles } from 'lucide-react';

interface ProductCardProps {
  item: MenuItem;
  onCustomize: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onCustomize,
  onQuickAdd,
}) => {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'coffees':
        return 'Specialty Coffee';
      case 'cookies':
        return 'Artisan Cookie';
      case 'cakes':
        return 'Pâtisserie Cake';
      case 'ice_cream':
        return 'Artisanal Gelato';
      case 'milkshakes':
        return 'Craft Milkshake';
      default:
        return 'Artisan Item';
    }
  };

  return (
    <div className="group relative bg-[#FAF8F5] rounded-3xl border border-stone-200/90 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Primary tag */}
        {item.tags.length > 0 && (
          <div className="absolute top-3.5 left-3.5 bg-stone-900/85 backdrop-blur-xs text-stone-100 text-[11px] font-medium px-2.5 py-1 rounded-lg tracking-wide shadow-sm">
            {item.tags[0]}
          </div>
        )}

        {/* Quick Customize Button Overlay on Desktop Hover */}
        <div className="absolute inset-0 bg-stone-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={() => onCustomize(item)}
            className="px-4 py-2.5 bg-white text-stone-950 text-xs font-bold rounded-xl shadow-lg hover:bg-stone-50 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap hover:scale-105"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" />
            <span>Customize Flavors & Add</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Calories */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2 font-medium">
            <span className="uppercase tracking-wider text-[11px] font-semibold text-amber-900">
              {getCategoryLabel(item.category)}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="font-mono text-[11px]">{item.caloriesApprox} kcal</span>
          </div>

          <h3 className="font-display font-bold text-stone-900 text-lg leading-snug group-hover:text-amber-950 transition-colors">
            {item.name}
          </h3>

          {item.frenchSubName && (
            <p className="text-xs text-stone-400 italic mt-0.5 mb-2 font-serif">
              {item.frenchSubName}
            </p>
          )}

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>

          {/* Flavor Notes with typographic separators */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 mb-5">
            <span className="text-stone-400 font-medium text-[11px]">Notes:</span>
            {item.flavorNotes.map((note, idx) => (
              <React.Fragment key={note}>
                <span className="text-stone-700 font-medium text-[11px]">{note}</span>
                {idx < item.flavorNotes.length - 1 && (
                  <span aria-hidden="true" className="text-stone-300">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Footer: Starting Price & Action Buttons */}
        <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-stone-400 block uppercase tracking-wider font-medium">
              Starting from
            </span>
            <span className="font-display text-xl font-bold text-stone-900 tabular-nums">
              ${item.basePrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCustomize(item)}
              className="px-4 py-2.5 text-xs font-bold text-stone-900 bg-stone-200/80 hover:bg-amber-100 hover:text-amber-950 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" />
              <span>Customize</span>
            </button>
            <button
              onClick={() => onQuickAdd(item)}
              className="px-3 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-xs hover:shadow-md"
              title="Quick Add with Standard Recipe"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
