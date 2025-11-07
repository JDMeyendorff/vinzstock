<template>
  <div class="crear-usuario-container">
    <div class="crear-usuario-card">
      <h2>Crear Nuevo Usuario</h2>
      <p class="subtitle">Completa los datos del nuevo usuario</p>

      <div v-if="viewModel.error.value" class="error-message">
        {{ viewModel.error.value }}
      </div>

      <div v-if="viewModel.successMessage.value" class="success-message">
        {{ viewModel.successMessage.value }}
      </div>

      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-row">
          <div class="form-group">
            <label for="nombre">Nombre Completo *</label>
            <input
                id="nombre"
                type="text"
                v-model="viewModel.nombre.value"
                placeholder="Ej: Juan Pérez"
                :disabled="viewModel.isLoading.value"
                required
            />
          </div>

          <div class="form-group">
            <label for="nuip">NUIP / Cédula *</label>
            <input
                id="nuip"
                type="number"
                v-model="viewModel.nuip.value"
                placeholder="Ej: 1234567890"
                :disabled="viewModel.isLoading.value"
                required
            />

          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="usuarioLogin">Nombre de Usuario *</label>
            <input
                id="usuarioLogin"
                type="text"
                v-model="viewModel.usuarioLogin.value"
                placeholder="Ej: jperez"
                :disabled="viewModel.isLoading.value"
                required
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
                id="email"
                type="email"
                v-model="viewModel.email.value"
                placeholder="Ej: usuario@ejemplo.com"
                :disabled="viewModel.isLoading.value"
                required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="contrasena">Contraseña *</label>
            <input
                id="contrasena"
                type="password"
                v-model="viewModel.contrasena.value"
                placeholder="Mínimo 6 caracteres"
                :disabled="viewModel.isLoading.value"
                required
            />
          </div>

          <div class="form-group">
            <label for="confirmarContrasena">Confirmar Contraseña *</label>
            <input
                id="confirmarContrasena"
                type="password"
                v-model="viewModel.confirmarContrasena.value"
                placeholder="Repite la contraseña"
                :disabled="viewModel.isLoading.value"
                :class="{ 'error-input': !viewModel.passwordsMatch.value }"
                required
            />
            <span v-if="!viewModel.passwordsMatch.value" class="error-hint">
              Las contraseñas no coinciden
            </span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="rol">Rol *</label>
            <select
                id="rol"
                v-model="viewModel.idRol.value"
                :disabled="viewModel.isLoading.value || viewModel.isLoadingRoles.value"
                required
            >
              <option :value="null" disabled>Selecciona un rol</option>
              <option
                  v-for="rol in viewModel.roles.value"
                  :key="rol.idRol"
                  :value="rol.idRol"
              >
                {{ rol.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                  type="checkbox"
                  v-model="viewModel.estado.value"
                  :disabled="viewModel.isLoading.value"
              />
              <span>Usuario Activo</span>
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button
              type="button"
              class="btn btn-secondary"
              @click="handleCancel"
              :disabled="viewModel.isLoading.value"
          >
            Cancelar
          </button>
          <button
              type="submit"
              class="btn btn-primary"
              :disabled="viewModel.isLoading.value || !viewModel.isFormValid.value"
          >
            {{ viewModel.isLoading.value ? 'Creando...' : 'Crear Usuario' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CrearUsuarioViewModel } from '@/ViewModels/CrearUsuarioViewModel'

const router = useRouter()
const emit = defineEmits(['usuarioCreado', 'cancelar'])
const viewModel = new CrearUsuarioViewModel()

onMounted(() => {
  viewModel.loadRoles()
})

async function handleSubmit() {
  const result = await viewModel.executeCreate()

  if (result.success) {
    emit('usuarioCreado', result.data)
  }
}

function handleCancel() {
  if (confirm('¿Estás seguro de cancelar? Se perderán los datos ingresados.')) {
    viewModel.clearForm()
    emit('cancelar')
  }
}
</script>

<style scoped>
.crear-usuario-container {
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.crear-usuario-card {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.crear-usuario-card h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #0f172a;
  font-weight: 600;
}

.subtitle {
  margin: 0 0 24px 0;
  color: #64748b;
  font-size: 14px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1px solid #070303;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06);
}

.form-group input:disabled,
.form-group select:disabled {
  background: #ffffff;
  cursor: not-allowed;
  opacity: 0.6;
}

.error-input {
  border-color: #dc2626 !important;
}

.error-hint {
  font-size: 12px;
  color: #dc2626;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding-top: 28px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label span {
  font-size: 14px;
  color: #334155;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
  padding-top: 20px;
  border-top: 1px solid #e6edf3;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #1e40af;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 12px 16px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #fecaca;
  animation: slideIn 0.3s ease-out;
}

.success-message {
  padding: 12px 16px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 6px;
  font-size: 14px;
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