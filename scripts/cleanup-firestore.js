/**
 * Cleanup Script
 * ลบข้อมูลทั้งหมดใน Firestore และ Storage
 * ใช้ก่อนรัน migration ใหม่
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { readFileSync } from 'fs'

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app`
})

const db = getFirestore()
const bucket = getStorage().bucket()

/**
 * ลบ collection ทั้งหมด
 */
async function deleteCollection(collectionName, batchSize = 500) {
  const collectionRef = db.collection(collectionName)
  const query = collectionRef.limit(batchSize)

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject)
  })
}

async function deleteQueryBatch(query, resolve) {
  const snapshot = await query.get()

  const batchSize = snapshot.size
  if (batchSize === 0) {
    resolve()
    return
  }

  const batch = db.batch()
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })

  await batch.commit()
  console.log(`  ✓ ลบ ${batchSize} documents`)

  // Recurse on the next process tick
  process.nextTick(() => {
    deleteQueryBatch(query, resolve)
  })
}

/**
 * ลบโฟลเดอร์ใน Storage
 */
async function deleteFolder(folderPath) {
  try {
    const [files] = await bucket.getFiles({ prefix: folderPath })

    if (files.length === 0) {
      console.log(`  ⚠️  ไม่พบไฟล์ใน ${folderPath}`)
      return
    }

    console.log(`  📂 พบ ${files.length} ไฟล์ใน ${folderPath}`)

    // ลบทีละ batch (100 files)
    for (let i = 0; i < files.length; i += 100) {
      const batch = files.slice(i, i + 100)
      await Promise.all(batch.map(file => file.delete()))
      console.log(`  ✓ ลบแล้ว ${Math.min(i + 100, files.length)}/${files.length} ไฟล์`)
    }

    console.log(`  ✅ ลบโฟลเดอร์ ${folderPath} เสร็จสิ้น`)
  } catch (error) {
    console.error(`  ❌ Error deleting ${folderPath}:`, error.message)
  }
}

/**
 * Main function
 */
async function cleanup() {
  console.log('=' .repeat(80))
  console.log('🗑️  Cleanup Firestore & Storage')
  console.log('=' .repeat(80))
  console.log('')

  console.log('⚠️  คำเตือน: Script นี้จะลบข้อมูลทั้งหมด!')
  console.log('⚠️  ตรวจสอบให้แน่ใจว่าคุณต้องการลบข้อมูล')
  console.log('')

  try {
    // ลบ Firestore Collections
    console.log('🔥 ลบข้อมูลใน Firestore...\n')

    const collections = ['hotels', 'blogs', 'provinces', 'facilities']

    for (const collection of collections) {
      console.log(`📋 ลบ collection: ${collection}`)
      await deleteCollection(collection)
      console.log(`  ✅ ลบ ${collection} เสร็จสิ้น\n`)
    }

    // ลบ Storage Files
    console.log('\n☁️  ลบไฟล์ใน Storage...\n')

    const folders = ['media/', 'hotels/', 'blogs/', 'provinces/', 'facilities/']

    for (const folder of folders) {
      console.log(`📂 ลบโฟลเดอร์: ${folder}`)
      await deleteFolder(folder)
      console.log('')
    }

    console.log('=' .repeat(80))
    console.log('✅ Cleanup เสร็จสิ้น!')
    console.log('=' .repeat(80))
    console.log('')

    console.log('💡 ขั้นตอนถัดไป:')
    console.log('  1. รัน migration ใหม่: npm run migrate:all')
    console.log('  2. อัปโหลดรูปภาพ: npm run migrate:images')
    console.log('  3. ทดสอบเว็บไซต์: npm run dev')
    console.log('')

    process.exit(0)
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
    process.exit(1)
  }
}

cleanup()
