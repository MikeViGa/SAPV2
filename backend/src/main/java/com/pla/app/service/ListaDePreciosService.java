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
import com.pla.app.model.ListaDePrecios;
import com.pla.app.repository.ListaDePreciosRepository;
import net.sf.jasperreports.engine.JasperRunManager;

@Service
public class ListaDePreciosService {

    @Autowired
    private ListaDePreciosRepository listaDePreciosRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public ListaDePrecios crearListaDePrecios(ListaDePrecios listaDePrecios) throws Exception {
        return listaDePreciosRepository.save(listaDePrecios);
    }

    public Optional<ListaDePrecios> obtenerListaDePreciosPorId(String id) {
        return listaDePreciosRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<ListaDePrecios> obtenerListasDePreciosTodos() {
        return listaDePreciosRepository.findAll();
    }

    @Transactional
    public ListaDePrecios actualizarListaDePrecios(ListaDePrecios listaDePrecios) throws Exception {
        ListaDePrecios listaDePreciosEncontrado = listaDePreciosRepository.findById(listaDePrecios.getId()).get();
        if (listaDePreciosEncontrado != null) {
            listaDePreciosEncontrado.setDescripcion(listaDePrecios.getDescripcion());
            ListaDePrecios listaDePreciosActualizado = listaDePreciosRepository.save(listaDePreciosEncontrado);
            return listaDePreciosActualizado;
        } else {
            throw new Exception("Lista de precios no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarListaDePrecios(String id) throws Exception {
        Optional<ListaDePrecios> listaDePreciosEncontrado = listaDePreciosRepository.findById(id);
        if (listaDePreciosEncontrado.isPresent()) {
            listaDePreciosRepository.deleteById(id);
        } else {
            throw new Exception("Lista de precios no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void generarReporteListasDePrecios(OutputStream outputStream) throws Exception {
        ClassPathResource resource = new ClassPathResource("reportes/test3.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }
}