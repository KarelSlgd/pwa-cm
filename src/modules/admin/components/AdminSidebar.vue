<template>
  <div :class="[{ collapsed: !sidebarVisible }]">
    <h1 v-if="sidebarVisible" class="font-bold text-4xl mb-6 m-3">
      CrochetMart
    </h1>
    <h1 v-else class="font-bold text-4xl mb-6 m-3">CM</h1>
    <nav>
      <div v-for="(item, index) in menuItems" :key="index" @click="handleMenuClick(item)">
        <router-link :to="item.href" class="flex items-center no-underline text-lg p-4" :class="{
          'text-black': selectedItem === item.label,
          'text-gray-500': selectedItem !== item.label,
        }">
          <i :class="[item.icon, 'text-3xl', { 'pr-3': sidebarVisible }]"></i>
          <span v-if="sidebarVisible">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    sidebarVisible: Boolean,
  },
  data() {
    return {
      selectedItem: "Inicio",
      menuItems: [
        { icon: "pi pi-home", label: "Inicio", href: "/admin/dashboard" },
        { icon: "pi pi-box", label: "Productos", href: "/admin/products" },
        { icon: "pi pi-th-large", label: "Categorías", href: "/admin/categories" },
        { icon: "pi pi-user", label: "Usuarios", href: "/admin/users" },
        { icon: "pi pi-shopping-cart", label: "Ventas", href: "/admin/sales-register" },
        { icon: "pi pi-key", label: "Key", href: "/admin/keys" },
        { icon: "pi pi-info-circle", label: "Ayuda e información", href: "/admin/help" },
        { icon: "pi pi-sign-out", label: "Cerrar sesión", href: "/logout" },
      ],
    };
  },
  methods: {
    handleMenuClick(item) {
      this.selectedItem = item.label;
      if (item.label === "Cerrar sesión") {
        this.logout();
      }
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
  },
};
</script>

<style>
.text-black {
  color: black;
}

.text-gray-500 {
  color: #7d7d7d;
}
</style>