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
import com.pla.app.model.Vendedor;
import com.pla.app.dto.vendedores.VendedorResponseDTO;
import com.pla.app.dto.vendedores.SupervisorResumenDTO;
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
                return new ResponseEntity<>(mapToDto(vendedor.get()), HttpStatus.OK);
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
        List<VendedorResponseDTO> dtos = vendedores.stream().map(this::mapToDto).collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
	}

	@GetMapping("/obtenersupervisadosporvendedor")
    public ResponseEntity<List<VendedorResponseDTO>> obtenerSupervisadosPorVendedor(@RequestParam Long idVendedor) {
        List<Vendedor> vendedores = vendedorServicio.obtenerSupervisadosPorVendedor(idVendedor);
        List<VendedorResponseDTO> dtos = vendedores.stream().map(this::mapToDto).collect(Collectors.toList());
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
    private VendedorResponseDTO mapToDto(Vendedor v) {
        VendedorResponseDTO dto = new VendedorResponseDTO();
        dto.setId(v.getId());
        dto.setNombre(v.getNombre());
        dto.setApellidoPaterno(v.getApellidoPaterno());
        dto.setApellidoMaterno(v.getApellidoMaterno());
        dto.setCalle(v.getCalle());
        dto.setNumeroExterior(v.getNumeroExterior());
        dto.setNumeroInterior(v.getNumeroInterior());
        dto.setColonia(v.getColonia());
        dto.setCiudad(v.getCiudad());
        dto.setEstado(v.getEstado());
        dto.setCodigoPostal(v.getCodigoPostal());
        dto.setTelefono1(v.getTelefono1());
        dto.setTelefono2(v.getTelefono2());
        dto.setRegimen(v.getRegimen());
        dto.setRfc(v.getRfc());
        dto.setCurp(v.getCurp());
        dto.setNumeroTarjeta(v.getNumeroTarjeta());
        dto.setFechaAlta(v.getFechaAlta() != null ? v.getFechaAlta().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")) : null);
        if (v.getSupervisor() != null) {
            SupervisorResumenDTO sup = new SupervisorResumenDTO();
            sup.setId(v.getSupervisor().getId());
            sup.setNombreCompleto(v.getSupervisor().getNombre() + " " + v.getSupervisor().getApellidoPaterno() + " " + v.getSupervisor().getApellidoMaterno());
            dto.setSupervisor(sup);
        }
        return dto;
    }
}