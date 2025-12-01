import { adminFirestore } from '~/server/utils/firebase-admin'

/**
 * Get list of all admins (Super Admin and Admin)
 * Only Super Admin can access this endpoint
 */
export default defineEventHandler(async (event) => {
  try {
    // TODO: Add Super Admin authentication check here

    const db = adminFirestore()
    const usersSnapshot = await db.collection('users')
      .where('role', 'in', ['admin', 'superadmin'])
      .get()

    const admins = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      success: true,
      data: admins,
      total: admins.length
    }

  } catch (error: any) {
    console.error('List admins error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to list admins'
    })
  }
})
