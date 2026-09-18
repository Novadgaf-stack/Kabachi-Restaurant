import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { CloseIcon } from './Icons';
import { formatNaira } from '../data/kabachi';
import { getPhotoById } from '../data/photos';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export function CartDrawer({ onNavigate }: CartDrawerProps) {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    isBelowMinOrder,
    minOrder,
    minOrderRemaining,
    addItem,
    decrementItem,
    removeItem,
    isStoreClosed,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity cursor-pointer"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-[#FAF9F6] shadow-2xl flex flex-col justify-between animate-drawer-in border-l border-[#E7E3DC]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#E7E3DC] flex items-center justify-between bg-white">
            <div>
              <span className="section-label text-[#9E090F] block">YOUR ORDER</span>
              <h3 id="cart-drawer-title" className="text-xl sm:text-2xl font-heading italic text-[#111111] mt-0.5">
                Selected Dishes
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#111111]/70 hover:text-[#9E090F] hover:bg-[#F4F1EC] rounded-full transition-colors focus-ring cursor-pointer"
              aria-label="Close cart"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Items or Empty State */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="text-base text-[#111111]/70">Your cart is currently empty.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('/menu');
                  }}
                  className="btn-primary py-3 px-6 text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-xs"
                >
                  Explore Chinese Menu
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-[#E7E3DC]">
                {items.map(({ item, quantity }) => {
                  const photo = getPhotoById(item.photoId);
                  return (
                    <li key={item.id} className="py-4 flex gap-4 items-start">
                      <img
                        src={photo.url}
                        alt={photo.alt}
                        className="w-16 h-16 object-cover rounded-[8px] bg-[#E7E3DC] flex-shrink-0 border border-[#E7E3DC]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-semibold text-[#111111] truncate">
                            {item.name}
                          </h4>
                          <span className="text-sm font-bold text-[#9E090F] tabular-nums whitespace-nowrap">
                            {formatNaira(item.price * quantity)}
                          </span>
                        </div>
                        <p className="text-xs text-[#111111]/60 tabular-nums mt-0.5">
                          {formatNaira(item.price)} each
                        </p>

                        {/* Stepper & remove */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[#D5D0C7] rounded-full bg-[#F4F1EC] p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => decrementItem(item.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold text-[#111111] hover:bg-white focus-ring cursor-pointer active:scale-95 transition-all"
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              −
                            </button>
                            <span className="px-2.5 text-xs font-bold tabular-nums text-[#111111]">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => addItem(item)}
                              className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold bg-[#9E090F] text-white hover:bg-[#85080D] focus-ring cursor-pointer active:scale-95 transition-all"
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-[#111111]/50 hover:text-[#9E090F] underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer with totals & constraints */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#F4F1EC] border-t border-[#E7E3DC] space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#111111]/80">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#111111] tabular-nums">
                    {formatNaira(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#111111]/60">
                  <span>Ikoyi District Delivery</span>
                  <span>Calculated dynamically at checkout</span>
                </div>
              </div>

              {/* Minimum order check */}
              {isBelowMinOrder && (
                <div className="p-3 bg-[#FFF3CD] border border-[#FFEBAA] text-xs text-[#856404] rounded-[6px]">
                  <strong>Minimum order is {formatNaira(minOrder)}.</strong> Add{' '}
                  <span className="font-semibold tabular-nums">{formatNaira(minOrderRemaining)}</span> more to place your order.
                </div>
              )}

              {/* Closed status alert */}
              {isStoreClosed && (
                <div className="p-3 bg-[#FAF9F6] border border-[#D5D0C7] text-xs text-[#111111] rounded-[6px]">
                  <span className="font-semibold text-[#9E090F]">Kitchen closed now:</span> Pre-order ready for tomorrow. You will send directly via WhatsApp to queue preparation.
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                disabled={items.length === 0}
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigate('/checkout');
                }}
                className="w-full btn-primary py-4 px-6 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{isStoreClosed ? 'Pre-order on WhatsApp' : 'Proceed to Checkout'}</span>
                <span className="tabular-nums font-bold">· {formatNaira(subtotal)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
