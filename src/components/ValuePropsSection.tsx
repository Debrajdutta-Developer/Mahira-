import React from 'react';
import { Shield, Truck, Heart } from 'lucide-react';
import { DiamondDivider, LotusIcon } from './BrandLogo.tsx';

export const ValuePropsSection: React.FC = () => {
  const props = [
    {
      title: 'AUTHENTIC CRAFTSMANSHIP',
      icon: <LotusIcon className="w-8 h-8 text-[#d4af37]" />,
      desc: 'Master weaver certified, honoring generational craft lineage.',
    },
    {
      title: 'PREMIUM QUALITY',
      icon: <Shield className="w-8 h-8 text-[#d4af37] stroke-[1.3]" />,
      desc: '100% pure natural silk, unadulterated zari, and organic dyes.',
    },
    {
      title: 'SAFE & RELIABLE SHIPPING',
      icon: <Truck className="w-8 h-8 text-[#d4af37] stroke-[1.3]" />,
      desc: 'Insured worldwide delivery with bespoke tamper-proof gift box.',
    },
    {
      title: 'LOVED BY THOUSANDS',
      icon: <Heart className="w-8 h-8 text-[#d4af37] stroke-[1.3]" />,
      desc: 'Cherished by discerning patrons across India and 30+ nations.',
    },
  ];

  return (
    <section id="craftsmanship" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#0a1a12]">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Top Diamond Divider */}
        <DiamondDivider />

        {/* 2x2 Grid (Screenshot 5) */}
        <div className="grid grid-cols-2 gap-y-12 gap-x-6 sm:gap-12">
          {props.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center space-y-3 group"
            >
              <div className="p-3 rounded-full bg-[#0d2419] border border-[#c5a880]/20 group-hover:border-[#fae2b4] transition-colors shadow-inner">
                {item.icon}
              </div>
              <h3 className="font-cinzel text-xs sm:text-sm uppercase tracking-[0.25em] text-[#faf8f5] font-semibold max-w-[180px] leading-relaxed">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#b89565] font-sans max-w-xs leading-relaxed hidden sm:block">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Diamond Divider */}
        <DiamondDivider />
      </div>
    </section>
  );
};
