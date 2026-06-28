import React from 'react';
import { TokenItem } from '../types';
import { TokenRowComponent } from './TokenRowComponent';
import { SkeletonTokenRow } from './SkeletonTokenRow';
import { CustomTooltip } from './CustomTooltip';

interface CategoryBlockProps {
  title: string;
  tooltipText: string;
  headerColor: string;
  tokensList: TokenItem[];
  promotedList: TokenItem[];
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  skeletonPrefix: string;
  isLoading: boolean;
  selectedToken: TokenItem | null;
  setSelectedToken: (token: TokenItem | null) => void;
  playAudioFeedback: (action: string) => void;
  handleTagClick: (tag: string) => void;
  emptyMessage?: string;
}

export const CategoryBlock: React.FC<CategoryBlockProps> = ({
  title,
  tooltipText,
  headerColor,
  tokensList,
  promotedList,
  limit,
  setLimit,
  skeletonPrefix,
  isLoading,
  selectedToken,
  setSelectedToken,
  playAudioFeedback,
  handleTagClick,
  emptyMessage = "NO CHANNELS DISCOVERED UNDER ACTIVE SCAN SECTORS"
}) => {

  // Sort all tokens by scoreValue (highest first)
  const sortedTokens = [...tokensList].sort((a, b) => {
    const scoreA = a.scoreValue ?? 0;
    const scoreB = b.scoreValue ?? 0;
    return scoreB - scoreA;
  });

  const activeTokens = sortedTokens.filter(t => t.scoreType !== 'expired');
  const expiredTokens = sortedTokens.filter(t => t.scoreType === 'expired');
  const expiredTokenToDisplay = expiredTokens[0];
  const sliced = activeTokens.slice(0, limit - (expiredTokenToDisplay ? 1 : 0));
  // Promoted are no longer appended to the combined list! 
  // Wait, let's look at the original code.
  // Original code appends promoted projects to the end.
  const combined = [...sliced, ...promotedList];

  return (
    <div className="flex flex-col bg-[#0B0F19] rounded-xl overflow-hidden border border-[#1E293B]/40 transition-colors break-inside-avoid">
      <div className="px-5 pt-2 pb-1.5 bg-[#0B0F19] flex items-center justify-between border-b border-[#1E293B]/25">
        <div className="flex items-center gap-2">
          <h2 
            className="font-oxanium text-[13px] font-extrabold tracking-[2px]"
            style={{ color: headerColor }}
          >
            {title}
          </h2>
          <CustomTooltip content={tooltipText} position="bottom" borderColor={headerColor}>
            <div 
              className="w-4 h-4 rounded-full flex items-center justify-center bg-[#1E293B] hover:text-[#0B0F19] font-bold font-serif text-[10px] cursor-default transition-colors leading-none italic pb-[1px]"
              style={{ color: '#94A3B8' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = headerColor; e.currentTarget.style.color = '#0B0F19'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1E293B'; e.currentTarget.style.color = '#94A3B8'; }}
            >
              i
            </div>
          </CustomTooltip>
        </div>
      </div>

      <div className="flex flex-col bg-[#0B0F19]">
        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => <SkeletonTokenRow key={`${skeletonPrefix}-${i}`} />)}
          </>
        ) : (
          sliced.length > 0 ? (
            <>
              {/* Sliced List with conditional scrolling if it exceeds 5 items slightly or items are expanded */}
              <div className="flex flex-col">
                {sliced.map((token, index) => {
                  const isLastNonPromoted = index === sliced.length - 1;
                  const shouldHideBorder = isLastNonPromoted && promotedList.length > 0 && !expiredTokenToDisplay;
                  
                  return (
                    <TokenRowComponent 
                      key={token.id}
                      token={token} 
                      onSelect={(t) => setSelectedToken(selectedToken?.id === t.id ? null : t)}
                      isExpanded={selectedToken?.id === token.id}
                      playAudioFeedback={() => playAudioFeedback('hover')}
                      hideBorder={shouldHideBorder}
                      onTagClick={handleTagClick}
                      accentColor={headerColor}
                    />
                  );
                })}

                {/* Expired Token (Last organic item before + sign) */}
                {expiredTokenToDisplay && (
                  <div>
                    <TokenRowComponent 
                      key={expiredTokenToDisplay.id}
                      token={expiredTokenToDisplay} 
                      onSelect={(t) => setSelectedToken(selectedToken?.id === t.id ? null : t)}
                      isExpanded={selectedToken?.id === expiredTokenToDisplay.id}
                      playAudioFeedback={() => playAudioFeedback('hover')}
                      hideBorder={promotedList.length === 0}
                      onTagClick={handleTagClick}
                      accentColor={headerColor}
                    />
                  </div>
                )}
              </div>

              {/* Expand/Collapse Separator (Below sliced list + expired, above promoted list) */}
              {tokensList.length > 5 && (
                <div className="relative w-full flex items-center justify-center z-30 h-[10px] my-1">
                  <div className="absolute w-full h-px bg-[#1E293B] left-0 top-1/2 -translate-y-1/2" />
                  <div className="absolute top-1/2 -translate-y-1/2 bg-[#0B0F19] px-2 flex items-center gap-2 rounded-sm border border-[#1E293B]/60 shadow-[0_0_4px_rgba(0,0,0,0.8)] z-10 h-5">
                    {limit > 5 && (
                      <CustomTooltip content="Surface list" position="top" borderColor={headerColor}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudioFeedback('select');
                            setLimit(5);
                          }}
                          className="font-oxanium text-[20px] font-black transition-all duration-200 cursor-pointer select-none hover:scale-125 focus:outline-none w-5 h-5 flex items-center justify-center leading-none"
                          style={{
                            color: headerColor,
                            opacity: 0.8,
                            textShadow: `0 0 6px ${headerColor}66`,
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseOut={(e) => (e.currentTarget.style.opacity = '0.8')}
                        >
                          −
                        </button>
                      </CustomTooltip>
                    )}
                    {tokensList.length > limit && (
                      <CustomTooltip content="Scan deeper" position="top" borderColor={headerColor}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudioFeedback('select');
                            setLimit((prev) => prev + 5);
                          }}
                          className="font-oxanium text-[20px] font-black transition-all duration-200 cursor-pointer select-none hover:scale-125 focus:outline-none w-5 h-5 flex items-center justify-center leading-none"
                          style={{
                            color: headerColor,
                            opacity: 0.8,
                            textShadow: `0 0 6px ${headerColor}66`,
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseOut={(e) => (e.currentTarget.style.opacity = '0.8')}
                        >
                          +
                        </button>
                      </CustomTooltip>
                    )}
                  </div>
                </div>
              )}

              {/* Promoted List (Not inside the scrollable container) */}
              {promotedList.map((token, index) => {
                const isLast = index === promotedList.length - 1;
                return (
                  <TokenRowComponent 
                    key={token.id}
                    token={token} 
                    onSelect={(t) => setSelectedToken(selectedToken?.id === t.id ? null : t)}
                    isExpanded={selectedToken?.id === token.id}
                    playAudioFeedback={() => playAudioFeedback('hover')}
                    hideBorder={isLast}
                    onTagClick={handleTagClick}
                    accentColor={headerColor}
                  />
                );
              })}
            </>
          ) : (
            <div className="p-8 text-center font-mono text-xs text-slate-500 bg-[#070A10]/10 border-b border-[#1E293B]">
              {emptyMessage}
            </div>
          )
        )}
      </div>
    </div>
  );
};
