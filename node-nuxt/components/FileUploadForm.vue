<template>
  <section class="upload-form">
    <h2 class="form-title">{{ isEditMode ? 'Edit File' : 'Upload New File' }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-field">
        <label for="fileName">File Name</label>
        <input
          id="fileName"
          v-model="form.name"
          type="text"
          placeholder="Enter file name..."
          required
        />
      </div>

      <div class="form-field">
        <label for="fileUpload">Select File</label>
        <input
          id="fileUpload"
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="onFileSelect"
          :required="!isEditMode"
        />
        <p v-if="isEditMode && currentFileUrl" class="current-file-info">
          Current file: <a :href="currentFileUrl" target="_blank">View</a>
        </p>
      </div>

      <div class="form-field">
        <label for="fileDescription">File Description</label>
        <textarea
          id="fileDescription"
          v-model="form.description"
          rows="3"
          placeholder="Enter file description..."
          required
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isUploading">
          {{ isUploading ? (isEditMode ? 'Updating...' : 'Uploading...') : (isEditMode ? 'Update File' : 'Upload File') }}
        </button>
        <button v-if="isEditMode" type="button" @click="handleCancel" class="cancel-button">
          Cancel
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface FileData {
  id: number
  name: string
  description: string
  file_path: string
}

const props = withDefaults(defineProps<{
  fileId?: number
  initialData?: FileData
}>(), {
  fileId: undefined,
  initialData: undefined,
})

const emit = defineEmits<{
  (event: 'uploaded'): void
  (event: 'cancelled'): void
}>()

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface UploadFormState {
  name: string
  description: string
  file: File | null
}

const form = ref<UploadFormState>({
  name: '',
  description: '',
  file: null,
})

const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const isEditMode = computed(() => !!props.fileId)
const currentFileUrl = computed(() => {
  if (props.initialData?.file_path) {
    return `${apiBase}/uploads/${props.initialData.file_path}`
  }
  return null
})

watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value = {
      name: newData.name,
      description: newData.description,
      file: null,
    }
  }
}, { immediate: true })

function onFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null

  form.value.file = file
  if (file && !form.value.name) {
    form.value.name = file.name.replace(/\.[^/.]+$/, '')
  }
}

async function submitForm() {
  if (!isEditMode.value && !form.value.file) {
    alert('Please select a file to upload.')
    return
  }

  isUploading.value = true

  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('description', form.value.description)
    
    if (form.value.file) {
      formData.append('file', form.value.file)
    }

    const url = isEditMode.value 
      ? `${apiBase}/api/files/${props.fileId}`
      : `${apiBase}/api/files`
    
    const method = isEditMode.value ? 'PUT' : 'POST'

    const response = await $fetch<{ success: boolean }>(url, {
      method,
      body: formData,
    })

    if (response.success) {
      resetForm()
      emit('uploaded')
    }
  } catch (error) {
    console.error(`Error ${isEditMode.value ? 'updating' : 'uploading'} file:`, error)
    alert(`Failed to ${isEditMode.value ? 'update' : 'upload'} file. Please try again.`)
  } finally {
    isUploading.value = false
  }
}

function handleCancel() {
  resetForm()
  emit('cancelled')
}

function resetForm() {
  if (props.initialData) {
    form.value = {
      name: props.initialData.name,
      description: props.initialData.description,
      file: null,
    }
  } else {
    form.value = {
      name: '',
      description: '',
      file: null,
    }
  }

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.upload-form {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
}

.form-title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
}

input[type='text'],
input[type='file'],
textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input[type='text']:focus,
input[type='file']:focus,
textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background-color: #16a34a;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

button:hover:not(:disabled) {
  background-color: #15803d;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.cancel-button {
  background-color: #6b7280;
}

.cancel-button:hover:not(:disabled) {
  background-color: #4b5563;
}

.current-file-info {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.current-file-info a {
  color: #2563eb;
  text-decoration: underline;
}
</style>

