
import { apiClient } from "./ApiClient"

// READ
export const obtenerPeriodicidadApi
	= (id) => apiClient.get(`/periodicidad/${id}`)

export const obtenerPeriodicidadesApi
	= () => apiClient.get(`/periodicidad`)



