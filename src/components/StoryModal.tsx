import React, { useEffect } from 'react';
import { X, Sparkles, Feather, Globe, ShieldCheck } from 'lucide-react';
import { BrandLogo, DiamondDivider } from './BrandLogo.tsx';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-label="Our Story — Mahira Select"
        className="relative w-full max-w-3xl bg-[#0a1a12] border border-[#c5a880]/40 rounded-xl p-6 sm:p-10 text-[#f7f4ee] z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Close story"
          className="absolute top-5 right-5 p-2 text-[#c5a880] hover:text-[#fae2b4] hover:bg-[#132d20] rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center space-y-4">
          <BrandLogo size="md" />
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#fae2b4] tracking-wide">
            Our Story & Heritage
          </h2>
          <p className="font-serif-luxury italic text-sm sm:text-base text-[#c5a880]">
            Rooted in tradition. Woven for tomorrow.
          </p>
        </div>

        <DiamondDivider className="my-6" />

        <div className="space-y-6 text-sm text-[#e6ded0] font-sans leading-relaxed">
          <p>
            Mahira Select was conceived with a singular devotion: to preserve and elevate
            India’s timeless handloom lineages into modern luxury heirlooms. Each weave,
            stitch, and botanical pigment represents centuries of unbroken artisan heritage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-[#0d2217] border border-[#c5a880]/20 space-y-2">
              <Feather className="w-6 h-6 text-[#d4af37]" />
              <h4 className="font-cinzel text-xs uppercase tracking-wider text-[#fae2b4] font-semibold">
                Srikalahasti Pen Art
              </h4>
              <p className="text-xs text-[#b89565]">
                Freehand Kalamkari rendered with bamboo pens and 100% natural madder, indigo, and myrobalan.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0d2217] border border-[#c5a880]/20 space-y-2">
              <Sparkles className="w-6 h-6 text-[#d4af37]" />
              <h4 className="font-cinzel text-xs uppercase tracking-wider text-[#fae2b4] font-semibold">
                Varanasi Kadhwa
              </h4>
              <p className="text-xs text-[#b89565]">
                Pit-loom woven pure katan silks where each gold zari motif is individually locked by hand.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0d2217] border border-[#c5a880]/20 space-y-2">
              <Globe className="w-6 h-6 text-[#d4af37]" />
              <h4 className="font-cinzel text-xs uppercase tracking-wider text-[#fae2b4] font-semibold">
                Fair Artisan Guild
              </h4>
              <p className="text-xs text-[#b89565]">
                Direct ethical partnerships ensuring master weavers receive dignified fair-trade compensation.
              </p>
            </div>
          </div>

          <p>
            When you drape a Mahira creation, you don’t merely wear fashion — you carry
            the blessings, patience, and poetic spirit of Indian master craftsmen into the world.
          </p>

          <div className="pt-4 text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-[#c5a880] text-[#07150e] font-cinzel text-xs uppercase tracking-[0.2em] font-bold rounded hover:bg-[#fae2b4] transition-colors"
            >
              Return To Collections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
