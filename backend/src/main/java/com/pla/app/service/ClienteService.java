package com.pla.app.service;

import java.io.InputStream;
import java.io.OutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.pla.app.model.Cliente;
import com.pla.app.repository.ClienteRepository;
import net.sf.jasperreports.engine.JasperRunManager;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.Optional;
import java.util.HashMap;
import java.sql.Connection;
import javax.sql.DataSource;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public Cliente crearCliente(Cliente cliente) throws Exception {
        if (cliente.getDomicilios() != null) {
            cliente.getDomicilios().forEach(d -> d.setCliente(cliente));
        }
        return clienteRepository.save(cliente);
    }

    @Transactional(readOnly = true)
    public Optional<Cliente> obtenerClientePorId(Long id) {
        return clienteRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Cliente> obtenerClientes() {
        return clienteRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Cliente> obtenerClientesPorNombre(String nombreCliente) {
        List<Cliente> clientes = clienteRepository.findByNombreContaining(nombreCliente);
        return clientes;
    }

    @Transactional
    public Cliente actualizarCliente(Cliente cliente) throws Exception {
        Optional<Cliente> opt = clienteRepository.findById(cliente.getId());
        if (opt.isEmpty()) {
            throw new Exception("Cliente no encontrado con el ID proporcionado.");
        }
        Cliente existente = opt.get();
        existente.setNombre(cliente.getNombre());
        existente.setApellidoPaterno(cliente.getApellidoPaterno());
        existente.setApellidoMaterno(cliente.getApellidoMaterno());
        existente.setFechaNacimiento(cliente.getFechaNacimiento());
        existente.setRfc(cliente.getRfc());
        existente.setFechaRegistro(cliente.getFechaRegistro());
        existente.setOcupacion(cliente.getOcupacion());
        existente.setTelefono1(cliente.getTelefono1());
        existente.setTelefono2(cliente.getTelefono2());
        existente.setRegimen(cliente.getRegimen());

        // Sincronizar domicilios (orphanRemoval = true)
        existente.getDomicilios().clear();
        if (cliente.getDomicilios() != null) {
            cliente.getDomicilios().forEach(d -> {
                d.setCliente(existente);
                existente.getDomicilios().add(d);
            });
        }

        return clienteRepository.save(existente);
    }

    @Transactional
    public void eliminarCliente(Long id) throws Exception {
        Optional<Cliente> clienteEncontrado = clienteRepository.findById(id);
        if (clienteEncontrado.isPresent()) {
            clienteRepository.deleteById(id);
        } else {
            throw new Exception("Cliente no encontrado con el ID proporcionado.");
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
    public void generarReporteClientes(OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/reporteclientesfechas.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }

    @Transactional
    public void generarReporteClientesPorFechas(String fechaInicial, String fechaFinal, OutputStream outputStream)
            throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/reporteclientesfechas.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        parametros.put("fechaInicial", fechaInicial);
        parametros.put("fechaFinal", fechaFinal);
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }

    /* 
    @Transactional
    public void generarReporteClientesPorColonia(String colonia, OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/reporteclientescolonia.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        parametros.put("colonia", colonia);
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }

    @Transactional
    public List<String> obtenerColoniasClientes() {
        List<String> colonias = clienteRepository.findDistinctColonias();
        return colonias;
    }
        */
}