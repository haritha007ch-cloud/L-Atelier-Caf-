import React, { useState } from 'react';
import { CartItem, DiningMode, Order } from '../types/cafe';
import { X, CreditCard, ShieldCheck, CheckCircle2, Clock, MapPin, Coffee } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  diningMode: DiningMode;
  pickupTime: string;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  diningMode,
  pickupTime,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('Marie Dubois');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 438-9201');
  const [customerEmail, setCustomerEmail] = useState('marie.dubois@atelier.com');
  const [tableNumber, setTableNumber] = useState('Table 4 (Garden Terrace)');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'counter'>('apple_pay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = Math.floor(100 + Math.random() * 900);
      const newOrder: Order = {
        id: `LATELIER-${orderNumber}`,
        items: [...cart],
        subtotal,
        tax,
        total,
        diningMode,
        tableNumber: diningMode === 'dine-in' ? tableNumber : undefined,
        pickupTime,
        customerName: customerName || 'Valued Guest',
        customerPhone: customerPhone || '555-0199',
        customerEmail: customerEmail || 'guest@latelier.com',
        status: 'placed',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedMinutes: 12,
      };

      setIsSubmitting(false);
      onOrderCompleted(newOrder);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-amber-900" />
            <h2 className="font-display text-lg font-bold text-stone-900">
              Confirm Barista Order
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Order Summary Snapshot */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
              <span className="font-semibold text-stone-900">
                {cart.reduce((s, i) => s + i.quantity, 0)} Items Selected
              </span>
              <span className="font-mono font-bold text-amber-950 tabular-nums">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-stone-600 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                <span>Ready: {pickupTime}</span>
              </span>
              <span className="capitalize font-medium text-stone-800">
                Mode: {diningMode}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Customer Details
            </span>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Mobile (For SMS notification)
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email (Receipt)
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {diningMode === 'dine-in' && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Table Number or Seating Area
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. Table 4 or Bar Seat"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Payment Choice
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'apple_pay', label: 'Apple / Pay', icon: '' },
                { id: 'card', label: 'Credit Card', icon: '💳' },
                { id: 'counter', label: 'Pay at Barista', icon: '☕' },
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as any)}
                  className={`p-3 text-center rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    paymentMethod === pm.id
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs font-semibold'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="block text-sm mb-1">{pm.icon}</span>
                  <span className="block text-[11px] truncate">{pm.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Contactless encrypted authorization. No fees.</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-stone-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-stone-950 hover:bg-stone-800 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              {isSubmitting ? (
                <span>Authorizing Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Transmit Order to Barista (${total.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
