package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pla.app.audit.Auditable;

@Entity
@Table(name = "roles")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(exclude = { "permisos" })
public class Rol extends Auditable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;
	
	@NotBlank(message = "El nombre es obligatorio")
	@Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
	@Column(nullable = false, length = 100, unique = true)
	private String nombre;

	@Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
	private Boolean activo = true;

	@OneToMany(mappedBy = "rol", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Permiso> permisos= new ArrayList<>();

    @OneToMany(mappedBy = "rol", cascade = CascadeType.ALL)
	@JsonIgnore
    private List<Usuario> usuarios = new ArrayList<>();
	}