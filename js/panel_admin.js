/* ============================================================
   AGROALERTA — PANEL DE ADMINISTRACIÓN
   panel_admin.js  —  conectado al backend PHP real
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────
   RUTAS PHP
───────────────────────────────────────────── */
const PHP = {
  estadisticas:      '../php/estadisticas_admin.php',
  obtenerUsuarios:   '../php/obtener_usuarios.php',
  eliminarUsuario:   '../php/eliminar_usuario.php',
  editarUsuario:     '../php/editar_usuario_admin.php',
  cambiarRol:        '../php/cambiar_rol.php',
  obtenerAnimales:   '../php/obtener_animales_admin.php',
  eliminarAnimal:    '../php/eliminar_animal.php',
  editarAnimal:      '../php/editar_animal_admin.php',
  obtenerAuditoria:  '../php/obtener_auditoria.php',
  registrarAuditoria:'../php/registrar_auditoria.php',
};

/* ─────────────────────────────────────────────
   ESTADO GLOBAL
───────────────────────────────────────────── */
const Estado = {
  usuariosRaw:      [],
  animalesRaw:      [],
  moduloActual:     'dashboard',
  confirmarCallback: null,
  reportesCargados: false,
};

/* ─────────────────────────────────────────────
   INICIALIZACIÓN
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  inicializarFecha();
  inicializarNavegacion();
  inicializarAccionesTablas();
  inicializarSidebarToggle();
  inicializarLogout();
  inicializarModales();
  inicializarBusqueda();
  inicializarFiltros();
  restaurarAdmin();
  cargarDashboard();
});

/* ─────────────────────────────────────────────
   FECHA EN TOPBAR
───────────────────────────────────────────── */
function inicializarFecha() {
  const el = document.getElementById('topbar-date');
  if (!el) return;
  const actualizar = () => {
    el.textContent = new Date().toLocaleDateString('es-UY', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };
  actualizar();
  setInterval(actualizar, 60000);
}

/* ─────────────────────────────────────────────
   NOMBRE DEL ADMIN EN SIDEBAR
   login.php guarda $_SESSION['nombre']
   Podés pasarlo al JS desde tu HTML con:
   <script>sessionStorage.setItem('admin_nombre','<?= $_SESSION["nombre"] ?>')</script>
───────────────────────────────────────────── */
function restaurarAdmin() {
  const nombre = sessionStorage.getItem('admin_nombre') || 'Administrador';
  const el = document.getElementById('admin-name');
  if (el) el.textContent = nombre;
}

/* ─────────────────────────────────────────────
   DELEGACIÓN DE EVENTOS EN TABLAS
───────────────────────────────────────────── */
function inicializarAccionesTablas() {
  // Usuarios — un solo listener en el tbody que detecta cualquier botón
  document.getElementById('tbody-usuarios')?.addEventListener('click', e => {
    const btn = e.target.closest('.action-btn');
    if (!btn) return;
    manejarAccionUsuario({ currentTarget: btn });
  });

  // Animales — igual
  document.getElementById('tbody-animales')?.addEventListener('click', e => {
    const btn = e.target.closest('.action-btn');
    if (!btn) return;
    manejarAccionAnimal({ currentTarget: btn });
  });
}

/* ─────────────────────────────────────────────
   NAVEGACIÓN ENTRE MÓDULOS
───────────────────────────────────────────── */
function inicializarNavegacion() {
  document.querySelectorAll('.nav-item[data-module]').forEach(item => {
    item.addEventListener('click', () => navegarA(item.dataset.module));
  });
  document.querySelectorAll('.quick-btn[data-module]').forEach(btn => {
    btn.addEventListener('click', () => navegarA(btn.dataset.module));
  });
}

function navegarA(modulo) {
  if (Estado.moduloActual === modulo) return;

  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector(`.nav-item[data-module="${modulo}"]`)?.classList.add('active');

  document.querySelectorAll('.module').forEach(s => s.classList.add('hidden'));
  document.getElementById(`module-${modulo}`)?.classList.remove('hidden');

  const titulos = {
    dashboard:     'Dashboard',
    usuarios:      'Gestión de Usuarios',
    animales:      'Gestión de Animales',
    reportes:      'Reportes',
    auditoria:     'Auditoría Administrativa',
    seguridad:     'Seguridad',
    configuracion: 'Configuración del Sistema',
  };

  const titulo = titulos[modulo] || modulo;
  const elTitulo     = document.getElementById('page-title');
  const elBreadcrumb = document.getElementById('breadcrumb-current');
  if (elTitulo)     elTitulo.textContent     = titulo;
  if (elBreadcrumb) elBreadcrumb.textContent = titulo;

  Estado.moduloActual = modulo;
  document.getElementById('sidebar')?.classList.remove('open');

  switch (modulo) {
    case 'usuarios':  cargarUsuarios();  break;
    case 'animales':  cargarAnimales();  break;
    case 'reportes':  cargarReportes();  break;
    case 'auditoria': cargarAuditoria(); break;
  }
}

/* ─────────────────────────────────────────────
   SIDEBAR TOGGLE (móvil)
───────────────────────────────────────────── */
function inicializarSidebarToggle() {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));

  document.addEventListener('click', e => {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

/* ─────────────────────────────────────────────
   LOGOUT
───────────────────────────────────────────── */
function inicializarLogout() {
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    mostrarConfirmacion(
      'Cerrar sesión',
      '¿Estás seguro que querés cerrar tu sesión en AgroAlerta?',
      () => {
        sessionStorage.clear();
        window.location.href = 'auth.html';
      }
    );
  });
}

