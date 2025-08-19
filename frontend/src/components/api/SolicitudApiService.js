
import { apiClient } from "./ApiClient"

//CREATE
export const crearSolicitudApi
    = (solicitud) => apiClient.post(`/solicitudes/`, solicitud)

//READ 
export const obtenerSolicitudApi
    = (id) => apiClient.get(`/solicitudes/${id}`)

export const obtenerSolicitudesApi
    = (page = 0, size = 50) => apiClient.get(`/solicitudes`, { params: { page, size } })

export const obtenerSolicitudNombreApi
    = (query) => apiClient.get(`/obtenersolicitudnombre?nombre=${query}`);

//UPDATE
export const actualizarSolicitudApi
    = (id, solicitud) => apiClient.put(`/solicitudes/${id}`, solicitud)

//DELETE
export const eliminarSolicitudApi
    = (id) => apiClient.delete(`/solicitudes/${id}`)

    //REPORT
export const obtenerReporteSolicitudApi
= () => apiClient.get(`/reportesolicitudes`, { responseType: 'blob' })