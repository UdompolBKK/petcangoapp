import { where, orderBy, limit } from 'firebase/firestore'

export const useHotels = () => {
  const { getCollection, getDocument } = useFirestore()

  /**
   * ดึงที่พักทั้งหมด
   */
  const getAllHotels = async (limitCount?: number) => {
    // ดึงข้อมูลโดยใช้ orderBy อย่างเดียว แล้ว filter ใน JavaScript
    const constraints = [orderBy('createdAt', 'desc')]

    if (limitCount) {
      constraints.push(limit(limitCount * 2)) // ดึงมากกว่าที่ต้องการเผื่อ filter
    }

    const allHotels = await getCollection('hotels', ...constraints)

    // Filter เฉพาะ published
    const publishedHotels = allHotels.filter((hotel: any) => hotel.status === 'published')

    // จำกัดจำนวนถ้ามี limitCount
    return limitCount ? publishedHotels.slice(0, limitCount) : publishedHotels
  }

  /**
   * ดึงที่พักใหม่ล่าสุด
   */
  const getNewHotels = async (limitCount = 8) => {
    // ดึงข้อมูลโดยใช้ orderBy อย่างเดียว แล้ว filter ใน JavaScript
    const allHotels = await getCollection(
      'hotels',
      orderBy('createdAt', 'desc'),
      limit(limitCount * 2) // ดึงมากกว่าที่ต้องการเผื่อ filter
    )

    // Filter เฉพาะ published และจำกัดจำนวน
    return allHotels
      .filter((hotel: any) => hotel.status === 'published')
      .slice(0, limitCount)
  }

  /**
   * ดึงที่พักแนะนำ (เรียงตาม priority และ viewCount)
   */
  const getRecommendedHotels = async (limitCount = 8) => {
    // ดึงข้อมูลโดยใช้ orderBy อย่างเดียว แล้ว sort ใน JavaScript
    const allHotels = await getCollection(
      'hotels',
      orderBy('priority', 'desc'),
      limit(limitCount * 2) // ดึงมากกว่าที่ต้องการเผื่อ filter
    )

    // Filter เฉพาะ published และ sort ตาม viewCount
    return allHotels
      .filter((hotel: any) => hotel.status === 'published')
      .sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limitCount)
  }

  /**
   * ดึงที่พักตาม featured flag
   */
  const getFeaturedHotels = async (limitCount = 8) => {
    // ดึงข้อมูลโดยใช้ orderBy อย่างเดียว แล้ว filter ใน JavaScript
    const allHotels = await getCollection(
      'hotels',
      orderBy('viewCount', 'desc'),
      limit(limitCount * 3) // ดึงมากกว่าที่ต้องการเผื่อ filter
    )

    // Filter เฉพาะ published และ featured
    return allHotels
      .filter((hotel: any) => hotel.status === 'published' && hotel.featured === true)
      .slice(0, limitCount)
  }

  /**
   * ดึงที่พักตามจังหวัด
   */
  const getHotelsByProvince = async (provinceId: string, limitCount?: number) => {
    // ดึงข้อมูลโดยใช้ orderBy อย่างเดียว แล้ว filter ใน JavaScript
    const constraints = [orderBy('priority', 'desc')]

    if (limitCount) {
      constraints.push(limit(limitCount * 3)) // ดึงมากกว่าที่ต้องการเผื่อ filter
    }

    const allHotels = await getCollection('hotels', ...constraints)

    // Filter เฉพาะ published และจังหวัดที่ต้องการ
    const filteredHotels = allHotels.filter(
      (hotel: any) => hotel.status === 'published' && hotel.province?.id === provinceId
    )

    // จำกัดจำนวนถ้ามี limitCount
    return limitCount ? filteredHotels.slice(0, limitCount) : filteredHotels
  }

  /**
   * ดึงที่พักตาม ID
   */
  const getHotelById = async (id: string) => {
    return await getDocument('hotels', id)
  }

  /**
   * ดึงที่พักตาม slug
   */
  const getHotelBySlug = async (slug: string) => {
    const allHotels = await getCollection('hotels', orderBy('createdAt', 'desc'))

    // Filter by slug and published status in JavaScript
    const filteredHotels = allHotels.filter((hotel: any) =>
      hotel.slug === slug && hotel.status === 'published'
    )

    return filteredHotels.length > 0 ? filteredHotels[0] : null
  }

  /**
   * ค้นหาที่พัก
   */
  const searchHotels = async (searchParams: {
    provinceName?: string
    minPrice?: number
    maxPrice?: number
    facilities?: string[]
  }) => {
    // ดึงข้อมูลโดยใช้ orderBy อย่างเดียว แล้ว filter ทั้งหมดใน JavaScript
    const allHotels = await getCollection('hotels', orderBy('priceStart', 'asc'))

    // Filter ตามเงื่อนไขต่างๆ ใน JavaScript
    let filteredHotels = allHotels.filter((hotel: any) => {
      // ต้อง published เท่านั้น
      if (hotel.status !== 'published') return false

      // Filter ตามจังหวัด
      if (searchParams.provinceName && hotel.province?.name !== searchParams.provinceName) {
        return false
      }

      // Filter ตามราคาต่ำสุด
      if (searchParams.minPrice && hotel.priceStart < searchParams.minPrice) {
        return false
      }

      // Filter ตามราคาสูงสุด
      if (searchParams.maxPrice && hotel.priceStart > searchParams.maxPrice) {
        return false
      }

      return true
    })

    // Filter facilities
    if (searchParams.facilities && searchParams.facilities.length > 0) {
      filteredHotels = filteredHotels.filter(hotel => {
        const hotelFacilityIds = hotel.facilities?.map((f: any) => f.id) || []
        return searchParams.facilities!.some(facId => hotelFacilityIds.includes(facId))
      })
    }

    return filteredHotels
  }

  return {
    getAllHotels,
    getNewHotels,
    getRecommendedHotels,
    getFeaturedHotels,
    getHotelsByProvince,
    getHotelById,
    getHotelBySlug,
    searchHotels
  }
}
