import React, { useState, useEffect } from 'react';
import { X, Heart, Shield, Sparkles, Check, ShoppingBag } from 'lucide-react';
import { Product } from '../data/mockData.ts';
import { formatPrice, CurrencyCode } from '../utils/shop.ts';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string) => void;
  currency: CurrencyCode;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  currency,
}) => {
  const [selectedSize, setSelectedSize] = useState('Free Size');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && product) onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const sizes = product.category === 'kurtas' ? ['XS', 'S', 'M', 'L', 'XL'] : ['Standard Drape (6.3m)', 'Custom Stitched'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-label={product.title}
        className="relative w-full max-w-4xl bg-[#0a1a12] border border-[#c5a880]/40 rounded-xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 max-h-[92vh]"
      >
        {/* Left Column: Image with badges */}
        <div className="relative bg-[#07150e] flex items-center justify-center overflow-hidden min-h-[340px] md:min-h-[500px]">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover object-center max-h-[550px]"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-cinzel font-semibold px-3 py-1 bg-[#07150e]/90 text-[#fae2b4] border border-[#c5a880]/50 rounded-sm">
              {product.badge}
            </span>
          )}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            aria-label="Toggle Wishlist"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-[#07150e]/80 text-[#fae2b4] hover:bg-[#132d20] border border-[#c5a880]/30 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                isWishlisted ? 'fill-[#e5c378] text-[#e5c378]' : 'stroke-[1.5]'
              }`}
            />
          </button>
        </div>

        {/* Right Column: Details & Add to Bag */}
        <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto text-[#f7f4ee]">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-[#c5a880]">
                  {product.collection}
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#fae2b4] mt-1 leading-tight">
                  {product.title}
                </h3>
                <p className="text-sm italic text-[#d4af37] font-serif-luxury">
                  {product.subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-1 text-[#c5a880] hover:text-[#fae2b4] hover:bg-[#132d20] rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline space-x-3">
              <span className="text-2xl font-bold font-serif-luxury text-[#fae2b4]">
                {formatPrice(product.priceINR, currency)}
              </span>
              {product.originalPriceINR && (
                <span className="text-sm text-[#8c6d3b] line-through font-sans">
                  {formatPrice(product.originalPriceINR, currency)}
                </span>
              )}
              <span className="text-[10px] text-[#a8e6cf] uppercase tracking-wider font-cinzel">
                Inclusive of all taxes
              </span>
            </div>

            <p className="mt-4 text-xs text-[#e6ded0] font-sans leading-relaxed">
              {product.description}
            </p>

            {/* Craft Specs */}
            <div className="mt-6 space-y-2 border-y border-[#c5a880]/20 py-4 text-xs">
              <div className="flex">
                <span className="w-24 text-[#b89565] font-cinzel uppercase text-[10px] tracking-wider">
                  Artisanal Craft:
                </span>
                <span className="text-[#f7f4ee] font-medium">{product.craft}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-[#b89565] font-cinzel uppercase text-[10px] tracking-wider">
                  Fabric:
                </span>
                <span className="text-[#f7f4ee] font-medium">{product.fabric}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-[#b89565] font-cinzel uppercase text-[10px] tracking-wider">
                  Care:
                </span>
                <span className="text-[#f7f4ee]">{product.care}</span>
              </div>
            </div>

            {/* Size selection */}
            <div className="mt-5">
              <label className="block text-xs uppercase tracking-wider font-cinzel text-[#b89565] mb-2">
                Select Option / Silhouette
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 text-xs rounded border transition-all ${
                      selectedSize === s
                        ? 'border-[#fae2b4] bg-[#fae2b4]/10 text-[#fae2b4] font-medium'
                        : 'border-[#c5a880]/30 text-[#e6ded0] hover:border-[#c5a880]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 pt-4">
            <button
              onClick={handleAdd}
              className="w-full py-3.5 bg-gradient-to-r from-[#c5a880] via-[#fae2b4] to-[#b89565] text-[#07150e] font-cinzel text-xs uppercase tracking-[0.2em] font-bold rounded flex items-center justify-center space-x-2 shadow-lg hover:brightness-105 active:scale-[0.99] transition-all"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-[#07150e]" />
                  <span>Added to Your Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#07150e]" />
                  <span>Add To Bag — {formatPrice(product.priceINR, currency)}</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-[#b89565] text-center mt-2 font-serif-luxury italic">
              Complimentary luxury gift box & certificate of craftsmanship included.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
