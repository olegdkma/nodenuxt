<template>
  <article class="file-card">
    <div class="file-card-image">
      <img :src="imageUrl" :alt="file.name" />
    </div>
    <div class="file-card-content">
      <h3 class="file-card-title">{{ file.name }}</h3>
      <p class="file-card-description">{{ file.description }}</p>
    </div>
    <div class="file-card-actions">
      <button @click="handleEdit" class="action-button edit-button">
        Edit
      </button>
      <button @click="handleDelete" class="action-button delete-button">
        Delete
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
interface FileData {
  id: number
  name: string
  description: string
  file_path: string
}

const props = defineProps<{
  file: FileData
}>()

const emit = defineEmits<{
  (event: 'edit', file: FileData): void
  (event: 'delete', fileId: number): void
}>()

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const imageUrl = computed(() => `${apiBase}/uploads/${props.file.file_path}`)

function handleEdit() {
  emit('edit', props.file)
}

function handleDelete() {
  if (confirm(`Are you sure you want to delete "${props.file.name}"?`)) {
    emit('delete', props.file.id)
  }
}
</script>

<style scoped>
.file-card {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.file-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.file-card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #f3f4f6;
}

.file-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-card-content {
  padding: 1rem;
  flex: 1;
}

.file-card-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.file-card-description {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.file-card-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.action-button {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.edit-button {
  background-color: #2563eb;
  color: #ffffff;
}

.edit-button:hover {
  background-color: #1d4ed8;
}

.delete-button {
  background-color: #dc2626;
  color: #ffffff;
}

.delete-button:hover {
  background-color: #b91c1c;
}
</style>

