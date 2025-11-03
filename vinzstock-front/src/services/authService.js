import api from './apiLogin'

class AuthService {
    /**
     * Autentica un usuario
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {Promise<{success: boolean, data?: object, error?: string}>}
     */
    async login(username, password) {
        try {
            const response = await api.post('/login', {
                username,
                password
            })

            if (response.data.success) {
                // Guardar usuario Y token en localStorage
                const userData = {
                    ...response.data.usuario,
                    token: response.data.token  // Incluir el token JWT
                }
                this.saveUser(userData)
                return {
                    success: true,
                    data: userData
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al iniciar sesión'
                }
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Recuperar contraseña
     * @param {string} username - Nombre de usuario
     * @returns {Promise<{success: boolean, message?: string, error?: string}>}
     */
    async recoverPassword(username) {
        try {
            const response = await api.post('/recover-password', { username })
            return {
                success: true,
                message: response.data.message || 'Correo de recuperación enviado'
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Guarda el usuario en localStorage
     * @param {object} usuario - Datos del usuario (incluye token)
     */
    saveUser(usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario))
    }

    /**
     * Obtiene el usuario actual
     * @returns {object|null} Usuario o null si no está autenticado
     */
    getUser() {
        const usuario = localStorage.getItem('usuario')
        return usuario ? JSON.parse(usuario) : null
    }

    /**
     * Obtiene el token JWT del usuario actual
     * @returns {string|null} Token o null si no está autenticado
     */
    getToken() {
        const usuario = this.getUser()
        return usuario ? usuario.token : null
    }

    /**
     * Verifica si hay un usuario autenticado
     * @returns {boolean}
     */
    isAuthenticated() {
        const usuario = this.getUser()
        return usuario !== null && usuario.token !== null
    }

    /**
     * Verifica si el token ha expirado (básico)
     * Para una verificación completa, deberías verificar en el backend
     * @returns {boolean}
     */
    isTokenExpired() {
        const token = this.getToken()
        if (!token) return true

        try {
            // Decodificar el token JWT (sin verificar la firma)
            const payload = JSON.parse(atob(token.split('.')[1]))
            const exp = payload.exp * 1000 // Convertir a milisegundos
            return Date.now() >= exp
        } catch (error) {
            console.error('Error al verificar expiración del token:', error)
            return true
        }
    }

    /**
     * Cierra la sesión del usuario
     */
    logout() {
        localStorage.removeItem('usuario')
    }

    /**
     * Refresca los datos del usuario (opcional)
     * Útil si el usuario actualiza su perfil
     * @returns {Promise<{success: boolean, data?: object, error?: string}>}
     */
    async refreshUserData() {
        try {
            const usuario = this.getUser()
            if (!usuario) {
                return { success: false, error: 'No hay usuario autenticado' }
            }

            // Llamar a un endpoint que devuelva los datos actualizados del usuario
            const response = await api.get(`/usuarios/${usuario.idUsuario}`)

            // Mantener el token actual
            const updatedUser = {
                ...response.data,
                token: usuario.token
            }

            this.saveUser(updatedUser)
            return { success: true, data: updatedUser }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Maneja los errores de las peticiones
     * @param {Error} error - Error de axios
     * @returns {object} Objeto con el error formateado
     */
    handleError(error) {
        console.error('Error en authService:', error)

        if (error.response && error.response.data) {
            // El servidor respondió con un error
            return {
                success: false,
                error: error.response.data.message || 'Usuario o contraseña incorrectos'
            }
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta
            return {
                success: false,
                error: 'No se pudo conectar con el servidor. Verifica tu conexión.'
            }
        } else {
            // Error al configurar la petición
            return {
                success: false,
                error: 'Error inesperado. Intenta nuevamente.'
            }
        }
    }

    /**
     * Valida los datos de login antes de enviarlos
     * @param {string} username
     * @param {string} password
     * @returns {object|null} Error si la validación falla, null si es válido
     */
    validateLoginData(username, password) {
        if (!username || username.trim() === '') {
            return { error: 'El usuario es requerido' }
        }

        if (!password || password.trim() === '') {
            return { error: 'La contraseña es requerida' }
        }

        if (username.length <= 8) {
            return { error: 'El usuario debe tener al menos 8 caracteres' }
        }

        if (password.length <= 8) {
            return { error: 'La contraseña debe tener al menos 8 caracteres' }
        }

        if (password.length > 20) {
            return { error: 'Las contraseñas del sistema no tienen mas de 20 caracteres' }
        }


        return null
    }

    /**
     * Obtiene información del token decodificado (sin verificar firma)
     * @returns {object|null} Payload del token o null si no hay token
     */
    getTokenPayload() {
        const token = this.getToken()
        if (!token) return null

        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload
        } catch (error) {
            console.error('Error al decodificar token:', error)
            return null
        }
    }

    /**
     * Verifica si el usuario tiene un rol específico
     * @param {string} rol - Nombre del rol a verificar
     * @returns {boolean}
     */
    hasRole(rol) {
        const usuario = this.getUser()
        return usuario && usuario.nombreRol === rol
    }

    /**
     * Verifica si el usuario tiene alguno de los roles especificados
     * @param {Array<string>} roles - Array de nombres de roles
     * @returns {boolean}
     */
    hasAnyRole(roles) {
        const usuario = this.getUser()
        return usuario && roles.includes(usuario.nombreRol)
    }
}

// Exportar una instancia única del servicio (Singleton)
export default new AuthService()