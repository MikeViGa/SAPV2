package com.pla.app.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.pla.app.model.Estado;
import com.pla.app.repository.EstadoRepository;

@Service
public class EstadoService {

    @Autowired
    private EstadoRepository estadoRepository;

    public List<Estado> obtenerEstados() {
        return estadoRepository.findAll();
    }
}
