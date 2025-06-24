package com.pla.app.model;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "sucursales")
@Data
public class Sucursal implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "El nombre es obligatorio")
	@Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
	@Column(nullable = false)
	private String nombre;

	@OneToOne(mappedBy = "sucursal", fetch = FetchType.LAZY)
    private Solicitud solicitud;

}