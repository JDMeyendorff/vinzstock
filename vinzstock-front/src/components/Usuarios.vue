<template>
  <div class="usuarios">
    <h1>VinzStock - Usuarios</h1>

    <div class="form">
      <h3>Crear usuario</h3>
      <input v-model="form.nombre" placeholder="Nombre" />
      <input v-model="form.nuip" placeholder="NUIP" />
      <input v-model="form.usuarioLogin" placeholder="Usuario login" />
      <input v-model="form.contrasena" placeholder="Contraseña" type="password" />
      <select v-model.number="form.idRol">
        <option v-for="r in roles" :key="r.idRol" :value="r.idRol">{{ r.nombre }}</option>
      </select>
      <button @click="crearUsuario">Crear</button>
    </div>

    <hr />

    <button @click="getUsuarios">Cargar Usuarios</button>
    <div v-if="loading">Cargando...</div>

    <table v-if="usuarios.length" border="1" cellpadding="6" cellspacing="0">
      <thead>
      <tr>
        <th>ID</th><th>Nombre</th><th>NUIP</th><th>Login</th><th>Rol</th><th>Fecha</th><th>Estado</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="u in usuarios" :key="u.idUsuario">
        <td>{{ u.idUsuario }}</td>
        <td>{{ u.nombre }}</td>
        <td>{{ u.nuip }}</td>
        <td>{{ u.usuarioLogin }}</td>
        <td>{{ u.rol?.nombre || '—' }}</td>
        <td>{{ u.fechaCreacion }}</td>
        <td>{{ u.estado }}</td>
      </tr>
      </tbody>
    </table>

    <div v-else-if="!loading">No hay usuarios</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const usuarios = ref([])
const roles = ref([])
const loading = ref(false)

const form = ref({
  nombre: '',
  nuip: '',
  usuarioLogin: '',
  contrasena: '',
  idRol: 1
})

const API = 'http://localhost:8080/vinzstock' // tu backend

async function getUsuarios() {
  loading.value = true
  try {
    const res = await fetch(`${API}/all`)
    if (!res.ok) throw new Error('Error al obtener usuarios')
    usuarios.value = await res.json()
  } catch (e) {
    alert(e.message)
  } finally { loading.value = false }
}

async function getRoles() {
  try {
    const res = await fetch(`${API}/roles/all`) // Si tienes endpoint de roles
    if (!res.ok) throw new Error('No roles')
    roles.value = await res.json()
  } catch {
    // si no existe endpoint, pon roles por defecto:
    roles.value = [{ idRol: 1, nombre: 'Administrador' }, { idRol: 2, nombre: 'Cajero' }]
  }
}

async function crearUsuario() {
  try {
    const payload = {
      nombre: form.value.nombre,
      nuip: Number(form.value.nuip),
      usuarioLogin: form.value.usuarioLogin,
      contrasena: form.value.contrasena,
      rol: { idRol: Number(form.value.idRol)
      }

    }
    const res = await fetch(`${API}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const txt = await res.text()
      throw new Error('Error backend: ' + txt)
    }
    alert('Usuario creado')
    form.value = { nombre:'', nuip:'', usuarioLogin:'', contrasena:'', idRol:1 }
    getUsuarios()
  } catch (e) {
    alert(e.message)
  }
}

getRoles()
</script>

<style scoped>
.usuarios { max-width: 900px; margin: auto; }
.form input, .form select { display:block; margin:6px 0; padding:6px; width:300px; }
button { padding:6px 10px; margin:6px 0; }
table { width:100%; margin-top:12px; border-collapse: collapse; }
th, td { padding:8px; }
</style>