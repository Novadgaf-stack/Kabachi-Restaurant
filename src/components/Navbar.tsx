import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import {
  CartIcon,
  MenuIcon,
  CloseIcon,
  PhoneIcon,
  WhatsAppIcon,
  SearchIcon,
  ChevronIcon,
} from './Icons';
import { RESTAURANT_INFO, formatNaira } from '../data/kabachi';
import { NavSearchModal } from './NavSearchModal';
import { NavMenuDropdown } from './NavMenuDropdown';
import { NavLocationPopover } from './NavLocationPopover';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const {
    totalItemCount,
    subtotal,
    isBadgeAnimating,
    setIsCartOpen,
    isStoreClosed,
    setIsStoreClosed,
    storeStatus,
  } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);

  const menuDropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const locationPopoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsMenuDropdownOpen(false);
        setIsLocationPopoverOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNav = (path: string) => {
    setIsMobileMenuOpen(false);
    setIsMenuDropdownOpen(false);
    setIsLocationPopoverOpen(false);
    onNavigate(path);
  };

  const handleScrollToAnchor = (anchorId: string) => {
    setIsMobileMenuOpen(false);
    setIsMenuDropdownOpen(false);
    setIsLocationPopoverOpen(false);

    if (currentPath !== '/') {
      handleNav(`/#${anchorId}`);
    } else {
      const el = document.getElementById(anchorId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Hover handlers with debounce for desktop popovers
  const handleMenuMouseEnter = () => {
    if (menuDropdownTimerRef.current) clearTimeout(menuDropdownTimerRef.current);
    setIsMenuDropdownOpen(true);
  };

  const handleMenuMouseLeave = () => {
    menuDropdownTimerRef.current = setTimeout(() => {
      setIsMenuDropdownOpen(false);
    }, 180);
  };

  const handleLocationMouseEnter = () => {
    if (locationPopoverTimerRef.current) clearTimeout(locationPopoverTimerRef.current);
    setIsLocationPopoverOpen(true);
  };

  const handleLocationMouseLeave = () => {
    locationPopoverTimerRef.current = setTimeout(() => {
      setIsLocationPopoverOpen(false);
    }, 180);
  };

  return (
    <header className="sticky top-0 z-40 select-none">
      {/* 1. Top Announcement & Utility Bar (Collapsible on deep scroll) */}
      <div
        className={`bg-[#F4F1EC] border-b border-[#E7E3DC] text-[11px] sm:text-xs text-[#111111]/75 transition-all duration-300 ${
          isScrolled ? 'py-1 opacity-90' : 'py-1.5 opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Left: Live Kitchen Status Pill */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                !isStoreClosed
                  ? 'bg-[#15803D] animate-pulse'
                  : 'bg-[#9E090F]'
              }`}
              aria-hidden="true"
            />
            <span className="font-medium text-[#111111] truncate">
              {!isStoreClosed ? (
                <>
                  <span className="text-[#15803D] font-bold">Kitchen Open:</span>{' '}
                  {RESTAURANT_INFO.hours} • Ikoyi
                </>
              ) : (
                <>
                  <span className="text-[#9E090F] font-bold">Currently Closed:</span>{' '}
                  {storeStatus.nextActionText}
                </>
              )}
            </span>

            {/* Subtle Interactive Demo Hours Switch */}
            <button
              type="button"
              onClick={() => setIsStoreClosed(!isStoreClosed)}
              className="text-[10px] text-[#111111]/50 hover:text-[#9E090F] underline cursor-pointer ml-1 shrink-0 hidden sm:inline"
              title="Toggle to test after-hours pre-order mode for demo"
            >
              [Demo: {!isStoreClosed ? 'Test Closed' : 'Set Open'}]
            </button>
          </div>

          {/* Right: Address & Quick WhatsApp Link */}
          <div className="hidden md:flex items-center gap-4 text-[#111111]/70">
            <a
              href={RESTAURANT_INFO.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#9E090F] transition-colors flex items-center gap-1.5"
            >
              <span>3b Adekunle Lawal Rd, Ikoyi</span>
            </a>
            <span className="text-[#E7E3DC]">•</span>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9E090F] font-semibold hover:underline flex items-center gap-1"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div
        className={`transition-all duration-200 border-b border-[#E7E3DC] ${
          isScrolled
            ? 'bg-[#FAF9F6]/92 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.04)] py-2 sm:py-2.5'
            : 'bg-[#FAF9F6] py-3 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Identity / Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNav('/')}
              className="flex items-center text-left focus-ring p-1 -ml-1 cursor-pointer group"
              aria-label="Kabachi Chinese Restaurant, Bar & Lodge - Home"
            >
              <img
                src="/logo.png"
                alt="Kabachi Chinese Restaurant, Bar & Lodge"
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-medium">
            {/* Menu with Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMenuMouseEnter}
              onMouseLeave={handleMenuMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleNav('/menu')}
                className={`px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 focus-ring cursor-pointer text-xs uppercase tracking-wider font-semibold ${
                  currentPath === '/menu'
                    ? 'text-[#9E090F] bg-[#F4F1EC] font-bold shadow-2xs'
                    : 'text-[#111111]/80 hover:text-[#9E090F] hover:bg-[#F4F1EC]'
                }`}
              >
                <span>Direct Menu</span>
                <ChevronIcon
                  className={`w-3.5 h-3.5 text-[#111111]/60 transition-transform ${
                    isMenuDropdownOpen ? 'rotate-180 text-[#9E090F]' : ''
                  }`}
                />
              </button>

              <NavMenuDropdown
                isOpen={isMenuDropdownOpen}
                onClose={() => setIsMenuDropdownOpen(false)}
                onNavigate={handleNav}
              />
            </div>

            {/* The Bar */}
            <button
              type="button"
              onClick={() => handleScrollToAnchor('bar')}
              className="px-3.5 py-2 rounded-full text-[#111111]/80 hover:text-[#9E090F] hover:bg-[#F4F1EC] transition-all focus-ring cursor-pointer text-xs uppercase tracking-wider font-semibold"
            >
              The Bar
            </button>

            {/* Lodge Rooms Upstairs */}
            <button
              type="button"
              onClick={() => handleScrollToAnchor('rooms')}
              className="px-3.5 py-2 rounded-full text-[#111111]/80 hover:text-[#9E090F] hover:bg-[#F4F1EC] transition-all focus-ring cursor-pointer text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
            >
              <span>Rooms Upstairs</span>
              <span className="text-[10px] font-bold text-[#9E090F] bg-[#9E090F]/10 px-1.5 py-0.2 rounded-full">
                Ikoyi
              </span>
            </button>

            {/* Location & Hours with Popover */}
            <div
              className="relative"
              onMouseEnter={handleLocationMouseEnter}
              onMouseLeave={handleLocationMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleScrollToAnchor('visit')}
                className="px-3.5 py-2 rounded-full text-[#111111]/80 hover:text-[#9E090F] hover:bg-[#F4F1EC] transition-all focus-ring cursor-pointer text-xs uppercase tracking-wider font-semibold flex items-center gap-1"
              >
                <span>Find Us & Hours</span>
                <ChevronIcon
                  className={`w-3.5 h-3.5 text-[#111111]/60 transition-transform ${
                    isLocationPopoverOpen ? 'rotate-180 text-[#9E090F]' : ''
                  }`}
                />
              </button>

              <NavLocationPopover
                isOpen={isLocationPopoverOpen}
                onClose={() => setIsLocationPopoverOpen(false)}
                onNavigate={handleNav}
              />
            </div>
          </nav>

          {/* Right Controls: Search Trigger, WhatsApp, Cart & Order CTA */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Dish Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Kabachi menu items"
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#111111]/70 hover:text-[#111111] bg-[#F4F1EC] hover:bg-[#E7E3DC] border border-[#E7E3DC] rounded-full transition-all cursor-pointer focus-ring shadow-2xs"
            >
              <SearchIcon className="w-4 h-4 text-[#9E090F]" />
              <span className="hidden md:inline font-medium">Search dishes</span>
              <kbd className="hidden xl:inline text-[10px] bg-white border border-[#D5D0C7] text-[#111111]/50 px-1.5 py-0.5 rounded font-mono shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Direct WhatsApp Concierge Button (Tablet/Desktop) */}
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent(
                'Hello Kabachi Restaurant, I would like to make an inquiry or order.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="hidden sm:inline-flex p-2 text-[#15803D] hover:text-[#0E5828] bg-[#F4F1EC] hover:bg-[#E7E3DC] border border-[#E7E3DC] rounded-full transition-colors cursor-pointer focus-ring"
              title="Chat with Kabachi on WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>

            {/* Direct Call Icon Button (Mobile/Tablet) */}
            <a
              href={`tel:${RESTAURANT_INFO.phone.replace(/\s+/g, '')}`}
              aria-label={`Call restaurant at ${RESTAURANT_INFO.phone}`}
              className="sm:hidden p-2 text-[#111111] hover:text-[#9E090F] bg-[#F4F1EC] rounded-full transition-colors cursor-pointer focus-ring"
            >
              <PhoneIcon className="w-4 h-4" />
            </a>

            {/* Upgraded Cart Capsule */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open cart with ${totalItemCount} items`}
              className={`relative px-3 py-2 text-[#111111] hover:text-[#9E090F] transition-all focus-ring cursor-pointer flex items-center gap-2 rounded-full border border-[#D5D0C7] hover:border-[#9E090F] ${
                totalItemCount > 0
                  ? 'bg-white shadow-xs font-semibold'
                  : 'bg-[#FAF9F6] hover:bg-[#F4F1EC]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <CartIcon className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span
                    className={`absolute -top-2.5 -right-2.5 bg-[#9E090F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center tabular-nums leading-none flex items-center justify-center shadow-xs ${
                      isBadgeAnimating ? 'animate-badge-pop' : ''
                    }`}
                  >
                    {totalItemCount}
                  </span>
                )}
              </div>

              {/* Subtotal Preview when items are in cart */}
              {totalItemCount > 0 && (
                <span className="hidden sm:inline text-xs font-bold text-[#111111] pl-0.5">
                  {formatNaira(subtotal)}
                </span>
              )}
            </button>

            {/* Desktop Order Now Primary CTA */}
            <button
              type="button"
              onClick={() => handleNav('/menu')}
              className="hidden sm:inline-flex btn-primary text-xs uppercase tracking-wider font-semibold px-5 py-2.5 cursor-pointer shadow-sm"
            >
              Order Now
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden p-2 text-[#111111] hover:text-[#9E090F] rounded-lg hover:bg-[#F4F1EC] transition-colors cursor-pointer focus-ring"
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Slide-Over Drawer Navigation */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-full max-w-[320px] sm:max-w-sm bg-[#FAF9F6] h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250 border-l border-[#E7E3DC]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#E7E3DC] flex items-center justify-between bg-white">
              <button
                type="button"
                onClick={() => handleNav('/')}
                className="text-left"
              >
                <img
                  src="/logo.png"
                  alt="Kabachi Chinese Restaurant"
                  className="h-10 w-auto object-contain"
                />
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-[#F4F1EC] text-[#111111]/70 hover:text-[#111111] transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-4 space-y-4 flex-1">
              {/* Live Status Pill in Drawer */}
              <div className="p-3 bg-[#F4F1EC] rounded-xl border border-[#E7E3DC] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${
                      !isStoreClosed ? 'bg-[#15803D] animate-pulse' : 'bg-[#9E090F]'
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-[#111111]">
                      {!isStoreClosed ? 'Kitchen Open Today' : 'Kitchen Currently Closed'}
                    </p>
                    <p className="text-[11px] text-[#111111]/70">
                      {RESTAURANT_INFO.hours} ({storeStatus.lagosTimeString} WAT)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsStoreClosed(!isStoreClosed)}
                  className="text-[10px] text-[#9E090F] font-semibold underline cursor-pointer shrink-0"
                >
                  Demo switch
                </button>
              </div>

              {/* Quick Search Button in Drawer */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-3 text-xs bg-white border border-[#D5D0C7] rounded-xl text-[#111111]/60 hover:text-[#111111] transition-all shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <SearchIcon className="w-4 h-4 text-[#9E090F]" />
                  <span>Search dim sum, rice, noodles...</span>
                </div>
                <span className="text-[11px] font-bold text-[#9E090F]">Search</span>
              </button>

              {/* Navigation Cards */}
              <div className="space-y-1.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleNav('/menu')}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    currentPath === '/menu'
                      ? 'bg-[#9E090F]/10 border border-[#9E090F]/30 text-[#9E090F]'
                      : 'bg-white border border-[#E7E3DC] text-[#111111] hover:border-[#9E090F]/30'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold">Direct Order Menu</p>
                    <p className="text-xs text-[#111111]/60">
                      12 authentic Cantonese dishes, cooked to order
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#9E090F]">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleScrollToAnchor('bar')}
                  className="w-full text-left p-3 bg-white border border-[#E7E3DC] rounded-xl hover:border-[#9E090F]/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-[#111111]">The Bar & Lounge</p>
                    <p className="text-xs text-[#111111]/60">
                      Chilled beers, spritz, spirits & cocktails
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#111111]/40">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleScrollToAnchor('rooms')}
                  className="w-full text-left p-3 bg-white border border-[#E7E3DC] rounded-xl hover:border-[#9E090F]/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#111111]">Rooms Upstairs</p>
                      <span className="text-[10px] uppercase font-bold text-[#9E090F] bg-[#9E090F]/10 px-1.5 py-0.2 rounded-full">
                        Lodge
                      </span>
                    </div>
                    <p className="text-xs text-[#111111]/60">
                      Private air-conditioned retreat in Ikoyi
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#111111]/40">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleScrollToAnchor('visit')}
                  className="w-full text-left p-3 bg-white border border-[#E7E3DC] rounded-xl hover:border-[#9E090F]/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-[#111111]">Find Us & Opening Hours</p>
                    <p className="text-xs text-[#111111]/60">
                      3b Adekunle Lawal Rd, Ikoyi, Lagos
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#111111]/40">→</span>
                </button>
              </div>

              {/* Active Cart Banner in Drawer if cart has items */}
              {totalItemCount > 0 && (
                <div
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="p-3.5 rounded-xl bg-[#9E090F] text-white flex items-center justify-between cursor-pointer shadow-md hover:bg-[#88070D] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <CartIcon className="w-5 h-5" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">
                        Your Active Order
                      </p>
                      <p className="text-sm font-bold">
                        {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} • {formatNaira(subtotal)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">
                    View Cart →
                  </span>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#E7E3DC] bg-[#FAF9F6] space-y-2.5">
              <button
                type="button"
                onClick={() => handleNav('/menu')}
                className="w-full btn-primary py-3.5 text-xs uppercase tracking-wider font-semibold justify-center"
              >
                Start Direct Food Order
              </button>

              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent(
                  'Hello Kabachi, I would like to make an inquiry or order.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-[#15803D] hover:bg-[#0E5828] text-white text-xs uppercase tracking-wider font-semibold justify-center flex items-center gap-2 transition-colors shadow-xs"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Chat on WhatsApp ({RESTAURANT_INFO.phone})</span>
              </a>

              <a
                href={`tel:${RESTAURANT_INFO.phone.replace(/\s+/g, '')}`}
                className="w-full btn-secondary py-3 text-xs uppercase tracking-wider font-semibold justify-center flex items-center gap-2"
              >
                <PhoneIcon className="w-4 h-4" />
                <span>Call Ikoyi Kitchen</span>
              </a>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-[#111111]/50">
                  Kabachi Chinese Restaurant, Bar & Lodge • Ikoyi, Lagos
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Instant Dish Search Modal */}
      <NavSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNav}
      />
    </header>
  );
}
