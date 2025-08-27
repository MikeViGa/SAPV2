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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.pla.app.model.Vendedor;
import com.pla.app.dto.vendedores.VendedorResponseDTO;

import com.pla.app.mapper.VendedorMapper;
import com.pla.app.service.VendedorService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import java.util.HashMap;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class VendedorController {

	@Autowired
	private VendedorService vendedorServicio;

	@Autowired
	private VendedorMapper vendedorMapper;

	// CREATE
	@PostMapping("/vendedores/")
	public ResponseEntity<?> crearVendedor(@Valid @RequestBody Vendedor vendedor, HttpServletRequest request) {
		try {
			vendedorServicio.crearVendedor(vendedor);
			return ResponseEntity.status(HttpStatus.CREATED).body("Vendedor creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
    @GetMapping("/vendedores/{id}")
    public ResponseEntity<VendedorResponseDTO> obtenerVendedor(@PathVariable Long id) {
		try {
			Optional<Vendedor> vendedor = vendedorServicio.obtenerVendedorPorId(id);
			if (vendedor.isPresent()) {
                return new ResponseEntity<>(vendedorMapper.toResponseDTO(vendedor.get()), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
    @GetMapping("/vendedores")
    public ResponseEntity<List<VendedorResponseDTO>> obtenerVendedores() {
        List<Vendedor> vendedores = vendedorServicio.obtenerVendedores();
        List<VendedorResponseDTO> dtos = vendedores.stream()
            .map(vendedorMapper::toResponseDTO)
            .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
	}

    @GetMapping("/vendedores/page")
    public ResponseEntity<Page<com.pla.app.dto.vendedores.VendedorListRowDTO>> obtenerVendedoresPaginados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<com.pla.app.dto.vendedores.VendedorListRowDTO> result = vendedorServicio.obtenerVendedoresPaginados(pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

	@GetMapping("/obtenersupervisadosporvendedor")
    public ResponseEntity<List<VendedorResponseDTO>> obtenerSupervisadosPorVendedor(@RequestParam Long idVendedor) {
        List<Vendedor> vendedores = vendedorServicio.obtenerSupervisadosPorVendedor(idVendedor);
        List<VendedorResponseDTO> dtos = vendedores.stream()
            .map(vendedorMapper::toResponseDTO)
            .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
	}

	// GETALLBYNAME
	@GetMapping("/obtenervendedornombre")
	public ResponseEntity<List<Map<String, Object>>> obtenerVendedoresPorNombreVendedor(@RequestParam String nombre) {
		try {
			List<Vendedor> vendedores = vendedorServicio.obtenerVendedoresPorNombre(nombre);
			return new ResponseEntity<>(
					vendedores.stream().map(vendedor -> {
						Map<String, Object> map = new HashMap<>();
						map.put("id", vendedor.getId());
						map.put("nombre",
								vendedor.getNombre() + " " + vendedor.getApellidoPaterno() + " "
										+ vendedor.getApellidoMaterno());
						return map;
					}).collect(Collectors.toList()), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// DELETE
	@DeleteMapping("/vendedores/{id}")
	public ResponseEntity<?> eliminarVendedor(@PathVariable Long id) {
		try {
			vendedorServicio.eliminarVendedor(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el vendedor: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/vendedores/{id}")
	public ResponseEntity<?> actualizarVendedor(@PathVariable Long id, @RequestBody Vendedor datosVendedor) {
		try {
			Vendedor vendedorActualizado = vendedorServicio.actualizarVendedor(datosVendedor);
			return ResponseEntity.ok(vendedorActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el vendedor: " + e.getMessage());
		}
	}

	// RESTAURAR (reactivar vendedor eliminado)
	@PutMapping("/vendedores/{id}/restaurar")
	public ResponseEntity<?> restaurarVendedor(@PathVariable Long id) {
		try {
			vendedorServicio.restaurarVendedor(id);
			return ResponseEntity.ok("Vendedor restaurado correctamente");
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo restaurar el vendedor: " + e.getMessage());
		}
	}

	// OBTENER TODOS INCLUSO INACTIVOS (para administración)
	@GetMapping("/vendedores/todos")
	public ResponseEntity<List<VendedorResponseDTO>> obtenerVendedoresInclusoInactivos() {
		List<Vendedor> vendedores = vendedorServicio.obtenerVendedoresTodosInclusoInactivos();
		List<VendedorResponseDTO> dtos = vendedores.stream()
			.map(vendedorMapper::toResponseDTO)
			.collect(Collectors.toList());
		return new ResponseEntity<>(dtos, HttpStatus.OK);
	}

	// OBTENER TODOS PAGINADOS INCLUSO INACTIVOS (para administración)
	@GetMapping("/vendedores/todos/page")
	public ResponseEntity<Page<com.pla.app.dto.vendedores.VendedorListRowDTO>> obtenerVendedoresPaginadosInclusoInactivos(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "25") int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<com.pla.app.dto.vendedores.VendedorListRowDTO> result = vendedorServicio.obtenerVendedoresPaginadosInclusoInactivos(pageable);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	// REPORT
	@GetMapping("/reportesvendedores")
	public void generaReporteVendedores(HttpServletResponse response, @RequestParam String tipoReporte) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reportevendedores "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
			if (tipoReporte.equals("vendedores"))
				vendedorServicio.generarReporteVendedores(response.getOutputStream());
			else if (tipoReporte.equals("vendedoressubvendedores"))
				vendedorServicio.generarReporteVendedoresSubvendedores(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}