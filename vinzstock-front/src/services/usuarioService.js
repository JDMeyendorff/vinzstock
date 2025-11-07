import api from './apiLogin'
import { UsuarioRegistro } from '@/models/UsuarioRegistro'

class UsuarioService {
    /**
     * Crear un nuevo usuario
     */
    async createUsuario(usuarioRegistro) {
        try {
            const response = await api.post('/save', usuarioRegistro.toJSON())
            return {
                success: true,
                data: response.data,
                message: 'Usuario creado exitosamente'
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Obtener todos los usuarios
     */
    async getAllUsuarios() {
        try {
            const response = await api.get('/all')
            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Obtener todos los roles
     */
    async getAllRoles() {
        try {
            const response = await api.get('/roles/all')
            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return this.handleError(error)
        }
    }




    /**
     * Actualizar usuario
     */
    async updateUsuario(usuario) {
        try {
            const response = await api.put('/update', usuario)
            return {
                success: true,
                data: response.data,
                message: 'Usuario actualizado exitosamente'
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Buscar usuarios por nombre
     */
    async searchByNombre(nombre) {
        try {
            const response = await api.get('/all/nombre', {
                params: { nombre }
            })
            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return this.handleError(error)
        }
    }

    /**
     * Maneja los errores
     */
    handleError(error) {
        console.error('Error en usuarioService:', error)

        if (error.response?.data) {
            let errorMessage = 'Error al procesar la solicitud'

            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message
            }

            return { success: false, error: errorMessage }
        }

        if (error.response?.data) {


            return {
                success: false,
                error: error.response.data.message || 'Error al procesar la solicitud'
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

export default new UsuarioService()