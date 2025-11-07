<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Bienvenido a VinzStock</h1>
      <div class="user-actions">
        <div class="user-avatar">{{ userInitials }}</div>
        <span class="user-name">{{ usuario?.nombre }}</span>
        <button @click="handleLogout" class="logout-btn">
          Cerrar sesión
        </button>
      </div>
    </header>

    <div class="dashboard-content">

      <!-- Información del usuario -->
      <div class="user-info">
        <div class="info-card">
          <h3>Información del Usuario</h3>
          <p><strong>Nombre:</strong> {{ usuario?.nombre }}</p>
          <p><strong>Usuario:</strong> {{ usuario?.usuarioLogin }}</p>
          <p><strong>Email:</strong> {{ usuario?.email }}</p>
          <p><strong>Rol:</strong> {{ usuario?.nombreRol }}</p>
          <p><strong>ID:</strong> {{ usuario?.idUsuario }}</p>

          <div v-if="isAdmin" class="admin-badge">
            👑 Administrador
          </div>
        </div>
      </div>

      <!-- Sección de administración (solo para admins) -->
      <div v-if="isAdmin" class="admin-section">
        <div class="section-header">
          <h3>Panel de Administración</h3>
          <button
              v-if="!showCrearUsuario"
              @click="showCrearUsuario = true"
              class="btn-crear"
          >
            ➕ Crear Nuevo Usuario
          </button>
        </div>

        <!-- Formulario de creación de usuario -->
        <CrearUsuarioView
            v-if="showCrearUsuario"
            @usuarioCreado="handleUsuarioCreado"
            @cancelar="showCrearUsuario = false"
        />
      </div>

      <!-- Contenido general -->
      <div class="content">
        <p>Contenido de tu aplicación aquí...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import CrearUsuarioView from './CrearUsuarioView.vue'


const router = useRouter()
const { usuario, isAdmin, userInitials, logout } = useAuth()
const showCrearUsuario = ref(false)

function handleLogout() {
  if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
    logout()
    router.push('/login')
  }
}

function handleUsuarioCreado(usuario) {
  console.log('Usuario creado:', usuario)
  // Opcionalmente, ocultar el formulario después de crear
  setTimeout(() => {
    showCrearUsuario.value = false
  }, 2000)
}
</script>

<style scoped>
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

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
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

.dashboard-content {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.user-info {
  margin-bottom: 40px;
}

.info-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  position: relative;
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

.admin-badge {
  position: absolute;
  top: 24px;
  right: 24px;
  padding: 6px 12px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.admin-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 20px;
  color: #0f172a;
  font-weight: 600;
}

.btn-crear {
  padding: 10px 20px;
  background: #16a34a;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-crear:hover {
  background: #15803d;
}

.content {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}
</style>