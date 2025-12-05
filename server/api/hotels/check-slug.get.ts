import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const slug = query.slug as string
  const excludeId = query.excludeId as string | undefined

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required'
    })
  }

  try {
    const db = adminFirestore()
    const hotelsRef = db.collection('hotels')

    // Check if slug exists
    const snapshot = await hotelsRef.where('slug', '==', slug).get()

    let exists = false

    if (!snapshot.empty) {
      // If excludeId is provided, check if the existing hotel is not the same one
      if (excludeId) {
        exists = snapshot.docs.some(doc => doc.id !== excludeId)
      } else {
        exists = true
      }
    }

    return {
      success: true,
      exists,
      slug
    }
  } catch (error: any) {
    console.error('Error checking slug:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to check slug'
    })
  }
})
