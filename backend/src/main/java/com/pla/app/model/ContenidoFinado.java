package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "contenidosfinados")
@Data
public class ContenidoFinado implements Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "El contenido es obligatorio")
	@Column(nullable = false, length = 50)
	private String contenido;

	@OneToMany(mappedBy = "contenidoFinado", cascade = CascadeType.ALL)
    private List<Finado> finados = new ArrayList<>();

	
}