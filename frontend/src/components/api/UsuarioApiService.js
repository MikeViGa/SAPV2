import { apiClient } from "./ApiClient"

//CREATE
export const crearUsuarioApi
    = (usuario) => apiClient.post(`/usuarios/`, usuario);

//READ ONE
export const obtenerUsuarioApi
    = (id) => apiClient.get(`/usuarios/${id}`)

//READ ALL
export const obtenerUsuariosApi = (page = 0, size = 50, sort) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (sort) params.append('sort', sort);
    return apiClient.get(`/usuarios?${params.toString()}`)
}

//AUTOCOMPLETE
export const obtenerUsuarioNombreApi
= (query) => apiClient.get(`/obtenerusuarionombre?nombreUsuario=${query}`);

//UPDATE
export const actualizarUsuarioApi
    = (id, usuario) => apiClient.put(`/usuarios/${id}`, usuario)

//DELETE
export const eliminarUsuarioApi
    = (id) => apiClient.delete(`/usuarios/${id}`);

//REPORT
export const obtenerReporteUsuarioApi
    = () => apiClient.get(`/reporteusuarios`, { responseType: 'blob' })

