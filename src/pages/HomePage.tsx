import React from 'react';
import { RESTAURANT_INFO, MENU_ITEMS, BRAND_PILLARS, ROOMS_INFO, GALLERY_ITEMS, formatNaira } from '../data/kabachi';
import { getPhotoById } from '../data/photos';
import { MenuItemCard } from '../components/MenuItemCard';
import { LazyImage } from '../components/LazyImage';
import { PhoneIcon, WhatsAppIcon, CartIcon } from '../components/Icons';
import { useCart } from '../context/CartContext';
import { generateWhatsAppLodgeUrl } from '../utils/whatsappOrder';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { totalItemCount, subtotal, setIsCartOpen } = useCart();
  const heroPhoto = getPhotoById('hero-dish');
  const popularDishes = MENU_ITEMS.filter((i) => i.isPopular).slice(0, 6);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section - Split layout, NOT full-bleed photo with dark overlay */}
      <section className="bg-[#FAF9F6] py-16 sm:py-24 border-b border-[#E7E3DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: headline and buttons */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <span className="section-label text-[#B8090F] tracking-[0.25em]">
                  RESTAURANT • BAR • LODGE
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-[#111111] leading-[1.08] tracking-tight">
                  {RESTAURANT_INFO.headline}
                </h1>
                <p className="text-lg sm:text-xl text-[#111111]/75 max-w-xl leading-relaxed pt-2">
                  Order for delivery or pickup in {RESTAURANT_INFO.city}. Open {RESTAURANT_INFO.hours}.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/menu')}
                  className="btn-primary px-8 py-4 text-sm font-semibold uppercase tracking-wider cursor-pointer"
                >
                  See the menu
                </button>
                <a
                  href={`tel:${RESTAURANT_INFO.phone.replace(/\s+/g, '')}`}
                  className="btn-secondary px-6 py-3.5 text-sm font-semibold flex items-center gap-2.5 cursor-pointer"
                >
                  <PhoneIcon className="w-4 h-4 text-[#111111]" />
                  <span>Call {RESTAURANT_INFO.phone}</span>
                </a>
              </div>

              {/* Quality reassurance bar */}
              <div className="pt-6 border-t border-[#E7E3DC] grid grid-cols-3 gap-4 text-xs text-[#111111]/70">
                <div>
                  <p className="font-semibold text-[#111111]">Wok Fresh</p>
                  <p className="text-[11px] text-[#111111]/60">Cooked to order</p>
                </div>
                <div>
                  <p className="font-semibold text-[#111111]">Direct Dispatch</p>
                  <p className="text-[11px] text-[#111111]/60">Ikoyi & VI delivery</p>
                </div>
                <div>
                  <p className="font-semibold text-[#111111]">Fast WhatsApp</p>
                  <p className="text-[11px] text-[#111111]/60">Instant confirmation</p>
                </div>
              </div>
            </div>

            {/* Right: one strong food photo, no dark overlay */}
            <div className="lg:col-span-5">
              <div className="relative rounded-[4px] overflow-hidden elevation-card border border-[#E7E3DC] bg-[#E7E3DC]">
                <LazyImage
                  src={heroPhoto.url}
                  alt={heroPhoto.alt}
                  aspectRatio="aspect-[4/3] sm:aspect-[5/4]"
                  hoverScale={true}
                />
                <div className="absolute bottom-3 right-3 bg-[#FAF9F6]/95 border border-[#E7E3DC] px-3 py-1.5 rounded-[2px] shadow-xs text-xs">
                  <span className="font-semibold text-[#111111]">Adekunle Lawal Rd, Ikoyi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Six Popular Dishes with photo, name, price, working add button */}
      <section className="bg-[#F4F1EC] py-16 sm:py-24 border-b border-[#E7E3DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="section-label text-[#B8090F]">
                MOST ORDERED
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading text-[#111111] mt-2">
                Popular from the wok.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/menu')}
              className="text-sm font-semibold text-[#B8090F] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              View all 12 dishes →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {popularDishes.map((dish) => (
              <MenuItemCard key={dish.id} item={dish} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => onNavigate('/menu')}
              className="btn-primary px-8 py-4 text-sm font-semibold uppercase tracking-wider cursor-pointer inline-block"
            >
              Explore the complete menu
            </button>
          </div>
        </div>
      </section>

      {/* 3. Restaurant / Bar / Lodge as three full-width alternating photo-and-text rows */}
      <section className="bg-[#FAF9F6] divide-y divide-[#E7E3DC] border-b border-[#E7E3DC]">
        {BRAND_PILLARS.map((pillar, idx) => {
          const photo = getPhotoById(pillar.photoId);
          const isReversed = idx % 2 === 1;

          return (
            <div key={pillar.id} id={pillar.id} className="py-16 sm:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                    isReversed ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Photo Column */}
                  <div className={`lg:col-span-6 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="relative rounded-[4px] overflow-hidden elevation-card border border-[#E7E3DC] bg-[#E7E3DC]">
                      <LazyImage
                        src={photo.url}
                        alt={photo.alt}
                        aspectRatio="aspect-[16/10]"
                        hoverScale={true}
                      />
                    </div>
                  </div>

                  {/* Text Column: 2 sentences plus one link */}
                  <div className={`lg:col-span-6 space-y-5 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                    <span className="section-label text-[#B8090F]">
                      {pillar.label}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-heading text-[#111111]">
                      {pillar.title}
                    </h2>
                    <p className="text-base sm:text-lg text-[#111111]/80 leading-relaxed max-w-xl">
                      {pillar.description}
                    </p>
                    <div className="pt-2">
                      {pillar.isExternal ? (
                        <a
                          href={pillar.linkHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#B8090F] hover:underline"
                        >
                          <span>{pillar.linkText}</span>
                          <WhatsAppIcon className="w-4 h-4" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNavigate(pillar.linkHref)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#B8090F] hover:underline cursor-pointer"
                        >
                          <span>{pillar.linkText} →</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. Rooms Block - short block, photos, WhatsApp button, no booking engine */}
      <section id="rooms" className="bg-[#F4F1EC] py-16 sm:py-24 border-b border-[#E7E3DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="section-label text-[#B8090F]">
                {ROOMS_INFO.label}
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading text-[#111111]">
                {ROOMS_INFO.title}
              </h2>
              <p className="text-base text-[#111111]/80 leading-relaxed">
                {ROOMS_INFO.description}
              </p>

              <ul className="space-y-2.5 pt-2 text-sm text-[#111111]/80">
                {ROOMS_INFO.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-none bg-[#B8090F]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <a
                  href={generateWhatsAppLodgeUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-8 py-4 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>{ROOMS_INFO.whatsappButtonText}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-[4px] overflow-hidden elevation-card border border-[#E7E3DC] bg-[#E7E3DC]">
                  <LazyImage
                    src={getPhotoById('lodge-room').url}
                    alt={getPhotoById('lodge-room').alt}
                    aspectRatio="aspect-[4/3]"
                  />
                </div>
                <div className="rounded-[4px] overflow-hidden elevation-card border border-[#E7E3DC] bg-[#E7E3DC]">
                  <LazyImage
                    src={getPhotoById('gallery-room-detail').url}
                    alt={getPhotoById('gallery-room-detail').alt}
                    aspectRatio="aspect-[4/3]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Gallery - simple responsive grid */}
      <section className="bg-[#FAF9F6] py-16 sm:py-24 border-b border-[#E7E3DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="section-label text-[#B8090F]">
              ATMOSPHERE
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading text-[#111111] mt-2">
              Inside Kabachi.
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {GALLERY_ITEMS.map((item, index) => {
              const photo = getPhotoById(item.photoId);
              return (
                <div
                  key={index}
                  className="group relative rounded-[4px] overflow-hidden elevation-card border border-[#E7E3DC] bg-[#E7E3DC]"
                >
                  <LazyImage
                    src={photo.url}
                    alt={photo.alt}
                    aspectRatio="aspect-square"
                    hoverScale={true}
                  />
                  <div className="p-3 bg-[#FAF9F6] border-t border-[#E7E3DC]">
                    <p className="text-xs font-medium text-[#111111]/90 truncate">
                      {item.caption}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Visit - the one dark section (#1A1A1A). LOGO-FREE plain wordmark */}
      <section id="visit" className="bg-[#1A1A1A] text-[#FAF9F6] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: Wordmark & Statement */}
            <div className="lg:col-span-5 space-y-6">
              {/* TODO: swap for white/reversed logo if Kabachi provides one */}
              <div className="section-label text-white/90 tracking-[0.3em] text-sm">
                KABACHI
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-[#FFFFFF] leading-tight">
                Visit us in Ikoyi.
              </h2>
              <p className="text-base text-[#D4D0C7] leading-relaxed max-w-md">
                Located on Adekunle Lawal Road. Stop by for hot wok dishes, chilled drinks at the bar, or stay comfortably in our private rooms upstairs.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href={RESTAURANT_INFO.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
                >
                  Open in Google Maps ↗
                </a>
                <a
                  href={`tel:${RESTAURANT_INFO.phone.replace(/\s+/g, '')}`}
                  className="border border-[#D4D0C7] text-[#FAF9F6] hover:bg-white/10 px-6 py-3 rounded-[2px] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  <PhoneIcon className="w-3.5 h-3.5 text-white" />
                  <span>Call {RESTAURANT_INFO.phone}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Address, Hours, Details */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 lg:pt-0">
              <div className="space-y-3">
                <h3 className="section-label text-[#B8090F]">
                  ADDRESS
                </h3>
                <p className="text-base text-[#E2DFD8] leading-relaxed">
                  {RESTAURANT_INFO.address}
                </p>
                <p className="text-xs text-[#A8A49D] pt-1">
                  Secure parking and 24/7 security on premises.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="section-label text-[#B8090F]">
                  HOURS
                </h3>
                <p className="text-base text-[#E2DFD8] font-medium leading-relaxed">
                  {RESTAURANT_INFO.hours}
                </p>
                <p className="text-xs text-[#A8A49D]">
                  Kitchen closes 15 minutes before closing.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="section-label text-[#B8090F]">
                  DELIVERY & PICKUP
                </h3>
                <p className="text-sm text-[#E2DFD8] leading-relaxed">
                  Direct WhatsApp delivery across Ikoyi, VI, Lekki Phase 1, and Lagos Island.
                </p>
                <p className="text-xs text-[#A8A49D]">
                  Minimum order: ₦{RESTAURANT_INFO.minOrder.toLocaleString('en-NG')}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="section-label text-[#B8090F]">
                  DIRECT WHATSAPP
                </h3>
                <p className="text-sm text-[#E2DFD8] leading-relaxed">
                  {RESTAURANT_INFO.phone}
                </p>
                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white underline hover:text-[#B8090F] transition-colors inline-block pt-1"
                >
                  Chat with dispatch team ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Floating Action Pill */}
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
