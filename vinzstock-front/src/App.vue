<template>
  <div id="app">
    <!-- Mostrar login si no está autenticado -->
    <LoginComponent
        v-if="!isAuthenticated"
        @loginSuccess="handleLoginSuccess"
        @recover="handleRecover"
    />

    <!-- Contenido principal si está autenticado -->
    <div v-else class="dashboard">
      <header class="dashboard-header">
        <h1>Bienvenido a VinzStock</h1>
        <button @click="handleLogout" class="logout-btn">
          Cerrar sesión
        </button>
      </header>

      <div class="user-info">
        <div class="info-card">
          <h3>Información del Usuario</h3>
          <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
          <p><strong>Usuario:</strong> {{ usuario.usuarioLogin }}</p>
          <p><strong>Email:</strong> {{ usuario.email }}</p>
          <p><strong>Rol:</strong> {{ usuario.nombreRol }}</p>
          <p><strong>ID:</strong> {{ usuario.idUsuario }}</p>
        </div>
      </div>

      <!-- Aquí irían tus componentes de la aplicación -->
      <div class="content">
        <p>Contenido de tu aplicación aquí...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoginComponent from './components/Login.vue'
import authService from './services/authService'

const isAuthenticated = ref(false)
const usuario = ref(null)

/**
 * Verificar si hay un usuario autenticado al montar el componente
 */
onMounted(() => {
  if (authService.isAuthenticated()) {
    usuario.value = authService.getUser()
    isAuthenticated.value = true
  }
})

/**
 * Maneja el éxito del login
 */
function handleLoginSuccess(data) {
  usuario.value = data
  isAuthenticated.value = true
  console.log('Usuario autenticado:', data)
}

/**
 * Maneja la recuperación de contraseña
 */
function handleRecover(data) {
  console.log('Recuperar contraseña para:', data.username)
  alert(`Se ha enviado un correo de recuperación a la cuenta asociada con: ${data.username}`)
  // Aquí podrías redirigir a una página de recuperación
  // router.push('/recover-password')
}

/**
 * Maneja el cierre de sesión
 */
function handleLogout() {
  if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
    authService.logout()
    usuario.value = null
    isAuthenticated.value = false
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.dashboard {
  min-height: 100vh;
  background: #f5f7fb;
}

.dashboard-header {
  background: #fff;
  padding: 20px 40px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  font-size: 24px;
  color: #0f172a;
  font-weight: 600;
}

.logout-btn {
  padding: 8px 16px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #b91c1c;
}

.user-info {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

.info-card h3 {
  margin-bottom: 16px;
  color: #0f172a;
  font-size: 18px;
}

.info-card p {
  margin-bottom: 8px;
  color: #475569;
  font-size: 14px;
}

.info-card p strong {
  color: #0f172a;
  margin-right: 8px;
}

.content {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
