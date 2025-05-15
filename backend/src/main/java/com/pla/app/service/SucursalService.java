package com.pla.app.service;

import java.io.InputStream;
import java.io.OutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.pla.app.model.Sucursal;
import com.pla.app.repository.SucursalRepository;
import net.sf.jasperreports.engine.JasperRunManager;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.Optional;
import java.util.HashMap;
import java.sql.Connection;
import javax.sql.DataSource;

@Service
public class SucursalService {

    @Autowired
    private SucursalRepository sucursalRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public Sucursal crearSucursal(Sucursal sucursal) throws Exception {
        return sucursalRepository.save(sucursal);
    }

    @Transactional(readOnly = true)
    public Optional<Sucursal> obtenerSucursalPorId(Long id) {
        return sucursalRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Sucursal> obtenerSucursales() {
        return sucursalRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Sucursal> obtenerSucursalesPorNombre(String nombreSucursal) {
        List<Sucursal> sucursales = sucursalRepository.findByNombreContaining(nombreSucursal);
        return sucursales;
    }

    @Transactional
    public Sucursal actualizarSucursal(Sucursal sucursal) throws Exception {
        Sucursal sucursalAEditar = null;
        Sucursal sucursalEncontrado = sucursalRepository.findById(sucursal.getId()).get();
        if (sucursalEncontrado != null) {
            sucursalEncontrado = sucursalRepository.findByNombre(sucursal.getNombre());
            if (sucursalEncontrado.getId() == sucursal.getId()) {
                sucursalAEditar = sucursalEncontrado;
                sucursalAEditar.setNombre(sucursal.getNombre());
                Sucursal sucursalActualizado = sucursalRepository.save(sucursalAEditar);
                return sucursalActualizado;

            } else {
                throw new Exception("El nombre de sucursal ya está en uso.");
            }
        } else {
            throw new Exception("Sucursal no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarSucursal(Long id) throws Exception {
        Optional<Sucursal> sucursalEncontrado = sucursalRepository.findById(id);
        if (sucursalEncontrado.isPresent()) {
            sucursalRepository.deleteById(id);
        } else {
            throw new Exception("Sucursal no encontrado con el ID proporcionado.");
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