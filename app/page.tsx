import HomePage from './components/HomePage'
import { getAllApprovedTokens } from './lib/data'

export default async function Home() {
  const tokens = await getAllApprovedTokens()

  return <HomePage tokens={tokens} />
}
