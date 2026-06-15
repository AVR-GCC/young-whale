export const categories = [
  { id: 'Tech' as const, name: 'Tech', icon: 'tech' },
  { id: 'Meme' as const, name: 'Meme', icon: 'meme' },
  { id: 'RWA' as const, name: 'Real World Assets', icon: 'rwa' },
  { id: 'Presale' as const, name: 'Presale', icon: 'presale' },
] as const

export type CategoryId = (typeof categories)[number]['id']
