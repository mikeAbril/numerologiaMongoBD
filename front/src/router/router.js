import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
  // 1. RUTAS PÚBLICAS O DE USUARIO NORMAL
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("../views/loginUsers.vue") },
      { path: "crear-user", component: () => import("../views/crearUser.vue") },
      { path: "seccionUser", component: () => import("../views/user/seccionUser.vue") },
      { path: "user-pro", component: () => import("../views/user/seccionUser.vue") },
      { path: "mantenimiento", component: () => import("../views/MantenimientoPage.vue") }
    ]
  },

  // 2. RUTAS DE USUARIO (Nuevo Layout y Vistas)
  {
    path: "/user",
    component: () => import("../layouts/UserLayout.vue"),
    children: [
      { path: "dashboard", component: () => import("../views/user/UserDashboard.vue") },
      { path: "oracle", component: () => import("../views/user/UserOracle.vue") },
      { path: "vault", component: () => import("../views/user/UserVault.vue") },
      { path: "seals", component: () => import("../views/user/UserSeals.vue") },
      { path: "payments", component: () => import("../views/user/UserPayments.vue") },
      { path: "premium", component: () => import("../views/user/seccionUser.vue") }
    ]
  },

  // 3. RUTAS DE ADMINISTRADOR
  {
    path: "/admin",
    component: () => import("../views/admin/seccionAdmin.vue"),
    children: [
      {
        path: "", // Carga en /admin
        component: () => import("../views/admin/AdminDashboard.vue")
      },
      {
        path: "usuarios", // Carga en /admin/usuarios
        component: () => import("../views/admin/UsuariosPage.vue")
      },
      {
        path: "pagos", // Carga en /admin/pagos
        component: () => import("../views/admin/PagosPage.vue")
      }
    ]
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})