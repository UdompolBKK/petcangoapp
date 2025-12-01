import { adminStorage } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { path } = body

    if (!path) {
      throw createError({
        statusCode: 400,
        message: 'File path is required'
      })
    }

    const storage = adminStorage()
    const bucket = storage.bucket()

    const file = bucket.file(path)
    await file.delete()

    return {
      success: true,
      message: 'File deleted successfully'
    }
  } catch (error: any) {
    console.error('Delete error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to delete file'
    })
  }
})
