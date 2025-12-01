#!/usr/bin/env node

/**
 * Migration Script: Upload images to Firebase Storage and update Firestore paths
 *
 * This script:
 * 1. Reads all images from /Users/udompolthivakorakot/Desktop/media
 * 2. Uploads them to Firebase Storage
 * 3. Updates Firestore hotel documents with correct Storage URLs
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../petcangoapp-firebase-adminsdk.json'), 'utf8')
)

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'petcangoapp.firebasestorage.app'
})

const db = getFirestore(app)
const bucket = getStorage(app).bucket()

const MEDIA_PATH = '/Users/udompolthivakorakot/Desktop/media'

/**
 * Upload a single file to Firebase Storage
 */
async function uploadFile(localPath, storagePath) {
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
  } catch (error) {
    console.error(`Error uploading ${localPath}:`, error.message)
    return null
  }
}

/**
 * Get content type from file extension
 */
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const types = {
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
function findImages(dir, baseDir = dir) {
  const images = []
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
 * Main migration function
 */
async function migrateImages() {
  console.log('🚀 Starting image migration...\n')

  // Check if media directory exists
  if (!fs.existsSync(MEDIA_PATH)) {
    console.error(`❌ Media directory not found: ${MEDIA_PATH}`)
    process.exit(1)
  }

  // Find all images
  console.log(`📂 Scanning for images in ${MEDIA_PATH}...`)
  const images = findImages(MEDIA_PATH)
  console.log(`✅ Found ${images.length} images\n`)

  // Upload images
  console.log('📤 Uploading images to Firebase Storage...')
  const uploadedImages = new Map() // Map: relativePath -> publicURL

  let uploaded = 0
  let failed = 0

  for (const image of images) {
    const storagePath = `hotels/${image.relativePath}`
    console.log(`  Uploading: ${image.relativePath}...`)

    const url = await uploadFile(image.localPath, storagePath)
    if (url) {
      uploadedImages.set(`/${image.relativePath}`, url)
      uploaded++
    } else {
      failed++
    }
  }

  console.log(`\n✅ Uploaded: ${uploaded}`)
  console.log(`❌ Failed: ${failed}\n`)

  // Update Firestore documents
  console.log('🔄 Updating Firestore documents...')
  const hotelsSnapshot = await db.collection('hotels').get()

  let updated = 0
  let skipped = 0

  for (const doc of hotelsSnapshot.docs) {
    const data = doc.data()
    let needsUpdate = false
    const updates = {}

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
      const updatedImages = data.images.map(img => {
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
      updated++
    } else {
      skipped++
    }
  }

  console.log(`\n✅ Updated: ${updated} hotels`)
  console.log(`⏭️  Skipped: ${skipped} hotels\n`)

  console.log('🎉 Migration completed!')
  process.exit(0)
}

// Run migration
migrateImages().catch(error => {
  console.error('❌ Migration failed:', error)
  process.exit(1)
})
