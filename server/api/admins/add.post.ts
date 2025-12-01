import { adminAuth, adminFirestore } from '~/server/utils/firebase-admin'

/**
 * Add new admin by email
 * Only Super Admin can add admins
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, role } = body // role can be 'admin' or 'superadmin'

    if (!email) {
      throw createError({ statusCode: 400, message: 'Email is required' })
    }

    if (!role || !['admin', 'superadmin'].includes(role)) {
      throw createError({ statusCode: 400, message: 'Invalid role. Must be "admin" or "superadmin"' })
    }

    // TODO: Add Super Admin authentication check here

    // Find user by email in Firebase Auth
    const auth = adminAuth()
    let userRecord

    try {
      userRecord = await auth.getUserByEmail(email)
    } catch (error) {
      throw createError({
        statusCode: 404,
        message: 'User not found. The user must register first before being made an admin.'
      })
    }

    const uid = userRecord.uid

    // Set custom claims
    const isSuperAdmin = role === 'superadmin'
    await auth.setCustomUserClaims(uid, {
      admin: true,
      superAdmin: isSuperAdmin,
      role: role
    })

    // Update Firestore
    const db = adminFirestore()
    await db.collection('users').doc(uid).set({
      uid,
      email,
      displayName: userRecord.displayName || email.split('@')[0],
      photoURL: userRecord.photoURL || '',
      role: role,
      isSuperAdmin: isSuperAdmin,
      isAdmin: true,
      updatedAt: new Date()
    }, { merge: true })

    return {
      success: true,
      message: `Added ${email} as ${role} successfully`,
      user: {
        uid,
        email,
        role
      }
    }

  } catch (error: any) {
    console.error('Add admin error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to add admin'
    })
  }
})
