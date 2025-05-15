package com.pla.app.service;

import java.io.InputStream;
import java.io.OutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.pla.app.model.Vendedor;
import com.pla.app.dto.ClaveSupervisadoDTO;
import com.pla.app.model.Supervisor;
import com.pla.app.repository.VendedorRepository;
import net.sf.jasperreports.engine.JasperRunManager;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.Optional;
import java.util.HashMap;
import java.sql.Connection;
import javax.sql.DataSource;
import java.util.ArrayList;

@Service
public class VendedorService {

    @Autowired
    private VendedorRepository vendedorRepository;
    @Autowired
    private DataSource dataSource;
    @Autowired
    private SupervisorService supervisorService;

    @Transactional
    public Vendedor crearVendedor(Vendedor vendedor) throws Exception {
        Optional<Supervisor> supervisor = supervisorService.obtenerSupervisorPorId(vendedor.getIdSupervisor());
        vendedor.setSupervisor(supervisor.get());
        return vendedorRepository.save(vendedor);
    }

    @Transactional(readOnly = true)
    public Optional<Vendedor> obtenerVendedorPorId(Long id) {
        return vendedorRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Vendedor> obtenerVendedores() {
        return vendedorRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Vendedor> obtenerVendedoresPorNombre(String nombreVendedor) {
        List<Vendedor> vendedores = vendedorRepository.findByNombreContaining(nombreVendedor);
        return vendedores;
    }

    @Transactional(readOnly = true)
    public List<Vendedor> obtenerSupervisadosPorVendedor(Long id) {
        List<Vendedor> vendedores = vendedorRepository.findSupervisadosByVendedorId(id);
        return vendedores;
    }

    @Transactional
    public Vendedor actualizarVendedor(Vendedor vendedor) throws Exception {
        Vendedor vendedorAEditar = vendedorRepository.findById(vendedor.getId())
                .orElseThrow(() -> new Exception("Vendedor no encontrado con el ID proporcionado."));

        Vendedor vendedorConMismoNombre = vendedorRepository.findByNombre(vendedor.getNombre());
        if (vendedorConMismoNombre != null && !vendedorConMismoNombre.getId().equals(vendedor.getId())) {
            throw new Exception("El nombre de vendedor ya está en uso.");
        }

        vendedorAEditar.setNombre(vendedor.getNombre());
        vendedorAEditar.setApellidoPaterno(vendedor.getApellidoPaterno());
        vendedorAEditar.setApellidoMaterno(vendedor.getApellidoMaterno());
        vendedorAEditar.setCalle(vendedor.getCalle());
        vendedorAEditar.setNumeroExterior(vendedor.getNumeroExterior());
        vendedorAEditar.setNumeroInterior(vendedor.getNumeroInterior());
        vendedorAEditar.setColonia(vendedor.getColonia());
        vendedorAEditar.setCiudad(vendedor.getCiudad());
        vendedorAEditar.setEstado(vendedor.getEstado());
        vendedorAEditar.setCodigoPostal(vendedor.getCodigoPostal());
        vendedorAEditar.setTelefono1(vendedor.getTelefono1());
        vendedorAEditar.setTelefono2(vendedor.getTelefono2());
        vendedorAEditar.setRegimen(vendedor.getRegimen());
        vendedorAEditar.setRfc(vendedor.getRfc());
        vendedorAEditar.setCurp(vendedor.getCurp());
        vendedorAEditar.setNumeroTarjeta(vendedor.getNumeroTarjeta());
        vendedorAEditar.setFechaAlta(vendedor.getFechaAlta());

        if (vendedor.getIdSupervisor() != null) {
            Supervisor supervisorAActualizar = supervisorService
                    .obtenerSupervisorPorId(vendedor.getIdSupervisor())
                    .orElseThrow(() -> new Exception("Supervisor no encontrado"));
            vendedorAEditar.setSupervisor(supervisorAActualizar);
        } else {
            vendedorAEditar.setSupervisor(null);
        }

        if (vendedorAEditar.getSupervisados() != null) {
            for (Vendedor supervisado : vendedorAEditar.getSupervisados()) {
                supervisado.setSuperVendedor(null);
            }
            vendedorAEditar.getSupervisados().clear();
        }

        if (vendedor.getClavesSupervisados() != null) {
            for (ClaveSupervisadoDTO clave : vendedor.getClavesSupervisados()) {
                Vendedor supervisado = vendedorRepository.findById(clave.getId())
                        .orElseThrow(() -> new Exception("Vendedor supervisado no encontrado: " + clave.getId()));

                supervisado.setSuperVendedor(vendedorAEditar);
                if (vendedorAEditar.getSupervisados() == null) {
                    vendedorAEditar.setSupervisados(new ArrayList<>());
                }
                vendedorAEditar.getSupervisados().add(supervisado);
            }
        }

        return vendedorRepository.save(vendedorAEditar);
    }

    @Transactional
    public void eliminarVendedor(Long id) throws Exception {
        Optional<Vendedor> vendedorEncontrado = vendedorRepository.findById(id);
        if (vendedorEncontrado.isPresent()) {
            vendedorRepository.deleteById(id);
        } else {
            throw new Exception("Vendedor no encontrado con el ID proporcionado.");
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
    public void generarReporteVendedores(OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/reportevendedores.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }

    @Transactional
    public void generarReporteVendedoresSubvendedores(OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/reportevendedoressubvendedores.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }
}