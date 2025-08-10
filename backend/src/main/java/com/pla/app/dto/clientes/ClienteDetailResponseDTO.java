package com.pla.app.dto.clientes;

import java.util.List;

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
    private List<DomicilioResponseDTO> domicilios;
}
