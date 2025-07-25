package com.pla.app.controller;

import java.sql.SQLException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.pla.app.model.Modulo;
import com.pla.app.service.ModuloService;
import jakarta.validation.Valid;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Comparator;
import java.util.Collections;

@RestController
public class ModuloController {

	@Autowired
	private ModuloService moduloServicio;

	// CREATE
	@PostMapping("/modulos/")
	public ResponseEntity<?> crearModulo(@Valid @RequestBody Modulo modulo) {
		try {
			moduloServicio.crearModulo(modulo);
			return ResponseEntity.status(HttpStatus.CREATED).body("Módulo creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	@GetMapping("/modulospermitidos/{nombreUsuario}")
	public ResponseEntity<List<Modulo>> obtenerModulosPermitidos(@PathVariable String nombreUsuario) {
		List<Modulo> modulos = moduloServicio.obtenerModulosPorNombreUsuario(nombreUsuario);
		Collections.sort(modulos, Comparator.comparing(Modulo::getOrden));
		return new ResponseEntity<>(modulos, HttpStatus.OK);
	}

	@GetMapping("/modulos")
	public ResponseEntity<List<Modulo>> obtenerModulos() {
		List<Modulo> lista = null;
		try {
			lista = moduloServicio.getAllModulos();
			return new ResponseEntity<>(lista, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// DELETE
	@DeleteMapping("/modulos/{id}")
	public ResponseEntity<?> eliminarModulo(@PathVariable Long id) {
		try {
			moduloServicio.eliminarModulo(id);
			return ResponseEntity.noContent().build();
		} catch (SQLException sqe) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el módulo: " + sqe.getMessage());
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el módulo: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/modulos/{id}")
	public ResponseEntity<?> actualizarModulo(@PathVariable Long id, @RequestBody Modulo datosModulo) {
		try {
			Modulo moduloActualizado = moduloServicio.actualizarRol(datosModulo);
			return ResponseEntity.ok(moduloActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el modulo: " + e.getMessage());
		}
	}
}