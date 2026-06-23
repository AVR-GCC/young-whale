export const categories = [
  { id: 'Tech' as const, name: 'Tech', icon: 'tech' },
  { id: 'Meme' as const, name: 'Meme', icon: 'meme' },
  { id: 'RWA' as const, name: 'Real World Assets', icon: 'rwa' },
  { id: 'Presale' as const, name: 'Presale', icon: 'presale' },
] as const

// Map category to accurate high-end smartwatch wayfinding hex codes
export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Tech':
      return '#22D3EE'; // Neon Blue
    case 'Meme':
      return '#F97316'; // Neon Pink
    case 'RWA':
      return '#4ADE80'; // Neon Green
    case 'Airdrop':
      return '#A855F7'; // Neon Blue
    case 'Presale':
      return '#A855F7'; // Neon Blue
    default:
      return '#00F0FF';
  }
};

export type CategoryId = (typeof categories)[number]['id']
