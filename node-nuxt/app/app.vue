<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
        My Full-Stack App
      </h1>
      
      <!-- File Upload Form -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Upload New File</h2>
        <form @submit.prevent="uploadFile" class="space-y-4">
          <div>
            <label for="fileName" class="block text-sm font-medium text-gray-700 mb-2">
              File Name
            </label>
            <input
              id="fileName"
              v-model="newFile.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter file name..."
              required
            />
          </div>
          
          <div>
            <label for="fileUpload" class="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              id="fileUpload"
              ref="fileInput"
              @change="handleFileSelect"
              type="file"
              accept="image/*"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required1
            />
          </div>
          
          <div>
            <label for="fileDescription" class="block text-sm font-medium text-gray-700 mb-2">
              File Description
            </label>
            <textarea
              id="fileDescription"
              v-model="newFile.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter file description..."
              required
            ></textarea>
          </div>
          
          <button
            type="submit"
            :disabled="isUploading"
            class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isUploading ? 'Uploading...' : 'Upload File' }}
          </button>
        </form>
      </div>

      <div class="files" v-for="file in files">
        <img :src="`${apiBase}/uploads/${file.file_path}`" alt="">
      </div>
      <!-- Message Form -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Add New Message</h2>
        <form @submit.prevent="addMessage" class="space-y-4">
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
              Message Content
            </label>
            <textarea
              id="message"
              v-model="newMessage"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your message here..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Adding...' : 'Add Message' }}
          </button>
        </form>
      </div>

      <!-- Messages List -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Messages</h2>
          <button
            @click="loadMessages"
            :disabled="isLoadingMessages"
            class="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ isLoadingMessages ? 'Loading...' : 'Refresh' }}
          </button>
        </div>
        
        <div v-if="isLoadingMessages" class="text-center py-8">
          <div class="text-gray-500">Loading messages...</div>
        </div>
        
        <div v-else-if="messages.length === 0" class="text-center py-8">
          <div class="text-gray-500">No messages yet. Add one above!</div>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="message in messages"
            :key="message.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <p class="text-gray-800">{{ message.content }}</p>
                <p class="text-sm text-gray-500 mt-2">
                  {{ new Date(message.created_at).toLocaleString() }}
                </p>
              </div>
              <button
                @click="deleteMessage(message.id)"
                class="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

// Reactive data
const newMessage = ref('')
const messages = ref([])
const isLoading = ref(false)
const isLoadingMessages = ref(false)

// File upload reactive data
const newFile = ref({
  name: '',
  description: '',
  file: null
})
const isUploading = ref(false)
const fileInput = ref(null)

// API base URL
const apiBase = config.public.apiBase

// Load messages on component mount
onMounted(() => {
  loadMessages()
  getFiles()
})

// Add new message
async function addMessage() {
  if (!newMessage.value.trim()) return
  
  isLoading.value = true
  try {
    const response = await $fetch(`${apiBase}/api/messages`, {
      method: 'POST',
      body: { content: newMessage.value }
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

// Load all messages
async function loadMessages() {
  isLoadingMessages.value = true
  try {
    const response = await $fetch(`${apiBase}/api/messages`)
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

// Delete message
async function deleteMessage(id) {
  if (!confirm('Are you sure you want to delete this message?')) return
  
  try {
    const response = await $fetch(`${apiBase}/api/messages/${id}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      await loadMessages()
    }
  } catch (error) {
    console.error('Error deleting message:', error)
    alert('Failed to delete message. Please try again.')
  }
}

// File handling methods
function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    newFile.value.file = file
    // Auto-fill name if empty
    if (!newFile.value.name) {
      newFile.value.name = file.name.split('.')[0] // Remove extension
    }
  }
}
const files = ref([])
async function getFiles() {
  const response = await $fetch(`${apiBase}/api/files`, {
    method: 'GET',
  })
  files.value = response.data

}

async function uploadFile() {
  // if (!newFile.value.name.trim() || !newFile.value.file) {
  //   alert('Please fill in all required fields and select a file.')
  //   return
  // }
  
  isUploading.value = true
  
  try {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('name', newFile.value.name)
    formData.append('description', newFile.value.description)
    formData.append('file', newFile.value.file)

    console.log(formData)
    const response = await $fetch(`${apiBase}/api/files`, {
      method: 'POST',
      body: formData,
    })
    
    if (response.success) {
      // Reset form
      newFile.value = {
        name: '',
        description: '',
        file: null
      }
      // Reset file input
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      getFiles()
      console.log('File uploaded successfully!')
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    alert('Failed to upload file. Please try again.')
  } finally {
    isUploading.value = false
  }
}
</script>
