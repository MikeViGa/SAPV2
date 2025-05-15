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
import com.pla.app.model.Empleado;
import com.pla.app.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Date;
import java.util.HashMap;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@Validated
public class EmpleadoController {

    @Autowired
    private EmpleadoService empleadoServicio;

    // CREATE
    @PostMapping("/empleados/")
    public ResponseEntity<?> crearEmpleado(@Valid @RequestBody Empleado empleado) {
        try {
            empleadoServicio.crearEmpleado(empleado);
            return ResponseEntity.status(HttpStatus.CREATED).body("Empleado creado satisfactoriamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // READ 1
    @GetMapping("/empleados/{id}")
    public ResponseEntity<Empleado> obtenerEmpleado(@PathVariable Long id) {
        try {
            Optional<Empleado> empleado = empleadoServicio.obtenerEmpleadoPorId(id);
            if (empleado.isPresent()) {
                return new ResponseEntity<>(empleado.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ ALL
    @GetMapping("/empleados")
    public ResponseEntity<List<Empleado>> obtenerEmpleados() {
        List<Empleado> empleados = empleadoServicio.obtenerEmpleadosTodos();
        return new ResponseEntity<>(empleados, HttpStatus.OK);
    }

    // GETALLBYNAME
    @GetMapping("/obtenerempleadonombre/{nombre}")
    public ResponseEntity<List<Map<String, Object>>> obtenerEmpleadosPorNombre(@RequestParam String nombre) {
        try {
            List<Empleado> empleados = empleadoServicio.obtenerEmpleadosPorNombre(nombre);
            return new ResponseEntity<>(
                    empleados.stream().map(empleado -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", empleado.getId());
                        map.put("nombre",
                                empleado.getNombre() + " " + empleado.getApellidoPaterno() + " "
                                        + empleado.getApellidoMaterno());
                        return map;
                    }).collect(Collectors.toList()), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // DELETE
    @DeleteMapping("/empleados/{id}")
    public ResponseEntity<?> eliminarEmpleado(@PathVariable Long id) {
        try {
            empleadoServicio.eliminarEmpleado(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("No se pudo eliminar el empleado: " + e.getMessage());
        }
    }

    // UPDATE
    @PutMapping("/empleados/{id}")
    public ResponseEntity<?> actualizarEmpleado(@PathVariable Long id, @RequestBody Empleado datosEmpleado) {
        try {
            Empleado empleadoActualizado = empleadoServicio.actualizarEmpleado(datosEmpleado);
            return ResponseEntity.ok(empleadoActualizado);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("No se pudo actualizar el empleado: " + e.getMessage());
        }
    }

    // REPORT
    @GetMapping("/reporteempleados")
    public void generaReporteEmpleado(HttpServletResponse response) {
        try {
            response.setContentType("application/pdf");
            response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
            response.addHeader("content-disposition", "attachment; filename=reporteempleados "
                    + new SimpleDateFormat("dd-MM-yyyy HH-mm-SS").format(new Date()) + ".pdf");
            empleadoServicio.generarReporteEmpleados(response.getOutputStream());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}