import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({ statusCode: 400, message: 'Blog ID is required' })
    }

    const db = adminFirestore()
    const doc = await db.collection('blogs').doc(id).get()

    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'Blog not found' })
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
      message: error.message || 'Failed to get blog'
    })
  }
})
