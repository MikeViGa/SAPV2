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
import com.pla.app.model.Sucursal;
import com.pla.app.service.SucursalService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import java.util.HashMap;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class SucursalController {

	@Autowired
	private SucursalService sucursalServicio;

	// CREATE
	@PostMapping("/sucursales/")
	public ResponseEntity<?> crearSucursal(@Valid @RequestBody Sucursal sucursal, HttpServletRequest request) {
		try {
			sucursalServicio.crearSucursal(sucursal);
			return ResponseEntity.status(HttpStatus.CREATED).body("Sucursal creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
	@GetMapping("/sucursales/{id}")
	public ResponseEntity<Sucursal> obtenerSucursal(@PathVariable Long id) {
		try {
			Optional<Sucursal> sucursal = sucursalServicio.obtenerSucursalPorId(id);
			if (sucursal.isPresent()) {
				return new ResponseEntity<>(sucursal.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
	@GetMapping("/sucursales")
	public ResponseEntity<List<Sucursal>> obtenerSucursales() {
		List<Sucursal> sucursales = sucursalServicio.obtenerSucursales();
		return new ResponseEntity<>(sucursales, HttpStatus.OK);
	}

	// GETALLBYNAME
	@GetMapping("/obtenersucursalnombre")
	public ResponseEntity<List<Map<String, Object>>> obtenerSucursalesPorNombreSucursal(@RequestParam String nombre) {
		try {
			List<Sucursal> sucursales = sucursalServicio.obtenerSucursalesPorNombre(nombre);
			return new ResponseEntity<>(
					sucursales.stream().map(sucursal -> {
						Map<String, Object> map = new HashMap<>();
						map.put("id", sucursal.getId());
						map.put("nombre",
								sucursal.getNombre());
						return map;
					}).collect(Collectors.toList()), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// DELETE
	@DeleteMapping("/sucursales/{id}")
	public ResponseEntity<?> eliminarSucursal(@PathVariable Long id) {
		try {
			sucursalServicio.eliminarSucursal(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el sucursal: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/sucursales/{id}")
	public ResponseEntity<?> actualizarSucursal(@PathVariable Long id, @RequestBody Sucursal datosSucursal) {
		try {
			Sucursal sucursalActualizado = sucursalServicio.actualizarSucursal(datosSucursal);
			return ResponseEntity.ok(sucursalActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el sucursal: " + e.getMessage());
		}
	}

	// REPORT
	@GetMapping("/reportesucursales")
	public void generaReporteSucursales(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reportesucursales "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
			sucursalServicio.generarReporte(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}