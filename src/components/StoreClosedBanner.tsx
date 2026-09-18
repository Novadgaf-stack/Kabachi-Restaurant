import React from 'react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/kabachi';

export function StoreClosedBanner() {
  const { isStoreClosed, setIsStoreClosed, storeStatus } = useCart();

  if (!isStoreClosed) {
    return null;
  }

  return (
    <div
      role="alert"
      className="bg-[#FFF8E6] border-b border-[#E8DFC8] py-2.5 px-4 text-sm text-[#111111] transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start sm:items-center gap-2.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#B8090F] shrink-0 mt-1 sm:mt-0" aria-hidden="true" />
          <p className="font-medium text-[13px] leading-snug">
            Kitchen is currently closed (Lagos Time: {storeStatus.lagosTimeString} WAT). Hours: {RESTAURANT_INFO.hours}.
            <span className="text-[#111111]/70 font-normal ml-1.5 block sm:inline">
              Orders placed now will be received as priority pre-orders for {storeStatus.nextActionText.toLowerCase()}.
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsStoreClosed(false)}
          className="text-xs text-[#B8090F] hover:underline self-start sm:self-auto cursor-pointer font-medium shrink-0"
          title="Switch back to Open status for live demo"
        >
          [Demo: Switch to Open]
        </button>
      </div>
    </div>
  );
}
