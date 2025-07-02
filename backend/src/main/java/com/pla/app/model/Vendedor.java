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

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "El apellido paterno es obligatorio")
    @Column(nullable = false)
    private String apellidoPaterno;

    @NotBlank(message = "El apellido materno es obligatorio")
    @Column(nullable = false)
    private String apellidoMaterno;

    @NotBlank(message = "La calle es obligatoria")
    @Column(nullable = false)
    private String calle;

    @NotBlank(message = "El número exterior es obligatorio")
    @Column(nullable = false)
    private String numeroExterior;

    @Column(nullable = false)
    private String numeroInterior;

    @NotBlank(message = "La colonia es obligatoria")
    @Column(nullable = false)
    private String colonia;

    @NotBlank(message = "La ciudad es obligatoria")
    @Column(nullable = false)
    private String ciudad;

    @NotBlank(message = "El estado es obligatorio")
    @Column(nullable = false)
    private String estado;

    @NotBlank(message = "El código postal es obligatorio")
    @Column(nullable = false)
    private String codigoPostal;

    @NotBlank(message = "El teléfono es obligatorio")
    @Column(nullable = false)
    private String telefono1;

    @NotBlank(message = "El estado es obligatorio")
    @Column(nullable = false)
    private String telefono2;

    @NotBlank(message = "El régimen es obligatorio")
    @Column(nullable = false)
    private String regimen;

    @NotBlank(message = "El rfc es obligatorio")
    @Column(nullable = false)
    private String rfc;

    @NotBlank(message = "La curp es obligatoria")
    @Column(nullable = false)
    private String curp;

    @NotBlank(message = "El número tarjeta es obligatorio")
    @Column(nullable = false)
    private String numeroTarjeta;

    @NotBlank(message = "La fecha de alta es obligatoria")
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