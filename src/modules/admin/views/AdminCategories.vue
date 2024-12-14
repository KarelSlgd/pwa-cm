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
        // Obtener categorías desde PouchDB
        const result = await window._pouch_fetchesGet.allDocs({
          include_docs: true,
        });
        this.categories = result.rows.map((row) => row.doc);
      } catch (error) {
        this.$toast.error("Error al obtener las categorías desde el caché.");
      }
    },
    async saveCategoryLocally(category) {
      try {
        await window._pouch_fetchesGet.put({ ...category, _id: category._id || new Date().toISOString() });
      } catch (error) {
        this.$toast.error("Error al guardar la categoría en caché.");
      }
    },
    async deleteCategoryLocally(id) {
      try {
        const doc = await window._pouch_fetchesGet.get(id);
        await window._pouch_fetchesGet.remove(doc);
      } catch (error) {
        this.$toast.error("Error al eliminar la categoría en caché.");
      }
    },
    openEditModal(category) {
      this.selectedCategory = { ...category };
      this.isEditModalVisible = true;
    },
    async updateCategoryLocally(category) {
      await this.saveCategoryLocally(category);
      this.getCategories();
    },
    async createCategory(category) {
      if (!navigator.onLine) {
        // Guardar en caché si no hay conexión
        category.status = "pending";
        await this.saveCategoryLocally(category);
        this.$toast.info("Categoría creada en modo offline.");
        return;
      }
      try {
        const response = await AdminServices.addCategory(category);
        if (response.statusCode === 201) {
          this.$toast.success("Categoría creada exitosamente.");
          this.getCategories();
        }
      } catch (error) {
        this.$toast.error("Error al crear la categoría.");
      }
    },
    async toggleStatus(category) {
      if (!navigator.onLine) {
        category.status = category.status === "active" ? "inactive" : "active";
        await this.saveCategoryLocally(category);
        this.$toast.info(
          `Estado de la categoría "${category.categoryName}" cambiado en modo offline.`
        );
        return;
      }
      try {
        const response = await AdminServices.toggleCategoryStatus(category);
        if (response.statusCode === 200) {
          this.getCategories();
          this.$toast.success("Estado de categoría actualizado.");
        }
      } catch (error) {
        this.$toast.error("Error al actualizar el estado de la categoría.");
      }
    },
    async processPendingRequests() {
      const result = await window._pouch_fetchesGet.allDocs({
        include_docs: true,
      });
      for (const doc of result.rows) {
        if (doc.doc.status === "pending") {
          try {
            // Sincronizar con el servidor
            const response = await AdminServices.addCategory(doc.doc);
            if (response.statusCode === 201) {
              await this.deleteCategoryLocally(doc.doc._id); // Eliminar del caché
            }
          } catch (error) {
            this.$toast.error(
              `Error al sincronizar categoría "${doc.doc.categoryName}".`
            );
          }
        }
      }
      this.getCategories();
    },
  },
  watch: {
    isOnline(newStatus) {
      if (newStatus) {
        this.$toast.success("Conexión restaurada. Sincronizando datos...");
        this.processPendingRequests();
      } else {
        this.$toast.info("Conexión perdida. Modo offline activado.");
      }
    },
  },
  mounted() {
    this.getCategories();
    window._pouch_fetchesGet
      .changes({ live: true, since: "now", include_docs: true })
      .on("change", () => {
        this.getCategories();
      });
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
  },
  beforeDestroy() {
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