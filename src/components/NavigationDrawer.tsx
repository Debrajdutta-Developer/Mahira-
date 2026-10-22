import React, { useEffect } from 'react';
import { X, ArrowRight, Instagram, Facebook, Compass, ShieldCheck, User, Crown } from 'lucide-react';
import { BrandLogo, DiamondDivider } from './BrandLogo.tsx';
import { CurrencyCode, CURRENCIES } from '../utils/shop.ts';
import { AuthUser } from './AuthModal.tsx';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: string) => void;
  currentCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
  onOpenStory: () => void;
  onReplayUnveil?: () => void;
  onOpenOwnerPortal?: () => void;
  currentUser?: AuthUser | null;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  currentCurrency,
  onSelectCurrency,
  onOpenStory,
  onReplayUnveil,
  onOpenOwnerPortal,
  currentUser,
  onOpenAuth,
  onOpenProfile,
}) => {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mainLinks = [
    { label: 'New Arrivals', target: 'new-arrivals', category: 'all' },
    { label: 'Sarees', target: 'collections', category: 'sarees' },
    { label: 'Kurta Sets', target: 'collections', category: 'kurtas' },
    { label: 'Kalakaari', target: 'kalakaari', category: 'kalamkari' },
    { label: 'Best Sellers', target: 'best-sellers', category: 'all' },
    { label: 'All Collections', target: 'collections', category: 'all' },
  ];

  const storyLinks = [
    { label: 'Our Story', action: () => onOpenStory() },
    { label: 'The Complete Journey', action: () => onOpenStory() },
    { label: 'Craftsmanship', target: 'craftsmanship' },
    { label: 'Sustainability', target: 'manifesto' },
    { label: 'Journal', target: 'manifesto' },
    { label: 'Care Guide', target: 'help' },
    { label: 'WhatsApp Concierge (8536943389)', action: () => window.open('https://wa.me/918536943389', '_blank') },
    ...(onOpenOwnerPortal
      ? [{ label: 'Store Owner Portal & Gateway', action: () => onOpenOwnerPortal() }]
      : []),
  ];

  const handleNavClick = (target?: string, category?: string, action?: () => void) => {
    onClose();
    if (action) {
      action();
      return;
    }
    if (category) {
      onSelectCategory(category);
    }
    if (target) {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-label="Site Navigation"
        className="relative w-full max-w-md bg-[#0a1b13] border-r border-[#c5a880]/30 text-[#f7f4ee] h-full overflow-y-auto flex flex-col justify-between p-6 sm:p-8 z-10 shadow-2xl transition-transform"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#c5a880]/20">
            <BrandLogo size="sm" showSubtitle={true} />
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="p-2 text-[#c5a880] hover:text-[#fae2b4] hover:bg-[#132d20] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Patron / Store Owner Account Quick Card */}
          <div className="mt-4 p-3 bg-[#081810] border border-[#c5a880]/30 rounded-xl flex items-center justify-between">
            {!currentUser ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#fae2b4]" />
                  <span className="text-xs font-cinzel text-[#fae2b4]">Patron Account</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth?.();
                  }}
                  className="px-3 py-1.5 bg-[#143524] hover:bg-[#1b4731] text-[#fae2b4] text-xs font-cinzel font-bold rounded border border-[#c5a880]/40 transition-colors"
                >
                  Sign In / Register
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#05110a] border border-[#c5a880]/30 rounded-lg">
                    {currentUser.role === 'owner' ? (
                      <Crown className="w-4 h-4 text-amber-400" />
                    ) : (
                      <User className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-cinzel font-bold text-[#fae2b4]">{currentUser.name}</p>
                    <p className="text-[10px] text-[#c5a880]">
                      {currentUser.role === 'owner' ? '👑 Store Owner (Debraj)' : 'Verified Patron'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (currentUser.role === 'owner') onOpenOwnerPortal?.();
                    else onOpenProfile?.();
                  }}
                  className="px-2.5 py-1 bg-[#143524] hover:bg-[#1b4731] text-[#fae2b4] text-[11px] font-cinzel font-bold rounded border border-[#c5a880]/40 transition-colors"
                >
                  {currentUser.role === 'owner' ? 'Open Portal' : 'My Account'}
                </button>
              </>
            )}
          </div>

          {/* Primary Nav Links */}
          <nav className="mt-8 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#b89565] font-cinzel">
              Collections & Curations
            </p>
            <ul className="space-y-3 font-serif-luxury text-xl sm:text-2xl">
              {mainLinks.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavClick(item.target, item.category)}
                    className="w-full text-left py-1 text-[#f7f4ee] hover:text-[#d4af37] transition-all flex items-center justify-between group"
                  >
                    <span className="tracking-wide group-hover:translate-x-1 transition-transform">
                      {item.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#c5a880]/40 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <DiamondDivider className="my-6 opacity-60" />

          {/* Secondary / Story Links */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#b89565] font-cinzel">
              Heritage & House
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm text-[#e6ded0]">
              {storyLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.target, undefined, item.action)}
                  className="text-left py-1 hover:text-[#d4af37] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {/* Highlighted Store Owner Portal Action */}
          {onOpenOwnerPortal && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenOwnerPortal();
                }}
                className="w-full p-3 bg-gradient-to-r from-[#0d2217] to-[#143524] border border-[#c5a880]/50 rounded-lg flex items-center justify-between text-left text-xs text-[#fae2b4] hover:border-[#fae2b4] transition-all shadow-md group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#06140e] border border-[#c5a880]/30 rounded-md">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-cinzel font-bold text-xs text-[#fae2b4] group-hover:text-white">
                      Store Owner Portal (Debraj Dutta)
                    </p>
                    <p className="text-[10px] text-[#c5a880]">
                      PNB Gateway Ledger, UTR Fraud Audits &amp; Invoices
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#c5a880] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Currency & Preferences */}
        <div className="pt-6 border-t border-[#c5a880]/20 space-y-4">
          {onReplayUnveil && (
            <button
              onClick={() => {
                onClose();
                onReplayUnveil();
              }}
              className="w-full py-2.5 px-3 rounded border border-[#c5a880]/60 text-[#fae2b4] hover:bg-[#c5a880] hover:text-[#07150e] text-[11px] font-cinzel uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Experience Royal Curtain Unveil</span>
            </button>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#b89565] font-cinzel">
              Currency
            </span>
            <div className="flex gap-2">
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => onSelectCurrency(code)}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    currentCurrency === code
                      ? 'border-[#c5a880] text-[#07150e] bg-[#c5a880] font-medium'
                      : 'border-[#c5a880]/30 text-[#e6ded0] hover:border-[#c5a880]'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-[#b89565]/80 text-center font-serif-luxury italic">
            Rooted in tradition. Woven for tomorrow.
          </p>
        </div>
      </aside>
    </div>
  );
};
