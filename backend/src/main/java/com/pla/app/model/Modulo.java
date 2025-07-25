package com.pla.app.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "modulos")
@Data
@ToString(exclude = { "subModulos", "permisos" }) // Para evitar recursion sobreescribir to String y evitar ciclado con Serializacion

public class Modulo implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "ruta", nullable = false, length = 100)
    private String ruta;

    @Column(name = "icono", length = 100)
    private String icono;

    @Column(name = "orden", nullable = false)
    private Long orden;

    @Column(name = "visible", nullable = false)
    private Boolean visible;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "supermodulo_id", foreignKey = @ForeignKey(name = "FK_supermodulo_modulo"))
    private Modulo superModulo;

    @OneToMany(mappedBy = "superModulo", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Modulo> subModulos = new ArrayList<>();

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Permiso> permisos = new ArrayList<>();

}