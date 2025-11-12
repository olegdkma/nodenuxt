<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
        My Full-Stack App
      </h1>

      <FileUploadForm @uploaded="getFiles" />

      <div class="files-grid">
        <div v-for="file in files" :key="file.id" class="file-item">
          <img :src="`${apiBase}/uploads/${file.file_path}`" :alt="file.name" />
          <div class="file-meta">
            <h3>{{ file.name }}</h3>
            <p>{{ file.description }}</p>
          </div>
        </div>
      </div>

      <section class="message-section">
        <h2 class="section-title">Add New Message</h2>
        <form @submit.prevent="addMessage" class="message-form">
          <label for="message">Message Content</label>
          <textarea
            id="message"
            v-model="newMessage"
            rows="3"
            placeholder="Enter your message here..."
            required
          ></textarea>
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Adding...' : 'Add Message' }}
          </button>
        </form>
      </section>

      <section class="message-list">
        <div class="message-list-header">
          <h2 class="section-title">Messages</h2>
          <button @click="loadMessages" :disabled="isLoadingMessages">
            {{ isLoadingMessages ? 'Loading...' : 'Refresh' }}
          </button>
        </div>

        <div v-if="isLoadingMessages" class="message-state">
          Loading messages...
        </div>

        <div v-else-if="messages.length === 0" class="message-state">
          No messages yet. Add one above!
        </div>

        <ul v-else class="message-items">
          <li v-for="message in messages" :key="message.id" class="message-item">
            <div class="message-content">
              <p>{{ message.content }}</p>
              <small>{{ formatDate(message.created_at) }}</small>
            </div>
            <button @click="deleteMessage(message.id)">Delete</button>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

 <script setup lang="ts">
interface Message {
  id: number
  content: string
  created_at: string
}

interface FileData {
  id: number
  name: string
  description: string
  file_path: string
}

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

const newMessage = ref('')
const messages = ref<Message[]>([])
const isLoading = ref(false)
const isLoadingMessages = ref(false)
const files = ref<FileData[]>([])

onMounted(() => {
  // loadMessages()
  // getFiles()
})

async function addMessage() {
  if (!newMessage.value.trim()) return

  isLoading.value = true
  try {
    const response = await $fetch<{ success: boolean }>(`${apiBase}/api/messages`, {
      method: 'POST',
      body: { content: newMessage.value },
    })

    if (response.success) {
      newMessage.value = ''
      await loadMessages()
    }
  } catch (error) {
    console.error('Error adding message:', error)
    alert('Failed to add message. Please try again.')
  } finally {
    isLoading.value = false
  }
}

async function loadMessages() {
  isLoadingMessages.value = true
  try {
    const response = await $fetch<{ success: boolean; data: Message[] }>(`${apiBase}/api/messages`)
    if (response.success) {
      messages.value = response.data
    }
  } catch (error) {
    console.error('Error loading messages:', error)
    alert('Failed to load messages. Please try again.')
  } finally {
    isLoadingMessages.value = false
  }
}

async function deleteMessage(id: number) {
  if (!confirm('Are you sure you want to delete this message?')) return

  try {
    const response = await $fetch<{ success: boolean }>(`${apiBase}/api/messages/${id}`, {
      method: 'DELETE',
    })

    if (response.success) {
      await loadMessages()
    }
  } catch (error) {
    console.error('Error deleting message:', error)
    alert('Failed to delete message. Please try again.')
  }
}

async function getFiles() {
  try {
    const response = await $fetch<{ success: boolean; data: FileData[] }>(`${apiBase}/api/files`)
    if (response.success) {
      files.value = response.data
    }
  } catch (error) {
    console.error('Error loading files:', error)
    alert('Failed to load files. Please try again.')
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.file-item {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.file-item img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.file-meta {
  padding: 1rem;
}

.file-meta h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.file-meta p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.message-section,
.message-list {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message-form textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.message-form button {
  align-self: flex-start;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.message-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.message-list-header button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: #6b7280;
  color: #ffffff;
  font-size: 0.875rem;
  cursor: pointer;
}

.message-state {
  text-align: center;
  color: #6b7280;
  padding: 2rem 0;
}

.message-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #f9fafb;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.message-content p {
  margin: 0;
  font-size: 1rem;
  color: #1f2937;
}

.message-content small {
  color: #6b7280;
  font-size: 0.875rem;
}

.message-item button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background-color: #dc2626;
  color: #ffffff;
  font-size: 0.875rem;
  cursor: pointer;
}

.message-item button:hover {
  background-color: #b91c1c;
}

@media (max-width: 768px) {
  .message-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .message-item button {
    align-self: flex-end;
  }
}
</style>

