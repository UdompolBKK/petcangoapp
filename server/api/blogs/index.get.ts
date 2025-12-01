import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limitCount = Number(query.limit) || 50
    const status = query.status as string || 'published'

    const db = adminFirestore()

    // ดึงทั้งหมดโดยไม่ใช้ orderBy เพื่อหลีกเลี่ยง index requirement
    const snapshot = await db.collection('blogs').get()

    let blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[]

    // Filter by status in JavaScript
    if (status) {
      blogs = blogs.filter((blog: any) => blog.status === status)
    }

    // Sort by createdAt in JavaScript
    blogs.sort((a: any, b: any) => {
      const dateA = a.createdAt?._seconds || a.createdAt?.seconds || 0
      const dateB = b.createdAt?._seconds || b.createdAt?.seconds || 0
      return dateB - dateA
    })

    // Apply limit after filtering
    blogs = blogs.slice(0, limitCount)

    return {
      success: true,
      data: blogs,
      total: blogs.length
    }

  } catch (error: any) {
    console.error('Blogs API error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get blogs'
    })
  }
})
