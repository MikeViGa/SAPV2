package com.pla.app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "listasdeprecios")
@Data
@SQLDelete(sql = "UPDATE listasdeprecios SET activo = false WHERE id = ?")
@SQLRestriction("activo = true")
public class ListaDePrecios implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@NotBlank(message = "La clave es obligatoria")
	@Column(nullable = false, unique = true, length = 100)
	private String clave;

	@NotBlank(message = "El nombre es obligatorio")
	@Column(nullable = false, length = 100)
	private String nombre;

	// Campo de estado para soft delete
	@Column(name = "activo", nullable = false)
	private Boolean activo = true;

	@OneToMany(mappedBy = "listaDePrecios", cascade = CascadeType.ALL)
	@JsonIgnore
    private List<Paquete> paquetes = new ArrayList<>();

}