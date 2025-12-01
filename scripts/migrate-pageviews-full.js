/**
 * Migration Script: PageViews (Full Migration)
 *
 * ย้ายข้อมูล pageview จาก MySQL (pet_pet_pageview) ไปยัง Firestore
 *
 * โครงสร้างใหม่:
 * - Collection: pageviews
 *   - pageType: 'hotel' | 'blog'
 *   - pageId: string (Firestore document ID)
 *   - hashedIP: string
 *   - createdAt: timestamp
 *   - date: string (YYYY-MM-DD)
 *
 * - hotels/{id}.viewCount: number (aggregated)
 * - blogs/{id}.viewCount: number (aggregated)
 *
 * ใช้ oldId เพื่อ map pagetype_id -> Firestore document ID
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore'
import mysql from 'mysql2/promise'
import { mysqlConfig } from '../mysql.config.js'
import { readFileSync } from 'fs'
import crypto from 'crypto'

// ตั้งค่า Firebase Admin
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

// Hash IP เหมือนกับใน composable
function hashIP(ip) {
  return crypto
    .createHash('sha256')
    .update(ip + 'petcango-salt')
    .digest('hex')
    .substring(0, 16)
}

// สร้าง mapping oldId -> Firestore ID
async function buildIdMapping() {
  console.log('📊 สร้าง ID Mapping...')

  const hotelMapping = new Map()
  const blogMapping = new Map()

  // ดึง hotels
  const hotelsSnapshot = await db.collection('hotels').get()
  hotelsSnapshot.forEach(doc => {
    const data = doc.data()
    if (data.oldId) {
      hotelMapping.set(parseInt(data.oldId), doc.id)
    }
  })
  console.log(`  ✓ Hotels: ${hotelMapping.size} mappings`)

  // ดึง blogs
  const blogsSnapshot = await db.collection('blogs').get()
  blogsSnapshot.forEach(doc => {
    const data = doc.data()
    if (data.oldId) {
      blogMapping.set(parseInt(data.oldId), doc.id)
    }
  })
  console.log(`  ✓ Blogs: ${blogMapping.size} mappings`)

  return { hotelMapping, blogMapping }
}

// นับ viewCount และอัพเดท document หลัก
async function updateViewCounts(connection, hotelMapping, blogMapping) {
  console.log('\n📈 อัพเดท viewCount ใน hotels และ blogs...')

  // นับ pageview per hotel
  const [hotelCounts] = await connection.execute(`
    SELECT pagetype_id, COUNT(*) as count
    FROM pet_pet_pageview
    WHERE pagetype = 'hotel'
    GROUP BY pagetype_id
  `)

  let hotelUpdated = 0
  for (const row of hotelCounts) {
    const firestoreId = hotelMapping.get(row.pagetype_id)
    if (firestoreId) {
      await db.collection('hotels').doc(firestoreId).update({
        viewCount: row.count
      })
      hotelUpdated++
    }
  }
  console.log(`  ✓ Hotels updated: ${hotelUpdated}`)

  // นับ pageview per blog
  const [blogCounts] = await connection.execute(`
    SELECT pagetype_id, COUNT(*) as count
    FROM pet_pet_pageview
    WHERE pagetype = 'blog'
    GROUP BY pagetype_id
  `)

  let blogUpdated = 0
  for (const row of blogCounts) {
    const firestoreId = blogMapping.get(row.pagetype_id)
    if (firestoreId) {
      await db.collection('blogs').doc(firestoreId).update({
        viewCount: row.count
      })
      blogUpdated++
    }
  }
  console.log(`  ✓ Blogs updated: ${blogUpdated}`)

  return { hotelUpdated, blogUpdated }
}

// Migrate raw pageview data (ทั้งหมด)
async function migrateAllPageviews(connection, hotelMapping, blogMapping) {
  console.log(`\n📝 Migrate pageviews ทั้งหมด...`)

  const [rows] = await connection.execute(`
    SELECT ipaddress, pagetype, pagetype_id, created_at
    FROM pet_pet_pageview
    ORDER BY created_at DESC
  `)

  console.log(`  พบ ${rows.length} records`)

  let migrated = 0
  let skipped = 0
  let batch = db.batch()
  let batchCount = 0

  for (const row of rows) {
    // Map oldId -> Firestore ID
    let pageId = null
    if (row.pagetype === 'hotel') {
      pageId = hotelMapping.get(row.pagetype_id)
    } else if (row.pagetype === 'blog') {
      pageId = blogMapping.get(row.pagetype_id)
    }

    if (!pageId) {
      skipped++
      continue
    }

    const docRef = db.collection('pageviews').doc()
    const createdAt = new Date(row.created_at)

    batch.set(docRef, {
      pageType: row.pagetype,
      pageId: pageId,
      hashedIP: hashIP(row.ipaddress || 'unknown'),
      createdAt: Timestamp.fromDate(createdAt),
      date: createdAt.toISOString().split('T')[0]
    })

    migrated++
    batchCount++

    // Firestore batch จำกัด 500 operations
    if (batchCount >= 500) {
      await batch.commit()
      console.log(`  💾 Committed batch: ${migrated} records`)
      batch = db.batch()
      batchCount = 0
    }
  }

  // Commit remaining
  if (batchCount > 0) {
    await batch.commit()
  }

  console.log(`  ✓ Migrated: ${migrated}`)
  console.log(`  ⚠ Skipped (no mapping): ${skipped}`)

  return { migrated, skipped }
}

// Main
async function main() {
  console.log('🚀 เริ่มต้น Migration: PageViews (Full)\n')

  let connection

  try {
    // เชื่อมต่อ MySQL
    connection = await mysql.createConnection(mysqlConfig)
    console.log('✅ เชื่อมต่อ MySQL สำเร็จ')

    // สร้าง ID mapping
    const { hotelMapping, blogMapping } = await buildIdMapping()

    // อัพเดท viewCount (aggregated)
    const updateResult = await updateViewCounts(connection, hotelMapping, blogMapping)

    // Migrate raw pageviews (ทั้งหมด)
    const migrateResult = await migrateAllPageviews(connection, hotelMapping, blogMapping)

    // สรุป
    console.log('\n' + '='.repeat(50))
    console.log('📊 สรุปผลการ Migration')
    console.log('='.repeat(50))
    console.log(`Hotels viewCount updated: ${updateResult.hotelUpdated}`)
    console.log(`Blogs viewCount updated: ${updateResult.blogUpdated}`)
    console.log(`Total pageviews migrated: ${migrateResult.migrated}`)
    console.log(`Skipped (no mapping): ${migrateResult.skipped}`)

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log('\n✅ ปิดการเชื่อมต่อ MySQL')
    }
  }
}

// รันสคริปต์
main()
  .then(() => {
    console.log('\n🎉 Migration เสร็จสิ้น!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Migration ล้มเหลว:', error)
    process.exit(1)
  })