/* ─────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────── */
async function cargarDashboard() {
  await Promise.all([
    cargarEstadisticas(),
    cargarActividadReciente(),
  ]);
}

async function cargarEstadisticas() {
  try {
    const res  = await fetch(PHP.estadisticas);
    const data = await res.json();

    // estadisticas_admin.php devuelve: {usuarios, animales, administradores}
    animarContador('stat-total-usuarios', Number(data.usuarios       || 0));
    animarContador('stat-total-animales', Number(data.animales       || 0));
    animarContador('stat-total-admins',   Number(data.administradores || 0));

  } catch (err) {
    console.error('estadisticas:', err);
    mostrarToast('No se pudieron cargar las estadísticas.', 'error');
  }
}

function animarContador(id, valorFinal) {
  const el = document.getElementById(id);
  if (!el) return;
  const duracion = 900;
  const inicio   = Date.now();
  const tick = () => {
    const progreso = Math.min((Date.now() - inicio) / duracion, 1);
    const ease     = 1 - Math.pow(1 - progreso, 3);
    el.textContent = Math.round(valorFinal * ease);
    if (progreso < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* Actividad reciente: leemos auditoria_admin y mostramos los últimos 6 */
async function cargarActividadReciente() {
  const lista = document.getElementById('activity-list');
  if (!lista) return;

  try {
    const res      = await fetch(PHP.obtenerAuditoria);
    const registros = await res.json();

    if (!Array.isArray(registros) || registros.length === 0) {
      lista.innerHTML = '<div class="activity-placeholder"><span>Sin actividad reciente.</span></div>';
      return;
    }

    // Tomamos los últimos 6
    lista.innerHTML = registros.slice(0, 6).map(r => `
      <div class="activity-item">
        <span class="activity-dot"></span>
        <div class="activity-content">
          <span class="activity-text">${escHTML(r.accion)}</span>
          <span class="activity-time">${formatearFechaHora(r.fecha)}</span>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error('actividad:', err);
    lista.innerHTML = '<div class="activity-placeholder"><span>No se pudo cargar la actividad.</span></div>';
  }
}

/* ─────────────────────────────────────────────
   USUARIOS
   obtener_usuarios.php devuelve:
   [{id, nombre, apellido, correo, cedula,
     celular, licose, tipo_usuario}]
───────────────────────────────────────────── */
async function cargarUsuarios() {
  const tbody = document.getElementById('tbody-usuarios');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="9" class="table-loading">
    <div class="spinner"></div><span>Cargando usuarios…</span>
  </td></tr>`;

  try {
    const res  = await fetch(PHP.obtenerUsuarios);
    const data = await res.json();

    // Normalizamos: el PHP devuelve tipo_usuario, el JS usa "rol"
    Estado.usuariosRaw = data.map(u => ({
      id:       u.id,
      nombre:   u.nombre   || '',
      apellido: u.apellido || '',
      correo:   u.correo   || '',
      cedula:   u.cedula   || '',
      celular:  u.celular  || '',
      licose:   u.licose   || '',
      rol:      u.tipo_usuario || 'ganadero',
    }));

    renderizarUsuarios(Estado.usuariosRaw);

  } catch (err) {
    console.error('usuarios:', err);
    tbody.innerHTML = `<tr><td colspan="9" class="table-loading">
      <span>Error al cargar usuarios. Verificá tu sesión.</span>
    </td></tr>`;
    mostrarToast('No se pudo cargar la lista de usuarios.', 'error');
  }
}

function renderizarUsuarios(lista) {
  const tbody   = document.getElementById('tbody-usuarios');
  const countEl = document.getElementById('usuarios-count');
  if (!tbody) return;

  if (countEl) countEl.textContent = `${lista.length} registro${lista.length !== 1 ? 's' : ''}`;

  if (!lista.length) {
    tbody.innerHTML = `<tr><td colspan="9" class="table-loading">
      <span>No se encontraron usuarios.</span>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map(u => `
    <tr data-id="${u.id}">
      <td>${u.id}</td>
      <td>${escHTML(u.nombre)}</td>
      <td>${escHTML(u.apellido)}</td>
      <td>${escHTML(u.correo)}</td>
      <td>${escHTML(u.cedula)}</td>
      <td>${escHTML(u.celular)}</td>
      <td>${escHTML(u.licose)}</td>
      <td><span class="role-badge ${escHTML(u.rol)}">${escHTML(u.rol)}</span></td>
      <td>
        <button class="action-btn btn-edit"
          title="Editar usuario"
          data-action="editar-usuario"
          data-id="${u.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="action-btn btn-role"
          title="Cambiar rol"
          data-action="cambiar-rol"
          data-id="${u.id}"
          data-rol="${u.rol}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="17 1 21 5 17 9"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
        </button>
        <button class="action-btn btn-delete"
          title="Eliminar usuario"
          data-action="eliminar-usuario"
          data-id="${u.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');

}

function manejarAccionUsuario(e) {
  const btn    = e.currentTarget;
  const accion = btn.dataset.action;
  const id     = btn.dataset.id;
  const usuario = Estado.usuariosRaw.find(u => String(u.id) === String(id));
  if (!usuario) return;

  if (accion === 'editar-usuario') {
    abrirModalEditarUsuario(usuario);

  } else if (accion === 'cambiar-rol') {
    const nuevoRol = usuario.rol === 'ganadero' ? 'administrador' : 'ganadero';
    mostrarConfirmacion(
      'Cambiar rol',
      `¿Querés cambiar el rol de <strong>${escHTML(usuario.nombre)} ${escHTML(usuario.apellido)}</strong> a <strong>${nuevoRol}</strong>?`,
      () => ejecutarCambioRol(String(id), nuevoRol)
    );

  } else if (accion === 'eliminar-usuario') {
    mostrarConfirmacion(
      'Eliminar usuario',
      `¿Estás seguro que querés eliminar a <strong>${escHTML(usuario.nombre)} ${escHTML(usuario.apellido)}</strong>? Esta acción no se puede deshacer.`,
      () => ejecutarEliminarUsuario(String(id))
    );
  }
}

async function ejecutarCambioRol(id, nuevoRol) {
  try {
    const body = new FormData();
    body.append('id', id);
    // cambiar_rol.php espera el campo 'rol'
    body.append('rol', nuevoRol);

    const res  = await fetch(PHP.cambiarRol, { method: 'POST', body });
    const texto = await res.text();

    if (texto.trim() === 'ok') {
      const idx = Estado.usuariosRaw.findIndex(u => String(u.id) === String(id));
      if (idx !== -1) Estado.usuariosRaw[idx].rol = nuevoRol;

      aplicarFiltrosUsuarios();
      registrarAuditoria(`Cambió el rol del usuario ID ${id} a "${nuevoRol}"`);
      mostrarToast(`Rol actualizado a "${nuevoRol}" correctamente.`, 'success');
    } else {
      manejarErrorPHP(texto, 'cambiar rol');
    }
  } catch (err) {
    console.error('cambiarRol:', err);
    mostrarToast('Error de conexión al cambiar rol.', 'error');
  }
}

async function ejecutarEliminarUsuario(id) {
  try {
    const body = new FormData();
    body.append('id', id);

    const res   = await fetch(PHP.eliminarUsuario, { method: 'POST', body });
    const texto = await res.text();

    if (texto.trim() === 'ok') {
      Estado.usuariosRaw = Estado.usuariosRaw.filter(u => String(u.id) !== String(id));
      aplicarFiltrosUsuarios();
      registrarAuditoria(`Eliminó usuario ID ${id}`);
      mostrarToast('Usuario eliminado correctamente.', 'success');
    } else {
      manejarErrorPHP(texto, 'eliminar usuario');
    }
  } catch (err) {
    console.error('eliminarUsuario:', err);
    mostrarToast('Error de conexión al eliminar usuario.', 'error');
  }
}

/* ─────────────────────────────────────────────
   ANIMALES
   obtener_animales_admin.php devuelve:
   [{id, id_animal, raza, sexo, edad, peso,
     salud, estado, observaciones,
     fecha_registro, nombre, apellido}]
───────────────────────────────────────────── */
async function cargarAnimales() {
  const tbody = document.getElementById('tbody-animales');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="9" class="table-loading">
    <div class="spinner"></div><span>Cargando animales…</span>
  </td></tr>`;

  try {
    const res  = await fetch(PHP.obtenerAnimales);
    const data = await res.json();

    // Normalizamos para el render
    Estado.animalesRaw = data.map(a => ({
      id:           a.id,
      caravana:     a.id_animal         || '—',
      raza:         a.raza              || '—',
      peso:         a.peso              || 0,
      salud:        a.salud             || '',
      estado:       (a.estado || 'Vivo').toLowerCase(),
      fecha:        a.fecha_registro    || '',
      propietario:  `${a.nombre || ''} ${a.apellido || ''}`.trim(),
      observaciones: a.observaciones   || '',
    }));

    renderizarAnimales(Estado.animalesRaw);

  } catch (err) {
    console.error('animales:', err);
    tbody.innerHTML = `<tr><td colspan="9" class="table-loading">
      <span>Error al cargar animales. Verificá tu sesión.</span>
    </td></tr>`;
    mostrarToast('No se pudo cargar la lista de animales.', 'error');
  }
}

function renderizarAnimales(lista) {
  const tbody   = document.getElementById('tbody-animales');
  const countEl = document.getElementById('animales-count');
  if (!tbody) return;

  if (countEl) countEl.textContent = `${lista.length} registro${lista.length !== 1 ? 's' : ''}`;

  if (!lista.length) {
    tbody.innerHTML = `<tr><td colspan="9" class="table-loading">
      <span>No se encontraron animales.</span>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map(a => `
    <tr data-id="${a.id}">
      <td>${a.id}</td>
      <td>${escHTML(a.caravana)}</td>
      <td>${escHTML(a.raza)}</td>
      <td>${a.peso} kg</td>
      <td><span class="estado-badge ${escHTML(a.estado)}">${escHTML(a.estado)}</span></td>
      <td>${formatearFecha(a.fecha)}</td>
      <td>${escHTML(a.propietario)}</td>
      <td>${a.observaciones ? escHTML(a.observaciones) : '<span style="color:var(--text-muted)">—</span>'}</td>
      <td>
        <button class="action-btn btn-edit"
          title="Editar animal"
          data-action="editar-animal"
          data-id="${a.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="action-btn btn-delete"
          title="Eliminar animal"
          data-action="eliminar-animal"
          data-id="${a.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');

}

function manejarAccionAnimal(e) {
  const btn    = e.currentTarget;
  const accion = btn.dataset.action;
  const id     = btn.dataset.id;
  const animal = Estado.animalesRaw.find(a => String(a.id) === String(id));
  if (!animal) return;

  if (accion === 'editar-animal') {
    abrirModalEditarAnimal(animal);

  } else if (accion === 'eliminar-animal') {
    mostrarConfirmacion(
      'Eliminar animal',
      `¿Estás seguro que querés eliminar el animal con caravana <strong>${escHTML(animal.caravana)}</strong>? Esta acción no se puede deshacer.`,
      () => ejecutarEliminarAnimal(id)
    );
  }
}

async function ejecutarEliminarAnimal(id) {
  try {
    const body = new FormData();
    body.append('id', id);

    const res   = await fetch(PHP.eliminarAnimal, { method: 'POST', body });
    const texto = await res.text();

    if (texto.trim() === 'ok') {
      Estado.animalesRaw = Estado.animalesRaw.filter(a => String(a.id) !== String(id));
      aplicarFiltrosAnimales();
      // eliminar_animal.php ya registra en auditoria_admin automáticamente
      mostrarToast('Animal eliminado correctamente.', 'success');
    } else {
      manejarErrorPHP(texto, 'eliminar animal');
    }
  } catch (err) {
    console.error('eliminarAnimal:', err);
    mostrarToast('Error de conexión al eliminar animal.', 'error');
  }
}

/* ─────────────────────────────────────────────
   REPORTES
   Reutiliza los datos ya cargados + estadisticas
───────────────────────────────────────────── */
async function cargarReportes() {
  try {
    // Estadísticas de usuarios
    const resStats = await fetch(PHP.estadisticas);
    const stats    = await resStats.json();

    const totalUsuarios = Number(stats.usuarios        || 0);
    const totalAdmins   = Number(stats.administradores || 0);
    const totalGanaderos = totalUsuarios - totalAdmins;

    setTexto('rep-total-usuarios',  totalUsuarios);
    setTexto('rep-total-admins',    totalAdmins);
    setTexto('rep-total-ganaderos', totalGanaderos);
    setTexto('rep-total-animales',  Number(stats.animales || 0));

    // Para vivos/vendidos/fallecidos necesitamos los animales
    let animales = Estado.animalesRaw;
    if (!animales.length) {
      const resAnim = await fetch(PHP.obtenerAnimales);
      const dataAnim = await resAnim.json();
      animales = dataAnim.map(a => ({
        estado: (a.estado || 'vivo').toLowerCase()
      }));
    }

    setTexto('rep-vivos',     animales.filter(a => a.estado === 'vivo').length);
    setTexto('rep-vendidos',  animales.filter(a => a.estado === 'vendido').length);
    setTexto('rep-fallecidos',animales.filter(a => a.estado === 'fallecido').length);

  } catch (err) {
    console.error('reportes:', err);
    mostrarToast('No se pudieron cargar los reportes.', 'error');
  }

  // Botones exportar (placeholder hasta que existan los PHP)
  document.getElementById('btn-reporte-usuarios')?.addEventListener('click', () => {
    mostrarToast('Exportación disponible próximamente.', 'info');
  });
  document.getElementById('btn-reporte-animales')?.addEventListener('click', () => {
    mostrarToast('Exportación disponible próximamente.', 'info');
  });
}

/* ─────────────────────────────────────────────
   AUDITORÍA
   obtener_auditoria.php devuelve:
   [{id, admin_id, accion, fecha}]
───────────────────────────────────────────── */
async function cargarAuditoria() {
  const contenedor = document.getElementById('auditoria-tabla-body');
  const countEl    = document.getElementById('auditoria-count');
  if (!contenedor) return;

  contenedor.innerHTML = '<tr><td colspan="4" class="table-loading"><div class="spinner"></div><span>Cargando historial...</span></td></tr>';

  try {
    const res       = await fetch(PHP.obtenerAuditoria);
    const registros = await res.json();

    if (!Array.isArray(registros) || registros.length === 0) {
      contenedor.innerHTML = '<tr><td colspan="4" class="table-loading"><span>No hay registros de auditoria.</span></td></tr>';
      if (countEl) countEl.textContent = '0 registros';
      return;
    }

    if (countEl) countEl.textContent = registros.length + ' registro' + (registros.length !== 1 ? 's' : '');

    contenedor.innerHTML = registros.map(function(r, i) {
      return '<tr><td>' + (registros.length - i) + '</td><td>' + escHTML(r.accion) + '</td><td>' + formatearFechaHora(r.fecha) + '</td><td><span class="role-badge administrador">Admin ID ' + escHTML(String(r.admin_id)) + '</span></td></tr>';
    }).join('');

  } catch (err) {
    console.error('auditoria:', err);
    contenedor.innerHTML = '<tr><td colspan="4" class="table-loading"><span>Error al cargar el historial.</span></td></tr>';
  }
}
async function registrarAuditoria(accion) {
  try {
    const adminId = sessionStorage.getItem('admin_id') || 0;
    const body = new FormData();
    body.append('admin_id', adminId);
    body.append('accion', accion);
    await fetch(PHP.registrarAuditoria, { method: 'POST', body });
  } catch (err) {
    console.warn('registrarAuditoria falló silenciosamente:', err);
  }
}

/* ─────────────────────────────────────────────
   BÚSQUEDA EN TIEMPO REAL
───────────────────────────────────────────── */
function inicializarBusqueda() {
  document.getElementById('search-usuarios')?.addEventListener('input',  aplicarFiltrosUsuarios);
  document.getElementById('search-animales')?.addEventListener('input',  aplicarFiltrosAnimales);
}

function inicializarFiltros() {
  document.getElementById('filter-rol')?.addEventListener('change',          aplicarFiltrosUsuarios);
  document.getElementById('filter-estado-animal')?.addEventListener('change', aplicarFiltrosAnimales);
}

function aplicarFiltrosUsuarios() {
  const query = (document.getElementById('search-usuarios')?.value || '').toLowerCase().trim();
  const rol   =  document.getElementById('filter-rol')?.value || '';

  let filtrados = Estado.usuariosRaw;

  if (query) {
    filtrados = filtrados.filter(u =>
      u.nombre.toLowerCase().includes(query)   ||
      u.apellido.toLowerCase().includes(query) ||
      u.correo.toLowerCase().includes(query)   ||
      u.cedula.toLowerCase().includes(query)   ||
      u.licose.toLowerCase().includes(query)
    );
  }

  if (rol) filtrados = filtrados.filter(u => u.rol === rol);

  renderizarUsuarios(filtrados);
}

function aplicarFiltrosAnimales() {
  const query  = (document.getElementById('search-animales')?.value || '').toLowerCase().trim();
  const estado =  document.getElementById('filter-estado-animal')?.value || '';

  let filtrados = Estado.animalesRaw;

  if (query) {
    filtrados = filtrados.filter(a =>
      a.caravana.toLowerCase().includes(query)    ||
      a.raza.toLowerCase().includes(query)        ||
      a.estado.toLowerCase().includes(query)      ||
      a.propietario.toLowerCase().includes(query)
    );
  }

  if (estado) filtrados = filtrados.filter(a => a.estado === estado);

  renderizarAnimales(filtrados);
}

/* ─────────────────────────────────────────────
   MODALES
───────────────────────────────────────────── */
function inicializarModales() {
  // Editar usuario
  document.getElementById('close-modal-usuario')?.addEventListener('click',  () => cerrarModal('modal-editar-usuario'));
  document.getElementById('cancel-edit-usuario')?.addEventListener('click',  () => cerrarModal('modal-editar-usuario'));
  document.getElementById('save-edit-usuario')?.addEventListener('click',    guardarEdicionUsuario);

  // Editar animal
  document.getElementById('close-modal-animal')?.addEventListener('click',  () => cerrarModal('modal-editar-animal'));
  document.getElementById('cancel-edit-animal')?.addEventListener('click',  () => cerrarModal('modal-editar-animal'));
  document.getElementById('save-edit-animal')?.addEventListener('click',     guardarEdicionAnimal);

  // Confirmación
  document.getElementById('cancel-confirmar')?.addEventListener('click', () => cerrarModal('modal-confirmar'));
  document.getElementById('ok-confirmar')?.addEventListener('click', () => {
    cerrarModal('modal-confirmar');
    if (typeof Estado.confirmarCallback === 'function') {
      Estado.confirmarCallback();
      Estado.confirmarCallback = null;
    }
  });

  // Click en overlay = cerrar
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) cerrarModal(overlay.id);
    });
  });

  // Escape = cerrar
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => cerrarModal(m.id));
    }
  });
}

function abrirModal(id)  { document.getElementById(id)?.classList.remove('hidden'); }
function cerrarModal(id) { document.getElementById(id)?.classList.add('hidden'); }

/* ── Editar usuario ── */
function abrirModalEditarUsuario(usuario) {
  document.getElementById('edit-usuario-id').value = usuario.id;
  document.getElementById('edit-nombre').value     = usuario.nombre;
  document.getElementById('edit-apellido').value   = usuario.apellido;
  document.getElementById('edit-correo').value     = usuario.correo;
  document.getElementById('edit-celular').value    = usuario.celular;
  document.getElementById('edit-licose').value     = usuario.licose;
  document.getElementById('edit-rol').value        = usuario.rol;
  abrirModal('modal-editar-usuario');
}

async function guardarEdicionUsuario() {
  const id       = parseInt(document.getElementById('edit-usuario-id').value, 10);
  const nombre   = document.getElementById('edit-nombre').value.trim();
  const apellido = document.getElementById('edit-apellido').value.trim();
  const correo   = document.getElementById('edit-correo').value.trim();
  const celular  = document.getElementById('edit-celular').value.trim();
  const licose   = document.getElementById('edit-licose').value.trim();
  const rol      = document.getElementById('edit-rol').value;

  if (!nombre || !apellido || !correo) {
    mostrarToast('Nombre, apellido y correo son requeridos.', 'error');
    return;
  }
  if (!validarEmail(correo)) {
    mostrarToast('El correo ingresado no es válido.', 'error');
    return;
  }

  try {
    const body = new FormData();
    body.append('id', id);
    body.append('nombre', nombre);
    body.append('apellido', apellido);
    body.append('correo', correo);
    body.append('celular', celular);
    body.append('licose', licose);
    body.append('rol', rol);

    const res   = await fetch(PHP.editarUsuario, { method: 'POST', body });
    const texto = await res.text();

    if (texto.trim() !== 'ok') {
      manejarErrorPHP(texto, 'editar usuario');
      return;
    }
  } catch (err) {
    mostrarToast('Error de conexión al editar usuario.', 'error');
    return;
  }

  const idx = Estado.usuariosRaw.findIndex(u => String(u.id) === String(id));
  if (idx !== -1) {
    Object.assign(Estado.usuariosRaw[idx], { nombre, apellido, correo, celular, licose, rol });
  }

  aplicarFiltrosUsuarios();
  mostrarToast('Usuario actualizado correctamente.', 'success');
  cerrarModal('modal-editar-usuario');
}

/* ── Editar animal ── */
function abrirModalEditarAnimal(animal) {
  document.getElementById('edit-animal-id').value     = animal.id;
  document.getElementById('edit-peso').value          = animal.peso;
  document.getElementById('edit-estado-animal').value = animal.estado;
  document.getElementById('edit-fecha-animal').value  = animal.fecha ? animal.fecha.split(' ')[0] : '';
  document.getElementById('edit-observaciones').value = animal.observaciones || '';
  abrirModal('modal-editar-animal');
}

async function guardarEdicionAnimal() {
  const id            = parseInt(document.getElementById('edit-animal-id').value, 10);
  const peso          = parseFloat(document.getElementById('edit-peso').value);
  const estado        = document.getElementById('edit-estado-animal').value;
  const fecha         = document.getElementById('edit-fecha-animal').value;
  const observaciones = document.getElementById('edit-observaciones').value.trim();

  if (!peso || isNaN(peso) || peso <= 0) {
    mostrarToast('El peso debe ser un número mayor a 0.', 'error');
    return;
  }
  if (peso < 45 || peso > 1000) {
    mostrarToast('El peso debe estar entre 45 y 1000 kg.', 'error');
    return;
  }
  if (!fecha) {
    mostrarToast('La fecha es requerida.', 'error');
    return;
  }

  try {
    const body = new FormData();
    body.append('id', id);
    body.append('peso', peso);
    body.append('estado', capitalizarPrimera(estado));
    body.append('observaciones', observaciones);

    const res   = await fetch(PHP.editarAnimal, { method: 'POST', body });
    const texto = await res.text();

    if (texto.trim() !== 'ok') {
      manejarErrorPHP(texto, 'editar animal');
      return;
    }
  } catch (err) {
    mostrarToast('Error de conexión al editar animal.', 'error');
    return;
  }

  const idx = Estado.animalesRaw.findIndex(a => String(a.id) === String(id));
  if (idx !== -1) {
    Object.assign(Estado.animalesRaw[idx], { peso, estado, fecha, observaciones });
  }

  aplicarFiltrosAnimales();
  mostrarToast('Animal actualizado correctamente.', 'success');
  cerrarModal('modal-editar-animal');
}

/* ── Confirmación ── */
function mostrarConfirmacion(titulo, mensaje, callback) {
  const elTitulo  = document.getElementById('confirm-title');
  const elMensaje = document.getElementById('confirm-message');
  if (elTitulo)  elTitulo.textContent = titulo;
  if (elMensaje) elMensaje.innerHTML  = mensaje;
  Estado.confirmarCallback = callback;
  abrirModal('modal-confirmar');
}

/* ─────────────────────────────────────────────
   TOAST NOTIFICATIONS
───────────────────────────────────────────── */
function mostrarToast(mensaje, tipo = 'info') {
  const contenedor = document.getElementById('toast-container');
  if (!contenedor) return;

  const iconos = { success: '✓', error: '✕', info: 'ℹ' };
  const toast  = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.innerHTML = `<span class="toast-icon">${iconos[tipo] || 'ℹ'}</span><span>${escHTML(mensaje)}</span>`;
  contenedor.appendChild(toast);

  setTimeout(() => {
    toast.style.cssText = 'opacity:0;transform:translateX(20px);transition:opacity .3s,transform .3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ─────────────────────────────────────────────
   MANEJO DE ERRORES PHP
───────────────────────────────────────────── */
function manejarErrorPHP(texto, contexto) {
  const mensajes = {
    no_session:  'Tu sesión expiró. Por favor volvé a iniciar sesión.',
    error_sql:   'Error en la base de datos.',
    rol_invalido:'El rol ingresado no es válido.',
    error:       'Ocurrió un error inesperado.',
  };
  const clave   = texto.trim();
  const mensaje = mensajes[clave] || `Error (${contexto}): ${clave}`;
  console.error(`PHP ${contexto}:`, clave);
  mostrarToast(mensaje, 'error');

  if (clave === 'no_session') {
    setTimeout(() => { window.location.href = 'auth.html'; }, 2000);
  }
}

/* ─────────────────────────────────────────────
   UTILIDADES
───────────────────────────────────────────── */
function escHTML(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setTexto(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return '—';
  const solo = fechaStr.split(' ')[0]; // quita la hora si viene timestamp
  const [anio, mes, dia] = solo.split('-');
  return (dia && mes && anio) ? `${dia}/${mes}/${anio}` : escHTML(fechaStr);
}

function formatearFechaHora(fechaStr) {
  if (!fechaStr) return '—';
  try {
    return new Date(fechaStr).toLocaleString('es-UY', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return escHTML(fechaStr);
  }
}

function validarEmail(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function capitalizarPrimera(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}