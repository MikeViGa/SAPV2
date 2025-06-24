package com.pla.app.model;

import java.io.Serializable;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "solicitudes")
@Data
public class Solicitud implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	
	@NotNull(message = "La fecha de alta es obligatoria")
	@Column(nullable = false)
	private LocalDate fechaAlta;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(foreignKey = @ForeignKey(name = "FK_solicitud_vendedor")) 
	private Vendedor vendedor;

	@Column(nullable = false)
    private Double comision;

	@NotBlank(message = "La identificación es obligatoria")
	@Column(nullable = false)
	private String identificacion;

	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(foreignKey = @ForeignKey(name = "FK_solicitud_paquete"))  
	private Paquete paquete;

	@NotNull(message = "La fecha de vencimiento es obligatoria")
	@Column(nullable = false)
	private LocalDate fechaVencimiento;

	@NotNull(message = "La fecha de venta es obligatoria")
	@Column(nullable = false)
	private LocalDate fechaVenta;

	@NotNull(message = "La fecha de entrega es obligatoria")
	@Column(nullable = false)
	private LocalDate fechaEntrega;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(foreignKey = @ForeignKey(name = "FK_solicitud_cliente")) 
	private Cliente cliente;

	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(foreignKey = @ForeignKey(name = "FK_solicitud_sucursal"))  
	private Sucursal sucursal;
	
	@Column(nullable = false)
    private Long claveContrato;

	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(foreignKey = @ForeignKey(name = "FK_solicitud_cancelacion"))  
	private Cancelacion cancelacion;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "otro_supervisor_id", foreignKey = @ForeignKey(name = "FK_solicitud_otrosupervisor")) 
    private OtroSupervisor otroSupervisor;

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "FK_solicitud_usuario")) 
    private Usuario usuario;


}