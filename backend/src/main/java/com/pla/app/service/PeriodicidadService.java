package com.pla.app.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.pla.app.model.Periodicidad;
import com.pla.app.repository.PeriodicidadRepository;

@Service
public class PeriodicidadService {

    @Autowired
    private PeriodicidadRepository periodicidadRepository;

    @Transactional
    public Periodicidad crearPeriodicidad(Periodicidad periodicidad) throws Exception {
        return periodicidadRepository.save(periodicidad);
    }

    public Optional<Periodicidad> obtenerPeriodicidadPorId(Long id) {
        return periodicidadRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Periodicidad> obtenerPeriodicidadesTodas() {
        return periodicidadRepository.findAll();
    }

    @Transactional
    public Periodicidad actualizarPeriodicidad(Periodicidad periodicidad) throws Exception {
        Periodicidad periodicidadEncontrada = periodicidadRepository.findById(periodicidad.getId()).get();
        if (periodicidadEncontrada != null) {
            periodicidadEncontrada.setNombre(periodicidad.getNombre());
            Periodicidad periodicidadActualizada = periodicidadRepository.save(periodicidadEncontrada);
            return periodicidadActualizada;
        } else {
            throw new Exception("Periodicidad no encontrada con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarPeriodicidad(Long id) throws Exception {
        Optional<Periodicidad> periodicidadEncontrada = periodicidadRepository.findById(id);
        if (periodicidadEncontrada.isPresent()) {
            periodicidadRepository.deleteById(id);
        } else {
            throw new Exception("Periodicidad no encontrada con el ID proporcionado.");
        }
    }
}

