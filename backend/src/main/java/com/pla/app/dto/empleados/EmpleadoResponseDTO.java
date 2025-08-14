package com.pla.app.dto.empleados;

import lombok.Data;

@Data
public class EmpleadoResponseDTO {
    private Long id;
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String correo;
    private String telefono;
    private String fechaNacimiento; // ISO yyyy-MM-dd
    private String fechaAlta;       // ISO yyyy-MM-dd
    private String estado;          // opcional, si aplica
}


