package com.pla.app.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "tiposmovimientos")
@Data
public class TipoMovimiento implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "El tipo es obligatorio")
	@Column(nullable = false, length = 100)
	private String nombre;

	@OneToMany(mappedBy = "tipoMovimiento", cascade = CascadeType.ALL)
    private List<Movimiento> movimientos = new ArrayList<>();

}