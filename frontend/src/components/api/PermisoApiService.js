import { apiClient } from "./ApiClient"

//CREATE
export const crearPermisoApi
    = (permiso) => apiClient.post(`/permisos/`, permiso);

//READ ONE
export const obtenerPermisoApi
    = (id) => apiClient.get(`/permiso/${id}`)

//READ ALL
export const obtenerPermisosApi
    = () => apiClient.get(`/permisos`)

//AUTOCOMPLETE
export const obtenerPermisoNombreApi
    = (query) => apiClient.get(`/obtenerpermisonombre?nombre=${query}`);

export const obtenerPermisosRolApi
    = (id) => apiClient.get(`/obtenerpermisosrol/${id}/modulos`)

//UPDATE
export const actualizarPermisoApi
    = (idRol, updatedModulos) => apiClient.put(`/permisos/${idRol}`, updatedModulos)

//DELETE
export const eliminarPermisoApi
    = (id) => apiClient.delete(`/permisos/${id}`);

//REPORT
export const obtenerReportePermisoApi
    = () => apiClient.get(`/reportepermisos`, { responseType: 'blob' })

