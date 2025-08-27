
import { apiClient } from "./ApiClient"

//CREATE
export const crearRolApi
    = (rol) => apiClient.post(`/roles/`, rol)

//READ 
export const obtenerRolApi
    = (id) => apiClient.get(`/roles/${id}`)

export const obtenerRolesApi
    = () => apiClient.get(`/roles`)

// Obtener todos los roles incluyendo inactivos (para administración)
export const obtenerRolesTodosApi
    = () => apiClient.get(`/roles/todos`)

//UPDATE
export const actualizarRolApi
    = (id, rol) => apiClient.put(`/roles/${id}`, rol)

//DELETE (Soft delete)
export const eliminarRolApi
    = (id) => apiClient.delete(`/roles/${id}`)

//RESTAURAR
export const restaurarRolApi
    = (id) => apiClient.put(`/roles/${id}/restaurar`)





