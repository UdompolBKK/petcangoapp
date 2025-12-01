import { adminFirestore, adminAuth } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const uid = getRouterParam(event, 'uid')

    if (!uid) {
      throw createError({ statusCode: 400, message: 'User UID is required' })
    }

    // TODO: ตรวจสอบ admin authentication

    const db = adminFirestore()
    const auth = adminAuth()

    // ลบ user จาก Firestore
    const docRef = db.collection('users').doc(uid)
    const doc = await docRef.get()

    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    await docRef.delete()

    // ลบ user จาก Firebase Authentication
    try {
      await auth.deleteUser(uid)
    } catch (authError: any) {
      console.error('Failed to delete user from Firebase Auth:', authError)
      // ถ้าลบจาก Auth ไม่ได้ก็ไม่เป็นไร (อาจถูกลบไปแล้ว)
    }

    return {
      success: true,
      message: 'User deleted successfully'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete user'
    })
  }
})
