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
import com.pla.app.model.Jardin;
import com.pla.app.repository.JardinRepository;
import net.sf.jasperreports.engine.JasperRunManager;

@Service
public class JardinService {

    @Autowired
    private JardinRepository jardinRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public Jardin crearJardin(Jardin jardin) throws Exception {
        return jardinRepository.save(jardin);
    }

     @Transactional
    public Jardin actualizarJardin(Jardin jardin) throws Exception {
        Jardin jardinEncontrado = jardinRepository.findById(jardin.getId()).get();
        if (jardinEncontrado != null) {
            jardinEncontrado.setNombre(jardin.getNombre());
            Jardin ataudActualizado = jardinRepository.save(jardinEncontrado);
            return ataudActualizado;
        } else {
            throw new Exception("Jardin no encontrado con el ID proporcionado.");
        }
    }

    public Optional<Jardin> obtenerJardinPorId(Long id) {
        return jardinRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Jardin> obtenerJardinesTodos() {
        return jardinRepository.findAll();
    }

    @Transactional
    public Jardin Jardin(Jardin jardin) throws Exception {
        Jardin jardinEncontrado = jardinRepository.findById(jardin.getId()).get();
        if (jardinEncontrado != null) {
            jardinEncontrado.setNombre(jardin.getNombre());
            Jardin jardinActualizado = jardinRepository.save(jardinEncontrado);
            return jardinActualizado;
        } else {
            throw new Exception("Jardín no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarJardin(Long id) throws Exception {
        Optional<Jardin> jardinEncontrado = jardinRepository.findById(id);
        if (jardinEncontrado.isPresent()) {
            //jardinRepository.deleteById(id);
        } else {
            throw new Exception("Jardin no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void generarReporteJardines(OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/test3.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }
}