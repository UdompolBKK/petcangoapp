import { adminAuth, adminFirestore } from '~/server/utils/firebase-admin'

/**
 * Remove admin role from user
 * Only Super Admin can remove admins
 * Super Admin cannot remove themselves
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { uid } = body

    if (!uid) {
      throw createError({ statusCode: 400, message: 'User ID is required' })
    }

    // TODO: Add Super Admin authentication check here
    // TODO: Prevent Super Admin from removing themselves

    const auth = adminAuth()
    const db = adminFirestore()

    // Get user data
    const userDoc = await db.collection('users').doc(uid).get()
    if (!userDoc.exists) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    const userData = userDoc.data()

    // Remove admin custom claims
    await auth.setCustomUserClaims(uid, {
      admin: false,
      superAdmin: false,
      role: 'user'
    })

    // Update Firestore
    await db.collection('users').doc(uid).update({
      role: 'user',
      isSuperAdmin: false,
      isAdmin: false,
      updatedAt: new Date()
    })

    return {
      success: true,
      message: `Removed admin role from ${userData?.email} successfully`
    }

  } catch (error: any) {
    console.error('Remove admin error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to remove admin'
    })
  }
})
