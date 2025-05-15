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
import com.pla.app.model.PlazoDePago;
import com.pla.app.repository.PlazoDePagoRepository;
import net.sf.jasperreports.engine.JasperRunManager;

@Service
public class PlazoDePagoService {

    @Autowired
    private PlazoDePagoRepository plazoDePagoRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public PlazoDePago crearPlazoDePago(PlazoDePago plazoDePago) throws Exception {
        return plazoDePagoRepository.save(plazoDePago);
    }

    public Optional<PlazoDePago> obtenerPlazoDePagoPorId(Long id) {
        return plazoDePagoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<PlazoDePago> obtenerPlazosDePagoTodos() {
        return plazoDePagoRepository.findAll();
    }

    @Transactional
    public PlazoDePago actualizarPlazoDePago(PlazoDePago plazoDePago) throws Exception {
        PlazoDePago plazoDePagoEncontrado = plazoDePagoRepository.findById(plazoDePago.getId()).get();
        if (plazoDePagoEncontrado != null) {
            plazoDePagoEncontrado.setNombre(plazoDePago.getNombre());
            PlazoDePago plazoDePagoActualizado = plazoDePagoRepository.save(plazoDePagoEncontrado);
            return plazoDePagoActualizado;
        } else {
            throw new Exception("Plazo de pago no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarPlazoDePago(Long id) throws Exception {
        Optional<PlazoDePago> plazoDePagoEncontrado = plazoDePagoRepository.findById(id);
        if (plazoDePagoEncontrado.isPresent()) {
            plazoDePagoRepository.deleteById(id);
        } else {
            throw new Exception("Plazo de pago no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void generarReportePlazosDePago(OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/test3.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }
}