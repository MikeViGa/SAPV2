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
        return sucursalRepository.findByIdAndActive(id);
    }

    @Transactional(readOnly = true)
    public List<Sucursal> obtenerSucursales() {
        return sucursalRepository.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<Sucursal> obtenerSucursalesPorNombre(String nombreSucursal) {
        List<Sucursal> sucursales = sucursalRepository.findByNombreContainingAndActive(nombreSucursal);
        return sucursales;
    }

    @Transactional
    public Sucursal actualizarSucursal(Sucursal sucursal) throws Exception {
        Optional<Sucursal> opt = sucursalRepository.findByIdAndActive(sucursal.getId());
        if (opt.isEmpty()) {
            throw new Exception("Sucursal no encontrada con el ID proporcionado.");
        }
        Sucursal existente = opt.get();
        existente.setNombre(sucursal.getNombre());
        existente.setActivo(sucursal.getActivo());
        return sucursalRepository.save(existente);
    }

    @Transactional
    public void eliminarSucursal(Long id) throws Exception {
        Optional<Sucursal> sucursalEncontradoOpt = sucursalRepository.findByIdAndActive(id);
        if (sucursalEncontradoOpt.isPresent()) {
            Sucursal sucursalEncontrada = sucursalEncontradoOpt.get();
            sucursalEncontrada.setActivo(false); // Soft delete
            sucursalRepository.save(sucursalEncontrada);
        } else {
            throw new Exception("Sucursal no encontrada con el ID proporcionado.");
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

    // Método adicional para recuperar una sucursal eliminada
    @Transactional
    public void restaurarSucursal(Long id) throws Exception {
        Optional<Sucursal> sucursalEncontradoOpt = sucursalRepository.findById(id);
        if (sucursalEncontradoOpt.isPresent()) {
            Sucursal sucursalEncontrada = sucursalEncontradoOpt.get();
            if (!sucursalEncontrada.getActivo()) {
                sucursalEncontrada.setActivo(true);
                sucursalRepository.save(sucursalEncontrada);
            } else {
                throw new Exception("La sucursal ya está activa.");
            }
        } else {
            throw new Exception("Sucursal no encontrada con el ID proporcionado.");
        }
    }

    // Métodos para obtener todas las sucursales (incluidas inactivas) - para administración
    @Transactional(readOnly = true)
    public List<Sucursal> obtenerSucursalesTodasInclusoInactivas() {
        return sucursalRepository.findAll();
    }
}