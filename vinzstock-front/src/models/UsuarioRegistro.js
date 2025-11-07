/**
 * Modelo para registrar un nuevo usuario
 */
export class UsuarioRegistro {
    constructor(data = {}) {
        this.nombre = data.nombre || ''
        this.nuip = data.nuip || ''
        this.usuarioLogin = data.usuarioLogin || ''
        this.contrasena = data.contrasena || ''
        this.email = data.email || ''
        this.idRol = data.idRol || null
        this.estado = data.estado !== undefined ? data.estado : true
    }

    /**
     * Valida los datos del usuario
     */
    validate() {
        const errors = []

        if (!this.nombre || this.nombre.trim() === '') {
            errors.push('El nombre es requerido')
        } else if (this.nombre.length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres')
        }

        if (!this.nuip) {
            errors.push('El NUIP es requerido')
        } else if (this.nuip.toString().length < 7) {
            errors.push('El NUIP debe tener al menos 7 dígitos')
        }

        if (!this.usuarioLogin || this.usuarioLogin.trim() === '') {
            errors.push('El usuario es requerido')
        } else if (this.usuarioLogin.length < 8 ) {
            errors.push('El usuario debe tener al menos 8 caracteres')
        }

        if (!this.contrasena || this.contrasena.trim() === '') {
            errors.push('La contraseña es requerida')
        } else if (this.contrasena.length < 8) {
            errors.push('La contraseña debe tener al menos 8 caracteres')
        } else if (this.contrasena.length > 20) {
            errors.push('La contraseña no puede tener mas de 20 caracteres')
        }

        if (!this.email || this.email.trim() === '') {
            errors.push('El email es requerido')
        } else if (!this.isValidEmail(this.email)) {
            errors.push('El email no es válido')
        }

        if (!this.idRol || this.idRol === null) {
            errors.push('Debe seleccionar un rol')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    /**
     * Valida formato de email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    /**
     * Convierte a objeto para enviar al servidor
     */
    toJSON() {
        return {
            nombre: this.nombre,
            nuip: Number(this.nuip),
            usuarioLogin: this.usuarioLogin,
            contrasena: this.contrasena,
            email: this.email,
            rol: {
                idRol: this.idRol
            },
            estado: this.estado
        }
    }
}