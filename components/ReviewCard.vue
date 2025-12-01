<template>
  <div class="bg-white rounded-lg p-6 border border-gray-200">
    <!-- User Info & Rating -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <!-- User Avatar -->
        <img
          v-if="review.userPhoto"
          :src="review.userPhoto"
          :alt="review.userName"
          class="w-12 h-12 rounded-full"
        />
        <div
          v-else
          class="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center text-lg font-bold"
        >
          {{ (review.userName || 'U')[0].toUpperCase() }}
        </div>

        <!-- User Name & Date -->
        <div>
          <h4 class="font-semibold text-gray-900">{{ review.userName || 'ผู้ใช้งาน' }}</h4>
          <p class="text-sm text-gray-500">{{ formatDate(review.createdAt) }}</p>
        </div>
      </div>

      <!-- Rating Stars -->
      <StarRating :model-value="review.rating" :readonly="true" size="sm" />
    </div>

    <!-- Review Comment -->
    <p v-if="review.comment" class="text-gray-700 mb-4">
      {{ review.comment }}
    </p>

    <!-- Review Images -->
    <div v-if="review.images && review.images.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      <img
        v-for="(image, index) in review.images"
        :key="index"
        :src="image"
        :alt="`Review image ${index + 1}`"
        class="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
        @click="openLightbox(index)"
      />
    </div>

    <!-- Actions (for owner or admin) -->
    <div v-if="showActions" class="flex items-center space-x-4 pt-4 border-t border-gray-200">
      <button
        v-if="canEdit"
        @click="$emit('edit', review)"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        แก้ไข
      </button>
      <button
        v-if="canDelete"
        @click="$emit('delete', review)"
        class="text-sm text-red-600 hover:text-red-700 font-medium"
      >
        ลบ
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  review: any
  canEdit?: boolean
  canDelete?: boolean
  showActions?: boolean
}>()

defineEmits<{
  (e: 'edit', review: any): void
  (e: 'delete', review: any): void
}>()

/**
 * Format date
 */
const formatDate = (date: any) => {
  if (!date) return ''

  let d: Date
  if (date.toDate) {
    d = date.toDate()
  } else if (date._seconds) {
    d = new Date(date._seconds * 1000)
  } else {
    d = new Date(date)
  }

  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d)
}

/**
 * Open image lightbox (placeholder)
 */
const openLightbox = (index: number) => {
  // TODO: Implement image lightbox
  console.log('Open lightbox at index:', index)
}
</script>
