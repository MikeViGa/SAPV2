package com.pla.app.dto.clientes;

import java.util.List;
import java.time.LocalDateTime;

import com.pla.app.dto.DomicilioResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDetailResponseDTO {
    private Long id;
    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String fechaNacimiento;
    private String rfc;
    private String fechaRegistro;
    private String ocupacion;
    private String telefono1;
    private String telefono2;
    private String regimen;
    private Long estadoCivilId;
    private String estadoCivilNombre;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private String creadoPor;
    private String modificadoPor;
    private List<DomicilioResponseDTO> domicilios;
}
