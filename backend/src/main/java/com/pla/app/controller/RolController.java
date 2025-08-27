package com.pla.app.controller;

import java.text.SimpleDateFormat;
import java.util.List;
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
import org.springframework.web.bind.annotation.RestController;
import com.pla.app.model.Rol;
import com.pla.app.service.RolService;
import com.pla.app.dto.roles.RolResponseDTO;
import com.pla.app.mapper.RolMapper;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class RolController {

	@Autowired
	private RolService rolServicio;

	@Autowired
	private RolMapper rolMapper;

	// CREATE
	@PostMapping("/roles/")
	public ResponseEntity<?> crearRol(@Valid @RequestBody Rol rol) {
		try {
			rolServicio.crearRol(rol);
			return ResponseEntity.status(HttpStatus.CREATED).body("Rol creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
	@GetMapping("/roles/{id}")
	public ResponseEntity<RolResponseDTO> obtenerRol(@PathVariable Long id) {
		try {
			Optional<Rol> rol = rolServicio.obtenerRolPorId(id);
			if (rol.isPresent()) {
				RolResponseDTO rolDTO = rolMapper.toResponseDTO(rol.get());
				return new ResponseEntity<>(rolDTO, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
	@GetMapping("/roles")
	public ResponseEntity<List<RolResponseDTO>> obtenerRoles() {
		List<Rol> roles = rolServicio.obtenerRolesTodos();
		List<RolResponseDTO> rolesDTO = roles.stream()
				.map(rolMapper::toResponseDTO)
				.collect(Collectors.toList());
		return new ResponseEntity<>(rolesDTO, HttpStatus.OK);
	}

	// DELETE
	@DeleteMapping("/roles/{id}")
	public ResponseEntity<?> eliminarRol(@PathVariable Long id) {
		try {
			rolServicio.eliminarRol(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el rol: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/roles/{id}")
	public ResponseEntity<?> actualizarRol(@PathVariable Long id, @RequestBody Rol datosRol) {
		try {
			Rol rolActualizado = rolServicio.actualizarRol(datosRol);
			return ResponseEntity.ok(rolActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el rol: " + e.getMessage());
		}
	}

	// RESTAURAR (reactivar rol eliminado)
	@PutMapping("/roles/{id}/restaurar")
	public ResponseEntity<?> restaurarRol(@PathVariable Long id) {
		try {
			rolServicio.restaurarRol(id);
			return ResponseEntity.ok("Rol restaurado correctamente");
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo restaurar el rol: " + e.getMessage());
		}
	}

	// OBTENER TODOS INCLUSO INACTIVOS (para administración)
	@GetMapping("/roles/todos")
	public ResponseEntity<List<RolResponseDTO>> obtenerRolesInclusoInactivos() {
		List<Rol> roles = rolServicio.obtenerRolesTodosInclusoInactivos();
		List<RolResponseDTO> rolesDTO = roles.stream()
				.map(rolMapper::toResponseDTO)
				.collect(Collectors.toList());
		return new ResponseEntity<>(rolesDTO, HttpStatus.OK);
	}

	// REPORT
	@GetMapping("/reporteroles")
	public void generaReporteRoles(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reporterols "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
			rolServicio.generarReporteRoles(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}