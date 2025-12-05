import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate required fields
    if (!body.name) {
      throw createError({ statusCode: 400, message: 'กรุณาระบุชื่อ' })
    }

    if (!body.email) {
      throw createError({ statusCode: 400, message: 'กรุณาระบุอีเมล' })
    }

    if (!body.message) {
      throw createError({ statusCode: 400, message: 'กรุณาระบุข้อความ' })
    }

    const db = adminFirestore()

    // Create contact document
    const contactData = {
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      subject: body.subject || '',
      message: body.message,
      status: 'new', // new, read, replied
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await db.collection('contacts').add(contactData)

    return {
      success: true,
      id: docRef.id,
      message: 'ส่งข้อความสำเร็จ'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create contact'
    })
  }
})
