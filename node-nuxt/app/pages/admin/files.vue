<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1 class="page-title">File Management</h1>
      <button @click="handleCreateNew" class="create-button">
        Create New File
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <p>Loading files...</p>
    </div>

    <div v-else-if="files.length === 0" class="empty-state">
      <p>No files found. Create your first file!</p>
    </div>

    <div v-else class="files-grid">
      <FileCard
        v-for="file in files"
        :key="file.id"
        :file="file"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <FileEditSidebar
      :is-open="isSidebarOpen"
      :file="editingFile"
      @close="handleCloseSidebar"
      @saved="handleFileSaved"
    />
  </div>
</template>

<script setup lang="ts">
import FileCard from '../../../components/FileCard.vue'
import FileEditSidebar from '../../../components/FileEditSidebar.vue'

interface FileData {
  id: number
  name: string
  description: string
  file_path: string
}

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const files = ref<FileData[]>([])
const isLoading = ref(false)
const isSidebarOpen = ref(false)
const editingFile = ref<FileData | null>(null)

onMounted(() => {
  loadFiles()
})

async function loadFiles() {
  isLoading.value = true
  try {
    const response = await $fetch<{ success: boolean; data: FileData[] }>(`${apiBase}/api/files`)
    if (response.success) {
      files.value = response.data
    }
  } catch (error) {
    console.error('Error loading files:', error)
    alert('Failed to load files. Please try again.')
  } finally {
    isLoading.value = false
  }
}

function handleCreateNew() {
  editingFile.value = null
  isSidebarOpen.value = true
}

function handleEdit(file: FileData) {
  editingFile.value = file
  isSidebarOpen.value = true
}

function handleCloseSidebar() {
  isSidebarOpen.value = false
  editingFile.value = null
}

async function handleFileSaved() {
  await loadFiles()
}

async function handleDelete(fileId: number) {
  try {
    const response = await $fetch<{ success: boolean }>(`${apiBase}/api/files/${fileId}`, {
      method: 'DELETE',
    })


      await loadFiles()

  } catch (error) {
    console.error('Error deleting file:', error)
    alert('Failed to delete file. Please try again.')
  }
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f9fafb;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.create-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background-color: #16a34a;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.create-button:hover {
  background-color: #15803d;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  font-size: 1.125rem;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .admin-page {
    padding: 1rem;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .create-button {
    width: 100%;
  }

  .files-grid {
    grid-template-columns: 1fr;
  }
}
</style>

