package com.pla.app.mapper;

import com.pla.app.model.Supervisor;
import com.pla.app.dto.supervisores.SupervisorResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class SupervisorMapper {

    public SupervisorResponseDTO toResponseDTO(Supervisor supervisor) {
        if (supervisor == null) {
            return null;
        }

        SupervisorResponseDTO dto = new SupervisorResponseDTO();
        dto.setId(supervisor.getId());
        dto.setNombre(supervisor.getNombre());
        dto.setApellidoPaterno(supervisor.getApellidoPaterno());
        dto.setApellidoMaterno(supervisor.getApellidoMaterno());
        dto.setCalle(supervisor.getCalle());
        dto.setNumeroExterior(supervisor.getNumeroExterior());
        dto.setNumeroInterior(supervisor.getNumeroInterior());
        dto.setColonia(supervisor.getColonia());
        dto.setCiudad(supervisor.getCiudad());
        dto.setEstado(supervisor.getEstado());
        dto.setCodigoPostal(supervisor.getCodigoPostal());
        dto.setTelefono1(supervisor.getTelefono1());
        dto.setTelefono2(supervisor.getTelefono2());
        dto.setRegimen(supervisor.getRegimen());
        dto.setRfc(supervisor.getRfc());
        dto.setCurp(supervisor.getCurp());
        dto.setNumeroTarjeta(supervisor.getNumeroTarjeta());
        dto.setFechaAlta(supervisor.getFechaAlta());
        dto.setComision(supervisor.getComision());
        dto.setActivo(supervisor.getActivo());
        dto.setFechaCreacion(supervisor.getFechaCreacion());
        dto.setFechaModificacion(supervisor.getFechaModificacion());
        dto.setCreadoPor(supervisor.getCreadoPor());
        dto.setModificadoPor(supervisor.getModificadoPor());

        return dto;
    }
}


