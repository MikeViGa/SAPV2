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
import com.pla.app.model.Solicitud;
import com.pla.app.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class SolicitudController {

	@Autowired
	private SolicitudService solicitudServicio;

	// CREATE
	@PostMapping("/solicitudes/")
	public ResponseEntity<?> crearSolicitud(@Valid @RequestBody Solicitud solicitud, HttpServletRequest request) {
		try {
			solicitudServicio.crearSolicitud(solicitud);
			return ResponseEntity.status(HttpStatus.CREATED).body("Solicitud creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
	@GetMapping("/solicitudes/{id}")
	public ResponseEntity<Solicitud> obtenerSolicitud(@PathVariable Long id) {
		try {
			Optional<Solicitud> solicitud = solicitudServicio.obtenerSolicitudPorId(id);
			if (solicitud.isPresent()) {
				return new ResponseEntity<>(solicitud.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
	@GetMapping("/solicitudes")
	public ResponseEntity<List<Solicitud>> obtenerSucursales() {
		List<Solicitud> solicitudes = solicitudServicio.obtenerSolicitudes();
		return new ResponseEntity<>(solicitudes, HttpStatus.OK);
	}

	// DELETE
	@DeleteMapping("/solicitudes/{id}")
	public ResponseEntity<?> eliminarSolicitud(@PathVariable Long id) {
		try {
			solicitudServicio.eliminarSolicitud(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el solicitud: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/solicitudes/{id}")
	public ResponseEntity<?> actualizarSolicitud(@PathVariable Long id, @RequestBody Solicitud datosSolicitud) {
		try {
			Solicitud solicitudActualizado = solicitudServicio.actualizarSolicitud(datosSolicitud);
			return ResponseEntity.ok(solicitudActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el solicitud: " + e.getMessage());
		}
	}

	// REPORT
	@GetMapping("/reportesolicitudes")
	public void generaReporteSolicitudes(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reportesolicitudes "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
					solicitudServicio.generarReporte(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}