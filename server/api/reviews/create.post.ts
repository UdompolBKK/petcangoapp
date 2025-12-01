import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!body.hotelId) {
      throw createError({ statusCode: 400, message: 'Hotel ID is required' })
    }

    if (!body.userId) {
      throw createError({ statusCode: 400, message: 'User ID is required' })
    }

    if (!body.rating || body.rating < 1 || body.rating > 5) {
      throw createError({ statusCode: 400, message: 'Rating must be between 1-5' })
    }

    const db = adminFirestore()

    // ตรวจสอบว่า user เคย review hotel นี้แล้วหรือยัง
    const existingReview = await db.collection('reviews')
      .where('hotelId', '==', body.hotelId)
      .where('userId', '==', body.userId)
      .get()

    if (!existingReview.empty) {
      throw createError({
        statusCode: 400,
        message: 'คุณได้ review โรงแรมนี้ไปแล้ว'
      })
    }

    // สร้าง review ใหม่
    const reviewRef = await db.collection('reviews').add({
      hotelId: body.hotelId,
      userId: body.userId,
      userName: body.userName || '',
      userPhoto: body.userPhoto || '',
      rating: Number(body.rating),
      comment: body.comment || '',
      images: body.images || [],
      helpful: 0,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // อัปเดต rating average ของ hotel
    await updateHotelRating(db, body.hotelId)

    return {
      success: true,
      id: reviewRef.id,
      message: 'Review created successfully'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create review'
    })
  }
})

/**
 * Update hotel rating average
 */
async function updateHotelRating(db: any, hotelId: string) {
  const reviewsSnapshot = await db.collection('reviews')
    .where('hotelId', '==', hotelId)
    .where('status', '==', 'published')
    .get()

  if (reviewsSnapshot.empty) return

  const reviews = reviewsSnapshot.docs.map((doc: any) => doc.data())
  const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length
  const reviewCount = reviews.length

  await db.collection('hotels').doc(hotelId).update({
    rating: Number(averageRating.toFixed(1)),
    reviewCount: reviewCount,
    updatedAt: new Date()
  })
}
