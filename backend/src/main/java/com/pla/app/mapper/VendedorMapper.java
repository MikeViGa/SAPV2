package com.pla.app.mapper;

import com.pla.app.model.Vendedor;
import com.pla.app.dto.vendedores.VendedorResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class VendedorMapper {

    public VendedorResponseDTO toResponseDTO(Vendedor vendedor) {
        if (vendedor == null) {
            return null;
        }

        VendedorResponseDTO dto = new VendedorResponseDTO();
        dto.setId(vendedor.getId());
        dto.setNombre(vendedor.getNombre());
        dto.setApellidoPaterno(vendedor.getApellidoPaterno());
        dto.setApellidoMaterno(vendedor.getApellidoMaterno());
        dto.setCalle(vendedor.getCalle());
        dto.setNumeroExterior(vendedor.getNumeroExterior());
        dto.setNumeroInterior(vendedor.getNumeroInterior());
        dto.setColonia(vendedor.getColonia());
        dto.setCiudad(vendedor.getCiudad());
        dto.setEstado(vendedor.getEstado());
        dto.setCodigoPostal(vendedor.getCodigoPostal());
        dto.setTelefono1(vendedor.getTelefono1());
        dto.setTelefono2(vendedor.getTelefono2());
        dto.setRegimen(vendedor.getRegimen());
        dto.setRfc(vendedor.getRfc());
        dto.setCurp(vendedor.getCurp());
        dto.setNumeroTarjeta(vendedor.getNumeroTarjeta());
        dto.setFechaAlta(vendedor.getFechaAlta());
        dto.setActivo(vendedor.getActivo());
        dto.setFechaCreacion(vendedor.getFechaCreacion());
        dto.setFechaModificacion(vendedor.getFechaModificacion());
        dto.setCreadoPor(vendedor.getCreadoPor());
        dto.setModificadoPor(vendedor.getModificadoPor());

        // Información del supervisor
        if (vendedor.getSupervisor() != null) {
            dto.setSupervisorId(vendedor.getSupervisor().getId());
            dto.setSupervisorNombre(vendedor.getSupervisor().getNombre() + " " + 
                                  vendedor.getSupervisor().getApellidoPaterno() + " " + 
                                  vendedor.getSupervisor().getApellidoMaterno());
        }

        return dto;
    }
}


