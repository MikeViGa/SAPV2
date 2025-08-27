package com.pla.app.mapper;

import com.pla.app.dto.usuarios.UsuarioResponseDTO;
import com.pla.app.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setActivo(usuario.getActivo());
        dto.setRolNombre(usuario.getRol() != null ? usuario.getRol().getNombre() : null);
        dto.setFechaCreacion(usuario.getFechaCreacion());
        dto.setFechaModificacion(usuario.getFechaModificacion());
        dto.setCreadoPor(usuario.getCreadoPor());
        dto.setModificadoPor(usuario.getModificadoPor());

        return dto;
    }
}

