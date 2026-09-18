import React from 'react';
import { MenuItem, formatNaira } from '../data/kabachi';
import { getPhotoById } from '../data/photos';
import { useCart } from '../context/CartContext';
import { LazyImage } from './LazyImage';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { getItemQuantity, addItem, decrementItem } = useCart();
  const quantity = getItemQuantity(item.id);
  const photo = getPhotoById(item.photoId);

  return (
    <article
      className="group relative bg-[#FAF9F6] border border-[#E7E3DC] rounded-[10px] overflow-hidden elevation-card flex flex-col justify-between transition-all duration-200"
      aria-labelledby={`item-title-${item.id}`}
    >
      <div>
        {/* Photo with hover scale 1.035 over 260ms, skeleton placeholder */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#E7E3DC]">
          <LazyImage
            src={photo.url}
            alt={photo.alt}
            aspectRatio="aspect-[4/3]"
            hoverScale={true}
          />
          {item.isPopular && (
            <span className="absolute top-3 left-3 bg-[#FAF9F6]/95 border border-[#E7E3DC] text-[#9E090F] section-label px-2.5 py-1 rounded-full shadow-xs text-[10px]">
              POPULAR
            </span>
          )}
          {item.soldOut && (
            <div className="absolute inset-0 bg-[#111111]/65 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-white text-[#111111] section-label px-3.5 py-1.5 rounded-full font-semibold">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Dish Details */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              id={`item-title-${item.id}`}
              className="text-base sm:text-lg font-semibold text-[#111111] leading-snug"
            >
              {item.name}
            </h3>
            <span className="text-base font-bold text-[#9E090F] tabular-nums whitespace-nowrap">
              {formatNaira(item.price)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#111111]/70 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>

      {/* Luxury Action / Stepper */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 mt-auto">
        {item.soldOut ? (
          <div className="w-full py-2.5 px-3 text-xs uppercase tracking-wider text-[#111111]/40 border border-[#D5D0C7] rounded-full text-center bg-[#F4F1EC] font-medium">
            Currently Unavailable
          </div>
        ) : quantity === 0 ? (
          <button
            type="button"
            onClick={() => addItem(item)}
            className="w-full btn-primary py-2.5 px-4 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
            aria-label={`Add ${item.name} to cart for ${formatNaira(item.price)}`}
          >
            <span className="text-sm leading-none font-bold">+</span>
            <span>Add to order</span>
          </button>
        ) : (
          <div className="w-full flex items-center justify-between bg-[#F4F1EC] border border-[#D5D0C7] rounded-full p-1 shadow-xs">
            <button
              type="button"
              onClick={() => decrementItem(item.id)}
              className="w-9 h-8 flex items-center justify-center text-[#111111] hover:bg-white rounded-full text-base font-bold transition-all focus-ring cursor-pointer active:scale-95 shadow-2xs"
              aria-label={`Decrease ${item.name} count`}
            >
              −
            </button>
            <span className="text-xs font-bold tabular-nums text-[#111111] px-2">
              {quantity} in cart
            </span>
            <button
              type="button"
              onClick={() => addItem(item)}
              className="w-9 h-8 flex items-center justify-center bg-[#9E090F] text-white hover:bg-[#85080D] rounded-full text-base font-bold transition-all focus-ring cursor-pointer active:scale-95 shadow-xs"
              aria-label={`Increase ${item.name} count`}
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
