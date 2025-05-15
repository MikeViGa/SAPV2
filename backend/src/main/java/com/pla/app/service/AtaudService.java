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
import com.pla.app.model.Ataud;
import com.pla.app.repository.AtaudRepository;
import net.sf.jasperreports.engine.JasperRunManager;

@Service
public class AtaudService {

    @Autowired
    private AtaudRepository ataudRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public Ataud crearAtaud(Ataud ataud) throws Exception {
        return ataudRepository.save(ataud);
    }

    public Optional<Ataud> obtenerAtaudPorId(Long id) {
        return ataudRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Ataud> obtenerAtaudesTodos() {
        return ataudRepository.findAll();
    }

    @Transactional
    public Ataud actualizarAtaud(Ataud ataud) throws Exception {
        Ataud ataudEncontrado = ataudRepository.findById(ataud.getId()).get();
        if (ataudEncontrado != null) {
            ataudEncontrado.setDescripcion(ataud.getDescripcion());
            Ataud ataudActualizado = ataudRepository.save(ataudEncontrado);
            return ataudActualizado;
        } else {
            throw new Exception("Ataud no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarAtaud(Long id) throws Exception {
        Optional<Ataud> ataudEncontrado = ataudRepository.findById(id);
        if (ataudEncontrado.isPresent()) {
            ataudRepository.deleteById(id);
        } else {
            throw new Exception("Ataud no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void generarReporteAtaudes(OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/test3.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }
}