import React, { useState } from 'react';
import { ArrowUp, ArrowRight, Instagram, Facebook, Youtube, Check } from 'lucide-react';
import { BrandLogo, DiamondDivider, LotusIcon } from './BrandLogo.tsx';
import { CurrencyCode, CURRENCIES, validateEmail } from '../utils/shop.ts';

// Custom Pinterest and WhatsApp SVGs to match the 5 icons in Screenshot 2
const PinterestIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
  </svg>
);

const WhatsAppIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.031 0C5.398 0 .016 5.383.016 12.016c0 2.115.553 4.179 1.603 5.998L0 24l6.168-1.619a11.968 11.968 0 005.863 1.528h.005c6.632 0 12.014-5.383 12.014-12.016C24.05 5.383 18.663 0 12.031 0zm0 21.916h-.004a9.948 9.948 0 01-5.07-1.393l-.364-.216-3.766.988 1.005-3.673-.237-.377a9.927 9.927 0 01-1.52-5.23c0-5.501 4.476-9.976 9.976-9.976 2.664 0 5.168 1.038 7.051 2.922a9.92 9.92 0 012.92 7.053c0 5.501-4.475 9.976-9.976 9.976zm5.469-7.468c-.3-.15-1.774-.875-2.049-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.494-1.78-1.669-2.08-.175-.3-.019-.462.131-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.584-.492-.505-.675-.514-.175-.009-.375-.011-.575-.011s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.116 3.231 5.127 4.531.716.31 1.275.495 1.711.634.72.228 1.375.196 1.894.118.579-.087 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
  </svg>
);

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenStory: () => void;
  currentCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
  onOpenOwnerPortal?: () => void;
}

