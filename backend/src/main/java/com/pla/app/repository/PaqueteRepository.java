package com.pla.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import com.pla.app.model.Paquete;
import java.util.List;
import java.util.Optional;

public interface PaqueteRepository extends JpaRepository<Paquete, Long> {

    // Método para encontrar todos incluyendo inactivos
    @Query("SELECT p FROM Paquete p")
    List<Paquete> findAllIncludingInactive();

    // Método para encontrar por ID incluyendo inactivos
    @Query("SELECT p FROM Paquete p WHERE p.id = :id")
    Optional<Paquete> findByIdIncludingInactive(@Param("id") Long id);

    // Método para restaurar un paquete (soft delete inverso)
    @Modifying
    @Transactional
    @Query("UPDATE Paquete p SET p.activo = true, p.fechaModificacion = CURRENT_TIMESTAMP, p.modificadoPor = :modificadoPor WHERE p.id = :id")
    void restaurarPaquete(@Param("id") Long id, @Param("modificadoPor") String modificadoPor);

    // Método para soft delete manual
    @Modifying
    @Transactional
    @Query("UPDATE Paquete p SET p.activo = false, p.fechaModificacion = CURRENT_TIMESTAMP, p.modificadoPor = :modificadoPor WHERE p.id = :id")
    void softDeletePaquete(@Param("id") Long id, @Param("modificadoPor") String modificadoPor);

}