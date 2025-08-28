package com.pla.app.dto.listasprecios;

import lombok.Data;

@Data
public class ListaDePreciosResponseDTO {
    private Long id;
    private String clave;
    private String nombre;
    private Boolean activo;
}


