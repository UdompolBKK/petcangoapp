import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const db = adminFirestore()

    // TODO: ตรวจสอบ admin authentication
    // const user = event.context.user
    // if (!user?.isAdmin) {
    //   throw createError({ statusCode: 401, message: 'Unauthorized' })
    // }

    // สร้าง hotel document
    const hotelRef = await db.collection('hotels').add({
      ...body,
      status: body.status || 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0
    })

    return {
      success: true,
      id: hotelRef.id,
      message: 'Hotel created successfully'
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create hotel'
    })
  }
})
