package com.pla.app.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import com.pla.app.model.Permiso;
import com.pla.app.repository.PermisoRepository;
import org.springframework.stereotype.Service;

@Service
public class PermisoService {
    @Autowired
    private PermisoRepository permisoRepository;

    @Transactional(readOnly = true)
    public Optional<Permiso> obtenerPermisoPorId(Long id) {
        return permisoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Permiso> obtenerPermisosTodos() {
        List<Permiso> permisos = permisoRepository.findAll();
        return permisos;
    }

    @Transactional(readOnly = true)
    public List<Permiso> obtenerPermisosPorRol(Long idRol) {
        List<Permiso> permisos = permisoRepository.findByRolId(idRol);
        return permisos;
    }

    @Transactional
    public Permiso crearPermiso(Permiso permiso) throws Exception {
        return permisoRepository.save(permiso);
    }

    @Transactional
    public void eliminarPermiso(Long id) throws Exception {
        Optional<Permiso> permisoEncontrado = permisoRepository.findById(id);
        if (permisoEncontrado.isPresent()) {
            permisoRepository.deleteById(id);
        } else {
            throw new Exception("Permiso no encontrado con el ID proporcionado.");
        }
    }
}