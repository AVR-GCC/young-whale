import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface CustomTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-end';
  delay?: 'yes' | 'no';
  borderColor?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  content,
  children,
  className = "",
  position = 'top',
  delay = 'yes',
  borderColor
}) => {
  // Map old string prop to radix sides
  const sideMap: Record<string, 'top' | 'bottom' | 'left' | 'right'> = {
    'top': 'top',
    'bottom': 'bottom',
    'left': 'left',
    'right': 'right',
    'bottom-end': 'bottom'
  };
  const alignMap: Record<string, 'center' | 'end' | 'start'> = {
    'top': 'center',
    'bottom': 'center',
    'left': 'center',
    'right': 'center',
    'bottom-end': 'end'
  };

  return (
    <Tooltip.Provider delayDuration={delay === 'yes' ? 200 : 0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className={`inline-flex items-center justify-center ${className}`}>
            {children}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side={sideMap[position]}
            align={alignMap[position]}
            sideOffset={5}
            className="z-50 w-max max-w-[260px] p-2.5 bg-[#1C2536] border rounded shadow-xl animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
            style={{ borderColor: borderColor || '#334155' }}
          >
            <div className="font-oxanium text-xs text-white whitespace-normal text-center leading-relaxed m-0">
              {content}
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

