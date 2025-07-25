package com.pla.app.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "permisos")
@Data
public class Permiso implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_permiso_rol")) 
    private Rol rol;

    @ManyToOne
    @JoinColumn(name = "modulo_id", foreignKey = @ForeignKey(name = "FK_permiso_modulo")) 
    private Modulo modulo;
}