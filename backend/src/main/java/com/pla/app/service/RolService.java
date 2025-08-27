package com.pla.app.service;

import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.pla.app.model.Rol;
import com.pla.app.repository.RolRepository;
import net.sf.jasperreports.engine.JasperRunManager;

@Service
public class RolService {

    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public Rol crearRol(Rol rol) throws Exception {
        return rolRepository.save(rol);
    }

    public Optional<Rol> obtenerRolPorId(Long id) {
        return rolRepository.findByIdAndActive(id);
    }

    @Transactional(readOnly = true)
    public List<Rol> obtenerRolesTodos() {
        return rolRepository.findAllActive();
    }

    @Transactional
    public Rol actualizarRol(Rol rol) throws Exception {
        Optional<Rol> rolEncontradoOpt = rolRepository.findByIdAndActive(rol.getId());
        if (rolEncontradoOpt.isPresent()) {
            Rol rolEncontrado = rolEncontradoOpt.get();
            rolEncontrado.setNombre(rol.getNombre());
            Rol rolActualizado = rolRepository.save(rolEncontrado);
            return rolActualizado;
        } else {
            throw new Exception("Rol no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarRol(Long id) throws Exception {
        Optional<Rol> rolEncontradoOpt = rolRepository.findByIdAndActive(id);
        if (rolEncontradoOpt.isPresent()) {
            Rol rolEncontrado = rolEncontradoOpt.get();
            rolEncontrado.setActivo(false); // Soft delete
            rolRepository.save(rolEncontrado);
        } else {
            throw new Exception("Rol no encontrado con el ID proporcionado.");
        }
    }

    // Método adicional para recuperar un rol eliminado
    @Transactional
    public void restaurarRol(Long id) throws Exception {
        Optional<Rol> rolEncontradoOpt = rolRepository.findById(id);
        if (rolEncontradoOpt.isPresent()) {
            Rol rolEncontrado = rolEncontradoOpt.get();
            if (!rolEncontrado.getActivo()) {
                rolEncontrado.setActivo(true);
                rolRepository.save(rolEncontrado);
            } else {
                throw new Exception("El rol ya está activo.");
            }
        } else {
            throw new Exception("Rol no encontrado con el ID proporcionado.");
        }
    }

    // Método para obtener todos los roles (incluidos inactivos) - para administración
    @Transactional(readOnly = true)
    public List<Rol> obtenerRolesTodosInclusoInactivos() {
        return rolRepository.findAll();
    }

    @Transactional
    public void generarReporteRoles(OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/test3.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }
}