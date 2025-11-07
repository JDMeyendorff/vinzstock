import { ref, computed } from 'vue'
import usuarioService from '@/services/usuarioService'
import { UsuarioRegistro } from '@/models/UsuarioRegistro'

export class CrearUsuarioViewModel {
    constructor() {
        // Estado del formulario
        this.nombre = ref('')
        this.nuip = ref('')
        this.usuarioLogin = ref('')
        this.contrasena = ref('')
        this.confirmarContrasena = ref('')
        this.email = ref('')
        this.idRol = ref(null)
        this.estado = ref(true)

        // Estado de roles
        this.roles = ref([])
        this.isLoadingRoles = ref(false)

        // Estado de la operación
        this.error = ref('')
        this.successMessage = ref('')
        this.isLoading = ref(false)




        // Computados
        this.isFormValid = computed(() => {
            return this.nombre.value.length >= 3 &&
                this.nuip.value.toString().length >= 6 &&
                this.usuarioLogin.value.length >= 3 &&
                this.contrasena.value.length >= 6 &&
                this.email.value.includes('@') &&
                this.idRol.value !== null &&
                this.contrasena.value === this.confirmarContrasena.value
        })

        this.passwordsMatch = computed(() => {
            if (this.confirmarContrasena.value === '') return true
            return this.contrasena.value === this.confirmarContrasena.value
        })
    }

    /**
     * Cargar roles disponibles
     */
    async loadRoles() {
        this.isLoadingRoles.value = true
        try {
            const result = await usuarioService.getAllRoles()
            if (result.success) {
                this.roles.value = result.data
            } else {
                this.error.value = result.error
            }
        } catch (err) {
            console.error('Error al cargar roles:', err)
            this.error.value = 'Error al cargar los roles'
        } finally {
            this.isLoadingRoles.value = false
        }
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
        this.nombre.value = ''
        this.nuip.value = ''
        this.usuarioLogin.value = ''
        this.contrasena.value = ''
        this.confirmarContrasena.value = ''
        this.email.value = ''
        this.idRol.value = null
        this.estado.value = true
        this.clearMessages()
    }

    /**
     * Validar formulario
     */
    validateForm() {
        const usuarioRegistro = new UsuarioRegistro({
            nombre: this.nombre.value,
            nuip: this.nuip.value,
            usuarioLogin: this.usuarioLogin.value,
            contrasena: this.contrasena.value,
            email: this.email.value,
            idRol: this.idRol.value,
            estado: this.estado.value
        })

        const validation = usuarioRegistro.validate()

        // Validar que las contraseñas coincidan
        if (this.contrasena.value !== this.confirmarContrasena.value) {
            validation.isValid = false
            validation.errors.push('Las contraseñas no coinciden')
        }

        return validation
    }

    /**
     * Ejecutar creación de usuario
     */
    async executeCreate() {
        this.clearMessages()

        // Validar datos
        const validation = this.validateForm()
        if (!validation.isValid) {
            this.error.value = validation.errors[0]
            return { success: false, error: validation.errors[0] }
        }

        this.isLoading.value = true

        try {
            // Crear objeto de registro
            const usuarioRegistro = new UsuarioRegistro({
                nombre: this.nombre.value,
                nuip: this.nuip.value,
                usuarioLogin: this.usuarioLogin.value,
                contrasena: this.contrasena.value,
                email: this.email.value,
                idRol: this.idRol.value,
                estado: this.estado.value
            })

            const result = await usuarioService.createUsuario(usuarioRegistro)

            if (result.success) {
                this.successMessage.value = result.message

                // Limpiar formulario después de un delay
                setTimeout(() => {
                    this.clearForm()
                }, 2000)

                return result
            } else {
                this.error.value = result.error
                return result
            }
        } catch (err) {
            console.error('Error inesperado al crear usuario:', err)
            this.error.value = 'Error inesperado. Por favor intenta nuevamente.'
            return { success: false, error: this.error.value }
        } finally {
            this.isLoading.value = false
        }
    }
}