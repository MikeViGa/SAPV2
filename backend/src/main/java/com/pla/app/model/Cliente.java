package com.pla.app.model;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.io.Serializable;

@Entity
@Table(name = "clientes")
@Data
public class Cliente implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false, updatable = false)
  private Long id;

  @Column(name = "nombre", nullable = false)
  private String nombre;

  @Column(name = "apellido_paterno", nullable = false)
  private String apellidoPaterno;

  @Column(name = "apellido_materno", nullable = false)
  private String apellidoMaterno;

  @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
  @Column(name = "fecha_nacimiento", nullable = false)
  private LocalDateTime fechaNacimiento;

  @Column(name = "rfc", nullable = false)
  private String rfc;

  @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
  @Column(name = "fecha_registro", nullable = false)
  private LocalDateTime fechaRegistro;

  @Column(name = "estado_civil", nullable = false)
  private String estadoCivil;

  @Column(name = "ocupacion", nullable = false)
  private String ocupacion;

  @Column(name = "calle", nullable = false)
  private String calle;

  @Column(name = "numero_exterior", nullable = false)
  private String numeroExterior;

  @Column(name = "numero_interior", nullable = false)
  private String numeroInterior;

  @Column(name = "vecindad_calles", nullable = false)
  private String vecindadCalles;

  @Column(name = "colonia", nullable = false)
  private String colonia;

  @Column(name = "ciudad", nullable = false)
  private String ciudad;

  @Column(name = "estado", nullable = false)
  private String estado;

  @Column(name = "codigo_postal", nullable = false)
  private Integer codigoPostal;

  @Column(name = "telefono1", nullable = false)
  private String telefono1;

  @Column(name = "telefono2", nullable = false)
  private String telefono2;

  @Column(name = "regimen", nullable = false)
  private String regimen;
}