export type CafeCategory = 'coffees' | 'cookies' | 'cakes' | 'ice_cream' | 'milkshakes';

export type BeverageTemp = 'hot' | 'iced' | 'nitro';
export type BeverageSize = 'small' | 'regular' | 'large';

export type CookieWarmth = 'warm-gooey' | 'toasted-crisp' | 'room-temp';
export type IceCreamFormat = 'waffle-cone' | 'ceramic-cup' | 'brioche-sandwich';
export type CakeServingStyle = 'artisan-slice' | 'double-taster' | 'slice-a-la-mode';

export interface FlavorOption {
  id: string;
  name: string;
  frenchName?: string;
  description: string;
  category: 'sweet' | 'nutty' | 'botanical' | 'spiced' | 'cacao' | 'fruity';
  pricePerPump: number;
  colorHex: string;
  layerHex: string;
  isSugarFree?: boolean;
  notes: string;
  pairWellWith: string[];
}

export interface MilkOption {
  id: string;
  name: string;
  description: string;
  extraCost: number;
  colorHex: string;
  dairyFree: boolean;
}

export interface RoastOption {
  id: string;
  name: string;
  origin: string;
  profile: string;
  extraCost: number;
  caffeine: 'regular' | 'high' | 'decaf';
}

export interface ToppingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  visualColor: string;
}

export interface ColdFoamOption {
  id: string;
  name: string;
  description: string;
  price: number;
  colorHex: string;
}

export interface CustomizationSelection {
  // Common
  sweetnessLevel: number; // 0, 25, 50, 75, 100
  selectedFlavors: {
    flavorId: string;
    pumps: number;
  }[];
  selectedToppings: string[];
  specialNotes?: string;

  // Beverage / Coffee specific
  size?: BeverageSize;
  temp?: BeverageTemp;
  roastId?: string;
  espressoShots?: number;
  milkId?: string;
  coldFoamId?: string;
  iceLevel?: 'none' | 'light' | 'regular' | 'extra';

  // Cookie specific
  cookieWarmth?: CookieWarmth;
  cookieDip?: 'none' | 'chantilly-cream' | 'espresso-shot' | 'vanilla-softserve';

  // Cake specific
  cakeStyle?: CakeServingStyle;
  cakeDrizzle?: 'none' | 'belgian-dark-ganache' | 'wild-raspberry-coulis' | 'salted-caramel' | 'pistachio-crema';
  cakeCream?: 'none' | 'vanilla-chantilly' | 'mascarpone-quenelle' | 'vegan-coconut';

  // Ice Cream specific
  iceCreamFormat?: IceCreamFormat;
  iceCreamScoopCount?: 1 | 2 | 3;
  iceCreamFlavors?: string[];
  iceCreamSauce?: 'none' | 'warm-hot-fudge' | 'salted-caramel-dulce' | 'pistachio-butter' | 'affogato-espresso-shot';

  // Milkshake specific
  shakeSize?: 'regular' | 'large';
  shakeBase?: 'whole-gelato' | 'oat-vegan-gelato' | 'high-protein';
  whippedCream?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  frenchSubName: string;
  description: string;
  basePrice: number;
  category: CafeCategory;
  image: string;
  tags: string[];
  flavorNotes: string[];
  dietary: ('dairy-free-opt' | 'gluten-free' | 'vegan' | 'decaf-opt' | 'organic' | 'nut-free-opt')[];
  isCustomizable: boolean;
  defaultCustomization?: CustomizationSelection;
  caloriesApprox: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  customization: CustomizationSelection;
  customSummaryText: string[];
  unitPrice: number;
  quantity: number;
  savedCustomName?: string;
}

export type DiningMode = 'takeaway' | 'dine-in' | 'curbside';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  diningMode: DiningMode;
  tableNumber?: string;
  pickupTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: 'placed' | 'crafting' | 'ready' | 'completed';
  createdAt: string;
  estimatedMinutes: number;
}

export interface SavedRecipe {
  id: string;
  name: string;
  menuItemId: string;
  customization: CustomizationSelection;
  createdAt: string;
}
