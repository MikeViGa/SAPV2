package com.pla.app.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "paquetes")
@Data
public class Paquete implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @Column(nullable = false)
    private Long servicios;

    @Column(nullable = false)
    private Long numeroDePagos;

    @Column(nullable = false)
    private Double valorTotal;

    @Column(nullable = false)
    private Double enganche;

    @Column(nullable = false)
    private Double importe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plazodepago_id", foreignKey = @ForeignKey(name = "FK_paquete_plazodepago")) 
    private PlazoDePago plazoDePago;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listadeprecios_id", foreignKey = @ForeignKey(name = "FK_paquete_listadeprecios")) 
    private ListaDePrecios listaDePrecios;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "periodicidad_id", foreignKey = @ForeignKey(name = "FK_paquete_periodicidad")) 
    private Periodicidad periodicidad;

    @Column(nullable = false)
    private Long bovedas;

    @Column(nullable = false)
    private Long gavetas;

    @OneToOne(mappedBy = "paquete", fetch = FetchType.LAZY)
    private Solicitud solicitud;

    public String obtenerDescripcion() {
        return bovedas + " Boveda(s) de " + gavetas + " Gaveta(s) con " + servicios
                + " servicio(s) funerario(s) con ataud tipo: ";
    }
}