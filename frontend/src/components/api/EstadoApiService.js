import { apiClient } from "./ApiClient";

export const obtenerEstadosApi = () => apiClient.get(`/estados`);
