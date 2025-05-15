package com.pla.app.model;

import lombok.Data;
import lombok.ToString;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pla.app.dto.ClaveSupervisadoDTO;
import java.io.Serializable;

@Entity
@Table(name = "vendedores")
@Data
@ToString(exclude = { "supervisados" })
public class Vendedor implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
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
    private Integer codigoPostal;

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

    @ManyToOne
    @JoinColumn(name = "supervendedor_id")
    private Vendedor superVendedor;

    @OneToMany(mappedBy = "superVendedor", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Vendedor> supervisados;

    @ManyToOne
    @JoinColumn(name = "supervisor_id")
    private Supervisor supervisor;

    @Transient
    private Long idSupervisor;

    @Transient
    private List<ClaveSupervisadoDTO> clavesSupervisados;
}