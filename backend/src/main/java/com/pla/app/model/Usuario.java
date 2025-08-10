package com.pla.app.model;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "El nombre de usuario es obligatorio")
	@Size(min = 4, max = 50, message = "El nombre de usuario debe tener entre 4 y 50 caracteres")
	@Column(nullable = false, length = 100)
	private String nombre;

	@NotBlank(message = "La contraseña es obligatoria")
	@Column(nullable = false)
	private String contrasena;

	@OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
	@JsonIgnore
    private List<Cancelacion> cancelaciones = new ArrayList<>();

	@ManyToOne
    @JoinColumn(name = "rol_id", foreignKey = @ForeignKey(name = "FK_usuario_rol")) 
    private Rol rol;

	@OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
	@JsonIgnore
    private List<Solicitud> solicitudes = new ArrayList<>();

	@OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
	@JsonIgnore
    private Empleado empleado;

	@OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
	@JsonIgnore
    private List<Movimiento> movimientos = new ArrayList<>();
	
}