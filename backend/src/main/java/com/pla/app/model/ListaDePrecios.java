package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "listasdeprecios")
@Data
public class ListaDePrecios implements Serializable {
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

	@OneToMany(mappedBy = "listaDePrecios", cascade = CascadeType.ALL)
	@JsonIgnore
    private List<Paquete> paquetes = new ArrayList<>();

}