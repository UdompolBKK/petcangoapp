# PetCanGo - Migration Plan from OctoberCMS to Nuxt 3

## Website Overview

**Current Site**: https://petcango.com
**Platform**: OctoberCMS 1
**Purpose**: Pet-friendly hotel search and booking platform in Thailand

## Key Statistics
- 550+ pet-friendly accommodations
- 31+ provinces covered
- 220,850+ page views
- Active blog section with pet care articles

---

## Site Structure Analysis

### 1. Main Pages
- **Homepage** (`/`)
  - Hero section with search
  - Featured provinces carousel
  - New accommodations
  - Recommended hotels
  - Blog articles preview

- **All Provinces** (`/all-province`)
  - Carousel of 31 provinces
  - Hotel count per province
  - Clickable cards linking to province-specific hotels

- **Blog** (`/blogs`)
  - Card-based grid layout
  - ~30 articles
  - View count and date per post
  - Pet care and health topics

- **Authentication**
  - Login modal
  - Register page
  - Free hotel registration

### 2. Core Features

#### Search Functionality
- Province-based search
- Hotel search by name/location
- Filter by pet-friendly criteria

#### Hotel Listings
- Hotel cards with:
  - Name and description
  - Location (province)
  - Price information
  - Posted date
  - Images/thumbnails

#### Blog System
- Article management
- View tracking
- Date display
- Image upload
- Tags system

#### User Management
- User registration/login
- Hotel owner registration
- Free listing submission

---

## Database Schema (Needed)

### Required Tables

1. **Hotels/Accommodations**
   - id
   - name
   - description
   - province_id
   - address
   - price (or price range)
   - images (array/urls)
   - contact_info
   - amenities
   - pet_policies
   - created_at
   - updated_at
   - user_id (owner)
   - status (published/draft)

2. **Provinces**
   - id
   - name (Thai)
   - name_en (English)
   - slug
   - hotel_count

3. **Blog Posts**
   - id
   - title
   - slug
   - content
   - excerpt
   - featured_image
   - view_count
   - author_id
   - published_at
   - created_at
   - updated_at

4. **Tags**
   - id
   - name
   - slug

5. **Post Tags** (pivot)
   - post_id
   - tag_id

6. **Users**
   - id
   - name
   - email
   - password (hashed)
   - role (user/hotel_owner/admin)
   - created_at
   - updated_at

---

## Tech Stack for Nuxt Implementation

### Frontend
- **Nuxt 3** - Framework
- **Vue 3** - UI Components
- **TailwindCSS** - Styling (recommended)
- **Swiper.js** - Carousels (replace Slick)
- **VueUse** - Utilities
- **Nuxt Image** - Image optimization

### Backend
- **Firebase Firestore** - Database (NoSQL)
- **Firebase Storage** - Image/file storage
- **Firebase Auth** - Authentication
- **Firebase Admin SDK** - Server operations

### Additional
- **Nuxt Content** - Optional for blog (static)
- **Algolia/MeiliSearch** - Search (optional, advanced)

---

## Component Architecture

### Layout Components
```
layouts/
  ├── default.vue          # Main layout with header/footer
  ├── auth.vue             # Login/register layout
  └── dashboard.vue        # User dashboard layout
```

### Page Components
```
pages/
  ├── index.vue            # Homepage
  ├── all-province.vue     # Province listing
  ├── province/
  │   └── [slug].vue       # Province hotels
  ├── hotel/
  │   └── [id].vue         # Hotel detail
  ├── blogs/
  │   ├── index.vue        # Blog listing
  │   └── [slug].vue       # Blog post
  ├── login.vue
  ├── register.vue
  └── dashboard/
      ├── index.vue
      └── hotels/
          ├── create.vue
          └── [id]/edit.vue
```

### Reusable Components
```
components/
  ├── Header.vue
  ├── Footer.vue
  ├── Hero.vue
  ├── SearchBar.vue
  ├── HotelCard.vue
  ├── ProvinceCard.vue
  ├── BlogCard.vue
  ├── Carousel.vue
  ├── LoginModal.vue
  └── forms/
      ├── HotelForm.vue
      └── BlogForm.vue
```

---

## Firebase Data Structure

### Firestore Collections

