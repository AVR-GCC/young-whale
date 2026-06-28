export type CategoryType = {
  id: string,
  name: string,
  icon: string,
  title: string,
  tooltip: string,
  color: string
}

export const categories: CategoryType[] = [
  { id: 'Tech' as const, name: 'Tech', icon: 'tech', title: 'New Tech Projects', tooltip: 'Crypto tech project tokens hitting the market.', color: '#22D3EE' },
  { id: 'Meme' as const, name: 'Meme', icon: 'meme', title: 'New Meme Coins', tooltip: 'Recently traded fun and culture coins.', color: '#F97316' },
  { id: 'RWA' as const, name: 'Real World Assets', icon: 'rwa', title: 'Latest RWA Tokens', tooltip: 'Real-world assets (gold, real estate, etc...) tokenized on-chain', color: '#4ADE80' },
  { id: 'Presale' as const, name: 'Presale', icon: 'presale', title: 'Upcoming Presales & Airdrops', tooltip: 'Early-access tokens before public trading opens.', color: '#A855F7' },
] as const

export type CategoryId = (typeof categories)[number]['id']
