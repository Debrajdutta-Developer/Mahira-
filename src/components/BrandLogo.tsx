import React from 'react';
import { OfficialLogo } from './OfficialLogo.tsx';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const sizeClass = {
    sm: 'w-24 sm:w-28',
    md: 'w-36 sm:w-44',
    lg: 'w-52 sm:w-64',
    xl: 'w-72 sm:w-84',
  }[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <OfficialLogo className={`${sizeClass} h-auto select-none`} showWordmark={showSubtitle} />
    </div>
  );
};
export const DiamondDivider: React.FC<{ className?: string }> = ({ className = 'my-6' }) => (
  <div className={`relative flex items-center justify-center w-full max-w-xs mx-auto ${className}`}>
    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#c5a880]/60 to-[#c5a880]/90"></div>
    <div className="mx-3 text-[#d4af37] text-xs transform rotate-45 border border-[#c5a880] w-2 h-2 bg-[#0d1f17]"></div>
    <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#c5a880]/60 to-[#c5a880]/90"></div>
  </div>
);

export const LotusIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-[#c5a880]' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 21c-2-3-4-8-4-12 0-3 2-6 4-6s4 3 4 6c0 4-2 9-4 12z" />
    <path d="M12 21c-4-2-8-6-9-10 1-3 5-4 8-1" />
    <path d="M12 21c4-2 8-6 9-10-1-3-5-4-8-1" />
    <path d="M7 21c-3-1-6-4-6-8 2-1 6 0 7 4" />
    <path d="M17 21c3-1 6-4 6-8-2-1-6 0-7 4" />
  </svg>
);
