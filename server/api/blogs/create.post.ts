import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const db = adminFirestore()

    // TODO: ตรวจสอบ admin authentication

    const blogRef = await db.collection('blogs').add({
      ...body,
      status: body.status || 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0
    })

    return {
      success: true,
      id: blogRef.id,
      message: 'Blog created successfully'
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create blog'
    })
  }
})
