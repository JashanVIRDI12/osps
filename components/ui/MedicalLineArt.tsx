/** Lilac Mist wireframe medical devices for the dark hero. */
export function MedicalLineArt({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 420 560"
      fill="none"
      className={className}
      focusable="false"
    >
      {/* Laptop */}
      <rect
        x="48"
        y="280"
        width="220"
        height="140"
        rx="10"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M40 420h236"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M80 320h40M80 340h70M80 360h55"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M180 318c0 28-22 42-42 50"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="180" cy="318" r="4" stroke="currentColor" strokeWidth="1.5" />

      {/* Heart-rate monitor */}
      <rect
        x="210"
        y="72"
        width="170"
        height="120"
        rx="12"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M230 132h28l12-28 16 56 14-36h50"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="248" cy="96" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="268" cy="96" r="4" stroke="currentColor" strokeWidth="1.5" />

      {/* Stethoscope */}
      <path
        d="M92 88c0-28 22-50 50-50s50 22 50 50v78"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M92 88v40c0 36 28 64 64 64h18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="192" cy="192" r="22" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="192" cy="192" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="92" cy="88" r="8" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="192" cy="88" r="8" stroke="currentColor" strokeWidth="1.75" />

      {/* Pill bottle */}
      <rect
        x="310"
        y="250"
        width="58"
        height="90"
        rx="10"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M318 250v-14c0-6 5-12 14-12h14c9 0 14 6 14 12v14"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M324 286h30M324 304h22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Cross mark */}
      <circle cx="340" cy="420" r="36" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M340 400v40M320 420h40"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
