package com.pla.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pla.app.model.Jardin;
import com.pla.app.model.Ubicacion;

public interface UbicacionRepository extends JpaRepository<Ubicacion, Long> {
    
    Ubicacion findBySeccion(String seccion);

    List<Ubicacion> findByJardin(Jardin jardin);
    
}