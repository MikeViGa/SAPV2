package com.pla.app.repository;

import java.util.List;
import java.util.Optional;
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

    @Query("SELECT DISTINCT d.colonia FROM Domicilio d WHERE d.colonia IS NOT NULL AND d.colonia <> '' AND LOWER(d.colonia) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<String> findDistinctColoniasContaining(@Param("q") String q);

    // Métodos para filtrar solo registros activos
    @Query("SELECT c FROM Cliente c WHERE c.activo = true")
    List<Cliente> findAllActive();

    @Query("SELECT c FROM Cliente c WHERE c.id = ?1 AND c.activo = true")
    Optional<Cliente> findByIdAndActive(Long id);

    @Query("SELECT c FROM Cliente c WHERE c.nombre = ?1 AND c.activo = true")
    Optional<Cliente> findByNombreAndActive(String nombre);

    @Query("SELECT cliente FROM Cliente cliente WHERE CONCAT(cliente.nombre, ' ', cliente.apellidoPaterno, ' ', cliente.apellidoMaterno) LIKE %:nombre% AND cliente.activo = true")
    List<Cliente> findByNombreContainingAndActive(@Param("nombre") String nombre);

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
        " left join c.estadoCivil ec " +
        " where c.activo = true ",
        countQuery = "select count(c) from Cliente c where c.activo = true"
    )
    Page<ClienteListadoProjection> findListadoActive(Pageable pageable);
}