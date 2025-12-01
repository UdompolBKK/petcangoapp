import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const uid = getRouterParam(event, 'uid')
    const body = await readBody(event)

    if (!uid) {
      throw createError({ statusCode: 400, message: 'User UID is required' })
    }

    // TODO: ตรวจสอบ admin authentication

    const db = adminFirestore()
    const docRef = db.collection('users').doc(uid)

    const doc = await docRef.get()
    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    // อัปเดตข้อมูล
    await docRef.update({
      ...body,
      updatedAt: new Date()
    })

    return {
      success: true,
      message: 'User updated successfully'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update user'
    })
  }
})
