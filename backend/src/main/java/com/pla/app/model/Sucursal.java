package com.pla.app.model;

import java.util.ArrayList;
import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import jakarta.persistence.*;
import com.pla.app.audit.Auditable;

@Entity
@Table(name = "sucursales")
@Data
@EqualsAndHashCode(callSuper = true)
public class Sucursal extends Auditable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "El nombre es obligatorio")
	@Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
	@Column(nullable = false, length = 100)
	private String nombre;

	@Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
	private Boolean activo = true;

	@OneToMany(mappedBy = "sucursal", cascade = CascadeType.ALL)
    private List<Solicitud> solicitudes = new ArrayList<>();

	@OneToMany(mappedBy = "sucursal", cascade = CascadeType.ALL)
    private List<Empleado> empleados = new ArrayList<>();

}