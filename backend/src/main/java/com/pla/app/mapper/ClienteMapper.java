package com.pla.app.mapper;

import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import com.pla.app.dto.DomicilioResponseDTO;
import com.pla.app.dto.clientes.ClienteConDomiciliosResponseDTO;
import com.pla.app.dto.clientes.ClienteCreateRequestDTO;
import com.pla.app.dto.clientes.ClienteResponseDTO;
import com.pla.app.dto.clientes.ClienteUpdateRequestDTO;
import com.pla.app.model.Cliente;
import com.pla.app.model.Domicilio;

@Component
public class ClienteMapper {
    
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy");
    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
    
    // Request to Entity
    public Cliente toEntity(ClienteCreateRequestDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setApellidoPaterno(dto.getApellidoPaterno());
        cliente.setApellidoMaterno(dto.getApellidoMaterno());
        cliente.setFechaNacimiento(dto.getFechaNacimiento());
        cliente.setRfc(dto.getRfc());
        cliente.setOcupacion(dto.getOcupacion());
        cliente.setTelefono1(dto.getTelefono1());
        cliente.setTelefono2(dto.getTelefono2());
        cliente.setRegimen(dto.getRegimen());
        cliente.setFechaRegistro(LocalDateTime.now());
        return cliente;
    }
    
    public void updateEntity(Cliente cliente, ClienteUpdateRequestDTO dto) {
        cliente.setNombre(dto.getNombre());
        cliente.setApellidoPaterno(dto.getApellidoPaterno());
        cliente.setApellidoMaterno(dto.getApellidoMaterno());
        cliente.setFechaNacimiento(dto.getFechaNacimiento());
        cliente.setRfc(dto.getRfc());
        cliente.setOcupacion(dto.getOcupacion());
        cliente.setTelefono1(dto.getTelefono1());
        cliente.setTelefono2(dto.getTelefono2());
        cliente.setRegimen(dto.getRegimen());
    }
    
    // Entity to Response (para listado sin domicilios)
    public ClienteResponseDTO toResponseDTO(Cliente cliente) {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(cliente.getId());
        dto.setNombre(cliente.getNombre());
        dto.setApellidoPaterno(cliente.getApellidoPaterno());
        dto.setApellidoMaterno(cliente.getApellidoMaterno());
        dto.setFechaNacimiento(formatDate(cliente.getFechaNacimiento()));
        dto.setRfc(cliente.getRfc());
        dto.setFechaRegistro(formatDateTime(cliente.getFechaRegistro()));
        dto.setOcupacion(cliente.getOcupacion());
        dto.setTelefono1(cliente.getTelefono1());
        dto.setTelefono2(cliente.getTelefono2());
        dto.setRegimen(cliente.getRegimen());
        dto.setCantidadDomicilios(cliente.getDomicilios() != null ? cliente.getDomicilios().size() : 0);
        return dto;
    }
    
    // Entity to Response (con domicilios completos)
    public ClienteConDomiciliosResponseDTO toConDomiciliosResponseDTO(Cliente cliente) {
        ClienteConDomiciliosResponseDTO dto = new ClienteConDomiciliosResponseDTO();
        dto.setId(cliente.getId());
        dto.setNombre(cliente.getNombre());
        dto.setApellidoPaterno(cliente.getApellidoPaterno());
        dto.setApellidoMaterno(cliente.getApellidoMaterno());
        dto.setFechaNacimiento(formatDate(cliente.getFechaNacimiento()));
        dto.setRfc(cliente.getRfc());
        dto.setFechaRegistro(formatDateTime(cliente.getFechaRegistro()));
        dto.setOcupacion(cliente.getOcupacion());
        dto.setTelefono1(cliente.getTelefono1());
        dto.setTelefono2(cliente.getTelefono2());
        dto.setRegimen(cliente.getRegimen());
        dto.setCantidadDomicilios(cliente.getDomicilios() != null ? cliente.getDomicilios().size() : 0);
        dto.setDomicilios(cliente.getDomicilios() != null ? 
            cliente.getDomicilios().stream().map(this::toDomicilioResponseDTO).collect(Collectors.toList()) : 
            new ArrayList<>());
        return dto;
    }
    
    public DomicilioResponseDTO toDomicilioResponseDTO(Domicilio domicilio) {
        DomicilioResponseDTO dto = new DomicilioResponseDTO();
        dto.setId(domicilio.getId());
        dto.setCalle(domicilio.getCalle());
        dto.setNumeroInterior(domicilio.getNumeroInterior());
        dto.setNumeroExterior(domicilio.getNumeroExterior());
        dto.setColonia(domicilio.getColonia());
        dto.setCiudad(domicilio.getCiudad());
        //dto.setEstado(domicilio.getEstado()); // Si tienes este campo
        dto.setCodigoPostal(domicilio.getCodigoPostal());
        dto.setEntreCalles(domicilio.getEntreCalles());
        return dto;
    }
    
    private String formatDate(Date date) {
        return date != null ? DATE_FORMAT.format(date) : null;
    }
    
    private String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATETIME_FORMAT) : null;
    }
}