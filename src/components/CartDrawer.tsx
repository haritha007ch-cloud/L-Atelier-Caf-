import React from 'react';
import { CartItem, DiningMode } from '../types/cafe';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Clock, Coffee, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  diningMode: DiningMode;
  onDiningModeChange: (mode: DiningMode) => void;
  pickupTime: string;
  onPickupTimeChange: (time: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onOpenCustomizerForNew: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  diningMode,
  onDiningModeChange,
  pickupTime,
  onPickupTimeChange,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onOpenCustomizerForNew,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-md sm:max-w-lg h-full shadow-2xl flex flex-col justify-between border-l border-stone-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-900" />
            <h2 className="font-display text-lg font-bold text-stone-900">
              Your Order Bag
            </h2>
            <span className="text-xs font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length > 0 ? (
            <>
              {/* Dining Mode Selector */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                  Order Mode
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'takeaway', label: 'Takeaway', icon: '🛍️' },
                    { id: 'dine-in', label: 'Dine-In Bar', icon: '☕' },
                    { id: 'curbside', label: 'Curbside', icon: '🚗' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => onDiningModeChange(mode.id as DiningMode)}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-medium cursor-pointer transition-all ${
                        diningMode === mode.id
                          ? 'bg-stone-900 text-white shadow-xs font-semibold'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="mr-1">{mode.icon}</span>
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup Time Slot */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Clock className="w-4 h-4 text-amber-800" />
                  <span className="font-semibold">Prep Schedule:</span>
                </div>
                <select
                  value={pickupTime}
                  onChange={(e) => onPickupTimeChange(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="ASAP (10–15 mins)">ASAP (10–15 mins)</option>
                  <option value="In 30 mins">In 30 mins</option>
                  <option value="In 45 mins">In 45 mins</option>
                  <option value="In 1 hour">In 1 hour</option>
                </select>
              </div>

              {/* Itemized List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Crafted Drinks & Items
                </span>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-100"
                        />
                        <div>
                          {item.savedCustomName ? (
                            <div className="flex items-center gap-1.5 text-[11px] text-amber-900 font-bold mb-0.5">
                              <Sparkles className="w-3 h-3" />
                              <span>{item.savedCustomName}</span>
                            </div>
                          ) : null}
                          <h4 className="font-semibold text-stone-900 text-sm leading-snug">
                            {item.menuItem.name}
                          </h4>
                          <span className="text-xs text-stone-500 font-mono tabular-nums">
                            ${item.unitPrice.toFixed(2)} each
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customization Details List */}
                    {item.customSummaryText.length > 0 && (
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 space-y-1 text-[11px] text-stone-600 leading-relaxed">
                        {item.customSummaryText.map((line, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-800 font-bold">·</span>
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stepper & Line Item Total */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-stone-100 px-2 py-1 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center rounded text-stone-700 hover:bg-stone-200 text-xs font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center rounded text-stone-700 hover:bg-stone-200 text-xs font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-display font-bold text-stone-900 text-sm tabular-nums">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Empty Cart */
            <div className="py-24 text-center">
              <div className="w-14 h-14 bg-stone-200/70 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-500">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-stone-800 mb-1">
                Your order bag is empty
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
                Discover our specialty espresso blends, hand-whisked Kyoto matchas, and steep custom flavor syrups.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenCustomizerForNew();
                }}
                className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
              >
                Craft Your First Custom Drink
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculations */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-stone-200/90 shadow-lg space-y-4 shrink-0">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Estimated Local Tax (8.25%)</span>
                <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between text-sm font-bold text-stone-900">
                <span className="font-display text-base">Total Due</span>
                <span className="font-display text-lg tabular-nums text-amber-950">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-stone-950 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Proceed to Barista Checkout</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
