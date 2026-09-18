import React, { useState, useMemo } from 'react';
import { MENU_ITEMS, CATEGORIES, formatNaira, MenuItem } from '../data/kabachi';
import { MenuItemCard } from '../components/MenuItemCard';
import { useCart } from '../context/CartContext';
import { SearchIcon, CartIcon } from '../components/Icons';

interface MenuPageProps {
  onNavigate: (path: string) => void;
}

export function MenuPage({ onNavigate }: MenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileGridExpanded, setIsMobileGridExpanded] = useState<boolean>(true);
  const { items, totalItemCount, subtotal, setIsCartOpen, isBelowMinOrder, minOrder, minOrderRemaining } = useCart();

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return MENU_ITEMS.length;
    return MENU_ITEMS.filter((i) => i.category === cat).length;
  };

  // Filter items by category and search query
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12 pb-32 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-3">
          <span className="section-label text-[#9E090F]">
            DIRECT ORDER MENU
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading text-[#111111] leading-tight">
            Chinese food fired fresh to order.
          </h1>
          <p className="text-sm sm:text-base text-[#111111]/70 max-w-2xl">
            Choose your dishes below. All orders dispatch straight from our Ikoyi kitchen with direct WhatsApp tracking.
          </p>
        </div>

        {/* Search input - luxury pill styling */}
        <div className="relative mb-8 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#111111]/50">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dim sum, fried rice, noodles..."
            className="w-full pl-11 pr-10 py-3 text-sm bg-white border border-[#D5D0C7] rounded-full text-[#111111] placeholder:text-[#111111]/45 focus-ring shadow-2xs"
            aria-label="Search menu items"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-[#111111]/50 hover:text-[#9E090F] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Responsive Mobile Categories Section (No horizontal overflow, accessible touch targets) */}
        <div className="lg:hidden mb-8 bg-white border border-[#E7E3DC] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E3DC]/80 gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="section-label text-[#9E090F]">MENU CATEGORIES</span>
              <span className="text-xs font-medium text-[#111111]/70">
                • {selectedCategory === 'All' ? `All Dishes (${MENU_ITEMS.length})` : `${selectedCategory} (${filteredItems.length})`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileGridExpanded((prev) => !prev)}
              className="text-xs font-semibold text-[#9E090F] hover:underline cursor-pointer shrink-0 py-1 px-1.5 focus-ring rounded"
              aria-expanded={isMobileGridExpanded}
              aria-label={isMobileGridExpanded ? 'Switch to compact category rail' : 'Show all categories in grid'}
            >
              {isMobileGridExpanded ? 'Compact rail' : 'View all categories'}
            </button>
          </div>

          {isMobileGridExpanded ? (
            /* Responsive Multi-Column Grid Mode: All categories immediately visible, zero hidden items */
            <div className="grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-4 gap-2 pt-3">
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className={`min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between border focus-ring active:scale-98 ${
                  selectedCategory === 'All'
                    ? 'bg-[#9E090F] text-white border-[#9E090F] shadow-xs'
                    : 'bg-[#FAF9F6] border-[#D5D0C7] text-[#111111] hover:border-[#9E090F]/50 hover:bg-[#F4F1EC]'
                }`}
                aria-pressed={selectedCategory === 'All'}
              >
                <span className="truncate">All Items</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ml-1.5 shrink-0 ${
                    selectedCategory === 'All'
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-white text-[#111111]/70 border border-[#E7E3DC]'
                  }`}
                >
                  {MENU_ITEMS.length}
                </span>
              </button>

              {CATEGORIES.map((cat) => {
                const count = getCategoryCount(cat);
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between border focus-ring active:scale-98 ${
                      isSelected
                        ? 'bg-[#9E090F] text-white border-[#9E090F] shadow-xs'
                        : 'bg-[#FAF9F6] border-[#D5D0C7] text-[#111111] hover:border-[#9E090F]/50 hover:bg-[#F4F1EC]'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span className="truncate">{cat}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ml-1.5 shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-white text-[#111111]/70 border border-[#E7E3DC]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Compact Horizontal Scroll Rail with accessible cues */
            <div className="pt-3">
              <div className="overflow-x-auto pb-1 flex items-center gap-2 scrollbar-none -mx-1 px-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`min-h-[44px] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 border focus-ring ${
                    selectedCategory === 'All'
                      ? 'bg-[#9E090F] text-white border-[#9E090F] shadow-xs'
                      : 'bg-[#FAF9F6] border-[#D5D0C7] text-[#111111] hover:bg-[#F4F1EC]'
                  }`}
                  aria-pressed={selectedCategory === 'All'}
                >
                  <span>All Items</span>
                  <span className="text-[11px] opacity-85 font-mono">({MENU_ITEMS.length})</span>
                </button>
                {CATEGORIES.map((cat) => {
                  const count = getCategoryCount(cat);
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`min-h-[44px] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 border focus-ring ${
                        isSelected
                          ? 'bg-[#9E090F] text-white border-[#9E090F] shadow-xs'
                          : 'bg-[#FAF9F6] border-[#D5D0C7] text-[#111111] hover:bg-[#F4F1EC]'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span>{cat}</span>
                      <span className="text-[11px] opacity-85 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-[#111111]/45 pt-1.5 text-right sm:hidden">
                Swipe horizontally for more categories →
              </p>
            </div>
          )}
        </div>

        {/* Desktop Layout: Left Rail + Grid + Right Cart Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Rail: Categories */}
          <aside className="hidden lg:block lg:col-span-2 sticky top-28 space-y-1">
            <span className="section-label text-[#111111]/60 block mb-3 px-3">
              CATEGORIES
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`w-full text-left px-3.5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
                selectedCategory === 'All'
                  ? 'bg-[#9E090F] text-white font-bold shadow-xs'
                  : 'text-[#111111]/80 hover:bg-[#F4F1EC]'
              }`}
            >
              <span>All Items</span>
              <span className="text-[11px] opacity-80 tabular-nums">
                {MENU_ITEMS.length}
              </span>
            </button>
            {CATEGORIES.map((cat) => {
              const count = MENU_ITEMS.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-[#9E090F] text-white font-bold shadow-xs'
                      : 'text-[#111111]/80 hover:bg-[#F4F1EC]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[11px] opacity-80 tabular-nums">{count}</span>
                </button>
              );
            })}
          </aside>

          {/* Center Column: Dishes Grid */}
          <main className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between text-xs text-[#111111]/60 pb-2 border-b border-[#E7E3DC]">
              <span>
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
                {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              </span>
              {searchQuery && (
                <span>
                  Filter: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white border border-[#E7E3DC] p-12 text-center rounded-[10px] space-y-3 elevation-card">
                <p className="text-base text-[#111111] font-semibold">
                  No dishes found matching your search.
                </p>
                <p className="text-xs text-[#111111]/60">
                  Try searching for ingredients like shrimp, noodles, or spring rolls.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="btn-secondary px-5 py-2 text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </main>

          {/* Desktop Right Column: Sticky Cart Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-white border border-[#E7E3DC] rounded-[10px] p-5 elevation-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E3DC]">
              <span className="section-label text-[#111111]/80">YOUR SELECTION</span>
              <span className="text-xs font-bold text-[#9E090F] tabular-nums">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-[#111111]/60 text-xs">
                <p>Your cart is empty.</p>
                <p className="text-[11px] text-[#111111]/50">
                  Click &ldquo;+ Add to order&rdquo; on any dish to begin.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <ul className="divide-y divide-[#E7E3DC] max-h-64 overflow-y-auto pr-1">
                  {items.map(({ item, quantity }) => (
                    <li key={item.id} className="py-2.5 flex justify-between items-start text-xs">
                      <div>
                        <p className="font-semibold text-[#111111]">{item.name}</p>
                        <p className="text-[#111111]/60 tabular-nums">
                          {quantity} × {formatNaira(item.price)}
                        </p>
                      </div>
                      <span className="font-bold text-[#9E090F] tabular-nums whitespace-nowrap">
                        {formatNaira(item.price * quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-[#E7E3DC] space-y-2.5">
                  <div className="flex justify-between text-xs text-[#111111]/80">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#111111] tabular-nums">
                      {formatNaira(subtotal)}
                    </span>
                  </div>

                  {isBelowMinOrder && (
                    <div className="p-2.5 bg-[#FFF3CD] border border-[#FFEBAA] text-[11px] text-[#856404] rounded-[6px] leading-tight">
                      Min order {formatNaira(minOrder)}. Add{' '}
                      <span className="font-bold">{formatNaira(minOrderRemaining)}</span> more.
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={items.length === 0}
                    onClick={() => onNavigate('/checkout')}
                    className="w-full btn-primary py-3.5 px-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Proceed to Checkout</span>
                    <span className="tabular-nums font-bold">· {formatNaira(subtotal)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="w-full text-center text-[11px] text-[#111111]/60 hover:text-[#9E090F] underline cursor-pointer pt-0.5"
                  >
                    View drawer details
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile Floating Bottom Action Pill (CarlyFresh style luxury float) */}
      {totalItemCount > 0 && (
        <div className="lg:hidden fixed bottom-5 inset-x-4 z-30 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full btn-primary py-4 px-5 text-sm font-semibold uppercase tracking-wider flex items-center justify-between cursor-pointer shadow-2xl ring-2 ring-white/20"
          >
            <div className="flex items-center gap-2.5">
              <CartIcon className="w-5 h-5 text-white" />
              <span>View cart ({totalItemCount})</span>
            </div>
            <span className="tabular-nums font-bold">{formatNaira(subtotal)} →</span>
          </button>
        </div>
      )}
    </div>
  );
}
