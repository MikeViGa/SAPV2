import { apiClient } from "./ApiClient"

//CREATE
export const crearJardinApi
    = (jardin) => apiClient.post(`/jardines/`, jardin)

//READ 
export const obtenerJardinApi
    = (id) => apiClient.get(`/jardines/${id}`)

export const obtenerJardinesApi
    = () => apiClient.get(`/jardines`)

export const obtenerJardinDescripcionApi
    = (query) => apiClient.get(`/obtenerjardindescripcion?descripcion=${query}`);

//UPDATE
export const actualizarJardinApi
    = (id, jardin) => apiClient.put(`/jardines/${id}`, jardin)

//DELETE
export const eliminarJardinApi
    = (id) => apiClient.delete(`/jardines/${id}`)

    //REPORT
export const obtenerReporteJardinApi
= () => apiClient.get(`/reportejardines`, { responseType: 'blob' })