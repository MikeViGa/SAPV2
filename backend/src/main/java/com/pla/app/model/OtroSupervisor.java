package com.pla.app.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.ToString;
import jakarta.persistence.*;

@Entity
@Table(name = "otrossupervisores")
@Data
@ToString(exclude = { "vendedores" })
public class OtroSupervisor implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellido_paterno", nullable = false)
    private String apellidoPaterno;

    @Column(name = "apellido_materno", nullable = false)
    private String apellidoMaterno;

    @Column(name = "calle", nullable = false)
    private String calle;

    @Column(name = "numero_exterior", nullable = false)
    private String numeroExterior;

    @Column(name = "numero_interior", nullable = false)
    private String numeroInterior;

    @Column(name = "colonia", nullable = false)
    private String colonia;

    @Column(name = "ciudad", nullable = false)
    private String ciudad;

    @Column(name = "estado", nullable = false)
    private String estado;

    @Column(name = "codigo_postal", nullable = false)
    private Long codigoPostal;

    @Column(name = "telefono1", nullable = false)
    private String telefono1;

    @Column(name = "telefono2", nullable = false)
    private String telefono2;

    @Column(name = "regimen", nullable = false)
    private String regimen;

    @Column(name = "rfc", nullable = false)
    private String rfc;

    @Column(name = "curp", nullable = false)
    private String curp;

    @Column(name = "numero_tarjeta", nullable = false)
    private String numeroTarjeta;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @Column(name = "fecha_alta", nullable = false)
    private LocalDateTime fechaAlta;

    @Column(name = "comision", nullable = false)
    private Double comision;


    @OneToMany(mappedBy = "otroSupervisor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Solicitud> solicitudes = new ArrayList<>();
}
