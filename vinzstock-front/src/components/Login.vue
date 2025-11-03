<template>
  <div class="login-container">
    <form class="login-card" @submit.prevent="handleLogin">
      <h2>Iniciar sesión</h2>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <label for="username">Usuario</label>
      <input
          id="username"
          type="text"
          v-model="username"
          autocomplete="username"
          placeholder="Ingresa tu usuario"
          :disabled="isLoading"
          required
      />

      <label for="password">Contraseña</label>
      <input
          id="password"
          type="password"
          v-model="password"
          autocomplete="current-password"
          placeholder="Ingresa tu contraseña"
          :disabled="isLoading"
          required
      />

      <a href="#" class="forgot-link" @click.prevent="handleRecoverPassword">
        Recuperar contraseña
      </a>

      <button type="submit" class="btn" :disabled="isLoading">
        {{ isLoading ? 'Cargando...' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import authService from '@/services/authService'

const username = ref('')
const password = ref('')
const error = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const emit = defineEmits(['loginSuccess', 'recover'])

/**
 * Maneja el proceso de login
 */
async function handleLogin() {
  // Limpiar mensajes previos
  error.value = ''
  successMessage.value = ''

  // Validar datos antes de enviar
  const validationError = authService.validateLoginData(
      username.value,
      password.value
  )

  if (validationError) {
    error.value = validationError.error
    return
  }

  isLoading.value = true

  try {
    // Llamar al servicio de autenticación
    const result = await authService.login(username.value, password.value)

    if (result.success) {
      successMessage.value = 'Inicio de sesión exitoso'

      // Emitir evento al componente padre
      emit('loginSuccess', result.data)

      // Limpiar campos después de un breve delay
      setTimeout(() => {
        username.value = ''
        password.value = ''
        successMessage.value = ''
      }, 1000)
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error inesperado en handleLogin:', err)
    error.value = 'Error inesperado. Por favor intenta nuevamente.'
  } finally {
    isLoading.value = false
  }
}

/**
 * Maneja la recuperación de contraseña
 */
async function handleRecoverPassword() {
  error.value = ''
  successMessage.value = ''

  if (!username.value || username.value.trim() === '') {
    error.value = 'Ingresa tu usuario para recuperar la contraseña'
    return
  }

  isLoading.value = true

  try {
    const result = await authService.recoverPassword(username.value)

    if (result.success) {
      successMessage.value = result.message
      emit('recover', { username: username.value })
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error en recuperación de contraseña:', err)
    error.value = 'Error al solicitar recuperación de contraseña'
  } finally {
    isLoading.value = false
  }
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
  font-weight: 500;
}

.login-card input {
  padding: 10px 12px;
  border: 1px solid #e6edf3;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.login-card input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06);
}

.login-card input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.6;
}

.forgot-link {
  display: inline-block;
  margin-top: 4px;
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  text-decoration: underline;
  color: #1e40af;
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
  font-size: 14px;
  transition: background 0.2s;
}

.btn:hover:not(:disabled) {
  background: #1e40af;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 10px 12px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid #fecaca;
  animation: slideIn 0.3s ease-out;
}

.success-message {
  padding: 10px 12px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid #bbf7d0;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>