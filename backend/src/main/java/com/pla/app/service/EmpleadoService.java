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
import com.pla.app.repository.EmpleadoRepository;
import net.sf.jasperreports.engine.JasperRunManager;
import com.pla.app.model.Empleado;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public Empleado crearEmpleado(Empleado empleado) throws Exception {
        return empleadoRepository.save(empleado);
    }

    @Transactional(readOnly = true)
    public Optional<Empleado> obtenerEmpleadoPorId(Long id) {
        return empleadoRepository.findByIdAndActive(id);
    }

    @Transactional(readOnly = true)
    public List<Empleado> obtenerEmpleadosTodos() {
        return empleadoRepository.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<Empleado> obtenerEmpleadosPorNombre(String nombre) {
        List<Empleado> empleados = empleadoRepository.findByNombreContainingAndActive(nombre);
        return empleados;
    }

    @Transactional
    public Empleado actualizarEmpleado(Empleado empleado) throws Exception {
        Optional<Empleado> opt = empleadoRepository.findByIdAndActive(empleado.getId());
        if (opt.isEmpty()) {
            throw new Exception("Empleado no encontrado con el ID proporcionado.");
        }
        Empleado existente = opt.get();
        existente.setNombre(empleado.getNombre());
        existente.setApellidoPaterno(empleado.getApellidoPaterno());
        existente.setApellidoMaterno(empleado.getApellidoMaterno());
        existente.setCorreo(empleado.getCorreo());
        existente.setTelefono(empleado.getTelefono());
        existente.setFechaNacimiento(empleado.getFechaNacimiento());
        existente.setFechaAlta(empleado.getFechaAlta());
        existente.setEstado(empleado.getEstado());
        existente.setActivo(empleado.getActivo());
        
        return empleadoRepository.save(existente);
    }

    @Transactional
    public void eliminarEmpleado(Long id) throws Exception {
        Optional<Empleado> empleadoEncontradoOpt = empleadoRepository.findByIdAndActive(id);
        if (empleadoEncontradoOpt.isPresent()) {
            Empleado empleadoEncontrado = empleadoEncontradoOpt.get();
            empleadoEncontrado.setActivo(false); // Soft delete
            empleadoRepository.save(empleadoEncontrado);
        } else {
            throw new Exception("Empleado no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void generarReporteEmpleados(OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/reporteempleados.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }

    // Método adicional para recuperar un empleado eliminado
    @Transactional
    public void restaurarEmpleado(Long id) throws Exception {
        Optional<Empleado> empleadoEncontradoOpt = empleadoRepository.findById(id);
        if (empleadoEncontradoOpt.isPresent()) {
            Empleado empleadoEncontrado = empleadoEncontradoOpt.get();
            if (!empleadoEncontrado.getActivo()) {
                empleadoEncontrado.setActivo(true);
                empleadoRepository.save(empleadoEncontrado);
            } else {
                throw new Exception("El empleado ya está activo.");
            }
        } else {
            throw new Exception("Empleado no encontrado con el ID proporcionado.");
        }
    }

    // Métodos para obtener todos los empleados (incluidos inactivos) - para administración
    @Transactional(readOnly = true)
    public List<Empleado> obtenerEmpleadosTodosInclusoInactivos() {
        return empleadoRepository.findAll();
    }
}