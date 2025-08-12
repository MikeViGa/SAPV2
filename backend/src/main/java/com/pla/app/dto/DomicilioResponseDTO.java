package com.pla.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DomicilioResponseDTO {
    private Long id;
    private String calle;
    private String numeroInterior;
    private String numeroExterior;
    private String colonia;
    private String ciudad;
    private String estado; // legacy/display
    private Long estadoId; // for preselect
    private String estadoNombre; // for display
    private String codigoPostal;
    private String entreCalles;
}