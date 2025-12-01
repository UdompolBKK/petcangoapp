import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = Number(query.limit) || 50
    const status = query.status as string || 'published'

    const db = adminFirestore()
    let queryRef = db.collection('blogs')
      .where('status', '==', status)
      .orderBy('createdAt', 'desc')
      .limit(limit)

    const snapshot = await queryRef.get()

    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      success: true,
      data: blogs,
      total: blogs.length
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get blogs'
    })
  }
})
