import { orderBy, limit, where } from 'firebase/firestore'

export const useBlogs = () => {
  const { getCollection, getDocument } = useFirestore()

  /**
   * ดึงบทความทั้งหมดที่เผยแพร่แล้ว
   */
  const getAllBlogs = async (limitCount?: number) => {
    try {
      // ดึงทั้งหมดแล้ว filter ใน JavaScript เพื่อหลีกเลี่ยง composite index
      const allBlogs = await getCollection(
        'blogs',
        orderBy('createdAt', 'desc'),
        limit(limitCount ? limitCount * 2 : 100)
      )

      return allBlogs
        .filter((blog: any) => blog.status === 'published')
        .slice(0, limitCount || 100)
    } catch (err) {
      console.error('getAllBlogs error:', err)
      const allBlogs = await getCollection('blogs')
      return allBlogs
        .filter((blog: any) => blog.status === 'published')
        .slice(0, limitCount || 100)
    }
  }

  /**
   * ดึงบทความล่าสุด
   */
  const getLatestBlogs = async (limitCount = 6) => {
    try {
      const allBlogs = await getCollection(
        'blogs',
        orderBy('createdAt', 'desc'),
        limit(limitCount * 3)
      )

      return allBlogs
        .filter((blog: any) => blog.status === 'published')
        .slice(0, limitCount)
    } catch (err) {
      console.error('getLatestBlogs error:', err)
      // Fallback - ดึงทั้งหมดแล้ว sort/filter ใน client
      const allBlogs = await getCollection('blogs')
      return allBlogs
        .filter((blog: any) => blog.status === 'published')
        .sort((a: any, b: any) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0)
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0)
          return dateB.getTime() - dateA.getTime()
        })
        .slice(0, limitCount)
    }
  }

  /**
   * ดึงบทความยอดนิยม (เรียงตาม viewCount)
   */
  const getPopularBlogs = async (limitCount = 6) => {
    try {
      const allBlogs = await getCollection(
        'blogs',
        orderBy('viewCount', 'desc'),
        limit(limitCount * 3)
      )

      return allBlogs
        .filter((blog: any) => blog.status === 'published')
        .slice(0, limitCount)
    } catch (err) {
      console.error('getPopularBlogs error:', err)
      const allBlogs = await getCollection('blogs')
      return allBlogs
        .filter((blog: any) => blog.status === 'published')
        .sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, limitCount)
    }
  }

  /**
   * ดึงบทความตาม category
   */
  const getBlogsByCategory = async (category: string, limitCount?: number) => {
    try {
      const allBlogs = await getCollection(
        'blogs',
        orderBy('createdAt', 'desc'),
        limit(100)
      )

      const filtered = allBlogs
        .filter((blog: any) => blog.status === 'published' && blog.category === category)

      return limitCount ? filtered.slice(0, limitCount) : filtered
    } catch (err) {
      console.error('getBlogsByCategory error:', err)
      const allBlogs = await getCollection('blogs')
      const filtered = allBlogs
        .filter((blog: any) => blog.status === 'published' && blog.category === category)

      return limitCount ? filtered.slice(0, limitCount) : filtered
    }
  }

  /**
   * ดึงบทความตาม tag
   */
  const getBlogsByTag = async (tag: string, limitCount?: number) => {
    try {
      const allBlogs = await getCollection(
        'blogs',
        orderBy('createdAt', 'desc'),
        limit(100)
      )

      const filtered = allBlogs
        .filter((blog: any) => {
          if (blog.status !== 'published') return false
          const tags = blog.tags || []
          return tags.includes(tag)
        })

      return limitCount ? filtered.slice(0, limitCount) : filtered
    } catch (err) {
      console.error('getBlogsByTag error:', err)
      const allBlogs = await getCollection('blogs')
      const filtered = allBlogs
        .filter((blog: any) => {
          if (blog.status !== 'published') return false
          const tags = blog.tags || []
          return tags.includes(tag)
        })

      return limitCount ? filtered.slice(0, limitCount) : filtered
    }
  }

  /**
   * ดึงบทความตาม ID
   */
  const getBlogById = async (id: string) => {
    return await getDocument('blogs', id)
  }

  /**
   * ดึงบทความตาม slug
   */
  const getBlogBySlug = async (slug: string) => {
    try {
      const blogs = await getCollection(
        'blogs',
        where('slug', '==', slug),
        limit(1)
      )
      return blogs.length > 0 ? blogs[0] : null
    } catch (err) {
      console.error('getBlogBySlug error:', err)
      // Fallback - ดึงทั้งหมดแล้ว filter
      const allBlogs = await getCollection('blogs')
      const found = allBlogs.find((blog: any) => blog.slug === slug)
      return found || null
    }
  }

  /**
   * ค้นหาบทความ
   */
  const searchBlogs = async (searchTerm: string) => {
    // Note: Firestore ไม่ support full-text search
    // วิธีง่ายๆ คือ query ทั้งหมดแล้ว filter ที่ client-side
    // หรือใช้ Algolia/Elastic Search สำหรับ production
    const allBlogs = await getAllBlogs()

    return allBlogs.filter((blog: any) => {
      const titleMatch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
      const excerptMatch = blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      const contentMatch = blog.content?.toLowerCase().includes(searchTerm.toLowerCase())

      return titleMatch || excerptMatch || contentMatch
    })
  }

  return {
    getAllBlogs,
    getLatestBlogs,
    getPopularBlogs,
    getBlogsByCategory,
    getBlogsByTag,
    getBlogById,
    getBlogBySlug,
    searchBlogs
  }
}
