import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ExploreCollectionProps {
  onSelectCategory: (cat: string) => void;
}

export const ExploreCollectionSection: React.FC<ExploreCollectionProps> = ({
  onSelectCategory,
}) => {
  return (
    <section id="collections" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#07150e]">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#faf8f5] tracking-wide uppercase">
            EXPLORE THE COLLECTION
          </h2>
          <p className="font-serif-luxury italic text-base sm:text-lg text-[#c5a880] font-light">
            Timeless traditions. Modern stories.
          </p>
        </div>

        {/* 2 Big Featured Cards (Screenshot 10) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: WOMEN */}
          <div className="group relative rounded-2xl overflow-hidden border border-[#c5a880]/50 aspect-[4/3] sm:aspect-[16/11] bg-[#0d2217] transition-all duration-500 hover:border-[#fae2b4] hover:shadow-[0_10px_30px_rgba(197,168,128,0.15)] flex flex-col justify-end p-6 sm:p-10">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/assets/s2-card-women.jpg"
                alt="Women Ethnic Collection"
                className="w-full h-full object-cover object-center filter brightness-[0.85] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07150e] via-[#07150e]/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#07150e]/80 via-transparent to-transparent"></div>
            </div>

            {/* Content inside card */}
            <div className="relative z-10 space-y-3 sm:space-y-4 max-w-sm">
              <div>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#faf8f5] tracking-wider uppercase">
                  Women
                </h3>
                <div className="w-12 h-[1px] bg-[#c5a880] mt-1.5"></div>
              </div>

              <p className="font-serif-luxury text-sm sm:text-base text-[#e6ded0] leading-snug">
                Elegance in every drape, <br />
                <span className="italic text-[#d4af37]">for every you.</span>
              </p>

              <button
                onClick={() => onSelectCategory('sarees')}
                className="inline-flex items-center space-x-3 px-6 py-2.5 border border-[#c5a880]/70 text-[#fae2b4] hover:bg-[#c5a880] hover:text-[#07150e] text-xs uppercase tracking-[0.2em] font-cinzel transition-all duration-300 mt-2 cursor-pointer"
              >
                <span>EXPLORE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: KALAMKARI */}
          <div className="group relative rounded-2xl overflow-hidden border border-[#c5a880]/50 aspect-[4/3] sm:aspect-[16/11] bg-[#0d2217] transition-all duration-500 hover:border-[#fae2b4] hover:shadow-[0_10px_30px_rgba(197,168,128,0.15)] flex flex-col justify-end p-6 sm:p-10">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/assets/s2-card-kala.jpg"
                alt="Kalamkari Handpainted Heritage"
                className="w-full h-full object-cover object-center filter brightness-[0.85] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07150e] via-[#07150e]/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#07150e]/80 via-transparent to-transparent"></div>
            </div>

            {/* Content inside card */}
            <div className="relative z-10 space-y-3 sm:space-y-4 max-w-sm">
              <div>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#faf8f5] tracking-wider uppercase">
                  Kalamkari
                </h3>
                <div className="w-12 h-[1px] bg-[#c5a880] mt-1.5"></div>
              </div>

              <p className="font-serif-luxury text-sm sm:text-base text-[#e6ded0] leading-snug">
                Art that tells <span className="italic text-[#d4af37]">a story.</span>
              </p>

              <button
                onClick={() => onSelectCategory('kalamkari')}
                className="inline-flex items-center space-x-3 px-6 py-2.5 border border-[#c5a880]/70 text-[#fae2b4] hover:bg-[#c5a880] hover:text-[#07150e] text-xs uppercase tracking-[0.2em] font-cinzel transition-all duration-300 mt-2 cursor-pointer"
              >
                <span>EXPLORE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
