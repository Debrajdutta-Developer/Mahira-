import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onExploreCollections: () => void;
  onNewArrivals: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCollections,
  onNewArrivals,
}) => {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-end justify-start overflow-hidden bg-[#07150e]">
      {/* Background Image with Authentic Reference Assets */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 700px)" srcSet="/assets/women-mobile.jpg" />
          <img
            src="/assets/women-clean.jpg"
            alt="Woman in an embroidered champagne saree seated in a deep green heritage room"
            className="w-full h-full object-cover object-top filter brightness-[0.92] contrast-[1.04] transform scale-[1.01] transition-transform duration-1000"
          />
        </picture>
        {/* Authentic Gradients from Original Site */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07150e] via-[#07150e]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#07150e]/80 via-[#07150e]/20 to-transparent"></div>
      </div>

      {/* Side Decorative Rail from Original Site */}
      <aside className="absolute right-6 top-1/3 z-10 hidden lg:flex flex-col items-center space-y-4 select-none opacity-60">
        <p className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-[#fae2b4] [writing-mode:vertical-rl] space-y-2">
          <span>A Heritage Woven For Tomorrow</span>
        </p>
        <span className="w-[1px] h-20 bg-gradient-to-b from-[#c5a880] to-transparent"></span>
      </aside>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-16 sm:pb-24 pt-32">
        <div className="max-w-xl sm:max-w-2xl space-y-4 sm:space-y-6">
          {/* Tagline */}
          <div className="flex items-center space-x-3">
            <span className="font-cinzel text-xs sm:text-sm uppercase tracking-[0.3em] text-[#d4af37] font-medium">
              Tradition Meets Tomorrow
            </span>
            <span className="w-12 h-[1px] bg-[#d4af37]/80 hidden xs:block"></span>
          </div>

          {/* Headline */}
          <h1 className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl text-[#faf8f5] leading-[0.95] tracking-tight drop-shadow-md">
            More Than <br />
            Fashion
          </h1>

          {/* Subheading in italic gold */}
          <p className="font-serif-luxury italic text-2xl sm:text-3xl text-[#d4af37] font-light">
            A story in every drape.
          </p>

          {/* CTA Buttons (Screenshot 9) */}
          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md">
            {/* Filled Gold Button */}
            <button
              onClick={onExploreCollections}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#c5a880] hover:bg-[#fae2b4] text-[#07150e] font-cinzel text-xs uppercase tracking-[0.22em] font-semibold flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl group cursor-pointer"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Outlined Button */}
            <button
              onClick={onNewArrivals}
              className="w-full sm:w-auto px-7 py-3.5 bg-transparent hover:bg-[#c5a880]/15 text-[#faf8f5] border border-[#c5a880]/60 hover:border-[#fae2b4] font-cinzel text-xs uppercase tracking-[0.22em] font-medium flex items-center justify-center space-x-3 transition-all duration-300 cursor-pointer group"
            >
              <span>New Arrivals</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-[#c5a880]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
