package com.pla.app.dto.sucursales;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SucursalResponseDTO {
    private Long id;
    private String nombre;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private String creadoPor;
    private String modificadoPor;
}

