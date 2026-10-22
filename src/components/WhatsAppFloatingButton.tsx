import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phoneNumber = '8536943389',
}) => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
    'Namaste Mahira Select! I am exploring your handcrafted couture collection and would love personalized assistance with draping and orders.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Concierge 8536943389"
        className="flex items-center gap-2.5 px-4 py-3 bg-[#0a1f14] hover:bg-[#0f2d1d] text-[#fae2b4] border border-[#25D366]/40 hover:border-[#25D366] rounded-full shadow-2xl shadow-black/80 transition-all duration-300 transform hover:scale-105"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-black">
            <MessageCircle className="w-4 h-4 fill-black text-black" />
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#25D366] animate-ping" />
        </div>
        <div className="text-left hidden sm:block pr-1">
          <p className="text-[10px] uppercase tracking-wider font-cinzel text-[#25D366] font-semibold flex items-center gap-1">
            <span>Direct Concierge</span>
            <Sparkles className="w-2.5 h-2.5" />
          </p>
          <p className="text-xs font-mono font-bold text-[#f7f4ee] leading-tight">
            +91 {phoneNumber}
          </p>
        </div>
      </a>
    </div>
  );
};
