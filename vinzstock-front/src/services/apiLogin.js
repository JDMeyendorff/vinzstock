import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/vinzstock',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor para agregar token
api.interceptors.request.use(
    config => {
        const usuario = localStorage.getItem('usuario')
        if (usuario) {
            try {
                const user = JSON.parse(usuario)
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`
                }
            } catch (error) {
                console.error('Error al parsear usuario:', error)
            }
        }
        return config
    },
    error => Promise.reject(error)
)

// Interceptor para manejar errores
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('usuario')
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api