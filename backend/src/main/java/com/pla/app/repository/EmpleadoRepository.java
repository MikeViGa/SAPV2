package com.pla.app.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pla.app.model.Empleado;

public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

    Empleado findByNombre(String nombre);

    @Query("SELECT empleado FROM Empleado empleado WHERE CONCAT(empleado.nombre, ' ', empleado.apellidoPaterno, ' ', empleado.apellidoMaterno) LIKE %:nombre%")
    List<Empleado> findByNombreContaining(@Param("nombre") String nombre);

    // Métodos para filtrar solo registros activos
    @Query("SELECT e FROM Empleado e WHERE e.activo = true")
    List<Empleado> findAllActive();

    @Query("SELECT e FROM Empleado e WHERE e.id = ?1 AND e.activo = true")
    Optional<Empleado> findByIdAndActive(Long id);

    @Query("SELECT e FROM Empleado e WHERE e.nombre = ?1 AND e.activo = true")
    Optional<Empleado> findByNombreAndActive(String nombre);

    @Query("SELECT empleado FROM Empleado empleado WHERE CONCAT(empleado.nombre, ' ', empleado.apellidoPaterno, ' ', empleado.apellidoMaterno) LIKE %:nombre% AND empleado.activo = true")
    List<Empleado> findByNombreContainingAndActive(@Param("nombre") String nombre);
}