#### hotels
```javascript
{
  id: "hotel_id",
  name: "Hotel Name",
  description: "Long description...",
  province: {
    id: "province_id",
    name: "ชลบุรี"
  },
  address: "Full address",
  price: 1500,
  priceRange: "1000-2000",
  images: ["url1", "url2"],
  thumbnail: "main_image_url",
  contact: {
    phone: "0812345678",
    email: "hotel@example.com",
    line: "@hotelid"
  },
  amenities: ["wifi", "parking", "pool"],
  petPolicies: {
    allowedPets: ["dog", "cat"],
    maxPets: 2,
    extraFee: 200,
    restrictions: "..."
  },
  ownerId: "user_id",
  status: "published",
  createdAt: timestamp,
  updatedAt: timestamp,
  viewCount: 0
}
```

#### provinces
```javascript
{
  id: "province_id",
  nameTh: "ชลบุรี",
  nameEn: "Chonburi",
  slug: "chonburi",
  hotelCount: 68,
  region: "East"
}
```

#### posts
```javascript
{
  id: "post_id",
  title: "Blog title",
  slug: "blog-title",
  content: "Full content...",
  excerpt: "Short description",
  featuredImage: "image_url",
  authorId: "user_id",
  tags: ["tag1", "tag2"],
  viewCount: 336,
  publishedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### users
```javascript
{
  uid: "firebase_uid",
  email: "user@example.com",
  displayName: "User Name",
  role: "hotel_owner", // user, hotel_owner, admin
  phoneNumber: "0812345678",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## Migration Steps

### Phase 1: Setup & Foundation
1. ✅ Initialize Nuxt 3 project
2. ✅ Configure Firebase (Client + Admin SDK)
3. Install UI framework (TailwindCSS)
4. Setup basic layout components
5. Configure routing

### Phase 2: Data Migration
1. Export data from OctoberCMS database
2. Transform data to Firebase format
3. Import provinces
4. Import hotels
5. Import blog posts
6. Import users (if needed)

### Phase 3: Core Features
1. Homepage with hero & search
2. Province listing with carousel
3. Hotel listing & filtering
4. Hotel detail page
5. Blog listing
6. Blog post page

### Phase 4: Authentication & User Features
1. Firebase Authentication setup
2. Login/Register pages
3. User dashboard
4. Hotel submission form
5. Hotel management (edit/delete)

### Phase 5: Advanced Features
1. Search functionality
2. Image upload to Firebase Storage
3. View count tracking
4. SEO optimization
5. Analytics integration

### Phase 6: Testing & Deployment
1. Testing all features
2. Performance optimization
3. Build for production
4. Deploy (Vercel/Netlify/Firebase Hosting)
5. Domain migration

---

## Required Information

### 1. Database Export (SQL)
Please provide MySQL/SQLite dump from OctoberCMS:
```bash
# Export all tables
mysqldump -u username -p database_name > petcango_backup.sql

# Or specific tables
mysqldump -u username -p database_name \
  hotels provinces posts users tags \
  > petcango_data.sql
```

### 2. Images/Assets
- Location of uploaded images
- Total size of media files
- Image naming convention

### 3. Business Requirements
- User roles and permissions
- Hotel approval workflow (auto-publish or admin review?)
- Payment integration needed?
- Booking system required?

### 4. OctoberCMS Details
- Plugin list used
- Custom components
- API endpoints (if any)

---

## Next Steps

1. **Provide SQL dump** - So we can analyze exact table structure
2. **Confirm features** - Which features to implement first?
3. **UI Design** - Keep similar design or redesign?
4. **Timeline** - Expected completion date?

---

## Estimated Timeline

- **Phase 1**: 1-2 days (Setup)
- **Phase 2**: 2-3 days (Data migration)
- **Phase 3**: 5-7 days (Core features)
- **Phase 4**: 3-4 days (Auth & user features)
- **Phase 5**: 3-5 days (Advanced features)
- **Phase 6**: 2-3 days (Testing & deployment)

**Total**: 16-24 days of development

---

## Questions for You

1. Do you have the SQL database backup ready?
2. Do you want to keep the same visual design or modernize it?
3. Should we implement booking functionality or just listings?
4. Do you need admin dashboard for content management?
5. What's your priority: speed to market or feature completeness?
