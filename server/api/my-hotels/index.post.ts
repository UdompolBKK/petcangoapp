import { adminFirestore, adminAuth } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
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

    // Validate required fields
    if (!body.name) {
      throw createError({
        statusCode: 400,
        message: 'กรุณากรอกชื่อที่พัก'
      })
    }

    // Create hotel document
    const hotelData = {
      ...body,
      ownerId: userId,
      ownerEmail: userEmail,
      status: body.status || 'pending', // pending, draft, published, rejected
      isFeatured: false,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await db.collection('hotels').add(hotelData)

    // If status is pending, create notification for admin
    if (hotelData.status === 'pending') {
      await db.collection('notifications').add({
        type: 'hotel_pending',
        title: 'ที่พักใหม่รอการอนุมัติ',
        message: `"${body.name}" โดย ${userEmail}`,
        hotelId: docRef.id,
        hotelName: body.name,
        ownerEmail: userEmail,
        read: false,
        createdAt: new Date()
      })
    }

    return {
      success: true,
      id: docRef.id,
      message: body.status === 'pending'
        ? 'ส่งข้อมูลที่พักเรียบร้อย รอการตรวจสอบจากทีมงาน'
        : 'บันทึกฉบับร่างเรียบร้อย'
    }

  } catch (error: any) {
    console.error('My Hotels POST error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'ไม่สามารถสร้างที่พักได้'
    })
  }
})
