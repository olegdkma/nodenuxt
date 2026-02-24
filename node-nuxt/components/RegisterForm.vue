<template>
  <div class="register-form">
    <h2 class="form-title">Create Account</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-field">
        <label for="reg-email">Email</label>
        <input
          id="reg-email"
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
          minlength="6"
        />
      </div>

      <div class="form-field">
        <label for="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          v-model="form.confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
          minlength="6"
        />
        <p v-if="passwordMismatch" class="error-message">
          Passwords do not match
        </p>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isLoading || passwordMismatch">
          {{ isLoading ? 'Creating account...' : 'Register' }}
        </button>
      </div>
    </form>

    <div class="form-footer">
      <p>Already have an account? <button type="button" @click="$emit('switch-to-login')" class="link-button">Login</button></p>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: 'switch-to-login'): void
  (event: 'register-success'): void
}>()

const config = useRuntimeConfig()
const apiBase = config.public.apiBase

interface RegisterFormState {
  email: string
  password: string
  confirmPassword: string
}

const form = ref<RegisterFormState>({
  email: 'old@gmail.com',
  password: '123456',
  confirmPassword: '123456',
})

const isLoading = ref(false)

const passwordMismatch = computed(() => {
  return form.value.password && form.value.confirmPassword && form.value.password !== form.value.confirmPassword
})

async function handleRegister() {
  if (passwordMismatch.value) {
    return
  }

  isLoading.value = true
  try {
    const response = await $fetch<{ success: boolean; token?: string; message?: string }>(`${apiBase}/api/users`, {
      method: 'POST',
      credentials: 'include',
      body: {
        email: form.value.email,
        password: form.value.password,
      },
    })
    emit('register-success')

    if (response.success) {
      // if (response.token && process.client) {
      //   localStorage.setItem('auth_token', response.token)
      // }

    } else {
      alert(response.message || 'Registration failed. Please try again.')
    }
  } catch (error: any) {
    console.error('Error registering:', error)
    const errorMessage = error.data?.message || error.message || 'Failed to register. Please try again.'
    alert(errorMessage)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-form {
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

input[type='password'].error,
input[type='email'].error {
  border-color: #dc2626;
}

.error-message {
  margin: 0;
  font-size: 0.875rem;
  color: #dc2626;
}

.form-actions {
  margin-top: 0.5rem;
}

button[type='submit'] {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background-color: #16a34a;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button[type='submit']:hover:not(:disabled) {
  background-color: #15803d;
}

button[type='submit']:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
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

