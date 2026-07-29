import type { SVGProps } from 'react';

// Единый набор line-иконок (без внешних зависимостей), используется по всему приложению.
type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

export const IconMapPin = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const IconRoute = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="6" cy="19" r="2" />
    <circle cx="18" cy="5" r="2" />
    <path d="M8 19h7a3 3 0 0 0 3-3v-1a3 3 0 0 0-3-3H9a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h7" />
  </svg>
);

export const IconCalendar = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);

export const IconTruck = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M1 4h13v11H1z" />
    <path d="M14 9h4l4 4v2h-8z" />
    <circle cx="6" cy="17.5" r="1.7" />
    <circle cx="17.5" cy="17.5" r="1.7" />
  </svg>
);

export const IconBox = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m3 8 9-5 9 5-9 5-9-5Z" />
    <path d="M3 8v8l9 5 9-5V8M12 13v8" />
  </svg>
);

export const IconCoins = (p: IconProps) => (
  <svg {...base(p)}>
    <ellipse cx="9" cy="7" rx="6" ry="3" />
    <path d="M3 7v5c0 1.66 2.69 3 6 3s6-1.34 6-3V7" />
    <path d="M3 12v5c0 1.66 2.69 3 6 3 1.13 0 2.19-.19 3.06-.52" />
    <ellipse cx="17" cy="13" rx="4" ry="2.2" />
    <path d="M13 13v4c0 1.2 1.79 2.2 4 2.2s4-1 4-2.2v-4" />
  </svg>
);

export const IconUsers = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20c.7-3.4 3.3-5.4 6.5-5.4s5.8 2 6.5 5.4" />
    <circle cx="17.5" cy="8.5" r="2.6" />
    <path d="M16.2 14.8c2.5.4 4.4 2.2 5 4.9" />
  </svg>
);

export const IconTrophy = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
    <path d="M8 5H4v2a4 4 0 0 0 4 4M16 5h4v2a4 4 0 0 1-4 4" />
    <path d="M12 13v3M9 20h6M9 20c0-1.5.7-2.3 1.5-2.7M15 20c0-1.5-.7-2.3-1.5-2.7" />
  </svg>
);

export const IconClose = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconFilter = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5h16M7 12h10M10 19h4" />
  </svg>
);

export const IconChevronLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const IconChevronRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const IconChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconChevronsLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M18 6l-6 6 6 6M11 6l-6 6 6 6" />
  </svg>
);

export const IconChevronsRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l6 6-6 6M13 6l6 6-6 6" />
  </svg>
);

export const IconAlertCircle = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16h.01" />
  </svg>
);

export const IconCheckCircle = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.3 2.3L15.5 9.5" />
  </svg>
);

export const IconInbox = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 12h4.5l1.5 3h6l1.5-3H21" />
    <path d="M5.4 5h13.2L21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6L5.4 5Z" />
  </svg>
);

export const IconLock = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 1 1 8 0v4" />
  </svg>
);

export const IconEyeOff = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5" />
    <path d="M6.1 6.6C4 8.1 2.5 10.2 1.5 12c1.6 3.2 5.2 7 10.5 7 1.9 0 3.6-.5 5-1.3M12 5c5.3 0 8.9 3.8 10.5 7-.6 1.1-1.4 2.3-2.4 3.4" />
  </svg>
);

export const IconPhone = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.6 21 3 14.4 3 6a2 2 0 0 1 1-2Z" />
  </svg>
);

export const IconMail = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const IconBuilding = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="3" width="10" height="18" />
    <rect x="14" y="8" width="6" height="13" />
    <path d="M7 7h1M7 11h1M7 15h1M10 7h1M10 11h1M10 15h1" />
  </svg>
);

export const IconWallet = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" />
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <circle cx="16.5" cy="13.5" r="1.5" />
  </svg>
);

export const IconGavel = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m14 5 5 5" />
    <path d="m6.5 12.5 5-5 4 4-5 5z" />
    <path d="M3 21h9" />
    <path d="m10 14-6 6" />
  </svg>
);

export const IconSpinner = (p: IconProps) => (
  <svg {...base(p)} className={`animate-spin ${p.className ?? ''}`}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);
