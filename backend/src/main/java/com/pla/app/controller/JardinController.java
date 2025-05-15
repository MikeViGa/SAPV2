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
import com.pla.app.model.Jardin;
import com.pla.app.service.JardinService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class JardinController {

	@Autowired
	private JardinService jardinServicio;

	// CREATE
	@PostMapping("/jardines/")
	public ResponseEntity<?> crearJardin(@Valid @RequestBody Jardin jardin) {
		try {
			jardinServicio.crearJardin(jardin);
			return ResponseEntity.status(HttpStatus.CREATED).body("Jardin creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
	@GetMapping("/jardines/{id}")
	public ResponseEntity<Jardin> obtenerJardin(@PathVariable String id) {
		try {
			Optional<Jardin> jardin = jardinServicio.obtenerJardinPorId(id);
			if (jardin.isPresent()) {
				return new ResponseEntity<>(jardin.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
	@GetMapping("/jardines")
	public ResponseEntity<List<Jardin>> obtenerJardines() {
		List<Jardin> jardines = jardinServicio.obtenerJardinesTodos();
		return new ResponseEntity<>(jardines, HttpStatus.OK);
	}

	// DELETE
	@DeleteMapping("/jardines/{id}")
	public ResponseEntity<?> eliminarJardin(@PathVariable String id) {
		try {
			jardinServicio.eliminarJardin(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el jardin: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/jardines/{id}")
	public ResponseEntity<?> actualizarJardin(@PathVariable Long id, @RequestBody Jardin datosJardin) {
		try {
			Jardin jardinActualizado = jardinServicio.actualizarJardin(datosJardin);
			return ResponseEntity.ok(jardinActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el jardin: " + e.getMessage());
		}
	}

	// REPORT
	@GetMapping("/reportejardines")
	public void generaReporteJardines(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reporterols "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
					jardinServicio.generarReporteJardines(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}