import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const db = adminFirestore()

    // TODO: ตรวจสอบ admin authentication

    const provinceRef = await db.collection('provinces').add({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return {
      success: true,
      id: provinceRef.id,
      message: 'Province created successfully'
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create province'
    })
  }
})
