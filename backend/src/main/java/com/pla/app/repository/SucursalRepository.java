package com.pla.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pla.app.model.Sucursal;

public interface SucursalRepository extends JpaRepository<Sucursal, Long> {

    Sucursal findByNombre(String nombre);

    @Query("SELECT sucursal FROM Sucursal sucursal WHERE CONCAT(sucursal.nombre) LIKE %:nombre%")
    List<Sucursal> findByNombreContaining(@Param("nombre") String nombre);
}