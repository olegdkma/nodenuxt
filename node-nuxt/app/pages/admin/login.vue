<template>
  <div class="login-page">
    <div class="login-container">
      <LoginForm v-if="!showRegister" @switch-to-register="showRegister = true" @login-success="handleLoginSuccess" />
      <RegisterForm v-else @switch-to-login="showRegister = false" @register-success="handleRegisterSuccess" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from "~~/components/LoginForm.vue";
import RegisterForm from "~~/components/RegisterForm.vue";

const showRegister = ref(true)
const router = useRouter()

function handleLoginSuccess() {
  // Redirect to admin dashboard or files page
  loadUser()

}
const some = ref(null)
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

async function loadUser() {
  try {
    const response = await $fetch<{ success: boolean; }>(`${apiBase}/api/users/1`, {
      method: 'GET',
      credentials: 'include'
    })
    some.value = response
  } catch (error) {
    console.error('Error loading files:', error)
    alert('Failed to load files. Please try again.')
  } finally {
  }
}
function handleRegisterSuccess() {
  // After successful registration, switch to login or redirect
  // You might want to auto-login or show a success message
  showRegister.value = false
  // Optionally redirect after registration
  // router.push('/admin/files')
  loadUser()

}
onMounted(() =>{
  loadUser()

})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 450px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .login-page {
    padding: 1rem;
  }
}
</style>

