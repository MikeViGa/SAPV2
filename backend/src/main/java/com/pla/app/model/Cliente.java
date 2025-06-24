package com.pla.app.model;

import lombok.Data;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.io.Serializable;

@Entity
@Table(name = "clientes")
@Data
public class Cliente implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false, updatable = false)
  private Long id;

  @NotNull(message = "El nombre es obligatorio")
  @Column(nullable = false)
  private String nombre;

  @NotNull(message = "El apellido paterno es obligatorio")
  @Column(nullable = false)
  private String apellidoPaterno;

  @NotNull(message = "El apellido materno es obligatorio")
  @Column(nullable = false)
  private String apellidoMaterno;

  @NotNull(message = "La fecha de nacimiento es obligatoria")
  @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
  @Column(nullable = false)
  private LocalDateTime fechaNacimiento;

  @NotNull(message = "El rfc es obligatorio")
  @Column(nullable = false)
  private String rfc;

  @NotNull(message = "La fecha de registro es obligatoria")
  @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
  @Column(nullable = false)
  private LocalDateTime fechaRegistro;

  @NotNull(message = "El estado civil es obligatorio")
  @Column(nullable = false)
  private String estadoCivil;

  @NotNull(message = "La ocupación es obligatoria")
  @Column(nullable = false)
  private String ocupacion;

  @NotNull(message = "La calle es obligatoria")
  @Column(nullable = false)
  private String calle;

  @NotNull(message = "El número exterior es obligatorio")
  @Column(nullable = false)
  private String numeroExterior;

  @Column(nullable = false)
  private String numeroInterior;

  @NotNull(message = "La vecindad de calles es obligatoria")
  @Column(nullable = false)
  private String vecindadCalles;
  
  @NotNull(message = "La colonia es obligatoria")
  @Column(nullable = false)
  private String colonia;

  @NotNull(message = "La ciudad es obligatoria")
  @Column(nullable = false)
  private String ciudad;

  @NotNull(message = "El estado es obligatorio")
  @Column(nullable = false)
  private String estado;

  @NotNull(message = "El código postal es obligatorio")
  @Column(nullable = false)
  private Long codigoPostal;

  @NotNull(message = "El teléfono es obligatorio")
  @Column(nullable = false)
  private String telefono1;

  @Column(nullable = false)
  private String telefono2;

  @NotNull(message = "El régimen es obligatorio")
  @Column(nullable = false)
  private String regimen;

  @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Solicitud> solicitudes = new ArrayList<>();

}