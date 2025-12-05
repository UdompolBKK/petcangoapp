import { adminFirestore } from '~/server/utils/firebase-admin'

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
    const { isVisible } = body

    if (typeof isVisible !== 'boolean') {
      throw createError({
        statusCode: 400,
        message: 'กรุณาระบุสถานะการแสดงผล'
      })
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

    // Update visibility status
    // isVisible: true = published, false = hidden
    await db.collection('hotels').doc(hotelId).update({
      status: isVisible ? 'published' : 'hidden',
      updatedAt: new Date()
    })

    return {
      success: true,
      message: isVisible ? 'เปิดการแสดงผลที่พักเรียบร้อย' : 'ปิดการแสดงผลที่พักเรียบร้อย',
      isVisible
    }

  } catch (error: any) {
    console.error('Toggle visibility error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'ไม่สามารถเปลี่ยนสถานะการแสดงผลได้'
    })
  }
})
