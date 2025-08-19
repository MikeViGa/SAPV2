package com.pla.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pla.app.model.Solicitud;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    Solicitud findByClaveContrato(Long claveContrato);

    Page<Solicitud> findAll(Pageable pageable);
}