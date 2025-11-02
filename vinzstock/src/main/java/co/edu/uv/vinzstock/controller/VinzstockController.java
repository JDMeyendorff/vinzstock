package co.edu.uv.vinzstock.controller;


import co.edu.uv.vinzstock.model.RolesModel;
import co.edu.uv.vinzstock.model.UsuarioModel;
import co.edu.uv.vinzstock.service.RolService;
import co.edu.uv.vinzstock.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vinzstock")
@CrossOrigin(origins = "http://localhost:5173")
public class VinzstockController {

    private UsuarioService usuarioService;
    private RolService rolService;


    @Autowired
    public VinzstockController(UsuarioService usuarioService, RolService rolService){
        this.usuarioService = usuarioService;
        this.rolService = rolService;
    }



    @PostMapping(path = "/save")
    public UsuarioModel saveUsuario(@RequestBody UsuarioModel usuarioModel){
        return this.usuarioService.createUsuario(usuarioModel);
    }


    @PutMapping (path = "/update")
    public UsuarioModel updateUsuario (@RequestBody UsuarioModel usuarioModel) {
        return this.usuarioService.createUsuario(usuarioModel);
    }

    @GetMapping(path = "/all")
    public List<UsuarioModel> findAllUsuarios(){
        return this.usuarioService.findAllUsuarios();
    }

    @GetMapping(path = "/all/nombre")
    public List<UsuarioModel> findAllUsuariosByNombre(@RequestParam(name="nombre") String nombre){
        return this.usuarioService.findAllUsuariosByNombre(nombre);
    }

    @GetMapping(path = "/all/idusuario")
    public List<UsuarioModel> findAllByIdUsuario(@RequestParam(name="idUsuario") long idUsuario){
        return this.usuarioService.findAllByUsuarios(idUsuario);
    }



    @GetMapping (path = "/roles/all")
    public List<RolesModel> findAllRoles(){ return this.rolService.findAllRoles();}

}
