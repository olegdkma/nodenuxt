<template>
  <div>
    <button @click="logOut">Logout</button>
  </div>
  <NuxtPage />
</template>
<script setup>
const router = useRouter()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
async function logOut () {
  await $fetch(`${apiBase}/api/log-out`, {
    method: 'POST'
  })
  router.push('/admin/login')
}

</script>