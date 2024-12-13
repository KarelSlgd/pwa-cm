<template>
  <div>
    <Dialog header="Crear Categoría" :visible.sync="localVisible" :containerStyle="{ width: '50vw' }" class="font-bold"
      @hide="closeModal" modal closable>
      <div class="p-fluid">
        <div class="field">
          <label for="categoryName">Nombre de la Categoría</label>
          <InputText id="categoryName" v-model="categoryName" placeholder="Ingrese el nombre de la categoría"
            :class="{ 'p-invalid': isCategoryNameInvalid }" @blur="validateCategoryName" />
          <small v-if="isCategoryNameInvalid" class="p-error">
            El nombre de la categoría es obligatorio y debe tener menos de 100
            caracteres.
          </small>
        </div>
        <div class="field">
          <label for="categoryDescription">Descripción</label>
          <Textarea id="categoryDescription" v-model="categoryDescription" placeholder="Ingrese una descripción"
            rows="4" />
        </div>
      </div>
      <div class="test">
        <Button style="width: 150px;" label="Cancelar" @click="closeModal" class="p-button-text p-button-secondary" />
        <Button style="width: 150px;" label="Registrar" class="p-button" @click="submitForm" :loading="isLoading"
          :disabled="isLoading" />
      </div>
    </Dialog>
  </div>
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
  },
  data() {
    return {
      localVisible: this.visible,
      categoryName: "",
      categoryDescription: "",
      isCategoryNameInvalid: false,
      isLoading: false,
      pendingRequests: [],
    };
  },
  methods: {
    closeModal() {
      this.localVisible = false;
      this.$emit("update:visible", false);
      this.resetForm();
    },
    resetForm() {
      this.categoryName = "";
      this.categoryDescription = "";
      this.isCategoryNameInvalid = false;
    },
    validateCategoryName() {
      this.isCategoryNameInvalid =
        !this.categoryName || this.categoryName.length > 100;
    },
    async submitForm() {
      this.isLoading = true;
      this.validateCategoryName();

      if (this.isCategoryNameInvalid) {
        this.isLoading = false;
        return;
      }

      if (!navigator.onLine) {
        // Sin conexión: cerrar modal y agregar a solicitudes pendientes
        this.pendingRequests.push({
          categoryName: this.categoryName,
          categoryDescription: this.categoryDescription,
        });
        this.$toast.info(
          "Sin conexión. La categoría se registrará automáticamente cuando vuelva la conexión."
        );
        this.closeModal();
        this.isLoading = false;
      } else {
        // Con conexión: intentar enviar la solicitud
        this.addCategory();
      }
    },
    async addCategory() {
      try {
        const response = await AdminServices.addCategory(
          this.categoryName,
          this.categoryDescription
        );
        const { statusCode, message } = response;
        if (statusCode === 201) {
          this.$emit("category-added");
          this.$emit("refresh");
          this.closeModal();
          this.$toast.success(message);
        } else {
          this.$toast.error(message);
        }
      } catch (error) {
        this.$toast.error("Error al registrar la categoría");
      } finally {
        this.isLoading = false;
      }
    },
    async processPendingRequests() {
      for (const request of this.pendingRequests) {
        try {
          await AdminServices.addCategory(
            request.categoryName,
            request.categoryDescription
          );
          this.$toast.success(
            `Categoría "${request.categoryName}" registrada exitosamente.`
          );
        } catch (error) {
          this.$toast.error(
            `Error al registrar la categoría "${request.categoryName}".`
          );
        }
      }
      this.pendingRequests = [];
    },
  },
  watch: {
    visible(newVal) {
      this.localVisible = newVal;
    },
  },
  created() {
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

.test {
  display: flex;
  justify-content: end;
  gap: 30px;
}
</style>
