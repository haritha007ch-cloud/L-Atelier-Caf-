import React, { useState, useEffect } from 'react';
import { Order } from '../types/cafe';
import { CheckCircle2, Clock, Coffee, Sparkles, MapPin, X, ArrowRight } from 'lucide-react';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
  onReorder: (order: Order) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  onClose,
  onReorder,
}) => {
  if (!order) return null;

  // Real-time simulated barista state progression
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 3500);
    const timer2 = setTimeout(() => setCurrentStep(3), 8000);
    const timer3 = setTimeout(() => setCurrentStep(4), 14000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const steps = [
    {
      num: 1,
      title: 'Order Transmitted',
      subtitle: 'Barista ticket printed at espresso bar',
      time: order.createdAt,
    },
    {
      num: 2,
      title: 'Dialing Extraction',
      subtitle: 'Grinding single-origin roast & calibrating yield',
      time: 'In Progress',
    },
    {
      num: 3,
      title: 'Infusing Artisanal Flavors',
      subtitle: 'Steeping custom syrups, texturing milk & cold foam',
      time: 'Crafting',
    },
    {
      num: 4,
      title: 'Ready for Collection',
      subtitle: `Waiting at pickup bar for ${order.customerName}`,
      time: 'Ready!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-900 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Barista Station</span>
            </div>
            <h2 className="font-display text-xl font-bold text-stone-900">
              Order #{order.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracker Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Banner */}
          <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">
                Status Update
              </span>
              <span className="text-xs font-mono bg-stone-800 px-2 py-0.5 rounded text-stone-300">
                Est. ~{order.estimatedMinutes} mins
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Coffee className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  {currentStep === 4
                    ? 'Your drink is ready at the counter!'
                    : currentStep === 3
                    ? 'Steeping your custom flavors...'
                    : currentStep === 2
                    ? 'Pulling espresso shots...'
                    : 'Order queued with our head barista.'}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Scheduled Pickup: <strong className="text-stone-200">{order.pickupTime}</strong> · Mode: <strong className="capitalize text-stone-200">{order.diningMode}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-3">
              Live Progress
            </span>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
              {steps.map((st) => {
                const isPassed = currentStep >= st.num;
                const isCurrent = currentStep === st.num;
                return (
                  <div key={st.num} className="relative flex items-start gap-4 pl-1">
                    <div
                      className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-amber-900 text-white ring-4 ring-amber-100'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{st.num}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <h4
                          className={`font-semibold ${
                            isCurrent
                              ? 'text-amber-950 font-bold'
                              : isPassed
                              ? 'text-stone-900'
                              : 'text-stone-400'
                          }`}
                        >
                          {st.title}
                        </h4>
                        <span className="text-[11px] font-mono text-stone-400">
                          {st.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {st.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Itemized Order Summary */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Itemized Customizations
            </span>
            <div className="divide-y divide-stone-100 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 space-y-1">
                  <div className="flex justify-between font-semibold text-stone-900">
                    <span>
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="font-mono tabular-nums">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  {item.customSummaryText.length > 0 && (
                    <div className="text-[11px] text-stone-500 pl-3 border-l-2 border-amber-200 space-y-0.5">
                      {item.customSummaryText.map((t, tidx) => (
                        <div key={tidx}>{t}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-between text-sm font-bold text-stone-900">
              <span>Total Paid</span>
              <span className="font-display font-bold text-amber-950 tabular-nums">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Pickup Barcode / Code Card */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-900 block mb-1">
              Barista Pickup Code
            </span>
            <div className="font-mono font-bold text-2xl tracking-widest text-stone-900 my-1">
              {order.id.replace('LATELIER-', 'BAR-')}
            </div>
            <p className="text-[11px] text-amber-800">
              Present this code at the bar or say &ldquo;{order.customerName}&rdquo;
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl transition-colors cursor-pointer"
          >
            Keep Exploring Menu
          </button>
          <button
            onClick={() => onReorder(order)}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-300" />
            <span>Re-order Custom Formula</span>
          </button>
        </div>
      </div>
    </div>
  );
};
