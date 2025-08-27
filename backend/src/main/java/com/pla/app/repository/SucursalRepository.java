package com.pla.app.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pla.app.model.Sucursal;

public interface SucursalRepository extends JpaRepository<Sucursal, Long> {

    Sucursal findByNombre(String nombre);

    @Query("SELECT sucursal FROM Sucursal sucursal WHERE CONCAT(sucursal.nombre) LIKE %:nombre%")
    List<Sucursal> findByNombreContaining(@Param("nombre") String nombre);

    // Métodos para filtrar solo registros activos
    @Query("SELECT s FROM Sucursal s WHERE s.activo = true")
    List<Sucursal> findAllActive();

    @Query("SELECT s FROM Sucursal s WHERE s.id = ?1 AND s.activo = true")
    Optional<Sucursal> findByIdAndActive(Long id);

    @Query("SELECT s FROM Sucursal s WHERE s.nombre = ?1 AND s.activo = true")
    Optional<Sucursal> findByNombreAndActive(String nombre);

    @Query("SELECT sucursal FROM Sucursal sucursal WHERE CONCAT(sucursal.nombre) LIKE %:nombre% AND sucursal.activo = true")
    List<Sucursal> findByNombreContainingAndActive(@Param("nombre") String nombre);
}