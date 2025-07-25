package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

	@Column(nullable = false)
	private Double porcentaje;

	@Column(nullable = false)
	private String observaciones;

	@Column(nullable = false)
	private Integer numero_movimientos;

	@Column(nullable = false)
	private Integer numero_pagos_anterior;	

	@Column(nullable = false)
	private Double saldo_pagado_anterior;

	@Column(nullable = false)
	private Integer numero_pagos_nuevo;	

	@Column(nullable = false)
	private Double saldo_pagado_nuevo;

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "FK_movimiento_usuario")) 
    private Usuario usuario;

	//Campos para movimientos recontratacion

	@Column(nullable = false)
	private Integer pagos_a_descontar;

	@Column
	private String clausula_adicional;	
	
	//Campos para movimientos reestructura
	
	@Column(nullable = false)
	private Integer pagos_vencidos;	

	@Column
	private LocalDate fecha_pago_reestructura;

	}