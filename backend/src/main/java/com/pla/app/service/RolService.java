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
        return rolRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Rol> obtenerRolesTodos() {
        return rolRepository.findAll();
    }

    @Transactional
    public Rol actualizarRol(Rol rol) throws Exception {
        Rol rolEncontrado = rolRepository.findById(rol.getId()).get();
        if (rolEncontrado != null) {
            rolEncontrado.setNombre(rol.getNombre());
            Rol rolActualizado = rolRepository.save(rolEncontrado);
            return rolActualizado;
        } else {
            throw new Exception("Rol no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarRol(Long id) throws Exception {
        Optional<Rol> rolEncontrado = rolRepository.findById(id);
        if (rolEncontrado.isPresent()) {
            rolRepository.deleteById(id);
        } else {
            throw new Exception("Rol no encontrado con el ID proporcionado.");
        }
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