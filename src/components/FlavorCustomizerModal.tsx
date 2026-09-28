import React, { useState, useEffect } from 'react';
import {
  CakeServingStyle,
  ColdFoamOption,
  CookieWarmth,
  CustomizationSelection,
  FlavorOption,
  IceCreamFormat,
  MenuItem,
  MilkOption,
  RoastOption,
  ToppingOption,
  BeverageSize,
  BeverageTemp,
} from '../types/cafe';
import {
  FLAVOR_OPTIONS,
  MILK_OPTIONS,
  ROAST_OPTIONS,
  COLD_FOAM_OPTIONS,
  TOPPING_OPTIONS,
} from '../data/cafeData';
import { DrinkVisualizer } from './DrinkVisualizer';
import {
  X,
  Plus,
  Minus,
  Bookmark,
  Check,
  Flame,
  Snowflake,
  Sparkles,
  Info,
  Cookie,
  Cake,
  IceCream,
  Coffee,
  GlassWater,
} from 'lucide-react';

interface FlavorCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  initialFlavorId?: string;
  onAddToCart: (
    item: MenuItem,
    customization: CustomizationSelection,
    unitPrice: number,
    quantity: number,
    savedTitle?: string
  ) => void;
  onSaveRecipe: (
    name: string,
    menuItemId: string,
    customization: CustomizationSelection
  ) => void;
}

