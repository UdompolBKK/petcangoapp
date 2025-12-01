import { adminAuth } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const uid = getRouterParam(event, 'uid')
    const body = await readBody(event)

    if (!uid) {
      throw createError({ statusCode: 400, message: 'User UID is required' })
    }

    // TODO: ตรวจสอบ admin authentication
    // เฉพาะ super admin เท่านั้นที่สามารถตั้ง admin role ได้

    const isAdmin = body.isAdmin === true

    const auth = adminAuth()

    // ตั้ง custom claims
    await auth.setCustomUserClaims(uid, {
      admin: isAdmin
    })

    // อัปเดต role ใน Firestore ด้วย
    const { adminFirestore } = await import('~/server/utils/firebase-admin')
    const db = adminFirestore()

    await db.collection('users').doc(uid).update({
      role: isAdmin ? 'admin' : 'user',
      updatedAt: new Date()
    })

    return {
      success: true,
      message: `User ${isAdmin ? 'promoted to' : 'demoted from'} admin successfully`
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to set admin role'
    })
  }
})
