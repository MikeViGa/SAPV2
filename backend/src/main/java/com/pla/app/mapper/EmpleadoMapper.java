package com.pla.app.mapper;

import com.pla.app.model.Empleado;
import com.pla.app.dto.empleados.EmpleadoResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class EmpleadoMapper {

    public EmpleadoResponseDTO toResponseDTO(Empleado empleado) {
        if (empleado == null) {
            return null;
        }

        EmpleadoResponseDTO dto = new EmpleadoResponseDTO();
        dto.setId(empleado.getId());
        dto.setNombre(empleado.getNombre());
        dto.setApellidoPaterno(empleado.getApellidoPaterno());
        dto.setApellidoMaterno(empleado.getApellidoMaterno());
        dto.setCorreo(empleado.getCorreo());
        dto.setTelefono(empleado.getTelefono());
        dto.setFechaNacimiento(empleado.getFechaNacimiento());
        dto.setFechaAlta(empleado.getFechaAlta());
        dto.setEstado(empleado.getEstado());
        dto.setActivo(empleado.getActivo());
        dto.setFechaCreacion(empleado.getFechaCreacion());
        dto.setFechaModificacion(empleado.getFechaModificacion());
        dto.setCreadoPor(empleado.getCreadoPor());
        dto.setModificadoPor(empleado.getModificadoPor());

        return dto;
    }
}

