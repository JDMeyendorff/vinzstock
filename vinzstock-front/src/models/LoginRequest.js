/**
 * Modelo de petición de login
 */
export class LoginRequest {
    constructor(username, password) {
        this.username = username
        this.password = password
    }

    /**
     * Valida los datos del login
     */
    validate() {
        const errors = []

        if (!this.username || this.username.trim() === '') {
            errors.push('El usuario es requerido')
        } else if (this.username.length < 8) {
            errors.push('El usuario debe tener al menos 8 caracteres')
        }

        if (!this.password || this.password.trim() === '') {
            errors.push('La contraseña es requerida')
        } else if (this.password.length < 8) {
            errors.push('La contraseña debe tener al menos 8 caracteres')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    /**
     * Convierte a objeto para enviar al servidor
     */
    toJSON() {
        return {
            username: this.username,
            password: this.password
        }
    }
}