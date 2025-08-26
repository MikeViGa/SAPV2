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

export const obtenerClientesApi = (page = 0, size = 50, sort) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (sort) params.append('sort', sort);
    return apiClient.get(`/clientes?${params.toString()}`)
}

export const obtenerClienteNombreApi
    = (query) => apiClient.get(`/obtenerclientenombre?nombre=${query}`);


export const obtenerColoniasClienteApi
    = (query) => apiClient.get(`/obtenercoloniasclientes`, { params: { q: query } });


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
    return apiClient.get(`/reporteclientesporcolonia/${encodeURIComponent(colonia)}`, {
        responseType: 'blob'
    });
}
