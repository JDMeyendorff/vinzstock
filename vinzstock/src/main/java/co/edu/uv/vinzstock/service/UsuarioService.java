package co.edu.uv.vinzstock.service;

import co.edu.uv.vinzstock.model.RolesModel;
import co.edu.uv.vinzstock.model.UsuarioModel;
import co.edu.uv.vinzstock.repository.RolRespository;
import co.edu.uv.vinzstock.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRespository rolRepository;

    @Autowired
    public UsuarioService (UsuarioRepository usuarioRepository, RolRespository rolRespository){
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRespository;
    }

    public UsuarioModel createUsuario (UsuarioModel usuarioModel){
        if (usuarioModel.getRol() != null && usuarioModel.getRol().getIdRol() > 0) {
            Long idRol = usuarioModel.getRol().getIdRol();

            RolesModel rol = rolRepository.findById(idRol)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + idRol));

            usuarioModel.setRol(rol);
        } else {
            throw new RuntimeException("Debe especificar un rol válido");
        }
        return this.usuarioRepository.save(usuarioModel);
    }

    public UsuarioModel updateUsuario(UsuarioModel usuarioModel){

        if (usuarioModel.getRol() != null && usuarioModel.getRol().getIdRol() > 0) {
            Long idRol = usuarioModel.getRol().getIdRol();

            RolesModel rol = rolRepository.findById(idRol)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + idRol));

            usuarioModel.setRol(rol);
        }
        return this.usuarioRepository.save(usuarioModel);
    }

    /*public void deleteUsuario(Long id){
        this.usuarioRepository.deleteById(id);
    }*/

    public List<UsuarioModel> findAllUsuarios(){
        return this.usuarioRepository.findAll();
    }

    public List<UsuarioModel> findAllUsuariosByNombre (String nombre){
        return this.usuarioRepository.findAllByNombreContains(nombre);
    }

    public List<UsuarioModel> findAllByUsuarios (long idUsuario){
        return this.usuarioRepository.findAllByIdUsuario(idUsuario);
    }

}
