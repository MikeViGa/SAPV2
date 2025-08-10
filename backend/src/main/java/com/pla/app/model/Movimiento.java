package com.pla.app.model;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "movimientos")
@Data
public class Movimiento implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;

	@ManyToOne
    @JoinColumn(name = "tipo_movimiento_id", foreignKey = @ForeignKey(name = "FK_movimiento_tipomovimiento")) 
    private TipoMovimiento tipoMovimiento;

	@ManyToOne
    @JoinColumn(name = "solicitud_anterior_id", foreignKey = @ForeignKey(name = "FK_movimiento_solicitud_anterior")) 
    private Solicitud solicitud_anterior;

	@ManyToOne
    @JoinColumn(name = "solicitud_nueva_id", foreignKey = @ForeignKey(name = "FK_movimiento_solicitud_nueva")) 
    private Solicitud solicitud_nueva;

	@Column
	private Double porcentaje;

	@Column(nullable = false, length = 2000)
	private String observaciones;

	@Column(nullable = false)
	private Integer numeroMovimientos;

	@Column
	private Integer numeroPagosAnterior;	

	@Column
	private Double saldoPagadoAnterior;

	@Column
	private Integer numeroPagosNuevo;	

	@Column
	private Double saldoPagadoNuevo;

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "FK_movimiento_usuario")) 
    private Usuario usuario;

	//Campos para movimientos recontratacion

	@Column
	private Integer pagosADescontar;

	@Column
	private String clausulaAdicional;	
	
	//Campos para movimientos reestructura
	
	@Column
	private Integer pagosVencidos;	

	@Column
	private LocalDate fechaPagoReestructura;

	//Campos para movimientos traspaso

	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ubicacion_id", foreignKey = @ForeignKey(name = "FK_movimiento_ubicacion"))  
    private Ubicacion ubicacion;

	@Column
	private LocalDate fechaEmision;
	
	
	}