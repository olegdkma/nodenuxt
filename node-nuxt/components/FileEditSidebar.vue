<template>
  <div v-if="isOpen" class="sidebar-overlay" @click="handleOverlayClick">
    <aside class="sidebar" @click.stop>
      <div class="sidebar-header">
        <h2 class="sidebar-title">{{ editingFile ? 'Edit File' : 'Create New File' }}</h2>
        <button @click="handleClose" class="close-button" aria-label="Close sidebar">
          ×
        </button>
      </div>
      <div class="sidebar-content">
        <FileUploadForm
          v-if="isOpen"
          :file-id="editingFile?.id"
          :initial-data="editingFile || undefined"
          @uploaded="handleSaved"
          @cancelled="handleClose"
        />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import FileUploadForm from "~~/components/FileUploadForm.vue";

interface FileData {
  id: number
  name: string
  description: string
  file_path: string
}

const props = defineProps<{
  isOpen: boolean
  file: FileData | null
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'saved'): void
}>()

const editingFile = computed(() => props.file)

function handleClose() {
  emit('close')
}

function handleSaved() {
  emit('saved')
  handleClose()
}

function handleOverlayClick() {
  handleClose()
}
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.sidebar {
  width: 100%;
  max-width: 500px;
  height: 100%;
  background-color: #ffffff;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
  overflow-y: auto;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.close-button {
  width: 2rem;
  height: 2rem;
  border: none;
  background-color: transparent;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.sidebar-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.sidebar-content :deep(.upload-form) {
  margin-bottom: 0;
  box-shadow: none;
  border: none;
  padding: 0;
}

.sidebar-content :deep(.form-title) {
  display: none;
}
</style>

