<template>
  <div>
    <Button class="p-button-primary" @click="openModal"> Agregar </Button>
    <Dialog
      class="font-bold"
      :containerStyle="{ width: '50vw' }"
      modal
      closable
      @hide="closeModal"
      header="Agregar producto"
      :visible.sync="visible"
    >
      <div class="p-fluid mt-3">
        <div class="field">
          <label for="product-name">Nombre</label>
          <InputText
            id="product-name"
            v-model="product.name"
            :class="{ 'p-invalid': !isNameValid && attemptedSubmit }"
          />
          <small v-if="!isNameValid && attemptedSubmit" class="p-error"
            >El nombre es obligatorio y debe tener menos de 100
            caracteres</small
          >
        </div>
        <div class="field">
          <label for="product-description">Descripción</label>
          <Textarea
            id="product-description"
            v-model="product.description"
            :class="{ 'p-invalid': !isDescriptionValid && attemptedSubmit }"
            rows="5"
            cols="30"
          />
          <small v-if="!isDescriptionValid && attemptedSubmit" class="p-error"
            >La descripción es obligatoria</small
          >
        </div>
        <div class="field">
          <label for="product-categories">Categorías</label>
          <MultiSelect
            id="product-categories"
            v-model="selectedCategories"
            :options="categories"
            optionLabel="categoryName"
            placeholder="Seleccione una categoría"
            display="chip"
            class="multi-select-overflow"
            :class="{ 'p-invalid': !isCategoryValid && attemptedSubmit }"
            appendTo="body"
          />
          <small v-if="!isCategoryValid && attemptedSubmit" class="p-error"
            >Seleccione al menos una categoría</small
          >
        </div>
      </div>
      <template #footer>
        <div class="flex justify-content-end gap-2 p-2">
          <Button
            label="Cancelar"
            @click="closeModal"
            class="p-button-text p-button-secondary"
          />
          <Button
            class="p-button"
            label="Registrar"
            :loading="isLoading"
            :disabled="isLoading"
            @click="saveProduct"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import MultiSelect from "primevue/multiselect";
import AdminServices from "@/modules/admin/services/AdminServices";

export default {
  components: {
    Dialog,
    InputText,
    Button,
    Textarea,
    MultiSelect,
  },
  data() {
    return {
      visible: false,
      product: {
        name: "",
        description: "",
      },
      selectedCategories: null,
      categories: [],
      attemptedSubmit: false,
      isLoading: false,
    };
  },
  computed: {
    isNameValid() {
      return this.product.name && this.product.name.length <= 100;
    },
    isDescriptionValid() {
      return this.product.description && this.product.description.trim() !== "";
    },
    isCategoryValid() {
      return this.selectedCategories && this.selectedCategories.length > 0;
    },
  },
  methods: {
    closeModal() {
      this.visible = false;
      this.resetForm();
    },
    openModal() {
      this.visible = true;
    },
    saveProduct() {
      this.attemptedSubmit = true;
      if (this.isNameValid && this.isDescriptionValid && this.isCategoryValid) {
        this.addProduct();
      }
    },
    resetForm() {
      this.product = {
        name: "",
        description: "",
      };
      this.selectedCategories = null;
      this.attemptedSubmit = false;
    },
    async getCategories() {
      try {
        const response = await AdminServices.getCategoriesByStatus();
        const { data, statusCode } = response;

        if (statusCode === 200) {
          this.categories = data;
        }
      } catch (error) {
        this.$toast.error("Error al obtener las categorías");
      }
    },
    async addProduct() {
      this.isLoading = true;
      try {
        const data = {
          nameProduct: this.product.name,
          productDescription: this.product.description,
          categoryName: this.selectedCategories.map(
            (category) => category.categoryName
          ),
        };
        const response = await AdminServices.addProduct(data);

        const { statusCode, message } = response;
        if (statusCode === 201) {
          this.$emit("product-added");
          this.closeModal();
          this.$toast.success(message);
        } else {
          this.$toast.error(message);
        }
      } catch (error) {
        this.$toast.error("Error al agregar el producto");
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.getCategories();
  },
};
</script>
