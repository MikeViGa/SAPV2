package com.pla.app.dto.paquetes;

import lombok.Data;
import java.io.Serializable;

@Data
public class PaqueteResponseDTO implements Serializable {
    private Long id;
    private String clave;
    private Long servicios;
    private Long numeroPagos;
    private Double valorTotal;
    private Double enganche;
    private Double importe;
    private Long bovedas;
    private Long gavetas;
    
    // Datos simplificados de las relaciones
    private PlazoDePagoSimpleDTO plazoDePago;
    private ListaDePreciosSimpleDTO listaDePrecios;
    private PeriodicidadSimpleDTO periodicidad;
    private AtaudSimpleDTO ataud;
    
    @Data
    public static class PlazoDePagoSimpleDTO {
        private Long id;
        private String nombre;
    }
    
    @Data
    public static class ListaDePreciosSimpleDTO {
        private Long id;
        private String nombre;
    }
    
    @Data
    public static class PeriodicidadSimpleDTO {
        private Long id;
        private String nombre;
    }
    
    @Data
    public static class AtaudSimpleDTO {
        private Long id;
        private String descripcion;
    }
}

