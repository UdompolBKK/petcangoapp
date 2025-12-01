import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = Number(query.limit) || 100
    const role = query.role as string

    const db = adminFirestore()

    // Get all users ordered by createdAt (no where to avoid composite index)
    let queryRef = db.collection('users')
      .orderBy('createdAt', 'desc')
      .limit(limit)

    const snapshot = await queryRef.get()

    let users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Filter by role in code if specified
    if (role) {
      users = users.filter(u => u.role === role)
    }

    return {
      success: true,
      data: users,
      total: users.length
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get users'
    })
  }
})
