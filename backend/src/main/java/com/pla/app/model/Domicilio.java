package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;

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
	private String numero_interior;

	@NotBlank(message = "El número exterior es obligatorio")
	@Column(nullable = false, length = 100)
	private String numero_exterior;

	//@NotBlank(message = "La colonia es obligatoria")
	@Column( length = 100)
	private String colonia;

	//@NotBlank(message = "La ciudad es obligatoria")
	@Column( length = 100)
	private String ciudad;

	//@NotBlank(message = "El código postal es obligatorio")
	@Column( length = 100)
	private String codigo_postal;

	@ManyToOne
    @JoinColumn(name = "estado_id", foreignKey = @ForeignKey(name = "FK_domicilio_estado")) 
    private Estado estado;

	//@NotBlank(message = "Las entre calles son obligatorias")
	@Column
	private String entre_calles;

	@ManyToOne
    @JoinColumn(name = "cliente_id", foreignKey = @ForeignKey(name = "FK_domicilio_cliente")) 
    private Cliente cliente;
	
}