package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "plazosdepago")
@Data
public class PlazoDePago implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "El nombre es obligatoria")
	@Column(name = "nombre", nullable = false)
	private String nombre;

	@OneToMany(mappedBy = "plazoDePago", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Paquete> paquetes = new ArrayList<>();

}