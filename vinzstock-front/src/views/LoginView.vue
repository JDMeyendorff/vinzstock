<template>
  <Login @login="onLogin" @recover="onRecover" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import Login from '../components/Login.vue'

const router = useRouter()

function onLogin(payload) {
  // payload = { username, password }
  // TODO: llamar al backend para autenticar; ejemplo temporal:
  console.log('Login solicitado:', payload)
  localStorage.setItem('vinz_user', payload.username || '')
  // Si existe una ruta protegida, redirigirla aquí. Ejemplo:
  // router.push({ name: 'Dashboard' })
  alert('Inicio de sesión enviado')
}

function onRecover() {
  // TODO: navegar a una vista de recuperación o abrir modal
  alert('Flujo de recuperar contraseña - por implementar')
}
</script>

<style scoped>
/* Estilos opcionales para la vista */
:root { --bg: #f5f7fb; }
div { background: var(--bg); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
</style>