package com.pla.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pla.app.model.Modulo;

public interface ModuloRepository extends JpaRepository<Modulo, Long> {

    Modulo findByNombre(String nombre);

    List<Modulo> findBySuperModuloIsNull();
}