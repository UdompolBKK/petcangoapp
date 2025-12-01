export const useReviews = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Get reviews for a hotel
   */
  const getHotelReviews = async (hotelId: string, limit: number = 20) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch('/api/reviews', {
        query: { hotelId, limit }
      })

      return response.data || []
    } catch (err: any) {
      console.error('Failed to get reviews:', err)
      error.value = err.message || 'ไม่สามารถโหลด reviews ได้'
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new review
   */
  const createReview = async (reviewData: {
    hotelId: string
    userId: string
    userName: string
    userPhoto?: string
    rating: number
    comment: string
    images?: string[]
  }) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch('/api/reviews/create', {
        method: 'POST',
        body: reviewData
      })

      return response
    } catch (err: any) {
      console.error('Failed to create review:', err)
      error.value = err.data?.message || err.message || 'ไม่สามารถสร้าง review ได้'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update a review
   */
  const updateReview = async (reviewId: string, data: any) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        body: data
      })

      return response
    } catch (err: any) {
      console.error('Failed to update review:', err)
      error.value = err.message || 'ไม่สามารถอัปเดต review ได้'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a review
   */
  const deleteReview = async (reviewId: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      })

      return response
    } catch (err: any) {
      console.error('Failed to delete review:', err)
      error.value = err.message || 'ไม่สามารถลบ review ได้'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Check if user has reviewed a hotel
   */
  const hasUserReviewed = async (hotelId: string, userId: string) => {
    try {
      const reviews = await getHotelReviews(hotelId, 100)
      return reviews.some((review: any) => review.userId === userId)
    } catch (err) {
      return false
    }
  }

  return {
    loading,
    error,
    getHotelReviews,
    createReview,
    updateReview,
    deleteReview,
    hasUserReviewed
  }
}
