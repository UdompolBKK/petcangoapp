/**
 * Migration Script: All Data
 * รันการ migrate ทั้งหมดตามลำดับที่ถูกต้อง
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const migrations = [
  {
    name: 'Facilities (สิ่งอำนวยความสะดวก)',
    script: 'migrate-facilities.js',
    description: 'ย้ายข้อมูลสิ่งอำนวยความสะดวก (~15 รายการ)'
  },
  {
    name: 'Provinces (จังหวัด)',
    script: 'migrate-provinces.js',
    description: 'ย้ายข้อมูลจังหวัด (31 จังหวัด)'
  },
  {
    name: 'Blogs (บทความ)',
    script: 'migrate-blogs.js',
    description: 'ย้ายข้อมูลบทความ (~30+ บทความ)'
  },
  {
    name: 'Hotels (ที่พัก)',
    script: 'migrate-hotels.js',
    description: 'ย้ายข้อมูลที่พัก (550+ ที่พัก) - จะใช้เวลานาน!'
  }
]

async function runMigration(migration) {
  console.log('\n' + '='.repeat(80))
  console.log(`🚀 เริ่ม Migration: ${migration.name}`)
  console.log(`📝 ${migration.description}`)
  console.log('='.repeat(80) + '\n')

  try {
    const { stdout, stderr } = await execAsync(`node scripts/${migration.script}`)

    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)

    console.log(`\n✅ ${migration.name} - สำเร็จ!\n`)
    return true
  } catch (error) {
    console.error(`\n❌ ${migration.name} - ล้มเหลว!`)
    console.error(error)
    return false
  }
}

async function migrateAll() {
  console.log('\n' + '█'.repeat(80))
  console.log('█' + ' '.repeat(78) + '█')
  console.log('█' + '  🎯 PetCanGo - Database Migration Script'.padEnd(78) + '█')
  console.log('█' + '  ย้ายข้อมูลจาก MySQL ไปยัง Firebase Firestore'.padEnd(78) + '█')
  console.log('█' + ' '.repeat(78) + '█')
  console.log('█'.repeat(80) + '\n')

  console.log('📋 รายการ Migration ที่จะทำ:')
  migrations.forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.name}`)
    console.log(`     └─ ${m.description}`)
  })

  console.log('\n⚠️  คำเตือน:')
  console.log('  - ตรวจสอบให้แน่ใจว่า MySQL Server กำลังทำงาน')
  console.log('  - ตรวจสอบว่า Firebase Admin SDK ได้รับการตั้งค่าแล้ว')
  console.log('  - การ migrate จะใช้เวลาประมาณ 5-10 นาที (ขึ้นอยู่กับจำนวนข้อมูล)')
  console.log('  - อย่าปิดโปรแกรมระหว่างการทำงาน\n')

  const startTime = Date.now()
  let successCount = 0

  for (let i = 0; i < migrations.length; i++) {
    const success = await runMigration(migrations[i])

    if (success) {
      successCount++
    } else {
      console.log('\n⛔ หยุดการ Migration เนื่องจากเกิดข้อผิดพลาด')
      break
    }

    // หน่วงเวลาเล็กน้อยระหว่าง migration
    if (i < migrations.length - 1) {
      console.log('⏸️  รอ 2 วินาทีก่อนเริ่ม migration ถัดไป...\n')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  console.log('\n' + '█'.repeat(80))
  console.log('█' + ' '.repeat(78) + '█')
  console.log('█' + '  🎉 Migration เสร็จสิ้น!'.padEnd(78) + '█')
  console.log('█' + ' '.repeat(78) + '█')
  console.log('█'.repeat(80) + '\n')

  console.log(`✅ สำเร็จ: ${successCount}/${migrations.length} migrations`)
  console.log(`⏱️  ใช้เวลา: ${duration} วินาที`)

  if (successCount === migrations.length) {
    console.log('\n💡 ขั้นตอนถัดไป:')
    console.log('  1. เข้า Firebase Console เพื่อตรวจสอบข้อมูล')
    console.log('  2. รัน npm run migrate:images เพื่อย้ายรูปภาพ')
    console.log('  3. ทดสอบเว็บไซต์ว่าแสดงผลถูกต้อง')
    console.log('  4. อัปเดต search indexes ใน Firestore (ถ้าจำเป็น)')
  } else {
    console.log('\n⚠️  พบข้อผิดพลาด กรุณาตรวจสอบ log ด้านบนและแก้ไข')
  }

  process.exit(successCount === migrations.length ? 0 : 1)
}

// รันสคริปต์
migrateAll()
