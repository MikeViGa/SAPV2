package com.pla.app.dto.vendedores;

import lombok.Data;

@Data
public class VendedorResponseDTO {
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
    private String fechaAlta; // dd/MM/yyyy HH:mm:ss
    private SupervisorResumenDTO supervisor;
}


