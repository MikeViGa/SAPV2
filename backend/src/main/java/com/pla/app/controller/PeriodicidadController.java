package com.pla.app.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.pla.app.model.Periodicidad;
import com.pla.app.service.PeriodicidadService;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;

@RestController
@Validated
public class PeriodicidadController {

	@Autowired
	private PeriodicidadService periodicidadServicio;

	// CREATE
	@PostMapping("/periodicidad/")
	public ResponseEntity<?> crearPeriodicidad(@Valid @RequestBody Periodicidad periodicidad) {
		try {
			periodicidadServicio.crearPeriodicidad(periodicidad);
			return ResponseEntity.status(HttpStatus.CREATED).body("Periodicidad creada satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
	@GetMapping("/periodicidad/{id}")
	public ResponseEntity<Periodicidad> obtenerPeriodicidad(@PathVariable Long id) {
		try {
			Optional<Periodicidad> periodicidad = periodicidadServicio.obtenerPeriodicidadPorId(id);
			if (periodicidad.isPresent()) {
				return new ResponseEntity<>(periodicidad.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
	@GetMapping("/periodicidad")
	public ResponseEntity<List<Periodicidad>> obtenerPeriodicidades() {
		List<Periodicidad> periodicidades = periodicidadServicio.obtenerPeriodicidadesTodas();
		return new ResponseEntity<>(periodicidades, HttpStatus.OK);
	}

	// DELETE
	@DeleteMapping("/periodicidad/{id}")
	public ResponseEntity<?> eliminarPeriodicidad(@PathVariable Long id) {
		try {
			periodicidadServicio.eliminarPeriodicidad(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar la periodicidad: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/periodicidad/{id}")
	public ResponseEntity<?> actualizarPeriodicidad(@PathVariable Long id, @RequestBody Periodicidad datosPeriodicidad) {
		try {
			Periodicidad periodicidadActualizada = periodicidadServicio.actualizarPeriodicidad(datosPeriodicidad);
			return ResponseEntity.ok(periodicidadActualizada);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar la periodicidad: " + e.getMessage());
		}
	}
}

