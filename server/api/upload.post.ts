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
    let folder = ''

    // First pass: find folder name
    for (const item of formData) {
      if (item.name === 'folder' && item.data) {
        folder = item.data.toString()
        break
      }
    }

    // Second pass: upload files
    for (const item of formData) {
      if (item.filename && item.data && item.type && item.type.startsWith('image/')) {
        // Generate unique filename
        const ext = item.filename.split('.').pop()
        const filename = `${uuidv4()}.${ext}`
        const filepath = folder ? `${folder}/${filename}` : `uploads/${filename}`

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

        // Get public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filepath}`

        uploadedFiles.push({
          name: filepath,
          url: publicUrl,
          size: item.data.length,
          contentType: item.type
        })
      }
    }

    if (uploadedFiles.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No valid image files found'
      })
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
