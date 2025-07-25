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
        return empleadoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Empleado> obtenerEmpleadosTodos() {
        return empleadoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Empleado> obtenerEmpleadosPorNombre(String nombre) {
        List<Empleado> empleados = empleadoRepository.findByNombreContaining(nombre);
        return empleados;
    }

    @Transactional
    public Empleado actualizarEmpleado(Empleado empleado) throws Exception {
        Empleado empleadoEncontrado = empleadoRepository.findById(empleado.getId()).get();
        if (empleadoEncontrado != null) {
            empleadoEncontrado.setNombre(empleado.getNombre());
            empleadoEncontrado.setApellidoPaterno(empleado.getApellidoPaterno());
            empleadoEncontrado.setApellidoMaterno(empleado.getApellidoMaterno());
            empleadoEncontrado.setCorreo(empleado.getCorreo());
            empleadoEncontrado.setTelefono(empleado.getTelefono());
            empleadoEncontrado.setFechaNacimiento(empleado.getFechaNacimiento());
            empleadoEncontrado.setFechaAlta(empleado.getFechaAlta());
           
            Empleado empleadoActualizado = empleadoRepository.save(empleadoEncontrado);
            return empleadoActualizado;
        } else {
            throw new Exception("Empleado no encontrado con el ID proporcionado.");
        }

    }

    @Transactional
    public void eliminarEmpleado(Long id) throws Exception {
        Optional<Empleado> empleadoEncontrado = empleadoRepository.findById(id);
        if (empleadoEncontrado.isPresent()) {
            empleadoRepository.deleteById(id);
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
}