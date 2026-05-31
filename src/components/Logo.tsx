import { useTheme } from './ThemeContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const { theme } = useTheme();

  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  }[size];

  return (
    <div className={`relative flex items-center justify-center ${dimensions} ${className}`} id="cacador_metas_logo">
      {/* Golden glow matching the theme */}
      <div className="absolute inset-0 bg-amber-400/20 dark:bg-emerald-500/10 blur-xl rounded-full animate-pulse pointer-events-none" />
      
      {/* SVG Vector Drawing of Open Envelope filled with Bills */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none relative z-10"
      >
        {/* Money Bill 1 (Back, Rotated) */}
        <g transform="rotate(-15, 50, 45)">
          <rect x="25" y="15" width="50" height="30" rx="3" fill="#10B981" />
          <rect x="29" y="19" width="42" height="22" rx="1.5" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.4" />
          <circle cx="50" cy="30" r="6" fill="#059669" />
          <text x="50" y="33.5" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">$</text>
        </g>

        {/* Money Bill 2 (Front, Less Rotated/Centered) */}
        <g transform="rotate(8, 52, 45)">
          <rect x="28" y="18" width="50" height="30" rx="3" fill="#F59E0B" />
          <rect x="32" y="22" width="42" height="22" rx="1.5" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="53" cy="33" r="6" fill="#D97706" />
          <text x="53" y="36.5" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">$</text>
        </g>

        {/* Money Bill 3 (Right tilting, Emerald) */}
        <g transform="rotate(-4, 48, 48)">
          <rect x="22" y="22" width="50" height="30" rx="3" fill="#34D399" />
          <rect x="26" y="26" width="42" height="22" rx="1.5" stroke="#FFFFFF" strokeWidth="0.8" fill="none" opacity="0.5" />
          <circle cx="47" cy="37" r="5" fill="#10B981" />
          <text x="47" y="40.5" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">$</text>
        </g>

        {/* Envelope Back Panel */}
        <path
          d="M10 50h80v35a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5V50z"
          fill="#065F46"
        />

        {/* Envelope Inside Cover Shadow */}
        <path
          d="M10 50l40 25 40-25V48H10v2z"
          fill="#047857"
          opacity="0.9"
        />

        {/* Envelope Open V-Flap (Top folded backwards behind bills) */}
        <path
          d="M10 50l40-30 40 30"
          stroke="#065F46"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Envelope Front Left Flap */}
        <path
          d="M10 50l40 28V90H15a5 5 0 0 1-5-5V50z"
          fill="#059669"
        />

        {/* Envelope Front Right Flap */}
        <path
          d="M90 50L50 78V90h35a5 5 0 0 0 5-5V50z"
          fill="#059669"
        />

        {/* Envelope Front Bottom Triangle/Flap overlaying center */}
        <path
          d="M10 88l40-30 40 30"
          fill="#10B981"
          stroke="#059669"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        
        {/* Small gold dollar badge in front of the envelope fold */}
        <circle cx="50" cy="74" r="5" fill="#F59E0B" />
        <text x="50" y="77" fill="#FFFFFF" fontSize="8" fontWeight="extrabold" textAnchor="middle">$</text>
      </svg>
    </div>
  );
}
