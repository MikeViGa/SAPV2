package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "jardines")
@Data
public class Jardin implements Serializable{
    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "La clave es obligatoria")
	@Column(nullable = false, unique = true, length = 100)
	private String clave;

	@NotBlank(message = "El nombre es obligatorio")
	@Column(nullable = false, length = 100)
	private String nombre;

	@Column(name = "poligono", nullable = false, length = 1000)
	private String poligono;

	@Column(name = "color", nullable = false, length = 100)
	private String color;

	@OneToMany(mappedBy = "jardin", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Ubicacion> ubicaciones= new ArrayList<>();

}