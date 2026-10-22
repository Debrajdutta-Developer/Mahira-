import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { PRODUCTS, Product } from '../data/mockData.ts';
import { formatPrice, CurrencyCode } from '../utils/shop.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  currency: CurrencyCode;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  currency,
}) => {
  const [query, setQuery] = useState('');

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

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.craft.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  const popularSearches = ['Zari Saree', 'Kalamkari Dupatta', 'Chanderi Kurta', 'Banarasi Silk', 'Organza'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-label="Search Catalog"
        className="relative w-full max-w-2xl bg-[#091a12] border border-[#c5a880]/40 rounded-lg p-6 sm:p-8 shadow-2xl text-[#f7f4ee] z-10"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#c5a880]/20">
          <div className="flex items-center space-x-3 flex-1">
            <Search className="w-5 h-5 text-[#c5a880]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sarees, kurtas, dupattas, crafts..."
              className="w-full bg-transparent border-none text-lg sm:text-xl text-[#f7f4ee] placeholder-[#b89565]/60 focus:outline-none font-serif-luxury"
            />
          </div>
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 text-[#c5a880] hover:text-[#fae2b4] hover:bg-[#132d20] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#b89565] font-cinzel text-[10px] uppercase tracking-wider mr-1">
            Curated:
          </span>
          {popularSearches.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-[#11261b] hover:bg-[#1a3827] text-[#e6ded0] border border-[#c5a880]/20 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="mt-6 max-h-[55vh] overflow-y-auto space-y-3 pr-1">
          {query.trim() && filteredProducts.length === 0 && (
            <div className="py-12 text-center text-[#b89565]">
              <p className="font-serif-luxury text-lg italic">
                No heirloom pieces found matching &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#a28258] mt-1 font-sans">
                Try searching for &apos;Saree&apos;, &apos;Kalamkari&apos;, or &apos;Chanderi&apos;
              </p>
            </div>
          )}

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                onSelectProduct(product);
                onClose();
              }}
              className="flex items-center space-x-4 p-3 rounded-lg bg-[#0e2318] hover:bg-[#142e20] border border-[#c5a880]/20 cursor-pointer transition-all group"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-16 h-20 object-cover rounded border border-[#c5a880]/30"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-cinzel text-[#c5a880]">
                  {product.category}
                </span>
                <h4 className="font-serif-luxury text-base text-[#f7f4ee] truncate group-hover:text-[#d4af37] transition-colors">
                  {product.title}
                </h4>
                <p className="text-xs text-[#b89565] truncate font-sans">
                  {product.craft}
                </p>
                <p className="text-sm font-semibold text-[#fae2b4] mt-1">
                  {formatPrice(product.priceINR, currency)}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-[#c5a880]/40 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
