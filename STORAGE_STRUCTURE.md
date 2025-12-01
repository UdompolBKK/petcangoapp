# 📁 Firebase Storage Structure Design

## 🎯 คำแนะนำ: ใช้ 2-Phase Approach

### Phase 1: Migration (ตอนนี้)
อัปโหลดไฟล์ทั้งหมดไปยัง `media/*` โดยรักษา path structure เดิม

### Phase 2: Reorganize (ในอนาคต)
จัดระเบียบไฟล์ใหม่เป็น entity-based structure

---

## 📂 Phase 1: Current Structure (Migration)

```
gs://petcangoapp.firebasestorage.app/
└── media/
    ├── 0_facility/
    │   ├── icon_facility_fitness-min.png
    │   ├── icon_facility_parking-min.png
    │   └── ...
    ├── blogs/
    │   ├── blog1-min.jpg
    │   ├── blog2-min.jpg
    │   └── ...
    ├── hotel/
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── ...
    ├── chonburi/
    ├── chiangmai/
    └── ...
```

**ข้อดี:**
- ✅ Migration ง่าย รวดเร็ว
- ✅ ไม่ต้องแก้ logic มาก
- ✅ URL mapping ตรงไปตรงมา

**ข้อเสีย:**
- ❌ ยากต่อการจัดการในอนาคต
- ❌ Security Rules ซับซ้อน
- ❌ ไม่สามารถลบรูปตาม entity ได้ง่าย

**คำสั่ง:**
```bash
npm run migrate:images
```

---

## 🏗️ Phase 2: Recommended Structure (Reorganize)

```
gs://petcangoapp.firebasestorage.app/
│
├── hotels/
│   ├── {hotelId}/              # ID ของ hotel document
│   │   ├── main.jpg            # รูปหลัก
│   │   ├── thumbnail.jpg       # รูป thumbnail (auto-generated)
│   │   └── gallery/
│   │       ├── 1.jpg
│   │       ├── 2.jpg
│   │       ├── 3.jpg
│   │       └── ...
│   │
│   ├── abc123def/
│   │   ├── main.jpg
│   │   └── gallery/
│   │       └── 1.jpg
│   └── ...
│
├── provinces/
│   ├── {provinceId}/
│   │   ├── cover.jpg           # รูปหน้าปก
│   │   └── attractions/
│   │       ├── 1.jpg
│   │       ├── 2.jpg
│   │       └── ...
│   └── ...
│
├── blogs/
│   ├── {blogId}/
│   │   ├── featured.jpg        # รูปหลัก
│   │   └── content/            # รูปใน content
│   │       ├── 1.jpg
│   │       ├── 2.jpg
│   │       └── ...
│   └── ...
│
├── facilities/
│   ├── {facilityId}/
│   │   └── icon.png
│   └── ...
│
├── shared/
│   ├── banners/
│   │   ├── home-hero.jpg
│   │   └── promotion-banner.jpg
│   ├── logos/
│   │   ├── logo.svg
│   │   └── logo-white.svg
│   └── defaults/
│       ├── hotel-placeholder.jpg
│       ├── blog-placeholder.jpg
│       └── avatar-placeholder.png
│
└── users/                      # สำหรับอนาคต
    ├── {userId}/
    │   ├── avatar.jpg
    │   └── uploads/
    │       └── ...
    └── ...
```

**คำสั่ง:**
```bash
npm run storage:reorganize
```

---

## 🎨 ข้อดีของ Entity-based Structure

### 1. **การจัดการง่าย**
```typescript
// ลบรูปทั้งหมดของ hotel
await deleteFolder(`hotels/${hotelId}`)

// ลบแค่ gallery
await deleteFolder(`hotels/${hotelId}/gallery`)
```

### 2. **Security Rules ชัดเจน**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Hotels - อนุญาตให้อ่านทุกคน, เขียนได้แค่ admin
    match /hotels/{hotelId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    // User uploads - เจ้าของเท่านั้น
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }

    // Shared files - อ่านได้ทุกคน
    match /shared/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

### 3. **Backup/Restore แยกส่วน**
```bash
# Backup เฉพาะ hotels
gsutil -m cp -r gs://petcangoapp.firebasestorage.app/hotels ./backup/

# Restore เฉพาะ blogs
gsutil -m cp -r ./backup/blogs gs://petcangoapp.firebasestorage.app/
```

