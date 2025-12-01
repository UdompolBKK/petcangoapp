import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const hotelId = query.hotelId as string
    const limit = Number(query.limit) || 100

    const db = adminFirestore()

    // Get all reviews ordered by createdAt (no where to avoid composite index)
    let queryRef = db.collection('reviews')
      .orderBy('createdAt', 'desc')
      .limit(limit)

    const snapshot = await queryRef.get()

    let reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Filter by hotelId in code if specified
    if (hotelId) {
      reviews = reviews.filter(r => r.hotelId === hotelId)
    }

    return {
      success: true,
      data: reviews,
      total: reviews.length
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get reviews'
    })
  }
})
