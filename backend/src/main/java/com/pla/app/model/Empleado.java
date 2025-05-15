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
	@Column(name = "nombre", nullable = false)
	private String nombre;

	@NotBlank(message = "El apellido paterno es obligatorio")
	@Size(max = 100, message = "El apellido paterno no puede exceder 100 caracteres")
	@Column(name = "apellido_paterno", nullable = false)
	private String apellidoPaterno;

	@Size(max = 100, message = "El apellido materno no puede exceder 100 caracteres")
	@Column(name = "apellido_materno")
	private String apellidoMaterno;

	@NotBlank(message = "El correo es obligatorio")
	@Email(message = "El correo debe ser válido")
	@Column(name = "correo", nullable = false, unique = true)
	private String correo;

	@Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "El teléfono debe ser un número válido")
	@Column(name = "telefono")
	private String telefono;

	@Past(message = "La fecha de nacimiento debe ser en el pasado")
	@NotNull(message = "La fecha de nacimiento es obligatoria")
	@Column(name = "fecha_nacimiento", nullable = false)
	private LocalDate fechaNacimiento;

	@NotNull(message = "La fecha de alta es obligatoria")
	@Column(name = "fecha_alta", nullable = false)
	private LocalDate fechaAlta;

	@NotBlank(message = "El estado es obligatorio")
	@Column(name = "estado", nullable = false, unique = true)
	private String estado;
}