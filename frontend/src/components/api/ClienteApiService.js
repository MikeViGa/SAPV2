import { apiClient } from "./ApiClient"

const convertToISO = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/");
    return `${year}-${month}-${day}T${timePart}`;
};

//CREATE
export const crearClienteApi
    = (cliente) => apiClient.post(`/clientes/`, cliente)

//READ 
export const obtenerClienteApi
    = (id) => apiClient.get(`/clientes/${id}`)

export const obtenerClientesApi = () => {
    return apiClient.get(`/clientes`)
}

export const obtenerClienteNombreApi
    = (query) => apiClient.get(`/obtenerclientenombre?nombre=${query}`);


export const obtenerColoniasClienteApi
    = (query) => apiClient.get(`/obtenercoloniasclientes`);


export const obtenerClientesEntreFechasApi = (fechaInicial, fechaFinal) => {
    return apiClient.get(`/clientes/${fechaInicial}/${fechaFinal}`)
}

//UPDATE
export const actualizarClienteApi
    = (id, cliente) => apiClient.put(`/clientes/${id}`, cliente)

//DELETE
export const eliminarClienteApi
    = (id) => apiClient.delete(`/clientes/${id}`)

//REPORT
export const obtenerReporteClienteApi
    = () => apiClient.get(`/reporteclientes`, { responseType: 'blob' })

export const generarReporteClientesPorFechasApi = (fechaInicial, fechaFinal) => {
    return apiClient.get(`/reporteclientesporfechas/${convertToISO(fechaInicial)}/${convertToISO(fechaFinal)}`, {
        responseType: 'blob'
    });
}

export const generarReporteClientesPorColoniaApi = (colonia) => {
    return apiClient.get(`/reporteclientesporcolonia/${colonia}`, {
        responseType: 'blob'
    });
}
