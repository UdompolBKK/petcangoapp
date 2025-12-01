/**
 * Migration Script: Blog Posts
 * ย้ายข้อมูลบทความจาก MySQL ไปยัง Firestore
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

async function migrateBlogs() {
  console.log('🚀 เริ่มต้น Migration: Blog Posts')

  let connection

  try {
    // เชื่อมต่อ MySQL
    connection = await mysql.createConnection(mysqlConfig)
    console.log('✅ เชื่อมต่อ MySQL สำเร็จ')

    // ดึงข้อมูลจาก pet_pet_blog
    const [blogs] = await connection.execute(
      'SELECT * FROM pet_pet_blog ORDER BY id DESC'
    )

    console.log(`📊 พบข้อมูล ${blogs.length} รายการ`)

    // เตรียม batch write
    const batch = db.batch()
    let count = 0

    for (const blog of blogs) {
      // สร้าง document reference
      const docRef = db.collection('blogs').doc()

      // กำหนดสถานะ (1 = published, 0 = draft)
      const status = blog.status === 1 ? 'published' : 'draft'

      // Parse วันที่
      const createdAt = blog.created_at ? new Date(blog.created_at) : new Date()
      const updatedAt = blog.updated_at ? new Date(blog.updated_at) : new Date()
      const publishedAt = status === 'published' ? createdAt : null

      // เตรียมข้อมูล
      const data = {
        oldId: blog.id.toString(),
        title: blog.name || '',
        slug: blog.slug || '',
        content: blog.content || '',
        excerpt: blog.mindes || '',
        featuredImage: blog.image || '',

        // Meta
        status: status,
        category: blog.category ? blog.category.toString() : null,
        tags: [], // จะต้องเพิ่มจากที่อื่นหรือ parse จาก content

        // Stats
        viewCount: 0, // จะอัปเดทีหลังจาก pageview table

        // Author
        authorId: null,
        authorName: null,

        // Timestamps
        publishedAt: publishedAt,
        createdAt: createdAt,
        updatedAt: updatedAt
      }

      batch.set(docRef, data)
      count++

      console.log(`  ✓ เพิ่ม: ${blog.name} (สถานะ: ${status})`)

      // Firestore batch จำกัดที่ 500 operations
      if (count % 500 === 0) {
        await batch.commit()
        console.log(`  💾 บันทึก batch ${count} รายการ`)
      }
    }

    // บันทึก batch สุดท้าย
    if (count % 500 !== 0) {
      await batch.commit()
    }

    console.log(`\n✅ Migration สำเร็จ! ย้ายข้อมูล ${count} รายการ`)

    // สรุปตามสถานะ
    console.log('\n📋 สรุปตามสถานะ:')
    const snapshot = await db.collection('blogs').get()
    const statusCounts = { published: 0, draft: 0 }
    snapshot.forEach(doc => {
      const status = doc.data().status
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })

    console.log(`  - เผยแพร่แล้ว: ${statusCounts.published} บทความ`)
    console.log(`  - แบบร่าง: ${statusCounts.draft} บทความ`)

    // แสดงตัวอย่างข้อมูล
    console.log('\n📋 ตัวอย่างบทความที่ย้าย:')
    const exampleSnapshot = await db.collection('blogs')
      .where('status', '==', 'published')
      .limit(5)
      .get()

    exampleSnapshot.forEach(doc => {
      const data = doc.data()
      console.log(`  - ${data.title}`)
      console.log(`    Slug: ${data.slug}`)
      console.log(`    Excerpt: ${data.excerpt.substring(0, 60)}...`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log('✅ ปิดการเชื่อมต่อ MySQL')
    }
  }
}

// รันสคริปต์
migrateBlogs()
  .then(() => {
    console.log('\n🎉 Migration เสร็จสิ้น!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 Migration ล้มเหลว:', error)
    process.exit(1)
  })
