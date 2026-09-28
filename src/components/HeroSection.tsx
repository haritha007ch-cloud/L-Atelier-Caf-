import React from 'react';
import { Sparkles, ArrowDown, Wand2, Coffee, Cookie, Cake, IceCream, GlassWater } from 'lucide-react';
import { heroImage } from '../data/cafeData';
import { CafeCategory } from '../types/cafe';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onOpenCustomizer: () => void;
  onSelectCategory: (category: CafeCategory) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMenu,
  onOpenCustomizer,
  onSelectCategory,
}) => {
  const quickCategories = [
    { id: 'coffees' as CafeCategory, label: 'Coffees', icon: Coffee, desc: 'Espresso & Cold Brews' },
    { id: 'cookies' as CafeCategory, label: 'Cookies', icon: Cookie, desc: 'Warm Stuffed & Soft-Baked' },
    { id: 'cakes' as CafeCategory, label: 'Cakes', icon: Cake, desc: 'Basque & Dark Tortes' },
    { id: 'ice_cream' as CafeCategory, label: 'Ice Cream', icon: IceCream, desc: 'Artisan Gelato & Cones' },
    { id: 'milkshakes' as CafeCategory, label: 'Milkshakes', icon: GlassWater, desc: 'Hand-Spun Craft Shakes' },
  ];

  return (
    <section id="hero" className="relative overflow-hidden bg-stone-900 text-stone-100">
      {/* Background Photography with Scrim */}
      <div className="absolute inset-0 z-0 opacity-45 mix-blend-luminosity">
        <img
          src={heroImage}
          alt="Artisanal cafe counter at L'Atelier with warm morning light"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transform duration-1000"
        />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-stone-950 via-stone-900/85 to-stone-900/60" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-3xl">
          {/* Subtle Top Kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisanal Specialty Cafe & Roastery</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>Five Gourmet Categories</span>
          </div>

          {/* Headline with Balanced Text */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1] [text-wrap:balance]">
            Browse our cafe menu & customize your favorite flavors.
          </h1>

          <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed mb-8 max-w-2xl">
            Explore handcrafted <strong>Coffees</strong>, freshly baked warm <strong>Cookies</strong>, 
            luxurious <strong>Cakes</strong>, slow-churned <strong>Ice Cream</strong>, and hand-spun thick <strong>Milkshakes</strong>.
            Tailor every single order with house-steeped flavors, molten drizzles, and signature toppings.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mb-10">
            <button
              onClick={onOpenCustomizer}
              className="px-6 py-3.5 text-sm font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-stone-950" />
              <span>Open Flavor Studio</span>
            </button>

            <button
              onClick={onExploreMenu}
              className="px-5 py-3.5 text-sm font-semibold text-white bg-stone-800/90 hover:bg-stone-700 border border-stone-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Menu Categories</span>
              <ArrowDown className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>

          {/* 5 Category Quick Jump Buttons */}
          <div className="pt-6 border-t border-stone-800/80">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-3">
              Direct Access by Category:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {quickCategories.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCategory(c.id);
                      onExploreMenu();
                    }}
                    className="p-3 bg-stone-800/60 hover:bg-stone-800 border border-stone-700/70 hover:border-amber-400/50 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-white group-hover:text-amber-300">
                        {c.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 block line-clamp-1">
                      {c.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
