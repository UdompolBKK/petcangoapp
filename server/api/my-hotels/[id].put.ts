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
    delete body.status

    // Check if significant changes were made (requires re-approval)
    const wasPublished = existingHotel.status === 'published'
    const needsReapproval = wasPublished && (
      body.name !== existingHotel.name ||
      body.description !== existingHotel.description ||
      body.address !== existingHotel.address ||
      body.phone !== existingHotel.phone ||
      JSON.stringify(body.images) !== JSON.stringify(existingHotel.images)
    )

    // Update hotel
    const updateData = {
      ...body,
      updatedAt: new Date(),
      // Change status to pending if significant changes were made
      ...(needsReapproval && { status: 'pending', rejectionReason: null })
    }

    await db.collection('hotels').doc(hotelId).update(updateData)

    // Create notification for admin if needs re-approval
    if (needsReapproval) {
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
      message: needsReapproval
        ? 'บันทึกการแก้ไขเรียบร้อย ข้อมูลจะถูกตรวจสอบใหม่ก่อนเผยแพร่'
        : 'บันทึกการแก้ไขเรียบร้อย',
      needsReapproval
    }

  } catch (error: any) {
    console.error('My Hotels PUT error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'ไม่สามารถแก้ไขที่พักได้'
    })
  }
})
