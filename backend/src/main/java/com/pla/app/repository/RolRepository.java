package com.pla.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pla.app.model.Rol;

public interface RolRepository extends JpaRepository<Rol, Long> {

    Rol findByNombre(String nombre);

}