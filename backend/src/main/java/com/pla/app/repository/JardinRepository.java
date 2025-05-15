package com.pla.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pla.app.model.Jardin;

public interface JardinRepository extends JpaRepository<Jardin, String> {

    Jardin findByNombre(String nombre);

}