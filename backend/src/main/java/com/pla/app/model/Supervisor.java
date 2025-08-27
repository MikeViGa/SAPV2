package com.pla.app.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.pla.app.audit.Auditable;

@Entity
@Table(name = "supervisores")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(exclude = { "vendedores" })
public class Supervisor extends Auditable {
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

    @Column(length = 100)
    private String calle;

    @Column(length = 100)
    private String numeroExterior;

    @Column(length = 100)
    private String numeroInterior;

    @Column(length = 100)
    private String colonia;

    @Column(length = 100)
    private String ciudad;

    @Column(length = 100)
    private String estado;

    @NotBlank(message = "El código postal es obligatorio")
    @Column(nullable = false, length = 100)
    private String codigoPostal;

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

    @NotBlank(message = "La CURP es obligatoria")
    @Column(nullable = false, length = 100)
    private String curp;
    
    @Column(length = 100)
    private String numeroTarjeta;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @Column(nullable = false)
    private LocalDateTime fechaAlta;

    @NotBlank(message = "La comisión es obligatoria")
    @Column(nullable = false)
    private Double comision;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean activo = true;

    @OneToMany(mappedBy = "supervisor", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Vendedor> vendedores= new ArrayList<>();
}