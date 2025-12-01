export default defineEventHandler(async (event) => {
  try {
    const auth = adminAuth()
    const firestore = adminFirestore()
    const storage = adminStorage()

    // Example: Get all users (limited to 10)
    const usersResult = await auth.listUsers(10)

    // Example: Get a Firestore collection
    // const snapshot = await firestore.collection('your-collection').limit(10).get()
    // const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Example: Get storage bucket
    const bucket = storage.bucket()

    return {
      success: true,
      message: 'Firebase Admin SDK is working!',
      userCount: usersResult.users.length,
      storageBucket: bucket.name
    }
  } catch (error: any) {
    console.error('Firebase Admin error:', error)
    return {
      success: false,
      error: error.message
    }
  }
})
