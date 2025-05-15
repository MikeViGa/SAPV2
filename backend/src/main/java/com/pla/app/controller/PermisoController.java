package com.pla.app.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.pla.app.dto.PermisoDTO;
import com.pla.app.model.Modulo;
import com.pla.app.model.Permiso;
import com.pla.app.model.Rol;
import com.pla.app.service.ModuloService;
import com.pla.app.service.PermisoService;
import com.pla.app.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
@Validated
public class PermisoController {

	@Autowired
	private PermisoService permisoServicio;
	@Autowired
	private ModuloService moduloServicio;
	@Autowired
	private RolService rolServicio;

	// READ 1
	@GetMapping("/permiso/{id}")
	public ResponseEntity<Permiso> obtenerPermiso(@PathVariable Long id) {
		try {
			Optional<Permiso> permiso = permisoServicio.obtenerPermisoPorId(id);
			if (permiso.isPresent()) {
				return new ResponseEntity<>(permiso.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
	@GetMapping("/permisos")
	public ResponseEntity<List<Permiso>> obtenerPermisos() {
		List<Permiso> permisos = permisoServicio.obtenerPermisosTodos();
		return new ResponseEntity<>(permisos, HttpStatus.OK);
	}

	@GetMapping("/obtenerpermisosrol/{id}")
	public List<Map<String, Object>> obtenerRoles(@PathVariable Long id) {
		List<Modulo> modulos = moduloServicio.getAllModulos();
		List<Permiso> permisos = permisoServicio.obtenerPermisosPorRol(id);
		List<Long> assignedModuloIds = permisos.stream()
				.map(permiso -> permiso.getModulo().getId())
				.collect(Collectors.toList());

		return modulos.stream().map(modulo -> {
			Map<String, Object> map = new HashMap<>();
			map.put("id", modulo.getId());
			map.put("nombre", modulo.getNombre());
			map.put("assigned", assignedModuloIds.contains(modulo.getId()));
			return map;
		}).collect(Collectors.toList());

	}

	@GetMapping("/obtenerpermisosrol/{rolId}/modulos")
	public ResponseEntity<List<PermisoDTO>> getModulosByRol(@PathVariable Long rolId) {
		Optional<Rol> rolOpt = rolServicio.obtenerRolPorId(rolId);
		if (!rolOpt.isPresent()) {
			return ResponseEntity.notFound().build();
		}
		List<Modulo> allModulos = moduloServicio.getAllModulos();
		List<Modulo> soloSubModulos = new ArrayList<>();
		for (Modulo modulo : allModulos) {
			if (!modulo.getRuta().equals("#"))
				soloSubModulos.add(modulo);
		}
		List<Permiso> permisos = permisoServicio.obtenerPermisosPorRol(rolOpt.get().getId());
		List<Long> assignedModuloIds = permisos.stream()
				.map(permiso -> permiso.getModulo().getId())
				.collect(Collectors.toList());
		List<PermisoDTO> modulosWithAssigned = soloSubModulos.stream()
				.map(modulo -> new PermisoDTO(
						modulo.getId(),
						modulo.getNombre(),
						assignedModuloIds.contains(modulo.getId())))
				.collect(Collectors.toList());
		return ResponseEntity.ok(modulosWithAssigned);
	}

	@PutMapping("/permisos/{rolId}")
	public ResponseEntity<Void> updateModulosByRol(@PathVariable Long rolId,
			@RequestBody List<PermisoDTO> assignments) {
		try {
			Optional<Rol> rolOpt = rolServicio.obtenerRolPorId(rolId);
			if (!rolOpt.isPresent()) {
				return ResponseEntity.notFound().build();
			}
			Rol rol = rolOpt.get();
			List<Permiso> currentPermisos = permisoServicio.obtenerPermisosPorRol(rol.getId());
			Map<Long, Permiso> permisoMap = currentPermisos.stream()
					.collect(Collectors.toMap(p -> p.getModulo().getId(), p -> p));
			for (PermisoDTO assignment : assignments) {
				Long moduloId = assignment.getModuloId();
				boolean assigned = assignment.isAssigned();
				if (assigned && !permisoMap.containsKey(moduloId)) {
					Modulo modulo = moduloServicio.obtenerModuloPorId(moduloId)
							.orElseThrow(() -> new RuntimeException("Modulo not found"));
					Permiso permiso = new Permiso();
					permiso.setRol(rol);
					permiso.setModulo(modulo);
					permisoServicio.crearPermiso(permiso);
				} else if (!assigned && permisoMap.containsKey(moduloId)) {
					permisoServicio.eliminarPermiso(permisoMap.get(moduloId).getId());
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok().build();
	}
}