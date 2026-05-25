export function verifyCronRequest(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    throw new Error('CRON_SECRET is not set')
  }

  return authHeader === `Bearer ${cronSecret}`
}
