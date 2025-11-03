<template>
  <div class="login-container">
    <form class="login-card" @submit.prevent="login">
      <h2>Iniciar sesión</h2>

      <label for="username">Usuario</label>
      <input
        id="username"
        type="text"
        v-model="username"
        autocomplete="username"
        placeholder="Ingresa tu usuario"
        required
      />

      <label for="password">Contraseña</label>
      <input
        id="password"
        type="password"
        v-model="password"
        autocomplete="current-password"
        placeholder="Ingresa tu contraseña"
        required
      />

      <a href="#" class="forgot-link" @click.prevent="recoverPassword">
        Recuperar contraseña
      </a>

      <button type="submit" class="btn">Entrar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const username = ref('')
const password = ref('')

const emit = defineEmits(['login', 'recover'])

function login() {
  if (!username.value || !password.value) {
    // Mensaje simple; en producción usar un sistema de notificaciones
    alert('Por favor completa usuario y contraseña.')
    return
  }
  // Emite los datos de login al padre o maneja aquí la autenticación
  emit('login', { username: username.value, password: password.value })
}

function recoverPassword() {
  // Emite evento para que el padre maneje la recuperación o navegar a una ruta
  emit('recover')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fb;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  padding: 28px;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-card h2 {
  margin: 0 0 8px 0;
  text-align: center;
  font-size: 20px;
  color: #0f172a;
}

.login-card label {
  font-size: 13px;
  color: #334155;
}

.login-card input {
  padding: 10px 12px;
  border: 1px solid #e6edf3;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.login-card input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06);
}

.forgot-link {
  display: inline-block;
  margin-top: 4px;
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.btn {
  margin-top: 8px;
  padding: 10px 12px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn:hover {
  background: #1e40af;
}
</style>