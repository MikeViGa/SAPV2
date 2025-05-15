package com.pla.app.service;

import java.io.InputStream;
import java.io.OutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.pla.app.model.Solicitud;
import com.pla.app.repository.SolicitudRepository;
import net.sf.jasperreports.engine.JasperRunManager;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.Optional;
import java.util.HashMap;
import java.sql.Connection;
import javax.sql.DataSource;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public Solicitud crearSolicitud(Solicitud solicitud) throws Exception {
        return solicitudRepository.save(solicitud);
    }

    @Transactional(readOnly = true)
    public Optional<Solicitud> obtenerSolicitudPorId(Long id) {
        return solicitudRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Solicitud> obtenerSolicitudes() {
        return solicitudRepository.findAll();
    }

    @Transactional
    public Solicitud actualizarSolicitud(Solicitud solicitud) throws Exception {
        Solicitud solicitudAEditar = null;
        Solicitud solicitudEncontrado = solicitudRepository.findById(solicitud.getClaveSolicitud()).get();
        if (solicitudEncontrado != null) {
            solicitudEncontrado = solicitudRepository.findByClaveContrato(solicitud.getClaveContrato());
            if (solicitudEncontrado.getClaveSolicitud() == solicitud.getClaveSolicitud()) {
                solicitudAEditar = solicitudEncontrado;
                solicitudAEditar.setClaveContrato(solicitud.getClaveContrato());
                Solicitud solicitudActualizado = solicitudRepository.save(solicitudAEditar);
                return solicitudActualizado;

            } else {
                throw new Exception("El nombre de solicitud ya está en uso.");
            }
        } else {
            throw new Exception("Solicitud no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarSolicitud(Long id) throws Exception {
        Optional<Solicitud> solicitudEncontrado = solicitudRepository.findById(id);
        if (solicitudEncontrado.isPresent()) {
            solicitudRepository.deleteById(id);
        } else {
            throw new Exception("Solicitud no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void generarRetardo(int retardo) {
        try {
            TimeUnit.SECONDS.sleep(retardo);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public void generarReporte(OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/test3.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }
}