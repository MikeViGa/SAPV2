package com.pla.app.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "otrossupervisores")
@Data
//@ToString(exclude = { "vendedores" })
public class OtroSupervisor implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El apellido paterno es obligatorio")
    @Column(nullable = false, length = 100)
    private String apellidoPaterno;

    @NotBlank(message = "El apellido materno es obligatorio")
    @Column(nullable = false, length = 100)
    private String apellidoMaterno;

    @NotBlank(message = "La calle es obligatoria")
    @Column(length = 100)
    private String calle;

     @Column(length = 100)
    private String numeroExterior;

    @Column(length = 100)
    private String numeroInterior;

    @Column(length = 100)
    private String colonia;

    @NotBlank(message = "La ciudad es obligatoria")
    @Column(length = 100)
    private String ciudad;

    @Column(length = 100)
    private String estado;

    @NotBlank(message = "El codigo postal es obligatorio")
    @Column(nullable = false, length = 100)
    private String codigoPostal;

    @NotBlank(message = "El telefono es obligatorio")
    @Column(length = 100)
    private String telefono1;

    @Column(length = 100)
    private String telefono2;

    @NotBlank(message = "El regimen es obligatorio")
    @Column(nullable = false, length = 100)
    private String regimen;

    @NotBlank(message = "El rfc es obligatorio")
    @Column(nullable = false, length = 100)
    private String rfc;

    @NotBlank(message = "La curp es obligatoria")
    @Column(nullable = false, length = 100)
    private String curp;

    @NotBlank(message = "El número de tarjeta es obligatorio")
    @Column(length = 100)
    private String numeroTarjeta;

    @NotBlank(message = "La fecha de alta es obligatoria")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @Column(nullable = false)
    private LocalDateTime fechaAlta;

    @NotBlank(message = "La comisión es obligatoria")
    @Column(nullable = false)
    private Double comision;

    @OneToMany(mappedBy = "otroSupervisor", cascade = CascadeType.ALL)
    private List<Solicitud> solicitudes = new ArrayList<>();
}
