import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color';
  showTagline?: boolean;
}

export const BuloloLogo: React.FC<LogoProps> = ({
  className = 'h-10',
  variant = 'color',
  showTagline = false
}) => {
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Original Emblem: Mountain Range, Forest Silhouette, Warm Gold Rising Sun */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Circular shield background */}
          <circle cx="50" cy="50" r="48" fill={isLight ? '#2d6a4f' : '#1b4332'} stroke="#d4af37" strokeWidth="3" />
          
          {/* Warm Gold Sun Rising over Morobe Mountains */}
          <circle cx="50" cy="40" r="16" fill="#d4af37" opacity="0.9" />
          <path d="M50 16 L50 22 M33 23 L37 28 M67 23 L63 28 M26 40 L32 40 M74 40 L68 40" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" />

          {/* Mountains (Kuper & Herzog Range backdrop of Bulolo) */}
          <path d="M12 76 L38 42 L62 76 Z" fill="#2d6a4f" opacity="0.95" />
          <path d="M38 76 L65 36 L90 76 Z" fill="#40916c" opacity="0.9" />
          <path d="M22 76 L48 50 L72 76 Z" fill="#1b4332" />

          {/* Golden River / Connect Ribbon (Bulolo & Watut Rivers) */}
          <path d="M18 84 C38 78, 62 88, 82 82 C65 88, 35 84, 18 84 Z" fill="#d4af37" />

          {/* Pine / Forest Tree Symbol (Bulolo Forestry & Nature Heritage) */}
          <path d="M50 56 L44 65 L48 65 L42 74 L58 74 L52 65 L56 65 Z" fill="#d8f3dc" />
          <rect x="49" y="74" width="2" height="4" fill="#d8f3dc" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-xl ${isLight ? 'text-white' : 'text-bulolo-forest'}`}>
            BULOLO
          </span>
          <span className="font-extrabold tracking-tight text-xl text-bulolo-gold">
            CONNECT
          </span>
        </div>
        {showTagline && (
          <span className={`text-[10px] tracking-wide font-medium uppercase mt-0.5 ${isLight ? 'text-emerald-100' : 'text-bulolo-muted'}`}>
            One District • One Community
          </span>
        )}
      </div>
    </div>
  );
};
