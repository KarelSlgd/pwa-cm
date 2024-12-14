<template>
  <div class="grid grid-nogutter px-4 sm:px-6 lg:px-6">
    <div class="col-12 md:col-6 flex align-items-center py-2">
      <p class="text-lg font-bold">Administrar Categorías</p>
    </div>
    <div class="col-12 md:col-6 flex justify-content-end py-4">
      <Button class="" style="border-radius: 6px !important" @click="openModal">
        Agregar
      </Button>
    </div>
    <AddCategoryModal :visible.sync="modalVisible" @refresh="getCategories" />

    <div class="col-12">
      <div>
        <DataTable :value="categories" :paginator="true" :rows="5" dataKey="categoryName" :filters.sync="filters"
          filterDisplay="menu" responsiveLayout="scroll" :globalFilterFields="['categoryName', 'categoryDescription']">
          <template #header>
            <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Buscar categoría" />
              </span>
            </div>
          </template>


          <Column field="categoryName" header="Nombre" :sortable="true" />
          <Column field="categoryDescription" header="Descripción" :sortable="true">
            <template>
              <InputText placeholder="Buscar por descripción" class="p-column-filter" />
            </template>
          </Column>

          <Column header="Acciones">
            <template #body="{ data }">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="openEditModal(data)" />
              <Button icon='pi pi-times' class="p-button-rounded p-button-danger" @click="toggleStatus(data)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
    <EditCategoryModal :category="selectedCategory" v-if="selectedCategory" :visible.sync="isEditModalVisible"
      @update-category="updateCategory" @close="selectedCategory = null" />
  </div>
</template>

<script>
import AddCategoryModal from "../components/categories/AddCategoryModal.vue";
import EditCategoryModal from "../components/categories/EditCategoryModal.vue";
import AdminServices from "@/modules/admin/services/AdminServices";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export default {
  components: {
    AddCategoryModal,
    EditCategoryModal,
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
      modalVisible: false,
      pendingRequests: [],
      isOnline: navigator.onLine,
    };
  },
  methods: {
    async getCategories() {
      try {
        const response = await AdminServices.getAllCategories();
        const { data, statusCode } = response;
        if (statusCode === 200) {
          this.categories = data;
        }
      } catch (error) {
        this.$toast.error("Error al obtener las categorías");
      }
    },
    openEditModal(category) {
      this.selectedCategory = { ...category };
      this.isEditModalVisible = true;
    },
    async updateCategory() {
      try {
        await this.getCategories();
        this.isEditModalVisible = false;
        this.selectedCategory = null;
      } catch (error) {
        this.$toast.error("Error al actualizar la categoría");
      }
    },
    async toggleStatus(category) {
      if (!navigator.onLine) {
        // Sin conexión: almacenar la solicitud pendiente
        this.pendingRequests.push({
          action: "toggleStatus",
          data: category,
        });
        this.$toast.info(
          `Sin conexión. El estado de la categoría "${category.categoryName}" se actualizará automáticamente al restablecer la conexión.`
        );
        return;
      }
      // Con conexión: realizar la operación
      await this.executeToggleStatus(category);
    },
    async executeToggleStatus(category) {
      try {
        const response = await AdminServices.deleteCategory(
          category.categoryName
        );
        const { statusCode, message } = response;
        if (statusCode === 200) {
          this.getCategories();
          this.$toast.success(message);
        } else {
          this.$toast.error(message);
        }
      } catch (error) {
        this.$toast.error("Error al actualizar la categoría");
      }
    },
    async processPendingRequests() {
      for (const request of this.pendingRequests) {
        if (request.action === "toggleStatus") {
          await this.executeToggleStatus(request.data);
        }
      }
      this.pendingRequests = [];
    },
    async deleteCategory(name, status) {
      if (!navigator.onLine) {
        // Sin conexión: almacenar la solicitud pendiente
        this.pendingRequests.push({
          action: "deleteCategory",
          data: { name, status },
        });
        this.$toast.info(
          `Sin conexión. La eliminación de la categoría "${name}" se realizará automáticamente al restablecer la conexión.`
        );
        return;
      }
      // Con conexión: realizar la operación
      await this.executeDeleteCategory(name, status);
    },
    async executeDeleteCategory(name, status) {
      try {
        await AdminServices.deleteCategory(name, status);
        this.getCategories();
        this.$toast.success("Categoría eliminada correctamente.");
      } catch (error) {
        this.$toast.error("Error al eliminar la categoría");
      }
    },
    openModal() {
      this.modalVisible = true;
    },
    updateOnlineStatus() {
      this.isOnline = navigator.onLine;
    },
  },

  watch: {
    isOnline(newStatus) {
      console.log(newStatus)
      if (newStatus) {
        setTimeout(() => {
          this.getCategories();
        }, 2000);
      } else {
        this.$toast.info("Conexión perdida. Modo offline.");
      }
    },
  },
  mounted() {
    this.getCategories();
    window.addEventListener("online", this.processPendingRequests);
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
  },
  beforeDestroy() {
    window.addEventListener("online", this.processPendingRequests);
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
  },

};
</script>

<style scoped>
.p-button {
  border-radius: 100px !important;
}
</style>