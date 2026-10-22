/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ExploreCollectionSection } from './components/ExploreCollectionSection.tsx';
import { NewArrivalsSection } from './components/NewArrivalsSection.tsx';
import { KalakaariSection } from './components/KalakaariSection.tsx';
import { BestSellersSection } from './components/BestSellersSection.tsx';
import { ValuePropsSection } from './components/ValuePropsSection.tsx';
import { StorySection } from './components/StorySection.tsx';
import { FooterSection } from './components/FooterSection.tsx';
import { NavigationDrawer } from './components/NavigationDrawer.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { ProductModal } from './components/ProductModal.tsx';
import { StoryModal } from './components/StoryModal.tsx';
import { CurtainIntro } from './components/CurtainIntro.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OwnerOrdersModal } from './components/OwnerOrdersModal.tsx';
import { AuthModal, AuthUser } from './components/AuthModal.tsx';
import { CustomerProfileModal } from './components/CustomerProfileModal.tsx';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton.tsx';
import { Product, PRODUCTS } from './data/mockData.ts';
import { CartItem, CurrencyCode } from './utils/shop.ts';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showCurtainIntro, setShowCurtainIntro] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Patron & Owner Authentication State (Stored in localStorage)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('mahira_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user: AuthUser, isOwner: boolean) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('mahira_auth_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist auth state:', e);
    }

    // Fulfills: "ami korle amar owner portal khulbe"
    if (isOwner) {
      setIsOwnerPortalOpen(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('mahira_auth_user');
    } catch (e) {
      console.error('Failed to clear auth state:', e);
    }
  };

  // Checkout totals calculated from Cart
  const [checkoutTotals, setCheckoutTotals] = useState({
    subtotalINR: 18500,
    discountINR: 0,
    shippingINR: 0,
    totalINR: 18500,
    itemCount: 1,
  });

  // Initial cart with 1 handcrafted piece so user can immediately test bag interactions & checkout
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'saree-01',
      title: 'Embroidered Zari Organza Saree',
      subtitle: 'Grace in every drape',
      priceINR: 18500,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      quantity: 1,
      size: 'Standard Drape (6.3m)',
    },
  ]);

  const handleAddToCart = (product: Product, size?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          subtitle: product.subtitle,
          priceINR: product.priceINR,
          image: product.image,
          quantity: 1,
          size: size || 'Standard',
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (category: string) => {
    if (category === 'kalamkari') {
      scrollToSection('kalakaari');
    } else if (category === 'sarees' || category === 'kurtas') {
      const match = PRODUCTS.find((p) => p.category === category);
      if (match) {
        setSelectedProduct(match);
      } else {
        scrollToSection('collections');
      }
    } else {
      scrollToSection('collections');
    }
  };

  const handleOpenCheckout = (totals: any) => {
    setCheckoutTotals({
      subtotalINR: totals.subtotalINR,
      discountINR: totals.discountINR,
      shippingINR: totals.shippingINR,
      totalINR: totals.totalINR,
      itemCount: totals.itemCount,
    });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = () => {
    // Optionally preserve cart or reset
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#07150e] text-[#f7f4ee] selection:bg-[#c5a880] selection:text-[#07150e]">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#050f0a] border-b border-[#c5a880]/15 py-2 px-4 text-center">
        <p className="font-cinzel text-[10px] sm:text-xs tracking-[0.25em] text-[#fae2b4] uppercase flex items-center justify-center gap-1.5 flex-wrap">
          <span>Complimentary Luxury Shipping on orders above</span>
          <span className="font-sans font-semibold tracking-normal text-[#fae2b4]">₹5,000</span>
          <span>•</span>
          <span>Direct WhatsApp: 8536943389</span>
          <span>•</span>
          <button
            onClick={() => setIsOwnerPortalOpen(true)}
            className="text-emerald-300 hover:text-white underline font-bold tracking-wider inline-flex items-center gap-1"
          >
            <span>👑 Merchant Portal</span>
          </button>
        </p>
      </div>

      {/* Navbar matching Screenshots */}
      <Navbar
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        onReplayUnveil={() => setShowCurtainIntro(true)}
        onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* Screenshot 9: Hero Section */}
        <HeroSection
          onExploreCollections={() => scrollToSection('collections')}
          onNewArrivals={() => scrollToSection('new-arrivals')}
        />

        {/* Screenshot 10: Explore the Collection (Women & Kalamkari cards) */}
        <ExploreCollectionSection
          onSelectCategory={(cat) => handleCategorySelect(cat)}
        />

        {/* Screenshot 8: New Arrivals (Mughal arched window cards) */}
        <NewArrivalsSection
          onSelectCollection={(cat) => handleCategorySelect(cat)}
        />

        {/* Screenshot 6 & 7: Discover Kalakaari Collection */}
        <KalakaariSection
          onExploreKalakaari={() => {
            const item = PRODUCTS.find((p) => p.category === 'kalamkari');
            if (item) setSelectedProduct(item);
          }}
          onSelectDupattas={() => {
            const item = PRODUCTS.find((p) => p.category === 'dupattas');
            if (item) setSelectedProduct(item);
          }}
        />

        {/* Screenshot 5 & 6: Best Sellers with 01, 02 numbered items */}
        <BestSellersSection
          onSelectProduct={(p) => setSelectedProduct(p)}
          onShopAllBestSellers={() => scrollToSection('collections')}
          currency={currency}
        />

        {/* Screenshot 5: Value propositions 2x2 grid */}
        <ValuePropsSection />

        {/* Screenshot 4: "Tradition lives beautifully." Brand Story */}
        <StorySection onDiscoverStory={() => setIsStoryOpen(true)} />

        {/* Screenshot 1, 2, 3: Pre-footer Manifesto & Footer */}
        <FooterSection
          onSelectCategory={(cat) => handleCategorySelect(cat)}
          onOpenStory={() => setIsStoryOpen(true)}
          currentCurrency={currency}
          onSelectCurrency={(c) => setCurrency(c)}
          onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
        />
      </main>

      {/* Slide-out Navigation Drawer */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectCategory={handleCategorySelect}
        currentCurrency={currency}
        onSelectCurrency={setCurrency}
        onOpenStory={() => setIsStoryOpen(true)}
        onReplayUnveil={() => setShowCurtainIntro(true)}
        onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        currency={currency}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        currency={currency}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Direct In-House Checkout & Payment Gateway Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        totals={checkoutTotals}
        currency={currency}
        currentUser={currentUser}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Patron & Store Owner Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Customer / Patron Profile Details Modal */}
      <CustomerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        onLogout={handleLogout}
        onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
      />

      {/* Store Owner Live Orders & Gateway Settings Portal */}
      <OwnerOrdersModal
        isOpen={isOwnerPortalOpen}
        onClose={() => setIsOwnerPortalOpen(false)}
      />

      {/* Direct WhatsApp Concierge Button */}
      <WhatsAppFloatingButton phoneNumber="8536943389" />

      {/* Product Quick-View Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        currency={currency}
      />

      {/* Brand Story Modal */}
      <StoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />

      {/* Royal Curtain Unveil Intro */}
      <CurtainIntro
        isOpen={showCurtainIntro}
        onComplete={() => setShowCurtainIntro(false)}
      />
    </div>
  );
}
