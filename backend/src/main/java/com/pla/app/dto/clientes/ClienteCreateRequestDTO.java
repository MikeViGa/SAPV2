package com.pla.app.dto.clientes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Date;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteCreateRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;
    
    @Size(max = 100, message = "El apellido paterno no puede exceder 100 caracteres")
    private String apellidoPaterno;
    
    @Size(max = 100, message = "El apellido materno no puede exceder 100 caracteres")
    private String apellidoMaterno;
    
    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private Date fechaNacimiento; // "dd/MM/yyyy"
    
    @Size(max = 50, message = "El RFC no puede exceder 50 caracteres")
    private String rfc;
    
    @Size(max = 50, message = "La ocupación no puede exceder 50 caracteres")
    private String ocupacion;
    
    @Size(max = 50, message = "El teléfono no puede exceder 50 caracteres")
    private String telefono1;
    
    @Size(max = 50, message = "El teléfono no puede exceder 50 caracteres")
    private String telefono2;
    
    @Size(max = 50, message = "El régimen no puede exceder 50 caracteres")
    private String regimen;
    
    private Long estadoCivilId;
}
