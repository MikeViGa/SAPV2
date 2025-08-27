package com.pla.app.controller;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.pla.app.model.Usuario;
import com.pla.app.dto.usuarios.UsuarioListadoProjection;
import com.pla.app.dto.usuarios.UsuarioResponseDTO;
import com.pla.app.service.UsuarioService;
import com.pla.app.mapper.UsuarioMapper;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import java.util.HashMap;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioServicio;

	@Autowired
	private UsuarioMapper usuarioMapper;

	// CREATE
	@PostMapping("/usuarios/")
	public ResponseEntity<?> crearUsuario(@Valid @RequestBody Usuario usuario, HttpServletRequest request) {
		try {
			usuarioServicio.crearUsuario(usuario);
			return ResponseEntity.status(HttpStatus.CREATED).body("Usuario creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
	@GetMapping("/usuarios/{id}")
	public ResponseEntity<UsuarioResponseDTO> obtenerUsuario(@PathVariable Long id) {
		try {
			Optional<Usuario> usuario = usuarioServicio.obtenerUsuarioPorId(id);
			if (usuario.isPresent()) {
				UsuarioResponseDTO usuarioDTO = usuarioMapper.toResponseDTO(usuario.get());
				return new ResponseEntity<>(usuarioDTO, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
    @GetMapping("/usuarios")
    public ResponseEntity<Page<UsuarioResponseDTO>> obtenerUsuarios(@PageableDefault(size = 50) Pageable pageable) {
        Page<UsuarioListadoProjection> pagina = usuarioServicio.obtenerUsuariosPaginado(pageable);
        Page<UsuarioResponseDTO> respuesta = pagina.map(p -> new UsuarioResponseDTO(p.getId(), p.getNombre(), p.getRolNombre(), null, null, null, null, null));
        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

	// GETALLBYNAME
	@GetMapping("/obtenerusuarionombre")
	public ResponseEntity<List<Map<String, Object>>> obtenerUsuariosPorNombreUsuario(
			@RequestParam String nombreUsuario) {
		try {
			List<Usuario> usuarios = usuarioServicio.obtenerUsuariosPorNombreUsuario(nombreUsuario);
			return new ResponseEntity<>(
					usuarios.stream().map(usuario -> {
						Map<String, Object> map = new HashMap<>();
						map.put("id", usuario.getId());
						map.put("nombre",
								usuario.getNombre());
						return map;
					}).collect(Collectors.toList()), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// DELETE
	@DeleteMapping("/usuarios/{id}")
	public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
		try {
			usuarioServicio.eliminarUsuario(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el usuario: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/usuarios/{id}")
	public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario datosUsuario) {
		try {
			Usuario usuarioActualizado = usuarioServicio.actualizarUsuario(datosUsuario);
			return ResponseEntity.ok(usuarioActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el usuario: " + e.getMessage());
		}
	}

	// RESTAURAR (reactivar usuario eliminado)
	@PutMapping("/usuarios/{id}/restaurar")
	public ResponseEntity<?> restaurarUsuario(@PathVariable Long id) {
		try {
			usuarioServicio.restaurarUsuario(id);
			return ResponseEntity.ok("Usuario restaurado correctamente");
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo restaurar el usuario: " + e.getMessage());
		}
	}

	// OBTENER TODOS INCLUSO INACTIVOS (para administración)
	@GetMapping("/usuarios/todos")
	public ResponseEntity<Page<UsuarioResponseDTO>> obtenerUsuariosInclusoInactivos(@PageableDefault(size = 50) Pageable pageable) {
		Page<UsuarioListadoProjection> pagina = usuarioServicio.obtenerUsuariosPaginadoInclusoInactivos(pageable);
		Page<UsuarioResponseDTO> respuesta = pagina.map(p -> new UsuarioResponseDTO(p.getId(), p.getNombre(), p.getRolNombre(), null, null, null, null, null));
		return new ResponseEntity<>(respuesta, HttpStatus.OK);
	}

	// REPORT
	@GetMapping("/reporteusuarios")
	public void generaReporteUsuarios(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reporteusuarios "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
			usuarioServicio.generarReporte(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}