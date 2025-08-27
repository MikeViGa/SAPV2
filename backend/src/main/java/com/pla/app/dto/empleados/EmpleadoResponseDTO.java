package com.pla.app.dto.empleados;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EmpleadoResponseDTO {
    private Long id;
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String correo;
    private String telefono;
    private LocalDate fechaNacimiento;
    private LocalDate fechaAlta;
    private String estado;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private String creadoPor;
    private String modificadoPor;
}