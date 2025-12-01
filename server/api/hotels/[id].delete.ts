import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({ statusCode: 400, message: 'Hotel ID is required' })
    }

    // TODO: ตรวจสอบ admin authentication
    // const user = event.context.user
    // if (!user?.isAdmin) {
    //   throw createError({ statusCode: 401, message: 'Unauthorized' })
    // }

    const db = adminFirestore()
    const docRef = db.collection('hotels').doc(id)

    // ตรวจสอบว่า document มีอยู่จริง
    const doc = await docRef.get()
    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'Hotel not found' })
    }

    // ลบ document
    await docRef.delete()

    // TODO: ลบรูปภาพใน Storage ด้วย (optional)

    return {
      success: true,
      message: 'Hotel deleted successfully'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete hotel'
    })
  }
})
