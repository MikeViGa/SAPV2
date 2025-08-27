package com.pla.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.pla.app.model.Rol;
import java.util.List;
import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {

    Rol findByNombre(String nombre);

    // Métodos para filtrar solo registros activos
    @Query("SELECT r FROM Rol r WHERE r.activo = true")
    List<Rol> findAllActive();

    @Query("SELECT r FROM Rol r WHERE r.id = ?1 AND r.activo = true")
    Optional<Rol> findByIdAndActive(Long id);

    @Query("SELECT r FROM Rol r WHERE r.nombre = ?1 AND r.activo = true")
    Optional<Rol> findByNombreAndActive(String nombre);

}