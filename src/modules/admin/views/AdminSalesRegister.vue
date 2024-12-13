<template>
  <div class="grid grid-nogutter px-4 sm:px-6 lg:px-6">
    <div class="col-12 md:col-6 flex align-items-center py-2">
      <p class="text-lg font-bold">Administración de ventas</p>
    </div>
    <div class="col-12">
      <div>
        <DataTable
          :value="orders"
          :paginator="true"
          :rows="5"
          dataKey="orderNumber"
          responsiveLayout="scroll"
          :filters="filters"
          filterDisplay="menu"
        >
          <template #header>
            <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Buscar pedido"
                />
              </span>
            </div>
          </template>

          <Column field="numOrder" header="No. Pedido" :sortable="true" />
          <Column field="dateOrder" header="Fecha" :sortable="true" />
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
          <Column header="Acciones">
            <template #body="{ data }">
              <Button
                icon="pi pi-eye"
                class="p-button-rounded p-button-text"
                @click="handleRowClick(data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import AdminServices from "../services/AdminServices";
import Utils from "@/core/utils/FunctionGlobals";

export default {
  components: {
    Button,
    DataTable,
    Column,
    InputText,
  },
  data() {
    return {
      categories: [],
      filters: {
        global: { value: null },
      },
      selectedCategory: null,
      isEditModalVisible: false,
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
        const response = await AdminServices.getAllOrders();
        this.orders = response.data.map((order) => ({
          ...order,
          dateOrder: Utils.formatDate(order.dateOrder),
        }));
      } catch (error) {
        this.$toast.error("Error al obtener los pedidos");
      }
    },
    handleRowClick(order) {
      sessionStorage.setItem("selectedOrder", JSON.stringify(order));
      this.$router.push({
        name: "details-sales",
        params: { numOrder: order.numOrder},
      });
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>

<style scoped>
.p-button {
  border-radius: 100px !important;
}
</style>