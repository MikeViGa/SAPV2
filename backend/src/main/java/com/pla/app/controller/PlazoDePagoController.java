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
import com.pla.app.model.PlazoDePago;
import com.pla.app.service.PlazoDePagoService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class PlazoDePagoController {

	@Autowired
	private PlazoDePagoService plazoDePagoServicio;

	// CREATE
	@PostMapping("/plazosdepago/")
	public ResponseEntity<?> crearPlazoDePago(@Valid @RequestBody PlazoDePago plazoDePago) {
		try {
			plazoDePagoServicio.crearPlazoDePago(plazoDePago);
			return ResponseEntity.status(HttpStatus.CREATED).body("PlazoDePago creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
	@GetMapping("/plazosdepago/{id}")
	public ResponseEntity<PlazoDePago> obtenerPlazoDePago(@PathVariable Long id) {
		try {
			Optional<PlazoDePago> plazoDePago = plazoDePagoServicio.obtenerPlazoDePagoPorId(id);
			if (plazoDePago.isPresent()) {
				return new ResponseEntity<>(plazoDePago.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
	@GetMapping("/plazosdepago")
	public ResponseEntity<List<PlazoDePago>> obtenerPlazosDePago() {
		List<PlazoDePago> plazosDePago = plazoDePagoServicio.obtenerPlazosDePagoTodos();
		return new ResponseEntity<>(plazosDePago, HttpStatus.OK);
	}

	// DELETE
	@DeleteMapping("/plazosdepago/{id}")
	public ResponseEntity<?> eliminarPlazoDePago(@PathVariable Long id) {
		try {
			plazoDePagoServicio.eliminarPlazoDePago(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el plazo de pago: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/plazosdepago/{id}")
	public ResponseEntity<?> actualizarPlazoDePago(@PathVariable Long id, @RequestBody PlazoDePago datosPlazoDePago) {
		try {
			PlazoDePago plazoDePagoActualizado = plazoDePagoServicio.actualizarPlazoDePago(datosPlazoDePago);
			return ResponseEntity.ok(plazoDePagoActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el plazo de pago: " + e.getMessage());
		}
	}

	// REPORT
	@GetMapping("/reporteplazosdepago")
	public void generaReportePlazosDePago(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reporterols "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
			plazoDePagoServicio.generarReportePlazosDePago(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}