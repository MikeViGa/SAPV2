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

//DELETE (Soft Delete)
export const eliminarEmpleadoApi
    = (id) => apiClient.delete(`/empleados/${id}`)

// RESTORE
export const restaurarEmpleadoApi
    = (id) => apiClient.put(`/empleados/${id}/restaurar`)

// GET ALL INCLUDING INACTIVE (for admin)
export const obtenerEmpleadosTodosApi
    = () => apiClient.get(`/empleados/todos`)

//REPORT
export const obtenerReporteEmpleadoApi
= () => apiClient.get(`/reporteempleados`, { responseType: 'blob' })

