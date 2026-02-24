<template>
  <div class="login-form">
    <h2 class="form-title">Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-field">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>

      <div class="form-field">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
    </form>

    <div class="divider">
      <span>OR</span>
    </div>

    <div class="oauth-section">
      <button type="button" @click="handleGoogleLogin" :disabled="isLoading" class="google-button">
        <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
    </div>

    <div class="form-footer">
      <p>Don't have an account? <button type="button" @click="$emit('switch-to-register')" class="link-button">Register</button></p>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: 'switch-to-register'): void
  (event: 'login-success'): void
}>()

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface LoginFormState {
  email: string
  password: string
}

const form = ref<LoginFormState>({
  email: '',
  password: '',
})

const isLoading = ref(false)

async function handleLogin() {
  isLoading.value = true
  try {
    const response = await $fetch<{ success: boolean; token?: string }>(`${apiBase}/api/auth/login`, {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password,
      },
    })

    if (response.success && response.token) {
      // Store token (you might want to use a composable or pinia store)
      if (process.client) {
        localStorage.setItem('auth_token', response.token)
      }
      emit('login-success')
    } else {
      alert('Invalid email or password. Please try again.')
    }
  } catch (error: any) {
    console.error('Error logging in:', error)
    const errorMessage = error.data?.message || error.message || 'Failed to login. Please try again.'
    alert(errorMessage)
  } finally {
    isLoading.value = false
  }
}

async function handleGoogleLogin() {
  isLoading.value = true
  try {
    // Redirect to Google OAuth endpoint
    // This would typically redirect to your backend OAuth endpoint
    window.location.href = `${apiBase}/api/auth/google`
  } catch (error) {
    console.error('Error initiating Google login:', error)
    alert('Failed to initiate Google login. Please try again.')
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
}

.form-title {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
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

input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input[type='email']:focus,
input[type='password']:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

.form-actions {
  margin-top: 0.5rem;
}

button[type='submit'] {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button[type='submit']:hover:not(:disabled) {
  background-color: #1d4ed8;
}

button[type='submit']:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  text-align: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider span {
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.oauth-section {
  margin-bottom: 1.5rem;
}

.google-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #ffffff;
  color: #374151;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.google-button:hover:not(:disabled) {
  background-color: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.google-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.google-icon {
  flex-shrink: 0;
}

.form-footer {
  text-align: center;
  margin-top: 1rem;
}

.form-footer p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.link-button {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  margin: 0;
}

.link-button:hover {
  color: #1d4ed8;
}
</style>

