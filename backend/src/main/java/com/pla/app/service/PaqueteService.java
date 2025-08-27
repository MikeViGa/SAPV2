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
        // Los campos de auditoría se establecen automáticamente con @PrePersist
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
        Optional<Paquete> paqueteEncontradoOpt = paqueteRepository.findById(paquete.getId());
        if (paqueteEncontradoOpt.isPresent()) {
            Paquete paqueteEncontrado = paqueteEncontradoOpt.get();
            
            // Actualizar campos
            paqueteEncontrado.setClave(paquete.getClave());
            paqueteEncontrado.setServicios(paquete.getServicios());
            paqueteEncontrado.setNumeroPagos(paquete.getNumeroPagos());
            paqueteEncontrado.setValorTotal(paquete.getValorTotal());
            paqueteEncontrado.setEnganche(paquete.getEnganche());
            paqueteEncontrado.setImporte(paquete.getImporte());
            paqueteEncontrado.setBovedas(paquete.getBovedas());
            paqueteEncontrado.setGavetas(paquete.getGavetas());
            paqueteEncontrado.setPlazoDePago(paquete.getPlazoDePago());
            paqueteEncontrado.setListaDePrecios(paquete.getListaDePrecios());
            paqueteEncontrado.setPeriodicidad(paquete.getPeriodicidad());
            paqueteEncontrado.setAtaud(paquete.getAtaud());
            
            // Los campos de auditoría se actualizan automáticamente con @PreUpdate
            return paqueteRepository.save(paqueteEncontrado);
        } else {
            throw new Exception("Paquete no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarPaquete(Long id) throws Exception {
        eliminarPaquete(id, "SYSTEM");
    }

    @Transactional
    public void eliminarPaquete(Long id, String modificadoPor) throws Exception {
        Optional<Paquete> paqueteEncontrado = paqueteRepository.findById(id);
        if (paqueteEncontrado.isPresent()) {
            // Usar soft delete en lugar de eliminación física
            paqueteRepository.softDeletePaquete(id, modificadoPor);
        } else {
            throw new Exception("Paquete no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void restaurarPaquete(Long id) throws Exception {
        restaurarPaquete(id, "SYSTEM");
    }

    @Transactional
    public void restaurarPaquete(Long id, String modificadoPor) throws Exception {
        Optional<Paquete> paqueteEncontrado = paqueteRepository.findByIdIncludingInactive(id);
        if (paqueteEncontrado.isPresent()) {
            paqueteRepository.restaurarPaquete(id, modificadoPor);
        } else {
            throw new Exception("Paquete no encontrado con el ID proporcionado.");
        }
    }

    @Transactional(readOnly = true)
    public List<Paquete> obtenerPaquetesTodosInclusoInactivos() {
        return paqueteRepository.findAllIncludingInactive();
    }

    public Optional<Paquete> obtenerPaquetePorIdInclusoInactivos(Long id) {
        return paqueteRepository.findByIdIncludingInactive(id);
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