import { adminStorage } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const folder = query.folder as string || ''

    const storage = adminStorage()
    const bucket = storage.bucket()

    // List all files in the folder
    const [files] = await bucket.getFiles({
      prefix: folder ? `${folder}/` : '',
      delimiter: '/'
    })

    // Get folders (prefixes)
    const [, , apiResponse] = await bucket.getFiles({
      prefix: folder ? `${folder}/` : '',
      delimiter: '/',
      autoPaginate: false
    })

    const folders = apiResponse?.prefixes || []

    // Format file data
    const fileData = await Promise.all(
      files
        .filter(file => !file.name.endsWith('/')) // Filter out folder markers
        .map(async (file) => {
          const [metadata] = await file.getMetadata()
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
          })

          return {
            name: file.name,
            path: file.name,
            url: url,
            size: parseInt(metadata.size || '0'),
            contentType: metadata.contentType,
            updated: metadata.updated,
            folder: file.name.split('/').slice(0, -1).join('/')
          }
        })
    )

    // Format folder data
    const folderData = folders.map(prefix => {
      const folderName = prefix.replace(/\/$/, '').split('/').pop() || prefix
      return {
        name: folderName,
        path: prefix.replace(/\/$/, ''),
        isFolder: true
      }
    })

    return {
      success: true,
      data: {
        files: fileData,
        folders: folderData
      }
    }
  } catch (error: any) {
    console.error('Failed to list media:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to list media files'
    })
  }
})
