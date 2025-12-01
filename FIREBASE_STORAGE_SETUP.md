# 🔥 คู่มือการตั้งค่า Firebase Storage

## ❌ Error ที่พบ

```
The specified bucket does not exist.
gs://petcangoapp.firebasestorage.app
```

**สาเหตุ:** Firebase Storage bucket ยังไม่ได้เปิดใช้งาน

---

## ✅ วิธีแก้ไข

### ขั้นตอนที่ 1: เปิด Firebase Console

ไปที่: **[Firebase Storage Console](https://console.firebase.google.com/project/petcangoapp/storage)**

หรือ:
1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. เลือกโปรเจค **petcangoapp**
3. คลิกเมนู **Storage** ทางด้านซ้าย

---

### ขั้นตอนที่ 2: เปิดใช้งาน Firebase Storage

1. คลิกปุ่ม **"Get Started"** หรือ **"เริ่มใช้งาน"**

2. เลือก **Security Rules**:
   - สำหรับ Development: เลือก **"Start in test mode"**
   - จะได้ rules ที่อนุญาตให้ read/write ได้ 30 วัน

   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.time < timestamp.date(2025, 1, 1);
       }
     }
   }
   ```

3. เลือก **Storage Location**:
   - แนะนำ: **asia-southeast1** (Singapore) - ใกล้ประเทศไทยที่สุด
   - หรือ: **asia-southeast2** (Jakarta)
   - หรือ: **asia-east1** (Taiwan)

4. คลิก **"Done"** หรือ **"เสร็จสิ้น"**

5. รอสักครู่จนกว่า Storage bucket จะถูกสร้าง

---

### ขั้นตอนที่ 3: ตรวจสอบ Bucket URL

หลังจากสร้างเสร็จ คุณจะเห็น bucket URL:
- **Default bucket:** `petcangoapp.appspot.com`
- **Full URL:** `gs://petcangoapp.appspot.com`

---

### ขั้นตอนที่ 4: ตั้งค่า CORS (สำหรับ Production)

ถ้าต้องการให้เว็บไซต์เข้าถึงรูปภาพได้ ต้องตั้งค่า CORS:

1. สร้างไฟล์ `cors.json`:
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "HEAD"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

2. รันคำสั่ง (ต้องติดตั้ง Google Cloud SDK ก่อน):
   ```bash
   gsutil cors set cors.json gs://petcangoapp.appspot.com
   ```

**หรือ** ใช้ Firebase CLI:
```bash
firebase deploy --only storage
```

---

### ขั้นตอนที่ 5: ตั้งค่า Security Rules ที่ถูกต้อง (Production)

แก้ไข Security Rules ให้เหมาะสม:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // อนุญาตให้อ่านไฟล์ใน media ได้ทุกคน
    match /media/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Admin เท่านั้นที่เขียนได้ (ผ่าน Admin SDK)
    }

    // ไฟล์อื่นๆ ต้อง login ก่อน
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

### ขั้นตอนที่ 6: รัน Migration Images อีกครั้ง

หลังจากตั้งค่า Storage เรียบร้อยแล้ว:

```bash
npm run migrate:images
```

---

## 📊 ผลลัพธ์ที่คาดหวัง

```
🚀 เริ่มต้น Migration: Images to Firebase Storage
📂 Source: /Users/udompolthivakorakot/Desktop/storage/app/media
☁️  Destination: gs://petcangoapp.appspot.com/

📊 พบรูปภาพทั้งหมด: 5087 ไฟล์
⏳ กำลังอัปโหลด... (อาจใช้เวลานาน)

  ⏳ กำลังอัปโหลด... 100/5087 (95 สำเร็จ, 0 ล้มเหลว, 5 ข้าม)
  ⏳ กำลังอัปโหลด... 200/5087 (190 สำเร็จ, 0 ล้มเหลว, 10 ข้าม)
  ...
```

---

## 🎯 ข้อมูลเพิ่มเติม

### โครงสร้างโฟลเดอร์ใน Storage:

```
gs://petcangoapp.appspot.com/
└── media/
    ├── 0_facility/
    │   ├── icon_facility_fitness-min.png
    │   └── ...
    ├── blogs/
    │   ├── blog1-min.jpg
    │   └── ...
    ├── hotel/
    │   ├── 1.jpg
    │   └── ...
    ├── chonburi/
    ├── chiangmai/
    └── ...
```

### URL ของรูปภาพหลัง Migration:

**ก่อน Migration:**
```
/storage/app/media/hotel/1.jpg
```

**หลัง Migration:**
```
https://storage.googleapis.com/petcangoapp.appspot.com/media/hotel/1.jpg
```

---

## ⚠️ ข้อควรระวัง

1. **ค่าใช้จ่าย:**
   - Firebase Storage ฟรี 5GB
   - ถ้าเกิน 5GB จะมีค่าใช้จ่าย
   - ตรวจสอบขนาดไฟล์: `du -sh ~/Desktop/storage/app/media`

2. **เวลาในการอัปโหลด:**
   - 5,000+ ไฟล์อาจใช้เวลา 30-60 นาที
   - อย่าปิด terminal ระหว่างอัปโหลด

3. **Bandwidth:**
   - Firebase Storage ฟรี 1GB/day download
   - ถ้าเกินอาจมีค่าใช้จ่าย

---

## 📞 ลิงก์ที่เป็นประโยชน์

- [Firebase Storage Console](https://console.firebase.google.com/project/petcangoapp/storage)
- [Firebase Storage Pricing](https://firebase.google.com/pricing)
- [Firebase Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Storage CORS](https://firebase.google.com/docs/storage/web/download-files#cors_configuration)
