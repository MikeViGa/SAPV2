package com.pla.app.controller;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
import com.pla.app.model.Cliente;
import com.pla.app.dto.clientes.ClienteResponseDTO;
import com.pla.app.dto.clientes.ClienteListadoProjection;
import com.pla.app.mapper.ClienteMapper;
import com.pla.app.dto.clientes.ClienteConDomiciliosResponseDTO;
import com.pla.app.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import java.util.HashMap;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class ClienteController {
	
	@Autowired
	private ClienteService clienteServicio;

	@Autowired
	private ClienteMapper clienteMapper;

	// CREATE
	@PostMapping("/clientes/")
	public ResponseEntity<?> crearCliente(@Valid @RequestBody Cliente cliente, HttpServletRequest request) {
		try {
			clienteServicio.crearCliente(cliente);
			return ResponseEntity.status(HttpStatus.CREATED).body("Cliente creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
    @GetMapping("/clientes/{id}")
    public ResponseEntity<ClienteConDomiciliosResponseDTO> obtenerCliente(@PathVariable Long id) {
        try {
            Optional<Cliente> cliente = clienteServicio.obtenerClientePorId(id);
            if (cliente.isPresent()) {
                return new ResponseEntity<>(clienteMapper.toConDomiciliosResponseDTO(cliente.get()), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

	// READ ALL
    @GetMapping("/clientes")
    public ResponseEntity<Page<ClienteResponseDTO>> obtenerClientes(@PageableDefault(size = 50) Pageable pageable) {
            Page<ClienteListadoProjection> pagina = clienteServicio.obtenerClientesPaginado(pageable);
            Page<ClienteResponseDTO> respuesta = pagina.map(p -> {
                ClienteResponseDTO dto = new ClienteResponseDTO();
                dto.setId(p.getId());
                dto.setNombre(p.getNombre());
                dto.setApellidoPaterno(p.getApellidoPaterno());
                dto.setApellidoMaterno(p.getApellidoMaterno());
                dto.setFechaNacimiento(p.getFechaNacimiento() != null ? new java.text.SimpleDateFormat("dd/MM/yyyy").format(p.getFechaNacimiento()) : null);
                dto.setRfc(p.getRfc());
                dto.setFechaRegistro(p.getFechaRegistro() != null ? p.getFechaRegistro().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")) : null);
                dto.setOcupacion(p.getOcupacion());
                dto.setTelefono1(p.getTelefono1());
                dto.setTelefono2(p.getTelefono2());
                dto.setRegimen(p.getRegimen());
                dto.setEstadoCivilNombre(p.getEstadoCivilNombre());
                dto.setCantidadDomicilios(p.getCantidadDomicilios() != null ? p.getCantidadDomicilios().intValue() : 0);
                return dto;
            });
            return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

/* 
	@GetMapping("/obtenercoloniasclientes")
	public ResponseEntity<List<String>> obtenerColoniasClientes() {
			List<String> colonias = clienteServicio.obtenerColoniasClientes();
			return new ResponseEntity<>(colonias, HttpStatus.OK);
	}
*/
	// GETALLBYNAME
	@GetMapping("/obtenerclientenombre")
	public ResponseEntity<List<Map<String, Object>>> obtenerClientesPorNombreCliente(@RequestParam String nombre) {
		try {
			List<Cliente> clientes = clienteServicio.obtenerClientesPorNombre(nombre);
			return new ResponseEntity<>(
				clientes.stream().map(cliente -> {
						Map<String, Object> map = new HashMap<>();
						map.put("id", cliente.getId());
						map.put("nombre",
						cliente.getNombre() + " " + cliente.getApellidoPaterno() + " " + cliente.getApellidoMaterno());
						return map;
					}).collect(Collectors.toList()), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// DELETE
	@DeleteMapping("/clientes/{id}")
	public ResponseEntity<?> eliminarCliente(@PathVariable Long id) {
		try {
			clienteServicio.eliminarCliente(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("No se pudo eliminar el cliente: "+e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/clientes/{id}")
	public ResponseEntity<?> actualizarCliente(@PathVariable Long id, @RequestBody Cliente datosCliente) {
		try {
			Cliente clienteActualizado = clienteServicio.actualizarCliente(datosCliente);
			return ResponseEntity.ok(clienteActualizado);
		} catch (Exception e) {
			return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("No se pudo actualizar el cliente: "+ e.getMessage());
		}
	}

	// REPORT
	@GetMapping("/reporteclientes")
	public void generaReporteClientes(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reporteclientes "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
					clienteServicio.generarReporteClientes(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	

	@GetMapping("/reporteclientesporfechas/{fechaInicial}/{fechaFinal}")
	//@CrossOrigin(origins = "http://localhost:3000", exposedHeaders = "Content-Disposition")
	public void generaReporteClientesPorFechas(@PathVariable String fechaInicial, @PathVariable String fechaFinal, HttpServletResponse response) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			
			String inicio = LocalDateTime.parse(fechaInicial, DateTimeFormatter.ISO_DATE_TIME).format(formatter);
			String fin = LocalDateTime.parse(fechaFinal, DateTimeFormatter.ISO_DATE_TIME).format(formatter);

			response.addHeader("content-disposition", "attachment; filename=reporteclientes "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
					clienteServicio.generarReporteClientesPorFechas(inicio, fin, response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
/* 
	@GetMapping("/reporteclientesporcolonia/{colonia}")
	//@CrossOrigin(origins = "http://localhost:3000", exposedHeaders = "Content-Disposition")
	public void generaReporteClientesPorColonia(@PathVariable String colonia, HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reporteclientes "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
					clienteServicio.generarReporteClientesPorColonia(colonia, response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
		*/
}