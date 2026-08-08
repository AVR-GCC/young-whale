import { Pin } from 'lucide-react';

interface RatingBadgeProps {
  isPromoted: boolean;
  isExpired: boolean;
  isHovered: boolean;
  rating?: number | null;
  themeColor: string;
}

export default function RatingBadge({ isPresale, isPromoted, isExpired, isHovered, rating, themeColor }: RatingBadgeProps) {
  if (isPromoted) {
    return (
      <div
        id="pin-holder"
        className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-950/50 font-oxanium text-[14px] font-extrabold select-none border-2 border-solid transition-all duration-300"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.2)',
          color: 'rgba(255, 255, 255, 0.3)',
          boxShadow: 'none',
        }}
      >
        <Pin className="w-3.5 h-3.5" />
      </div>
    );
  }

  if (isExpired) {
    return (
      <div
        id="hourglass-holder"
        className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-950/50 font-oxanium text-[14px] font-extrabold select-none border-2 border-solid transition-all duration-300"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.2)',
          color: 'rgba(255, 255, 255, 0.3)',
          boxShadow: 'none',
        }}
      >
        {isPresale ? <>👁️︎</>  :(
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <path d="M5 22h14" />
            <path d="M5 2h14" />
            <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
            <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
            <path d="M7 22v-4.172a2 2 0 0 1 .586-1.414L12 12l4.414 4.414a2 2 0 0 1 .586 1.414V22H7z" fill="currentColor" stroke="none" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <div
      id="rating-holder"
      className={`w-7 h-7 rounded-full flex items-center justify-center bg-slate-950/50 font-oxanium text-[14px] font-extrabold select-none border-2 border-solid transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}
      style={{
        borderColor: '#FFFFFF',
        color: '#FFFFFF',
        boxShadow: (rating && rating >= 9) ? `0 0 12px ${themeColor}40` : (isHovered ? `0 0 10px ${themeColor}60` : 'none'),
      }}
    >
      {rating}
    </div>
  );
}
