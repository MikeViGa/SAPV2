package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "plazosdepago")
@Data
public class PlazoDePago implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "El nombre es obligatoria")
	@Column(nullable = false, length = 100)
	private String nombre;

	@OneToMany(mappedBy = "plazoDePago", cascade = CascadeType.ALL)
	@JsonIgnore
    private List<Paquete> paquetes = new ArrayList<>();

}