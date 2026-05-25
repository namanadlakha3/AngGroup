export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Luxury Heritage Crest SVG */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M50 5L90 30V85H10V30L50 5Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M50 15L80 35V75H20V35L50 15Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeDasharray="4 4"
        />
        {/* Arch / Gate inside */}
        <path
          d="M35 85V55C35 45 40 40 50 40C60 40 65 45 65 55V85"
          stroke="currentColor"
          strokeWidth="4"
        />
        <circle cx="50" cy="55" r="4" fill="currentColor" />
      </svg>
      <div className="flex flex-col">
        <span className="text-2xl font-serif leading-none tracking-wide">
          AngGroup
        </span>
        <span className="text-[8px] uppercase tracking-[0.2em] font-sans opacity-70 mt-1">
          Builders & Developers
        </span>
      </div>
    </div>
  );
}
