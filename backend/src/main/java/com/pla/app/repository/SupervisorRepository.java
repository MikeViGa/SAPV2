package com.pla.app.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pla.app.model.Supervisor;

public interface SupervisorRepository extends JpaRepository<Supervisor, Long> {
    
    Supervisor findByNombre(String nombre);

    @Query("SELECT supervisor FROM Supervisor supervisor WHERE CONCAT(supervisor.nombre, ' ', supervisor.apellidoPaterno, ' ', supervisor.apellidoMaterno) LIKE %:nombre%")
    List<Supervisor> findByNombreContaining(@Param("nombre") String nombre);

    // Métodos para filtrar solo registros activos
    @Query("SELECT s FROM Supervisor s WHERE s.activo = true")
    List<Supervisor> findAllActive();

    @Query("SELECT s FROM Supervisor s WHERE s.id = ?1 AND s.activo = true")
    Optional<Supervisor> findByIdAndActive(Long id);

    @Query("SELECT s FROM Supervisor s WHERE s.nombre = ?1 AND s.activo = true")
    Optional<Supervisor> findByNombreAndActive(String nombre);

    @Query("SELECT supervisor FROM Supervisor supervisor WHERE CONCAT(supervisor.nombre, ' ', supervisor.apellidoPaterno, ' ', supervisor.apellidoMaterno) LIKE %:nombre% AND supervisor.activo = true")
    List<Supervisor> findByNombreContainingAndActive(@Param("nombre") String nombre);
}