package com.pla.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pla.app.model.ListaDePrecios;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ListaDePreciosRepository extends JpaRepository<ListaDePrecios, Long> {
    
    ListaDePrecios findByNombre(String nombre);

    @Query("SELECT l FROM ListaDePrecios l")
    List<ListaDePrecios> findAllIncludingInactive();

    @Query("SELECT l FROM ListaDePrecios l WHERE l.id = :id")
    Optional<ListaDePrecios> findByIdIncludingInactive(@Param("id") Long id);

    @Modifying
    @Transactional
    @Query("UPDATE ListaDePrecios l SET l.activo = true WHERE l.id = :id")
    void restaurar(@Param("id") Long id);

    @Modifying
    @Transactional
    @Query("UPDATE ListaDePrecios l SET l.activo = false WHERE l.id = :id")
    void softDelete(@Param("id") Long id);
}