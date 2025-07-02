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
import com.pla.app.model.Ubicacion;
import com.pla.app.service.UbicacionService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class UbicacionController {

	@Autowired
	private UbicacionService ubicacionServicio;

	@PostMapping("/ubicaciones/")
	public ResponseEntity<?> crearUbicacion(@Valid @RequestBody Ubicacion ubicacion) {
		try {
			ubicacionServicio.crearUbicacion(ubicacion);
			return ResponseEntity.status(HttpStatus.CREATED).body("Ubicacion creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	@GetMapping("/ubicacionesporjardin/{idJardin}")
	public ResponseEntity<List<Ubicacion>> obtenerUbicacionesPorJardin(@PathVariable Long idJardin) {
			List<Ubicacion> ubicaciones = ubicacionServicio.obtenerUbicacionesPorJardin(idJardin);
		return new ResponseEntity<>(ubicaciones, HttpStatus.OK); 
	}

	@GetMapping("/ubicaciones/{id}")
	public ResponseEntity<Ubicacion> obtenerUbicacion(@PathVariable Long id) {
		try {
			Optional<Ubicacion> ubicacion = ubicacionServicio.obtenerUbicacionPorId(id);
			if (ubicacion.isPresent()) {
				return new ResponseEntity<>(ubicacion.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/ubicaciones")
	public ResponseEntity<List<Ubicacion>> obtenerUbicaciones() {
		List<Ubicacion> ubicaciones = ubicacionServicio.obtenerUbicacionesTodos();
		return new ResponseEntity<>(ubicaciones, HttpStatus.OK);
	}

	@DeleteMapping("/ubicaciones/{id}")
	public ResponseEntity<?> Ubicacion(@PathVariable Long id) {
		try {
			ubicacionServicio.eliminarUbicacion(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el ubicacion: " + e.getMessage());
		}
	}

	@PutMapping("/ubicaciones/{id}")
	public ResponseEntity<?> actualizarUbicacion(@PathVariable Long id, @RequestBody Ubicacion datosUbicacion) {
		try {
			Ubicacion ubicacionActualizado = ubicacionServicio.actualizarUbicacion(datosUbicacion);
			return ResponseEntity.ok(ubicacionActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el ubicacion: " + e.getMessage());
		}
	}

	@GetMapping("/reporteubicaciones")
	public void generaReporteUbicaciones(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reporterols "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
					ubicacionServicio.generarReporteUbicaciones(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}