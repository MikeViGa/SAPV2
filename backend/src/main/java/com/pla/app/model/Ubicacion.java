package com.pla.app.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ubicaciones")
@Data
public class Ubicacion implements Serializable{
    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@Column(name = "id_solicitud", nullable = false)
	private String id_solicitud;

 	@Column(name = "observaciones", nullable = false)
	private String observaciones;

    @Column(name = "seccion", nullable = false)
	private String seccion;

    @Column(name = "coordenada", nullable = false)
	private String coordenada;

    @Column(name = "poligono", nullable = false)
	private String poligono;

	@ManyToOne
    @JoinColumn(name = "jardin_id", nullable = false)
    private Jardin jardin;
}
