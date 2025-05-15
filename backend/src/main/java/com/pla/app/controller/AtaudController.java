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
import com.pla.app.model.Ataud;
import com.pla.app.service.AtaudService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class AtaudController {

	@Autowired
	private AtaudService ataudServicio;

	// CREATE
	@PostMapping("/ataudes/")
	public ResponseEntity<?> crearAtaud(@Valid @RequestBody Ataud ataud) {
		try {
			ataudServicio.crearAtaud(ataud);
			return ResponseEntity.status(HttpStatus.CREATED).body("Ataud creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
	@GetMapping("/ataudes/{id}")
	public ResponseEntity<Ataud> obtenerAtaud(@PathVariable Long id) {
		try {
			Optional<Ataud> ataud = ataudServicio.obtenerAtaudPorId(id);
			if (ataud.isPresent()) {
				return new ResponseEntity<>(ataud.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
	@GetMapping("/ataudes")
	public ResponseEntity<List<Ataud>> obtenerAtaudes() {
		List<Ataud> ataudes = ataudServicio.obtenerAtaudesTodos();
		return new ResponseEntity<>(ataudes, HttpStatus.OK);
	}

	// DELETE
	@DeleteMapping("/ataudes/{id}")
	public ResponseEntity<?> eliminarAtaud(@PathVariable Long id) {
		try {
			ataudServicio.eliminarAtaud(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el ataud: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/ataudes/{id}")
	public ResponseEntity<?> actualizarAtaud(@PathVariable Long id, @RequestBody Ataud datosAtaud) {
		try {
			Ataud ataudActualizado = ataudServicio.actualizarAtaud(datosAtaud);
			return ResponseEntity.ok(ataudActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el ataud: " + e.getMessage());
		}
	}

	// REPORT
	@GetMapping("/reporteataudes")
	public void generaReporteAtaudes(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reporterols "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
			ataudServicio.generarReporteAtaudes(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}