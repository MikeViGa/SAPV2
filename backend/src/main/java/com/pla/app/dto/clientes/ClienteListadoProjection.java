package com.pla.app.dto.clientes;

import java.sql.Date;
import java.time.LocalDateTime;

public interface ClienteListadoProjection {
    Long getId();
    String getNombre();
    String getApellidoPaterno();
    String getApellidoMaterno();
    Date getFechaNacimiento();
    String getRfc();
    LocalDateTime getFechaRegistro();
    String getOcupacion();
    String getTelefono1();
    String getTelefono2();
    String getRegimen();
    String getEstadoCivilNombre();
    Long getCantidadDomicilios();
}



