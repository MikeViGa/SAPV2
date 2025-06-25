package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "periodicidad")
@Data
public class Periodicidad implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "La descripción es obligatoria")
	@Column(nullable = false)
	private String nombre;

	@OneToMany(mappedBy = "periodicidad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Paquete> paquete = new ArrayList<>();


}