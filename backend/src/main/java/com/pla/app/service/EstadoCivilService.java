package com.pla.app.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.pla.app.model.EstadoCivil;
import com.pla.app.repository.EstadoCivilRepository;
import com.pla.app.dto.estadosciviles.EstadoCivilOptionProjection;

@Service
public class EstadoCivilService {
    @Autowired
    private EstadoCivilRepository estadoCivilRepository;

    @Transactional(readOnly = true)
    public List<EstadoCivil> obtenerEstadosCiviles() {
        return estadoCivilRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<EstadoCivilOptionProjection> obtenerEstadosCivilesOpciones() {
        return estadoCivilRepository.findAllOptions();
    }
}


