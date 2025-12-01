import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = Number(query.limit) || 100
    const status = query.status as string

    const db = adminFirestore()

    // Get all hotels ordered by createdAt (no where clause to avoid composite index requirement)
    let queryRef = db.collection('hotels')
      .orderBy('createdAt', 'desc')
      .limit(limit)

    const snapshot = await queryRef.get()

    let hotels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Filter by status in code if specified
    if (status) {
      hotels = hotels.filter(h => h.status === status)
    }

    return {
      success: true,
      data: hotels,
      total: hotels.length
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get hotels'
    })
  }
})
