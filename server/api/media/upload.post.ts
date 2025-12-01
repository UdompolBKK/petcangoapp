import { adminStorage } from '~/server/utils/firebase-admin'
import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)

    if (!formData) {
      throw createError({
        statusCode: 400,
        message: 'No file uploaded'
      })
    }

    const storage = adminStorage()
    const bucket = storage.bucket()

    const uploadedFiles = []

    for (const item of formData) {
      if (item.filename && item.data) {
        const folder = item.name === 'folder' ? item.data.toString() : ''

        if (item.type && item.type.startsWith('image/')) {
          // Generate unique filename
          const ext = item.filename.split('.').pop()
          const filename = `${uuidv4()}.${ext}`
          const filepath = folder ? `${folder}/${filename}` : filename

          const file = bucket.file(filepath)

          await file.save(item.data, {
            metadata: {
              contentType: item.type,
              metadata: {
                originalName: item.filename
              }
            }
          })

          // Make file publicly readable
          await file.makePublic()

          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000
          })

          uploadedFiles.push({
            name: filepath,
            url: url,
            size: item.data.length,
            contentType: item.type
          })
        }
      }
    }

    return {
      success: true,
      data: uploadedFiles
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to upload file'
    })
  }
})
