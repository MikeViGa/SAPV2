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

    @Column(nullable = false)
	private String nombre;

    @Column(nullable = false)
	private String apellidoPaterno;

	@Column(nullable = false)
	private String apellidoMaterno;

	@Column(nullable = false)
	private String ordenInternacion;

	@Column(nullable = false)
	private LocalDate fechaOrdenInternacion;

	@Column(nullable = false)
	private String contenido;

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ubicacion_id", foreignKey = @ForeignKey(name = "FK_finado_ubicacion")) 
    private Ubicacion ubicacion;
}