### 4. **Analytics และ Monitoring**
```typescript
// นับจำนวนรูปของแต่ละ hotel
const fileCount = await countFiles(`hotels/${hotelId}`)

// ดูขนาด storage ที่ใช้
const size = await getStorageSize(`hotels/${hotelId}`)
```

### 5. **Image Optimization**
```typescript
// สร้าง thumbnails อัตโนมัติ
// Original: hotels/{hotelId}/main.jpg
// Thumb:    hotels/{hotelId}/thumbnail.jpg
// Resized:  hotels/{hotelId}/main_800x600.jpg
```

---

## 📊 เปรียบเทียบ

| Feature | Phase 1 (Flat) | Phase 2 (Entity-based) |
|---------|----------------|------------------------|
| Migration Speed | ⚡ เร็ว | 🐌 ช้ากว่า |
| Organization | ❌ ไม่มี | ✅ ดีมาก |
| Security Rules | ❌ ซับซ้อน | ✅ ง่าย |
| Deletion | ❌ ยาก | ✅ ง่าย |
| Backup/Restore | ❌ ยาก | ✅ ง่าย |
| Scalability | ❌ แย่ | ✅ ดี |
| Future-proof | ❌ ไม่ | ✅ ใช่ |

---

## 🚀 แผนการทำงาน

### ✅ Step 1: Migration (ทำตอนนี้)
```bash
# 1. Migrate database
npm run migrate:all

# 2. Upload images to media/*
npm run migrate:images
```

**ผลลัพธ์:**
- ข้อมูลทั้งหมดอยู่ใน Firestore
- รูปภาพอยู่ใน Storage (media/*)
- เว็บไซต์ใช้งานได้

---

### ⏭️ Step 2: Reorganize (ทำทีหลัง - ไม่บังคับ)

**เมื่อไหร่ควรทำ:**
- เมื่อเว็บไซต์ stable แล้ว
- เมื่อต้องการ security rules ที่ดีขึ้น
- เมื่อต้องการจัดการรูปภาพง่ายขึ้น

**วิธีทำ:**
```bash
# 1. Reorganize storage structure
npm run storage:reorganize

# 2. ตรวจสอบผลลัพธ์
# - ตรวจสอบ Firebase Console
# - ทดสอบเว็บไซต์

# 3. ลบไฟล์เก่า (optional)
# ใช้ Firebase Console หรือ gsutil
```

**หมายเหตุ:**
- Script จะ COPY ไฟล์ไปยัง path ใหม่ (ไม่ลบไฟล์เก่า)
- ตรวจสอบให้แน่ใจก่อนลบไฟล์เก่า
- แนะนำทำ backup ก่อน

---

## 💾 Database Schema Changes

### Phase 1 (Current):
```javascript
{
  mainImage: "https://storage.googleapis.com/.../media/hotel/1.jpg",
  gallery: [
    { image: "https://storage.googleapis.com/.../media/hotel/gallery1.jpg" }
  ]
}
```

### Phase 2 (After Reorganize):
```javascript
{
  mainImage: "https://storage.googleapis.com/.../hotels/abc123/main.jpg",
  gallery: [
    { image: "https://storage.googleapis.com/.../hotels/abc123/gallery/1.jpg" }
  ]
}
```

---

## 🛡️ Security Rules

### Phase 1 Rules (Simple):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /media/{allPaths=**} {
      allow read: if true;
      allow write: if false;  // Admin SDK only
    }
  }
}
```

### Phase 2 Rules (Advanced):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    match /hotels/{hotelId}/{allPaths=**} {
      allow read: if true;
      allow create: if request.auth.token.admin == true;
      allow update, delete: if request.auth.token.admin == true;
    }

    match /blogs/{blogId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true
                   || request.auth.token.editor == true;
    }

    match /shared/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## 🎯 คำแนะนำสุดท้าย

### สำหรับตอนนี้ (Launch):
✅ **ใช้ Phase 1 (Flat Structure)**
- เร็ว ง่าย ทำได้ทันที
- เหมาะกับการ launch เร็ว
- รักษา path เดิมจาก MySQL

### สำหรับอนาคต (Optimization):
✅ **Migrate ไปยัง Phase 2 (Entity-based)**
- ทำเมื่อมีเวลามากขึ้น
- Security ดีขึ้น
- จัดการง่ายขึ้น
- Scalable

---

## 📞 เอกสารเพิ่มเติม

- [Firebase Storage Best Practices](https://firebase.google.com/docs/storage/best-practices)
- [Firebase Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Image Optimization with Cloud Functions](https://firebase.google.com/docs/storage/extend-with-functions)
