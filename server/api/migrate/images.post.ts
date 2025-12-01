/**
 * API Endpoint: Migrate images from local media folder to Firebase Storage
 *
 * POST /api/migrate/images
 */

import { adminFirestore, adminStorage } from '~/server/utils/firebase-admin'
import fs from 'fs'
import path from 'path'

const MEDIA_PATH = '/Users/udompolthivakorakot/Desktop/media'

/**
 * Get content type from file extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const types: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  }
  return types[ext] || 'application/octet-stream'
}

/**
 * Recursively find all image files in a directory
 */
function findImages(dir: string, baseDir: string = dir): Array<{ localPath: string; relativePath: string }> {
  const images: Array<{ localPath: string; relativePath: string }> = []

  if (!fs.existsSync(dir)) {
    return images
  }

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      images.push(...findImages(fullPath, baseDir))
    } else if (/\.(png|jpe?g|gif|webp)$/i.test(file)) {
      const relativePath = path.relative(baseDir, fullPath)
      images.push({
        localPath: fullPath,
        relativePath: relativePath.replace(/\\/g, '/') // Convert to forward slashes
      })
    }
  }

  return images
}

/**
 * Upload a single file to Firebase Storage
 */
async function uploadFile(localPath: string, storagePath: string, bucket: any): Promise<string | null> {
  try {
    await bucket.upload(localPath, {
      destination: storagePath,
      metadata: {
        contentType: getContentType(localPath)
      }
    })

    // Make file publicly accessible
    const file = bucket.file(storagePath)
    await file.makePublic()

    // Return public URL
    return `https://storage.googleapis.com/${bucket.name}/${storagePath}`
  } catch (error: any) {
    console.error(`Error uploading ${localPath}:`, error.message)
    return null
  }
}

export default defineEventHandler(async (event) => {
  try {
    const db = adminFirestore()
    const storage = adminStorage()
    const bucket = storage.bucket()

    const results = {
      scanned: 0,
      uploaded: 0,
      failed: 0,
      hotelsUpdated: 0,
      hotelsSkipped: 0,
      errors: [] as string[]
    }

    // Check if media directory exists
    if (!fs.existsSync(MEDIA_PATH)) {
      return {
        success: false,
        error: `Media directory not found: ${MEDIA_PATH}`,
        results
      }
    }

    // Find all images
    console.log(`📂 Scanning for images in ${MEDIA_PATH}...`)
    const images = findImages(MEDIA_PATH)
    results.scanned = images.length
    console.log(`✅ Found ${images.length} images`)

    // Upload images
    console.log('📤 Uploading images to Firebase Storage...')
    const uploadedImages = new Map<string, string>() // Map: relativePath -> publicURL

    for (const image of images) {
      const storagePath = `hotels/${image.relativePath}`
      console.log(`  Uploading: ${image.relativePath}...`)

      const url = await uploadFile(image.localPath, storagePath, bucket)
      if (url) {
        // Store with leading slash to match Firestore format
        uploadedImages.set(`/${image.relativePath}`, url)
        results.uploaded++
      } else {
        results.failed++
        results.errors.push(`Failed to upload: ${image.relativePath}`)
      }
    }

    console.log(`✅ Uploaded: ${results.uploaded}, Failed: ${results.failed}`)

    // Update Firestore documents
    console.log('🔄 Updating Firestore documents...')
    const hotelsSnapshot = await db.collection('hotels').get()

    for (const doc of hotelsSnapshot.docs) {
      const data = doc.data()
      let needsUpdate = false
      const updates: any = {}

      // Update mainImage
      if (data.mainImage && uploadedImages.has(data.mainImage)) {
        updates.mainImage = uploadedImages.get(data.mainImage)
        needsUpdate = true
      }

      // Update image
      if (data.image && uploadedImages.has(data.image)) {
        updates.image = uploadedImages.get(data.image)
        needsUpdate = true
      }

      // Update images array
      if (data.images && Array.isArray(data.images)) {
        const updatedImages = data.images.map((img: any) => {
          if (typeof img === 'string' && uploadedImages.has(img)) {
            return uploadedImages.get(img)
          }
          return img
        })

        if (JSON.stringify(updatedImages) !== JSON.stringify(data.images)) {
          updates.images = updatedImages
          needsUpdate = true
        }
      }

      if (needsUpdate) {
        await doc.ref.update(updates)
        console.log(`  ✅ Updated: ${data.name || doc.id}`)
        results.hotelsUpdated++
      } else {
        results.hotelsSkipped++
      }
    }

    console.log(`✅ Updated: ${results.hotelsUpdated} hotels`)
    console.log(`⏭️  Skipped: ${results.hotelsSkipped} hotels`)

    return {
      success: true,
      message: 'Migration completed successfully',
      results
    }
  } catch (error: any) {
    console.error('Migration error:', error)
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})
