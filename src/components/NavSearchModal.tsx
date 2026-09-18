import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MENU_ITEMS, CATEGORIES, formatNaira, MenuItem } from '../data/kabachi';
import { getPhotoById } from '../data/photos';
import { useCart } from '../context/CartContext';
import { SearchIcon, CloseIcon, CartIcon } from './Icons';

interface NavSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export function NavSearchModal({ isOpen, onClose, onNavigate }: NavSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem, setIsCartOpen } = useCart();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedCategory('All');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter items
  const filteredDishes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  const handleAddToCart = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addItem(item);
    setAddedItemId(item.id);
    setTimeout(() => {
      setAddedItemId((prev) => (prev === item.id ? null : prev));
    }, 1400);
  };

  const handleSelectDish = (item: MenuItem) => {
    onClose();
    onNavigate('/menu');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 sm:px-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search Kabachi Dishes"
    >
      <div
        className="w-full max-w-2xl bg-[#FAF9F6] rounded-2xl shadow-2xl border border-[#E7E3DC] overflow-hidden flex flex-col max-h-[85vh] transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E7E3DC] bg-white flex items-center gap-3">
          <SearchIcon className="w-5 h-5 text-[#9E090F] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dim sum, fried rice, noodles, beef, chicken..."
            className="flex-1 bg-transparent text-[#111111] text-base placeholder:text-[#111111]/45 focus:outline-none font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#111111]/50 hover:text-[#111111] hover:bg-[#F4F1EC] transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-wider font-semibold text-[#111111]/60 hover:text-[#9E090F] px-2.5 py-1 rounded-md hover:bg-[#F4F1EC] transition-colors cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Category Pills & Quick Filter Bar */}
        <div className="px-4 py-2.5 bg-[#FAF9F6] border-b border-[#E7E3DC] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#111111]/50 shrink-0 mr-1">
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`text-xs px-3 py-1 rounded-full transition-all cursor-pointer shrink-0 font-medium ${
              selectedCategory === 'All'
                ? 'bg-[#9E090F] text-white shadow-xs'
                : 'bg-[#F4F1EC] text-[#111111]/80 hover:bg-[#E7E3DC]'
            }`}
          >
            All Dishes ({MENU_ITEMS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full transition-all cursor-pointer shrink-0 font-medium ${
                selectedCategory === cat
                  ? 'bg-[#9E090F] text-white shadow-xs'
                  : 'bg-[#F4F1EC] text-[#111111]/80 hover:bg-[#E7E3DC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-[#E7E3DC]/60">
          {filteredDishes.length > 0 ? (
            filteredDishes.map((item) => {
              const photo = getPhotoById(item.photoId);
              const isAdded = addedItemId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectDish(item)}
                  className="group flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-white transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0 border border-[#E7E3DC]"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-bold text-[#111111] group-hover:text-[#9E090F] transition-colors truncate">
                          {item.name}
                        </h4>
                        {item.isPopular && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#9E090F]/10 text-[#9E090F] px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                        <span className="text-[11px] text-[#111111]/50 font-medium">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#111111]/70 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-[#9E090F] mt-1">
                        {formatNaira(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, item)}
                      className={`text-xs px-3.5 py-2 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                        isAdded
                          ? 'bg-[#15803D] text-white'
                          : 'bg-[#FAF9F6] border border-[#D5D0C7] text-[#111111] hover:border-[#9E090F] hover:text-[#9E090F] hover:bg-white'
                      }`}
                      title={`Add ${item.name} to cart`}
                    >
                      {isAdded ? (
                        <>
                          <span>Added</span>
                          <span>✓</span>
                        </>
                      ) : (
                        <>
                          <span>+ Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm font-semibold text-[#111111]">
                No dishes matching &quot;{query}&quot; in {selectedCategory}
              </p>
              <p className="text-xs text-[#111111]/60">
                Try searching for fried rice, noodles, dim sum, chicken, or prawns.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs text-[#9E090F] font-semibold underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#F4F1EC] border-t border-[#E7E3DC] flex items-center justify-between text-xs text-[#111111]/70 px-4">
          <span className="hidden sm:inline">
            Direct delivery to Ikoyi, VI, & Lekki • ₦5,000 Minimum
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('/menu');
            }}
            className="text-xs font-semibold text-[#9E090F] hover:underline cursor-pointer ml-auto"
          >
            Explore Full Menu Page →
          </button>
        </div>
      </div>
    </div>
  );
}
