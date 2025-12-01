# 🔧 คู่มือการตั้งค่า MySQL สำหรับ Migration

## ✅ อัปเดตไฟล์ Config แล้ว!

ตอนนี้ไฟล์ migration scripts ทั้งหมดได้รับการอัปเดตให้ใช้ config แบบรวมศูนย์แล้ว

### ไฟล์ที่อัปเดตแล้ว:
- ✅ `mysql.config.js` - ไฟล์ config หลัก
- ✅ `scripts/test-connection.js` - ทดสอบการเชื่อมต่อ
- ✅ `scripts/migrate-facilities.js` - Migration สิ่งอำนวยความสะดวก
- ✅ `scripts/migrate-provinces.js` - Migration จังหวัด
- ✅ `scripts/migrate-blogs.js` - Migration บทความ
- ✅ `scripts/migrate-hotels.js` - Migration ที่พัก
- ✅ `scripts/migrate-all.js` - รันทั้งหมด

---

## 📝 ขั้นตอนถัดไป

### 1. แก้ไข MySQL Password

เปิดไฟล์ `mysql.config.js` และแก้ไข password:

```javascript
export const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',  // 👈 ใส่ password ของคุณตรงนี้
  database: 'dsignweb_petallow'
}
```

**ตัวอย่าง password ที่ใช้บ่อย:**
- Docker: `root`
- MAMP: `root`
- XAMPP: (ว่างเปล่า หรือ `''`)
- Homebrew: ตามที่ตั้งไว้ตอน install

---

### 2. ตรวจสอบว่า MySQL Server ทำงานอยู่

**ถ้าใช้ Docker:**
```bash
docker ps | grep mysql
```

**ถ้าใช้ Homebrew:**
```bash
brew services list | grep mysql
```

**ถ้ายังไม่เปิด:**
```bash
# Docker
docker start mysql-petcango

# Homebrew
brew services start mysql
```

---

### 3. Import SQL File (ถ้ายังไม่ได้ทำ)

```bash
mysql -u root -p dsignweb_petallow < ~/Desktop/dsignweb_petallow.sql
```

จะถูกถามรหัสผ่าน ให้ใส่รหัสผ่าน MySQL ของคุณ

---

### 4. ทดสอบการเชื่อมต่อ

```bash
npm run migrate:test
```

**ผลลัพธ์ที่คาดหวัง:**
```
✅ ผ่าน: 4 tests
❌ ล้มเหลว: 0 tests
🎉 ระบบพร้อมสำหรับการ Migration!
```

---

### 5. รัน Migration

**รันทั้งหมดพร้อมกัน (แนะนำ):**
```bash
npm run migrate:all
```

**หรือรันทีละอัน:**
```bash
npm run migrate:facilities
npm run migrate:provinces
npm run migrate:blogs
npm run migrate:hotels
```

---

## 🐛 Troubleshooting

### ❌ Error: Access denied for user 'root'@'localhost'

**สาเหตุ:** Password ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ password ใน `mysql.config.js`
2. ลองเข้า MySQL ด้วย command line:
   ```bash
   mysql -u root -p
   ```
3. ถ้าเข้าไม่ได้ ให้ reset password หรือตรวจสอบการติดตั้ง MySQL

---

### ❌ Error: Unknown database 'dsignweb_petallow'

**สาเหตุ:** ยังไม่ได้ import SQL file

**วิธีแก้:**
1. สร้างฐานข้อมูล:
   ```bash
   mysql -u root -p -e "CREATE DATABASE dsignweb_petallow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

2. Import ข้อมูล:
   ```bash
   mysql -u root -p dsignweb_petallow < ~/Desktop/dsignweb_petallow.sql
   ```

---

### ❌ Error: connect ECONNREFUSED 127.0.0.1:3306

**สาเหตุ:** MySQL Server ไม่ทำงาน

**วิธีแก้:**
- Docker: `docker start mysql-petcango`
- Homebrew: `brew services start mysql`
- MAMP/XAMPP: เปิดโปรแกรมและ start MySQL

---

### ❌ Error: Cannot find module './serviceAccountKey.json'

**สาเหตุ:** ยังไม่ได้วาง Service Account Key

**วิธีแก้:**
1. ดาวน์โหลดจาก [Firebase Console](https://console.firebase.google.com/)
2. ไป Project Settings → Service Accounts
3. กด "Generate New Private Key"
4. บันทึกเป็น `serviceAccountKey.json` ที่ root ของโปรเจค

---

## 📞 ติดต่อ

หากพบปัญหาหรือมีคำถาม กรุณาตรวจสอบ:
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - คู่มือฉบับเต็ม
- [scripts/README.md](scripts/README.md) - เอกสารทางเทคนิค
- [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) - สรุปภาพรวม
