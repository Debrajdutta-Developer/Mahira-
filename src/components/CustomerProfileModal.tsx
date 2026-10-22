import React from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  LogOut,
  ShoppingBag,
  ShieldCheck,
  Crown,
  FileText,
  Calendar,
} from 'lucide-react';
import { BrandLogo, DiamondDivider } from './BrandLogo.tsx';
import { AuthUser } from './AuthModal.tsx';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  onLogout: () => void;
  onOpenOwnerPortal?: () => void;
  onOpenOrders?: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onOpenOwnerPortal,
  onOpenOrders,
}) => {
  if (!isOpen || !user) return null;

  const isOwner = user.role === 'owner';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#071710] border border-[#c5a880]/40 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col text-[#f7f4ee]">
        {/* Header */}
        <div className="p-5 text-center border-b border-[#c5a880]/30 bg-[#091f16] relative">
          <button
            onClick={onClose}
            aria-label="Close Profile Modal"
            className="absolute top-4 right-4 p-1.5 text-[#c5a880] hover:text-[#fae2b4] hover:bg-[#132d20] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <BrandLogo size="sm" showSubtitle={false} />

          <div className="mt-3 flex items-center justify-center gap-2">
            {isOwner ? (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 text-black font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <Crown className="w-3.5 h-3.5" />
                <span>Store Owner &amp; Proprietor</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-[#122e1e] text-[#fae2b4] font-cinzel font-semibold text-xs border border-[#c5a880]/30 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Verified Patron Account</span>
              </span>
            )}
          </div>

          <h3 className="font-serif-luxury text-xl text-[#fae2b4] mt-2">
            {user.name}
          </h3>
          <p className="text-xs text-[#c5a880]">{user.email}</p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Owner Quick Action */}
          {isOwner && onOpenOwnerPortal && (
            <button
              onClick={() => {
                onClose();
                onOpenOwnerPortal();
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#c5a880] via-[#fae2b4] to-[#b89565] text-[#07150e] font-cinzel font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:brightness-105"
            >
              <Crown className="w-4 h-4 text-black" />
              <span>Launch Store Owner Portal (PNB Gateway)</span>
            </button>
          )}

          {/* Account Details Box */}
          <div className="p-4 bg-[#05110a] border border-[#c5a880]/20 rounded-xl space-y-2.5">
            <h4 className="font-cinzel text-xs font-bold text-[#fae2b4] uppercase tracking-wider pb-1 border-b border-[#c5a880]/15">
              Patron Profile Details
            </h4>

            <div className="flex items-center justify-between text-[#e6ded0]">
              <span className="text-[#c5a880] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>Phone:</span>
              </span>
              <span className="font-mono text-[#fae2b4]">+91 {user.phone}</span>
            </div>

            <div className="flex items-center justify-between text-[#e6ded0]">
              <span className="text-[#c5a880] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Email:</span>
              </span>
              <span className="text-[#fae2b4]">{user.email}</span>
            </div>

            {user.address && (
              <div className="flex items-start justify-between text-[#e6ded0] pt-1 border-t border-[#c5a880]/10">
                <span className="text-[#c5a880] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Address:</span>
                </span>
                <span className="text-right text-[#fae2b4] max-w-[200px]">
                  {user.address}, {user.city}
                </span>
              </div>
            )}
          </div>

          {/* Information & Privacy */}
          <div className="p-3 bg-[#0a1e14] border border-[#c5a880]/25 rounded-lg flex items-start gap-2 text-[11px] text-[#c5a880]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Your profile is saved locally for rapid checkout with direct PNB bank settlement &amp; official GST Tax Invoices.
            </span>
          </div>

          {/* Logout Action */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 border border-red-500/40 text-red-300 hover:bg-red-950/40 rounded-lg font-cinzel text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
