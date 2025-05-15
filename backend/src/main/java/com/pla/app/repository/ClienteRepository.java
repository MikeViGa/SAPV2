package com.pla.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pla.app.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    Cliente findByNombre(String nombre);

    @Query("SELECT cliente FROM Cliente cliente WHERE CONCAT(cliente.nombre, ' ', cliente.apellidoPaterno, ' ', cliente.apellidoMaterno) LIKE %:nombre%")
    List<Cliente> findByNombreContaining(@Param("nombre") String nombre);

    @Query("SELECT DISTINCT c.colonia FROM Cliente c")
    List<String> findDistinctColonias();
}