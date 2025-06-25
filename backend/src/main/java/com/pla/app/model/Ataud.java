package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;

@Entity
@Table(name = "ataudes")
@Data
public class Ataud implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "La descripción es obligatoria")
	@Column(nullable = false)
	private String descripcion;

	@OneToOne(mappedBy = "ataud", fetch = FetchType.LAZY)
    private Paquete paquete;

}