package com.pla.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pla.app.model.Periodicidad;

public interface PeriodicidadRepository extends JpaRepository<Periodicidad, Long> {

    Periodicidad findByNombre(String descripcion);
}