package com.pla.app.model;

import java.io.Serializable;
import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "empleados")
@Data
public class Empleado implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "El nombre es obligatorio")
	@Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
	@Column(nullable = false, length = 100)
	private String nombre;

	@NotBlank(message = "El apellido paterno es obligatorio")
	@Size(max = 100, message = "El apellido paterno no puede exceder 100 caracteres")
	@Column(nullable = false, length = 100)
	private String apellidoPaterno;

	@NotBlank(message = "El apellido materno es obligatorio")
	@Size(max = 100, message = "El apellido materno no puede exceder 100 caracteres")
	@Column(nullable = false, length = 100)
	private String apellidoMaterno;

	@Email(message = "El correo debe ser válido")
	@Column(length = 100)
	private String correo;

	@Column(length = 100)
	private String telefono;

	@Past(message = "La fecha de nacimiento debe ser en el pasado")
	@NotNull(message = "La fecha de nacimiento es obligatoria")
	@Column(nullable = false)
	private LocalDate fechaNacimiento;

	@NotNull(message = "La fecha de alta es obligatoria")
	@Column(nullable = false)
	private LocalDate fechaAlta;

	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "FK_empleado_usuario"))  
    private Usuario usuario;

	@ManyToOne
    @JoinColumn(name = "sucursal_id", foreignKey = @ForeignKey(name = "FK_empleado_sucursal")) 
    private Sucursal sucursal;


}