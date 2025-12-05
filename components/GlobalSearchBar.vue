<template>
  <div class="relative" ref="searchContainer">
    <!-- Search Input -->
    <div class="relative">
      <input
        ref="searchInput"
        v-model="query"
        type="text"
        placeholder="ค้นหาที่พัก, จังหวัด, บทความ..."
        class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        :class="[
          isExpanded ? 'w-64 md:w-80' : 'w-48 md:w-64'
        ]"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @keydown.escape="closeSearch"
        @keydown.enter="handleEnter"
        @keydown.down.prevent="navigateResults(1)"
        @keydown.up.prevent="navigateResults(-1)"
      />

      <!-- Search Icon -->
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      <!-- Clear Button -->
      <button
        v-if="query"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Loading Spinner -->
      <div
        v-if="isSearching"
        class="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <svg class="animate-spin w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <!-- Search Results Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showResults && (results.length > 0 || (query.length >= 2 && !isSearching))"
        class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
      >
        <!-- Results List -->
        <div v-if="results.length > 0">
          <!-- Group by type -->
          <template v-for="(group, groupType) in groupedResults" :key="groupType">
            <div v-if="group.length > 0">
              <!-- Group Header -->
              <div class="px-4 py-2 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {{ getGroupLabel(groupType as string) }}
              </div>

              <!-- Group Items -->
              <NuxtLink
                v-for="(item, index) in group"
                :key="item.id"
                :to="item.url"
                class="flex items-center px-4 py-3 hover:bg-primary-50 transition-colors border-b border-gray-100 last:border-0"
                :class="{ 'bg-primary-50': selectedIndex === getGlobalIndex(groupType as string, index) }"
                @click="handleResultClick(item)"
              >
                <!-- Image/Icon -->
                <div class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mr-3">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.title"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <component :is="getTypeIcon(item.type)" class="w-6 h-6 text-gray-400" />
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ item.subtitle }}</p>
                </div>

                <!-- Type Badge -->
                <span
                  :class="[
                    'ml-2 px-2 py-1 rounded-full text-xs font-medium',
                    getTypeBadgeClass(item.type)
                  ]"
                >
                  {{ getTypeLabel(item.type) }}
                </span>
              </NuxtLink>
            </div>
          </template>
        </div>

        <!-- No Results -->
        <div v-else-if="query.length >= 2 && !isSearching" class="px-4 py-8 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-gray-500 text-sm">ไม่พบผลลัพธ์สำหรับ "{{ query }}"</p>
          <p class="text-gray-400 text-xs mt-1">ลองค้นหาด้วยคำอื่น</p>
        </div>

        <!-- Quick Links (when no query) -->
        <div v-if="query.length < 2 && showResults" class="p-4">
          <p class="text-xs text-gray-500 mb-3">ค้นหายอดนิยม</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in popularSearches"
              :key="tag"
              @click="setQuery(tag)"
              class="px-3 py-1.5 bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-full text-xs font-medium transition-colors"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { SearchResult } from '~/composables/useGlobalSearch'

const { results, isSearching, debouncedSearch, clearSearch: clearSearchResults, loadSearchData } = useGlobalSearch()
const router = useRouter()

const searchContainer = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const query = ref('')
const showResults = ref(false)
const isExpanded = ref(false)
const selectedIndex = ref(-1)

const popularSearches = ['กรุงเทพ', 'เชียงใหม่', 'ภูเก็ต', 'พัทยา', 'หัวหิน']

// Group results by type
const groupedResults = computed(() => {
  const groups: Record<string, SearchResult[]> = {
    province: [],
    hotel: [],
    blog: []
  }

  results.value.forEach((item) => {
    if (groups[item.type]) {
      groups[item.type].push(item)
    }
  })

  return groups
})

// Get global index for keyboard navigation
const getGlobalIndex = (type: string, localIndex: number): number => {
  let offset = 0
  const order = ['province', 'hotel', 'blog']

  for (const t of order) {
    if (t === type) break
    offset += groupedResults.value[t]?.length || 0
  }

  return offset + localIndex
}

// Handle input changes
const handleInput = () => {
  selectedIndex.value = -1
  debouncedSearch(query.value)
}

// Handle focus
const handleFocus = () => {
  isExpanded.value = true
  showResults.value = true

  // Preload search data
  loadSearchData()
}

// Handle blur
const handleBlur = () => {
  // Delay to allow click events on results
  setTimeout(() => {
    isExpanded.value = false
  }, 200)
}

// Close search
const closeSearch = () => {
  showResults.value = false
  searchInput.value?.blur()
}

// Clear search
const clearSearch = () => {
  query.value = ''
  clearSearchResults()
  selectedIndex.value = -1
  searchInput.value?.focus()
}

// Set query (for popular searches)
const setQuery = (term: string) => {
  query.value = term
  debouncedSearch(term, 100)
}

// Navigate results with keyboard
const navigateResults = (direction: number) => {
  const totalResults = results.value.length
  if (totalResults === 0) return

  selectedIndex.value += direction

  if (selectedIndex.value < 0) {
    selectedIndex.value = totalResults - 1
  } else if (selectedIndex.value >= totalResults) {
    selectedIndex.value = 0
  }
}

// Handle enter key
const handleEnter = () => {
  if (selectedIndex.value >= 0 && selectedIndex.value < results.value.length) {
    const item = results.value[selectedIndex.value]
    handleResultClick(item)
  } else if (results.value.length > 0) {
    // Navigate to first result
    handleResultClick(results.value[0])
  }
}

// Handle result click
const handleResultClick = (item: SearchResult) => {
  showResults.value = false
  query.value = ''
  clearSearchResults()
  router.push(item.url)
}

// Handle image error
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

// Get group label
const getGroupLabel = (type: string): string => {
  const labels: Record<string, string> = {
    province: 'จังหวัด',
    hotel: 'ที่พัก',
    blog: 'บทความ'
  }
  return labels[type] || type
}

// Get type label
const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    province: 'จังหวัด',
    hotel: 'ที่พัก',
    blog: 'บทความ'
  }
  return labels[type] || type
}

// Get type badge class
const getTypeBadgeClass = (type: string): string => {
  const classes: Record<string, string> = {
    province: 'bg-blue-100 text-blue-700',
    hotel: 'bg-primary-100 text-primary-700',
    blog: 'bg-green-100 text-green-700'
  }
  return classes[type] || 'bg-gray-100 text-gray-700'
}

// Get type icon component
const getTypeIcon = (type: string) => {
  return {
    template: type === 'province'
      ? '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
      : type === 'hotel'
        ? '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>'
        : '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>'
  }
}

// Click outside to close
onMounted(() => {
  document.addEventListener('click', (e: MouseEvent) => {
    if (searchContainer.value && !searchContainer.value.contains(e.target as Node)) {
      showResults.value = false
    }
  })
})
</script>
