<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">จัดการไฟล์และรูปภาพในระบบ</h1>
      <p class="text-gray-600">Media Library</p>
    </div>

    <!-- Toolbar -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Upload Button -->
          <button
            @click="triggerFileUpload"
            class="bg-success-500 hover:bg-success-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <span>Upload</span>
          </button>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            class="hidden"
            @change="handleFileUpload"
          />

          <!-- Add Folder Button -->
          <button
            @click="showCreateFolder = true"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            <span>Add Folder</span>
          </button>

          <!-- View Toggle -->
          <div class="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded transition-colors',
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded transition-colors',
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search files..."
            class="w-64 px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="mb-4 flex items-center space-x-2 text-sm">
      <button
        @click="navigateToFolder('')"
        class="text-gray-600 hover:text-gray-900 transition-colors font-medium"
      >
        Library
      </button>
      <template v-if="currentFolder">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
        <span class="text-gray-900 font-medium">{{ currentFolder }}</span>
      </template>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p class="text-gray-600">Loading media...</p>
    </div>

    <!-- Grid View -->
    <div
      v-else-if="viewMode === 'grid'"
      class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
    >
      <!-- Go Up -->
      <div
        v-if="currentFolder"
        @click="navigateToFolder(getParentFolder())"
        class="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md cursor-pointer transition-all aspect-square flex flex-col items-center justify-center"
      >
        <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        <span class="text-gray-600 text-sm">Go up</span>
      </div>

      <!-- Folders -->
      <div
        v-for="folder in filteredFolders"
        :key="folder.path"
        @click="navigateToFolder(folder.path)"
        class="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md cursor-pointer transition-all aspect-square flex flex-col items-center justify-center"
      >
        <svg class="w-16 h-16 text-primary-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
        </svg>
        <span class="text-gray-900 text-sm text-center truncate w-full px-2 font-medium">{{ folder.name }}</span>
      </div>

      <!-- Files -->
      <div
        v-for="file in filteredFiles"
        :key="file.path"
        @click="selectFile(file)"
        class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-md cursor-pointer transition-all group relative"
      >
        <div class="aspect-square relative">
          <img
            v-if="file.contentType?.startsWith('image/')"
            :src="file.url"
            :alt="file.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>

          <!-- Actions Overlay -->
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
            <button
              @click.stop="copyUrl(file.url)"
              class="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
              title="Copy URL"
            >
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
            <button
              @click.stop="deleteFile(file)"
              class="p-2 bg-danger-500/90 hover:bg-danger-500 rounded-lg transition-colors"
              title="Delete"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-2 bg-white">
          <p class="text-gray-900 text-xs truncate font-medium">{{ getFileName(file.name) }}</p>
          <p class="text-gray-500 text-xs">{{ formatFileSize(file.size) }}</p>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div
      v-else
      class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
    >
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Size</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Modified</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <!-- Go Up -->
          <tr
            v-if="currentFolder"
            @click="navigateToFolder(getParentFolder())"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td colspan="5" class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span class="text-gray-600">..</span>
              </div>
            </td>
          </tr>

          <!-- Folders -->
          <tr
            v-for="folder in filteredFolders"
            :key="folder.path"
            @click="navigateToFolder(folder.path)"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                </svg>
                <span class="text-gray-900 font-medium">{{ folder.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600">Folder</td>
            <td class="px-6 py-4 text-gray-600">-</td>
            <td class="px-6 py-4 text-gray-600">-</td>
            <td class="px-6 py-4"></td>
          </tr>

          <!-- Files -->
          <tr
            v-for="file in filteredFiles"
            :key="file.path"
            @click="selectFile(file)"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <img
                  v-if="file.contentType?.startsWith('image/')"
                  :src="file.url"
                  :alt="file.name"
                  class="w-10 h-10 rounded object-cover border border-gray-200"
                />
                <svg v-else class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <span class="text-gray-900 font-medium">{{ getFileName(file.name) }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-600">{{ file.contentType }}</td>
            <td class="px-6 py-4 text-gray-600">{{ formatFileSize(file.size) }}</td>
            <td class="px-6 py-4 text-gray-600">{{ formatDate(file.updated) }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-2">
                <button
                  @click.stop="copyUrl(file.url)"
                  class="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Copy URL
                </button>
                <button
                  @click.stop="deleteFile(file)"
                  class="text-danger-500 hover:text-danger-600 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && filteredFiles.length === 0 && filteredFolders.length === 0"
      class="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm"
    >
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <p class="text-lg font-medium text-gray-900 mb-2">No files found</p>
      <p class="text-gray-600">Upload files to get started</p>
    </div>

    <!-- Selected File Details (Modal) -->
    <Teleport to="body">
      <div
        v-if="selectedFile"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click="selectedFile = null"
      >
        <div
          @click.stop
          class="bg-white border border-gray-200 rounded-xl max-w-2xl w-full p-6 shadow-xl"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">File Details</h3>
            <button
              @click="selectedFile = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <img
              v-if="selectedFile.contentType?.startsWith('image/')"
              :src="selectedFile.url"
              :alt="selectedFile.name"
              class="w-full rounded-lg border border-gray-200"
            />

            <div class="space-y-2">
              <div>
                <label class="block text-sm text-gray-600 mb-1 font-medium">Name</label>
                <p class="text-gray-900">{{ getFileName(selectedFile.name) }}</p>
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1 font-medium">URL</label>
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    :value="selectedFile.url"
                    readonly
                    class="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm"
                  />
                  <button
                    @click="copyUrl(selectedFile.url)"
                    class="bg-success-500 hover:bg-success-600 text-white px-4 py-2 rounded-lg"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-1 font-medium">Type</label>
                  <p class="text-gray-900">{{ selectedFile.contentType }}</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-600 mb-1 font-medium">Size</label>
                  <p class="text-gray-900">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'backend'
})

const fileInput = ref<HTMLInputElement>()
const loading = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const currentFolder = ref('')
const showCreateFolder = ref(false)

const files = ref<any[]>([])
const folders = ref<any[]>([])
const selectedFile = ref<any>(null)

const filteredFiles = computed(() => {
  if (!searchQuery.value) return files.value
  return files.value.filter(f =>
    f.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredFolders = computed(() => {
  if (!searchQuery.value) return folders.value
  return folders.value.filter(f =>
    f.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const loadMedia = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/media', {
      query: { folder: currentFolder.value }
    })
    files.value = response.data.files || []
    folders.value = response.data.folders || []
  } catch (error) {
    console.error('Failed to load media:', error)
    alert('Failed to load media files')
  } finally {
    loading.value = false
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const uploadFiles = target.files

  if (!uploadFiles || uploadFiles.length === 0) return

  try {
    loading.value = true

    const formData = new FormData()
    formData.append('folder', currentFolder.value)

    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append('files', uploadFiles[i])
    }

    await $fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    })

    await loadMedia()
    target.value = ''
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Failed to upload files')
  } finally {
    loading.value = false
  }
}

const deleteFile = async (file: any) => {
  if (!confirm(`Delete ${file.name}?`)) return

  try {
    await $fetch('/api/media/delete', {
      method: 'POST',
      body: { path: file.path }
    })

    await loadMedia()
  } catch (error) {
    console.error('Delete failed:', error)
    alert('Failed to delete file')
  }
}

const navigateToFolder = (path: string) => {
  currentFolder.value = path
  loadMedia()
}

const getParentFolder = () => {
  const parts = currentFolder.value.split('/')
  parts.pop()
  return parts.join('/')
}

const selectFile = (file: any) => {
  selectedFile.value = file
}

const copyUrl = (url: string) => {
  navigator.clipboard.writeText(url)
  alert('URL copied to clipboard!')
}

const getFileName = (path: string) => {
  return path.split('/').pop() || path
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date: any): string => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadMedia()
})

useHead({
  title: 'Media Library | Backend - PetCanGo'
})
</script>
