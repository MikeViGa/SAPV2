
import { apiClient } from "./ApiClient"

//CREATE
export const crearPaqueteApi
    = (paquete) => apiClient.post(`/paquetes/`, paquete)

//READ 
export const obtenerPaqueteApi
    = (id) => apiClient.get(`/paquetes/${id}`)

export const obtenerPaquetesApi
    = () => apiClient.get(`/paquetes`)

export const obtenerPaqueteDescripcionApi
    = (query) => apiClient.get(`/obtenerpaquetedescripcion?descripcion=${query}`);

//UPDATE
export const actualizarPaqueteApi
    = (id, paquete) => apiClient.put(`/paquetes/${id}`, paquete)

//DELETE
export const eliminarPaqueteApi
    = (id) => apiClient.delete(`/paquetes/${id}`)

    //REPORT
export const obtenerReportePaqueteApi
= () => apiClient.get(`/reportepaquetes`, { responseType: 'blob' })