import React from 'react';

interface ChainIconProps {
  chainName: string;
  className?: string;
}

export const ChainIcon: React.FC<ChainIconProps> = ({ chainName, className = "w-4 h-4" }) => {
  const norm = chainName.toLowerCase();

  if (norm.includes('ether')) {
    // Ethereum Octahedron shape with brand purple-blue colors
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m12 2-6.5 10L12 16l6.5-4L12 2z" fill="#627EEA" fillOpacity="0.25" stroke="#627EEA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m12 16-6.5-4 6.5 10 6.5-10-6.5 4z" fill="#3C3C3D" fillOpacity="0.25" stroke="#3C3C3D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m12 2v14" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (norm.includes('solana')) {
    // Solana stacked logos with its official purple-to-teal gradient
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="solanaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9945FF" />
            <stop offset="50%" stopColor="#80FFA2" />
            <stop offset="100%" stopColor="#14F195" />
          </linearGradient>
        </defs>
        <path d="m3 4.5 3-3h15l-3 3H3z" fill="url(#solanaGrad)" />
        <path d="m21 12-3-3H3l3 3h15z" fill="url(#solanaGrad)" />
        <path d="m3 19.5 3-3h15l-3 3H3z" fill="url(#solanaGrad)" />
      </svg>
    );
  }

  if (norm.includes('base')) {
    // Base official vibrant blue circle logo
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#0052FF" />
        <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
      </svg>
    );
  }

  if (norm.includes('arbitrum')) {
    // Arbitrum nested pyramid/triangle layers with official brand blue
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m12 3-10 16h20L12 3z" fill="#28A0F0" fillOpacity="0.2" stroke="#12AAFF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m12 10-6 10h12l-6-10z" fill="#12AAFF" fillOpacity="0.45" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (norm.includes('optimism')) {
    // Optimism glowing red ring logo
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#FF0420" />
        <circle cx="12" cy="12" r="5" stroke="#FFFFFF" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  // Default fallback coin - golden color
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="#FFD700" fillOpacity="0.1" />
      <path d="M12 18V6" />
      <path d="M15 9H12" />
      <path d="M9 15h3" />
    </svg>
  );
};
