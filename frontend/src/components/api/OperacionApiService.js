import { apiClient } from "./ApiClient"

//CREATE
export const crearOperacionApi
    = (operacion) => apiClient.post(`/operaciones/`, operacion);

//READ ONE
export const obtenerOperacionApi
    = (id) => apiClient.get(`/operaciones/${id}`)

//READ ALL
export const obtenerOperacionesApi
    = () => apiClient.get(`/operaciones`)

//AUTOCOMPLETE
export const obtenerOperacionNombreApi
= (query) => apiClient.get(`/obteneroperacionnombre?nombre=${query}`);

//UPDATE
export const actualizarOperacionApi
    = (id, operacion) => apiClient.put(`/operaciones/${id}`, operacion)

//DELETE
export const eliminarOperacionApi
    = (id) => apiClient.delete(`/operaciones/${id}`);

//REPORT
export const obtenerReporteOperacionApi
    = () => apiClient.get(`/reporteoperaciones`, { responseType: 'blob' })

