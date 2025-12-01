import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({ statusCode: 400, message: 'Review ID is required' })
    }

    const db = adminFirestore()
    const doc = await db.collection('reviews').doc(id).get()

    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'Review not found' })
    }

    return {
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get review'
    })
  }
})
