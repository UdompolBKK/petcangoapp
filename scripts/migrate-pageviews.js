/**
 * Migration Script: Page Views
 * อัปเดต viewCount ใน hotels และ blogs จากข้อมูล pet_pet_pageview ใน MySQL
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import mysql from 'mysql2/promise'
import { mysqlConfig } from '../mysql.config.js'
import { readFileSync } from 'fs'

// ตั้งค่า Firebase Admin
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'))

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

async function migratePageViews() {
  console.log('🚀 เริ่มต้น Migration: Page Views')
  console.log('=' .repeat(60))

  let connection

  try {
    // เชื่อมต่อ MySQL
    connection = await mysql.createConnection(mysqlConfig)
    console.log('✅ เชื่อมต่อ MySQL สำเร็จ')

    // ดึงข้อมูล pageview สรุปตาม pagetype และ pagetype_id
    console.log('\n📊 กำลังนับ page views จาก MySQL...')

    const [pageViews] = await connection.execute(`
      SELECT pagetype, pagetype_id, COUNT(*) as views
      FROM pet_pet_pageview
      GROUP BY pagetype, pagetype_id
    `)

    console.log(`  ✓ พบข้อมูล ${pageViews.length} กลุ่ม`)

    // แยก views ตามประเภท
    const hotelViews = {}
    const blogViews = {}

    for (const row of pageViews) {
      if (row.pagetype === 'hotel') {
        hotelViews[row.pagetype_id.toString()] = row.views
      } else if (row.pagetype === 'blog') {
        blogViews[row.pagetype_id.toString()] = row.views
      }
    }

    console.log(`  ✓ Hotel views: ${Object.keys(hotelViews).length} hotels`)
    console.log(`  ✓ Blog views: ${Object.keys(blogViews).length} blogs`)

    // อัปเดต Hotels
    console.log('\n🏨 กำลังอัปเดต viewCount ใน Hotels...')

    const hotelsSnapshot = await db.collection('hotels').get()
    let hotelUpdateCount = 0
    let hotelBatch = db.batch()
    let hotelBatchCount = 0

    for (const doc of hotelsSnapshot.docs) {
      const data = doc.data()
      const oldId = data.oldId

      if (oldId && hotelViews[oldId]) {
        const views = hotelViews[oldId]
        hotelBatch.update(doc.ref, { viewCount: views })
        hotelUpdateCount++
        hotelBatchCount++

        // Firestore batch จำกัดที่ 500 operations
        if (hotelBatchCount >= 500) {
          await hotelBatch.commit()
          console.log(`  💾 บันทึก batch (${hotelUpdateCount} hotels)`)
          hotelBatch = db.batch()
          hotelBatchCount = 0
        }
      }
    }

    // บันทึก batch สุดท้าย
    if (hotelBatchCount > 0) {
      await hotelBatch.commit()
    }

    console.log(`  ✅ อัปเดต ${hotelUpdateCount} hotels`)

    // อัปเดต Blogs
    console.log('\n📝 กำลังอัปเดต viewCount ใน Blogs...')

    const blogsSnapshot = await db.collection('blogs').get()
    let blogUpdateCount = 0
    let blogBatch = db.batch()
    let blogBatchCount = 0

    for (const doc of blogsSnapshot.docs) {
      const data = doc.data()
      const oldId = data.oldId

      if (oldId && blogViews[oldId]) {
        const views = blogViews[oldId]
        blogBatch.update(doc.ref, { viewCount: views })
        blogUpdateCount++
        blogBatchCount++

        // Firestore batch จำกัดที่ 500 operations
        if (blogBatchCount >= 500) {
          await blogBatch.commit()
          console.log(`  💾 บันทึก batch (${blogUpdateCount} blogs)`)
          blogBatch = db.batch()
          blogBatchCount = 0
        }
      }
    }

    // บันทึก batch สุดท้าย
    if (blogBatchCount > 0) {
      await blogBatch.commit()
    }

    console.log(`  ✅ อัปเดต ${blogUpdateCount} blogs`)

    // แสดงสรุป
    console.log('\n' + '='.repeat(60))
    console.log('📊 สรุปผลการ Migration')
    console.log('='.repeat(60))
    console.log(`  🏨 Hotels: อัปเดต ${hotelUpdateCount} รายการ`)
    console.log(`  📝 Blogs: อัปเดต ${blogUpdateCount} รายการ`)

    // แสดง Top 10 Hotels ที่มี views มากที่สุด
    console.log('\n🏆 Top 10 Hotels (by views):')
    const topHotelsSnapshot = await db.collection('hotels')
      .orderBy('viewCount', 'desc')
      .limit(10)
      .get()

    let rank = 1
    for (const doc of topHotelsSnapshot.docs) {
      const data = doc.data()
      console.log(`  ${rank}. ${data.name} - ${data.viewCount || 0} views`)
      rank++
    }

    // แสดง Top 5 Blogs ที่มี views มากที่สุด
    console.log('\n🏆 Top 5 Blogs (by views):')
    const topBlogsSnapshot = await db.collection('blogs')
      .orderBy('viewCount', 'desc')
      .limit(5)
      .get()

    rank = 1
    for (const doc of topBlogsSnapshot.docs) {
      const data = doc.data()
      console.log(`  ${rank}. ${data.title || data.name} - ${data.viewCount || 0} views`)
      rank++
    }

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
migratePageViews()
  .then(() => {
    console.log('\n🎉 Migration Page Views เสร็จสิ้น!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Migration ล้มเหลว:', error)
    process.exit(1)
  })
