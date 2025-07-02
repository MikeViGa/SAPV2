package com.pla.app.model;

import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "paquetes")
@Data
public class Paquete implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
   
    @NotBlank(message = "La clave es obligatoria")
	@Column(nullable = false, unique = true)
	private String clave;

    @NotNull(message = "El número de servicios es obligatorio")
    @Column(nullable = false)
    private Long servicios;

    @NotNull(message = "El número de pagos es obligatorio")
    @Column(nullable = false)
    private Long numeroPagos;

    @NotNull(message = "El valor total es obligatorio")
    @Column(nullable = false)
    private Double valorTotal;

    @NotNull(message = "El enganche es obligatorio")
    @Column(nullable = false)
    private Double enganche;

    @NotNull(message = "El importe es obligatorio")
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

    @NotNull(message = "El número de bóvedas es obligatorio")
    @Column(nullable = false)
    private Long bovedas;



    @NotNull(message = "El número de gavetas es obligatorio")
    @Column(nullable = false)
    private Long gavetas;

    @OneToOne(mappedBy = "paquete", fetch = FetchType.LAZY)
    private Solicitud solicitud;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ataud_id", foreignKey = @ForeignKey(name = "FK_paquete_ataud")) 
    private Ataud ataud;

    public String obtenerDescripcion() {
        return bovedas + " Boveda(s) de " + gavetas + " Gaveta(s) con " + servicios
                + " servicio(s) funerario(s) con ataud tipo: ";
    }

}