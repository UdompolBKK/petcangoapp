import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({ statusCode: 400, message: 'Review ID is required' })
    }

    const db = adminFirestore()
    const docRef = db.collection('reviews').doc(id)

    const doc = await docRef.get()
    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'Review not found' })
    }

    const reviewData = doc.data()
    await docRef.delete()

    // อัปเดต hotel rating
    await updateHotelRating(db, reviewData.hotelId)

    return {
      success: true,
      message: 'Review deleted successfully'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete review'
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

  if (reviewsSnapshot.empty) {
    // ถ้าไม่มี review เลย ให้ reset rating
    await db.collection('hotels').doc(hotelId).update({
      rating: 0,
      reviewCount: 0,
      updatedAt: new Date()
    })
    return
  }

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
