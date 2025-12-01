import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({ statusCode: 400, message: 'Blog ID is required' })
    }

    // TODO: ตรวจสอบ admin authentication

    const db = adminFirestore()
    const docRef = db.collection('blogs').doc(id)

    const doc = await docRef.get()
    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'Blog not found' })
    }

    await docRef.delete()

    return {
      success: true,
      message: 'Blog deleted successfully'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete blog'
    })
  }
})
