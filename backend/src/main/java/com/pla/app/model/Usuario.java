package com.pla.app.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
	@Column(nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "El nombre de usuario es obligatorio")
	@Size(min = 4, max = 50, message = "El nombre de usuario debe tener entre 4 y 50 caracteres")
	@Column(nullable = false, unique = true)
	private String nombreUsuario;

	@NotBlank(message = "La contraseña es obligatoria")
	@Column(nullable = false)
	private String contrasena;

	@NotBlank(message = "La fecha de creacion es obligatoria")
	@JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
	@Column(nullable = false)
	private LocalDateTime fechaCreacion;

	@NotBlank(message = "El estado es obligatorio")
	@Column(nullable = false, unique = true)
	private String estado;

	@OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Cancelacion> cancelaciones = new ArrayList<>();

	@OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Rol> roles = new ArrayList<>();

	@OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Solicitud> solicitudes = new ArrayList<>();

	@OneToOne(mappedBy = "usuario", fetch = FetchType.LAZY)
    private Empleado empleado;

}