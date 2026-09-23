import { getLastPublishedAt } from '@/lib/sitemap-utils'
import { YMYLTrustSignals } from './YMYLTrustSignals'

export async function YMYLTrustSignalsServer() {
  const lastPublishedAt = await getLastPublishedAt()

  return <YMYLTrustSignals updatedEntity="site" lastPublishedAt={lastPublishedAt} />
}
