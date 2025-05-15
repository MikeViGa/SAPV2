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
import com.pla.app.model.Ubicacion;
import com.pla.app.repository.JardinRepository;
import com.pla.app.repository.UbicacionRepository;
import net.sf.jasperreports.engine.JasperRunManager;

@Service
public class UbicacionService {

    @Autowired
    private UbicacionRepository ubicacionRepository;
    @Autowired
    private JardinRepository jardinRepository;

    @Autowired
    private DataSource dataSource;

    @Transactional
    public Ubicacion crearUbicacion(Ubicacion ubicacion) throws Exception {
        return ubicacionRepository.save(ubicacion);
    }

    public Optional<Ubicacion> obtenerUbicacionPorId(Long id) {
        return ubicacionRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Ubicacion> obtenerUbicacionesTodos() {
        return ubicacionRepository.findAll();
    }


    @Transactional(readOnly = true)
    public List<Ubicacion> obtenerUbicacionesPorJardin(String id) {
        Jardin jardin = jardinRepository.findById(id).get();
        return ubicacionRepository.findByJardin(jardin);
    }


    @Transactional
    public Ubicacion actualizarUbicacion(Ubicacion ubicacion) throws Exception {
        Ubicacion ubicacionEncontrado = ubicacionRepository.findById(ubicacion.getId()).get();
        if (ubicacionEncontrado != null) {
            ubicacionEncontrado.setCoordenada(ubicacion.getCoordenada());
            Ubicacion ubicacionActualizado = ubicacionRepository.save(ubicacionEncontrado);
            return ubicacionActualizado;
        } else {
            throw new Exception("Ubicacion no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarUbicacion(Long id) throws Exception {
        Optional<Ubicacion> ubicacionEncontrado = ubicacionRepository.findById(id);
        if (ubicacionEncontrado.isPresent()) {
            ubicacionRepository.deleteById(id);
        } else {
            throw new Exception("Ubicacion no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void generarReporteUbicaciones(OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/test3.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }
}