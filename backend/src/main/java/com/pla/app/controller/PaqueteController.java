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
import com.pla.app.model.Paquete;
import com.pla.app.service.PaqueteService;
import com.pla.app.dto.paquetes.PaqueteResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class PaqueteController {

	@Autowired
	private PaqueteService paqueteServicio;

	// CREATE
	@PostMapping("/paquetes/")
	public ResponseEntity<?> crearPaquete(@Valid @RequestBody Paquete paquete) {
		try {
			paqueteServicio.crearPaquete(paquete);
			return ResponseEntity.status(HttpStatus.CREATED).body("Paquete creado satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
	@GetMapping("/paquetes/{id}")
	public ResponseEntity<PaqueteResponseDTO> obtenerPaquete(@PathVariable Long id) {
		try {
			Optional<Paquete> paquete = paqueteServicio.obtenerPaquetePorId(id);
			if (paquete.isPresent()) {
				PaqueteResponseDTO dto = mapToDto(paquete.get());
				return new ResponseEntity<>(dto, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
	@GetMapping("/paquetes")
	public ResponseEntity<List<PaqueteResponseDTO>> obtenerPaquetes() {
		List<Paquete> paquetes = paqueteServicio.obtenerPaquetesTodos();
		List<PaqueteResponseDTO> dtos = paquetes.stream()
			.map(this::mapToDto)
			.collect(Collectors.toList());
		return new ResponseEntity<>(dtos, HttpStatus.OK);
	}

	// DELETE
	@DeleteMapping("/paquetes/{id}")
	public ResponseEntity<?> eliminarPaquete(@PathVariable Long id) {
		try {
			paqueteServicio.eliminarPaquete(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar el paquete: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/paquetes/{id}")
	public ResponseEntity<?> actualizarPaquete(@PathVariable Long id, @RequestBody Paquete datosPaquete) {
		try {
			Paquete paqueteActualizado = paqueteServicio.actualizarPaquete(datosPaquete);
			return ResponseEntity.ok(paqueteActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar el paquete: " + e.getMessage());
		}
	}

	// REPORT
	@GetMapping("/reportepaquetes")
	public void generaReportePaquetes(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reporterols "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
			paqueteServicio.generarReportePaquetes(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private PaqueteResponseDTO mapToDto(Paquete paquete) {
		PaqueteResponseDTO dto = new PaqueteResponseDTO();
		dto.setId(paquete.getId());
		dto.setClave(paquete.getClave());
		dto.setServicios(paquete.getServicios());
		dto.setNumeroPagos(paquete.getNumeroPagos());
		dto.setValorTotal(paquete.getValorTotal());
		dto.setEnganche(paquete.getEnganche());
		dto.setImporte(paquete.getImporte());
		dto.setBovedas(paquete.getBovedas());
		dto.setGavetas(paquete.getGavetas());
		
		// Mapear PlazoDePago
		if (paquete.getPlazoDePago() != null) {
			PaqueteResponseDTO.PlazoDePagoSimpleDTO plazoDto = new PaqueteResponseDTO.PlazoDePagoSimpleDTO();
			plazoDto.setId(paquete.getPlazoDePago().getId());
			plazoDto.setNombre(paquete.getPlazoDePago().getNombre());
			dto.setPlazoDePago(plazoDto);
		}
		
		// Mapear ListaDePrecios
		if (paquete.getListaDePrecios() != null) {
			PaqueteResponseDTO.ListaDePreciosSimpleDTO listaDto = new PaqueteResponseDTO.ListaDePreciosSimpleDTO();
			listaDto.setId(paquete.getListaDePrecios().getId());
			listaDto.setNombre(paquete.getListaDePrecios().getNombre());
			dto.setListaDePrecios(listaDto);
		}
		
		// Mapear Periodicidad
		if (paquete.getPeriodicidad() != null) {
			PaqueteResponseDTO.PeriodicidadSimpleDTO periodicidadDto = new PaqueteResponseDTO.PeriodicidadSimpleDTO();
			periodicidadDto.setId(paquete.getPeriodicidad().getId());
			periodicidadDto.setNombre(paquete.getPeriodicidad().getNombre());
			dto.setPeriodicidad(periodicidadDto);
		}
		
		// Mapear Ataud
		if (paquete.getAtaud() != null) {
			PaqueteResponseDTO.AtaudSimpleDTO ataudDto = new PaqueteResponseDTO.AtaudSimpleDTO();
			ataudDto.setId(paquete.getAtaud().getId());
			ataudDto.setDescripcion(paquete.getAtaud().getDescripcion());
			dto.setAtaud(ataudDto);
		}
		
		return dto;
	}
}