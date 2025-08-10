package com.pla.app.model;

import java.io.Serializable;
import java.time.LocalDate;
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

	@ManyToOne
    @JoinColumn(name = "tipo_cancelacion_id", foreignKey = @ForeignKey(name = "FK_cancelacion_tipocancelacion")) 
    private TipoCancelacion tipoCancelacion;

	private LocalDate fechaCancelacion;

	@Column(length = 500)
    private String descripcion;

	@ManyToOne
    @JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "FK_cancelacion_usuario")) 
    private Usuario usuario;

	@OneToOne(mappedBy = "cancelacion")
	private Solicitud solicitud;
}