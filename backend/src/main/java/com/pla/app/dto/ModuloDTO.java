package com.pla.app.dto;

import java.util.List;
import lombok.Data;

@Data
public class ModuloDTO {
        private String nombre;
        private String ruta;
        private String icono;
        private List<ModuloDTO> submenus;
}