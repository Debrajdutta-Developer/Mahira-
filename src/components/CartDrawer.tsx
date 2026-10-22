import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, MessageCircle } from 'lucide-react';
import { CartItem, CurrencyCode, formatPrice, calculateCartTotals, applyPromoCode } from '../utils/shop.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  currency: CurrencyCode;
  onCheckoutSuccess?: () => void;
  onOpenCheckout: (totals: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  currency,
  onCheckoutSuccess,
  onOpenCheckout,
}) => {

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number; message: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setCheckoutComplete(false);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const totals = calculateCartTotals(items, appliedPromo?.percent || 0, 5000);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const result = applyPromoCode(promoInput);
    if (result.valid) {
      setAppliedPromo({
        code: promoInput.toUpperCase(),
        percent: result.discountPercent,
        message: result.message,
      });
      setPromoInput('');
    } else {
      setPromoError(result.message);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      if (onCheckoutSuccess) onCheckoutSuccess();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Bag Panel */}
      <aside
        role="dialog"
        aria-label="Shopping Bag"
        className="relative w-full max-w-md bg-[#0a1a12] border-l border-[#c5a880]/30 text-[#f7f4ee] h-full overflow-y-auto flex flex-col justify-between p-6 sm:p-8 z-10 shadow-2xl"
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#c5a880]/20">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#c5a880]" />
              <h2 className="font-serif-luxury text-2xl text-[#fae2b4] tracking-wide">
                Your Shopping Bag
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#173324] text-[#c5a880] border border-[#c5a880]/20">
                {totals.itemCount}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close Shopping Bag"
              className="p-1.5 text-[#c5a880] hover:text-[#fae2b4] hover:bg-[#132d20] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          {items.length > 0 && (
            <div className="mt-4 p-3 bg-[#0d2217] rounded border border-[#c5a880]/20 text-xs">
              {totals.isFreeShipping ? (
                <p className="text-[#a8e6cf] font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  Complimentary Luxury White-Glove Shipping unlocked!
                </p>
              ) : (
                <div>
                  <p className="text-[#e6ded0]">
                    Add{' '}
                    <span className="font-semibold text-[#fae2b4]">
                      {formatPrice(totals.amountNeededForFreeShippingINR, currency)}
                    </span>{' '}
                    more to qualify for complimentary luxury delivery.
                  </p>
                  <div className="w-full bg-[#07150e] h-1.5 rounded-full mt-2 overflow-hidden border border-[#c5a880]/20">
                    <div
                      className="bg-gradient-to-r from-[#b38f56] to-[#fae2b4] h-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (totals.subtotalINR / 5000) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Checkout Completed Confirmation */}
          {checkoutComplete ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#132d20] border border-[#c5a880] mx-auto flex items-center justify-center text-[#fae2b4]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-serif-luxury text-2xl text-[#fae2b4]">
                Order Placed With Mahira Select
              </h3>
              <p className="text-sm text-[#c5a880] max-w-xs mx-auto font-sans leading-relaxed">
                Thank you for honoring Indian craftsmanship. An order confirmation and artisan tracking link have been dispatched.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#c5a880] text-[#07150e] text-xs uppercase tracking-widest font-cinzel font-semibold rounded hover:bg-[#fae2b4] transition-colors"
              >
                Continue Exploring
              </button>
            </div>
          ) : (
            /* Items List */
            <div className="mt-6 divide-y divide-[#c5a880]/15 max-h-[42vh] overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="py-16 text-center text-[#b89565]">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-[#b89565]/60 mb-3" />
                  <p className="font-serif-luxury text-xl italic text-[#f7f4ee]">
                    Your bag is presently empty
                  </p>
                  <p className="text-xs text-[#a28258] mt-1 font-sans">
                    Explore our handcrafted sarees, kurtas, and kalakaari pieces.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="py-4 flex space-x-3 sm:space-x-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-18 h-24 sm:w-20 sm:h-28 object-cover rounded border border-[#c5a880]/30"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif-luxury text-base text-[#f7f4ee] line-clamp-1">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            aria-label={`Remove ${item.title}`}
                            className="text-[#b89565] hover:text-[#f87171] p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#b89565] font-sans">{item.subtitle}</p>
                        {item.size && (
                          <span className="text-[10px] text-[#e5c378] uppercase tracking-wider font-cinzel">
                            Size: {item.size}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#c5a880]/40 rounded bg-[#07150e]">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            aria-label="Decrease quantity"
                            className="px-2 py-0.5 text-[#c5a880] hover:text-[#fae2b4] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-medium text-[#f7f4ee]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            aria-label="Increase quantity"
                            className="px-2 py-0.5 text-[#c5a880] hover:text-[#fae2b4] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-[#fae2b4]">
                          {formatPrice(item.priceINR * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Bottom Checkout & Promo Section */}
        {!checkoutComplete && items.length > 0 && (
          <div className="pt-4 border-t border-[#c5a880]/20 space-y-3">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter code (e.g. WELCOME10)"
                    className="w-full text-xs px-3 py-2 bg-[#07150e] border border-[#c5a880]/40 rounded text-[#f7f4ee] placeholder-[#b89565]/60 focus:outline-none focus:border-[#fae2b4]"
                  />
                  <Tag className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-[#b89565]" />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 text-xs uppercase tracking-wider font-cinzel text-[#fae2b4] border border-[#c5a880] rounded hover:bg-[#132d20] transition-colors"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <p className="text-[11px] text-[#a8e6cf] flex items-center justify-between">
                  <span>{appliedPromo.message}</span>
                  <button
                    type="button"
                    onClick={() => setAppliedPromo(null)}
                    className="text-[#f87171] hover:underline"
                  >
                    Remove
                  </button>
                </p>
              )}
              {promoError && <p className="text-[11px] text-[#f87171]">{promoError}</p>}
            </form>

            {/* Totals Breakdown */}
            <div className="space-y-1.5 text-xs text-[#e6ded0] pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotalINR, currency)}</span>
              </div>
              {totals.discountINR > 0 && (
                <div className="flex justify-between text-[#a8e6cf]">
                  <span>Promo Discount ({appliedPromo?.percent}%)</span>
                  <span>-{formatPrice(totals.discountINR, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {totals.isFreeShipping ? (
                    <span className="text-[#a8e6cf] font-medium">Free</span>
                  ) : (
                    formatPrice(totals.shippingINR, currency)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif-luxury text-[#fae2b4] pt-2 border-t border-[#c5a880]/20 font-bold">
                <span>Total</span>
                <span>{formatPrice(totals.totalINR, currency)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => onOpenCheckout(totals)}
              className="w-full py-3.5 bg-gradient-to-r from-[#c5a880] via-[#fae2b4] to-[#b89565] text-[#07150e] font-cinzel text-xs uppercase tracking-[0.2em] font-bold rounded flex items-center justify-center space-x-2 shadow-lg hover:brightness-105 active:scale-[0.99] transition-all"
            >
              <span>Proceed To Luxury Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Direct WhatsApp Quick Order */}
            <button
              onClick={() => onOpenCheckout(totals)}
              className="w-full py-2.5 bg-[#0e2719] hover:bg-[#133522] border border-[#25D366]/50 text-[#a8e6cf] font-cinzel text-[11px] uppercase tracking-wider font-semibold rounded flex items-center justify-center space-x-2 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Direct WhatsApp Order (8536943389)</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
