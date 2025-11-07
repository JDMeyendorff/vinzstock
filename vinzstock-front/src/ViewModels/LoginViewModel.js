import { ref, computed } from 'vue'
import authService from '@/services/authService'
import { LoginRequest } from '@/models/LoginRequest'

export class LoginViewModel {
    constructor() {
        // Estado reactivo
        this.username = ref('')
        this.password = ref('')
        this.error = ref('')
        this.successMessage = ref('')
        this.isLoading = ref(false)

        // Estado computado
        this.isFormValid = computed(() => {
            return this.username.value.length >= 3 &&
                this.password.value.length >= 4
        })

        this.hasError = computed(() => {
            return this.error.value !== ''
        })
    }

    /**
     * Limpiar mensajes
     */
    clearMessages() {
        this.error.value = ''
        this.successMessage.value = ''
    }

    /**
     * Limpiar formulario
     */
    clearForm() {
        this.username.value = ''
        this.password.value = ''
        this.clearMessages()
    }

    /**
     * Validar formulario
     */
    validateForm() {
        const loginRequest = new LoginRequest(
            this.username.value,
            this.password.value
        )
        return loginRequest.validate()
    }

    /**
     * Ejecutar login
     */
    async executeLogin() {
        this.clearMessages()

        // Validar datos
        const validation = this.validateForm()
        if (!validation.isValid) {
            this.error.value = validation.errors[0]
            return { success: false, error: validation.errors[0] }
        }

        this.isLoading.value = true

        try {
            // Crear request y enviar
            const loginRequest = new LoginRequest(
                this.username.value,
                this.password.value
            )

            const result = await authService.login(loginRequest)

            if (result.success) {
                this.successMessage.value = 'Inicio de sesión exitoso'

                // Limpiar formulario después de un delay
                setTimeout(() => {
                    this.clearForm()
                }, 1000)

                return result
            } else {
                this.error.value = result.error
                return result
            }
        } catch (err) {
            console.error('Error inesperado en login:', err)
            this.error.value = 'Error inesperado. Por favor intenta nuevamente.'
            return { success: false, error: this.error.value }
        } finally {
            this.isLoading.value = false
        }
    }

    /**
     * Ejecutar recuperación de contraseña
     */
    async executeRecoverPassword() {
        this.clearMessages()

        if (!this.username.value || this.username.value.trim() === '') {
            this.error.value = 'Ingresa tu usuario para recuperar la contraseña'
            return { success: false, error: this.error.value }
        }

        this.isLoading.value = true

        try {
            const result = await authService.recoverPassword(this.username.value)

            if (result.success) {
                this.successMessage.value = result.message
                return result
            } else {
                this.error.value = result.error
                return result
            }
        } catch (err) {
            console.error('Error en recuperación de contraseña:', err)
            this.error.value = 'Error al solicitar recuperación de contraseña'
            return { success: false, error: this.error.value }
        } finally {
            this.isLoading.value = false
        }
    }
}