package com.pla.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pla.app.model.ListaDePrecios;

public interface ListaDePreciosRepository extends JpaRepository<ListaDePrecios, String> {
    
    ListaDePrecios findByDescripcion(String descripcion);
}