import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DiamondDivider } from './BrandLogo.tsx';

interface KalakaariSectionProps {
  onExploreKalakaari: () => void;
  onSelectDupattas: () => void;
}

export const KalakaariSection: React.FC<KalakaariSectionProps> = ({
  onExploreKalakaari,
  onSelectDupattas,
}) => {
  return (
    <section id="kalakaari" className="relative bg-[#07150e] text-[#faf8f5] overflow-hidden">
      {/* Editorial Hero Banner for Kalakaari (Screenshot 7) */}
      <div className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-start px-6 sm:px-12 lg:px-20 py-24">
        {/* Background Image of Model against Indian Courtyard Architecture */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 767px)" srcSet="/assets/s4-room-mobile.jpg" />
            <img
              src="/assets/s4-room.jpg"
              alt="Kalakaari Heritage Collection"
              className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.05]"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-[#07150e]/95 via-[#07150e]/75 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#07150e] via-transparent to-transparent"></div>
        </div>

        {/* Content (Screenshot 7) */}
        <div className="relative z-10 max-w-xl space-y-5">
          <span className="font-cinzel text-xs uppercase tracking-[0.35em] text-[#d4af37]">
            DISCOVER
          </span>

          <h2 className="font-serif-luxury text-4xl sm:text-6xl text-[#faf8f5] tracking-wide uppercase leading-tight">
            KALAKAARI <br />
            COLLECTION
          </h2>

          <div className="flex items-center space-x-2">
            <span className="w-10 h-[1px] bg-[#c5a880]/60"></span>
            <span className="w-2 h-2 rotate-45 border border-[#c5a880] bg-[#07150e]"></span>
            <span className="w-10 h-[1px] bg-[#c5a880]/60"></span>
          </div>

          <p className="font-serif-luxury text-base sm:text-xl text-[#e6ded0] font-light">
            Art. Culture. Craftsmanship. Woven into every story.
          </p>

          <p className="font-serif-luxury italic text-xl sm:text-2xl text-[#d4af37]">
            A canvas of tradition, for today&apos;s world.
          </p>

          <div className="w-14 h-[1px] bg-[#c5a880]"></div>

          <div className="pt-2">
            <button
              onClick={onExploreKalakaari}
              className="inline-flex items-center space-x-3 px-8 py-3.5 border border-[#c5a880] text-[#fae2b4] hover:bg-[#c5a880] hover:text-[#07150e] text-xs uppercase tracking-[0.22em] font-cinzel transition-all duration-300 cursor-pointer"
            >
              <span>EXPLORE KALAKAARI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Craft Details & Dupattas Showcase (Screenshot 6) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Textile details */}
          <div className="relative rounded-xl overflow-hidden border border-[#c5a880]/40 aspect-[4/3] bg-[#0d2217]">
            <img
              src="/assets/s4-p1.jpg"
              alt="Handpainted Kalamkari Textile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07150e]/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] uppercase tracking-[0.25em] font-cinzel text-[#fae2b4]">
                NATURAL VEGETABLE PIGMENTS
              </span>
              <h4 className="font-serif-luxury text-xl sm:text-2xl text-[#faf8f5]">
                Srikalahasti Pen Kalamkari
              </h4>
              <p className="text-xs text-[#e6ded0] mt-1 font-sans">
                Hand-drawn with bamboo pens and bathed in milk and river waters.
              </p>
            </div>
          </div>

          {/* Right: Dupattas Box (Screenshot 6) */}
          <div className="relative rounded-xl overflow-hidden border border-[#c5a880]/50 aspect-[4/3] bg-[#0c1f15] p-8 sm:p-12 flex flex-col justify-between">
            <div className="absolute inset-0 z-0">
              <img
                src="/assets/s4-p3.jpg"
                alt="Dupattas Collection"
                className="w-full h-full object-cover filter brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-[#07150e]/50"></div>
            </div>

            {/* Inner Gold Frame Box (Screenshot 6) */}
            <div className="relative z-10 border border-[#c5a880]/70 p-6 sm:p-8 rounded-lg max-w-sm bg-[#07150e]/60 backdrop-blur-xs">
              <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#faf8f5] tracking-widest uppercase">
                DUPATTAS
              </h3>
              <p className="font-serif-luxury italic text-sm sm:text-base text-[#e6ded0] mt-1">
                A touch of tradition.
              </p>

              <button
                onClick={onSelectDupattas}
                aria-label="Explore Dupattas"
                className="mt-6 w-10 h-10 rounded-full bg-[#c5a880] text-[#07150e] flex items-center justify-center hover:bg-[#fae2b4] hover:scale-105 transition-all shadow-md cursor-pointer"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Explore All Button (Screenshot 6) */}
            <div className="relative z-10 pt-6">
              <button
                onClick={onExploreKalakaari}
                className="w-full sm:w-auto px-8 py-3 border border-[#c5a880] text-[#fae2b4] hover:bg-[#c5a880] hover:text-[#07150e] text-xs uppercase tracking-[0.2em] font-cinzel transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer"
              >
                <span>EXPLORE ALL KALAKAARI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
