package com.pla.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.pla.app.dto.ModuloDTO;
import com.pla.app.model.Modulo;
import com.pla.app.model.Permiso;
import com.pla.app.model.Usuario;
import com.pla.app.repository.ModuloRepository;
import com.pla.app.repository.PermisoRepository;
import com.pla.app.repository.UsuarioRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ModuloService {
    @Autowired
    private ModuloRepository moduloRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PermisoRepository permisoRepository;

    @Transactional(readOnly = true)
    public List<Modulo> getAllModulos() {
        return moduloRepository.findAll();
    }

    public List<Modulo> getTopLevelModulos() {
        return moduloRepository.findBySuperModuloIsNull();
    }

    public List<ModuloDTO> getAllModules() {
        List<Modulo> topLevelModules = moduloRepository.findBySuperModuloIsNull();
        return topLevelModules.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ModuloDTO convertToDTO(Modulo modulo) {
        ModuloDTO dto = new ModuloDTO();
        dto.setNombre(modulo.getNombre());
        dto.setRuta(modulo.getRuta());
        dto.setIcono(modulo.getIcono());
        if (!modulo.getSubModulos().isEmpty()) {
            dto.setSubmenus(modulo.getSubModulos().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    @Transactional(readOnly = true)
    public Optional<Modulo> obtenerModuloPorId(Long id) {
        return moduloRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Modulo> obtenerModulosPorNombreUsuario(String nombreUsuario) {
        Usuario usuario = usuarioRepository.findByNombreUsuario(nombreUsuario);
        List<Permiso> permisos = permisoRepository.findByRolId(usuario.getRoles().get(0).getId());//Obtiene solo el primer Rol
        List<Modulo> modulos = new ArrayList<>();
        for (Permiso permiso : permisos) {
            if (permiso.getModulo().getVisible()) // Agregar solo visibles
                modulos.add(permiso.getModulo());
        }
        return modulos;
    }

    @Transactional
    public Modulo crearModulo(Modulo rol) throws Exception {
        return moduloRepository.save(rol);
    }

    @Transactional
    public Modulo actualizarRol(Modulo modulo) throws Exception {
        Modulo moduloEncontrado = moduloRepository.findById(modulo.getId()).get();
        if (moduloEncontrado != null) {
            moduloEncontrado.setNombre(modulo.getNombre());
            Modulo moduloActualizado = moduloRepository.save(moduloEncontrado);
            return moduloActualizado;
        } else {
            throw new Exception("Rol no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarModulo(Long id) throws Exception {
        Optional<Modulo> moduloEncontrado = moduloRepository.findById(id);
        if (moduloEncontrado.isPresent()) {
            moduloRepository.deleteById(id);
        } else {
            throw new Exception("Rol no encontrado con el ID proporcionado.");
        }
    }
}