package com.pla.app.repository;

import java.util.List;
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
}