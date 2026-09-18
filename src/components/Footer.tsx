import React from 'react';
import { RESTAURANT_INFO } from '../data/kabachi';
import {
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  XIcon,
  MailIcon,
} from './Icons';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'Instagram',
      href: RESTAURANT_INFO.instagram,
      icon: InstagramIcon,
      ariaLabel: 'Follow Kabachi on Instagram (@officialkabachi)',
    },
    {
      name: 'Facebook',
      href: RESTAURANT_INFO.facebook,
      icon: FacebookIcon,
      ariaLabel: 'Visit Kabachi on Facebook',
    },
    {
      name: 'TikTok',
      href: RESTAURANT_INFO.tiktok,
      icon: TikTokIcon,
      ariaLabel: 'Watch Kabachi on TikTok (@officialkabachi)',
    },
    {
      name: 'X',
      href: RESTAURANT_INFO.x,
      icon: XIcon,
      ariaLabel: 'Follow Kabachi on X (@kabachilagos)',
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/${RESTAURANT_INFO.whatsappNumber}`,
      icon: WhatsAppIcon,
      ariaLabel: `Chat with Kabachi on WhatsApp (${RESTAURANT_INFO.phone})`,
    },
    {
      name: 'Email',
      href: `mailto:${RESTAURANT_INFO.email}`,
      icon: MailIcon,
      ariaLabel: `Email Kabachi (${RESTAURANT_INFO.email})`,
    },
  ];

  return (
    <footer className="bg-[#F4F1EC] border-t border-[#E7E3DC] text-[#111111] py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Responsive Footer System: Stacks vertically on mobile, 4 columns on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-[#E7E3DC]">
          {/* Column 1: Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:col-span-1">
            <img
              src="/logo.png"
              alt="Kabachi Chinese Restaurant, Bar & Lodge"
              className="h-12 sm:h-14 w-auto object-contain"
            />
            <p className="text-xs text-[#111111]/70 leading-relaxed max-w-sm md:max-w-xs">
              {RESTAURANT_INFO.tagline}
            </p>
            <p className="section-label text-[#B8090F] pt-1">
              IKOYI • LAGOS • NIGERIA
            </p>
          </div>

          {/* Column 2: Direct Navigation (Accessible Spacing & Touch Targets) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <h4 className="section-label text-[#111111]/90">
              NAVIGATION
            </h4>
            <ul className="w-full max-w-xs md:max-w-none flex flex-col items-center md:items-start space-y-1">
              <li className="w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/');
                    scrollToTop();
                  }}
                  className="w-full md:w-auto py-2.5 px-3 min-h-[44px] flex items-center justify-center md:justify-start text-sm text-[#111111]/80 hover:text-[#B8090F] transition-colors focus-ring cursor-pointer rounded-lg hover:bg-black/5"
                >
                  Home
                </button>
              </li>
              <li className="w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/menu');
                    scrollToTop();
                  }}
                  className="w-full md:w-auto py-2.5 px-3 min-h-[44px] flex items-center justify-center md:justify-start text-sm text-[#111111]/80 hover:text-[#B8090F] transition-colors focus-ring cursor-pointer rounded-lg hover:bg-black/5"
                >
                  Order Menu
                </button>
              </li>
              <li className="w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/#rooms');
                    const el = document.getElementById('rooms');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full md:w-auto py-2.5 px-3 min-h-[44px] flex items-center justify-center md:justify-start text-sm text-[#111111]/80 hover:text-[#B8090F] transition-colors focus-ring cursor-pointer rounded-lg hover:bg-black/5"
                >
                  Rooms Upstairs
                </button>
              </li>
              <li className="w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/#visit');
                    const el = document.getElementById('visit');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full md:w-auto py-2.5 px-3 min-h-[44px] flex items-center justify-center md:justify-start text-sm text-[#111111]/80 hover:text-[#B8090F] transition-colors focus-ring cursor-pointer rounded-lg hover:bg-black/5"
                >
                  Location & Hours
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours & Contact */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <h4 className="section-label text-[#111111]/90">
              HOURS & ORDERING
            </h4>
            <div className="text-sm space-y-2 text-[#111111]/80 leading-relaxed">
              <p className="font-semibold text-[#111111]">{RESTAURANT_INFO.hours}</p>
              <p>Direct WhatsApp dispatch</p>
              <p>
                Kitchen line:{' '}
                <a
                  href={`tel:${RESTAURANT_INFO.phone.replace(/\s+/g, '')}`}
                  className="hover:text-[#B8090F] underline font-medium"
                >
                  {RESTAURANT_INFO.phone}
                </a>
              </p>
              <p className="text-xs text-[#111111]/60 pt-1">
                Minimum order: ₦{RESTAURANT_INFO.minOrder.toLocaleString('en-NG')}
              </p>
            </div>
          </div>

          {/* Column 4: Social Media (Properly Centered on Mobile) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <h4 className="section-label text-[#111111]/90">
              CONNECT WITH US
            </h4>
            <p className="text-xs text-[#111111]/70 max-w-xs leading-relaxed">
              Follow our kitchen stories, dining specials, and room inquiries in Ikoyi.
            </p>
            {/* Social media icons: strictly centered on mobile devices */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    title={social.name}
                    className="w-11 h-11 rounded-[8px] bg-white border border-[#E7E3DC] flex items-center justify-center text-[#111111]/80 hover:text-[#B8090F] hover:border-[#B8090F]/40 hover:bg-[#FAF9F6] transition-all focus-ring shadow-xs active:scale-95"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
            <p className="text-[11px] text-[#111111]/55 pt-1">
              Direct line: {RESTAURANT_INFO.phone}
            </p>
          </div>
        </div>

        {/* Bottom Bar: Stacked vertically on mobile, includes Back to Top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#111111]/60 text-center md:text-left">
          <p>
            © {new Date().getFullYear()} {RESTAURANT_INFO.name}. All rights reserved.
          </p>

          <p className="text-center">
            3b Adekunle Lawal Rd, Ikoyi, Lagos, Nigeria
          </p>

          {/* Accessible Back to Top link in footer */}
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111111]/75 hover:text-[#B8090F] transition-colors cursor-pointer py-1.5 px-3 rounded-full hover:bg-black/5 focus-ring"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
