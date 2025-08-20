package com.pla.app.service;

import java.io.InputStream;
import java.io.OutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.pla.app.model.Solicitud;
import com.pla.app.repository.SolicitudRepository;
import net.sf.jasperreports.engine.JasperRunManager;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.Optional;
import java.util.HashMap;
import java.sql.Connection;
import javax.sql.DataSource;
import com.pla.app.dto.solicitudes.SolicitudResponseDTO;
import java.time.format.DateTimeFormatter;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public Solicitud crearSolicitud(Solicitud solicitud) throws Exception {
        return solicitudRepository.save(solicitud);
    }

    @Transactional(readOnly = true)
    public Optional<Solicitud> obtenerSolicitudPorId(Long id) {
        return solicitudRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Solicitud> obtenerSolicitudes() {
        return solicitudRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Solicitud> obtenerSolicitudesPaginado(Pageable pageable) {
        return solicitudRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<SolicitudResponseDTO> obtenerSolicitudesPaginadoDTO(Pageable pageable) {
        Page<Solicitud> pagina = solicitudRepository.findAll(pageable);
        return pagina.map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public Optional<SolicitudResponseDTO> obtenerSolicitudDTO(Long id) {
        return solicitudRepository.findById(id).map(this::toDTO);
    }

    private SolicitudResponseDTO toDTO(Solicitud s) {
        SolicitudResponseDTO dto = new SolicitudResponseDTO();
        dto.setId(s.getId());
        dto.setClaveSolicitud(s.getClaveSolicitud());
        dto.setClaveContrato(s.getClaveContrato());
        dto.setComision(s.getComision());
        DateTimeFormatter df = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        dto.setFechaAlta(s.getFechaAlta() != null ? s.getFechaAlta().format(df) : null);
        dto.setFechaVenta(s.getFechaVenta() != null ? s.getFechaVenta().format(df) : null);
        dto.setFechaVencimiento(s.getFechaVencimiento() != null ? s.getFechaVencimiento().format(df) : null);
        dto.setFechaEntrega(s.getFechaEntrega() != null ? s.getFechaEntrega().format(df) : null);
        dto.setVendedorNombre(s.getVendedor() != null ? String.join(" ",
                (s.getVendedor().getNombre() != null ? s.getVendedor().getNombre() : ""),
                (s.getVendedor().getApellidoPaterno() != null ? s.getVendedor().getApellidoPaterno() : ""),
                (s.getVendedor().getApellidoMaterno() != null ? s.getVendedor().getApellidoMaterno() : "")).trim() : null);
        dto.setClienteNombre(s.getCliente() != null ? String.join(" ",
                (s.getCliente().getNombre() != null ? s.getCliente().getNombre() : ""),
                (s.getCliente().getApellidoPaterno() != null ? s.getCliente().getApellidoPaterno() : ""),
                (s.getCliente().getApellidoMaterno() != null ? s.getCliente().getApellidoMaterno() : "")).trim() : null);
        dto.setSucursalNombre(s.getSucursal() != null ? s.getSucursal().getNombre() : null);
        dto.setPaqueteClave(s.getPaquete() != null ? s.getPaquete().getClave() : null);
        dto.setNombreBeneficiario1(s.getNombreBeneficiario1());
        dto.setApellidoPaternoBeneficiario1(s.getApellidoPaternoBeneficiario1());
        dto.setApellidoMaternoBeneficiario1(s.getApellidoMaternoBeneficiario1());
        dto.setNombreBeneficiario2(s.getNombreBeneficiario2());
        dto.setApellidoPaternoBeneficiario2(s.getApellidoPaternoBeneficiario2());
        dto.setApellidoMaternoBeneficiario2(s.getApellidoMaternoBeneficiario2());
        dto.setNombreBeneficiario3(s.getNombreBeneficiario3());
        dto.setApellidoPaternoBeneficiario3(s.getApellidoPaternoBeneficiario3());
        dto.setApellidoMaternoBeneficiario3(s.getApellidoMaternoBeneficiario3());
        return dto;
    }

    @Transactional(readOnly = true)
    public Page<Solicitud> obtenerSolicitudes(Pageable pageable) {
        return solicitudRepository.findAll(pageable);
    }

    @Transactional
    public Solicitud actualizarSolicitud(Solicitud solicitud) throws Exception {
        Solicitud solicitudAEditar = null;
        Solicitud solicitudEncontrado = solicitudRepository.findById(solicitud.getId()).get();
        if (solicitudEncontrado != null) {
            solicitudEncontrado = solicitudRepository.findByClaveContrato(solicitud.getClaveContrato());
            if (solicitudEncontrado.getId() == solicitud.getId()) {
                solicitudAEditar = solicitudEncontrado;
                solicitudAEditar.setClaveContrato(solicitud.getClaveContrato());
                Solicitud solicitudActualizado = solicitudRepository.save(solicitudAEditar);
                return solicitudActualizado;

            } else {
                throw new Exception("El nombre de solicitud ya está en uso.");
            }
        } else {
            throw new Exception("Solicitud no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarSolicitud(Long id) throws Exception {
        Optional<Solicitud> solicitudEncontrado = solicitudRepository.findById(id);
        if (solicitudEncontrado.isPresent()) {
            solicitudRepository.deleteById(id);
        } else {
            throw new Exception("Solicitud no encontrado con el ID proporcionado.");
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