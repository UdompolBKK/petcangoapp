import { adminFirestore } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const status = query.status as string
    const search = (query.search as string || '').toLowerCase()
    const featured = query.featured as string
    const all = query.all === 'true' // Get all hotels for stats

    const db = adminFirestore()

    // Get all hotels for counting and filtering
    const allSnapshot = await db.collection('hotels')
      .orderBy('createdAt', 'desc')
      .get()

    let allHotels = allSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[]

    // Calculate stats from all data
    const stats = {
      total: allHotels.length,
      published: allHotels.filter(h => h.status === 'published').length,
      featured: allHotels.filter(h => h.isFeatured === true).length,
      draft: allHotels.filter(h => h.status === 'draft').length
    }

    // Apply filters
    let filteredHotels = [...allHotels]

    // Filter by status
    if (status) {
      filteredHotels = filteredHotels.filter(h => h.status === status)
    }

    // Filter by featured
    if (featured === 'true') {
      filteredHotels = filteredHotels.filter(h => h.isFeatured === true)
    } else if (featured === 'false') {
      filteredHotels = filteredHotels.filter(h => h.isFeatured !== true)
    }

    // Filter by search
    if (search) {
      filteredHotels = filteredHotels.filter(h => {
        const name = (h.name || '').toLowerCase()
        const provinceName = typeof h.province === 'object'
          ? (h.province?.name || '').toLowerCase()
          : (h.province || '').toLowerCase()
        return name.includes(search) || provinceName.includes(search)
      })
    }

    const totalFiltered = filteredHotels.length

    // If requesting all, return all filtered results
    if (all) {
      return {
        success: true,
        data: filteredHotels,
        total: totalFiltered,
        stats
      }
    }

    // Paginate
    const startIndex = (page - 1) * limit
    const paginatedHotels = filteredHotels.slice(startIndex, startIndex + limit)
    const totalPages = Math.ceil(totalFiltered / limit)

    return {
      success: true,
      data: paginatedHotels,
      pagination: {
        page,
        limit,
        total: totalFiltered,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to get hotels'
    })
  }
})
