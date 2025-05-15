package com.pla.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pla.app.model.Permiso;

public interface PermisoRepository extends JpaRepository<Permiso, Long> {

    List<Permiso> findByRolId(Long id);
}