package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "estados")
@Data
public class Estado implements Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "El nombre es obligatorio")
	@Column(nullable = false, length = 100)
	private String nombre;

	@OneToMany(mappedBy = "estado", cascade = CascadeType.ALL)
    private List<Domicilio> domicilios = new ArrayList<>();


}