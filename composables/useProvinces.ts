import { where, orderBy, limit } from 'firebase/firestore'

export const useProvinces = () => {
  const { getCollection, getDocument } = useFirestore()

  /**
   * ดึงจังหวัดทั้งหมด
   */
  const getAllProvinces = async () => {
    return await getCollection(
      'provinces',
      orderBy('name', 'asc')
    )
  }

  /**
   * ดึงจังหวัดยอดนิยม (เรียงตาม hotelCount)
   */
  const getFeaturedProvinces = async (limitCount = 8) => {
    try {
      // ลองดึงแบบเรียงตาม hotelCount
      const result = await getCollection(
        'provinces',
        orderBy('hotelCount', 'desc'),
        limit(limitCount)
      )
      console.log('getFeaturedProvinces result:', result.length, 'items')
      return result
    } catch (err) {
      console.error('getFeaturedProvinces error, using fallback:', err)
      // Fallback: ดึงโดยไม่เรียง แล้ว sort ใน client
      const all = await getCollection('provinces')
      console.log('Fallback: got', all.length, 'provinces')
      return all
        .sort((a: any, b: any) => (b.hotelCount || 0) - (a.hotelCount || 0))
        .slice(0, limitCount)
    }
  }

  /**
   * ดึงจังหวัดตามภูมิภาค
   */
  const getProvincesByRegion = async (region: string) => {
    return await getCollection(
      'provinces',
      where('region', '==', region),
      orderBy('name', 'asc')
    )
  }

  /**
   * ดึงจังหวัดตาม ID
   */
  const getProvinceById = async (id: string) => {
    return await getDocument('provinces', id)
  }

  /**
   * ดึงจังหวัดตาม slug
   */
  const getProvinceBySlug = async (slug: string) => {
    const provinces = await getCollection(
      'provinces',
      where('slug', '==', slug),
      limit(1)
    )

    return provinces.length > 0 ? provinces[0] : null
  }

  /**
   * จัดกลุ่มจังหวัดตามภูมิภาค
   */
  const getProvincesGroupedByRegion = async () => {
    const allProvinces = await getAllProvinces()

    const grouped: Record<string, any[]> = {
      north: [],
      south: [],
      east: [],
      west: [],
      middle: [],
      'east-north': []
    }

    allProvinces.forEach((province: any) => {
      const region = province.region || 'middle'
      if (!grouped[region]) {
        grouped[region] = []
      }
      grouped[region].push(province)
    })

    return grouped
  }

  return {
    getAllProvinces,
    getFeaturedProvinces,
    getProvincesByRegion,
    getProvinceById,
    getProvinceBySlug,
    getProvincesGroupedByRegion
  }
}
