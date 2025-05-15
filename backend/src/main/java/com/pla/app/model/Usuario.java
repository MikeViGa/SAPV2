package com.pla.app.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "El nombre de usuario es obligatorio")
	@Size(min = 4, max = 50, message = "El nombre de usuario debe tener entre 4 y 50 caracteres")
	@Column(name = "nombre_usuario", nullable = false, unique = true)
	private String nombreUsuario;

	@NotBlank(message = "La contraseña es obligatoria")
	@Column(name = "contrasena", nullable = false)
	private String contrasena;

	@JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
	@Column(name = "fecha_creacion", nullable = false)
	private LocalDateTime fechaCreacion;

	@NotBlank(message = "El estado es obligatorio")
	@Column(name = "estado", nullable = false, unique = true)
	private String estado;

	@ManyToOne
	@JoinColumn(name = "rol_id")
	private Rol rol;
}