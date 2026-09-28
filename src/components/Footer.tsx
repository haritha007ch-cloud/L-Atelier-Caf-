import React from 'react';
import { Coffee, MapPin, Clock, Heart, Award } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenCustomizerForNew: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenCustomizerForNew,
}) => {
  return (
    <footer id="roastery" className="bg-[#181614] text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand Col */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">
              L'Atelier Café
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              An artisanal roastery and flavor laboratory dedicated to single-origin extractions, 
              house-steeped botanical syrups, and bespoke beverage craftsmanship.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <Award className="w-4 h-4" />
              <span>Certified Specialty Coffee Association (SCA 88+ Cup)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigateSection('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Full Cafe Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('flavor-studio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Artisan Flavor Bar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('pairings')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Master Flavor Pairings
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCustomizerForNew}
                  className="hover:text-white transition-colors cursor-pointer text-amber-300"
                >
                  Custom Drink Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Hours & Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100">
              Espresso Bar Hours
            </h4>
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Monday – Friday: 6:30 AM – 6:00 PM</span>
              </div>
              <div className="flex items-center gap-2 pl-5.5">
                <span>Saturday – Sunday: 7:30 AM – 7:00 PM</span>
              </div>
              <p className="text-[11px] text-stone-500 pt-1">
                Online mobile ordering & pickup available 15 minutes prior to opening.
              </p>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-100">
              Our Roastery Lab
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <span>
                  442 Mission Street, Suite 101<br />
                  Roasting & Tasting Room
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Direct trade partnerships with smallholder family farms in Huila, Colombia & Yirgacheffe, Ethiopia.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} L'Atelier Café & Roastery. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Organic Ingredients</span>
            <span aria-hidden="true">·</span>
            <span>Zero Artificial Sweeteners</span>
            <span aria-hidden="true">·</span>
            <span>Compostable Cups</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
