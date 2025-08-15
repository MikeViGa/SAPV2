package com.pla.app.model;

import lombok.Data;
import lombok.ToString;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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

    @Column(length = 100)
    private String nombre;
   
    @Column(length = 100)
    private String apellidoPaterno;

    @Column(length = 100)
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

   @Column(length = 100)
    private String regimen;

    @Column(length = 100)
    private String rfc;

    @Column(length = 100)
    private String curp;
   
    @Column(length = 100)
    private String numeroTarjeta;

    @NotBlank(message = "La fecha de alta es obligatoria")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @Column(nullable = false)
    private LocalDateTime fechaAlta;

    @OneToMany(mappedBy = "vendedor", cascade = CascadeType.ALL)
    @JsonIgnore
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