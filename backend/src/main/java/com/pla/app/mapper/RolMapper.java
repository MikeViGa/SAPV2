package com.pla.app.mapper;

import com.pla.app.dto.roles.RolResponseDTO;
import com.pla.app.model.Rol;
import org.springframework.stereotype.Component;

@Component
public class RolMapper {

    public RolResponseDTO toResponseDTO(Rol rol) {
        if (rol == null) {
            return null;
        }

        RolResponseDTO dto = new RolResponseDTO();
        dto.setId(rol.getId());
        dto.setNombre(rol.getNombre());
        dto.setActivo(rol.getActivo());
        dto.setFechaCreacion(rol.getFechaCreacion());
        dto.setFechaModificacion(rol.getFechaModificacion());
        dto.setCreadoPor(rol.getCreadoPor());
        dto.setModificadoPor(rol.getModificadoPor());

        return dto;
    }
}
