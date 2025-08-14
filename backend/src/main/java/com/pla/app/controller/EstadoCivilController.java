package com.pla.app.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.pla.app.service.EstadoCivilService;
import com.pla.app.dto.estadosciviles.EstadoCivilOptionProjection;

@RestController
public class EstadoCivilController {

    @Autowired
    private EstadoCivilService estadoCivilService;

    @GetMapping("/estadosciviles")
    public ResponseEntity<List<EstadoCivilOptionProjection>> obtenerEstadosCiviles() {
        return new ResponseEntity<>(estadoCivilService.obtenerEstadosCivilesOpciones(), HttpStatus.OK);
    }
}


