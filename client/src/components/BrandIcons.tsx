/**
 * Official La Mare Iconography
 * Thin stroke in Dourado Mare (#C5A059)
 * Represents: Surf, Mar, Sol, Natureza
 */

interface BrandIconProps {
  className?: string;
  color?: string;
}

export function SurfIcon({ className = "w-6 h-6", color = "#C5A059" }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth="1.5">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
      <path d="M8 14c1.1 0 2-.9 2-2m8 2c-1.1 0-2-.9-2-2" />
      <path d="M12 18v-4" />
    </svg>
  );
}

export function MarIcon({ className = "w-6 h-6", color = "#C5A059" }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth="1.5">
      <path d="M3 12c0 0 3-4 9-4s9 4 9 4" />
      <path d="M3 16c0 0 3-3 9-3s9 3 9 3" />
      <path d="M3 20c0 0 3-2 9-2s9 2 9 2" />
      <circle cx="12" cy="8" r="1" fill={color} />
    </svg>
  );
}

export function SolIcon({ className = "w-6 h-6", color = "#C5A059" }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth="1.5">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export function NaturezaIcon({ className = "w-6 h-6", color = "#C5A059" }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth="1.5">
      <path d="M12 2c-2 0-4 1-5 3-1 2-1 4 0 6 1 2 3 3 5 3s4-1 5-3c1-2 1-4 0-6-1-2-3-3-5-3z" />
      <path d="M7 10c-1 1-2 3-2 5 0 3 2 5 5 5s5-2 5-5c0-2-1-4-2-5" />
      <path d="M10 15v4M14 15v4M12 15v5" />
    </svg>
  );
}

/**
 * Brand Icon Set Component
 * Usage: <BrandIconSet type="surf" />
 */
export function BrandIconSet({
  type,
  className = "w-8 h-8",
  color = "#C5A059",
}: {
  type: "surf" | "mar" | "sol" | "natureza";
  className?: string;
  color?: string;
}) {
  const icons = {
    surf: <SurfIcon className={className} color={color} />,
    mar: <MarIcon className={className} color={color} />,
    sol: <SolIcon className={className} color={color} />,
    natureza: <NaturezaIcon className={className} color={color} />,
  };

  return icons[type];
}
