
import { apiClient } from "./ApiClient"

//CREATE
export const crearAtaudApi
    = (ataud) => apiClient.post(`/ataudes/`, ataud)

//READ 
export const obtenerAtaudApi
    = (id) => apiClient.get(`/ataudes/${id}`)

export const obtenerAtaudesApi
    = () => apiClient.get(`/ataudes`)

export const obtenerAtaudDescripcionApi
    = (query) => apiClient.get(`/obteneratauddescripcion?descripcion=${query}`);

//UPDATE
export const actualizarAtaudApi
    = (id, ataud) => apiClient.put(`/ataudes/${id}`, ataud)

//DELETE
export const eliminarAtaudApi
    = (id) => apiClient.delete(`/ataudes/${id}`)

    //REPORT
export const obtenerReporteAtaudApi
= () => apiClient.get(`/reporteataudes`, { responseType: 'blob' })