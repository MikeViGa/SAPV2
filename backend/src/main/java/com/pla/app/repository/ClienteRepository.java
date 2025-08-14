package com.pla.app.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pla.app.model.Cliente;
import com.pla.app.dto.clientes.ClienteListadoProjection;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    Cliente findByNombre(String nombre);

    @Query("SELECT cliente FROM Cliente cliente WHERE CONCAT(cliente.nombre, ' ', cliente.apellidoPaterno, ' ', cliente.apellidoMaterno) LIKE %:nombre%")
    List<Cliente> findByNombreContaining(@Param("nombre") String nombre);

    @Query(value =
        "select " +
        " c.id as id, " +
        " c.nombre as nombre, " +
        " c.apellidoPaterno as apellidoPaterno, " +
        " c.apellidoMaterno as apellidoMaterno, " +
        " c.fechaNacimiento as fechaNacimiento, " +
        " c.rfc as rfc, " +
        " c.fechaRegistro as fechaRegistro, " +
        " c.ocupacion as ocupacion, " +
        " c.telefono1 as telefono1, " +
        " c.telefono2 as telefono2, " +
        " c.regimen as regimen, " +
        " ec.nombre as estadoCivilNombre, " +
        " (select count(d) from Domicilio d where d.cliente = c) as cantidadDomicilios " +
        " from Cliente c " +
        " left join c.estadoCivil ec ",
        countQuery = "select count(c) from Cliente c"
    )
    Page<ClienteListadoProjection> findListado(Pageable pageable);

    /* 
    @Query("SELECT DISTINCT c.colonia FROM Cliente c")
    List<String> findDistinctColonias();

    */
}