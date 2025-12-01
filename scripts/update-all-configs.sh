#!/bin/bash

# Script สำหรับอัปเดต MySQL config ในทุกไฟล์

echo "🔧 กำลังอัปเดต MySQL config ในทุก migration scripts..."

# ไฟล์ที่ต้องแก้
files=(
  "migrate-facilities.js"
  "migrate-provinces.js"
  "migrate-blogs.js"
  "migrate-hotels.js"
)

for file in "${files[@]}"
do
  echo "  📝 กำลังแก้ไข $file..."

  # Backup ไฟล์เดิม
  cp "scripts/$file" "scripts/$file.backup"

  # ลบบรรทัดที่กำหนด mysqlConfig
  sed -i '' '/const mysqlConfig = {/,/}/d' "scripts/$file"

  # เพิ่ม import mysqlConfig จากไฟล์แยก
  # หาบรรทัดที่มี "import mysql from"
  sed -i '' "/import mysql from 'mysql2\/promise'/a\\
import { mysqlConfig } from '../mysql.config.js'
" "scripts/$file"

  # แทนที่ require serviceAccount ด้วย readFileSync
  sed -i '' "s/const serviceAccount = require('..\/serviceAccountKey.json')/import { readFileSync } from 'fs'\\
const serviceAccount = JSON.parse(readFileSync('.\/serviceAccountKey.json', 'utf8'))/g" "scripts/$file"

  echo "  ✅ แก้ไข $file เสร็จแล้ว"
done

echo ""
echo "✅ อัปเดตทุกไฟล์เรียบร้อย!"
echo ""
echo "💡 ขั้นตอนถัดไป:"
echo "  1. แก้ไข password ใน mysql.config.js"
echo "  2. รัน: npm run migrate:test"
