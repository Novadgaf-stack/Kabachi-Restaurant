import React, { useState, useEffect } from 'react';
import { ChevronIcon } from './Icons';

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    // Initial check
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top of page"
      title="Back to top"
      className="fixed bottom-24 sm:bottom-8 right-4 sm:right-6 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-xs border border-[#E7E3DC] text-[#111111] hover:text-[#B8090F] hover:border-[#B8090F]/50 hover:bg-[#FAF9F6] shadow-lg flex items-center justify-center transition-all duration-200 cursor-pointer focus-ring group active:scale-95 animate-in fade-in zoom-in-90 duration-200"
    >
      <ChevronIcon
        direction="up"
        className="w-5 h-5 text-[#111111] group-hover:text-[#B8090F] group-hover:-translate-y-0.5 transition-transform"
      />
      <span className="sr-only">Back to top</span>
    </button>
  );
}
