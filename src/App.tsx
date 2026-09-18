import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { StoreClosedBanner } from './components/StoreClosedBanner';
import { BackToTopButton } from './components/BackToTopButton';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmPage } from './pages/OrderConfirmPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    try {
      const path = window.location.pathname;
      if (path === '/menu' || path === '/checkout' || path === '/order/confirm') {
        return path;
      }
      if (window.location.hash === '#menu') return '/menu';
      if (window.location.hash === '#checkout') return '/checkout';
      if (window.location.hash === '#confirm') return '/order/confirm';
      return '/';
    } catch {
      return '/';
    }
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/menu' || path === '/checkout' || path === '/order/confirm') {
        setCurrentPath(path);
      } else {
        setCurrentPath('/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    // Handle anchor links on home page
    if (path.startsWith('/#')) {
      if (currentPath !== '/') {
        setCurrentPath('/');
        window.history.pushState({}, '', '/');
        setTimeout(() => {
          const id = path.replace('/#', '');
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const id = path.replace('/#', '');
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setCurrentPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // fallback
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#111111] selection:bg-[#B8090F] selection:text-white font-body">
        {/* Closed/Operating status banner */}
        <StoreClosedBanner />

        {/* Global Navigation */}
        <Navbar currentPath={currentPath} onNavigate={navigate} />

        {/* Dynamic Page Views */}
        <main className="flex-1">
          {currentPath === '/' && <HomePage onNavigate={navigate} />}
          {currentPath === '/menu' && <MenuPage onNavigate={navigate} />}
          {currentPath === '/checkout' && <CheckoutPage onNavigate={navigate} />}
          {currentPath === '/order/confirm' && <OrderConfirmPage onNavigate={navigate} />}
        </main>

        {/* Cart Drawer - accessible across all pages */}
        <CartDrawer onNavigate={navigate} />

        {/* Floating Back to Top Button */}
        <BackToTopButton />

        {/* Global Footer (light background with logo) */}
        <Footer onNavigate={navigate} />
      </div>
    </CartProvider>
  );
}
