package com.pla.app.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.pla.app.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByNombreUsuario(String nombreUsuario);

    @Query("SELECT usuario FROM Usuario usuario WHERE usuario.nombreUsuario LIKE %:nombreUsuario%")
    List<Usuario> findByNombreUsuarioContaining(@Param("nombreUsuario") String nombreUsuario);
}