import api from './apiLogin'
import { Usuario } from '@/models/Usuario'

class AuthService {
    async login(loginRequest) {
        try {
            const response = await api.post('/login', loginRequest.toJSON())

            if (response.data.success) {
                const usuario = Usuario.fromResponse({
                    ...response.data.usuario,
                    token: response.data.token
                })


                this.saveUser(usuario)
                return { success: true, data: usuario }
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

    saveUser(usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario.toJSON()))
    }

    getUser() {
        const data = localStorage.getItem('usuario')
        return data ? Usuario.fromResponse(JSON.parse(data)) : null
    }

    getToken() {
        const usuario = this.getUser()
        return usuario ? usuario.token : null
    }

    isAuthenticated() {
        const usuario = this.getUser()
        return usuario !== null && usuario.token !== null
    }

    logout() {
        localStorage.removeItem('usuario')
    }

    handleError(error) {
        console.error('Error en authService:', error)

        if (error.response?.data) {
            return {
                success: false,
                error: error.response.data.message || 'Usuario o contraseña incorrectos'
            }
        } else if (error.request) {
            return {
                success: false,
                error: 'No se pudo conectar con el servidor'
            }
        } else {
            return {
                success: false,
                error: 'Error inesperado'
            }
        }
    }
}

export default new AuthService()