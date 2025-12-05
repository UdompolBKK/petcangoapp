import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({ statusCode: 400, message: 'Facility ID is required' })
    }

    const db = adminFirestore()
    const docRef = db.collection('facilities').doc(id)

    const doc = await docRef.get()
    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'Facility not found' })
    }

    await docRef.delete()

    return {
      success: true,
      message: 'Facility deleted successfully'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete facility'
    })
  }
})
