import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = Number(query.limit) || 100

    const db = adminFirestore()
    let queryRef = db.collection('provinces')
      .orderBy('name', 'asc')
      .limit(limit)

    const snapshot = await queryRef.get()

    const provinces = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      success: true,
      data: provinces,
      total: provinces.length
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get provinces'
    })
  }
})
