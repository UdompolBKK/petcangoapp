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

    const db = adminFirestore()

    // Get user's hotels
    const snapshot = await db.collection('hotels')
      .where('ownerId', '==', userId)
      .get()

    const hotels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Sort by createdAt in JavaScript
    hotels.sort((a: any, b: any) => {
      const dateA = a.createdAt?._seconds || a.createdAt?.seconds || 0
      const dateB = b.createdAt?._seconds || b.createdAt?.seconds || 0
      return dateB - dateA
    })

    return {
      success: true,
      data: hotels
    }

  } catch (error: any) {
    console.error('My Hotels GET error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'ไม่สามารถโหลดข้อมูลได้'
    })
  }
})
