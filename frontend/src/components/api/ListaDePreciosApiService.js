
import { apiClient } from "./ApiClient"

//CREATE
export const crearListaDePreciosApi
    = (listaDePrecios) => apiClient.post(`/listadeprecios/`, listaDePrecios)

//READ 
export const obtenerListaDePreciosApi
    = (id) => apiClient.get(`/listasdeprecios/${id}`)

export const obtenerListasDePreciosApi
    = () => apiClient.get(`/listasdeprecios`)

export const obtenerListaDePreciosDescripcionApi
    = (query) => apiClient.get(`/obtenerlistadepreciosnombre?nombre=${query}`);

//UPDATE
export const actualizarListaDePreciosApi
    = (id, listaDePrecios) => apiClient.put(`/listasdeprecios/${id}`, listaDePrecios)

//DELETE
export const eliminarListaDePreciosApi
    = (id) => apiClient.delete(`/listasdeprecios/${id}`)

    //REPORT
export const obtenerReporteListaDePreciosApi
= () => apiClient.get(`/reportelistadeprecios`, { responseType: 'blob' })