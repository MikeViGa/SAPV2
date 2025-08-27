
import { apiClient } from "./ApiClient"

//CREATE
export const crearVendedorApi
    = (vendedor) =>
        apiClient.post(`/vendedores/`, vendedor);

//READ 
export const obtenerVendedorApi
    = (id) => apiClient.get(`/vendedores/${id}`)

export const obtenerVendedorNombreApi
    = (query) => apiClient.get(`/obtenervendedornombre?nombre=${query}`);

export const obtenerVendedoresApi
    = () => apiClient.get(`/vendedores`)
             
export const obtenerSupervisadosPorVendedorApi
    = (idVendedor) => apiClient.get(`/obtenersupervisadosporvendedor?idVendedor=${idVendedor}`);

//UPDATE
export const actualizarVendedorApi
    = (id, vendedor) => apiClient.put(`/vendedores/${id}`, vendedor)

//DELETE (Soft Delete)
export const eliminarVendedorApi
    = (id) => apiClient.delete(`/vendedores/${id}`)

// RESTORE
export const restaurarVendedorApi
    = (id) => apiClient.put(`/vendedores/${id}/restaurar`)

// GET ALL INCLUDING INACTIVE (for admin)
export const obtenerVendedoresTodosApi
    = () => apiClient.get(`/vendedores/todos`)

//REPORT
export const obtenerReporteVendedorApi
    = (tipoReporte) => 
        apiClient.get(`reportesvendedores?tipoReporte=${tipoReporte}`, { responseType: 'blob' })

