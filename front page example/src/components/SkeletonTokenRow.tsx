import React from 'react';

export const SkeletonTokenRow: React.FC = () => {
  return (
    <div className="flex flex-col relative w-full cursor-default select-none overflow-hidden h-[46px] border-b border-[#1E293B] bg-[#070A10]/20">
      {/* Container simulating the real 46px row height */}
      <div className="flex items-center h-[46px] w-full px-3 md:px-4 py-1.5 gap-2 md:gap-2.5 overflow-hidden animate-pulse">
        
        {/* Placeholder Logo */}
        <div className="flex-shrink-0 relative w-6 h-6 md:w-8 md:h-8 mr-1 md:mr-1.5 border border-[#1E293B] bg-[#1E293B]/40" />

        {/* Name & Description blocks */}
        <div className="flex-grow min-w-0 pr-1.5 flex items-center gap-2">
          <div className="h-3.5 w-16 md:w-20 bg-[#1E293B]/50 rounded-[1px]" />
          <div className="h-3 w-24 md:w-32 bg-[#1E293B]/30 rounded-[1px]" />
        </div>

        {/* Tag Placeholder */}
        <div className="hidden sm:flex w-[75px] md:w-[90px] flex-shrink-0 items-center justify-end mr-1 md:mr-2">
          <div className="h-3.5 w-12 bg-[#1E293B]/40 rounded-[2px]" />
        </div>

        {/* Score Placeholder */}
        <div className="flex-shrink-0 mx-1">
          <div className="w-7 h-7 rounded-full bg-[#1E293B]/50 border-2 border-solid border-[#1E293B]/60" />
        </div>
      </div>
      
      {/* Sweep overlay for a radar processing effect */}
      <div className="absolute inset-0 -translate-x-[100%] animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[#1E293B]/10 to-transparent z-10" style={{ animationTimingFunction: 'linear' }} />
    </div>
  );
};
