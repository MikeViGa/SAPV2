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
        Cliente clienteAEditar = null;
        Cliente clienteEncontrado = clienteRepository.findById(cliente.getId()).get();
        if (clienteEncontrado != null) {
            clienteEncontrado = clienteRepository.findByNombre(cliente.getNombre());
            if (clienteEncontrado.getId() == cliente.getId()) {
                clienteAEditar = clienteEncontrado;
                clienteAEditar.setNombre(cliente.getNombre());
                clienteAEditar.setApellidoPaterno(cliente.getApellidoPaterno());
                clienteAEditar.setApellidoMaterno(cliente.getApellidoMaterno());
                clienteAEditar.setCalle(cliente.getCalle());
                clienteAEditar.setNumeroExterior(cliente.getNumeroExterior());
                clienteAEditar.setNumeroInterior(cliente.getNumeroInterior());
                clienteAEditar.setColonia(cliente.getColonia());
                clienteAEditar.setCiudad(cliente.getCiudad());
                clienteAEditar.setEstado(cliente.getEstado());
                clienteAEditar.setCodigoPostal(cliente.getCodigoPostal());
                clienteAEditar.setTelefono1(cliente.getTelefono1());
                clienteAEditar.setTelefono2(cliente.getTelefono2());
                clienteAEditar.setRegimen(cliente.getRegimen());
                clienteAEditar.setRfc(cliente.getRfc());
                Cliente clienteActualizado = clienteRepository.save(clienteAEditar);
                return clienteActualizado;

            } else {
                throw new Exception("El nombre de cliente ya está en uso.");
            }
        } else {
            throw new Exception("Cliente no encontrado con el ID proporcionado.");
        }
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
}