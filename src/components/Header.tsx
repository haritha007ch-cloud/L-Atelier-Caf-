import React from 'react';
import { ShoppingBag, Bookmark, Search, Coffee } from 'lucide-react';
import { CartItem } from '../types/cafe';

interface HeaderProps {
  cart: CartItem[];
  savedCount: number;
  onOpenCart: () => void;
  onOpenSaved: () => void;
  onOpenCustomizerForNew: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cart,
  savedCount,
  onOpenCart,
  onOpenSaved,
  onOpenCustomizerForNew,
  searchQuery,
  onSearchChange,
  onNavigateSection,
}) => {
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigateSection('hero')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-display text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-900 transition-colors">
            L'Atelier Café
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigateSection('menu')}
            className="hover:text-stone-950 transition-colors focus:outline-none cursor-pointer"
          >
            Menu & Drinks
          </button>
          <button
            onClick={() => onNavigateSection('flavor-studio')}
            className="hover:text-stone-950 transition-colors focus:outline-none cursor-pointer flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-pulse"></span>
            Flavor Bar
          </button>
          <button
            onClick={() => onNavigateSection('pairings')}
            className="hover:text-stone-950 transition-colors focus:outline-none cursor-pointer"
          >
            Curated Pairings
          </button>
          <button
            onClick={() => onNavigateSection('roastery')}
            className="hover:text-stone-950 transition-colors focus:outline-none cursor-pointer"
          >
            Our Roastery
          </button>
          <button
            onClick={() => onOpenSaved()}
            className="hover:text-stone-950 transition-colors focus:outline-none cursor-pointer flex items-center gap-1"
          >
            <Bookmark className="w-3.5 h-3.5 text-stone-500" />
            Saved Recipes ({savedCount})
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden sm:block w-44 lg:w-56">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search flavor or drink..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-100/80 hover:bg-stone-100 border border-stone-200/90 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Custom Beverage Creator Button */}
          <button
            onClick={onOpenCustomizerForNew}
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-200/70 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-800" />
            Custom Beverage
          </button>

          {/* Cart Bag Button */}
          <button
            onClick={onOpenCart}
            aria-label="View shopping order bag"
            className="relative flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Order Bag</span>
            {totalCartItems > 0 ? (
              <span className="bg-amber-500 text-stone-950 font-bold px-1.5 py-0.5 rounded text-[11px] tabular-nums">
                {totalCartItems} · ${cartSubtotal.toFixed(2)}
              </span>
            ) : (
              <span className="text-stone-300 font-normal tabular-nums">$0.00</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
