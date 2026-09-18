import React from 'react';
import { MENU_ITEMS, CATEGORIES, formatNaira, MenuItem } from '../data/kabachi';
import { getPhotoById } from '../data/photos';
import { useCart } from '../context/CartContext';

interface NavMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export function NavMenuDropdown({ isOpen, onClose, onNavigate }: NavMenuDropdownProps) {
  const { addItem } = useCart();
  const popularDishes = MENU_ITEMS.filter((i) => i.isPopular).slice(0, 3);

  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-1/2 -translate-x-1/2 w-[680px] bg-[#FAF9F6] border border-[#E7E3DC] rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Left column: Categories & Order overview */}
        <div className="col-span-5 border-r border-[#E7E3DC] pr-5 space-y-4">
          <div>
            <span className="section-label text-[#9E090F]">KABACHI CUISINE</span>
            <h3 className="font-heading text-lg text-[#111111] mt-1">
              Authentic Chinese Wok Menu
            </h3>
            <p className="text-xs text-[#111111]/70 mt-1 leading-relaxed">
              Every dish is cooked fresh to order in our Ikoyi kitchen with traditional Cantonese seasoning.
            </p>
          </div>

          <div className="space-y-1 pt-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#111111]/50">
              Browse Categories:
            </p>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('/menu');
                  }}
                  className="text-left text-xs font-semibold text-[#111111]/80 hover:text-[#9E090F] hover:bg-[#F4F1EC] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{category}</span>
                  <span className="text-[10px] text-[#111111]/40">→</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E7E3DC]/80">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate('/menu');
              }}
              className="w-full btn-primary py-2.5 text-xs uppercase tracking-wider font-semibold justify-center"
            >
              Open Full Direct Menu →
            </button>
          </div>
        </div>

        {/* Right column: Popular Highlights */}
        <div className="col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#111111]/60">
              Chef&apos;s Popular Dishes
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate('/menu');
              }}
              className="text-xs text-[#9E090F] font-semibold hover:underline cursor-pointer"
            >
              See all 12 items
            </button>
          </div>

          <div className="space-y-2.5">
            {popularDishes.map((dish) => {
              const photo = getPhotoById(dish.photoId);
              return (
                <div
                  key={dish.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-[#E7E3DC]/70 hover:border-[#9E090F]/40 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#E7E3DC]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#111111] group-hover:text-[#9E090F] transition-colors truncate">
                        {dish.name}
                      </p>
                      <p className="text-[11px] text-[#111111]/60 truncate">
                        {dish.description}
                      </p>
                      <p className="text-xs font-bold text-[#9E090F] mt-0.5">
                        {formatNaira(dish.price)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(dish);
                    }}
                    className="shrink-0 text-xs px-2.5 py-1.5 bg-[#FAF9F6] border border-[#D5D0C7] text-[#111111] rounded-full font-semibold hover:border-[#9E090F] hover:text-[#9E090F] hover:bg-white transition-all cursor-pointer"
                    title={`Add ${dish.name} to order`}
                  >
                    + Add
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[#111111]/60 bg-[#F4F1EC] p-2.5 rounded-lg border border-[#E7E3DC]">
            <span>🛵 Ikoyi, VI & Lekki Delivery</span>
            <span className="font-semibold text-[#9E090F]">₦5,000 Min. Order</span>
          </div>
        </div>
      </div>
    </div>
  );
}
