<template>
  <div class="grid grid-nogutter px-4 sm:px-6 lg:px-6">
    <div class="col-12 md:col-6 flex align-items-center py-2">
      <p class="text-lg font-bold">Administrar productos</p>
    </div>
    <div class="col-12 md:col-6 flex justify-content-end py-2">
      <AddProductModal @product-added="refreshTable" />
    </div>
    <div class="col-12">
      <div>
        <DataTable
          :value="products"
          :paginator="true"
          :rows="5"
          dataKey="numProduct"
          :filters.sync="filters"
          filterDisplay="menu"
          responsiveLayout="scroll"
          :globalFilterFields="['numProduct', 'name', 'categories']"
          ariaLabel="Tabla de productos"
        >
          <template #header>
            <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Buscar producto"
                />
              </span>
            </div>
          </template>

          <Column field="numProduct" header="Código" :sortable="true" />
          <Column field="name" header="Nombre" :sortable="true">
            <template>
              <InputText placeholder="Search by name" class="p-column-filter" />
            </template>
          </Column>
          <Column field="categories" header="Categorías" :sortable="true">
            <template>
              <InputText
                placeholder="Search by category"
                class="p-column-filter"
              />
            </template>
          </Column>
          <Column field="reviews" header="Reseñas" :sortable="true">
            <template #body="{ data }">
              <Rating :value="data.reviews" :readOnly="true" :cancel="false" />
            </template>
          </Column>

          <Column header="Acciones">
            <template #body="{ data }">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="openEditModal(data)"
              />
              <Button
                :icon="data.status === 'enable' ? 'pi pi-check' : 'pi pi-times'"
                class="p-button-rounded mr-2"
                :class="
                  data.status === 'enable'
                    ? 'p-button-success'
                    : 'p-button-danger'
                "
                @click="toggleStatus(data)"
              />
              <Button
                icon="pi pi-eye"
                class="p-button-rounded p-button-info"
                @click="handleRowClick(data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
    <EditProductModalVue
      :numProduct="selectedProduct?.numProduct"
      v-if="selectedProduct"
      :visible.sync="isEditModalVisible"
      @close="selectedProduct = null"
      @product-updated="handleProductUpdated"
    />
  </div>
</template>

<script>
import AddProductModal from "../components/products/AddProductModal.vue";
import EditProductModalVue from "../components/products/EditProductModal.vue";
import AdminServices from "@/modules/admin/services/AdminServices";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Rating from "primevue/rating";

export default {
  components: {
    AddProductModal,
    EditProductModalVue,
    Button,
    DataTable,
    Column,
    InputText,
    Rating,
  },
  data() {
    return {
      products: [],
      filters: {
        global: { value: null },
        name: { value: null, matchMode: "contains" },
        categories: { value: null, matchMode: "contains" },
      },
      selectedProduct: null,
      isEditModalVisible: false,
    };
  },
  methods: {
    openEditModal(product) {
      this.selectedProduct = product;
      this.isEditModalVisible = true;
    },
    async getProduct() {
      try {
        const response = await AdminServices.getProducts();
        const { data, statusCode } = response;
        if (statusCode === 200) {
          this.products = data.map((product) => ({
            ...product,
            categories: product.categories.join(", "),
            reviews: product.avgRating,
          }));
        }
      } catch (error) {
        this.$toast.error("Error al obtener los productos");
      }
    },
    handleRowClick(product) {
      sessionStorage.setItem("selectedProduct", JSON.stringify(product));
      this.$router.push({
        name: "productvariants",
        params: { numProduct: product.numProduct },
      });
    },
    handleProductUpdated() {
      this.refreshTable();
      this.isEditModalVisible = false;
      this.selectedProduct = null;
    },
    refreshTable() {
      this.getProduct();
    },
    async toggleStatus(product) {
      try {
        const newStatus = product.status === "enable" ? "disabled" : "enable";

        const response = await AdminServices.updateStatusProduct(
          product.numProduct,
          newStatus
        );

        const { statusCode, message } = response;
        if (statusCode === 200) {
          this.$toast.success(message);
        } else {
          this.$toast.error(message);
        }

        this.refreshTable();
      } catch (error) {
        this.$toast.error("Error al cambiar el estado del producto");
      }
    },
  },
  mounted() {
    this.getProduct();
  },
};
</script>

<style scoped>
.p-button {
  border-radius: 100px !important;
}
</style>