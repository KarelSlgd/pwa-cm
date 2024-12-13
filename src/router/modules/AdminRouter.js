import AdminSalesRegister from "@/modules/admin/views/AdminSalesRegister.vue";
import Dasboard from "../../modules/admin/views/AdminDashBoard.vue";
import Products from "../../modules/admin/views/AdminProducts.vue";
import ProductVariants from "../../modules/admin/views/AdminProductVariants.vue";
import AdminCategories from "@/modules/admin/views/AdminCategories.vue";
import AdminKeys from "@/modules/admin/views/AdminKeys.vue";
import AdminSalesDetails from "@/modules/admin/views/AdminSalesDetails.vue";
import AdminUsers from "@/modules/admin/views/AdminUsers.vue";
import AdminHelp from "@/modules/admin/views/AdminHelpInformation.vue";

export default [
  {
    path: "/admin",
    name: "admin",
    redirect: "/admin/dashboard",
    component: () => import("../../layouts/AdminLayout.vue"),
    meta: {
      title: "Admin",
      role: "admin",
    },
    children: [
      {
        path: "/admin/dashboard",
        name: "dashboard",
        component: Dasboard,
        meta: {
          title: "Inicio",
          role: "admin",
          requireAuth:true
        },
      },
      {
        path: "/admin/products",
        name: "products",
        component: Products,
        meta: {
          title: "Productos",
          role: "admin",
          requireAuth:true
        },
      },
      {
        path: "/admin/productvariants",
        name: "productvariants",
        component: ProductVariants,
        meta: {
          title: "Productos /",
          role: "admin",
          requireAuth:true
        },
        props: true,
      },
      {
        path: "/admin/categories",
        name: "categories",
        component: AdminCategories,
        meta: {
          title: "Categorias",
          role: "admin",
          requireAuth:true
        },
      },
      {
        path: "/admin/users",
        name: "users",
        component: AdminUsers,
        meta: {
          title: "Usuarios",
          role: "admin",
          requireAuth: true
        },
      },
      {
        path: "/admin/sales-register",
        name: "sales-register",
        component: AdminSalesRegister,
        meta: {
          title: "Pedidos",
          role: "admin",
          requireAuth:true
        },
      },
      {
        path: "/admin/keys",
        name: "keys",
        component: AdminKeys,
        meta: {
          title: "Key",
          role: "admin",
          requireAuth:true
        },
      },
      {
        path: "/admin/details-sales",
        name: "details-sales",
        component: AdminSalesDetails,
        meta: {
          title: "Pedido /",
          role: "admin",
          requireAuth:true
        },
      },
      {
        path: "/admin/help",
        name: "help",
        component: AdminHelp,
        meta: {
          title: "Ayuda e Información",
          role: "admin",
          requireAuth:true
        },
      },
    ],
  },
];
