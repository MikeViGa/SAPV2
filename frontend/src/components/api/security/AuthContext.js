import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../ApiClient";
import { executeJwtAuthenticationService } from "../AuthenticationApiService";

export const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {
    const [isAuthenticated, setAuthenticated] = useState(false)
    const [username, setUsername] = useState(null)
    const [token, setToken] = useState(null)

    // ✅ Inicializar desde localStorage al cargar
    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        const savedUsername = localStorage.getItem('username')
        
        if (savedToken && savedUsername) {
            setToken(savedToken)
            setUsername(savedUsername)
            setAuthenticated(true)
            setupApiInterceptor(savedToken)
        }
    }, [])

    // ✅ Función para configurar interceptor (evita duplicados)
    function setupApiInterceptor(jwtToken) {
        // Limpiar interceptors existentes
        apiClient.interceptors.request.clear()
        apiClient.interceptors.response.clear()
        
        apiClient.interceptors.request.use(
            (config) => {
                config.headers.Authorization = jwtToken
                return config
            }
        )

        // Interceptor para manejar tokens expirados
        apiClient.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Token expirado, limpiar todo
                    logout()
                }
                return Promise.reject(error)
            }
        )
    }

    async function login(username, password) {
        try {
            // Limpiar cualquier token expirado antes del login
            logout()
            
            const response = await executeJwtAuthenticationService(username, password)
            if (response.status === 200) {
                const jwtToken = 'Bearer ' + response.data.token
                
                // ✅ Guardar en localStorage
                localStorage.setItem('token', jwtToken)
                localStorage.setItem('username', username)
                
                // ✅ Actualizar estado
                setAuthenticated(true)
                setUsername(username)
                setToken(jwtToken)
                
                // ✅ Configurar interceptor
                setupApiInterceptor(jwtToken)
                
                return true
            } else {
                logout()
                return false
            }
        } catch (error) {
            console.error('Error durante login:', error)
            logout()
            return false
        }
    }

    function logout() {
        // ✅ Limpiar todo
        setAuthenticated(false)
        setUsername(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        apiClient.interceptors.request.clear()
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, username, token }}>
            {children}
        </AuthContext.Provider>
    )
}