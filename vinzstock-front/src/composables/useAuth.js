import { ref, computed, onMounted } from 'vue'
import authService from '@/services/authService'

export function useAuth() {
    const usuario = ref(null)
    const isAuthenticated = ref(false)

    // Cargar usuario al montar
    onMounted(() => {
        loadUser()
    })

    /**
     * Cargar usuario desde localStorage
     */
    function loadUser() {
        if (authService.isAuthenticated()) {
            usuario.value = authService.getUser()
            isAuthenticated.value = true
        }
    }

    /**
     * Establecer usuario después del login
     */
    function setUser(user) {
        usuario.value = user
        isAuthenticated.value = true
    }

    /**
     * Cerrar sesión
     */
    function logout() {
        authService.logout()
        usuario.value = null
        isAuthenticated.value = false
    }

    /**
     * Verificar si tiene un rol
     */
    function hasRole(rol) {
        return usuario.value?.hasRole(rol) || false
    }

    /**
     * Verificar si es admin
     */
    const isAdmin = computed(() => {
        return usuario.value?.nombreRol === "Administrador"
    })

    /**
     * Obtener iniciales
     */
    const userInitials = computed(() => {
        return usuario.value?.getInitials() || '?'
    })

    return {
        usuario,
        isAuthenticated,
        isAdmin,
        userInitials,
        loadUser,
        setUser,
        logout,
        hasRole
    }
}