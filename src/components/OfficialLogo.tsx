import React from 'react';
import { MAHIRA_LOGO } from '../data/emblem-data.ts';

interface OfficialLogoProps {
  className?: string;
  showWordmark?: boolean;
}

export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  className = 'w-48 h-auto',
  showWordmark = true,
}) => {
  const D = MAHIRA_LOGO;
  const EC = { x: D.center.x, y: D.center.y };
  const ornaments = [...D.orn.ne, ...D.orn.nw, ...D.orn.se, ...D.orn.sw];

  return (
    <svg
      viewBox="0 0 1600 1351"
      role="img"
      aria-label="Mahira Select"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gold Gradients matching original source */}
        <linearGradient
          id="lgGold"
          gradientUnits="userSpaceOnUse"
          x1="430"
          y1="120"
          x2="1180"
          y2="850"
        >
          <stop offset="0%" stopColor="#8a6420" />
          <stop offset="32%" stopColor="#c9a35f" />
          <stop offset="50%" stopColor="#f0d48c" />
          <stop offset="68%" stopColor="#c9a35f" />
          <stop offset="100%" stopColor="#7c5a1d" />
        </linearGradient>

        <linearGradient
          id="lgWmGold"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="1000"
          x2="1600"
          y2="1180"
        >
          <stop offset="0%" stopColor="#9a7226" />
          <stop offset="30%" stopColor="#d9b269" />
          <stop offset="50%" stopColor="#f2d896" />
          <stop offset="70%" stopColor="#d9b269" />
          <stop offset="100%" stopColor="#9a7226" />
        </linearGradient>

        <linearGradient
          id="lgSelGold"
          gradientUnits="userSpaceOnUse"
          x1="280"
          y1="0"
          x2="1320"
          y2="0"
        >
          <stop offset="0%" stopColor="#8a6420" />
          <stop offset="45%" stopColor="#e7c87f" />
          <stop offset="60%" stopColor="#f0d48c" />
          <stop offset="100%" stopColor="#8a6420" />
        </linearGradient>

        {/* Specular Sheen Sweep Clip */}
        <clipPath id="lgSheenClip">
          <rect x="-420" y="240" width="260" height="480" transform="skewX(-18)" />
        </clipPath>
      </defs>

      <g id="lgAll">
        {/* Emblem Crest */}
        <g id="lgEmblem">
          {/* Ring */}
          <circle
            id="lgRing"
            cx={EC.x}
            cy={EC.y}
            r={D.ring.r}
            fill="none"
            stroke="url(#lgGold)"
            strokeWidth={D.ring.w + 1}
          />

          {/* Letter M Fill */}
          <path d={D.m.d} fill="url(#lgGold)" fillRule="evenodd" />

          {/* Diamonds N, S, E, W */}
          {(['n', 's', 'e', 'w'] as const).map((k) =>
            D.diamonds[k] ? (
              <path
                key={k}
                d={D.diamonds[k].d}
                fill="url(#lgGold)"
                fillRule="evenodd"
                className={`lg-dia lg-dia-${k}`}
              />
            ) : null
          )}

          {/* Ornaments */}
          {ornaments.map((orn, idx) => (
            <path
              key={idx}
              d={orn.d}
              fill="url(#lgGold)"
              fillRule="evenodd"
              className="lg-orn"
            />
          ))}
        </g>

        {/* Wordmark MAHIRA & SELECT */}
        {showWordmark && (
          <g id="lgWordmark">
            {/* Letters M A H I R A */}
            {D.mahira.map((letter, idx) => (
              <path
                key={idx}
                d={letter.d}
                fill="url(#lgWmGold)"
                fillRule="evenodd"
              />
            ))}

            {/* Subtitle S E L E C T Letters */}
            {D.select.letters.map((letter, idx) => (
              <path
                key={idx}
                d={letter.d}
                fill="url(#lgSelGold)"
                fillRule="evenodd"
              />
            ))}

            {/* Subtitle Accent Lines */}
            {D.select.lines.map((line, idx) => (
              <rect
                key={idx}
                x={line.x}
                y={line.y}
                width={line.w}
                height={line.h}
                fill="url(#lgSelGold)"
              />
            ))}
          </g>
        )}
      </g>
    </svg>
  );
};
