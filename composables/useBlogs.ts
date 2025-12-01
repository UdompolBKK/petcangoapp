import { where, orderBy, limit } from 'firebase/firestore'

export const useBlogs = () => {
  const { getCollection, getDocument } = useFirestore()

  /**
   * ดึงบทความทั้งหมดที่เผยแพร่แล้ว
   */
  const getAllBlogs = async (limitCount?: number) => {
    const constraints = [
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc')
    ]

    if (limitCount) {
      constraints.push(limit(limitCount))
    }

    return await getCollection('blogs', ...constraints)
  }

  /**
   * ดึงบทความล่าสุด
   */
  const getLatestBlogs = async (limitCount = 6) => {
    return await getCollection(
      'blogs',
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    )
  }

  /**
   * ดึงบทความยอดนิยม (เรียงตาม viewCount)
   */
  const getPopularBlogs = async (limitCount = 6) => {
    return await getCollection(
      'blogs',
      where('status', '==', 'published'),
      orderBy('viewCount', 'desc'),
      limit(limitCount)
    )
  }

  /**
   * ดึงบทความตาม category
   */
  const getBlogsByCategory = async (category: string, limitCount?: number) => {
    const constraints = [
      where('status', '==', 'published'),
      where('category', '==', category),
      orderBy('publishedAt', 'desc')
    ]

    if (limitCount) {
      constraints.push(limit(limitCount))
    }

    return await getCollection('blogs', ...constraints)
  }

  /**
   * ดึงบทความตาม tag
   */
  const getBlogsByTag = async (tag: string, limitCount?: number) => {
    const constraints = [
      where('status', '==', 'published'),
      where('tags', 'array-contains', tag),
      orderBy('publishedAt', 'desc')
    ]

    if (limitCount) {
      constraints.push(limit(limitCount))
    }

    return await getCollection('blogs', ...constraints)
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
    const blogs = await getCollection(
      'blogs',
      where('slug', '==', slug),
      limit(1)
    )

    return blogs.length > 0 ? blogs[0] : null
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
