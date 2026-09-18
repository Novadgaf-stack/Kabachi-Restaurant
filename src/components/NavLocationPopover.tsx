import React from 'react';
import { RESTAURANT_INFO } from '../data/kabachi';
import { PhoneIcon, WhatsAppIcon } from './Icons';

interface NavLocationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export function NavLocationPopover({ isOpen, onClose, onNavigate }: NavLocationPopoverProps) {
  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full right-1/2 translate-x-1/3 sm:translate-x-1/4 w-80 sm:w-96 bg-[#FAF9F6] border border-[#E7E3DC] rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="space-y-4">
        <div>
          <span className="section-label text-[#9E090F]">VISIT & HOURS</span>
          <h4 className="font-heading text-base text-[#111111] mt-0.5">
            Ikoyi Restaurant, Bar & Lodge
          </h4>
        </div>

        <div className="space-y-2.5 text-xs text-[#111111]/80">
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#E7E3DC]">
            <span className="text-base">📍</span>
            <div>
              <p className="font-semibold text-[#111111]">Address</p>
              <p className="mt-0.5 leading-relaxed text-[#111111]/70">
                {RESTAURANT_INFO.address}
              </p>
              <a
                href={RESTAURANT_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#9E090F] font-semibold hover:underline inline-block mt-1"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#E7E3DC]">
            <span className="text-base">🕒</span>
            <div>
              <p className="font-semibold text-[#111111]">Hours of Operation</p>
              <p className="mt-0.5 text-[#111111]/70">
                {RESTAURANT_INFO.hours}
              </p>
              <p className="text-[11px] text-[#15803D] font-semibold mt-0.5">
                Kitchen firing fresh orders daily
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#E7E3DC]">
            <span className="text-base">🛵</span>
            <div>
              <p className="font-semibold text-[#111111]">Delivery Zones</p>
              <p className="mt-0.5 text-[#111111]/70">
                Central Ikoyi, Banana Island, Parkview, Osborne, VI & Lekki Phase 1
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E7E3DC] grid grid-cols-2 gap-2">
          <a
            href={`tel:${RESTAURANT_INFO.phone.replace(/\s+/g, '')}`}
            className="btn-secondary py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <PhoneIcon className="w-3.5 h-3.5" />
            <span>Call Us</span>
          </a>

          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent(
              'Hello Kabachi, I would like to make an inquiry.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
