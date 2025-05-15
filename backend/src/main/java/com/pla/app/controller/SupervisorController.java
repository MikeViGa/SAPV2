package com.pla.app.controller;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.pla.app.model.Supervisor;
import com.pla.app.service.SupervisorService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import java.util.HashMap;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class SupervisorController {

	@Autowired
	private SupervisorService supervisorServicio;

	// CREATE
	@PostMapping("/supervisores/")
	public ResponseEntity<?> crearSupervisor(@Valid @RequestBody Supervisor supervisor, HttpServletRequest request) {
		try {
			supervisorServicio.crearSupervisor(supervisor);
			return ResponseEntity.status(HttpStatus.CREATED).body("Supervisor creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
	@GetMapping("/supervisores/{id}")
	public ResponseEntity<Supervisor> obtenerSupervisor(@PathVariable Long id) {
		try {
			Optional<Supervisor> supervisor = supervisorServicio.obtenerSupervisorPorId(id);
			if (supervisor.isPresent()) {
				return new ResponseEntity<>(supervisor.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
	@GetMapping("/supervisores")
	public ResponseEntity<List<Supervisor>> obtenerSupervisores() {
		List<Supervisor> supervisores = supervisorServicio.obtenerSupervisores();
		return new ResponseEntity<>(supervisores, HttpStatus.OK);
	}

	// GETALLBYNAME
	@GetMapping("/obtenersupervisornombre")
	public ResponseEntity<List<Map<String, Object>>> obtenerSupervisoresPorNombreSupervisor(
			@RequestParam String nombre) {
		try {
			List<Supervisor> supervisores = supervisorServicio.obtenerSupervisoresPorNombre(nombre);
			return new ResponseEntity<>(
					supervisores.stream().map(supervisor -> {
						Map<String, Object> map = new HashMap<>();
						map.put("id", supervisor.getId());
						map.put("nombre",
								supervisor.getNombre() + " " + supervisor.getApellidoPaterno() + " "
										+ supervisor.getApellidoMaterno());
						return map;
					}).collect(Collectors.toList()), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// DELETE
	@DeleteMapping("/supervisores/{id}")
	public ResponseEntity<?> eliminarSupervisor(@PathVariable Long id) {
		try {
			supervisorServicio.eliminarSupervisor(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el supervisor: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/supervisores/{id}")
	public ResponseEntity<?> actualizarSupervisor(@PathVariable Long id, @RequestBody Supervisor datosSupervisor) {
		try {
			Supervisor supervisorActualizado = supervisorServicio.actualizarSupervisor(datosSupervisor);
			return ResponseEntity.ok(supervisorActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el supervisor: " + e.getMessage());
		}
	}

	// REPORT
	@GetMapping("/reportesupervisores")
	public void generaReporteSupervisores(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reportesupervisores "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
			supervisorServicio.generarReporte(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}