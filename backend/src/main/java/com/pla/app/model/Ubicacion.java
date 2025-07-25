package com.pla.app.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
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

 	@Column(length = 4000)
	private String observaciones;

    @Column(nullable = false, length = 100)
	private String seccion;

    @Column(nullable = false, length = 100)
	private String coordenada;

    @Column(nullable = false, length = 1000)
	private String poligono;

	@ManyToOne
    @JoinColumn(name = "jardin_id", foreignKey = @ForeignKey(name = "FK_ubicacion_jardin")) 
    private Jardin jardin;

	@OneToOne(mappedBy = "ubicacion")
    private Solicitud solicitud;

	@OneToMany(mappedBy = "ubicacion", cascade = CascadeType.ALL)
    private List<Finado> productos = new ArrayList<>();


}