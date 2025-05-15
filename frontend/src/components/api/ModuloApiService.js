import { apiClient } from "./ApiClient"

//CREATE
export const crearModuloApi
    = (modulo) => apiClient.post(`/modulos/`, modulo)

//READ 
export const obtenerModuloApi
    = (id) => apiClient.get(`/modulos/${id}`)

export const obtenerModulosApi
    = () => apiClient.get(`/modulos`)

export const obtenerModulosPermitidosApi
    = (nombreUsuario) => apiClient.get(`/modulospermitidos/${nombreUsuario}`)

//UPDATE
export const actualizarModuloApi
    = (id, modulo) => apiClient.put(`/modulos/${id}`, modulo)

//DELETE
export const eliminarModuloApi
    = (id) => apiClient.delete(`/modulos/${id}`)





