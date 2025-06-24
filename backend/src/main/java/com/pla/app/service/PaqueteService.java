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
import com.pla.app.model.Paquete;
import com.pla.app.repository.PaqueteRepository;
import net.sf.jasperreports.engine.JasperRunManager;

@Service
public class PaqueteService {

    @Autowired
    private PaqueteRepository paqueteRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public Paquete crearPaquete(Paquete paquete) throws Exception {
        return paqueteRepository.save(paquete);
    }

    public Optional<Paquete> obtenerPaquetePorId(Long id) {
        return paqueteRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Paquete> obtenerPaquetesTodos() {
        return paqueteRepository.findAll();
    }

    @Transactional
    public Paquete actualizarPaquete(Paquete paquete) throws Exception {
        Paquete paqueteEncontrado = paqueteRepository.findById(paquete.getId()).get();
        if (paqueteEncontrado != null) {
            // paqueteEncontrado.setDescripcion(paquete.obtenerDescripcion());
            Paquete paqueteActualizado = paqueteRepository.save(paqueteEncontrado);
            return paqueteActualizado;
        } else {
            throw new Exception("Paquete no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarPaquete(Long id) throws Exception {
        Optional<Paquete> paqueteEncontrado = paqueteRepository.findById(id);
        if (paqueteEncontrado.isPresent()) {
            paqueteRepository.deleteById(id);
        } else {
            throw new Exception("Paquete no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void generarReportePaquetes(OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/test3.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }
}