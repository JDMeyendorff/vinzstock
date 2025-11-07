/**
 * Modelo de Usuario
 */
export class Usuario {
    constructor(data = {}) {
        this.idUsuario = data.idUsuario || null
        this.nombre = data.nombre || ''
        this.usuarioLogin = data.usuarioLogin || ''
        this.email = data.email || ''
        this.nombreRol = data.nombreRol || ''
        this.token = data.token || null
    }

    /**
     * Verifica si el usuario es administrador
     */
    isAdmin() {
        return this.nombreRol === 'ADMIN' || this.nombreRol === 'ADMINISTRADOR'
    }

    /**
     * Verifica si el usuario tiene un rol específico
     */
    hasRole(rol) {
        return this.nombreRol === rol
    }

    /**
     * Obtiene las iniciales del nombre
     */
    getInitials() {
        return this.nombre
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    /**
     * Convierte el modelo a objeto plano para localStorage
     */
    toJSON() {
        return {
            idUsuario: this.idUsuario,
            nombre: this.nombre,
            usuarioLogin: this.usuarioLogin,
            email: this.email,
            nombreRol: this.nombreRol,
            token: this.token
        }
    }

    /**
     * Crea una instancia desde datos del servidor
     */
    static fromResponse(data) {
        return new Usuario(data)
    }
}