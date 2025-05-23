package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;

@Entity
@Table(name = "periodicidad")
@Data
public class Periodicidad implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "La descripción es obligatoria")
	@Column(name = "nombre", nullable = false)
	private String nombre;
}