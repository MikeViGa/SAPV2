package com.pla.app.mapper;

import com.pla.app.model.Sucursal;
import com.pla.app.dto.sucursales.SucursalResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class SucursalMapper {

    public SucursalResponseDTO toResponseDTO(Sucursal sucursal) {
        if (sucursal == null) {
            return null;
        }

        SucursalResponseDTO dto = new SucursalResponseDTO();
        dto.setId(sucursal.getId());
        dto.setNombre(sucursal.getNombre());
        dto.setActivo(sucursal.getActivo());
        dto.setFechaCreacion(sucursal.getFechaCreacion());
        dto.setFechaModificacion(sucursal.getFechaModificacion());
        dto.setCreadoPor(sucursal.getCreadoPor());
        dto.setModificadoPor(sucursal.getModificadoPor());

        return dto;
    }
}

