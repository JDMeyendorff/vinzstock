<template>
  <div class="login-container">
    <form class="login-card" @submit.prevent="handleLogin">
      <h2>Iniciar sesión</h2>

      <div v-if="viewModel.hasError.value" class="error-message">
        {{ viewModel.error.value }}
      </div>

      <div v-if="viewModel.successMessage.value" class="success-message">
        {{ viewModel.successMessage.value }}
      </div>

      <label for="username">Usuario</label>
      <input
          id="username"
          type="text"
          v-model="viewModel.username.value"
          autocomplete="username"
          placeholder="Ingresa tu usuario"
          :disabled="viewModel.isLoading.value"
          required
      />

      <label for="password">Contraseña</label>
      <input
          id="password"
          type="password"
          v-model="viewModel.password.value"
          autocomplete="current-password"
          placeholder="Ingresa tu contraseña"
          :disabled="viewModel.isLoading.value"
          required
      />

      <a href="#" class="forgot-link" @click.prevent="handleRecoverPassword">
        Recuperar contraseña
      </a>

      <button
          type="submit"
          class="btn"
          :disabled="viewModel.isLoading.value"
      >
        {{ viewModel.isLoading.value ? 'Cargando...' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LoginViewModel } from '@/ViewModels/LoginViewModel'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { setUser } = useAuth()
const viewModel = new LoginViewModel()

// Verificar si ya está autenticado
onMounted(() => {
  if (useAuth().isAuthenticated.value) {
    router.push('/dashboard')
  }
})

/**
 * Manejar el login
 */
async function handleLogin() {
  const result = await viewModel.executeLogin()

  if (result.success) {
    setUser(result.data)
    router.push('/dashboard')
  }
}

/**
 * Manejar recuperación de contraseña
 */
async function handleRecoverPassword() {
  await viewModel.executeRecoverPassword()
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