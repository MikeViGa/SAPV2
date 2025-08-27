package com.pla.app.service;

import java.io.InputStream;
import java.io.OutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.pla.app.model.Usuario;
import com.pla.app.repository.UsuarioRepository;
import com.pla.app.dto.usuarios.UsuarioListadoProjection;
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
public class UsuarioService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional
    public Usuario crearUsuario(Usuario usuario) throws Exception {
        if (usuarioRepository.findByNombre(usuario.getNombre()) == null) {
            usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        } else {
            throw new Exception("El nombre de usuario ya está en uso");
        }
        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findByIdAndActive(id);
    }

    
    @Transactional(readOnly = true)
    public List<Usuario> obtenerUsuarios() {
        return usuarioRepository.findAllActive();
    }

    @Transactional(readOnly = true)
    public Page<UsuarioListadoProjection> obtenerUsuariosPaginado(Pageable pageable) {
        return usuarioRepository.findListadoActive(pageable);
    }

    @Transactional(readOnly = true)
    public List<Usuario> obtenerUsuariosPorNombreUsuario(String nombreUsuario) {
        List<Usuario> usuarios = usuarioRepository.findByNombreUsuarioContainingAndActive(nombreUsuario);
        return usuarios;
    }

    @Transactional
    public Usuario actualizarUsuario(Usuario usuario) throws Exception {
        Optional<Usuario> usuarioEncontradoOpt = usuarioRepository.findByIdAndActive(usuario.getId());
        if (usuarioEncontradoOpt.isPresent()) {
            Usuario usuarioEncontrado = usuarioEncontradoOpt.get();
            usuarioEncontrado.setNombre(usuario.getNombre());
            usuarioEncontrado.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
            usuarioEncontrado.setRol(usuario.getRol());
            Usuario usuarioActualizado = usuarioRepository.save(usuarioEncontrado);
            return usuarioActualizado;
        } else {
            throw new Exception("Usuario no encontrado con el ID proporcionado.");
        }
    }

    @Transactional
    public void eliminarUsuario(Long id) throws Exception {
        Optional<Usuario> usuarioEncontradoOpt = usuarioRepository.findByIdAndActive(id);
        if (usuarioEncontradoOpt.isPresent()) {
            Usuario usuarioEncontrado = usuarioEncontradoOpt.get();
            usuarioEncontrado.setActivo(false); // Soft delete
            usuarioRepository.save(usuarioEncontrado);
        } else {
            throw new Exception("Usuario no encontrado con el ID proporcionado.");
        }
    }

    // Método adicional para recuperar un usuario eliminado
    @Transactional
    public void restaurarUsuario(Long id) throws Exception {
        Optional<Usuario> usuarioEncontradoOpt = usuarioRepository.findById(id);
        if (usuarioEncontradoOpt.isPresent()) {
            Usuario usuarioEncontrado = usuarioEncontradoOpt.get();
            if (!usuarioEncontrado.getActivo()) {
                usuarioEncontrado.setActivo(true);
                usuarioRepository.save(usuarioEncontrado);
            } else {
                throw new Exception("El usuario ya está activo.");
            }
        } else {
            throw new Exception("Usuario no encontrado con el ID proporcionado.");
        }
    }

    // Método para obtener todos los usuarios (incluidos inactivos) - para administración
    @Transactional(readOnly = true)
    public List<Usuario> obtenerUsuariosTodosInclusoInactivos() {
        return usuarioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<UsuarioListadoProjection> obtenerUsuariosPaginadoInclusoInactivos(Pageable pageable) {
        return usuarioRepository.findListado(pageable);
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
        ClassPathResource resource = new ClassPathResource("MyReports/reporteusuarios.jasper");
        InputStream jasperStream = resource.getInputStream();
        Connection conn = dataSource.getConnection();
        Map<String, Object> parametros = new HashMap<String, Object>();
        JasperRunManager.runReportToPdfStream(jasperStream, (OutputStream) outputStream, parametros, conn);
    }
}