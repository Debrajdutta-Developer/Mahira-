import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LotusIcon } from './BrandLogo.tsx';

interface StorySectionProps {
  onDiscoverStory: () => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ onDiscoverStory }) => {
  return (
    <section id="storyEd" className="relative py-24 sm:py-32 px-6 sm:px-12 lg:px-20 bg-[#07150e] overflow-hidden border-t border-[#c5a880]/15">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Framed Media from Original Site */}
        <div className="relative group max-w-md mx-auto md:max-w-none w-full">
          {/* Subtle Outer Gold Offset Frame */}
          <div className="absolute -inset-2.5 sm:-inset-4 border border-[#c5a880]/40 rounded-lg pointer-events-none transform -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
          <div className="relative rounded-lg overflow-hidden border border-[#c5a880]/60 shadow-2xl aspect-[3/4] bg-[#0c1e14]">
            <img
              src="/assets/s7-story.jpg"
              alt="Model in an embroidered saree beside carved wood"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07150e]/60 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Right: Editorial Copy (Screenshot 4 & Original Site) */}
        <div className="space-y-6 sm:space-y-8">
          <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#d4af37]">
            Our Story
          </p>

          <div>
            <h2 className="font-serif-luxury text-4xl sm:text-6xl text-[#faf8f5] leading-tight">
              Tradition lives <br />
              <span className="italic text-[#d4af37] font-serif-luxury">beautifully.</span>
            </h2>
            <div className="w-16 h-[1.5px] bg-[#c5a880] mt-3"></div>
          </div>

          <p className="font-serif-luxury text-lg sm:text-2xl text-[#e6ded0] font-light leading-relaxed">
            Thoughtfully curated sarees, kurtas and timeless pieces &mdash; bringing
            India&apos;s finest craftsmanship to your everyday.
          </p>

          <p className="font-serif-luxury italic text-base sm:text-lg text-[#d4af37]">
            Rooted in tradition. Woven for tomorrow.
          </p>

          <div className="pt-2">
            <button
              onClick={onDiscoverStory}
              className="inline-flex items-center space-x-3 px-8 py-3.5 border border-[#c5a880] text-[#fae2b4] hover:bg-[#c5a880] hover:text-[#07150e] text-xs uppercase tracking-[0.22em] font-cinzel transition-all duration-300 cursor-pointer shadow-lg group"
            >
              <span>Discover Our Story</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
