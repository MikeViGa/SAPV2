package com.pla.app.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "solicitudes")
@Data
public class Solicitud implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;

	@Column(length = 100)
    private String claveSolicitud;
	
	//@NotNull(message = "La fecha de alta es obligatoria")
	@Column
	private LocalDate fechaAlta;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(foreignKey = @ForeignKey(name = "FK_solicitud_vendedor")) 
	private Vendedor vendedor;

	@NotNull(message = "La comisión es obligatoria")
	@Column(nullable = false)
    private Double comision;

	@ManyToOne
    @JoinColumn(name = "paquete_id", foreignKey = @ForeignKey(name = "FK_solicitud_paquete")) 
    private Paquete paquete;

	@NotNull(message = "La fecha de vencimiento es obligatoria")
	@Column(nullable = false)
	private LocalDate fechaVencimiento;

	@NotNull(message = "La fecha de venta es obligatoria")
	@Column(nullable = false)
	private LocalDate fechaVenta;

	//@NotNull(message = "La fecha de entrega es obligatoria")
	@Column
	private LocalDate fechaEntrega;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(foreignKey = @ForeignKey(name = "FK_solicitud_cliente")) 
	private Cliente cliente;

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sucursal_id", foreignKey = @ForeignKey(name = "FK_solicitud_sucursal")) 
    private Sucursal sucursal;
	
	@Column(nullable = false)
    private Long claveContrato;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(foreignKey = @ForeignKey(name = "FK_solicitud_cancelacion"))  
	private Cancelacion cancelacion;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(foreignKey = @ForeignKey(name = "FK_solicitud_ubicacion"))  
	private Ubicacion ubicacion;
	
	@ManyToOne
    @JoinColumn(name = "otro_supervisor_id", foreignKey = @ForeignKey(name = "FK_solicitud_otrosupervisor")) 
    private OtroSupervisor otroSupervisor;

	@ManyToOne
    @JoinColumn(name = "tipo_identificacion_id", foreignKey = @ForeignKey(name = "FK_solicitud_tipoidentificacion")) 
    private TipoIdentificacion tipoIdentificacion;

	@ManyToOne
    @JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "FK_solicitud_usuario")) 
    private Usuario usuario;

	@OneToMany(mappedBy = "solicitud_anterior", cascade = CascadeType.ALL)
	@JsonIgnore
    private List<Movimiento> movimientos_anterior = new ArrayList<>();

	@OneToMany(mappedBy = "solicitud_nueva", cascade = CascadeType.ALL)
	@JsonIgnore
    private List<Movimiento> movimientos_nueva = new ArrayList<>();
	
	@Column(length = 100)
    private String nombreBeneficiario1;
	@Column(length = 100)
    private String apellidoPaternoBeneficiario1;
	@Column(length = 100)
    private String apellidoMaternoBeneficiario1;
	@Column(length = 100)
    private String nombreBeneficiario2;
	@Column(length = 100)
    private String apellidoPaternoBeneficiario2;
	@Column(length = 100)
    private String apellidoMaternoBeneficiario2;
	@Column(length = 100)
    private String nombreBeneficiario3;
	@Column(length = 100)
    private String apellidoPaternoBeneficiario3;
	@Column(length = 100)
    private String apellidoMaternoBeneficiario3;
}