export const FooterSection: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenStory,
  currentCurrency,
  onSelectCurrency,
  onOpenOwnerPortal,
}) => {

  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (!agreed) {
      setEmailError('Please agree to receive updates from Mahira Select.');
      return;
    }
    setSubscribed(true);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative bg-[#07150e] text-[#f7f4ee] pt-20 pb-12 px-6 sm:px-12 lg:px-20 border-t border-[#c5a880]/20 overflow-hidden">
      {/* Original Site Background Atmospherics */}
      <img
        src="/assets/f-leaves.jpg"
        alt=""
        aria-hidden="true"
        className="absolute top-0 right-0 w-64 md:w-96 opacity-15 pointer-events-none mix-blend-screen"
      />
      <img
        src="/assets/f-arch.jpg"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-72 md:w-96 opacity-10 pointer-events-none mix-blend-screen"
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        {/* Pre-footer Brand Statement (from Original Site & Screenshot 3) */}
        <div id="manifesto" className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Lotus SVG */}
          <div className="flex justify-center">
            <LotusIcon className="w-8 h-8 text-[#d4af37]" />
          </div>

          <div className="space-y-1">
            <p className="font-cinzel text-xs sm:text-sm uppercase tracking-[0.35em] text-[#fae2b4]">
              More Than Fashion
            </p>
            <p className="font-serif-luxury italic text-2xl sm:text-3xl text-[#d4af37]">
              A Feeling
            </p>
          </div>

          <div className="w-16 h-[1px] bg-[#c5a880]/60 mx-auto"></div>

          <p className="font-serif-luxury text-base sm:text-lg text-[#e6ded0] font-light leading-relaxed">
            Rooted in tradition. Woven for tomorrow. <br />
            Thank you for being a part of our story.
          </p>

          <div className="py-2">
            <BrandLogo size="lg" />
          </div>

          <p className="font-serif-luxury text-sm sm:text-base text-[#c5a880] max-w-xl mx-auto font-light leading-relaxed">
            Thoughtfully curated sarees, kurtas and timeless pieces &mdash; bringing
            India&apos;s finest craftsmanship to your everyday.
          </p>

          {/* Elegant script: Tradition Lives Beautifully */}
          <p className="font-script text-4xl sm:text-5xl text-[#fae2b4] pt-2 drop-shadow-md">
            Tradition Lives Beautifully
          </p>

          <div className="w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-[#c5a880]/50 to-transparent mx-auto pt-4"></div>
        </div>

        {/* Footer Navigation Columns (Screenshots 1, 2, 3) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-6">
          {/* SHOP Column */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#d4af37] pb-1 border-b border-[#c5a880]/40 inline-block">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-sm text-[#e6ded0]">
              {[
                { name: 'New Arrivals', cat: 'all' },
                { name: 'Sarees', cat: 'sarees' },
                { name: 'Kurta Sets', cat: 'kurtas' },
                { name: 'Kalakaari', cat: 'kalamkari' },
                { name: 'Best Sellers', cat: 'all' },
                { name: 'All Collections', cat: 'all' },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => onSelectCategory(item.cat)}
                    className="hover:text-[#fae2b4] transition-colors text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ABOUT Column */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#d4af37] pb-1 border-b border-[#c5a880]/40 inline-block">
              ABOUT
            </h4>
            <ul className="space-y-2.5 text-sm text-[#e6ded0]">
              {[
                { name: 'Our Story', action: onOpenStory },
                { name: 'The Complete Journey', action: onOpenStory },
                { name: 'Craftsmanship', action: () => document.getElementById('craftsmanship')?.scrollIntoView({ behavior: 'smooth' }) },
                { name: 'Sustainability', action: onOpenStory },
                { name: 'Journal', action: onOpenStory },
                { name: 'Care Guide', action: onOpenStory },
                { name: 'Contact Us', action: () => {} },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={item.action}
                    className="hover:text-[#fae2b4] transition-colors text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* HELP Column (Screenshot 1) */}
          <div id="help" className="space-y-4">
            <h4 className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#d4af37] pb-1 border-b border-[#c5a880]/40 inline-block">
              HELP
            </h4>
            <ul className="space-y-2.5 text-sm text-[#e6ded0]">
              {[
                'Track Your Order',
                'Shipping & Delivery',
                'Returns & Exchanges',
                'Size Guide',
                'FAQs',
                'Contact Support',
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={onOpenStory}
                    className="hover:text-[#fae2b4] transition-colors text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* STAY IN TOUCH Column (Screenshot 2) */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#d4af37] pb-1 border-b border-[#c5a880]/40 inline-block">
              STAY IN TOUCH
            </h4>
            <p className="text-xs text-[#e6ded0] font-sans leading-relaxed">
              Be the first to know about new collections, exclusive offers and
              stories from our artisans.
            </p>

            {/* Newsletter Subscription Form */}
            <form onSubmit={handleSubscribe} className="space-y-3 pt-1">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full text-xs pl-4 pr-12 py-3 bg-[#0d2217] border border-[#c5a880]/60 rounded-full text-[#f7f4ee] placeholder-[#b89565] focus:outline-none focus:border-[#fae2b4]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="absolute right-1 w-9 h-9 rounded-full bg-[#c5a880] text-[#07150e] flex items-center justify-center hover:bg-[#fae2b4] transition-colors cursor-pointer shadow-md"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2]" />
                </button>
              </div>

              {/* Consent checkbox */}
              <label className="flex items-start space-x-2 text-[11px] text-[#b89565] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-[#c5a880] text-[#c5a880] focus:ring-0 bg-[#07150e]"
                />
                <span>I agree to receive updates from Mahira Select.</span>
              </label>

              {emailError && (
                <p className="text-[11px] text-[#f87171]">{emailError}</p>
              )}
              {subscribed && (
                <p className="text-[11px] text-[#a8e6cf] flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  Thank you! Welcome to the Mahira Select circle.
                </p>
              )}
            </form>

            {/* Social Icons 5-item row (Screenshot 2) */}
            <div className="flex items-center space-x-3 pt-3">
              {[
                { name: 'Instagram', icon: <Instagram className="w-4 h-4" />, href: '#instagram' },
                { name: 'Facebook', icon: <Facebook className="w-4 h-4" />, href: '#facebook' },
                { name: 'Pinterest', icon: <PinterestIcon className="w-4 h-4" />, href: '#pinterest' },
                { name: 'YouTube', icon: <Youtube className="w-4 h-4" />, href: '#youtube' },
                { name: 'WhatsApp', icon: <WhatsAppIcon className="w-4 h-4" />, href: 'https://wa.me/918536943389' },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target={s.name === 'WhatsApp' ? '_blank' : undefined}
                  rel={s.name === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                  aria-label={`Connect with Mahira Select on ${s.name}`}
                  className="w-9 h-9 rounded-full border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880] hover:text-[#fae2b4] hover:border-[#fae2b4] hover:bg-[#132d20] transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Diamond Divider (Screenshot 2) */}
        <DiamondDivider />

        {/* Bottom Bar: Copyright, Legal, Currency, Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 text-xs text-[#b89565]">
          <p>© 2025 Mahira Select. All rights reserved.</p>

          <div className="flex items-center space-x-4">
            <button onClick={onOpenStory} className="hover:text-[#fae2b4]">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onOpenStory} className="hover:text-[#fae2b4]">
              Terms & Conditions
            </button>
            <span>•</span>
            <button onClick={onOpenStory} className="hover:text-[#fae2b4]">
              Sitemap
            </button>
            {onOpenOwnerPortal && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenOwnerPortal}
                  className="px-2.5 py-0.5 rounded bg-[#102b1c] border border-[#c5a880]/50 text-[#fae2b4] hover:text-white hover:bg-[#183d29] font-cinzel font-semibold tracking-wider text-[11px] transition-all"
                  title="Store Owner Portal: View live orders, audit UTR & Bank statements"
                >
                  👑 Owner Portal &amp; Gateway
                </button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-6">
            {/* Currency selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[#e6ded0]">
                {CURRENCIES[currentCurrency].code} ({CURRENCIES[currentCurrency].symbol})
              </span>
              <select
                value={currentCurrency}
                onChange={(e) => onSelectCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent border border-[#c5a880]/40 text-[#fae2b4] text-xs rounded px-2 py-0.5 focus:outline-none focus:border-[#fae2b4] cursor-pointer"
                aria-label="Select Currency"
              >
                {Object.keys(CURRENCIES).map((c) => (
                  <option key={c} value={c} className="bg-[#07150e] text-[#f7f4ee]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Back to top button (Screenshot 2) */}
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-[#e6ded0] hover:text-[#fae2b4] group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full border border-[#c5a880]/50 flex items-center justify-center group-hover:border-[#fae2b4] group-hover:bg-[#132d20] transition-colors">
                <ArrowUp className="w-4 h-4 text-[#c5a880] group-hover:text-[#fae2b4]" />
              </div>
              <span className="font-cinzel text-[10px] tracking-widest uppercase">
                BACK TO TOP
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
