import { apiClient } from "./ApiClient"

//CREATE
export const crearEmpleadoApi
    = (empleado) => apiClient.post(`/empleados/`, empleado)

//READ 
export const obtenerEmpleadoApi
    = (id) => apiClient.get(`/empleados/${id}`)

export const obtenerEmpleadosApi 
= () => apiClient.get(`/empleados`)

export const obtenerEmpleadoNombreApi
= (query) => apiClient.get(`/obtenerempleadonombre?nombre=${query}`);

export const obtenerEmpleadosEntreFechasApi
= (fechaInicial, fechaFinal) =>  apiClient.get(`/empleados/${fechaInicial}/${fechaFinal}`)

//UPDATE
export const actualizarEmpleadoApi
    = (id, empleado) => apiClient.put(`/empleados/${id}`, empleado)

//DELETE
export const eliminarEmpleadoApi
    = (id) => apiClient.delete(`/empleados/${id}`)

//REPORT
export const obtenerReporteEmpleadoApi
= () => apiClient.get(`/reporteempleados`, { responseType: 'blob' })





