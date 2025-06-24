package com.pla.app.model;

import lombok.Data;
import lombok.ToString;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    @Column(nullable = false, updatable = false)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellidoPaterno;

    @Column(nullable = false)
    private String apellidoMaterno;

    @Column(nullable = false)
    private String calle;

    @Column(nullable = false)
    private String numeroExterior;

    @Column(nullable = false)
    private String numeroInterior;

    @Column(nullable = false)
    private String colonia;

    @Column(nullable = false)
    private String ciudad;

    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private Long codigoPostal;

    @Column(nullable = false)
    private String telefono1;

    @Column(nullable = false)
    private String telefono2;

    @Column(nullable = false)
    private String regimen;

    @Column(nullable = false)
    private String rfc;

    @Column(nullable = false)
    private String curp;

    @Column(nullable = false)
    private String numeroTarjeta;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @Column(nullable = false)
    private LocalDateTime fechaAlta;

    @OneToMany(mappedBy = "vendedor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Solicitud> solicitudes = new ArrayList<>();
 
    @ManyToOne
    @JoinColumn(name = "supervendedor_id", foreignKey = @ForeignKey(name = "FK_vendedor_vendedor")) 
    private Vendedor superVendedor;

    @OneToMany(mappedBy = "superVendedor", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Vendedor> supervisados;

    @ManyToOne
    @JoinColumn(name = "supervisor_id", foreignKey = @ForeignKey(name = "FK_vendedor_supervisor")) 
    private Supervisor supervisor;

    @Transient
    private Long idSupervisor;

    @Transient
    private List<ClaveSupervisadoDTO> clavesSupervisados;
}