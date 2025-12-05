import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const db = adminFirestore()
    const query = getQuery(event)
    const limitCount = Number(query.limit) || 50

    const contactsRef = db.collection('contacts')
    const snapshot = await contactsRef
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get()

    const contacts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      success: true,
      data: contacts
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get contacts'
    })
  }
})
