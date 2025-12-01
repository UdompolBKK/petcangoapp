import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const db = adminFirestore()
    const snapshot = await db.collection('facilities')
      .orderBy('name', 'asc')
      .get()

    const facilities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      success: true,
      data: facilities,
      total: facilities.length
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get facilities'
    })
  }
})
