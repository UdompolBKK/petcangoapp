/**
 * API Endpoint: ดึง IP address ของ client
 */
export default defineEventHandler((event) => {
  // ดึง IP จาก headers (รองรับ proxy/load balancer)
  const headers = getHeaders(event)

  const ip =
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['x-real-ip'] ||
    headers['cf-connecting-ip'] || // Cloudflare
    headers['x-client-ip'] ||
    event.node.req.socket.remoteAddress ||
    'unknown'

  return {
    ip,
    timestamp: new Date().toISOString()
  }
})
