import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

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

    // Delete contact
    await contactRef.delete()

    return {
      success: true,
      message: 'ลบสำเร็จ'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete contact'
    })
  }
})
