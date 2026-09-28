import React, { useState, useEffect } from 'react';
import {
  CafeCategory,
  CartItem,
  CustomizationSelection,
  DiningMode,
  MenuItem,
  Order,
  SavedRecipe,
} from './types/cafe';
import {
  COLD_FOAM_OPTIONS,
  FLAVOR_OPTIONS,
  FLAVOR_PAIRING_RECIPES,
  MENU_ITEMS,
  MILK_OPTIONS,
  ROAST_OPTIONS,
  TOPPING_OPTIONS,
} from './data/cafeData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FlavorWheelBar } from './components/FlavorWheelBar';
import { MenuCatalog } from './components/MenuCatalog';
import { FlavorCustomizerModal } from './components/FlavorCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { SavedCreationsModal } from './components/SavedCreationsModal';
import { Footer } from './components/Footer';

export default function App() {
  // Persistence for cart & saved recipes
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('latelier_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>(() => {
    try {
      const saved = localStorage.getItem('latelier_saved_recipes');
      if (saved) return JSON.parse(saved);
      // Pre-seed signature favorites
      return [
        {
          id: 'recipe-seed-1',
          name: "Guest Favorite: Pistachio & Vanilla Cortado",
          menuItemId: 'latte-pistachio-rosetta',
          customization: {
            sweetnessLevel: 50,
            selectedFlavors: [
              { flavorId: 'salted-pistachio', pumps: 2 },
              { flavorId: 'madagascar-vanilla', pumps: 1 },
            ],
            selectedToppings: ['smoked-maldon-salt'],
            size: 'regular',
            temp: 'hot',
            roastId: 'velvet-dusk',
            espressoShots: 2,
            milkId: 'oatly-barista',
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'recipe-seed-2',
          name: "Baker's Secret: Warm Sea Salt Ganache Cookie",
          menuItemId: 'cookie-dark-chocolate-sea-salt',
          customization: {
            sweetnessLevel: 50,
            cookieWarmth: 'warm-gooey',
            cookieDip: 'chantilly-cream',
            selectedFlavors: [{ flavorId: 'belgian-dark-mocha', pumps: 1 }],
            selectedToppings: ['smoked-maldon-salt'],
          },
          createdAt: new Date().toISOString(),
        },
      ];
    } catch {
      return [];
    }
  });

  // Active Modals & Customizer State
  const [customizerItem, setCustomizerItem] = useState<MenuItem | null>(null);
  const [initialFlavorForCustomizer, setInitialFlavorForCustomizer] = useState<string | undefined>();
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSavedOpen, setIsSavedOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Cart settings & Search
  const [diningMode, setDiningMode] = useState<DiningMode>('takeaway');
  const [pickupTime, setPickupTime] = useState<string>('ASAP (10–15 mins)');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('latelier_cart', JSON.stringify(cart));
    } catch {
      // storage unavailable
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('latelier_saved_recipes', JSON.stringify(savedRecipes));
    } catch {
      // storage unavailable
    }
  }, [savedRecipes]);

  // Build human-readable breakdown text for custom drink / pastry / gelato / shake
  const generateCustomSummary = (custom: CustomizationSelection, item: MenuItem): string[] => {
    const lines: string[] = [];

    // Coffees breakdown
    if (item.category === 'coffees') {
      if (custom.size && custom.temp) {
        lines.push(
          `${custom.size.toUpperCase()} (${custom.size === 'small' ? '8oz' : custom.size === 'regular' ? '12oz' : '16oz'}) · ${custom.temp.toUpperCase()}`
        );
      }
      const roast = ROAST_OPTIONS.find((r) => r.id === custom.roastId);
      if (custom.espressoShots && custom.espressoShots > 0) {
        lines.push(`${custom.espressoShots}x Shot (${roast?.name.split(' ')[0] || 'Espresso'})`);
      }
      const milk = MILK_OPTIONS.find((m) => m.id === custom.milkId);
      if (milk) {
        lines.push(`Base: ${milk.name}`);
      }
      if (custom.coldFoamId) {
        const cf = COLD_FOAM_OPTIONS.find((c) => c.id === custom.coldFoamId);
        if (cf) lines.push(`Cold Foam: ${cf.name}`);
      }
    }

    // Cookies breakdown
    if (item.category === 'cookies') {
      if (custom.cookieWarmth === 'warm-gooey') lines.push('Finish: Freshly Warmed & Gooey');
      if (custom.cookieWarmth === 'toasted-crisp') lines.push('Finish: Toasted Crispy Edge');
      if (custom.cookieWarmth === 'room-temp') lines.push('Finish: Ambient Soft-Baked');
      if (custom.cookieDip && custom.cookieDip !== 'none') {
        const dipName =
          custom.cookieDip === 'chantilly-cream'
            ? 'Vanilla Bean Chantilly Cream'
            : custom.cookieDip === 'espresso-shot'
            ? 'Hot Double Espresso Dip'
            : 'Madagascar Gelato Cup';
        lines.push(`Dip: ${dipName}`);
      }
    }

    // Cakes breakdown
    if (item.category === 'cakes') {
      if (custom.cakeStyle === 'double-taster') lines.push('Portion: Double Taster Duo');
      else if (custom.cakeStyle === 'slice-a-la-mode') lines.push('Portion: Slice à la Mode (+ Gelato)');
      else lines.push('Portion: Artisan Slice');

      if (custom.cakeDrizzle && custom.cakeDrizzle !== 'none') {
        lines.push(`Drizzle: ${custom.cakeDrizzle.replace(/-/g, ' ')}`);
      }
      if (custom.cakeCream && custom.cakeCream !== 'none') {
        lines.push(`Accompaniment: ${custom.cakeCream.replace(/-/g, ' ')}`);
      }
    }

    // Ice Cream breakdown
    if (item.category === 'ice_cream') {
      const format =
        custom.iceCreamFormat === 'waffle-cone'
          ? 'Handcrafted Waffle Cone'
          : custom.iceCreamFormat === 'brioche-sandwich'
          ? 'Warm Toasted Brioche'
          : 'Artisan Ceramic Cup';
      lines.push(`${format} (${custom.iceCreamScoopCount || 2} Scoops)`);

      if (custom.iceCreamSauce && custom.iceCreamSauce !== 'none') {
        lines.push(`Sauce: ${custom.iceCreamSauce.replace(/-/g, ' ')}`);
      }
    }

    // Milkshakes breakdown
    if (item.category === 'milkshakes') {
      lines.push(`Size: ${custom.shakeSize === 'large' ? 'Large 16oz' : 'Regular 12oz'}`);
      if (custom.shakeBase) {
        lines.push(`Base: ${custom.shakeBase.replace(/-/g, ' ')}`);
      }
      lines.push(custom.whippedCream !== false ? 'Topping: Piped Chantilly Cream' : 'No Whipped Cream');
    }

    // Flavors & Sweetness for all categories
    if (custom.selectedFlavors.length > 0) {
      const flavorStr = custom.selectedFlavors
        .map((sf) => {
          const f = FLAVOR_OPTIONS.find((opt) => opt.id === sf.flavorId);
          return `${sf.pumps}x ${f?.name || sf.flavorId}`;
        })
        .join(', ');
      lines.push(`Flavor Infusion: ${flavorStr} (${custom.sweetnessLevel}% sweetness)`);
    } else {
      lines.push(`Sweetness: ${custom.sweetnessLevel}%`);
    }

    // Toppings
    if (custom.selectedToppings.length > 0) {
      const tops = custom.selectedToppings
        .map((tId) => TOPPING_OPTIONS.find((t) => t.id === tId)?.name)
        .filter(Boolean)
        .join(', ');
      lines.push(`Toppings: ${tops}`);
    }

    // Special notes
    if (custom.specialNotes) {
      lines.push(`Note: "${custom.specialNotes}"`);
    }

    return lines;
  };

  // Add customized drink to cart
  const handleAddToCart = (
    item: MenuItem,
    customization: CustomizationSelection,
    unitPrice: number,
    quantity: number,
    savedTitle?: string
  ) => {
    const summary = generateCustomSummary(customization, item);
    const cartItemId = `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newCartItem: CartItem = {
      id: cartItemId,
      menuItem: item,
      customization,
      customSummaryText: summary,
      unitPrice,
      quantity,
      savedCustomName: savedTitle,
    };

    setCart((prev) => [...prev, newCartItem]);
    setIsCartOpen(true);
  };

  // Quick add without opening customizer
  const handleQuickAdd = (item: MenuItem) => {
    if (item.defaultCustomization) {
      handleAddToCart(item, item.defaultCustomization, item.basePrice, 1);
    } else {
      const fallbackCustom: CustomizationSelection = {
        sweetnessLevel: 50,
        selectedFlavors: [],
        selectedToppings: [],
      };
      handleAddToCart(item, fallbackCustom, item.basePrice, 1);
    }
  };

  // Save recipe to favorites
  const handleSaveRecipe = (
    name: string,
    menuItemId: string,
    customization: CustomizationSelection
  ) => {
    const newRecipe: SavedRecipe = {
      id: `recipe-${Date.now()}`,
      name,
      menuItemId,
      customization,
      createdAt: new Date().toISOString(),
    };
    setSavedRecipes((prev) => [newRecipe, ...prev]);
  };

  const handleDeleteSavedRecipe = (id: string) => {
    setSavedRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  // Update quantity in cart
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Open customizer with specific item
  const handleOpenCustomizer = (item: MenuItem) => {
    setInitialFlavorForCustomizer(undefined);
    setCustomizerItem(item);
  };

  // Open customizer from flavor wheel bar
  const handleCustomizeFromFlavorBar = (flavorId: string) => {
    setInitialFlavorForCustomizer(flavorId);
    setCustomizerItem(MENU_ITEMS[0]);
  };

  // Open customizer with a pre-curated pairing recipe
  const handleApplyRecipe = (recipe: typeof FLAVOR_PAIRING_RECIPES[0]) => {
    const baseItem = MENU_ITEMS.find((m) => m.id === recipe.baseItem) || MENU_ITEMS[0];
    const customizedBase: MenuItem = {
      ...baseItem,
      defaultCustomization: {
        ...baseItem.defaultCustomization,
        sweetnessLevel: 50,
        selectedFlavors: recipe.flavors,
        selectedToppings: recipe.toppings,
        milkId: (recipe as any).milk || baseItem.defaultCustomization?.milkId,
        coldFoamId: (recipe as any).coldFoam,
        temp: recipe.temp,
      },
    };
    setCustomizerItem(customizedBase);
  };

  // Open customizer from scratch
  const handleOpenCustomizerForNew = () => {
    setInitialFlavorForCustomizer(undefined);
    setCustomizerItem(MENU_ITEMS[0]);
  };

  // Smooth scroll
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Direct category selection from hero or header
  const handleSelectCategory = (category: CafeCategory) => {
    setSearchQuery(category);
    handleNavigateSection('menu');
  };

  // Order submission
  const handleOrderCompleted = (order: Order) => {
    setActiveOrder(order);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-200">
      {/* Top Bar */}
      <Header
        cart={cart}
        savedCount={savedRecipes.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenCustomizerForNew={handleOpenCustomizerForNew}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Campaign Section */}
        <HeroSection
          onExploreMenu={() => handleNavigateSection('menu')}
          onOpenCustomizer={handleOpenCustomizerForNew}
          onSelectCategory={handleSelectCategory}
        />

        {/* 2. Interactive Flavor Wheel & Pairing Lab */}
        <FlavorWheelBar
          onCustomizeFlavor={handleCustomizeFromFlavorBar}
          onApplyRecipe={handleApplyRecipe}
        />

        {/* 3. Cafe Menu Catalog (5 Specific Categories: Coffees, Cookies, Cakes, Ice Cream, Milkshakes) */}
        <MenuCatalog
          items={MENU_ITEMS}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCustomizeItem={handleOpenCustomizer}
          onQuickAddItem={handleQuickAdd}
          onOpenCustomizerForNew={handleOpenCustomizerForNew}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenCustomizerForNew={handleOpenCustomizerForNew}
      />

      {/* Customizer Modal */}
      <FlavorCustomizerModal
        isOpen={Boolean(customizerItem)}
        onClose={() => setCustomizerItem(null)}
        item={customizerItem}
        initialFlavorId={initialFlavorForCustomizer}
        onAddToCart={handleAddToCart}
        onSaveRecipe={handleSaveRecipe}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        diningMode={diningMode}
        onDiningModeChange={setDiningMode}
        pickupTime={pickupTime}
        onPickupTimeChange={setPickupTime}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onOpenCustomizerForNew={() => {
          setIsCartOpen(false);
          handleOpenCustomizerForNew();
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        diningMode={diningMode}
        pickupTime={pickupTime}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
        onReorder={(order) => {
          setCart(order.items);
          setActiveOrder(null);
          setIsCartOpen(true);
        }}
      />

      {/* Saved Creations Modal */}
      <SavedCreationsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedRecipes={savedRecipes}
        menuItems={MENU_ITEMS}
        onSelectRecipeForCustomization={(item, customization) => {
          const customItem: MenuItem = {
            ...item,
            defaultCustomization: customization,
          };
          setCustomizerItem(customItem);
        }}
        onDeleteRecipe={handleDeleteSavedRecipe}
        onOpenCustomizerForNew={() => {
          setIsSavedOpen(false);
          handleOpenCustomizerForNew();
        }}
      />
    </div>
  );
}
