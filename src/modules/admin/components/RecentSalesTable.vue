<template>
  <div>
    <DataTable
      :value="orders"
      :paginator="true"
      :rows="5"
      responsiveLayout="scroll"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
      ariaLabel="Tabla de pedidos con información detallada sobre órdenes"
    >
      <Column field="name" header="Nombre" sortable></Column>
      <Column field="productQuantity" header="Productos" sortable></Column>
      <Column field="total" header="Total" sortable></Column>
      <Column field="dateOrder" header="Fecha" sortable></Column>
      <Column field="status" header="Estado" sortable>
        <template #body="slotProps">
          <span
            class="status-badge font-bold"
            :style="statusStyles[slotProps.data.status]"
          >
            {{ statusTexts[slotProps.data.status] || "Desconocido" }}
          </span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import AdminServices from "@/modules/admin/services/AdminServices";
import Utils from "@/core/utils/FunctionGlobals";
export default {
  components: {
    DataTable,
    Column,
  },
  data() {
    return {
      orders: [],
      statusTexts: {
        accepted: "Aceptado",
        in_progress: "En Proceso",
        sent: "Enviado",
        delivered: "Entregado",
        pending_payment: "Pago Pendiente",
      },
      statusStyles: {
        accepted: { backgroundColor: "#c9fdd4" },
        in_progress: { backgroundColor: "#fff3cd" },
        sent: { backgroundColor: "#ddc9fd" },
        delivered: { backgroundColor: "#c9e1fd" },
        pending_payment: { backgroundColor: "#fdc9c9" },
      },
    };
  },
  methods: {
    async getOrders() {
      try {
        const response = await AdminServices.getReportOrders();
        const { data, statusCode } = response;

        if (statusCode === 200) {
          this.orders = data.map((order) => ({
            ...order,
            dateOrder: Utils.formatDate(order.dateOrder),
          }));
        }
      } catch (error) {
        this.$toast.error("Error al obtener los pedidos");
      }
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>

<style scoped>
.status-badge {
  padding: 0.5em 1em;
  border-radius: 10px;
  width: 80%;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  margin: 0 auto;
}
</style>
