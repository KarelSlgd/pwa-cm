<template>
  <div class="h-auto">
    <!-- Contenedor de tarjetas -->
    <div class="grid grid-nogutter">
      <div class="col-12 md:col-4 px-6 py-3">
        <DashboardCard title="Usuarios" :count="countUsers" icon="pi pi-user" />
      </div>
      <div class="col-12 md:col-4 px-6 py-3">
        <DashboardCard
          title="Productos"
          :count="countProducts"
          icon="pi pi-box"
        />
      </div>
      <div class="col-12 md:col-4 px-6 py-3">
        <DashboardCard
          title="Pedidos"
          :count="countOrders"
          icon="pi pi-shopping-cart"
        />
      </div>
    </div>

    <!-- Tabla de ventas recientes -->
    <div class="grid grid-nogutter px-6">
      <div class="col-12">
        <p class="text-lg font-bold my-6">Ventas recientes</p>
        <RecentSalesTable />
      </div>
    </div>
  </div>
</template>

<script>
import DashboardCard from "../components/DashboardCard.vue";
import RecentSalesTable from "../components/RecentSalesTable.vue";
import AdminServices from "@/modules/admin/services/AdminServices";

export default {
  components: {
    DashboardCard,
    RecentSalesTable,
  },
  data() {
    return {
      countProducts: 0,
      countOrders: 0,
      countUsers: 0,
    };
  },
  methods: {
    async getCountProducts() {
      try {
        const response = await AdminServices.getCountProducts();
        const { data, statusCode } = response;
        if (statusCode === 200) {
          this.countProducts = data;
        }
      } catch (error) {
        this.$toast.error("Error al obtener los productos");
      }
    },
    async getCountOrders() {
      try {
        const response = await AdminServices.getCountOrders();
        const { data, statusCode } = response;
        if (statusCode === 200) {
          this.countOrders = data;
        }
      } catch (error) {
        this.$toast.error("Error al obtener los pedidos");
      }
    },
    async getCountUsers() {
      try {
        const response = await AdminServices.getCountUsers();
        const { data, statusCode } = response;
        if (statusCode === 200) {
          this.countUsers = data;
        }
      } catch (error) {
        this.$toast.error("Error al obtener los usuarios");
      }
    },
  },
  mounted() {
    this.getCountProducts();
    this.getCountOrders();
    this.getCountUsers();
  },
};
</script>