export const FlavorCustomizerModal: React.FC<FlavorCustomizerModalProps> = ({
  isOpen,
  onClose,
  item,
  initialFlavorId,
  onAddToCart,
  onSaveRecipe,
}) => {
  if (!isOpen || !item) return null;

  // Base state
  const [size, setSize] = useState<BeverageSize>(
    item.defaultCustomization?.size || 'regular'
  );
  const [temp, setTemp] = useState<BeverageTemp>(
    item.defaultCustomization?.temp || 'hot'
  );
  const [roastId, setRoastId] = useState<string>(
    item.defaultCustomization?.roastId || 'velvet-dusk'
  );
  const [espressoShots, setEspressoShots] = useState<number>(
    item.defaultCustomization?.espressoShots ?? (item.category === 'coffees' ? 2 : 0)
  );
  const [milkId, setMilkId] = useState<string>(
    item.defaultCustomization?.milkId || 'organic-whole'
  );
  const [sweetnessLevel, setSweetnessLevel] = useState<number>(
    item.defaultCustomization?.sweetnessLevel ?? 50
  );
  const [selectedFlavors, setSelectedFlavors] = useState<
    { flavorId: string; pumps: number }[]
  >(item.defaultCustomization?.selectedFlavors || []);
  const [coldFoamId, setColdFoamId] = useState<string | undefined>(
    item.defaultCustomization?.coldFoamId
  );
  const [selectedToppings, setSelectedToppings] = useState<string[]>(
    item.defaultCustomization?.selectedToppings || []
  );
  const [iceLevel, setIceLevel] = useState<'none' | 'light' | 'regular' | 'extra'>(
    item.defaultCustomization?.iceLevel || 'regular'
  );

  // Category specific state
  const [cookieWarmth, setCookieWarmth] = useState<CookieWarmth>(
    item.defaultCustomization?.cookieWarmth || 'warm-gooey'
  );
  const [cookieDip, setCookieDip] = useState<
    'none' | 'chantilly-cream' | 'espresso-shot' | 'vanilla-softserve'
  >(item.defaultCustomization?.cookieDip || 'none');

  const [cakeStyle, setCakeStyle] = useState<CakeServingStyle>(
    item.defaultCustomization?.cakeStyle || 'artisan-slice'
  );
  const [cakeDrizzle, setCakeDrizzle] = useState<
    'none' | 'belgian-dark-ganache' | 'wild-raspberry-coulis' | 'salted-caramel' | 'pistachio-crema'
  >(item.defaultCustomization?.cakeDrizzle || 'none');
  const [cakeCream, setCakeCream] = useState<
    'none' | 'vanilla-chantilly' | 'mascarpone-quenelle' | 'vegan-coconut'
  >(item.defaultCustomization?.cakeCream || 'vanilla-chantilly');

  const [iceCreamFormat, setIceCreamFormat] = useState<IceCreamFormat>(
    item.defaultCustomization?.iceCreamFormat || 'ceramic-cup'
  );
  const [iceCreamScoopCount, setIceCreamScoopCount] = useState<1 | 2 | 3>(
    item.defaultCustomization?.iceCreamScoopCount || 2
  );
  const [iceCreamSauce, setIceCreamSauce] = useState<
    'none' | 'warm-hot-fudge' | 'salted-caramel-dulce' | 'pistachio-butter' | 'affogato-espresso-shot'
  >(item.defaultCustomization?.iceCreamSauce || 'none');

  const [shakeSize, setShakeSize] = useState<'regular' | 'large'>(
    item.defaultCustomization?.shakeSize || 'regular'
  );
  const [shakeBase, setShakeBase] = useState<'whole-gelato' | 'oat-vegan-gelato' | 'high-protein'>(
    item.defaultCustomization?.shakeBase || 'whole-gelato'
  );
  const [whippedCream, setWhippedCream] = useState<boolean>(
    item.defaultCustomization?.whippedCream ?? true
  );

  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [saveNamePrompt, setSaveNamePrompt] = useState<boolean>(false);
  const [customRecipeName, setCustomRecipeName] = useState<string>('');
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);

  // If initial flavor is passed, ensure it is added
  useEffect(() => {
    if (initialFlavorId) {
      setSelectedFlavors((prev) => {
        const exists = prev.find((f) => f.flavorId === initialFlavorId);
        if (!exists) {
          return [...prev, { flavorId: initialFlavorId, pumps: 2 }];
        }
        return prev;
      });
    }
  }, [initialFlavorId]);

  // Price Calculation
  const calculateUnitPrice = (): number => {
    let total = item.basePrice;

    // Beverage size extra
    if (item.category === 'coffees') {
      if (size === 'large') total += 0.85;
      if (size === 'small') total -= 0.50;
      const milk = MILK_OPTIONS.find((m) => m.id === milkId);
      if (milk) total += milk.extraCost;
      const roast = ROAST_OPTIONS.find((r) => r.id === roastId);
      if (roast) total += roast.extraCost;
      if (espressoShots > 2) total += (espressoShots - 2) * 1.0;
      if (coldFoamId) {
        const foam = COLD_FOAM_OPTIONS.find((f) => f.id === coldFoamId);
        if (foam) total += foam.price;
      }
    }

    // Milkshake size & base
    if (item.category === 'milkshakes') {
      if (shakeSize === 'large') total += 1.75;
      if (shakeBase === 'oat-vegan-gelato') total += 0.85;
      if (shakeBase === 'high-protein') total += 1.25;
    }

    // Cookie dip
    if (item.category === 'cookies') {
      if (cookieDip === 'chantilly-cream') total += 1.00;
      if (cookieDip === 'espresso-shot') total += 1.50;
      if (cookieDip === 'vanilla-softserve') total += 2.00;
    }

    // Cake style & accompaniment
    if (item.category === 'cakes') {
      if (cakeStyle === 'double-taster') total += 4.50;
      if (cakeStyle === 'slice-a-la-mode') total += 3.00;
      if (cakeDrizzle !== 'none') total += 0.75;
      if (cakeCream === 'mascarpone-quenelle') total += 1.00;
      if (cakeCream === 'vanilla-chantilly') total += 0.75;
      if (cakeCream === 'vegan-coconut') total += 0.85;
    }

    // Ice cream format & scoops
    if (item.category === 'ice_cream') {
      if (iceCreamFormat === 'waffle-cone') total += 0.75;
      if (iceCreamFormat === 'brioche-sandwich') total += 2.50;
      if (iceCreamScoopCount === 1) total -= 1.50;
      if (iceCreamScoopCount === 3) total += 2.25;
      if (iceCreamSauce === 'affogato-espresso-shot') total += 1.75;
      else if (iceCreamSauce !== 'none') total += 0.75;
    }

    // Flavor pumps cost across all categories
    selectedFlavors.forEach((sf) => {
      const flv = FLAVOR_OPTIONS.find((f) => f.id === sf.flavorId);
      if (flv) {
        total += flv.pricePerPump * sf.pumps;
      }
    });

    // Toppings cost across all categories
    selectedToppings.forEach((topId) => {
      const top = TOPPING_OPTIONS.find((t) => t.id === topId);
      if (top) total += top.price;
    });

    return Math.max(total, item.basePrice);
  };

  const unitPrice = calculateUnitPrice();

  // Flavor Pump Handlers
  const handlePumpChange = (flavorId: string, delta: number) => {
    setSelectedFlavors((prev) => {
      const existing = prev.find((f) => f.flavorId === flavorId);
      if (!existing && delta > 0) {
        return [...prev, { flavorId, pumps: 1 }];
      }
      if (existing) {
        const nextPumps = existing.pumps + delta;
        if (nextPumps <= 0) {
          return prev.filter((f) => f.flavorId !== flavorId);
        }
        return prev.map((f) =>
          f.flavorId === flavorId ? { ...f, pumps: nextPumps } : f
        );
      }
      return prev;
    });
  };

  const getPumps = (flavorId: string) => {
    return selectedFlavors.find((f) => f.flavorId === flavorId)?.pumps || 0;
  };

  const handleToppingToggle = (topId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(topId) ? prev.filter((id) => id !== topId) : [...prev, topId]
    );
  };

  // Compile Current Customization Object
  const currentCustomization: CustomizationSelection = {
    sweetnessLevel,
    selectedFlavors,
    selectedToppings,
    specialNotes: specialNotes.trim() ? specialNotes.trim() : undefined,
    size: item.category === 'coffees' ? size : undefined,
    temp: item.category === 'coffees' ? temp : undefined,
    roastId: item.category === 'coffees' ? roastId : undefined,
    espressoShots: item.category === 'coffees' ? espressoShots : undefined,
    milkId: item.category === 'coffees' ? milkId : undefined,
    coldFoamId: item.category === 'coffees' ? coldFoamId : undefined,
    iceLevel: item.category === 'coffees' && temp === 'iced' ? iceLevel : undefined,
    cookieWarmth: item.category === 'cookies' ? cookieWarmth : undefined,
    cookieDip: item.category === 'cookies' ? cookieDip : undefined,
    cakeStyle: item.category === 'cakes' ? cakeStyle : undefined,
    cakeDrizzle: item.category === 'cakes' ? cakeDrizzle : undefined,
    cakeCream: item.category === 'cakes' ? cakeCream : undefined,
    iceCreamFormat: item.category === 'ice_cream' ? iceCreamFormat : undefined,
    iceCreamScoopCount: item.category === 'ice_cream' ? iceCreamScoopCount : undefined,
    iceCreamSauce: item.category === 'ice_cream' ? iceCreamSauce : undefined,
    shakeSize: item.category === 'milkshakes' ? shakeSize : undefined,
    shakeBase: item.category === 'milkshakes' ? shakeBase : undefined,
    whippedCream: item.category === 'milkshakes' ? whippedCream : undefined,
  };

  const handleAddToCartClick = () => {
    onAddToCart(
      item,
      currentCustomization,
      unitPrice,
      quantity,
      customRecipeName.trim() ? customRecipeName.trim() : undefined
    );
    onClose();
  };

  const handleSaveRecipeClick = () => {
    if (!customRecipeName.trim()) {
      setSaveNamePrompt(true);
      return;
    }
    onSaveRecipe(customRecipeName.trim(), item.id, currentCustomization);
    setIsSavedFeedback(true);
    setTimeout(() => {
      setIsSavedFeedback(false);
      setSaveNamePrompt(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl border border-stone-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-stone-800 text-amber-400">
              {item.category === 'coffees' && <Coffee className="w-5 h-5" />}
              {item.category === 'cookies' && <Cookie className="w-5 h-5" />}
              {item.category === 'cakes' && <Cake className="w-5 h-5" />}
              {item.category === 'ice_cream' && <IceCream className="w-5 h-5" />}
              {item.category === 'milkshakes' && <GlassWater className="w-5 h-5" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400">
                  Customizing {item.category.replace('_', ' ')}
                </span>
                <span className="text-stone-500">·</span>
                <span className="text-xs text-stone-300">{item.caloriesApprox} kcal</span>
              </div>
              <h2 className="font-display text-xl font-bold text-white leading-tight">
                {item.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns on desktop (Visualizer left, controls right) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Interactive Visualizer & Recipe Summary */}
          <div className="lg:col-span-5 bg-stone-900/95 p-6 border-b lg:border-b-0 lg:border-r border-stone-800 flex flex-col justify-between">
            <div>
              <DrinkVisualizer
                customization={currentCustomization}
                category={item.category}
                flavors={FLAVOR_OPTIONS}
                milks={MILK_OPTIONS}
                roasts={ROAST_OPTIONS}
                coldFoams={COLD_FOAM_OPTIONS}
                toppings={TOPPING_OPTIONS}
                itemName={item.name}
              />

              {/* Recipe Notes callout */}
              <div className="mt-4 p-4 rounded-xl bg-stone-800/80 border border-stone-700/60 text-xs text-stone-300">
                <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Chef's Formulation Note</span>
                </div>
                <p className="leading-relaxed text-stone-400">
                  {item.category === 'coffees' &&
                    'Our beans are roasted in micro-batches and pulled at 9 bars of pressure. Custom flavor syrups are hand-steeped in house.'}
                  {item.category === 'cookies' &&
                    'Baked fresh every morning with pure Isigny butter. Choose freshly warmed for a luscious molten core.'}
                  {item.category === 'cakes' &&
                    'Layered with premium French butter and single-origin chocolates. Pair with whipped mascarpone or fresh raspberry coulis.'}
                  {item.category === 'ice_cream' &&
                    'Slow churned gelato using Straus organic milk and Sicilian pistachio butter. Try affogato style with hot espresso!'}
                  {item.category === 'milkshakes' &&
                    'Spun extra thick with dense artisan gelato and capped with cold foam or chantilly cream.'}
                </p>
              </div>
            </div>

            {/* Bookmark / Secret Recipe Trigger */}
            <div className="mt-6 pt-4 border-t border-stone-800">
              {saveNamePrompt ? (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-stone-300 block">
                    Name your signature creation:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Maya's Morning Ritual"
                      value={customRecipeName}
                      onChange={(e) => setCustomRecipeName(e.target.value)}
                      className="flex-1 bg-stone-800 border border-stone-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-hidden focus:border-amber-400"
                    />
                    <button
                      onClick={handleSaveRecipeClick}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setSaveNamePrompt(false)}
                      className="px-2 py-1.5 text-stone-400 hover:text-white text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSaveNamePrompt(true)}
                  className="w-full py-2 bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-700/80 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSavedFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Creation Saved to Memory!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                      <span>Save as My Secret Creation</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Flavor & Customization Studio */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-8 bg-[#FAF8F5]">
            {/* ================= 1. CATEGORY CORE CONTROLS ================= */}

            {/* COFFEES: Temp & Size */}
            {item.category === 'coffees' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Temperature & Extraction
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'hot', label: 'Hot Steamed', icon: Flame },
                      { id: 'iced', label: 'Over Hand-Cut Ice', icon: Snowflake },
                      { id: 'nitro', label: 'Nitro Infused', icon: Sparkles },
                    ].map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTemp(t.id as BeverageTemp)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            temp === t.id
                              ? 'bg-amber-50 border-amber-900 ring-2 ring-amber-900/10 text-amber-950 font-semibold shadow-xs'
                              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-2 ${temp === t.id ? 'text-amber-700' : 'text-stone-400'}`} />
                          <span className="text-xs">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Beverage Volume
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'small', label: 'Small (8 oz)', note: '-$0.50' },
                      { id: 'regular', label: 'Regular (12 oz)', note: 'Standard' },
                      { id: 'large', label: 'Large (16 oz)', note: '+$0.85' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSize(s.id as BeverageSize)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          size === s.id
                            ? 'bg-amber-50 border-amber-900 ring-2 ring-amber-900/10 text-amber-950 font-semibold'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <div className="text-xs font-medium">{s.label}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">{s.note}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Roast & Espresso Shots */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Espresso Extraction & Roast
                    </label>
                    <div className="flex items-center gap-2 bg-stone-200/80 px-2 py-1 rounded-lg text-xs font-medium text-stone-800">
                      <span>Shots:</span>
                      <button
                        type="button"
                        onClick={() => setEspressoShots(Math.max(1, espressoShots - 1))}
                        className="w-5 h-5 rounded bg-white flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold w-4 text-center">{espressoShots}</span>
                      <button
                        type="button"
                        onClick={() => setEspressoShots(Math.min(4, espressoShots + 1))}
                        className="w-5 h-5 rounded bg-white flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ROAST_OPTIONS.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => setRoastId(r.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                          roastId === r.id
                            ? 'bg-white border-stone-900 ring-1 ring-stone-900 text-stone-900 shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-stone-900">{r.name}</div>
                          <div className="text-[11px] text-stone-500">{r.origin} · {r.profile}</div>
                        </div>
                        {r.extraCost > 0 && (
                          <span className="text-xs font-medium text-amber-900 tabular-nums">
                            +${r.extraCost.toFixed(2)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milk Selection */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Milk & Plant Dairy
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MILK_OPTIONS.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setMilkId(m.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          milkId === m.id
                            ? 'bg-white border-stone-900 ring-1 ring-stone-900 text-stone-900 shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white'
                        }`}
                      >
                        <div className="pr-2">
                          <div className="text-xs font-medium text-stone-900">{m.name}</div>
                          <div className="text-[10px] text-stone-500 line-clamp-1">{m.description}</div>
                        </div>
                        {m.extraCost > 0 ? (
                          <span className="text-xs font-medium text-amber-900 tabular-nums whitespace-nowrap">
                            +${m.extraCost.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400">Incl.</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COOKIES: Warmth & Dip */}
            {item.category === 'cookies' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Cookie Warmth & Texture Finish
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'warm-gooey', label: 'Freshly Warmed & Gooey', desc: 'Molten soft core' },
                      { id: 'toasted-crisp', label: 'Toasted Crispy Edge', desc: 'Golden caramelized edge' },
                      { id: 'room-temp', label: 'Ambient Soft-Baked', desc: 'Classic bakery room temp' },
                    ].map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setCookieWarmth(w.id as CookieWarmth)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          cookieWarmth === w.id
                            ? 'bg-amber-50 border-amber-900 ring-2 ring-amber-900/10 text-amber-950 font-semibold'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <div className="text-xs font-medium">{w.label}</div>
                        <div className="text-[10px] text-stone-400 mt-1">{w.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Artisanal Side Dip / Pairing
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'none', label: 'No Side Dip', price: 0 },
                      { id: 'chantilly-cream', label: 'Vanilla Bean Chantilly Cream', price: 1.00 },
                      { id: 'espresso-shot', label: 'Hot Double Espresso Dip', price: 1.50 },
                      { id: 'vanilla-softserve', label: 'Madagascar Gelato Cup', price: 2.00 },
                    ].map((d) => (
                      <div
                        key={d.id}
                        onClick={() => setCookieDip(d.id as any)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          cookieDip === d.id
                            ? 'bg-white border-stone-900 ring-1 ring-stone-900 text-stone-900 shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white'
                        }`}
                      >
                        <span className="text-xs font-medium">{d.label}</span>
                        <span className="text-xs text-amber-900 tabular-nums">
                          {d.price > 0 ? `+$${d.price.toFixed(2)}` : 'Incl.'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CAKES: Style, Drizzle & Cream */}
            {item.category === 'cakes' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Portion & Serving Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'artisan-slice', label: 'Artisan Slice', note: 'Single cut', cost: 0 },
                      { id: 'double-taster', label: 'Double Taster Duo', note: 'Two portions', cost: 4.50 },
                      { id: 'slice-a-la-mode', label: 'Slice à la Mode', note: '+ Gelato scoop', cost: 3.00 },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setCakeStyle(s.id as CakeServingStyle)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          cakeStyle === s.id
                            ? 'bg-amber-50 border-amber-900 ring-2 ring-amber-900/10 text-amber-950 font-semibold'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <div className="text-xs font-medium">{s.label}</div>
                        <div className="text-[10px] text-stone-400 mt-1">
                          {s.cost > 0 ? `+$${s.cost.toFixed(2)}` : s.note}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Artisanal Coulis & Drizzle Glaze
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'none', label: 'No Extra Drizzle', price: 0 },
                      { id: 'salted-caramel', label: 'Salted Caramel Dulce', price: 0.75 },
                      { id: 'belgian-dark-ganache', label: 'Warm Belgian Dark Ganache', price: 0.80 },
                      { id: 'wild-raspberry-coulis', label: 'Wild Raspberry Rose Coulis', price: 0.75 },
                      { id: 'pistachio-crema', label: 'Bronte Pistachio Crema', price: 0.85 },
                    ].map((dz) => (
                      <div
                        key={dz.id}
                        onClick={() => setCakeDrizzle(dz.id as any)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          cakeDrizzle === dz.id
                            ? 'bg-white border-stone-900 ring-1 ring-stone-900 text-stone-900 shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white'
                        }`}
                      >
                        <span className="text-xs font-medium">{dz.label}</span>
                        <span className="text-xs text-amber-900 tabular-nums">
                          {dz.price > 0 ? `+$${dz.price.toFixed(2)}` : 'Incl.'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Whipped Cream Accompaniment
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'vanilla-chantilly', label: 'Tahitian Vanilla Chantilly', price: 0.75 },
                      { id: 'mascarpone-quenelle', label: 'Italian Mascarpone Quenelle', price: 1.00 },
                      { id: 'vegan-coconut', label: 'Vegan Coconut Silk Cream', price: 0.85 },
                      { id: 'none', label: 'No Whipped Cream', price: 0 },
                    ].map((cr) => (
                      <div
                        key={cr.id}
                        onClick={() => setCakeCream(cr.id as any)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          cakeCream === cr.id
                            ? 'bg-white border-stone-900 ring-1 ring-stone-900 text-stone-900 shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white'
                        }`}
                      >
                        <span className="text-xs font-medium">{cr.label}</span>
                        <span className="text-xs text-amber-900 tabular-nums">
                          {cr.price > 0 ? `+$${cr.price.toFixed(2)}` : 'Incl.'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ICE CREAM: Format, Scoops, Sauce */}
            {item.category === 'ice_cream' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Gelato Format & Serving
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'ceramic-cup', label: 'Artisan Ceramic Cup', cost: 0 },
                      { id: 'waffle-cone', label: 'Handmade Waffle Cone', cost: 0.75 },
                      { id: 'brioche-sandwich', label: 'Warm Toasted Brioche', cost: 2.50 },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setIceCreamFormat(f.id as IceCreamFormat)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          iceCreamFormat === f.id
                            ? 'bg-amber-50 border-amber-900 ring-2 ring-amber-900/10 text-amber-950 font-semibold'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <div className="text-xs font-medium">{f.label}</div>
                        <div className="text-[10px] text-stone-400 mt-1">
                          {f.cost > 0 ? `+$${f.cost.toFixed(2)}` : 'Standard'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Number of Scoops
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { count: 1 as const, label: 'Single Scoop (1)', note: '-$1.50' },
                      { count: 2 as const, label: 'Double Scoop (2)', note: 'Standard' },
                      { count: 3 as const, label: 'Triple Flight (3)', note: '+$2.25' },
                    ].map((sc) => (
                      <button
                        key={sc.count}
                        type="button"
                        onClick={() => setIceCreamScoopCount(sc.count)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          iceCreamScoopCount === sc.count
                            ? 'bg-amber-50 border-amber-900 ring-2 ring-amber-900/10 text-amber-950 font-semibold'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <div className="text-xs font-medium">{sc.label}</div>
                        <div className="text-[10px] text-stone-400 mt-1">{sc.note}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Warm Sauce / Affogato Pour
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'none', label: 'No Sauce', price: 0 },
                      { id: 'warm-hot-fudge', label: 'Warm Belgian Hot Fudge', price: 0.80 },
                      { id: 'salted-caramel-dulce', label: 'Salted Caramel Dulce', price: 0.75 },
                      { id: 'pistachio-butter', label: 'Sicilian Pistachio Butter', price: 0.85 },
                      { id: 'affogato-espresso-shot', label: 'Affogato Double Espresso Pour', price: 1.75 },
                    ].map((sc) => (
                      <div
                        key={sc.id}
                        onClick={() => setIceCreamSauce(sc.id as any)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          iceCreamSauce === sc.id
                            ? 'bg-white border-stone-900 ring-1 ring-stone-900 text-stone-900 shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white'
                        }`}
                      >
                        <span className="text-xs font-medium">{sc.label}</span>
                        <span className="text-xs text-amber-900 tabular-nums">
                          {sc.price > 0 ? `+$${sc.price.toFixed(2)}` : 'Incl.'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MILKSHAKES: Size & Base */}
            {item.category === 'milkshakes' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Shake Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'regular', label: 'Regular (12 oz)', cost: 'Standard' },
                      { id: 'large', label: 'Large (16 oz)', cost: '+$1.75' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setShakeSize(s.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          shakeSize === s.id
                            ? 'bg-amber-50 border-amber-900 ring-2 ring-amber-900/10 text-amber-950 font-semibold'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <div className="text-xs font-medium">{s.label}</div>
                        <div className="text-[10px] text-stone-400 mt-1">{s.cost}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Gelato & Milk Base
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'whole-gelato', label: 'Whole Milk Gelato', note: 'Ultra thick & rich', price: 0 },
                      { id: 'oat-vegan-gelato', label: 'Oat Milk & Vegan Gelato', note: 'Dairy-free', price: 0.85 },
                      { id: 'high-protein', label: 'High-Protein Blend', note: '+25g whey protein', price: 1.25 },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setShakeBase(b.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          shakeBase === b.id
                            ? 'bg-amber-50 border-amber-900 ring-2 ring-amber-900/10 text-amber-950 font-semibold'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <div className="text-xs font-medium">{b.label}</div>
                        <div className="text-[10px] text-stone-400 mt-1">
                          {b.price > 0 ? `+$${b.price.toFixed(2)}` : b.note}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                    Whipped Chantilly Cream Cap
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWhippedCream(true)}
                      className={`flex-1 p-2.5 rounded-xl border text-center text-xs font-medium cursor-pointer transition-all ${
                        whippedCream
                          ? 'bg-white border-stone-900 text-stone-900 font-bold shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      Piped Chantilly Cream & Drizzle
                    </button>
                    <button
                      type="button"
                      onClick={() => setWhippedCream(false)}
                      className={`flex-1 p-2.5 rounded-xl border text-center text-xs font-medium cursor-pointer transition-all ${
                        !whippedCream
                          ? 'bg-white border-stone-900 text-stone-900 font-bold shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      No Whipped Cream
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 2. DESIRABLE FLAVORS & SYRUPS (FOR ALL CATEGORIES) ================= */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Choose Desirable Flavors & Syrups</span>
                  </label>
                  <span className="text-[11px] text-stone-500 block">
                    House-steeped natural infusions. Adjust pump counts to customize sweetness and depth.
                  </span>
                </div>
                <div className="text-xs text-stone-400 font-mono">
                  {selectedFlavors.reduce((sum, f) => sum + f.pumps, 0)} pumps active
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FLAVOR_OPTIONS.map((flavor) => {
                  const pumps = getPumps(flavor.id);
                  const isSelected = pumps > 0;

                  return (
                    <div
                      key={flavor.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-50/70 border-amber-800/80 shadow-xs ring-1 ring-amber-800/20'
                          : 'bg-white border-stone-200/90 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full mt-1 shrink-0 shadow-xs"
                          style={{ backgroundColor: flavor.colorHex }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-stone-900 truncate">
                              {flavor.name}
                            </span>
                            {flavor.isSugarFree && (
                              <span className="text-[9px] bg-stone-200 text-stone-700 font-bold px-1.5 py-0.2 rounded">
                                SF
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-stone-500 truncate">{flavor.notes}</div>
                          <div className="text-[10px] text-amber-900 font-mono mt-0.5">
                            +${flavor.pricePerPump.toFixed(2)}/pump
                          </div>
                        </div>
                      </div>

                      {/* Stepper Buttons */}
                      <div className="flex items-center gap-1 shrink-0 bg-stone-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => handlePumpChange(flavor.id, -1)}
                          disabled={pumps === 0}
                          className="w-6 h-6 rounded-lg bg-white disabled:opacity-40 disabled:hover:bg-white text-stone-700 hover:bg-stone-50 flex items-center justify-center cursor-pointer shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-mono font-bold text-stone-900">
                          {pumps}
                        </span>
                        <button
                          type="button"
                          onClick={() => handlePumpChange(flavor.id, 1)}
                          className="w-6 h-6 rounded-lg bg-stone-900 text-white hover:bg-stone-800 flex items-center justify-center cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= 3. SWEETNESS LEVEL ================= */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Sweetness Intensity
                </label>
                <span className="text-xs font-mono font-semibold text-amber-900">
                  {sweetnessLevel === 0 && 'Unsweetened (0%)'}
                  {sweetnessLevel === 25 && 'Subtle Touch (25%)'}
                  {sweetnessLevel === 50 && 'Balanced Standard (50%)'}
                  {sweetnessLevel === 75 && 'Richly Sweet (75%)'}
                  {sweetnessLevel === 100 && 'Extra Sweet Indulgence (100%)'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[0, 25, 50, 75, 100].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSweetnessLevel(lvl)}
                    className={`py-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                      sweetnessLevel === lvl
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {lvl}%
                  </button>
                ))}
              </div>
            </div>

            {/* ================= 4. ARTISANAL TOPPINGS & CRUNCH ================= */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                Artisanal Toppings & Accents
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TOPPING_OPTIONS.map((top) => {
                  const isChecked = selectedToppings.includes(top.id);
                  return (
                    <div
                      key={top.id}
                      onClick={() => handleToppingToggle(top.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isChecked
                          ? 'bg-amber-50/80 border-amber-900 ring-1 ring-amber-900/30 text-amber-950 font-semibold shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">{top.name}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-amber-900" />}
                      </div>
                      <div className="text-[11px] text-stone-400 tabular-nums">
                        {top.price > 0 ? `+$${top.price.toFixed(2)}` : 'Complimentary'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-1.5">
                Special Barista / Baker Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Extra hot milk, double cup, serve coulis on the side..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky Bar: Unit Price, Quantity, Add to Bag */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                Total Per Item
              </span>
              <span className="font-display text-2xl font-bold text-stone-900 tabular-nums">
                ${unitPrice.toFixed(2)}
              </span>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-white text-stone-700 hover:bg-stone-50 flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-mono font-bold text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-white text-stone-700 hover:bg-stone-50 flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer w-1/3 sm:w-auto text-center"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleAddToCartClick}
              className="flex-1 sm:flex-none px-7 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Add to Order Bag · ${(unitPrice * quantity).toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
