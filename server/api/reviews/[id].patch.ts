import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({ statusCode: 400, message: 'Review ID is required' })
    }

    const db = adminFirestore()
    const docRef = db.collection('reviews').doc(id)

    const doc = await docRef.get()
    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'Review not found' })
    }

    // อัปเดตข้อมูล
    await docRef.update({
      ...body,
      updatedAt: new Date()
    })

    // ถ้ามีการเปลี่ยน rating ให้อัปเดต hotel rating ด้วย
    if (body.rating) {
      const reviewData = doc.data()
      await updateHotelRating(db, reviewData.hotelId)
    }

    return {
      success: true,
      message: 'Review updated successfully'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update review'
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
