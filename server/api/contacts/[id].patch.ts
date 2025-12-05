import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({ statusCode: 400, message: 'Contact ID is required' })
    }

    const db = adminFirestore()
    const contactRef = db.collection('contacts').doc(id)

    // Check if exists
    const doc = await contactRef.get()
    if (!doc.exists) {
      throw createError({ statusCode: 404, message: 'Contact not found' })
    }

    // Update contact
    await contactRef.update({
      ...body,
      updatedAt: new Date()
    })

    return {
      success: true,
      message: 'อัปเดตสำเร็จ'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update contact'
    })
  }
})
