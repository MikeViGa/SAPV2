package com.pla.app.controller;

import java.sql.SQLException;
import java.util.List;
 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.pla.app.dto.modulos.ModuloDTO;
import com.pla.app.mapper.ModuloMapper;
import com.pla.app.model.Modulo;
import com.pla.app.repository.ModuloRepository;
import com.pla.app.service.ModuloService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Comparator;
import java.util.Collections;

@RestController
public class ModuloController {

	@Autowired
	private ModuloService moduloServicio;

	@Autowired
	private ModuloRepository moduloRepository;

	@Autowired
	private ModuloMapper moduloMapper;

	// CREATE
	@PostMapping("/modulos/")
	public ResponseEntity<ModuloDTO> crearModulo(@RequestBody ModuloDTO request) {
		Modulo modulo = new Modulo();
		modulo.setNombre(request.getNombre());
		modulo.setRuta(request.getRuta());
		modulo.setIcono(request.getIcono());
		modulo.setOrden(request.getOrden());
		modulo.setVisible(request.getVisible());

		if (request.getSuperModuloId() != null) {
			Modulo superModulo = moduloRepository.findById(request.getSuperModuloId()).get();
			modulo.setSuperModulo(superModulo);
		}
		try {
			Modulo saved = moduloServicio.crearModulo(modulo);
			return ResponseEntity.ok(moduloMapper.toResponseDTO(saved));
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/modulospermitidos/{nombreUsuario}")
	public ResponseEntity<List<Modulo>> obtenerModulosPermitidos(@PathVariable String nombreUsuario) {
		List<Modulo> modulos = moduloServicio.obtenerModulosPorNombreUsuario(nombreUsuario);
		Collections.sort(modulos, Comparator.comparing(Modulo::getOrden));
		return new ResponseEntity<>(modulos, HttpStatus.OK);
	}

	@GetMapping("/modulos")
	public ResponseEntity<List<ModuloDTO>> obtenerModulos() {
        return ResponseEntity.ok(moduloServicio.getAllModules());
    }

	// DELETE
	@DeleteMapping("/modulos/{id}")
	public ResponseEntity<?> eliminarModulo(@PathVariable Long id) {
		try {
			moduloServicio.eliminarModulo(id);
			return ResponseEntity.noContent().build();
		} catch (SQLException sqe) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el módulo: " + sqe.getMessage());
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el módulo: " + e.getMessage());
		}
	}

	// UPDATE
    @PutMapping("/modulos/{id}")
    public ResponseEntity<?> actualizarModulo(@PathVariable Long id, @RequestBody ModuloDTO request) {
        try {
            Modulo modulo = new Modulo();
            modulo.setId(id);
            modulo.setNombre(request.getNombre());
            modulo.setRuta(request.getRuta());
            modulo.setIcono(request.getIcono());
            modulo.setOrden(request.getOrden());
            modulo.setVisible(request.getVisible());

            if (request.getSuperModuloId() != null) {
                Modulo superModulo = moduloRepository.findById(request.getSuperModuloId()).orElse(null);
                modulo.setSuperModulo(superModulo);
            } else {
                modulo.setSuperModulo(null);
            }

            Modulo moduloActualizado = moduloServicio.actualizarModulo(modulo);
            return ResponseEntity.ok(moduloMapper.toResponseDTO(moduloActualizado));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No se pudo actualizar el modulo: " + e.getMessage());
        }
    }
}