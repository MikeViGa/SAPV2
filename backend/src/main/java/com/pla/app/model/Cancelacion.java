package com.pla.app.model;

import java.io.Serializable;
import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "cancelaciones")
@Data
public class Cancelacion implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@NotNull(message = "La fecha de alta es obligatoria")
	@Column(name = "fecha_cancelacion", nullable = false)
	private LocalDate fechaCancelacion;

	@Column(name = "usuario_id", nullable = false)
    private Integer idUsuario;

	@Column(name = "descripcion", nullable = false)
    private String descripcion;

	@OneToOne
    @JoinColumn(name = "solicitud_id", nullable = false)
    private Solicitud solicitud;

}