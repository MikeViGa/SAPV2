
import { apiClient } from "./ApiClient"

//CREATE
export const crearPlazoDePagoApi
    = (plazodepago) => apiClient.post(`/plazosdepago/`, plazodepago)

//READ 
export const obtenerPlazoDePagoApi
    = (id) => apiClient.get(`/plazosdepago/${id}`)

export const obtenerPlazosDePagoApi
    = () => apiClient.get(`/plazosdepago`)

export const obtenerPlazoDePagoDescripcionApi
    = (query) => apiClient.get(`/obtenerplazodepagonombre?nombre=${query}`);

//UPDATE
export const actualizarPlazoDePagoApi
    = (id, plazodepago) => apiClient.put(`/plazosdepago/${id}`, plazodepago)

//DELETE
export const eliminarPlazoDePagoApi
    = (id) => apiClient.delete(`/plazosdepago/${id}`)

    //REPORT
export const obtenerReportePlazoDePagoApi
= () => apiClient.get(`/reporteplazosdepago`, { responseType: 'blob' })