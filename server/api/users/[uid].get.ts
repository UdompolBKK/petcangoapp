import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const uid = getRouterParam(event, 'uid')

    if (!uid) {
      throw createError({ statusCode: 400, message: 'User UID is required' })
    }

    const db = adminFirestore()
    const doc = await db.collection('users').doc(uid).get()

    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'User not found' })
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
      message: error.message || 'Failed to get user'
    })
  }
})
