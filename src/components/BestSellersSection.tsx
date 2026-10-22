import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DiamondDivider } from './BrandLogo.tsx';
import { BEST_SELLERS_DATA, PRODUCTS, Product } from '../data/mockData.ts';
import { CurrencyCode, formatPrice } from '../utils/shop.ts';

interface BestSellersSectionProps {
  onSelectProduct: (product: Product) => void;
  onShopAllBestSellers: () => void;
  currency: CurrencyCode;
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({
  onSelectProduct,
  onShopAllBestSellers,
  currency,
}) => {
  return (
    <section id="best-sellers" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#091810] overflow-hidden">
      {/* Background Ambience from Original Site */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <picture>
          <source media="(max-width: 767px)" srcSet="/assets/s5-room-mobile.jpg" />
          <img
            src="/assets/s5-room.jpg"
            alt=""
            className="w-full h-full object-cover object-center filter blur-[1px]"
          />
        </picture>
        <div className="absolute inset-0 bg-[#091810]/85"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Section Header (Screenshot 6) */}
        <div className="text-center space-y-3">
          <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#d4af37]">
            MAHIRA SELECT
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[#faf8f5] tracking-wide uppercase">
            BEST SELLERS
          </h2>

          <DiamondDivider className="my-4" />

          <p className="font-serif-luxury italic text-base sm:text-lg text-[#e6ded0] font-light">
            The pieces our customers reach for most.
          </p>
        </div>

        {/* Best Sellers Grid / Horizontal Scroll (Screenshot 6) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {BEST_SELLERS_DATA.map((item) => {
            const product = PRODUCTS.find((p) => p.id === item.productId) || PRODUCTS[0];
            return (
              <div
                key={item.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer rounded-xl overflow-hidden border border-[#c5a880]/30 hover:border-[#fae2b4] bg-[#0c1e14] transition-all duration-500 hover:shadow-[0_12px_30px_rgba(197,168,128,0.15)] flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#07150e]">
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85';
                    }}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1e14] via-transparent to-transparent opacity-80"></div>

                  <span className="absolute top-3 left-3 text-[10px] font-cinzel text-[#fae2b4] tracking-wider px-2 py-0.5 bg-[#07150e]/80 border border-[#c5a880]/40 rounded-sm">
                    {item.number}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#faf8f5] group-hover:text-[#fae2b4] transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="font-serif-luxury italic text-xs text-[#c5a880] mt-1">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#c5a880]/20">
                    <span className="text-sm font-semibold text-[#fae2b4]">
                      {formatPrice(product.priceINR, currency)}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-cinzel text-[#c5a880] group-hover:text-[#fae2b4] flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shop Best Sellers CTA Button (Screenshot 5 top) */}
        <div className="text-center pt-8">
          <button
            onClick={onShopAllBestSellers}
            className="inline-flex items-center space-x-3 px-8 py-3.5 border border-[#c5a880] text-[#fae2b4] hover:bg-[#c5a880] hover:text-[#07150e] text-xs uppercase tracking-[0.22em] font-cinzel transition-all duration-300 cursor-pointer shadow-lg"
          >
            <span>SHOP BEST SELLERS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
