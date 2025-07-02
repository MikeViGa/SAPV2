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

 	@Column(nullable = false, length = 4000)
	private String observaciones;

    @Column(nullable = false)
	private String seccion;

    @Column(nullable = false)
	private String coordenada;

	
    @Column(nullable = false)
	private String poligono;

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jardin_id", foreignKey = @ForeignKey(name = "FK_ubicacion_jardin")) 
    private Jardin jardin;

	@OneToOne(mappedBy = "ubicacion", fetch = FetchType.LAZY)
    private Solicitud solicitud;

	@OneToMany(mappedBy = "ubicacion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Finado> productos = new ArrayList<>();


}