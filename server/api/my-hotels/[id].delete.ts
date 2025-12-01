import { adminFirestore, adminAuth } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const hotelId = getRouterParam(event, 'id')
    if (!hotelId) {
      throw createError({
        statusCode: 400,
        message: 'ไม่พบ ID ที่พัก'
      })
    }

    // Get authorization header
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'กรุณาเข้าสู่ระบบ'
      })
    }

    const token = authHeader.split('Bearer ')[1]

    // Verify token
    const auth = adminAuth()
    const decodedToken = await auth.verifyIdToken(token)
    const userId = decodedToken.uid

    const db = adminFirestore()

    // Get existing hotel
    const doc = await db.collection('hotels').doc(hotelId).get()

    if (!doc.exists) {
      throw createError({
        statusCode: 404,
        message: 'ไม่พบที่พักนี้'
      })
    }

    const existingHotel = doc.data() as any

    // Check ownership
    if (existingHotel.ownerId !== userId) {
      throw createError({
        statusCode: 403,
        message: 'คุณไม่มีสิทธิ์ลบที่พักนี้'
      })
    }

    // Delete hotel
    await db.collection('hotels').doc(hotelId).delete()

    return {
      success: true,
      message: 'ลบที่พักเรียบร้อย'
    }

  } catch (error: any) {
    console.error('My Hotels DELETE error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'ไม่สามารถลบที่พักได้'
    })
  }
})
