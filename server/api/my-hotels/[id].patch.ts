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
    const userEmail = decodedToken.email

    const body = await readBody(event)
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
        message: 'คุณไม่มีสิทธิ์แก้ไขที่พักนี้'
      })
    }

    // Prevent changing certain fields
    delete body.ownerId
    delete body.ownerEmail
    delete body.viewCount
    delete body.isFeatured
    delete body.createdAt

    // If status changed to pending, reset rejection reason
    if (body.status === 'pending' && existingHotel.status === 'rejected') {
      body.rejectionReason = null
    }

    // Update hotel
    const updateData = {
      ...body,
      updatedAt: new Date()
    }

    await db.collection('hotels').doc(hotelId).update(updateData)

    // If status changed to pending, create notification for admin
    if (body.status === 'pending' && existingHotel.status !== 'pending') {
      await db.collection('notifications').add({
        type: 'hotel_pending',
        title: 'ที่พักรอการอนุมัติ (แก้ไข)',
        message: `"${body.name || existingHotel.name}" โดย ${userEmail}`,
        hotelId: hotelId,
        hotelName: body.name || existingHotel.name,
        ownerEmail: userEmail,
        read: false,
        createdAt: new Date()
      })
    }

    return {
      success: true,
      message: body.status === 'pending'
        ? 'ส่งข้อมูลที่พักเรียบร้อย รอการตรวจสอบจากทีมงาน'
        : 'บันทึกการแก้ไขเรียบร้อย'
    }

  } catch (error: any) {
    console.error('My Hotels PATCH error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'ไม่สามารถแก้ไขที่พักได้'
    })
  }
})
