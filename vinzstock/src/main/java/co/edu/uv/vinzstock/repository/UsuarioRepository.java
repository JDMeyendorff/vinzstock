package co.edu.uv.vinzstock.repository;

import co.edu.uv.vinzstock.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {
    List<UsuarioModel> findAllByIdUsuario (long idUsuario);
    List<UsuarioModel> findAllByNombreContains (String nombre);

}
