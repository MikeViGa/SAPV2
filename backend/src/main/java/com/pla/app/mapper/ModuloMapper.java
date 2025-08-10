package com.pla.app.mapper;

import org.springframework.stereotype.Component;
import com.pla.app.dto.modulos.ModuloDTO;
import com.pla.app.model.Modulo;

@Component
public class ModuloMapper {
    
    public ModuloDTO toResponseDTO(Modulo modulo) {
        if (modulo == null) return null;
        ModuloDTO dto = new ModuloDTO();
        dto.setId(modulo.getId());
        dto.setNombre(modulo.getNombre());
        dto.setRuta(modulo.getRuta());
        dto.setIcono(modulo.getIcono());
        dto.setOrden(modulo.getOrden());
        dto.setVisible(modulo.getVisible());
        return dto;
    }
}
