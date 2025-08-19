package com.pla.app.dto.solicitudes;

import java.io.Serializable;
import lombok.Data;

@Data
public class SolicitudResponseDTO implements Serializable {
    private Long id;
    private String claveSolicitud;
    private Long claveContrato;
    private Double comision;
    private String fechaAlta;
    private String fechaVenta;
    private String fechaVencimiento;
    private String fechaEntrega;

    private String vendedorNombre;
    private String clienteNombre;
    private String sucursalNombre;
    private String paqueteClave;

    // Beneficiarios
    private String nombreBeneficiario1;
    private String apellidoPaternoBeneficiario1;
    private String apellidoMaternoBeneficiario1;
    private String nombreBeneficiario2;
    private String apellidoPaternoBeneficiario2;
    private String apellidoMaternoBeneficiario2;
    private String nombreBeneficiario3;
    private String apellidoPaternoBeneficiario3;
    private String apellidoMaternoBeneficiario3;
}


