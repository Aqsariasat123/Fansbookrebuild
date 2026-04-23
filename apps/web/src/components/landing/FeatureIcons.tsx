const FROM = '#01adf1';
const TO = '#a61651';

export const FEATURE_ICONS: Record<string, React.ReactNode> = {
  Earnings: (
    <svg viewBox="0 0 56 56" fill="none" className="h-[64px] w-[64px]">
      <defs>
        <linearGradient id="gi-earn" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor={FROM} />
          <stop offset="1" stopColor={TO} />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="37" rx="13" ry="4" stroke="url(#gi-earn)" strokeWidth="2" />
      <line x1="11" y1="33" x2="11" y2="37" stroke="url(#gi-earn)" strokeWidth="2" />
      <line x1="37" y1="33" x2="37" y2="37" stroke="url(#gi-earn)" strokeWidth="2" />
      <ellipse cx="24" cy="33" rx="13" ry="4" stroke="url(#gi-earn)" strokeWidth="2" />
      <line x1="11" y1="29" x2="11" y2="33" stroke="url(#gi-earn)" strokeWidth="2" />
      <line x1="37" y1="29" x2="37" y2="33" stroke="url(#gi-earn)" strokeWidth="2" />
      <ellipse cx="24" cy="29" rx="13" ry="4" stroke="url(#gi-earn)" strokeWidth="2" />
      <path
        d="M40 22L46 15L52 22"
        stroke="url(#gi-earn)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="46"
        y1="15"
        x2="46"
        y2="32"
        stroke="url(#gi-earn)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Streaming: (
    <svg viewBox="0 0 56 56" fill="none" className="h-[64px] w-[64px]">
      <defs>
        <linearGradient id="gi-stream" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor={FROM} />
          <stop offset="1" stopColor={TO} />
        </linearGradient>
      </defs>
      <circle cx="28" cy="31" r="10" stroke="url(#gi-stream)" strokeWidth="2" />
      <path d="M25 27l10 4-10 4V27z" fill="url(#gi-stream)" />
      <path
        d="M13 20a21.2 21.2 0 0130 0"
        stroke="url(#gi-stream)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 13a30 30 0 0142 0"
        stroke="url(#gi-stream)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="47" cy="13" r="3.5" fill="url(#gi-stream)" />
    </svg>
  ),
  AITools: (
    <svg viewBox="0 0 56 56" fill="none" className="h-[64px] w-[64px]">
      <defs>
        <linearGradient id="gi-ai" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor={FROM} />
          <stop offset="1" stopColor={TO} />
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="12" stroke="url(#gi-ai)" strokeWidth="2" />
      <circle cx="28" cy="28" r="4.5" stroke="url(#gi-ai)" strokeWidth="2" />
      <line x1="28" y1="16" x2="28" y2="23.5" stroke="url(#gi-ai)" strokeWidth="2" />
      <line x1="28" y1="32.5" x2="28" y2="40" stroke="url(#gi-ai)" strokeWidth="2" />
      <line x1="16" y1="28" x2="23.5" y2="28" stroke="url(#gi-ai)" strokeWidth="2" />
      <line x1="32.5" y1="28" x2="40" y2="28" stroke="url(#gi-ai)" strokeWidth="2" />
      <circle cx="9" cy="9" r="3" stroke="url(#gi-ai)" strokeWidth="1.5" />
      <circle cx="47" cy="9" r="3" stroke="url(#gi-ai)" strokeWidth="1.5" />
      <circle cx="9" cy="47" r="3" stroke="url(#gi-ai)" strokeWidth="1.5" />
      <circle cx="47" cy="47" r="3" stroke="url(#gi-ai)" strokeWidth="1.5" />
      <line x1="12" y1="12" x2="18" y2="18" stroke="url(#gi-ai)" strokeWidth="1.5" />
      <line x1="44" y1="12" x2="38" y2="18" stroke="url(#gi-ai)" strokeWidth="1.5" />
      <line x1="12" y1="44" x2="18" y2="38" stroke="url(#gi-ai)" strokeWidth="1.5" />
      <line x1="44" y1="44" x2="38" y2="38" stroke="url(#gi-ai)" strokeWidth="1.5" />
    </svg>
  ),
  Security: (
    <svg viewBox="0 0 56 56" fill="none" className="h-[64px] w-[64px]">
      <defs>
        <linearGradient id="gi-sec" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor={FROM} />
          <stop offset="1" stopColor={TO} />
        </linearGradient>
      </defs>
      <path
        d="M28 5L9 13.5v14c0 11 8.5 20.5 19 23 10.5-2.5 19-12 19-23v-14L28 5z"
        stroke="url(#gi-sec)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="21" y="26" width="14" height="11" rx="2" stroke="url(#gi-sec)" strokeWidth="2" />
      <path
        d="M23 26v-3a5 5 0 0110 0v3"
        stroke="url(#gi-sec)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="28" cy="32" r="2" fill="url(#gi-sec)" />
    </svg>
  ),
  Engagement: (
    <svg viewBox="0 0 56 56" fill="none" className="h-[64px] w-[64px]">
      <defs>
        <linearGradient id="gi-eng" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor={FROM} />
          <stop offset="1" stopColor={TO} />
        </linearGradient>
      </defs>
      <path
        d="M6 13h28a4 4 0 014 4v12a4 4 0 01-4 4H18l-8 6v-6H6a4 4 0 01-4-4V17a4 4 0 014-4z"
        stroke="url(#gi-eng)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line
        x1="11"
        y1="23"
        x2="28"
        y2="23"
        stroke="url(#gi-eng)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="28"
        x2="21"
        y2="28"
        stroke="url(#gi-eng)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="44" cy="20" r="8" stroke="url(#gi-eng)" strokeWidth="2" />
      <path
        d="M44 16l1.5 3 3.3.5-2.4 2.3.6 3.2L44 23.5l-3 1.5.6-3.2-2.4-2.3 3.3-.5z"
        stroke="url(#gi-eng)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
