package com.pla.app.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.pla.app.model.Estado;
import com.pla.app.service.EstadoService;

@RestController
public class EstadoController {

    @Autowired
    private EstadoService estadoService;

    @GetMapping("/estados")
    public ResponseEntity<List<Estado>> obtenerEstados() {
        return new ResponseEntity<>(estadoService.obtenerEstados(), HttpStatus.OK);
    }
}
