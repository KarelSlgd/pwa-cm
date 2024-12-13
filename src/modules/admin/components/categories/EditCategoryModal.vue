<template>
  <Dialog header="Editar Categoría" :visible.sync="localVisible" :containerStyle="{ width: '50vw' }" class="font-bold"
    @hide="closeModal" modal closable>
    <div class="p-fluid">
      <div class="field">
        <label for="editCategoryName">Nombre de la Categoría</label>
        <InputText id="editCategoryName" v-model="localCategoryName" placeholder="Ingrese el nombre de la categoría"
          :class="{ 'p-invalid': isCategoryNameInvalid }" @blur="validateCategoryName" disabled />
        <small v-if="isCategoryNameInvalid" class="p-error">
          El nombre de la categoría es obligatorio y debe tener menos de 100
          caracteres.
        </small>
      </div>
      <div class="field">
        <label for="editCategoryDescription">Descripción</label>
        <Textarea id="editCategoryDescription" v-model="localCategoryDescription" placeholder="Ingrese una descripción"
          rows="4" />
      </div>
    </div>
    <template #footer>
      <Button label="Cancelar" @click="closeModal" class="p-button-text p-button-secondary" />
      <Button label="Guardar" class="p-button" @click="submitEdit" :loading="isLoading" :disabled="isLoading" />
    </template>
  </Dialog>
</template>
<script>
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import AdminServices from "@/modules/admin/services/AdminServices";

export default {
  components: {
    Dialog,
    InputText,
    Textarea,
    Button,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localVisible: this.visible,
      localCategoryName: "",
      localCategoryDescription: "",
      isCategoryNameInvalid: false,
      isLoading: false,
      pendingRequests: [],
    };
  },
  methods: {
    closeModal() {
      this.localVisible = false;
      this.$emit("update:visible", false);
    },
    validateCategoryName() {
      this.isCategoryNameInvalid =
        !this.localCategoryName || this.localCategoryName.length > 100;
    },
    async updateCategory(name, description) {
      try {
        const response = await AdminServices.updateCategory(name, description);
        const { statusCode, message } = response;
        if (statusCode === 201) {
          this.closeModal();
          this.$toast.success(message);
        } else {
          this.$toast.error(message);
        }
      } catch (error) {
        this.$toast.error("Error al actualizar la categoría");
      }
    },
    async submitEdit() {
      this.isLoading = true;
      this.validateCategoryName();

      if (this.isCategoryNameInvalid) {
        this.isLoading = false;
        return;
      }

      if (!navigator.onLine) {
        // Sin conexión: cerrar modal y agregar a solicitudes pendientes
        this.pendingRequests.push({
          categoryName: this.localCategoryName,
          categoryDescription: this.localCategoryDescription,
        });
        this.$toast.info(
          "Sin conexión. La categoría se actualizará automáticamente cuando vuelva la conexión."
        );
        this.closeModal();
        this.isLoading = false;
      } else {
        // Con conexión: intentar actualizar
        await this.updateCategory(
          this.localCategoryName,
          this.localCategoryDescription
        );
        this.$emit("update-category");
        this.isLoading = false;
      }
    },
    async processPendingRequests() {
      for (const request of this.pendingRequests) {
        try {
          await AdminServices.updateCategory(
            request.categoryName,
            request.categoryDescription
          );
          this.$toast.success(
            `Categoría "${request.categoryName}" actualizada exitosamente.`
          );
        } catch (error) {
          this.$toast.error(
            `Error al actualizar la categoría "${request.categoryName}".`
          );
        }
      }
      this.pendingRequests = [];
    },
    syncCategoryData() {
      if (this.category) {
        this.localCategoryName = this.category.categoryName || "";
        this.localCategoryDescription = this.category.categoryDescription || "";
      }
    },
  },
  watch: {
    visible(newVal) {
      this.localVisible = newVal;
      if (newVal) {
        this.syncCategoryData();
      }
    },
    category: {
      handler() {
        this.syncCategoryData();
      },
      deep: true,
    },
  },
  mounted() {
    this.syncCategoryData();
    window.addEventListener("online", this.processPendingRequests);
  },
  beforeDestroy() {
    window.removeEventListener("online", this.processPendingRequests);
  },
};
</script>


<style scoped>
.p-error {
  color: red;
}
</style>
