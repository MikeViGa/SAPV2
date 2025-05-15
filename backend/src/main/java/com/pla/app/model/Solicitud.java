package com.pla.app.model;

import java.io.Serializable;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
	@Column(name = "clave_solicitud", nullable = false, updatable = false)
	private Long claveSolicitud;

	@NotNull(message = "La fecha de alta es obligatoria")
	@Column(name = "fecha_alta", nullable = false)
	private LocalDate fechaAlta;

	@NotNull(message = "La fecha de venta es obligatoria")
	@Column(name = "fecha_venta", nullable = false)
	private LocalDate fechaVenta;

	@NotNull(message = "La fecha de entrega es obligatoria")
	@Column(name = "fecha_entrega", nullable = false)
	private LocalDate fechaEntrega;

	@NotBlank(message = "La identificación es obligatoria")
	@Column(name = "identificacion", nullable = false)
	private String identificacion;

	@NotBlank(message = "La clave del paquete es obligatoria")
	@Column(name = "clave_paquete", nullable = false)
	private String clavePaquete;

	@Column(name = "valor_total", nullable = false)
    private Double valorTotal;

	@Column(name = "enganche", nullable = false)
    private Double enganche;

	@Column(name = "importe", nullable = false)
    private Double importe;

	@Column(name = "numero_pagos", nullable = false)
    private Integer numeroPagos;

	@Column(name = "id_cliente", nullable = false)
    private Integer idCliente;

	@Column(name = "id_sucursal", nullable = false)
    private Integer idSucursal;

	@Column(name = "clave_contrato", nullable = false)
    private Integer claveContrato;

	@Column(name = "estatus", nullable = false)
	private String estatus;

	@Column(name = "id_otro_supervisor", nullable = false)
    private Integer idOtroSupervisor;

	@Column(name = "comision", nullable = false)
    private Double comision;

	@OneToOne(mappedBy = "solicitud", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnore
	private Cancelacion cancelacion;

}