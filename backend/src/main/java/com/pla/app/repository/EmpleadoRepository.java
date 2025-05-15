package com.pla.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pla.app.model.Empleado;

public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

    Empleado findByNombre(String nombre);

    @Query("SELECT empleado FROM Empleado empleado WHERE CONCAT(empleado.nombre, ' ', empleado.apellidoPaterno, ' ', empleado.apellidoMaterno) LIKE %:nombre%")
    List<Empleado> findByNombreContaining(@Param("nombre") String nombre);
}