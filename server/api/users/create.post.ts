import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.uid) {
      throw createError({ statusCode: 400, message: 'User UID is required' })
    }

    const db = adminFirestore()

    // ตรวจสอบว่า user มีอยู่แล้วหรือยัง
    const existingUser = await db.collection('users').doc(body.uid).get()

    if (existingUser.exists) {
      // ถ้ามีอยู่แล้ว ให้ return ข้อมูลเดิม
      return {
        success: true,
        message: 'User already exists',
        data: {
          id: existingUser.id,
          ...existingUser.data()
        }
      }
    }

    // สร้าง user profile ใหม่
    await db.collection('users').doc(body.uid).set({
      email: body.email || '',
      displayName: body.displayName || '',
      photoURL: body.photoURL || '',
      phone: body.phone || '',
      role: body.role || 'user',
      isActive: true,
      createdAt: new Date(body.createdAt || new Date()),
      updatedAt: new Date()
    })

    return {
      success: true,
      message: 'User created successfully',
      uid: body.uid
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create user'
    })
  }
})
