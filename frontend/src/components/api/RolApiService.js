
import { apiClient } from "./ApiClient"

//CREATE
export const crearRolApi
    = (rol) => apiClient.post(`/roles/`, rol)

//READ 
export const obtenerRolApi
    = (id) => apiClient.get(`/roles/${id}`)

export const obtenerRolesApi
    = () => apiClient.get(`/roles`)

//UPDATE
export const actualizarRolApi
    = (id, rol) => apiClient.put(`/roles/${id}`, rol)

//DELETE
export const eliminarRolApi
    = (id) => apiClient.delete(`/roles/${id}`)





