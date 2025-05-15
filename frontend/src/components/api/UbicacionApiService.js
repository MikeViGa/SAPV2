import { apiClient } from "./ApiClient"

export const crearUbicacionApi
    = (ubicacion) => apiClient.post(`/ubicaciones/`, ubicacion)

export const obtenerUbicacionApi
    = (id) => apiClient.get(`/ubicaciones/${id}`)

export const obtenerUbicacionesApi
    = () => apiClient.get(`/ubicaciones`)

export const obtenerUbicacionesPorJardinApi
    = (claveJardin) => apiClient.get(`/ubicacionesporjardin/${claveJardin}`)

export const obtenerUbicacionDescripcionApi
    = (query) => apiClient.get(`/obtenerubicaciondescripcion?descripcion=${query}`);

export const actualizarUbicacionApi
    = (id, ubicacion) => apiClient.put(`/ubicaciones/${id}`, ubicacion)

export const eliminarUbicacionApi
    = (id) => apiClient.delete(`/ubicaciones/${id}`)

export const obtenerReporteUbicacionApi
    = () => apiClient.get(`/reporteubicaciones`, { responseType: 'blob' })