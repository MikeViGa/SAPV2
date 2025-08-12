package com.pla.app.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.pla.app.model.EstadoCivil;
import com.pla.app.service.EstadoCivilService;

@RestController
public class EstadoCivilController {

    @Autowired
    private EstadoCivilService estadoCivilService;

    @GetMapping("/estadosciviles")
    public ResponseEntity<List<EstadoCivil>> obtenerEstadosCiviles() {
        return new ResponseEntity<>(estadoCivilService.obtenerEstadosCiviles(), HttpStatus.OK);
    }
}


