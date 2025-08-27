package com.pla.app.service;

import java.io.InputStream;
import java.io.OutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.pla.app.model.Cliente;
import com.pla.app.repository.ClienteRepository;
import com.pla.app.dto.clientes.ClienteListadoProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        return clienteRepository.findByIdAndActive(id);
    }

    @Transactional(readOnly = true)
    public List<Cliente> obtenerClientes() {
        return clienteRepository.findAllActive();
    }

    @Transactional(readOnly = true)
    public Page<ClienteListadoProjection> obtenerClientesPaginado(Pageable pageable) {
        return clienteRepository.findListadoActive(pageable);
    }

    @Transactional(readOnly = true)
    public List<Cliente> obtenerClientesPorNombre(String nombreCliente) {
        List<Cliente> clientes = clienteRepository.findByNombreContainingAndActive(nombreCliente);
        return clientes;
    }

    @Transactional
    public Cliente actualizarCliente(Cliente cliente) throws Exception {
        Optional<Cliente> opt = clienteRepository.findByIdAndActive(cliente.getId());
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
        existente.setEstadoCivil(cliente.getEstadoCivil());
        existente.setActivo(cliente.getActivo());

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
        Optional<Cliente> clienteEncontradoOpt = clienteRepository.findByIdAndActive(id);
        if (clienteEncontradoOpt.isPresent()) {
            Cliente clienteEncontrado = clienteEncontradoOpt.get();
            clienteEncontrado.setActivo(false); // Soft delete
            clienteRepository.save(clienteEncontrado);
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
        ClassPathResource resource = new ClassPathResource("MyReports/reporteclientesfechas.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }

    @Transactional
    public void generarReporteClientesPorFechas(String fechaInicial, String fechaFinal, OutputStream outputStream)
            throws Exception {
        ClassPathResource resource = new ClassPathResource("MyReports/reporteclientesfechas.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        parametros.put("fechaInicial", fechaInicial);
        parametros.put("fechaFinal", fechaFinal);
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }

        @Transactional
    public void generarReporteClientesPorColonia(String colonia, OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("MyReports/reporteclientescolonia.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        parametros.put("colonia", colonia);
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }

    @Transactional(readOnly = true)
    public List<String> obtenerColoniasClientes(String q) {
        return clienteRepository.findDistinctColoniasContaining(q == null ? "" : q);
    }

    // Método adicional para recuperar un cliente eliminado
    @Transactional
    public void restaurarCliente(Long id) throws Exception {
        Optional<Cliente> clienteEncontradoOpt = clienteRepository.findById(id);
        if (clienteEncontradoOpt.isPresent()) {
            Cliente clienteEncontrado = clienteEncontradoOpt.get();
            if (!clienteEncontrado.getActivo()) {
                clienteEncontrado.setActivo(true);
                clienteRepository.save(clienteEncontrado);
            } else {
                throw new Exception("El cliente ya está activo.");
            }
        } else {
            throw new Exception("Cliente no encontrado con el ID proporcionado.");
        }
    }

    // Métodos para obtener todos los clientes (incluidos inactivos) - para administración
    @Transactional(readOnly = true)
    public List<Cliente> obtenerClientesTodosInclusoInactivos() {
        return clienteRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<ClienteListadoProjection> obtenerClientesPaginadoInclusoInactivos(Pageable pageable) {
        return clienteRepository.findListado(pageable);
    }
}