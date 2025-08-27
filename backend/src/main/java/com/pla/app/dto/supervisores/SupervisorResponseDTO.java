package com.pla.app.dto.supervisores;

import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class SupervisorResponseDTO {
    private Long id;
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String calle;
    private String numeroExterior;
    private String numeroInterior;
    private String colonia;
    private String ciudad;
    private String estado;
    private String codigoPostal;
    private String telefono1;
    private String telefono2;
    private String regimen;
    private String rfc;
    private String curp;
    private String numeroTarjeta;
    
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime fechaAlta;
    
    private Double comision;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private String creadoPor;
    private String modificadoPor;
}


