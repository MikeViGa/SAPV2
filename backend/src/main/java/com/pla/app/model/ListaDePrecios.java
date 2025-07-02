package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "listasdeprecios")
@Data
public class ListaDePrecios implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "La clave es obligatoria")
	@Column(nullable = false, unique = true)
	private String clave;

	@NotBlank(message = "La descripción es obligatoria")
	@Column(nullable = false)
	private String descripcion;

	@OneToMany(mappedBy = "listaDePrecios", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Paquete> paquetes = new ArrayList<>();

}