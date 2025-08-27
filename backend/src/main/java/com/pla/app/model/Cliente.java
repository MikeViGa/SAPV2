package com.pla.app.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.pla.app.audit.Auditable;

import java.sql.Date;

@Entity
@Table(name = "clientes")
@Data
@EqualsAndHashCode(callSuper = true)
public class Cliente extends Auditable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false, updatable = false)
  private Long id;

  //@NotNull(message = "El nombre es obligatorio")
  @Column(length = 100)
  private String nombre;

 // @NotNull(message = "El apellido paterno es obligatorio")
  @Column(length = 100)
  private String apellidoPaterno;

  //@NotNull(message = "El apellido materno es obligatorio")
  @Column(length = 100)
  private String apellidoMaterno;

  @NotNull(message = "La fecha de nacimiento es obligatoria")
  @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
  @Column(nullable = false)
  private Date fechaNacimiento;

  //@NotNull(message = "El rfc es obligatorio")
  @Column(length = 50)
  private String rfc;

  @NotNull(message = "La fecha de registro es obligatoria")
  @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
  //@Column(nullable = false)
  private LocalDateTime fechaRegistro;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(foreignKey = @ForeignKey(name = "FK_cliente_estadocivil")) 
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private EstadoCivil estadoCivil;

  //@NotNull(message = "La ocupación es obligatoria")
  @Column(length = 50)
  private String ocupacion;

  //@NotNull(message = "El teléfono es obligatorio")
  @Column(length = 50)
  private String telefono1;

  @Column( length = 50)
  private String telefono2;

  //@NotNull(message = "El régimen es obligatorio")
  @Column(length = 50)
  private String regimen;

  @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
  private Boolean activo = true;

  @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
  @JsonIgnore
  private List<Solicitud> solicitudes = new ArrayList<>();

  @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Domicilio> domicilios = new ArrayList<>();

}