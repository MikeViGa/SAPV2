package com.pla.app.model;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "finados")
@Data
public class Finado implements Serializable{
    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

 	@Column(nullable = false)
	private LocalDate fechaNacimiento;

    @Column(nullable = false)
	private LocalDate fechaDeceso;

    @Column(length = 100)
	private String nombre;

    @Column(length = 100)
	private String apellidoPaterno;

	@Column(length = 100)
	private String apellidoMaterno;

	@Column(length = 100)
	private String ordenInternacion;

	@Column
	private LocalDate fechaOrdenInternacion;

	@ManyToOne
    @JoinColumn(name = "ubicacion_id", foreignKey = @ForeignKey(name = "FK_finado_ubicacion")) 
    private Ubicacion ubicacion;

	@ManyToOne
    @JoinColumn(name = "contenido_finado_id", foreignKey = @ForeignKey(name = "FK_finado_contenidofinado")) 
    private ContenidoFinado contenidoFinado;


}