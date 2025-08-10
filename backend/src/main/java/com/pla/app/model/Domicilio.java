package com.pla.app.model;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "domicilios")
@Data
public class Domicilio implements Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	//@NotBlank(message = "La calle es obligatoria")
	@Column( length = 100)
	private String calle;

	//@NotBlank(message = "El número interior es obligatorio")
	@Column( length = 100)
	private String numeroInterior;

	//@NotBlank(message = "El número exterior es obligatorio")
	@Column(length = 100)
	private String numeroExterior;

	//@NotBlank(message = "La colonia es obligatoria")
	@Column( length = 100)
	private String colonia;

	//@NotBlank(message = "La ciudad es obligatoria")
	@Column( length = 100)
	private String ciudad;

	//@NotBlank(message = "El código postal es obligatorio")
	@Column( length = 100)
	private String codigoPostal;

	@ManyToOne
	@JsonIgnore
    @JoinColumn(name = "estado_id", foreignKey = @ForeignKey(name = "FK_domicilio_estado")) 
    private Estado estado;

	//@NotBlank(message = "Las entre calles son obligatorias")
	@Column
	private String entreCalles;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "cliente_id", foreignKey = @ForeignKey(name = "FK_domicilio_cliente")) 
    private Cliente cliente;
	
}