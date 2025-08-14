package com.pla.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pla.app.model.Usuario;
import com.pla.app.dto.usuarios.UsuarioListadoProjection;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByNombre(String nombre);

    @Query("SELECT usuario FROM Usuario usuario WHERE usuario.nombre LIKE %:nombre%")
    List<Usuario> findByNombreUsuarioContaining(@Param("nombre") String nombre);

    @Query(
        "select " +
        " u.id as id, " +
        " u.nombre as nombre, " +
        " r.nombre as rolNombre " +
        " from Usuario u left join u.rol r "
    )
    Page<UsuarioListadoProjection> findListado(Pageable pageable);
}