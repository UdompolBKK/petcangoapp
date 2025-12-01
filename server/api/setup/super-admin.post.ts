import { adminAuth, adminFirestore } from '~/server/utils/firebase-admin'

/**
 * Setup Super Admin
 * This endpoint should be used ONCE to set up the initial super admin
 * After setup, it should be disabled or protected
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = body

    if (!email) {
      throw createError({ statusCode: 400, message: 'Email is required' })
    }

    // Find user by email in Firebase Auth
    const auth = adminAuth()
    let userRecord

    try {
      userRecord = await auth.getUserByEmail(email)
    } catch (error) {
      throw createError({ statusCode: 404, message: 'User not found in Firebase Auth' })
    }

    const uid = userRecord.uid

    // Set custom claims for super admin
    await auth.setCustomUserClaims(uid, {
      admin: true,
      superAdmin: true,
      role: 'superadmin'
    })

    // Update Firestore user document
    const db = adminFirestore()
    const userRef = db.collection('users').doc(uid)

    await userRef.set({
      uid,
      email,
      displayName: userRecord.displayName || email.split('@')[0],
      photoURL: userRecord.photoURL || '',
      role: 'superadmin',
      isSuperAdmin: true,
      isAdmin: true,
      createdAt: userRecord.metadata.creationTime ? new Date(userRecord.metadata.creationTime) : new Date(),
      updatedAt: new Date()
    }, { merge: true })

    return {
      success: true,
      message: 'Super Admin setup successfully',
      user: {
        uid,
        email,
        role: 'superadmin'
      }
    }

  } catch (error: any) {
    console.error('Setup Super Admin error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to setup Super Admin'
    })
  }
})
