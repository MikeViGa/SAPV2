package com.pla.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pla.app.model.Ataud;

public interface AtaudRepository extends JpaRepository<Ataud, Long> {

    Ataud findByDescripcion(String descripcion);

}