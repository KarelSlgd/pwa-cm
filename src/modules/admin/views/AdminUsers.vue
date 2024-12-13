<template>
  <div class="grid grid-nogutter px-4 sm:px-6 lg:px-6">
    <div class="col-12 md:col-6 flex align-items-center py-2">
      <p class="text-lg font-bold">Administración de usuarios</p>
    </div>
    <div class="col-12">
      <div>
        <DataTable
          :value="users"
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
                  placeholder="Buscar usuario"
                />
              </span>
            </div>
          </template>

          <Column field="nombre" header="Nombre" :sortable="true" />
          <Column field="apellidos" header="Apellidos"></Column>
          <Column field="email" header="Correo electrónico"></Column>
          <Column header="Estado">
            <template #body="{ data }">
              <Button
                :icon="
                  data.status.statusName === 'enable'
                    ? 'pi pi-check'
                    : 'pi pi-times'
                "
                class="p-button-rounded"
                :class="
                  data.status.statusName === 'enable'
                    ? 'p-button-success'
                    : 'p-button-danger'
                "
                @click="toggleStatus(data)"
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

export default {
  components: {
    Button,
    DataTable,
    Column,
    InputText,
  },
  data() {
    return {
      filters: {
        global: { value: null },
      },
      users: [],
    };
  },

  methods: {
    async getUsers() {
      try {
        const response = await AdminServices.getAllUsers();
        const { data, statusCode } = response;
        if (statusCode === 200) {
          this.users = data.map((user) => ({
            nombre: user.userInfo?.name || "N/A",
            apellidos:
              `${user.userInfo?.lastname || ""} ${
                user.userInfo?.surname || ""
              }`.trim() || "N/A",
            email: user.email || "N/A",
            status: user.status || "N/A",
          }));
        }
      } catch (error) {
        this.$toast.error("Error al obtener los pedidos");
      }
    },
    async toggleStatus(user) {
      try {
        const newStatus =
          user.status.statusName === "enable" ? "disabled" : "enable";
        const response = await AdminServices.updateStatusUser(
          user.email,
          newStatus
        );
        const { statusCode, message } = response;
        if (statusCode === 200) {
          const userIndex = this.users.findIndex((u) => u.email === user.email);
          if (userIndex !== -1) {
            this.users[userIndex].status = { statusName: newStatus };
          }
          this.$toast.success(message);
        } else {
          this.$toast.error(message);
        }
      } catch (error) {
        this.$toast.error("Error al cambiar el estado.");
      }
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>

<style scoped>
.p-button {
  border-radius: 100px !important;
}
</style>