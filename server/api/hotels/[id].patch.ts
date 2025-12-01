import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

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

    // อัปเดตข้อมูล
    await docRef.update({
      ...body,
      updatedAt: new Date()
    })

    return {
      success: true,
      message: 'Hotel updated successfully'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update hotel'
    })
  }
})
