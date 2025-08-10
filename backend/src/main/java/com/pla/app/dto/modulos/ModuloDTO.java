package com.pla.app.dto.modulos;

import lombok.Data;

@Data
public class ModuloDTO {
    private Long id;
    private String nombre;
    private String ruta;
    private String icono;
    private Long orden;
    private Boolean visible;
    private Long superModuloId;
    private SuperModuloDTO superModulo; // Add this
    
    @Data
    public static class SuperModuloDTO {
        private Long id;
        private String nombre;
    }
}