package com.pla.app.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pla.app.model.Vendedor;

public interface VendedorRepository extends JpaRepository<Vendedor, Long> {
    
    Vendedor findByNombre(String nombre);

    @Query("SELECT vendedor FROM Vendedor vendedor WHERE CONCAT(vendedor.nombre, ' ', vendedor.apellidoPaterno, ' ', vendedor.apellidoMaterno) LIKE %:nombre%")
    List<Vendedor> findByNombreContaining(@Param("nombre") String nombre);

    @Query("SELECT v FROM Vendedor v WHERE v.superVendedor.id = :vendedorId")
    List<Vendedor> findSupervisadosByVendedorId(@Param("vendedorId") Long vendedorId);

    @Query("SELECT v FROM Vendedor v LEFT JOIN FETCH v.supervisor")
    List<Vendedor> findAllWithSupervisor();

    @Query(value = "SELECT new com.pla.app.dto.vendedores.VendedorListRowDTO("
            + " v.id, v.nombre, v.apellidoPaterno, v.apellidoMaterno, v.calle, v.numeroExterior, v.numeroInterior,"
            + " v.colonia, v.ciudad, v.estado, v.codigoPostal, v.telefono1, v.telefono2, v.regimen, v.rfc, v.curp,"
            + " v.numeroTarjeta, v.fechaAlta, s.id, s.nombre, s.apellidoPaterno, s.apellidoMaterno)"
            + " FROM Vendedor v LEFT JOIN v.supervisor s",
            countQuery = "SELECT COUNT(v) FROM Vendedor v")
    Page<com.pla.app.dto.vendedores.VendedorListRowDTO> findAllListRows(Pageable pageable);

    // Métodos para filtrar solo registros activos
    @Query("SELECT v FROM Vendedor v WHERE v.activo = true")
    List<Vendedor> findAllActive();

    @Query("SELECT v FROM Vendedor v WHERE v.id = ?1 AND v.activo = true")
    Optional<Vendedor> findByIdAndActive(Long id);

    @Query("SELECT v FROM Vendedor v WHERE v.nombre = ?1 AND v.activo = true")
    Optional<Vendedor> findByNombreAndActive(String nombre);

    @Query("SELECT vendedor FROM Vendedor vendedor WHERE CONCAT(vendedor.nombre, ' ', vendedor.apellidoPaterno, ' ', vendedor.apellidoMaterno) LIKE %:nombre% AND vendedor.activo = true")
    List<Vendedor> findByNombreContainingAndActive(@Param("nombre") String nombre);

    @Query("SELECT v FROM Vendedor v WHERE v.superVendedor.id = :vendedorId AND v.activo = true")
    List<Vendedor> findSupervisadosByVendedorIdAndActive(@Param("vendedorId") Long vendedorId);

    @Query("SELECT v FROM Vendedor v LEFT JOIN FETCH v.supervisor WHERE v.activo = true")
    List<Vendedor> findAllWithSupervisorAndActive();

    @Query(value = "SELECT new com.pla.app.dto.vendedores.VendedorListRowDTO("
            + " v.id, v.nombre, v.apellidoPaterno, v.apellidoMaterno, v.calle, v.numeroExterior, v.numeroInterior,"
            + " v.colonia, v.ciudad, v.estado, v.codigoPostal, v.telefono1, v.telefono2, v.regimen, v.rfc, v.curp,"
            + " v.numeroTarjeta, v.fechaAlta, s.id, s.nombre, s.apellidoPaterno, s.apellidoMaterno)"
            + " FROM Vendedor v LEFT JOIN v.supervisor s WHERE v.activo = true",
            countQuery = "SELECT COUNT(v) FROM Vendedor v WHERE v.activo = true")
    Page<com.pla.app.dto.vendedores.VendedorListRowDTO> findAllListRowsActive(Pageable pageable);
}