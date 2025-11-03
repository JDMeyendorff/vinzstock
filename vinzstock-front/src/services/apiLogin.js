import axios from 'axios'

// Configuración base de axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/vinzstock',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor para agregar el token JWT a cada petición
api.interceptors.request.use(
    config => {
        const usuario = localStorage.getItem('usuario')
        if (usuario) {
            try {
                const user = JSON.parse(usuario)
                // Si existe el token, agregarlo al header Authorization
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`
                }
            } catch (error) {
                console.error('Error al parsear usuario de localStorage:', error)
            }
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    response => response,
    error => {
        // Si el token expiró o no es válido (401 Unauthorized)
        if (error.response?.status === 401) {
            console.warn('Token inválido o expirado. Redirigiendo al login...')

            // Limpiar localStorage
            localStorage.removeItem('usuario')

            // Redirigir al login (solo si no estamos ya en login)
            if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
                window.location.href = '/login'
            }
        }

        // Si hay un error de servidor (500)
        if (error.response?.status === 500) {
            console.error('Error del servidor:', error.response.data)
        }

        // Si no hay conexión con el servidor
        if (!error.response) {
            console.error('No se pudo conectar con el servidor')
        }

        return Promise.reject(error)
    }
)

export default api