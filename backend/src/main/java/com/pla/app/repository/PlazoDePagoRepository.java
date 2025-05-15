package com.pla.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pla.app.model.PlazoDePago;

public interface PlazoDePagoRepository extends JpaRepository<PlazoDePago, Long> {

    PlazoDePago findByNombre(String descripcion);

}