<template>
  <div class="flex w-full">
    <!-- Sidebar -->
    <div class="border-right-1 border-gray-300 p-3 flex-shrink-0 h-screen">
      <AdminSidebar :sidebarVisible="sidebarVisible" />
    </div>

    <!-- Contenedor principal (Navbar y Router View) -->
    <div class="w-full">
      <!-- Navbar (primera fila) -->
      <div>
        <AdminNavbar
          :sidebarVisible="sidebarVisible"
          :title="pageTitle"
          :subTitle="navbarSubTitle"
          @toggle-sidebar="toggleSidebar"
        />
      </div>

      <!-- Router View (segunda fila) -->
      <div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from "@/modules/admin/components/AdminSidebar.vue";
import AdminNavbar from "@/modules/admin/components/AdminNavbar.vue";

export default {
  components: { AdminNavbar, AdminSidebar },
  data() {
    return {
      sidebarVisible: true,
      pageTitle: "Inicio",
      navbarSubTitle: "",
    };
  },
  created() {
    this.$root.$on("updateNavbarSubtitle", (subtitle) => {
      this.navbarSubTitle = subtitle;
    });

    this.$router.beforeEach((to, from, next) => {
      this.navbarSubTitle = "";
      next();
    });
  },
  methods: {
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    },
  },
  watch: {
    $route() {
      this.pageTitle = this.$route.meta.title;
    },
  },
};
</script>

