package com.pla.app.controller;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;
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
import com.pla.app.model.ListaDePrecios;
import com.pla.app.service.ListaDePreciosService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class ListaDePreciosController {

	@Autowired
	private ListaDePreciosService listaDePreciosServicio;

	// CREATE
	@PostMapping("/listasdeprecios/")
	public ResponseEntity<?> crearListaDePrecios(@Valid @RequestBody ListaDePrecios listaDePrecios) {
		try {
			listaDePreciosServicio.crearListaDePrecios(listaDePrecios);
			return ResponseEntity.status(HttpStatus.CREATED).body("Lista creada satisfactoriamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	// READ 1
	@GetMapping("/listasdeprecios/{id}")
	public ResponseEntity<ListaDePrecios> obtenerListaDePrecios(@PathVariable Long id) {
		try {
			Optional<ListaDePrecios> listaDePrecios = listaDePreciosServicio.obtenerListaDePreciosPorId(id);
			if (listaDePrecios.isPresent()) {
				return new ResponseEntity<>(listaDePrecios.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// READ ALL
	@GetMapping("/listasdeprecios")
	public ResponseEntity<List<ListaDePrecios>> obtenerListasDePrecios() {
		List<ListaDePrecios> listasDePrecios = listaDePreciosServicio.obtenerListasDePreciosTodos();
		return new ResponseEntity<>(listasDePrecios, HttpStatus.OK);
	}

	// DELETE
	@DeleteMapping("/listasdeprecios/{id}")
	public ResponseEntity<?> eliminarListaDePrecios(@PathVariable Long id) {
		try {
			listaDePreciosServicio.eliminarListaDePrecios(id);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("No se pudo eliminar la lista: " + e.getMessage());
		}
	}

	// UPDATE
	@PutMapping("/listasdeprecios/{id}")
	public ResponseEntity<?> actualizarListaDePrecios(@PathVariable String id,
			@RequestBody ListaDePrecios datosListaDePrecios) {
		try {
			ListaDePrecios listaDePreciosActualizado = listaDePreciosServicio
					.actualizarListaDePrecios(datosListaDePrecios);
			return ResponseEntity.ok(listaDePreciosActualizado);
		} catch (Exception e) {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("No se pudo actualizar la lista: " + e.getMessage());
		}
	}

	// REPORT
	@GetMapping("/reportelistasdeprecios")
	public void generaReporteListasDePrecios(HttpServletResponse response) {
		try {
			response.setContentType("application/pdf");
			response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
			response.addHeader("content-disposition", "attachment; filename=reporterols "
					+ new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
			listaDePreciosServicio.generarReporteListasDePrecios(response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}