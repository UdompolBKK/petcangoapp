/**
 * Fuzzy Search API
 * ค้นหาหน้าที่ใกล้เคียงจาก URL path
 * ใช้สำหรับ 404 redirect
 */
import { adminFirestore } from '~/server/utils/firebase-admin'

// คำนวณ Levenshtein Distance สำหรับเปรียบเทียบความคล้าย
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // replace
          dp[i - 1][j] + 1,     // delete
          dp[i][j - 1] + 1      // insert
        )
      }
    }
  }
  return dp[m][n]
}

// คำนวณ similarity score (0-1)
function similarityScore(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length)
  if (maxLen === 0) return 1
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase())
  return 1 - (distance / maxLen)
}

// ตรวจสอบว่า string มี substring หรือไม่
function containsSubstring(str: string, sub: string): boolean {
  return str.toLowerCase().includes(sub.toLowerCase())
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const path = (query.path as string) || ''

  if (!path) {
    return { redirect: '/', type: 'home', confidence: 0 }
  }

  // แยก path segments
  const segments = path.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1] || ''

  // ตรวจสอบ path patterns
  const isHotelPath = path.startsWith('/hotels/') || path.startsWith('/province/')
  const isBlogPath = path.startsWith('/blogs/') || path.startsWith('/blog/')

  try {
    const db = adminFirestore()
    let bestMatch: { url: string; score: number; type: string } | null = null

    // 1. ค้นหาใน Hotels
    if (isHotelPath || !isBlogPath) {
      const hotelsSnapshot = await db.collection('hotels')
        .where('status', '==', 'published')
        .limit(500)
        .get()

      for (const doc of hotelsSnapshot.docs) {
        const data = doc.data()
        if (!data.slug) continue

        const hotelSlug = data.slug
        const provinceName = data.province?.name || ''
        const provinceSlug = data.province?.slug || ''
        const hotelName = data.name || ''

        // เปรียบเทียบกับ slug
        let score = similarityScore(lastSegment, hotelSlug)

        // Bonus ถ้ามี substring match
        if (containsSubstring(hotelSlug, lastSegment) || containsSubstring(lastSegment, hotelSlug)) {
          score = Math.min(score + 0.2, 1)
        }

        // เปรียบเทียบกับชื่อโรงแรม
        const nameScore = similarityScore(lastSegment, hotelName.replace(/\s+/g, '-').toLowerCase())
        score = Math.max(score, nameScore)

        if (score > (bestMatch?.score || 0.4)) {
          bestMatch = {
            url: `/hotels/${provinceSlug}/${hotelSlug}`,
            score,
            type: 'hotel'
          }
        }
      }

      // 2. ค้นหาใน Provinces
      const provincesSnapshot = await db.collection('provinces').get()

      for (const doc of provincesSnapshot.docs) {
        const data = doc.data()
        if (!data.slug) continue

        const provinceSlug = data.slug
        const provinceName = data.name || ''

        let score = similarityScore(lastSegment, provinceSlug)

        if (containsSubstring(provinceSlug, lastSegment) || containsSubstring(lastSegment, provinceSlug)) {
          score = Math.min(score + 0.2, 1)
        }

        // เปรียบเทียบกับชื่อจังหวัด (ภาษาไทย)
        const thaiScore = similarityScore(lastSegment, provinceName)
        score = Math.max(score, thaiScore)

        if (score > (bestMatch?.score || 0.4)) {
          bestMatch = {
            url: `/hotels/${provinceSlug}`,
            score,
            type: 'province'
          }
        }
      }
    }

    // 3. ค้นหาใน Blogs
    if (isBlogPath || !isHotelPath) {
      const blogsSnapshot = await db.collection('blogs')
        .where('status', '==', 'published')
        .limit(200)
        .get()

      for (const doc of blogsSnapshot.docs) {
        const data = doc.data()
        if (!data.slug) continue

        const blogSlug = data.slug
        const blogTitle = data.title || ''

        let score = similarityScore(lastSegment, blogSlug)

        if (containsSubstring(blogSlug, lastSegment) || containsSubstring(lastSegment, blogSlug)) {
          score = Math.min(score + 0.2, 1)
        }

        const titleScore = similarityScore(lastSegment, blogTitle.replace(/\s+/g, '-').toLowerCase())
        score = Math.max(score, titleScore)

        if (score > (bestMatch?.score || 0.4)) {
          bestMatch = {
            url: `/blogs/${blogSlug}`,
            score,
            type: 'blog'
          }
        }
      }
    }

    // 4. ถ้าเจอ match ที่ดีพอ (score > 0.5)
    if (bestMatch && bestMatch.score > 0.5) {
      return {
        redirect: bestMatch.url,
        type: bestMatch.type,
        confidence: bestMatch.score,
        // ใช้ 301 ถ้า confidence สูงมาก (> 0.8) แสดงว่าน่าจะเป็น URL เดิมที่เปลี่ยน
        // ใช้ 302 ถ้า confidence ปานกลาง เพราะอาจไม่ใช่หน้าเดียวกัน
        statusCode: bestMatch.score > 0.8 ? 301 : 302
      }
    }

    // 5. ถ้าหาไม่เจอ redirect ไป home
    return {
      redirect: '/',
      type: 'home',
      confidence: 0,
      statusCode: 302
    }

  } catch (error) {
    console.error('Fuzzy search error:', error)
    return {
      redirect: '/',
      type: 'home',
      confidence: 0,
      statusCode: 302
    }
  }
})
