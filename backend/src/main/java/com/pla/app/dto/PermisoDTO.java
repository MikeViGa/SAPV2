package com.pla.app.dto;

import lombok.Data;

@Data
public class PermisoDTO {
    private Long id;
    private String nombre;
    private boolean assigned;
    private Long moduloId;

    // Constructor
    public PermisoDTO(Long id, String nombre, boolean assigned) {
        this.id = id;
        this.nombre = nombre;
        this.assigned = assigned;
    }
}