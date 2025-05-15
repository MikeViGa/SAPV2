package com.pla.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pla.app.model.Supervisor;

public interface SupervisorRepository extends JpaRepository<Supervisor, Long> {
    
    Supervisor findByNombre(String nombre);

    @Query("SELECT supervisor FROM Supervisor supervisor WHERE CONCAT(supervisor.nombre, ' ', supervisor.apellidoPaterno, ' ', supervisor.apellidoMaterno) LIKE %:nombre%")
    List<Supervisor> findByNombreContaining(@Param("nombre") String nombre);
}