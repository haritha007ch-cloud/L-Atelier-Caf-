import React from 'react';
import {
  CafeCategory,
  ColdFoamOption,
  CustomizationSelection,
  FlavorOption,
  MilkOption,
  RoastOption,
  ToppingOption,
} from '../types/cafe';
import { Sparkles, Thermometer, Droplet, Coffee, Cookie, Cake, IceCream, GlassWater, Flame } from 'lucide-react';

interface DrinkVisualizerProps {
  customization: CustomizationSelection;
  category?: CafeCategory;
  flavors: FlavorOption[];
  milks: MilkOption[];
  roasts: RoastOption[];
  coldFoams: ColdFoamOption[];
  toppings: ToppingOption[];
  itemName: string;
}

export const DrinkVisualizer: React.FC<DrinkVisualizerProps> = ({
  customization,
  category = 'coffees',
  flavors,
  milks,
  roasts,
  coldFoams,
  toppings,
  itemName,
}) => {
  const selectedMilk = milks.find((m) => m.id === customization.milkId);
  const selectedColdFoam = coldFoams.find((f) => f.id === customization.coldFoamId);

  // Find primary active flavor
  const primaryFlavor =
    customization.selectedFlavors.length > 0
      ? flavors.find((f) => f.id === customization.selectedFlavors[0].flavorId)
      : null;

  const totalFlavorPumps = customization.selectedFlavors.reduce(
    (sum, item) => sum + item.pumps,
    0
  );

  const activeToppingObjects = toppings.filter((t) =>
    customization.selectedToppings.includes(t.id)
  );

  // Dynamic colors for cookies, cakes, ice cream, shakes
  const hasGanache = customization.selectedFlavors.some(
    (f) => f.flavorId === 'belgian-dark-mocha'
  ) || customization.cakeDrizzle === 'belgian-dark-ganache' || customization.iceCreamSauce === 'warm-hot-fudge';

  const hasPistachio = customization.selectedFlavors.some(
    (f) => f.flavorId === 'salted-pistachio'
  ) || customization.cakeDrizzle === 'pistachio-crema' || customization.iceCreamSauce === 'pistachio-butter';

  const hasCaramel = customization.selectedFlavors.some(
    (f) => f.flavorId === 'brown-sugar-cardamom' || f.flavorId === 'toasted-coconut-blossom'
  ) || customization.cakeDrizzle === 'salted-caramel' || customization.iceCreamSauce === 'salted-caramel-dulce';

  const hasRaspberry = customization.cakeDrizzle === 'wild-raspberry-coulis';
  const hasAffogato = customization.iceCreamSauce === 'affogato-espresso-shot';

  // Beverage gradients
  const isMatcha = itemName.toLowerCase().includes('matcha');
  const isColdBrew = itemName.toLowerCase().includes('cold brew');
  const isBlack = customization.milkId === 'none-black';

  let baseLiquidGradient = 'linear-gradient(180deg, #3A1F13 0%, #200E08 100%)';
  if (isMatcha) {
    baseLiquidGradient = isBlack
      ? 'linear-gradient(180deg, #3D6A35 0%, #23451D 100%)'
      : 'linear-gradient(180deg, #4F8043 20%, #759A6C 60%, #E6E0CC 100%)';
  } else if (isColdBrew) {
    baseLiquidGradient = isBlack
      ? 'linear-gradient(180deg, #1C110C 0%, #0E0704 100%)'
      : 'linear-gradient(180deg, #2D1A12 0%, #68422E 65%, #DFD5C6 100%)';
  } else if (!isBlack) {
    const milkColor = selectedMilk ? selectedMilk.colorHex : '#F4EFEB';
    baseLiquidGradient = `linear-gradient(180deg, #57331F 0%, #855536 45%, ${milkColor} 95%)`;
  }

  // Render Category-Specific Visualizer
  return (
    <div className="bg-[#1C1917] text-stone-100 rounded-2xl p-6 flex flex-col justify-between border border-stone-800 shadow-xl overflow-hidden relative min-h-[400px]">
      {/* Visualizer Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
        <div className="flex items-center gap-2 text-xs text-stone-400">
          {category === 'coffees' && <Coffee className="w-4 h-4 text-amber-400" />}
          {category === 'cookies' && <Cookie className="w-4 h-4 text-amber-400" />}
          {category === 'cakes' && <Cake className="w-4 h-4 text-amber-400" />}
          {category === 'ice_cream' && <IceCream className="w-4 h-4 text-amber-400" />}
          {category === 'milkshakes' && <GlassWater className="w-4 h-4 text-amber-400" />}

          <span className="font-semibold text-stone-200">Formulation Studio</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{category.replace('_', ' ')}</span>
        </div>

        <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          <span>Sweetness: {customization.sweetnessLevel}%</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative py-6 flex items-center justify-center flex-1">
        {/* Ambient Back Glow */}
        <div
          className="absolute w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-500"
          style={{
            backgroundColor: primaryFlavor ? primaryFlavor.colorHex : '#D97706',
          }}
        />

        {/* 1. COFFEES VISUALIZER */}
        {category === 'coffees' && (
          <div className="relative w-36 sm:w-40 flex flex-col items-center">
            {/* Cup Rim */}
            <div className="w-full h-3 bg-stone-700/80 rounded-t-full border border-stone-500/50 shadow-inner z-20" />

            {/* Cup Body */}
            <div
              className={`relative w-full overflow-hidden transition-all duration-500 border border-stone-700/80 shadow-2xl flex flex-col justify-end ${
                customization.size === 'small'
                  ? 'h-40 rounded-b-2xl'
                  : customization.size === 'regular'
                  ? 'h-48 rounded-b-2xl'
                  : 'h-56 rounded-b-2xl'
              }`}
              style={{ background: baseLiquidGradient }}
            >
              {/* Ice Layer */}
              {customization.temp === 'iced' && (
                <div className="absolute inset-0 pointer-events-none z-10 opacity-70">
                  <div className="absolute top-8 left-4 w-7 h-7 bg-white/20 rounded-md border border-white/40 rotate-12 backdrop-blur-xs" />
                  <div className="absolute top-16 right-5 w-8 h-8 bg-white/20 rounded-md border border-white/40 -rotate-6 backdrop-blur-xs" />
                  <div className="absolute top-26 left-6 w-6 h-6 bg-white/20 rounded-md border border-white/40 rotate-45 backdrop-blur-xs" />
                </div>
              )}

              {/* Flavor Syrup Swirl */}
              {primaryFlavor && totalFlavorPumps > 0 && (
                <div
                  className="w-full transition-all duration-500 z-10 opacity-90"
                  style={{
                    height: `${Math.min(totalFlavorPumps * 14, 45)}%`,
                    background: `linear-gradient(0deg, ${primaryFlavor.layerHex} 0%, transparent 100%)`,
                  }}
                />
              )}

              {/* Cold Foam Cap */}
              {selectedColdFoam && (
                <div
                  className="absolute top-0 left-0 right-0 h-10 border-b border-white/10 z-15 shadow-sm transition-all duration-300"
                  style={{
                    backgroundColor: selectedColdFoam.colorHex,
                    opacity: 0.95,
                  }}
                >
                  <div className="w-full h-1 bg-white/30" />
                </div>
              )}

              {/* Crema / Foam micro-surface */}
              {!selectedColdFoam && (
                <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-[#C49A6C]/80 to-transparent z-15" />
              )}
            </div>

            {/* Mug Handle (if hot) */}
            {customization.temp === 'hot' && (
              <div className="absolute top-10 -right-5 w-6 h-20 rounded-r-2xl border-4 border-stone-700 pointer-events-none" />
            )}
          </div>
        )}

        {/* 2. COOKIES VISUALIZER */}
        {category === 'cookies' && (
          <div className="relative flex flex-col items-center">
            {/* Ceramic Plate */}
            <div className="relative w-56 h-56 rounded-full bg-gradient-to-tr from-stone-800 to-stone-700 border-4 border-stone-600/80 shadow-2xl flex items-center justify-center p-4">
              {/* Cookie Disc */}
              <div
                className={`relative w-40 h-40 rounded-full shadow-inner flex items-center justify-center transition-all duration-300 ${
                  customization.cookieWarmth === 'warm-gooey'
                    ? 'border-2 border-amber-800 ring-4 ring-amber-500/20'
                    : 'border border-amber-900'
                }`}
                style={{
                  background:
                    itemName.toLowerCase().includes('red velvet')
                      ? 'radial-gradient(circle, #85222B 30%, #5E141B 80%)'
                      : itemName.toLowerCase().includes('pistachio')
                      ? 'radial-gradient(circle, #8F9D70 30%, #6E7C53 80%)'
                      : 'radial-gradient(circle, #B98655 20%, #87572E 80%)',
                }}
              >
                {/* Molten Chocolate Chunks */}
                <div className="absolute top-8 left-10 w-5 h-4 bg-[#23120B] rounded-full rotate-12 shadow-sm" />
                <div className="absolute bottom-10 right-9 w-6 h-5 bg-[#1F0E07] rounded-full -rotate-12 shadow-sm" />
                <div className="absolute top-16 right-11 w-4 h-4 bg-[#2B170E] rounded-full rotate-45 shadow-sm" />
                <div className="absolute bottom-12 left-11 w-4 h-3 bg-[#23120B] rounded-full rotate-30 shadow-sm" />

                {/* Flavor Drizzle Layer */}
                {hasGanache && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-28 h-1.5 bg-[#2B170E] rotate-45 rounded-full blur-[0.5px]" />
                    <div className="w-24 h-1.5 bg-[#2B170E] -rotate-30 rounded-full blur-[0.5px]" />
                  </div>
                )}
                {hasPistachio && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-28 h-1.5 bg-[#9CB982] rotate-12 rounded-full blur-[0.5px] opacity-90" />
                  </div>
                )}
                {hasCaramel && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-28 h-1.5 bg-[#D28C38] -rotate-45 rounded-full blur-[0.5px] opacity-90" />
                  </div>
                )}

                {/* Steam effect if warm */}
                {customization.cookieWarmth === 'warm-gooey' && (
                  <div className="absolute -top-4 text-[10px] text-amber-300 font-mono tracking-widest animate-pulse flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>FRESHLY WARMED</span>
                  </div>
                )}
              </div>

              {/* Side Dip Cup */}
              {customization.cookieDip && customization.cookieDip !== 'none' && (
                <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-stone-900 border-2 border-stone-600 shadow-xl flex items-center justify-center overflow-hidden">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-[9px] font-bold text-stone-900"
                    style={{
                      background:
                        customization.cookieDip === 'chantilly-cream'
                          ? '#FFFDF2'
                          : customization.cookieDip === 'espresso-shot'
                          ? '#2D160A'
                          : '#F9F5EC',
                      color: customization.cookieDip === 'espresso-shot' ? '#FAF5E8' : '#2D160A',
                    }}
                  >
                    {customization.cookieDip === 'espresso-shot' ? 'Espresso' : 'Dip'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. CAKES VISUALIZER */}
        {category === 'cakes' && (
          <div className="relative flex flex-col items-center">
            {/* Stoneware Plate */}
            <div className="relative w-56 h-56 rounded-full bg-stone-800 border-4 border-stone-700 shadow-2xl flex items-center justify-center">
              {/* Cake Wedge Shape */}
              <div
                className="relative w-36 h-28 clip-triangle shadow-2xl transition-all duration-300 flex items-center justify-center"
                style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  background:
                    itemName.toLowerCase().includes('cheesecake')
                      ? 'linear-gradient(180deg, #4A2B11 0%, #D49B45 25%, #FFF0C8 60%)'
                      : itemName.toLowerCase().includes('chocolate')
                      ? 'linear-gradient(180deg, #1C0F08 0%, #351C11 50%, #4D2B1A 100%)'
                      : itemName.toLowerCase().includes('lemon')
                      ? 'linear-gradient(180deg, #E6B52A 0%, #F5DE7A 50%, #FAF0BA 100%)'
                      : 'linear-gradient(180deg, #8B5A2B 0%, #D2A679 50%, #F4E4C1 100%)',
                }}
              >
                {/* Burnt Cheesecake Top Crust */}
                {itemName.toLowerCase().includes('cheesecake') && (
                  <div className="absolute top-0 left-0 right-0 h-4 bg-[#2D1606]/90 rounded-t" />
                )}
              </div>

              {/* Coulis Drizzle Accents */}
              {hasRaspberry && (
                <div className="absolute bottom-6 left-8 w-24 h-1.5 bg-[#C92A4D] rounded-full -rotate-12 blur-[0.5px] opacity-90" />
              )}
              {hasCaramel && (
                <div className="absolute bottom-8 right-8 w-20 h-1.5 bg-[#D28C38] rounded-full rotate-45 blur-[0.5px] opacity-90" />
              )}
              {hasGanache && (
                <div className="absolute bottom-10 left-10 w-24 h-1.5 bg-[#2B170E] rounded-full rotate-12 blur-[0.5px] opacity-90" />
              )}

              {/* Whipped Cream Accompaniment */}
              {customization.cakeCream && customization.cakeCream !== 'none' && (
                <div className="absolute top-8 right-6 w-10 h-10 rounded-full bg-[#FFFDF2] border border-amber-100 shadow-md flex items-center justify-center">
                  <div className="w-4 h-4 bg-amber-200/50 rounded-full blur-xs" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. ICE CREAM VISUALIZER */}
        {category === 'ice_cream' && (
          <div className="relative flex flex-col items-center">
            {customization.iceCreamFormat === 'waffle-cone' ? (
              /* Waffle Cone Mode */
              <div className="relative flex flex-col items-center">
                {/* Scoops Stack */}
                <div className="relative flex flex-col items-center -space-y-4 z-10">
                  {/* Scoop 1 */}
                  <div
                    className="w-24 h-24 rounded-full shadow-lg border border-amber-900/30 transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: hasPistachio
                        ? 'radial-gradient(circle, #A6BE8C 20%, #768F5B 90%)'
                        : hasGanache
                        ? 'radial-gradient(circle, #4A2616 20%, #261209 90%)'
                        : 'radial-gradient(circle, #FFF8E7 20%, #EBD8B2 90%)',
                    }}
                  >
                    {/* Texture specks */}
                    <div className="absolute top-4 left-6 w-1 h-1 bg-stone-900 rounded-full opacity-60" />
                    <div className="absolute bottom-6 right-7 w-1 h-1 bg-stone-900 rounded-full opacity-60" />
                  </div>

                  {/* Scoop 2 (if 2 or 3 scoops) */}
                  {(customization.iceCreamScoopCount ?? 2) >= 2 && (
                    <div
                      className="w-26 h-22 rounded-full shadow-lg border border-amber-900/30 relative overflow-hidden"
                      style={{
                        background:
                          itemName.toLowerCase().includes('pistachio')
                            ? 'radial-gradient(circle, #A6BE8C 20%, #768F5B 90%)'
                            : 'radial-gradient(circle, #E6AF65 20%, #B87928 90%)',
                      }}
                    />
                  )}
                </div>

                {/* Cone Body */}
                <div
                  className="w-24 h-36 bg-gradient-to-b from-[#B87A3E] to-[#7B4E22] -mt-3 shadow-xl flex items-center justify-center"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  }}
                >
                  {/* Waffle cross-hatch grid lines */}
                  <div className="w-full h-full opacity-30 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]" />
                </div>
              </div>
            ) : (
              /* Ceramic Bowl Mode */
              <div className="relative flex flex-col items-center">
                {/* Scoops in Bowl */}
                <div className="relative flex items-center justify-center -space-x-4 mb-[-28px] z-10">
                  <div
                    className="w-22 h-22 rounded-full shadow-lg border border-stone-800 relative"
                    style={{
                      background: hasPistachio
                        ? 'radial-gradient(circle, #A6BE8C 20%, #768F5B 90%)'
                        : 'radial-gradient(circle, #FFF8E7 20%, #EBD8B2 90%)',
                    }}
                  />
                  <div
                    className="w-24 h-24 rounded-full shadow-xl border border-stone-800 relative"
                    style={{
                      background: hasGanache
                        ? 'radial-gradient(circle, #4A2616 20%, #261209 90%)'
                        : 'radial-gradient(circle, #E6AF65 20%, #B87928 90%)',
                    }}
                  />
                </div>

                {/* Ceramic Stone Bowl */}
                <div className="w-48 h-24 bg-gradient-to-b from-stone-700 to-stone-900 rounded-b-full border-t-2 border-stone-600 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-stone-500/40" />
                </div>

                {/* Affogato Espresso Pour Indicator */}
                {hasAffogato && (
                  <div className="absolute -top-2 text-[10px] text-amber-300 font-mono tracking-widest bg-stone-900/90 px-2 py-0.5 rounded border border-amber-500/40 flex items-center gap-1 z-20">
                    <Droplet className="w-3 h-3 text-amber-400" />
                    <span>DOUBLE ESPRESSO AFFOGATO</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 5. MILKSHAKES VISUALIZER */}
        {category === 'milkshakes' && (
          <div className="relative w-36 sm:w-40 flex flex-col items-center">
            {/* Straw */}
            <div className="w-3 h-16 bg-rose-400 rotate-12 -mb-4 z-20 rounded-t border-r border-rose-600" />

            {/* Whipped Cream Mountain */}
            {customization.whippedCream !== false && (
              <div className="relative z-15 flex flex-col items-center">
                <div className="w-20 h-10 bg-[#FFFDF2] rounded-t-full shadow-md flex items-center justify-center">
                  <div className="w-3 h-3 bg-rose-500 rounded-full -mt-4 shadow-sm" />
                </div>
              </div>
            )}

            {/* Milkshake Fluted Glass */}
            <div
              className={`relative w-full rounded-b-3xl overflow-hidden border border-stone-600 shadow-2xl flex flex-col justify-end transition-all ${
                customization.shakeSize === 'large' ? 'h-52' : 'h-44'
              }`}
              style={{
                background:
                  itemName.toLowerCase().includes('chocolate')
                    ? 'linear-gradient(180deg, #4A2616 0%, #31180E 100%)'
                    : itemName.toLowerCase().includes('pistachio')
                    ? 'linear-gradient(180deg, #9AB583 0%, #6E8858 100%)'
                    : itemName.toLowerCase().includes('strawberry')
                    ? 'linear-gradient(180deg, #E68A97 0%, #C75B6B 100%)'
                    : 'linear-gradient(180deg, #D49E6A 0%, #A46F3C 100%)',
              }}
            >
              {/* Glass Ribs Highlight */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)]" />

              {/* Caramel / Fudge Drizzle Ribbon */}
              <div className="w-full h-8 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Glass Pedestal Base */}
            <div className="w-24 h-4 bg-stone-700 rounded-full border-t border-stone-500/50 -mt-1 shadow-md" />
          </div>
        )}
      </div>

      {/* Visualizer Footer: Active Infusions & Accents */}
      <div className="relative z-10 pt-4 border-t border-stone-800 text-xs">
        <div className="flex items-center justify-between text-stone-400 mb-2">
          <span>Active Flavors & Accents</span>
          <span className="font-mono text-amber-400">
            {customization.selectedFlavors.length + activeToppingObjects.length} Selected
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 min-h-[26px]">
          {customization.selectedFlavors.length === 0 && activeToppingObjects.length === 0 ? (
            <span className="text-stone-500 italic">No extra syrups or toppings active</span>
          ) : (
            <>
              {customization.selectedFlavors.map((item) => {
                const flv = flavors.find((f) => f.id === item.flavorId);
                if (!flv) return null;
                return (
                  <span
                    key={item.flavorId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-stone-800 text-stone-200 border border-stone-700"
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: flv.colorHex }}
                    />
                    <span>{flv.name}</span>
                    <span className="text-amber-400 font-mono">({item.pumps}x)</span>
                  </span>
                );
              })}

              {activeToppingObjects.map((top) => (
                <span
                  key={top.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950/40 text-amber-200 border border-amber-800/40"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>{top.name}</span>
                </span>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
