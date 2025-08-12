import { apiClient } from "./ApiClient";

export const obtenerEstadosCivilesApi = () => apiClient.get(`/estadosciviles`);


