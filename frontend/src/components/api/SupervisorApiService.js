
import { apiClient } from "./ApiClient"

//CREATE
export const crearSupervisorApi
    = (supervisor) => apiClient.post(`/supervisores/`, supervisor)

//READ 
export const obtenerSupervisorApi
    = (id) => apiClient.get(`/supervisores/${id}`)

export const obtenerSupervisorNombreApi
    = (query) => apiClient.get(`/obtenersupervisornombre?nombre=${query}`);

export const obtenerSupervisoresApi
    = () => apiClient.get(`/supervisores`)

//UPDATE
export const actualizarSupervisorApi
    = (id, supervisor) => apiClient.put(`/supervisores/${id}`, supervisor)

//DELETE
export const eliminarSupervisorApi
    = (id) => apiClient.delete(`/supervisores/${id}`)

//REPORT
export const obtenerReporteSupervisorApi
    = () => apiClient.get(`/reportesupervisores`, { responseType: 'blob' })



