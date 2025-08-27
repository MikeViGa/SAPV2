
import { apiClient } from "./ApiClient"

//CREATE
export const crearSucursalApi
    = (sucursal) => apiClient.post(`/sucursales/`, sucursal)

//READ 
export const obtenerSucursalApi
    = (id) => apiClient.get(`/sucursales/${id}`)

export const obtenerSucursalesApi
    = () => apiClient.get(`/sucursales`)

export const obtenerSucursalNombreApi
    = (query) => apiClient.get(`/obtenersucursalnombre?nombre=${query}`);

//UPDATE
export const actualizarSucursalApi
    = (id, sucursal) => apiClient.put(`/sucursales/${id}`, sucursal)

//DELETE (Soft Delete)
export const eliminarSucursalApi
    = (id) => apiClient.delete(`/sucursales/${id}`)

// RESTORE
export const restaurarSucursalApi
    = (id) => apiClient.put(`/sucursales/${id}/restaurar`)

// GET ALL INCLUDING INACTIVE (for admin)
export const obtenerSucursalesTodasApi
    = () => apiClient.get(`/sucursales/todas`)

//REPORT
export const obtenerReporteSucursalApi
= () => apiClient.get(`/reportesucursales`, { responseType: 'blob' })