package com.pla.app.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "modulos")
@Data
@ToString(exclude = { "subModulos", "permisos" }) // Para evitar recursion sobreescribir to String y evitar ciclado con
                                                  // Serializacion
public class Modulo implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 45)
    private String nombre;

    @Column(name = "ruta", nullable = false, length = 45)
    private String ruta;

    @Column(name = "icono", nullable = false, length = 45)
    private String icono;

    @Column(name = "orden", nullable = false)
    private Long orden;

    @Column(name = "visible", nullable = false)
    private Boolean visible;

    @ManyToOne
    @JoinColumn(name = "idsupermodulo")
    private Modulo superModulo;

    @OneToMany(mappedBy = "superModulo")
    @JsonIgnore
    private List<Modulo> subModulos;

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Permiso> permisos = new ArrayList<>();

}