interface HanoiLogoProps {
  className?: string;
  size?: number;
}

export function HanoiLogo({ className = "h-10 w-10", size = 40 }: HanoiLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-label="Tower of Hanoi emblem"
    >
      <defs>
        {/* Background Gradient */}
        <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#202636" />
          <stop offset="100%" stopColor="#0c0e14" />
        </linearGradient>

        {/* Metallic Rod Gradient */}
        <linearGradient id="logoRod" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="45%" stopColor="#94a3b8" />
          <stop offset="80%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Base Plinth Gradient */}
        <linearGradient id="logoBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#333d52" />
          <stop offset="100%" stopColor="#161b26" />
        </linearGradient>

        {/* Disk 1 (Amber Gold) */}
        <linearGradient id="logoDisk1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Disk 2 (Terracotta) */}
        <linearGradient id="logoDisk2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>

        {/* Disk 3 (Crimson) */}
        <linearGradient id="logoDisk3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
      </defs>

      {/* Squircle Canvas Frame */}
      <rect
        width="64"
        height="64"
        rx="16"
        fill="url(#logoBg)"
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth="1.5"
      />

      {/* Solid Milled Base Plinth */}
      <rect
        x="7"
        y="47"
        width="50"
        height="7"
        rx="2.5"
        fill="url(#logoBase)"
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth="0.75"
      />
      <line
        x1="8"
        y1="47.5"
        x2="56"
        y2="47.5"
        stroke="rgba(255, 255, 255, 0.25)"
        strokeWidth="0.75"
      />

      {/* 3 Stainless Metallic Rods */}
      <rect x="16.5" y="16" width="3" height="31" rx="1.5" fill="url(#logoRod)" />
      <rect x="30.5" y="16" width="3" height="31" rx="1.5" fill="url(#logoRod)" />
      <rect x="44.5" y="16" width="3" height="31" rx="1.5" fill="url(#logoRod)" />

      {/* Stacked Stepped Disks on Peg A */}
      {/* Disk 3 (Bottom) */}
      <rect
        x="8"
        y="41"
        width="20"
        height="5.5"
        rx="2"
        fill="url(#logoDisk3)"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="0.6"
      />
      <line
        x1="9"
        y1="41.5"
        x2="27"
        y2="41.5"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="0.6"
      />

      {/* Disk 2 (Middle) */}
      <rect
        x="10.5"
        y="34.5"
        width="15"
        height="5.5"
        rx="2"
        fill="url(#logoDisk2)"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="0.6"
      />
      <line
        x1="11.5"
        y1="35"
        x2="24.5"
        y2="35"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="0.6"
      />

      {/* Disk 1 (Top) */}
      <rect
        x="13"
        y="28"
        width="10"
        height="5.5"
        rx="1.8"
        fill="url(#logoDisk1)"
        stroke="rgba(255, 255, 255, 0.25)"
        strokeWidth="0.6"
      />
      <line
        x1="14"
        y1="28.5"
        x2="22"
        y2="28.5"
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth="0.6"
      />

      {/* Dynamic Motion Arc (Subtle trajectory to Peg C) */}
      <path
        d="M 18 25 C 26 12, 38 12, 46 22"
        fill="none"
        stroke="rgba(245, 158, 11, 0.45)"
        strokeWidth="1.2"
        strokeDasharray="2 2"
        strokeLinecap="round"
      />
    </svg>
  );
}

