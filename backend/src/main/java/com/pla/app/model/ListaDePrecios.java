package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;

@Entity
@Table(name = "listasdeprecios")
@Data
public class ListaDePrecios implements Serializable {
	@Id
	// @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private String id;

	@NotBlank(message = "La descripción es obligatoria")
	@Column(name = "descripcion", nullable = false)
	private String descripcion;
}