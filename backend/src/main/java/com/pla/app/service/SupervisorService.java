package com.pla.app.service;

import java.io.InputStream;
import java.io.OutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.pla.app.model.Supervisor;
import com.pla.app.repository.SupervisorRepository;
import net.sf.jasperreports.engine.JasperRunManager;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.Optional;
import java.util.HashMap;
import java.sql.Connection;
import javax.sql.DataSource;

@Service
public class SupervisorService {
    @Autowired
    private SupervisorRepository supervisorRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public Supervisor crearSupervisor(Supervisor supervisor) throws Exception {
        return supervisorRepository.save(supervisor);
    }

    @Transactional(readOnly = true)
    public Optional<Supervisor> obtenerSupervisorPorId(Long id) {
        return supervisorRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Supervisor> obtenerSupervisores() {
        return supervisorRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Supervisor> obtenerSupervisoresPorNombre(String nombreSupervisor) {
        List<Supervisor> supervisores = supervisorRepository.findByNombreContaining(nombreSupervisor);
        return supervisores;
    }

    @Transactional
    public Supervisor actualizarSupervisor(Supervisor supervisor) throws Exception {
        Supervisor supervisorAEditar = null;
        Supervisor supervisorEncontrado = supervisorRepository.findById(supervisor.getId()).get();
        if (supervisorEncontrado != null) {
            supervisorEncontrado = supervisorRepository.findByNombre(supervisor.getNombre());
            if (supervisorEncontrado.getId() == supervisor.getId()) {
                supervisorAEditar = supervisorEncontrado;
                supervisorAEditar.setNombre(supervisor.getNombre());
                supervisorAEditar.setApellidoPaterno(supervisor.getApellidoPaterno());
                supervisorAEditar.setApellidoMaterno(supervisor.getApellidoMaterno());
                supervisorAEditar.setCalle(supervisor.getCalle());
                supervisorAEditar.setNumeroExterior(supervisor.getNumeroExterior());
                supervisorAEditar.setNumeroInterior(supervisor.getNumeroInterior());
                supervisorAEditar.setColonia(supervisor.getColonia());
                supervisorAEditar.setCiudad(supervisor.getCiudad());
                supervisorAEditar.setEstado(supervisor.getEstado());
                supervisorAEditar.setCodigoPostal(supervisor.getCodigoPostal());
                supervisorAEditar.setTelefono1(supervisor.getTelefono1());
                supervisorAEditar.setTelefono2(supervisor.getTelefono2());
                supervisorAEditar.setRegimen(supervisor.getRegimen());
                supervisorAEditar.setRfc(supervisor.getRfc());
                supervisorAEditar.setCurp(supervisor.getCurp());
                supervisorAEditar.setNumeroTarjeta(supervisor.getNumeroTarjeta());
                supervisorAEditar.setFechaAlta(supervisor.getFechaAlta());
                supervisorAEditar.setComision(supervisor.getComision());
                Supervisor supervisorActualizado = supervisorRepository.save(supervisorAEditar);
                return supervisorActualizado;
            } else {
                throw new Exception("El nombre de supervisor ya está en uso.");
            }
        } else {
            throw new Exception("Supervisor no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarSupervisor(Long id) throws Exception {
        Optional<Supervisor> supervisorEncontrado = supervisorRepository.findById(id);
        if (supervisorEncontrado.isPresent()) {
            supervisorRepository.deleteById(id);
        } else {
            throw new Exception("Supervisor no encontrado con el ID proporcionado.");
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
        ClassPathResource resource = new ClassPathResource("reportes/reportesolosupervisores.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }
}