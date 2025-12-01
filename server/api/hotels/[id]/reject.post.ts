import { adminFirestore, adminAuth } from '~/server/utils/firebase-admin'
import { sendHotelRejectionEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  try {
    const hotelId = getRouterParam(event, 'id')
    if (!hotelId) {
      throw createError({
        statusCode: 400,
        message: 'ไม่พบ ID ที่พัก'
      })
    }

    const body = await readBody(event)
    const reason = body.reason || 'ไม่ผ่านเกณฑ์การตรวจสอบ'

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

    // Update hotel status to rejected
    await db.collection('hotels').doc(hotelId).update({
      status: 'rejected',
      rejectionReason: reason,
      rejectedAt: new Date(),
      updatedAt: new Date()
    })

    // Create notification for hotel owner
    if (existingHotel.ownerId) {
      await db.collection('notifications').add({
        type: 'hotel_rejected',
        title: 'ที่พักไม่ผ่านการอนุมัติ',
        message: `"${existingHotel.name}" ไม่ผ่านการอนุมัติ: ${reason}`,
        hotelId: hotelId,
        hotelName: existingHotel.name,
        userId: existingHotel.ownerId,
        reason: reason,
        read: false,
        createdAt: new Date()
      })
    }

    // Send email notification
    if (existingHotel.ownerEmail) {
      await sendHotelRejectionEmail({
        hotelName: existingHotel.name,
        ownerEmail: existingHotel.ownerEmail,
        reason: reason
      })
    }

    return {
      success: true,
      message: 'ปฏิเสธที่พักเรียบร้อย'
    }

  } catch (error: any) {
    console.error('Hotel Reject error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'ไม่สามารถปฏิเสธที่พักได้'
    })
  }
})
