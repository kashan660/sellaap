import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export function BrandLogo({ className = "h-8 w-auto", variant = 'full' }: BrandLogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox={variant === 'icon' ? "0 0 50 60" : "0 0 200 50"} 
      fill="none" 
      className={className}
      aria-label="Sellaap Logo"
    >
      <defs>
        <linearGradient id="brandGradient_component" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>

      <g transform="translate(5, 5)">
        <path d="M10 10 L 25 10 Q 35 10 35 20 Q 35 30 25 30 L 15 30 Q 5 30 5 40 Q 5 50 15 50 L 30 50" 
              stroke="url(#brandGradient_component)" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none" />
        <circle cx="35" cy="10" r="3" fill="#d946ef" />
        <circle cx="5" cy="50" r="3" fill="#6366f1" />
      </g>

      {variant === 'full' && (
        <text x="55" y="38" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="800" fontSize="32" fill="currentColor" letterSpacing="-1">
          Sell<tspan fill="url(#brandGradient_component)">aap</tspan>
        </text>
      )}
    </svg>
  );
}
