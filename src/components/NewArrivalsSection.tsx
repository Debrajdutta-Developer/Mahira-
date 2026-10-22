import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { DiamondDivider } from './BrandLogo.tsx';
import { NEW_COLLECTIONS_DATA } from '../data/mockData.ts';

interface NewArrivalsProps {
  onSelectCollection: (category: string) => void;
}

export const NewArrivalsSection: React.FC<NewArrivalsProps> = ({
  onSelectCollection,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section id="new-arrivals" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#091911] overflow-hidden">
      {/* Background Ambience from Original Site */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <picture>
          <source media="(max-width: 767px)" srcSet="/assets/s3-bg-mobile.jpg" />
          <img
            src="/assets/s3-bg.jpg"
            alt=""
            className="w-full h-full object-cover object-center filter blur-[1px]"
          />
        </picture>
        <div className="absolute inset-0 bg-[#091911]/80"></div>
      </div>

      {/* Decorative Rails from Original Site */}
      <aside className="absolute left-6 top-1/3 z-10 hidden xl:flex flex-col items-center space-y-4 select-none opacity-50">
        <span className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-[#fae2b4] [writing-mode:vertical-rl]">
          Modern · Rooted · Always You
        </span>
        <span className="w-[1px] h-16 bg-[#c5a880]/50"></span>
      </aside>

      <aside className="absolute right-6 top-1/3 z-10 hidden xl:flex flex-col items-center space-y-4 select-none opacity-50">
        <span className="font-cinzel text-[10px] uppercase tracking-[0.35em] text-[#fae2b4] [writing-mode:vertical-rl]">
          Elegance Lives In Every Detail
        </span>
        <span className="w-[1px] h-16 bg-[#c5a880]/50"></span>
      </aside>

      <div className="relative z-10 max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Header (Screenshot 8) */}
        <div className="text-center space-y-3">
          <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#d4af37]">
            NEW ARRIVALS
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[#faf8f5] tracking-wide uppercase">
            NEW COLLECTIONS FOR WOMEN
          </h2>

          <DiamondDivider className="my-4" />

          <p className="font-serif-luxury italic text-base sm:text-lg text-[#e6ded0] font-light">
            Fresh silhouettes. Timeless craftsmanship. Made for you.
          </p>
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-end space-x-2 pr-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Previous Collections"
            className="p-2 border border-[#c5a880]/40 rounded-full text-[#c5a880] hover:text-[#fae2b4] hover:border-[#fae2b4] hover:bg-[#132d20] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Next Collections"
            className="p-2 border border-[#c5a880]/40 rounded-full text-[#c5a880] hover:text-[#fae2b4] hover:border-[#fae2b4] hover:bg-[#132d20] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Arched Window Cards Carousel (Screenshot 8) */}
        <div
          ref={scrollRef}
          className="flex space-x-6 sm:space-x-8 overflow-x-auto pb-8 pt-2 scroll-smooth no-scrollbar"
        >
          {NEW_COLLECTIONS_DATA.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[290px] sm:w-[350px] group relative"
            >
              {/* Mughal Arch Card Container */}
              <div className="relative rounded-t-[140px] sm:rounded-t-[170px] rounded-b-xl overflow-hidden border border-[#c5a880]/60 bg-[#07150e] aspect-[3/4.5] flex flex-col justify-end p-6 sm:p-8 transition-all duration-500 group-hover:border-[#fae2b4] group-hover:shadow-[0_12px_36px_rgba(197,168,128,0.2)]">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.8] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07150e] via-[#07150e]/50 to-transparent"></div>
                </div>

                {/* Arched Border Ring Outline */}
                <div className="absolute inset-2 rounded-t-[132px] sm:rounded-t-[162px] rounded-b-lg border border-[#c5a880]/30 pointer-events-none group-hover:border-[#fae2b4]/50 transition-colors"></div>

                {/* Content Overlay */}
                <div className="relative z-10 text-center space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-cinzel text-[#fae2b4]/90">
                    {item.tag}
                  </span>
                  <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#faf8f5] tracking-widest uppercase">
                    {item.title}
                  </h3>
                  <p className="font-serif-luxury italic text-xs sm:text-sm text-[#d4af37]">
                    {item.description}
                  </p>

                  <div className="pt-3">
                    <button
                      onClick={() => onSelectCollection(item.category)}
                      className="inline-flex items-center space-x-2 px-6 py-2 border border-[#c5a880] text-[#fae2b4] hover:bg-[#c5a880] hover:text-[#07150e] text-[11px] uppercase tracking-[0.2em] font-cinzel transition-all duration-300 cursor-pointer"
                    >
                      <span>EXPLORE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
