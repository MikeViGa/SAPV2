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
	@Column(nullable = false, updatable = false)
	private Long id;

	@NotNull(message = "La fecha de cancelación es obligatoria")
	@Column(nullable = false)
	private LocalDate fechaCancelacion;

	@NotNull(message = "La descripción es obligatoria")
	@Column(nullable = false)
    private String descripcion;

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "FK_cancelacion_usuario")) 
    private Usuario usuario;

	@OneToOne(mappedBy = "cancelacion", fetch = FetchType.LAZY)
	private Solicitud solicitud;
}