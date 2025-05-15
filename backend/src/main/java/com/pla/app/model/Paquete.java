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
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "enganche", nullable = false)
    private Double enganche;

    @Column(name = "importe", nullable = false)
    private Double importe;

    @Column(name = "valorTotal", nullable = false)
    private Double valorTotal;

    @Column(name = "saldoPendiente", nullable = false)
    private Double saldoPendiente;

    @Column(name = "numeroDePagos", nullable = false)
    private Integer numeroDePagos;

    @Column(name = "plazoDePago", nullable = false)
    private Integer plazoDePago;

    @Column(name = "listaDePrecios", nullable = false)
    private Integer listaDePrecios;

    @Column(name = "periodicidad", nullable = false)
    private Integer periodicidad;

    @Column(name = "bovedas", nullable = false)
    private Integer bovedas;

    @Column(name = "gavetas", nullable = false)
    private Integer gavetas;

    @Column(name = "servicios", nullable = false)
    private Integer servicios;

    public String obtenerDescripcion() {
        return bovedas + " Boveda(s) de " + gavetas + " Gaveta(s) con " + servicios
                + " servicio(s) funerario(s) con ataud tipo: ";
    }
}