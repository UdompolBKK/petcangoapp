/**
 * Dynamic Sitemap Generator
 * สร้าง sitemap.xml แบบ dynamic จากข้อมูลใน Firestore
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin (ถ้ายังไม่ได้ init)
const initFirebaseAdmin = () => {
  if (getApps().length === 0) {
    const config = useRuntimeConfig()

    // ใช้ service account จาก environment variables
    if (config.firebaseAdminProjectId) {
      initializeApp({
        credential: cert({
          projectId: config.firebaseAdminProjectId,
          clientEmail: config.firebaseAdminClientEmail,
          privateKey: config.firebaseAdminPrivateKey?.replace(/\\n/g, '\n')
        })
      })
    }
  }
  return getFirestore()
}

export default defineEventHandler(async (event) => {
  const siteUrl = 'https://petcango.com'

  // Static pages
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/all-province', changefreq: 'weekly', priority: 0.9 },
    { url: '/hotels', changefreq: 'daily', priority: 0.9 },
    { url: '/blogs', changefreq: 'weekly', priority: 0.8 },
    { url: '/search', changefreq: 'weekly', priority: 0.7 },
    { url: '/about', changefreq: 'monthly', priority: 0.5 },
    { url: '/contact', changefreq: 'monthly', priority: 0.5 },
    { url: '/faq', changefreq: 'monthly', priority: 0.5 },
    { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { url: '/terms', changefreq: 'yearly', priority: 0.3 }
  ]

  let dynamicPages: { url: string; changefreq: string; priority: number; lastmod?: string }[] = []

  try {
    const db = initFirebaseAdmin()

    // Fetch provinces
    const provincesSnapshot = await db.collection('provinces').get()
    provincesSnapshot.forEach(doc => {
      const data = doc.data()
      if (data.slug) {
        dynamicPages.push({
          url: `/hotels/${data.slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: data.updatedAt?.toDate?.()?.toISOString()?.split('T')[0]
        })
      }
    })

    // Fetch hotels (only published)
    const hotelsSnapshot = await db.collection('hotels')
      .where('status', '==', 'published')
      .get()

    hotelsSnapshot.forEach(doc => {
      const data = doc.data()
      if (data.slug && data.province?.slug) {
        dynamicPages.push({
          url: `/hotels/${data.province.slug}/${data.slug}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: data.updatedAt?.toDate?.()?.toISOString()?.split('T')[0]
        })
      }
    })

    // Fetch blogs (only published)
    const blogsSnapshot = await db.collection('blogs')
      .where('status', '==', 'published')
      .get()

    blogsSnapshot.forEach(doc => {
      const data = doc.data()
      if (data.slug) {
        dynamicPages.push({
          url: `/blogs/${data.slug}`,
          changefreq: 'monthly',
          priority: 0.6,
          lastmod: data.updatedAt?.toDate?.()?.toISOString()?.split('T')[0] ||
                   data.publishedAt?.toDate?.()?.toISOString()?.split('T')[0]
        })
      }
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Continue with static pages only
  }

  // Combine all pages
  const allPages = [...staticPages, ...dynamicPages]

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${page.lastmod ? `
    <lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`

  // Set headers
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache 1 hour

  return xml
})
