import { adminFirestore, adminAuth } from '~/server/utils/firebase-admin'
import { sendHotelApprovalEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  try {
    const hotelId = getRouterParam(event, 'id')
    if (!hotelId) {
      throw createError({
        statusCode: 400,
        message: 'ไม่พบ ID ที่พัก'
      })
    }

    // Get authorization header (optional admin check)
    const authHeader = getHeader(event, 'authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1]
      const auth = adminAuth()
      try {
        const decodedToken = await auth.verifyIdToken(token)
        // Could add admin role check here
      } catch (e) {
        // Token verification failed, proceed anyway for now
      }
    }

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

    // Update hotel status to published
    await db.collection('hotels').doc(hotelId).update({
      status: 'published',
      approvedAt: new Date(),
      updatedAt: new Date()
    })

    // Create notification for hotel owner
    if (existingHotel.ownerId) {
      await db.collection('notifications').add({
        type: 'hotel_approved',
        title: 'ที่พักได้รับการอนุมัติแล้ว',
        message: `"${existingHotel.name}" ได้รับการอนุมัติและเผยแพร่แล้ว`,
        hotelId: hotelId,
        hotelName: existingHotel.name,
        userId: existingHotel.ownerId,
        read: false,
        createdAt: new Date()
      })
    }

    // Send email notification
    console.log('Hotel data for email:', {
      name: existingHotel.name,
      ownerEmail: existingHotel.ownerEmail,
      ownerId: existingHotel.ownerId,
      slug: existingHotel.slug
    })

    if (existingHotel.ownerEmail) {
      console.log('Sending approval email to:', existingHotel.ownerEmail)
      const emailResult = await sendHotelApprovalEmail({
        hotelName: existingHotel.name,
        ownerEmail: existingHotel.ownerEmail,
        hotelUrl: existingHotel.slug ? `https://petcango.com/hotels/${existingHotel.province || 'unknown'}/${existingHotel.slug}` : undefined
      })
      console.log('Email result:', emailResult)
    } else {
      console.log('No ownerEmail found, skipping email notification')
    }

    return {
      success: true,
      message: 'อนุมัติที่พักเรียบร้อย'
    }

  } catch (error: any) {
    console.error('Hotel Approve error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'ไม่สามารถอนุมัติที่พักได้'
    })
  }
})
