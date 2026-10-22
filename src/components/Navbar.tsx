import React from 'react';
import { Search, ShoppingBag, ShieldCheck, User, Crown } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import { AuthUser } from './AuthModal.tsx';

interface NavbarProps {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  cartCount: number;
  onReplayUnveil?: () => void;
  onOpenOwnerPortal?: () => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMenu,
  onOpenSearch,
  onOpenCart,
  cartCount,
  onReplayUnveil,
  onOpenOwnerPortal,
  currentUser,
  onOpenAuth,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#07150e]/95 backdrop-blur-md border-b border-[#c5a880]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Hamburger menu with two horizontal lines */}
        <div className="flex items-center">
          <button
            onClick={onOpenMenu}
            aria-label="Open Navigation Menu"
            className="group p-2.5 rounded-sm hover:bg-[#13281c] text-[#c5a880] transition-colors focus:outline-none focus:ring-1 focus:ring-[#c5a880]"
          >
            <div className="flex flex-col justify-center space-y-1.5 w-6 h-5">
              <span className="block h-[1.5px] w-6 bg-[#d4af37] transition-all group-hover:w-5"></span>
              <span className="block h-[1.5px] w-6 bg-[#d4af37] transition-all group-hover:w-4"></span>
            </div>
          </button>
        </div>

        {/* Center: Mahira Select Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Mahira Select Home"
          className="focus:outline-none py-1 group"
        >
          <BrandLogo size="md" />
        </button>

        {/* Right: Unveil, Search & Shopping Bag */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          {onReplayUnveil && (
            <button
              onClick={onReplayUnveil}
              title="Experience Royal Curtain Unveil"
              aria-label="Replay Royal Curtain Unveil"
              className="p-2 rounded-full hover:bg-[#13281c] text-[#e8c89b] transition-colors focus:outline-none focus:ring-1 focus:ring-[#c5a880] flex items-center gap-1.5"
            >
              <span className="text-[#fae2b4] text-xs font-cinzel tracking-widest hidden md:inline uppercase text-[10px] border border-[#c5a880]/40 px-2 py-0.5 rounded-full">
                Royal Unveil
              </span>
            </button>
          )}

          {/* Auth State Button: Sign In / Customer Account / Store Owner Portal */}
          {!currentUser ? (
            <button
              onClick={onOpenAuth}
              title="Sign In or Register with Phone & Gmail"
              aria-label="Sign In or Register"
              className="px-2.5 py-1.5 rounded border border-[#c5a880]/50 bg-[#0d2217] hover:bg-[#153423] text-[#fae2b4] hover:text-white transition-all text-[11px] font-cinzel font-bold tracking-wider flex items-center gap-1.5 shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-[#fae2b4]" />
              <span className="hidden sm:inline">Sign In / Register</span>
              <span className="sm:hidden text-[10px]">Login</span>
            </button>
          ) : currentUser.role === 'owner' ? (
            <button
              onClick={onOpenOwnerPortal}
              title="Store Owner Portal & PNB Gateway Ledger (Debraj Dutta)"
              aria-label="Store Owner Portal"
              className="px-2.5 py-1.5 rounded border border-amber-400/60 bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/40 hover:to-amber-500/30 text-[#fae2b4] hover:text-white transition-all text-[11px] font-cinzel font-bold tracking-wider flex items-center gap-1.5 shadow-sm animate-pulse"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Owner Portal (Debraj)</span>
              <span className="sm:hidden text-[10px]">Owner</span>
            </button>
          ) : (
            <button
              onClick={onOpenProfile}
              title={`Patron Account: ${currentUser.name}`}
              aria-label="My Account"
              className="px-2.5 py-1.5 rounded border border-[#c5a880]/40 bg-[#0a1e14] hover:bg-[#122e1e] text-[#fae2b4] transition-all text-[11px] font-cinzel font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
              <span className="sm:hidden text-[10px]">Account</span>
            </button>
          )}

          <button
            onClick={onOpenSearch}
            aria-label="Search Collection"
            className="p-2 rounded-full hover:bg-[#13281c] text-[#e8c89b] transition-colors focus:outline-none focus:ring-1 focus:ring-[#c5a880]"
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>

          <button
            onClick={onOpenCart}
            aria-label={`Shopping Bag, ${cartCount} items`}
            className="relative p-2 rounded-full hover:bg-[#13281c] text-[#e8c89b] transition-colors focus:outline-none focus:ring-1 focus:ring-[#c5a880]"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute 1 top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-[#c5a880] text-[#07150e] text-[10px] font-semibold rounded-full flex items-center justify-center shadow-md animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
