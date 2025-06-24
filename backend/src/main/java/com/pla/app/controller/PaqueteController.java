package com.pla.app.controller;

import java.text.SimpleDateFormat;
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
import com.pla.app.model.Paquete;
import com.pla.app.service.PaqueteService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class PaqueteController {

	@Autowired
	private PaqueteService paqueteServicio;

	// CREATE
	@PostMapping("/paquetes/")
	public ResponseEntity<?> crearPaquete(@Valid @RequestBody Paquete paquete) {
		try {
			paqueteServicio.crearPaquete(paquete);
			return ResponseEntity.status(HttpStatus.CREATED).body("Paquete creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
	@GetMapping("/paquetes/{id}")
	public ResponseEntity<Paquete> obtenerPaquete(@PathVariable Long id) {
		try {
			Optional<Paquete> paquete = paqueteServicio.obtenerPaquetePorId(id);
			if (paquete.isPresent()) {
				return new ResponseEntity<>(paquete.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
	@GetMapping("/paquetes")
	public ResponseEntity<List<Paquete>> obtenerPaquetes() {
		List<Paquete> paquetes = paqueteServicio.obtenerPaquetesTodos();
		return new ResponseEntity<>(paquetes, HttpStatus.OK);
	}

	// DELETE
	@DeleteMapping("/paquetes/{id}")
	public ResponseEntity<?> eliminarPaquete(@PathVariable Long id) {
		try {
			paqueteServicio.eliminarPaquete(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el paquete: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/paquetes/{id}")
	public ResponseEntity<?> actualizarPaquete(@PathVariable Long id, @RequestBody Paquete datosPaquete) {
		try {
			Paquete paqueteActualizado = paqueteServicio.actualizarPaquete(datosPaquete);
			return ResponseEntity.ok(paqueteActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el paquete: " + e.getMessage());
		}
	}

	// REPORT
	@GetMapping("/reportepaquetes")
	public void generaReportePaquetes(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reporterols "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
			paqueteServicio.generarReportePaquetes(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}